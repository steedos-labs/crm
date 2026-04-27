---
title: 提示词 - 新建 Dashboard / Question
doc_id: AIW-PROMPT-NEW-DASHBOARD
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Architect, Product Owner]
created: 2026-04-27
updated: 2026-04-27
related: [AIW-001]
---

# Prompt：新建 Dashboard / Question

## 何时使用

为分析模块（`crm_analytics` 应用）增加 KPI 卡片或仪表盘。

## 输入字段

| 字段 | 必填 | 示例 |
|---|---|---|
| question API name | 是 | `q_pipeline_by_stage` |
| 数据源 | 是 | `crm_opportunities` |
| 聚合 | 是 | sum(amount) group by stage |
| 图表类型 | 是 | bar / line / pie / kpi |
| 关联 dashboard | 是 | `dash_sales` |
| 角色可见 | 是 | crm_admin / crm_sales_manager |

## 期望产出

- `questions/<api_name>.question.yml`
- `dashboards/<dashboard>.dashboard.yml`（追加该 question 引用）
- 更新 [docs/architecture/](../../architecture/) 分析模块章节（如新增 dashboard）。

## 验收

- [ ] 数据正确（与手工 SQL 抽样一致）。
- [ ] 角色权限限制生效。
- [ ] 加载时间 ≤ 2s（10w 量级数据）。
