---
title: 风险登记册
doc_id: PM-003
version: 0.1.0
status: draft
owner: Product Owner
reviewers: [Architect, Tech Lead]
created: 2026-04-27
updated: 2026-04-27
related: [PM-001, DEL-002, AIW-001]
---

# 风险登记册（Risk Register）

## 1. 评分定义

- **概率 P**：1 极低 · 2 低 · 3 中 · 4 高 · 5 极高
- **影响 I**：1 可忽略 · 2 轻 · 3 中 · 4 重 · 5 灾难
- **风险值 R = P × I**；R ≥ 12 进入"高风险"区，必须有 owner + 周回顾。

## 2. 当前风险

| ID | 类别 | 描述 | P | I | R | 缓解措施 | Owner | 状态 |
|---|---|---|---|---|---|---|---|---|
| RISK-001 | 平台 | Steedos 升级带来元数据 schema 变化 | 2 | 4 | 8 | 锁定 `@steedos/server` 版本；W6 演练前评估升级 | Architect | open |
| RISK-002 | AI 质量 | AI 生成元数据不符合规范，导致 `steedos start` 失败 | 4 | 3 | 12 | 强制 yamllint + 命名校验脚本；prompts/ 模板覆盖率 100% | Tech Lead | open |
| RISK-003 | 范围 | MVP 周期内被追加非核心需求 | 4 | 4 | 16 | roadmap 锁定；新需求一律入 backlog 下版本 | Product Owner | open |
| RISK-004 | 数据 | 线索转换 trigger 缺事务，半成功污染 Account/Contact | 3 | 4 | 12 | trigger 内 try/catch 回滚；W2 用例必须覆盖中断场景 | Tech Lead | open |
| RISK-005 | 部署 | docker-compose 在客户机器网络受限，Mongo/Redis 镜像拉取失败 | 3 | 3 | 9 | 提供离线 tar 包；W6 演练在断网环境复现 | DevOps | open |
| RISK-006 | 权限 | 字段级权限漏配，Sales 看到 amount 之外的敏感字段 | 3 | 4 | 12 | W5 出 PERM-002 字段级矩阵；上线前由 Security Reviewer 走查 | Security Reviewer | open |
| RISK-007 | 性能 | listview 默认无索引，10 万级线索查询超时 | 2 | 3 | 6 | 在 object.yml 声明索引；W6 压测 | Tech Lead | open |
| RISK-008 | 文档 | 文档与代码漂移（AI 改 yml 未同步 docs/） | 4 | 3 | 12 | PR 模板要求 doc_id；CI 校验"对象新增必须更新 DM-xxx" | Architect | open |

## 3. 关闭流程

1. 风险消除或不再适用 → 在表中改 status 为 `closed`，并在 [change-log.md](./change-log.md) 留痕。
2. 风险演变为问题（issue）→ 转入 [tasks.md](./tasks.md) 或 GitHub Issue，状态置 `realized`。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿，登记 8 项 MVP 期风险 | AI |
