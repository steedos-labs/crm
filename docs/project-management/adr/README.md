---
title: 架构决策记录 (ADR) 索引
doc_id: ADR-000
version: 0.1.0
status: draft
owner: Architect
reviewers: [Tech Lead, Product Owner]
created: 2026-04-27
updated: 2026-04-27
related: [ARCH-001]
---

# 架构决策记录 (ADR)

## 1. 用途

记录所有具有长期影响的技术决策，支撑后续团队成员理解"为何如此"。每条决策一个文件，文件名 `NNNN-<short-title>.md`，编号严格递增，**不复用、不删除**（被推翻时改 status = superseded 并指向新决策）。

## 2. 模板

```markdown
---
title: <决策标题>
doc_id: ADR-NNNN
version: 0.1.0
status: proposed | accepted | superseded | deprecated
owner: <作者>
reviewers: [Architect, Tech Lead]
created: YYYY-MM-DD
updated: YYYY-MM-DD
supersedes: <ADR-XXXX>          # 可选
superseded_by: <ADR-XXXX>       # 可选
---

# ADR-NNNN：<决策标题>

## Context（背景）
说明问题、约束、相关方。

## Decision（决策）
明确做出的选择。

## Alternatives（备选方案）
列出至少 2 个备选并说明拒绝原因。

## Consequences（影响）
- 正向：...
- 负向：...
- 后续工作：...
```

## 3. 当前 ADR

| 编号 | 标题 | 状态 | 日期 |
|---|---|---|---|
| [0001](./0001-use-steedos-platform.md) | 选用 Steedos 作为底座 | accepted | 2026-04-27 |
| [0002](./0002-mongo-redis-runtime.md) | MongoDB + Redis 运行时 | accepted | 2026-04-27 |
| [0003](./0003-amis-ui.md) | UI 采用 Steedos 内置 Amis | accepted | 2026-04-27 |
| [0004](./0004-object-naming-prefix.md) | 业务对象统一 `crm_` 前缀 | accepted | 2026-04-27 |

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
