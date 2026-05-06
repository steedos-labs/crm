import path from 'node:path';
import net from 'node:net';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { RedisMemoryServer } from 'redis-memory-server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let state = null;

function findFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

function killProcessGroup(child) {
  if (!child || child.killed) return;
  try { child.kill('SIGTERM'); } catch {}
  setTimeout(() => {
    try { child.kill('SIGKILL'); } catch {}
  }, 1500).unref();
}

export async function startServer({ port } = {}) {
  if (state) return state;

  const finalPort = port || Number(process.env.E2E_PORT) || (await findFreePort());

  const mongo = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });
  const redis = new RedisMemoryServer();
  await redis.start();
  const redisPort = await redis.getPort();
  const mongoUri = mongo.getUri('crm_e2e');
  const transporter = `redis://127.0.0.1:${redisPort}`;

  const env = {
    ...process.env,
    MONGO_URL: mongoUri,
    TRANSPORTER: transporter,
    CACHER: `${transporter}/2`,
    PORT: String(finalPort),
    ROOT_URL: `http://localhost:${finalPort}`,
    STEEDOS_LOG_LEVEL: 'error',
    B6_LOG_LEVEL: 'error',
    // 不要设置 STEEDOS_TENANT_ENABLE_SAAS：开启 SaaS 模式且无 license 时 server 会立即退出。
    // 不需要 STEEDOS_TENANT_ENABLE_REGISTER：当 spaces 集合为空时 server 自身会把 enable_register
    // 与 enable_create_tenant 都置为 true（见 @steedos/server app.moleculer.js）。
  };

  const cwd = path.resolve(__dirname, '..', '..', '..');
  const logDir = path.resolve(cwd, '.steedos');
  try { fs.mkdirSync(logDir, { recursive: true }); } catch {}
  const logPath = path.join(logDir, 'e2e-server.log');
  // 注意：使用文件描述符或全 ignore 时 steedos-cli 在某些环境会立即退出 0；
  // 与 `pnpm dev` 一致地用 pipe，再自行落盘到文件，可避免该问题。
  const logStream = fs.createWriteStream(logPath, { flags: 'w' });
  const child = spawn('npx', ['--no-install', 'steedos', 'start'], {
    cwd,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    // detached 会让 npx 在某些场景脱离 child 后立刻退出，导致 steedos 也被收割。
    // 我们改为不 detach，并在父进程退出/收到信号时显式杀掉 child。
    detached: false,
  });
  child.stdout.pipe(logStream);
  child.stderr.pipe(logStream);

  let output = '';
  const refreshOutput = () => {
    try { output = fs.readFileSync(logPath, 'utf8').slice(-8000); } catch {}
  };

  let exited = false;
  child.on('exit', (code, sig) => {
    exited = true;
    refreshOutput();
    console.error(`[e2e] steedos exited code=${code} sig=${sig}\nlog: ${logPath}\n${output}`);
  });

  process.once('SIGINT', () => { killProcessGroup(child); process.exit(130); });
  process.once('SIGTERM', () => { killProcessGroup(child); process.exit(143); });

  const baseUrl = `http://127.0.0.1:${finalPort}`;
  const cleanup = async () => {
    killProcessGroup(child);
    await new Promise((r) => setTimeout(r, 500));
    try { await redis.stop(); } catch {}
    try { await mongo.stop(); } catch {}
  };

  // 等待 health
  const t0 = Date.now();
  while (Date.now() - t0 < 240_000) {
    if (exited) {
      await cleanup();
      refreshOutput();
      throw new Error('Steedos process exited during startup. Output tail:\n' + output);
    }
    try {
      const r = await fetch(`${baseUrl}/api/health_check`);
      if (r.ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }

  // 等待 objectql 把 space_users 等基础对象加载完成
  const t1 = Date.now();
  let ready = false;
  while (Date.now() - t1 < 240_000) {
    if (exited) {
      await cleanup();
      refreshOutput();
      throw new Error('Steedos process exited during startup. Output tail:\n' + output);
    }
    try {
      const r = await fetch(`${baseUrl}/accounts/password/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ user: { email: 'readiness@probe.local' }, password: 'x' }),
      });
      const text = await r.text();
      if (!/is not found/i.test(text) && !/Service '.*' is not available/i.test(text)) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 1500));
  }
  if (!ready) {
    await cleanup();
    refreshOutput();
    throw new Error('Accounts/objectql not ready in 240s. Output tail:\n' + output);
  }

  state = { baseUrl, port: finalPort, mongo, redis, child, logPath };
  return state;
}

export async function stopServer() {
  if (!state) return;
  killProcessGroup(state.child);
  await new Promise((r) => setTimeout(r, 800));
  try { await state.redis.stop(); } catch {}
  try { await state.mongo.stop(); } catch {}
  state = null;
}
