---
title: 交付与发版规范
doc_id: DEL-000
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Product Owner]
created: 2026-04-27
updated: 2026-04-27
related: [ARCH-001, CS-000, AIW-001]
---

# 交付与发版规范

| 文档 | 说明 |
|---|---|
| [definition-of-done.md](./definition-of-done.md) | DoD：每个 Story 完成定义 |
| [acceptance.md](./acceptance.md) | 验收用例编写与执行约定 |
| [release-process.md](./release-process.md) | 版本号、发版步骤、回滚 |
| [user-manual.md](./user-manual.md) | 终端用户操作手册（W6 落地） |

## 总则

- 交付物 = 元数据 + 文档 + 验收用例 + 种子数据，缺一不可。
- 任何里程碑结束前必须满足 DoD，否则不视为完成。
- 发版不绕过 Code Review、不跳过 lint。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
