---
title: 业务对象统一 crm_ 前缀
doc_id: ADR-0004
version: 0.1.0
status: accepted
owner: Architect
reviewers: [Tech Lead]
created: 2026-04-27
updated: 2026-04-27
related: [CS-001, DM-001, PERM-001]
---

# ADR-0004：所有业务对象统一使用 `crm_` 前缀

## Context

Steedos 平台与第三方包（如 `@steedos-labs/*`）已占用 `accounts`、`contacts`、`activities`、`campaigns` 等通用对象 API name。本项目作为应用包，必须避免对象命名冲突，并保证未来与平台升级、其他业务包共存。

## Decision

- 所有业务对象 API name = `crm_<plural_snake_case>`，例如 `crm_leads` / `crm_accounts` / `crm_opportunities`。
- 角色 / 权限集 / 应用 / Tab 同样以 `crm_` 前缀（`crm_admin`、`crm_sales`、`crm_sales_rep` 等）。
- 字段名沿用业务语义（无前缀），对象目录名 = 对象 API name。
- Trigger / Function 文件名允许使用对象短名（如 `lead_convert.trigger.yml`），但内部声明的 `object` 字段必须填完整 `crm_xxx`。

## Alternatives

1. **沿用裸名 `accounts/contacts`**：与 Steedos 内置/社区包高概率冲突，升级即崩。拒绝。
2. **以英文首字母缩写 `c_*`**：过短，AI prompt 易混淆，IDE 索引不直观。拒绝。

## Consequences

- 正向：彻底隔离命名空间；search/replace、yamllint 规则书写简单（前缀匹配即可）。
- 负向：YAML / 文档冗余 4 个字符；外部集成需在适配层做 alias。
- 后续：在 [coding-standards/naming.md](../../coding-standards/naming.md) §2 与 [data-model/README.md](../../data-model/README.md) 中以表格固化映射；CI 增加"对象目录名必须以 `crm_` 起始"校验。
