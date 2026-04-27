---
title: Definition of Done (DoD)
doc_id: DEL-001
version: 0.1.0
status: draft
owner: Product Owner
reviewers: [Tech Lead]
created: 2026-04-27
updated: 2026-04-27
related: [DEL-000, CS-005]
---

# Definition of Done

任一 User Story / 任务在以下条件全部满足前不得视为完成。

## 1. Story 级 DoD

- [ ] 元数据创建/修改完毕，遵循 [coding-standards/](../coding-standards/)。
- [ ] `steedos restart` 成功；UI 渲染正常。
- [ ] 至少 1 条手动验收用例通过（[acceptance.md](./acceptance.md)）。
- [ ] 文档同步：data-model / business-flows / api / permissions 任一相关文档版本号 +0.0.1。
- [ ] 权限验证：相关角色登录后可见/不可见行为符合 [permissions/permission-model.md](../permissions/permission-model.md)。
- [ ] yamllint / markdownlint 通过。
- [ ] PR 通过 1+ 评审；权限/数据模型变更需 Architect + PO 双签。
- [ ] 合并后 [project-management/change-log.md](../project-management/change-log.md) 追加条目。

## 2. Sprint 级 DoD

- [ ] 当 Sprint 全部 Story 满足 §1。
- [ ] 跑通本 Sprint 在 [project-management/sprints/](../project-management/sprints/) 中列出的端到端用例。
- [ ] Sprint 回顾会议记录归档至 [project-management/meetings/](../project-management/meetings/)。
- [ ] 风险登记表 [project-management/risks.md](../project-management/risks.md) 更新。

## 3. Release 级 DoD

- [ ] 全量回归：所有历史 AC-xx-xx 用例通过。
- [ ] 全新环境一键启动（docker-compose）。
- [ ] 用户手册 [user-manual.md](./user-manual.md) 与当前实现一致。
- [ ] CHANGELOG / 版本号符合 [release-process.md](./release-process.md)。
- [ ] 数据备份/恢复演练通过（W6 之后）。

## 4. 不视为完成的常见误区

- 仅"代码写完"未跑 `steedos restart`。
- 仅本地 demo，未在干净环境验证。
- 文档/权限滞后改。
- 通过临时关闭 lint 强行合入。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
