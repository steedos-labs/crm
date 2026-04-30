#!/usr/bin/env node
/**
 * 基础自动化测试：校验 Steedos CRM 元数据的结构与约定。
 *
 * 测试不依赖任何外部 npm 包，可在干净环境直接运行：
 *   node scripts/test-metadata.js
 * 或：
 *   pnpm test
 *
 * 校验内容：
 *  1. 所有 JSON 文件能被 JSON.parse 解析。
 *  2. 所有 YAML 文件非空、不含 Tab 缩进、能以 UTF-8 读取。
 *  3. steedos-packages/crm 下的自定义对象 API 名以 `crm_` 开头。
 *  4. 每个对象目录包含 fields/、listviews/、permissions/ 子目录。
 *  5. 每个对象都注册在 main/default/applications/crm.app.yml 的 tabs 列表中。
 *  6. 每个对象目录中存在与目录同名的 *.object.yml 主文件。
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CRM_PKG = path.join(ROOT, 'steedos-packages', 'crm', 'main', 'default');
const OBJECTS_DIR = path.join(CRM_PKG, 'objects');
const APP_FILE = path.join(CRM_PKG, 'applications', 'crm.app.yml');

const failures = [];
const passed = [];

function fail(name, message) {
  failures.push({ name, message });
}
function pass(name) {
  passed.push(name);
}

function walk(dir, filter) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      out.push(...walk(full, filter));
    } else if (filter(full)) {
      out.push(full);
    }
  }
  return out;
}

// 1. JSON 文件解析校验
function testJsonParsable() {
  const files = walk(path.join(ROOT, 'steedos-packages'), (f) => f.endsWith('.json'));
  for (const file of files) {
    const rel = path.relative(ROOT, file);
    try {
      JSON.parse(fs.readFileSync(file, 'utf8'));
      pass(`JSON 可解析: ${rel}`);
    } catch (err) {
      fail(`JSON 解析失败: ${rel}`, err.message);
    }
  }
}

// 2. YAML 文件基础校验（非空、无 Tab 缩进）
function testYamlBasic() {
  const files = walk(path.join(ROOT, 'steedos-packages'), (f) =>
    f.endsWith('.yml') || f.endsWith('.yaml')
  );
  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const content = fs.readFileSync(file, 'utf8');
    if (content.trim().length === 0) {
      fail(`YAML 为空: ${rel}`, '文件内容为空');
      continue;
    }
    const lines = content.split(/\r?\n/);
    let bad = -1;
    for (let i = 0; i < lines.length; i++) {
      // YAML 不允许 Tab 作为缩进
      if (/^\t/.test(lines[i])) {
        bad = i + 1;
        break;
      }
    }
    if (bad !== -1) {
      fail(`YAML 含 Tab 缩进: ${rel}`, `第 ${bad} 行使用了 Tab，请改为空格`);
    } else {
      pass(`YAML 基础格式: ${rel}`);
    }
  }
}

// 3 & 4 & 6. CRM 自定义对象命名 & 目录结构 & 主文件存在
function listObjectDirs() {
  if (!fs.existsSync(OBJECTS_DIR)) return [];
  return fs
    .readdirSync(OBJECTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function testObjectConventions() {
  const dirs = listObjectDirs();
  if (dirs.length === 0) {
    fail('未发现任何对象目录', `期望路径: ${path.relative(ROOT, OBJECTS_DIR)}`);
    return;
  }
  for (const name of dirs) {
    if (!name.startsWith('crm_')) {
      fail(`对象命名不符合约定: ${name}`, '自定义对象 API 名必须以 crm_ 开头');
    } else {
      pass(`对象命名: ${name}`);
    }
    for (const sub of ['fields', 'listviews', 'permissions']) {
      const p = path.join(OBJECTS_DIR, name, sub);
      if (!fs.existsSync(p) || !fs.statSync(p).isDirectory()) {
        fail(`对象缺少子目录: ${name}/${sub}`, `期望存在: ${path.relative(ROOT, p)}`);
      } else {
        pass(`对象子目录: ${name}/${sub}`);
      }
    }
    const objectFile = path.join(OBJECTS_DIR, name, `${name}.object.yml`);
    if (!fs.existsSync(objectFile)) {
      fail(`对象缺少主文件: ${name}.object.yml`, `期望存在: ${path.relative(ROOT, objectFile)}`);
    } else {
      pass(`对象主文件: ${name}.object.yml`);
    }
  }
}

// 5. 每个对象都注册在应用的 tabs 列表中
function testObjectsRegisteredInApp() {
  if (!fs.existsSync(APP_FILE)) {
    fail('应用文件不存在', `期望存在: ${path.relative(ROOT, APP_FILE)}`);
    return;
  }
  const appText = fs.readFileSync(APP_FILE, 'utf8');
  const dirs = listObjectDirs();
  for (const name of dirs) {
    const tab = `object_${name}`;
    if (!appText.includes(tab)) {
      fail(`对象未在应用中注册: ${name}`, `crm.app.yml 中未发现 ${tab}`);
    } else {
      pass(`对象已注册到应用: ${name}`);
    }
  }
}

function main() {
  testJsonParsable();
  testYamlBasic();
  testObjectConventions();
  testObjectsRegisteredInApp();

  const total = passed.length + failures.length;
  console.log(`\n通过: ${passed.length} / ${total}`);
  if (failures.length > 0) {
    console.error(`\n失败: ${failures.length}`);
    for (const f of failures) {
      console.error(`  ✗ ${f.name}\n    ${f.message}`);
    }
    process.exit(1);
  }
  console.log('\n所有元数据基础校验通过 ✅');
}

main();
