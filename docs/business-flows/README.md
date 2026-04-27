---
title: 业务流程总览
doc_id: FLOW-001
version: 0.1.0
status: draft
owner: Product Owner
reviewers: [Tech Lead]
created: 2026-04-27
updated: 2026-04-27
related: [PROD-002, DM-001]
---

# 业务流程总览

本目录每条流程独立成文，使用 Mermaid 可视化，并附验收用例。

## 1. 流程清单

| 编号 | 流程 | 文档 | 涉及对象 |
|---|---|---|---|
| FLOW-101 | 线索转换 | [lead-conversion.md](./lead-conversion.md) | leads → accounts/contacts/opportunities |
| FLOW-102 | 商机推进 | [opportunity-progress.md](./opportunity-progress.md) | opportunities, activities |
| FLOW-103 | 报价/合同生成 | [quote-to-contract.md](./quote-to-contract.md) | opportunities → quotes → contracts |
| FLOW-201 | 营销活动执行 | [campaign-execution.md](./campaign-execution.md) | campaigns, campaign_members |
| FLOW-301 | 工单 SLA 处理 | [case-sla.md](./case-sla.md) | cases |
| FLOW-302 | 工单自动分派 | [case-assignment.md](./case-assignment.md) | cases |
| FLOW-401 | 客户 360 视图 | [customer-360.md](./customer-360.md) | accounts + 全部子对象 |

## 2. 文档模板

每个流程文档遵循以下结构：

1. **目的**：业务价值。
2. **触发**：手工 / 触发器 / 定时。
3. **流程图**：Mermaid。
4. **步骤**：按编号列出，包含执行者、动作、系统反应。
5. **数据变更**：列出受影响字段。
6. **异常处理**：失败/回退路径。
7. **验收用例**：表格形式，含前置、操作、预期。
8. **关联**：对象、触发器、function、UI 元素。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
