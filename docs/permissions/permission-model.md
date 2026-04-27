---
title: 权限模型
doc_id: PERM-001
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Product Owner, Security Reviewer]
created: 2026-04-27
updated: 2026-04-27
related: [ARCH-001, DM-001]
---

# 权限模型

## 1. 权限层次

Steedos 平台提供四级权限控制，本项目统一遵循：

1. **License**：用户许可范围（暂只用 `Standard`）。
2. **Profile**：登录概要文件（暂用 `User` 默认）。
3. **PermissionSet**：本项目核心，每个角色一个 `*.permissionset.yml`。
4. **共享规则 (Sharing Rule)**：跨用户的数据可见性扩展。

## 2. 标准角色

| API Name | 名称 | 说明 |
|---|---|---|
| `crm_admin` | 系统管理员 | 全部对象全部权限，配置元数据 |
| `crm_sales_manager` | 销售主管 | 团队所有 Lead/Opp/Account/Quote 可见可编辑 |
| `crm_sales_rep` | 销售员 | 仅自己负责的销售类记录 |
| `crm_marketer` | 市场专员 | Campaign/CampaignMember/EmailTemplate 全权；Lead 读+加入活动 |
| `crm_service_agent` | 客服 | Case/Knowledge 全权；Account/Contact 只读 |

## 3. 对象权限矩阵

| 对象 | crm_admin | crm_sales_manager | crm_sales_rep | crm_marketer | crm_service_agent |
|---|---|---|---|---|---|
| crm_leads | CRUD | CRUD | own CRUD | R+加入活动 | R |
| crm_accounts | CRUD | CRUD | own CRUD | R | R |
| crm_contacts | CRUD | CRUD | own CRUD | R | R |
| crm_opportunities | CRUD | CRUD | own CRUD | — | — |
| crm_quotes | CRUD | CRUD | own CRUD | — | — |
| crm_contracts | CRUD | CRUD | own R | — | — |
| crm_campaigns | CRUD | R | R | CRUD | — |
| crm_campaign_members | CRUD | R | R | CRUD | — |
| crm_email_templates | CRUD | R | R | CRUD | — |
| crm_cases | CRUD | R | R | — | CRUD |
| crm_knowledge | CRUD | R | R | R | CRUD |
| crm_activities | CRUD | own dept R | own CRUD | own CRUD | own CRUD |

> own = 仅自己 owner；own dept = 同部门可见。

## 4. 字段级权限

字段级控制在 W5 实施。规则：

- `crm_opportunities.amount` 对 `crm_marketer` / `crm_service_agent` 不可见。
- `crm_accounts.annual_revenue` 对 `crm_service_agent` 不可见。
- `crm_contacts.email/phone` 对未登录用户/外部访客不可见。

## 5. 共享规则

| 规则 | 描述 | 时间 |
|---|---|---|
| Sales 主管→团队 | sales_manager 可读所有下属的 Lead/Opp | W5 |
| 部门内 Activity 共享 | 同部门成员可读 Activity | W5 |

## 6. 审计

- W6：开启 Steedos 内置 audit log（创建/更新/删除）。
- 关键字段（`opportunities.amount`, `quotes.total`, `contracts.value`）变更全部审计。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
