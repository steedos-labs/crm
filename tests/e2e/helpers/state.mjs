import fs from 'node:fs';
import path from 'node:path';

const FILE = path.resolve('.steedos/e2e-state.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return {};
  }
}

export function getState(key) {
  return load()[key];
}

export function setState(key, value) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const cur = load();
  cur[key] = value;
  fs.writeFileSync(FILE, JSON.stringify(cur, null, 2));
}

export function clearState() {
  try { fs.unlinkSync(FILE); } catch {}
}
