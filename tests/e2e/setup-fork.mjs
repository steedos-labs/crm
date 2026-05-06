import { beforeAll, afterAll } from 'vitest';
import { startServer, stopServer } from './helpers/server.mjs';
import { register, createTenant } from './helpers/auth.mjs';
import { setState, clearState } from './helpers/state.mjs';

const g = globalThis;

beforeAll(async () => {
  if (g.__E2E_BOOTSTRAPPED__) return;
  g.__E2E_BOOTSTRAPPED__ = 'starting';
  clearState();

  const { baseUrl } = await startServer();
  process.env.E2E_BASE_URL = baseUrl;
  setState('E2E_BASE_URL', baseUrl);

  const email = `e2e-${Date.now()}@test.local`;
  const password = 'Pass1234!';
  const reg = await register({ baseUrl, email, password, name: 'E2E Bootstrap User' });
  process.env.E2E_EMAIL = email;
  process.env.E2E_PASSWORD = password;
  process.env.E2E_TOKEN = reg.token;
  process.env.E2E_USER_ID = reg.user._id;
  setState('E2E_EMAIL', email);
  setState('E2E_PASSWORD', password);
  setState('E2E_TOKEN', reg.token);
  setState('E2E_USER_ID', reg.user._id);

  const space = await createTenant({ baseUrl, token: reg.token, name: 'E2E Tenant' });
  process.env.E2E_SPACE_ID = space._id;
  setState('E2E_SPACE_ID', space._id);

  // 给后端留时间让新建空间相关元数据/权限就位
  await new Promise((r) => setTimeout(r, 2000));

  g.__E2E_BOOTSTRAPPED__ = 'ready';
}, 360_000);

afterAll(async () => {
  await stopServer();
}, 60_000);
