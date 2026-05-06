import { describe, it, expect } from 'vitest';
import { api } from '../helpers/api.mjs';
import { login } from '../helpers/auth.mjs';

describe('00 账户与租户', () => {
  it('setup 已注册账户并创建租户，环境变量齐全', () => {
    expect(process.env.E2E_BASE_URL).toMatch(/^http:\/\//);
    expect(process.env.E2E_TOKEN).toBeTruthy();
    expect(process.env.E2E_USER_ID).toBeTruthy();
    expect(process.env.E2E_SPACE_ID).toBeTruthy();
  });

  it('使用注册账户可以再次登录', async () => {
    const res = await login({
      baseUrl: process.env.E2E_BASE_URL,
      email: process.env.E2E_EMAIL,
      password: process.env.E2E_PASSWORD,
    });
    expect(res.token).toBeTruthy();
    expect(res.user._id).toBe(process.env.E2E_USER_ID);
  });

  it('GET /api/v6/users/me 返回当前用户', async () => {
    const me = await api().get('/api/v6/users/me');
    expect(me).toBeTruthy();
    expect(me._id || me.id).toBeTruthy();
  });
});
