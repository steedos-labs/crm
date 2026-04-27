---
title: AI 协作工作流
doc_id: AIW-001
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Product Owner]
created: 2026-04-27
updated: 2026-04-27
related: [ARCH-001, DEV-001]
---

# AI 协作工作流

本项目所有代码、元数据、文档由 **Claude Code** 在人类主导下生成。本文档定义协作约定，确保产物可控、可回归、可评审。

## 1. 角色

| 角色 | 职责 |
|---|---|
| 产品负责人 | 提出意图、验收 |
| 架构评审 | 确认元数据决策（对象/字段/关系/权限） |
| AI（Claude Code） | 生成元数据/触发器/函数/文档/测试用例 |
| 测试 | 执行验收用例 |

## 2. 核心原则

1. **意图驱动**：人描述 *what*，AI 决定 *how*；偏离时人立即纠正。
2. **最小生成单元**：一次只生成一个对象 / 一个 trigger / 一个 page，避免大爆发。
3. **元数据先行**：先 object/fields/listview/permission/tab/app 跑通 UI，再写 trigger/function。
4. **每步可验证**：生成后 `steedos restart` 并跑 1-2 个手动用例。
5. **文档同步**：任何元数据变更，先改/写 `docs/data-model/<object>.md`，AI 据此生成 YAML。
6. **PR 分粒度**：一个 PR ≤ 一个 Sprint 任务，避免大 PR。

## 3. 提示词约定

为提升 AI 产出一致性，统一使用以下模板（位于 [prompts/](./prompts/)）：

| 场景 | 模板 |
|---|---|
| 新建对象 | [prompts/new-object.md](./prompts/new-object.md) |
| 增加字段 | [prompts/add-field.md](./prompts/add-field.md) |
| 写触发器 | [prompts/new-trigger.md](./prompts/new-trigger.md) |
| 写 function | [prompts/new-function.md](./prompts/new-function.md) |
| 配置应用/Tab | [prompts/new-application.md](./prompts/new-application.md) |
| 创建 dashboard/question | [prompts/new-dashboard.md](./prompts/new-dashboard.md) |
| 文档生成/更新 | [prompts/update-doc.md](./prompts/update-doc.md) |

每个提示词模板包含：上下文链接、输入字段、输出文件清单、验收方式。

## 4. AI 产出验收

任何 AI 产出在合并前必须通过：

- [ ] `steedos restart` 不报错。
- [ ] 文件路径与 [coding-standards/directory.md](../coding-standards/directory.md) 一致。
- [ ] YAML 风格遵循 [coding-standards/yaml-style.md](../coding-standards/yaml-style.md)。
- [ ] 命名遵循 [coding-standards/naming.md](../coding-standards/naming.md)。
- [ ] 文档同步更新。
- [ ] 对应业务流程的手动用例至少跑通 1 条。

## 5. 不可委托给 AI 的事项

以下决策必须由人类做出：

- 业务流程的设计（人决定 → AI 实现）。
- 权限矩阵的定义。
- 删除/重命名既有字段（影响数据）。
- 任何破坏性 git 操作。
- 发版决策。

## 6. 失误回退

AI 输出错误时：

1. 立即 `git restore <files>` 或 `git revert <commit>`。
2. 在 [project-management/risks.md](../project-management/risks.md) 中记录类型与原因。
3. 调整对应 prompt 模板，避免下次重犯。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
