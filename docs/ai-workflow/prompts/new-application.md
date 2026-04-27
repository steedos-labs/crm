---
title: 提示词 - 新建应用与 Tab
doc_id: AIW-PROMPT-NEW-APPLICATION
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Architect]
created: 2026-04-27
updated: 2026-04-27
related: [AIW-001, CS-001]
---

# Prompt：新建 Application + Tabs

## 何时使用

新增一个业务模块（例如 `crm_marketing` / `crm_service`），需要顶部导航容器与子 Tab。

## 输入字段

| 字段 | 必填 | 示例 |
|---|---|---|
| application API name | 是 | `crm_marketing` |
| label / icon | 是 | 市场营销 / `bullhorn` |
| 包含 Tabs | 是 | crm_campaigns / crm_campaign_members / crm_email_templates / crm_leads |
| 默认进入 Tab | 是 | crm_campaigns |
| 角色可见 | 是 | crm_admin / crm_marketer |

## 期望产出

- `applications/<api_name>.app.yml`
- `tabs/<tab>.tab.yml`（type: object / url / page）
- 在对应 `permissionset.yml` 中授予 `apps` 可见。
- 更新 [docs/architecture/README.md](../../architecture/) 应用清单。

## 验收

- [ ] 顶部导航出现新应用，点击后默认 Tab 正确。
- [ ] 不在角色范围的用户看不到该应用。
