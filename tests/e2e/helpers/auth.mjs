const TRANSIENT = /is not found|is not available|ECONNREFUSED|fetch failed|SERVICE_NOT_FOUND|Cannot POST|Cannot GET|unenableRegister|禁止注册企业|"500"/i;

async function withRetry(label, fn, { timeoutMs = 240_000, intervalMs = 2000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  let lastErr;
  while (Date.now() < deadline) {
    try {
      return await fn();
    } catch (e) {
      if (!TRANSIENT.test(String(e.message))) throw e;
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw lastErr || new Error(`${label} timeout`);
}

export async function register({ baseUrl, email, password, name }) {
  return withRetry('register', async () => {
    const r = await fetch(`${baseUrl}/accounts/password/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`register ${r.status}: ${JSON.stringify(body)}`);
    return body;
  });
}

export async function login({ baseUrl, email, password }) {
  return withRetry('login', async () => {
    const r = await fetch(`${baseUrl}/accounts/password/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { email }, password }),
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`login ${r.status}: ${JSON.stringify(body)}`);
    return body;
  }, { timeoutMs: 60_000 });
}

export async function createTenant({ baseUrl, token, name }) {
  return withRetry('createTenant', async () => {
    const r = await fetch(`${baseUrl}/api/v4/spaces/register/tenant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ name }),
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`createTenant ${r.status}: ${JSON.stringify(body)}`);
    return body;
  });
}
