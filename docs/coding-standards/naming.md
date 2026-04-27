---
title: 命名规范
doc_id: CS-001
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Architect]
created: 2026-04-27
updated: 2026-04-27
related: [CS-000, DM-001]
---

# 命名规范

## 1. 通用原则

- 一律使用英文小写，避免中文与缩写歧义。
- 单词分隔统一用 `snake_case`（元数据 API name）或 `kebab-case`（文件/目录名/分支名）。
- 禁止保留字：`type`, `name`, `id`, `_id`, `created`, `modified`, `owner` 等 Steedos 平台保留字段不得作为自定义字段名。

## 2. Steedos 对象 API name

> 决策：所有业务对象统一使用 `crm_` 前缀，避免与平台/其他包对象冲突，详见 [ADR-0004](../project-management/adr/0004-object-naming-prefix.md)。

| 元素 | 规则 | 示例 |
|---|---|---|
| 对象 (object) | `crm_` + 小写复数 snake_case | `crm_leads`、`crm_accounts`、`crm_campaign_members` |
| 字段 (field) | 小写 snake_case，**不**重复对象前缀 | `first_name`、`annual_revenue`、`sla_due` |
| Lookup 字段 | 引用对象单数语义 + 业务后缀 | `account`（指向 `crm_accounts`）、`parent_account` |
| 关系字段 | 不使用 `_id` 后缀（平台自动处理） | `account` 而非 `account_id` |
| Listview | 小写 snake_case，描述视图意图 | `all`、`my_open`、`this_week` |
| Tab | = 对象 API name | `crm_leads` |
| Application | 小写单词，前缀可选 | `crm_sales`、`crm_marketing`、`crm_service`、`crm_analytics` |
| Trigger | `<object_short>_<intent>` | `lead_convert`、`case_sla_calc`（文件名）；trigger.name 同 |
| Function | `<object_short>.<verb>` | `leads.convert`、`cases.assign_owner` |
| PermissionSet | `crm_` + 角色 API name | `crm_sales_rep`、`crm_service_agent`、`crm_admin` |
| Dashboard / Question | `crm_<scope>_<metric>` | `crm_sales_pipeline`、`crm_marketing_roi` |

> Trigger / Function 的文件名与内部 name 字段允许使用对象短名（去掉 `crm_`），以保持可读性；对象引用必须使用完整 `crm_xxx` API name。

## 3. 自增字段（autonumber）

| 对象 | 字段 | 格式 |
|---|---|---|
| `crm_leads` | `lead_number` | `LEAD-{0000}` |
| `crm_accounts` | `account_number` | `ACC-{0000}` |
| `crm_contacts` | `contact_number` | `CON-{0000}` |
| `crm_opportunities` | `opp_number` | `OPP-{0000}` |
| `crm_quotes` | `quote_number` | `QUO-{0000}` |
| `crm_contracts` | `contract_number` | `CTR-{0000}` |
| `crm_cases` | `case_number` | `CAS-{0000}` |
| `crm_campaigns` | `campaign_number` | `CMP-{0000}` |

`is_name: true` 必须设在自增编号字段上，便于跨对象引用稳定。

## 4. 文件与目录

| 类别 | 规则 | 示例 |
|---|---|---|
| 元数据文件 | `<api_name>.<type>.yml` | `crm_leads.object.yml` |
| 字段拆分目录 | `objects/<object>/fields/<field>.field.yml` | `objects/crm_leads/fields/email.field.yml` |
| Trigger | `triggers/<name>.trigger.yml` | `triggers/lead_convert.trigger.yml` |
| Function | `functions/<name>.function.yml` + 同名 `.js` | `functions/leads.convert.function.yml` |
| Page | `pages/<name>.page.yml` + `.page.amis.json` | `pages/crm_account_360.page.yml` |
| 文档 | `kebab-case.md` | `business-flows/lead-conversion.md` |

## 5. 分支命名

`<type>/<scope>-<short-desc>`

| type | 用途 |
|---|---|
| `feat` | 新功能 |
| `fix` | 缺陷修复 |
| `docs` | 仅文档 |
| `refactor` | 重构（不改行为） |
| `chore` | 构建/工具 |
| `data` | 种子数据/迁移 |

示例：`feat/leads-convert-trigger`、`docs/permission-matrix-update`。

## 6. 文档 ID

格式：`<PREFIX>-<NNN>`，全局唯一。前缀见 [docs/README.md](../README.md)。新增文档时：

1. 查阅同前缀已有最大编号 +1。
2. 写入文档 frontmatter `doc_id`。
3. 在文档索引/相关文档中引用。

## 7. 提交主题

参见 [commit-pr.md](./commit-pr.md)。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
