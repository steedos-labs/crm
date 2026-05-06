import { getState } from './state.mjs';

export function api(opts = {}) {
  const baseUrl = opts.baseUrl || process.env.E2E_BASE_URL || getState('E2E_BASE_URL');
  const token = opts.token || process.env.E2E_TOKEN || getState('E2E_TOKEN');
  const spaceId = opts.spaceId || process.env.E2E_SPACE_ID || getState('E2E_SPACE_ID');
  if (!baseUrl) throw new Error('E2E_BASE_URL not set');
  if (!token || !spaceId) throw new Error('E2E_TOKEN / E2E_SPACE_ID not set');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${spaceId},${token}`,
  };

  async function call(method, urlPath, body) {
    const res = await fetch(`${baseUrl}${urlPath}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let parsed = text;
    try { parsed = text ? JSON.parse(text) : null; } catch {}
    if (!res.ok) {
      const msg = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
      const err = new Error(`${method} ${urlPath} → ${res.status} ${msg}`);
      err.status = res.status;
      err.body = parsed;
      throw err;
    }
    return parsed;
  }

  return {
    baseUrl,
    token,
    spaceId,
    get: (p) => call('GET', p),
    post: (p, b) => call('POST', p, b),
    patch: (p, b) => call('PATCH', p, b),
    delete: (p) => call('DELETE', p),
    raw: call,
    record: {
      create: (obj, doc) => call('POST', `/api/v6/data/${obj}`, doc),
      get: (obj, id) => call('GET', `/api/v6/data/${obj}/${id}`),
      update: (obj, id, doc) => call('PATCH', `/api/v6/data/${obj}/${id}`, doc),
      remove: (obj, id) => call('DELETE', `/api/v6/data/${obj}/${id}`),
      list: (obj, qs = '') => call('GET', `/api/v6/data/${obj}${qs ? `?${qs}` : ''}`),
    },
    fn: (obj, fnName, body = {}) =>
      call('POST', `/api/v6/functions/${obj}/${fnName}`, body),
  };
}
