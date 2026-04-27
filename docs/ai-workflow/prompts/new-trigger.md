---
title: 提示词 - 新建触发器
doc_id: AIW-PROMPT-NEW-TRIGGER
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Architect]
created: 2026-04-27
updated: 2026-04-27
related: [AIW-001, FLOW-001, CS-001]
---

# Prompt：新建触发器

## 何时使用

需要在对象生命周期事件（before/after × insert/update/delete）注入业务逻辑时使用。优先使用 formula 字段，仅在跨对象/计算复杂场景才写 trigger。

## 输入字段

| 字段 | 必填 | 示例 |
|---|---|---|
| 触发器 API name | 是 | `lead_convert` |
| 关联对象（完整名） | 是 | `crm_leads` |
| 时机 | 是 | beforeInsert / afterUpdate |
| 触发条件 | 是 | `record.status === 'qualified' && !record.converted_account` |
| 业务效果 | 是 | 创建 crm_accounts + crm_contacts + crm_opportunities，并回填 converted_* 字段 |
| 错误回滚策略 | 是 | try/catch，失败抛出 + 用户提示 |

## 期望产出

- `triggers/<api_name>.trigger.yml`（跨对象触发器）或 `objects/<obj>/triggers/<api_name>.trigger.yml`（对象内联）。
- 同名 `<api_name>.js`（如需逻辑）。
- 在 [docs/business-flows/<flow>.md](../../business-flows/) 增加流程图与手动用例。

## 验收

- [ ] 正常路径成功（用例 1）。
- [ ] 失败路径无脏数据（用例 2，模拟一个子操作抛错）。
- [ ] 不递归触发（自身改动不再次触发）。
- [ ] 无 console.log 等调试残留。
