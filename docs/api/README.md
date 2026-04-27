---
title: API 总览
doc_id: API-001
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: []
created: 2026-04-27
updated: 2026-04-27
related: [ARCH-001]
---

# API 总览

## 1. 接口分层

| 类型 | 用途 | 示例 |
|---|---|---|
| Steedos 内建 REST | 标准 CRUD（自动生成） | `GET /api/v6/data/{object}/records` |
| 对象自定义 function | 业务原子能力 | `POST /api/v6/functions/leads/convert` |
| Webhook (出) | 通知外部系统（W6+） | 商机阶段变更 → 外部通知 |
| Webhook (入) | 接收外部数据（W6+） | 表单系统提交线索 |

## 2. 鉴权

- 头：`Authorization: Bearer <token>`
- 取得 token：`POST /api/v6/users/login`（用户名/密码）。
- 详细见 [Steedos server-api skill]。

## 3. 自定义 function 清单（MVP）

| Function ID | 对象 | 描述 | Sprint |
|---|---|---|---|
| `leads.convert` | leads | 线索转换为 Account/Contact/Opportunity | W2 |
| `opportunities.recalc_probability` | opportunities | 根据 stage 更新 probability（formula） | W2 |
| `quotes.generate_pdf` | quotes | 输出报价单 PDF（W6+，先占位） | — |
| `campaigns.add_members` | campaigns | 批量加入成员 | W3 |
| `cases.assign_owner` | cases | 自动分派 | W4 |

## 4. 接口契约模板

每个接口在 `docs/api/<api-id>.md` 用以下模板：

```markdown
# <API_ID> <名称>

## 请求
- 方法：POST
- 路径：/api/v6/functions/<object>/<func>
- 鉴权：Bearer

## 入参
| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|

## 出参
| 字段 | 类型 | 说明 |
|---|---|---|

## 错误码
| code | message |
|---|---|

## 示例
```json
{ "request": { ... }, "response": { ... } }
```
```

## 5. 错误规范

- HTTP 状态：2xx 成功，4xx 业务错误，5xx 系统错误。
- Body：`{ "error": { "code": "<APP_ERR_CODE>", "message": "...", "details": {} } }`
- 业务错误码统一前缀：`CRM_<MODULE>_<NAME>`，如 `CRM_LEAD_ALREADY_CONVERTED`。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
