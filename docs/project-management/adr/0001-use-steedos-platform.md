---
title: 选用 Steedos 作为底座
doc_id: ADR-0001
version: 0.1.0
status: accepted
owner: Architect
reviewers: [Tech Lead, Product Owner]
created: 2026-04-27
updated: 2026-04-27
---

# ADR-0001：选用 Steedos 作为底座

## Context

需要在 4-6 周交付私有部署 CRM MVP，覆盖销售/营销/服务/分析；团队希望 AI 全程生成代码，必须采用强约束的元数据驱动框架以降低 AI 幻觉风险。

## Decision

采用 [Steedos](https://www.steedos.com/) 作为应用底座，核心业务逻辑通过元数据（`.object.yml` / `.app.yml` / `.permission.yml` 等）声明，仅在必要时编写 trigger / function。

## Alternatives

1. **从零基于 NestJS 构建**：自由度高，但 4-6 周内无法交付完整对象/权限/UI 体系；AI 生成自由代码难以保证一致性。拒绝。
2. **Salesforce DX 元数据**：商业授权成本高，违背"私有部署"约束。拒绝。
3. **Odoo / SuiteCRM**：定制路径偏离主流元数据声明范式，AI 生成器难以稳定输出。拒绝。

## Consequences

- 正向：元数据声明结构强约束，便于 AI 通过 skill/template 生成；内置 listview / permission / dashboard 节省 80% UI 代码。
- 负向：受 Steedos 平台演进与 license 影响；高度定制 UI 时需引入自定义 page。
- 后续：所有自定义代码必须落入 `steedos-packages/crm`，避免 fork 平台代码。
