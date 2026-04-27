---
title: MongoDB + Redis 运行时
doc_id: ADR-0002
version: 0.1.0
status: accepted
owner: Architect
reviewers: [Tech Lead]
created: 2026-04-27
updated: 2026-04-27
---

# ADR-0002：MongoDB + Redis 作为运行时存储与传输

## Context

Steedos 默认依赖 MongoDB 持久化、Redis 作为 Moleculer 微服务传输与缓存。MVP 阶段不引入额外存储以降低运维复杂度。

## Decision

- 主数据库：MongoDB 6.x（私有部署）。
- 缓存与 Moleculer transporter：Redis 7.x。
- 通过 `.env` 注入 `MONGO_URL`、`B6_TRANSPORTER`、`B6_CACHER`，由 docker-compose 统一编排。

## Alternatives

1. **MySQL/Postgres 替代 Mongo**：需重写 Steedos 数据层，工作量与风险不可接受。拒绝。
2. **NATS 替代 Redis transporter**：可选，但 MVP 期内无横向扩展需求，引入额外组件不合算。拒绝。

## Consequences

- 正向：与 Steedos 默认 stack 对齐，文档/社区资源最丰富。
- 负向：跨集合事务能力弱，需在 trigger 中手工保证一致性（线索转换等）。
- 后续：W6 部署演练必须包含 mongo/redis 数据备份与恢复脚本。
