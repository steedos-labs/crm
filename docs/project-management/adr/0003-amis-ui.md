---
title: UI 采用 Steedos 内置 Amis
doc_id: ADR-0003
version: 0.1.0
status: accepted
owner: Architect
reviewers: [Tech Lead, Product Owner]
created: 2026-04-27
updated: 2026-04-27
---

# ADR-0003：UI 采用 Steedos 内置 Amis 渲染

## Context

CRM MVP 周期 4-6 周，要求 AI 全程生成可运行 UI。Steedos 默认列表页 / 详情页 / 看板均由内置渲染器产出；自定义 page 通过 `*.page.amis.json` 描述，由百度 Amis 渲染。

## Decision

- 业务模块 UI 优先使用 Steedos 标准列表页 / 详情页 / 表单（仅声明 listview / object）。
- 客户 360、看板等定制页面统一使用 Amis JSON Schema (`*.page.amis.json`)，并以 `*.page.yml` 注册。
- 不引入额外前端框架；不 fork Steedos 客户端代码。

## Alternatives

1. **自建 React 壳**：与 Steedos 默认壳重复造轮子，4-6 周内无法覆盖列表/详情/权限。拒绝。
2. **接入第三方低代码（如 Retool）**：商用 license + 私有部署成本高，与"私有部署"约束冲突。拒绝。

## Consequences

- 正向：UI 与元数据强绑定，AI 通过 prompts/new-application、new-page 即可输出可用页面；零前端构建步骤。
- 负向：复杂交互受 Amis Schema 表达力限制；遇到瓶颈需在 W6 前评估是否引入轻量自定义组件。
- 后续：在 [coding-standards/amis-style.md](../../coding-standards/) 增补 Amis Schema 风格指南（W3 前完成）。
