---
title: 开发规范总览
doc_id: CS-000
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Architect]
created: 2026-04-27
updated: 2026-04-27
related: [ARCH-001, AIW-001]
---

# 开发规范总览

本目录汇集本项目对所有 AI 生成 / 人工修改产物的硬性规范。任何 PR 在合入前必须满足这些规范，否则视为不合格。

| 规范 | 文档 |
|---|---|
| 命名 | [naming.md](./naming.md) |
| 目录结构 | [directory.md](./directory.md) |
| YAML 风格 | [yaml-style.md](./yaml-style.md) |
| 提交与 PR | [commit-pr.md](./commit-pr.md) |
| Code Review | [code-review.md](./code-review.md) |

## 适用范围

- Steedos 元数据：`*.object.yml`、`*.trigger.yml`、`*.function.yml`、`*.app.yml`、`*.tab.yml`、`*.page.yml/.amis.json`、`*.permissionset.yml`、`*.dashboard.yml`、`*.question.yml`、`*.translation.yml`、`*.data.yml`。
- JavaScript / TypeScript（trigger handler、function 实现）。
- 文档 Markdown。

## 例外处理

如确需偏离规范，必须：

1. 在 PR 描述中说明原因。
2. 同步在 [project-management/risks.md](../project-management/risks.md) 登记。
3. 评审通过后才可合入。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
