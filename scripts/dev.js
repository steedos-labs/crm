#!/usr/bin/env node
/**
 * 一键开发启动脚本
 *
 * 通过 mongodb-memory-server / redis-memory-server 在 Node 进程内
 * 拉起内嵌的 MongoDB 与 Redis，再启动 Steedos，无需 Docker 或本地服务。
 *
 * 数据默认存放于 ./.steedos/dev-db ，进程退出不会清空，方便重启复用。
 * 设置环境变量 EPHEMERAL=1 可改为内存模式（退出即清空）。
 */

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { RedisMemoryServer } = require('redis-memory-server');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, '.steedos', 'dev-db');
const MONGO_PORT = process.env.DEV_MONGO_PORT ? Number(process.env.DEV_MONGO_PORT) : undefined;
const REDIS_PORT = process.env.DEV_REDIS_PORT ? Number(process.env.DEV_REDIS_PORT) : undefined;
const EPHEMERAL = process.env.EPHEMERAL === '1';

let mongo;
let redis;
let child;
let stopping = false;

async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  if (child && !child.killed) {
    try { child.kill('SIGTERM'); } catch {}
  }
  try { if (redis) await redis.stop(); } catch {}
  try { if (mongo) await mongo.stop(); } catch {}
  process.exit(code);
}

['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => stop(0)));
process.on('uncaughtException', (err) => { console.error(err); stop(1); });

(async () => {
  if (!EPHEMERAL) fs.mkdirSync(DATA_DIR, { recursive: true });

  console.log('▶ 启动内嵌 MongoDB ...');
  mongo = await MongoMemoryServer.create({
    instance: {
      ...(MONGO_PORT ? { port: MONGO_PORT } : {}),
      dbName: 'crm',
      ...(EPHEMERAL ? {} : { dbPath: DATA_DIR, storageEngine: 'wiredTiger' }),
    },
  });

  console.log('▶ 启动内嵌 Redis ...');
  redis = new RedisMemoryServer(REDIS_PORT ? { instance: { port: REDIS_PORT } } : {});
  await redis.start();
  const redisPort = await redis.getPort();

  const env = {
    ...process.env,
    MONGO_URL: mongo.getUri('crm'),
    TRANSPORTER: `redis://127.0.0.1:${redisPort}`,
    CACHER: `redis://127.0.0.1:${redisPort}/1`,
  };

  console.log(`✅ MongoDB: ${env.MONGO_URL}`);
  console.log(`✅ Redis:   ${env.TRANSPORTER}`);
  console.log('▶ 启动 Steedos ...');

  child = spawn('npx', ['--no-install', 'steedos', 'start'], {
    cwd: ROOT,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('exit', (code) => stop(code ?? 0));
})();
