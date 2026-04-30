#!/usr/bin/env node
/**
 * MongoDB 连通性烟雾测试。
 *
 * 仅校验 MONGO_URL 指向的 MongoDB 实例端口可达，作为「完整环境是否就绪」的最小信号。
 * 不依赖 mongodb 驱动，便于在尚未执行 `pnpm install` 的环境（如冷启动 CI）中运行。
 *
 * 用法：
 *   MONGO_URL=mongodb://127.0.0.1:27017/crm node scripts/test-mongo.js
 *   pnpm test:mongo
 *
 * 退出码：
 *   0  - 端口可达
 *   1  - 连接失败或超时
 *   2  - 未提供 MONGO_URL 且无默认值
 */

'use strict';

const net = require('net');

const DEFAULT_URL = 'mongodb://127.0.0.1:27017/crm';
const url = process.env.MONGO_URL || DEFAULT_URL;
const TIMEOUT_MS = Number(process.env.MONGO_PING_TIMEOUT_MS || 5000);

function parseMongoUrl(raw) {
  // 支持 mongodb:// 与 mongodb+srv://，仅取首个 host:port。
  const m = /^mongodb(?:\+srv)?:\/\/(?:[^@/]*@)?([^/?,]+)/.exec(raw);
  if (!m) throw new Error(`无法解析 MONGO_URL: ${raw}`);
  const hostPort = m[1];
  const idx = hostPort.lastIndexOf(':');
  if (idx === -1) return { host: hostPort, port: 27017 };
  return { host: hostPort.slice(0, idx), port: Number(hostPort.slice(idx + 1)) };
}

function ping({ host, port }, timeoutMs) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error(`连接 ${host}:${port} 超时（${timeoutMs}ms）`));
    }, timeoutMs);

    socket.once('connect', () => {
      clearTimeout(timer);
      socket.end();
      resolve();
    });
    socket.once('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    socket.connect(port, host);
  });
}

(async () => {
  let target;
  try {
    target = parseMongoUrl(url);
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exit(2);
  }

  console.log(`检查 MongoDB 连通性: ${target.host}:${target.port}（来自 MONGO_URL）`);
  try {
    await ping(target, TIMEOUT_MS);
    console.log('✓ MongoDB 端口可达');
    process.exit(0);
  } catch (err) {
    console.error(`✗ MongoDB 不可达: ${err.message}`);
    console.error('  请确认本地已通过 `docker compose up -d mongo` 或 CI services 启动 MongoDB。');
    process.exit(1);
  }
})();
