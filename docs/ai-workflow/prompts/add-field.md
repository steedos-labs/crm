---
title: 提示词 - 新增字段
doc_id: AIW-PROMPT-ADD-FIELD
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Architect]
created: 2026-04-27
updated: 2026-04-27
related: [AIW-001, CS-001, DM-001]
---

# Prompt：新增字段

## 何时使用

向已存在对象追加一个或多个字段。

## 输入字段

| 字段 | 必填 | 示例 |
|---|---|---|
| 对象 API name | 是 | `crm_opportunities` |
| 字段 API name | 是 | `expected_close_date` |
| 类型 | 是 | date / currency / lookup / select / formula |
| label / 说明 | 是 | 预计成交日期 |
| 是否必填 / 默认值 / 索引 | 否 | required: true |
| 是否影响 listview / permission / 字段级权限 | 是 | 在 listview `all` 中显示 |

## 期望产出

- `objects/<api_name>/fields/<field>.field.yml`（若 ≤5 字段对象，可内嵌主文件，但需在 PR 描述说明，参考 [CS-002](../../coding-standards/directory.md) §2.1）。
- 同步更新 `docs/data-model/<api_name>.md` 字段表。
- 如涉及字段级权限，更新 [permissions/permission-model.md](../../permissions/permission-model.md) §4 并在对应 `permissionset.yml` 中追加 `field_permissions`。

## 验收

- [ ] `steedos restart` 后字段在表单/列表可见且类型正确。
- [ ] 旧记录默认值生效或为空时不报错。
- [ ] 字段级权限按矩阵生效。
