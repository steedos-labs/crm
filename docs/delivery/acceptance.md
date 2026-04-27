---
title: 验收规范
doc_id: DEL-002
version: 0.1.0
status: draft
owner: Product Owner
reviewers: [Tech Lead]
created: 2026-04-27
updated: 2026-04-27
related: [DEL-000, DEL-001]
---

# 验收规范

## 1. 用例编号

格式：`AC-<FLOW_ID>-<NN>`，例：`AC-101-01`（流程 FLOW-101 的第 01 条用例）。

## 2. 编写位置

- **业务流程级**：写在 [business-flows/<flow>.md](../business-flows/) 的 §7 验收用例 表格中。
- **对象级 CRUD**：写在 [data-model/<object>.md](../data-model/) 的"操作约束"段。
- **跨流程回归**：写在 [delivery/regression.md](#) 中（W4 引入）。

## 3. 用例模板

| 字段 | 必填 | 说明 |
|---|---|---|
| 用例 ID | 是 | `AC-FLOW-NN` |
| 标题 | 是 | 简短描述 |
| 角色 | 是 | 登录角色（admin/sales_rep 等） |
| 前置数据 | 是 | 引用 data/*.data.yml 或步骤描述 |
| 操作步骤 | 是 | 编号列表 |
| 预期结果 | 是 | 含字段值 / 跳转 / 通知等 |
| 优先级 | 是 | P0/P1/P2 |
| 关联 Story | 否 | US-XX |

## 4. 执行流程

1. 开发完成后，作者按用例 ID 顺序执行。
2. 在 PR 描述勾选通过项。
3. 评审人在评审环境（同一 commit）独立复现至少 1 条 P0。
4. 合入后由 PO 在 demo 环节抽查。

## 5. 失败处理

- 单条失败 → 修复并重跑全部相关用例（含已通过的）。
- 失败原因为元数据漂移 → 同步更新 data-model 文档。
- 失败为 AI 幻觉 → 记入 [project-management/risks.md](../project-management/risks.md) 并改 prompt 模板。

## 6. 自动化（W5 之后）

- W5：使用 Steedos REST API 写脚本回放关键 P0 用例。
- W6：CI 集成回归脚本，每次 PR 触发。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
