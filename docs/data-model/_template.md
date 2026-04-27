---
title: 数据模型 — 字段表模板
doc_id: DM-TPL
version: 0.1.0
status: approved
owner: Tech Lead
reviewers: []
created: 2026-04-27
updated: 2026-04-27
---

# 字段表模板

每个业务对象在 `docs/data-model/<object>.md` 下使用本模板。

```markdown
---
title: <Label>（<api_name>）字段定义
doc_id: DM-<NNN>
version: 0.1.0
status: draft
owner: <负责人>
reviewers: [<reviewer>]
created: YYYY-MM-DD
updated: YYYY-MM-DD
related: [DM-001]
---

# <Label>（<api_name>）

## 1. 概述

> 一句话说明该对象的业务定义。

## 2. 字段表

| API Name | Label | 类型 | 必填 | 默认值 | 索引 | 备注 |
|---|---|---|---|---|---|---|
| lead_number | 线索编号 | autonumber `LEAD-{####}` | ✓ | 自动 | ✓ | is_name |
| company | 公司 | text | ✓ |  |  |  |
| ... |

## 3. 关系

| 字段 | 关系类型 | 目标对象 | 删除策略 |
|---|---|---|---|
| account | lookup | accounts | restrict |

## 4. 列表视图

| 名称 | 描述 | 默认列 | 默认筛选 |
|---|---|---|---|
| all | 全部 | lead_number, company, status, owner | — |
| my | 我的线索 | 同上 | owner = $userId |

## 5. 业务规则

- <规则 1>
- <规则 2>

## 6. 触发器/函数

- `<trigger_name>`: 触发时机与目的
- `<function_name>`: 入参/返回值

## 7. 权限默认

| 角色 | C | R | U | D |
|---|---|---|---|---|
| sales_rep | ✓ | own | own | ✗ |

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | YYYY-MM-DD | 初稿 | AI |
```
