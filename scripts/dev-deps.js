#!/usr/bin/env node
/**
 * 嵌入式开发依赖脚本
 *
 * 在 Node 进程内拉起 MongoDB（副本集，支持事务）+ Redis，并把连接地址
 * 写入 .env.local，方便 `pnpm dev` / `pnpm start` 直接使用。
 *
 * 使用方式：
 *   pnpm dev:deps           前台运行，Ctrl+C 退出后自动清理 .env.local
 *
 * 数据持久化到 ./.steedos/dev-db ，进程退出不会清空，方便重启复用。
 * 设置环境变量 EPHEMERAL=1 可改为内存模式（退出即清空）。
 *
 * 端口可通过 DEV_MONGO_PORT / DEV_REDIS_PORT 覆盖；默认 27027 / 6399，
 * 与官方默认端口（27017 / 6379）错开，避免与本地已有服务冲突。
 */

const path = require('path');
const fs = require('fs');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const { RedisMemoryServer } = require('redis-memory-server');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, '.steedos', 'dev-db');
const ENV_LOCAL = path.join(ROOT, '.env.local');
const ENV_MARK_BEGIN = '# >>> pnpm dev:deps managed >>>';
const ENV_MARK_END = '# <<< pnpm dev:deps managed <<<';

const MONGO_PORT = Number(process.env.DEV_MONGO_PORT || 27027);
const REDIS_PORT = Number(process.env.DEV_REDIS_PORT || 6399);
const EPHEMERAL = process.env.EPHEMERAL === '1';

let mongo;
let redis;
let stopping = false;

function writeEnvLocal(vars) {
  const block = [
    ENV_MARK_BEGIN,
    ...Object.entries(vars).map(([k, v]) => `${k}=${v}`),
    ENV_MARK_END,
    '',
  ].join('\n');

  let existing = '';
  try { existing = fs.readFileSync(ENV_LOCAL, 'utf8'); } catch {}
  const stripped = existing.replace(
    new RegExp(`${ENV_MARK_BEGIN}[\\s\\S]*?${ENV_MARK_END}\\n?`, 'g'),
    '',
  );
  fs.writeFileSync(ENV_LOCAL, (stripped ? stripped.trimEnd() + '\n\n' : '') + block);
}

function clearEnvLocalBlock() {
  let existing = '';
  try { existing = fs.readFileSync(ENV_LOCAL, 'utf8'); } catch { return; }
  const stripped = existing.replace(
    new RegExp(`${ENV_MARK_BEGIN}[\\s\\S]*?${ENV_MARK_END}\\n?`, 'g'),
    '',
  ).trimEnd();
  if (stripped) {
    fs.writeFileSync(ENV_LOCAL, stripped + '\n');
  } else {
    try { fs.unlinkSync(ENV_LOCAL); } catch {}
  }
}

async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  console.log('\n▶ 正在停止依赖 ...');
  clearEnvLocalBlock();
  try { if (redis) await redis.stop(); } catch {}
  try { if (mongo) await mongo.stop(); } catch {}
  process.exit(code);
}

['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => stop(0)));
process.on('uncaughtException', (err) => { console.error(err); stop(1); });

(async () => {
  if (!EPHEMERAL) fs.mkdirSync(DATA_DIR, { recursive: true });

  console.log('▶ 启动内嵌 MongoDB（副本集，支持事务） ...');
  mongo = await MongoMemoryReplSet.create({
    replSet: {
      count: 1,
      storageEngine: 'wiredTiger',
      dbName: 'crm',
    },
    instanceOpts: [
      {
        port: MONGO_PORT,
        ...(EPHEMERAL ? {} : { dbPath: DATA_DIR }),
      },
    ],
  });

  console.log('▶ 启动内嵌 Redis ...');
  redis = new RedisMemoryServer({ instance: { port: REDIS_PORT } });
  await redis.start();
  const redisPort = await redis.getPort();

  const mongoUrl = mongo.getUri('crm');
  const transporter = `redis://127.0.0.1:${redisPort}`;
  const cacher = `redis://127.0.0.1:${redisPort}/1`;

  writeEnvLocal({
    MONGO_URL: mongoUrl,
    TRANSPORTER: transporter,
    CACHER: cacher,
  });

  console.log('');
  console.log(`✅ MongoDB: ${mongoUrl}`);
  console.log(`✅ Redis:   ${transporter}`);
  console.log(`✅ 已写入 ${path.relative(ROOT, ENV_LOCAL)}（pnpm dev / pnpm start 会自动读取）`);
  console.log('');
  console.log('提示：另开一个终端执行 `pnpm dev` 或 `pnpm start` 启动 Steedos。');
  console.log('按 Ctrl+C 停止依赖（会自动清理 .env.local 中的托管段）。');
})();
