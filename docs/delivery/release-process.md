---
title: 发版流程
doc_id: DEL-003
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Architect, Product Owner]
created: 2026-04-27
updated: 2026-04-27
related: [DEL-000, DEL-001]
---

# 发版流程

## 1. 版本号

采用 SemVer：`MAJOR.MINOR.PATCH`。

| 段 | 触发 |
|---|---|
| MAJOR | 破坏性变更（删除字段/对象、权限重构、不兼容 API） |
| MINOR | 新增对象 / 新功能 / 新角色（向后兼容） |
| PATCH | 缺陷修复 / 文档修订 / 数据微调 |

MVP 期间：`0.x.y`；W6 完成且通过验收后切 `1.0.0`。

## 2. 分支与 Tag

- 主线：`main`。
- 发版 tag：`vX.Y.Z`（注释带 release notes 摘要）。
- 紧急修复：`hotfix/x.y.z` 从 tag 分出，修复后回灌 main。

## 3. 发版前 Checklist

- [ ] 全部 Story 满足 [DoD](./definition-of-done.md)。
- [ ] 所有 P0 验收用例通过。
- [ ] [project-management/change-log.md](../project-management/change-log.md) 已生成本版本段落。
- [ ] [user-manual.md](./user-manual.md) 同步。
- [ ] `.env.example` 与实际部署变量一致。
- [ ] 干净环境 `docker compose up -d && pnpm i && pnpm start` 通过冒烟。
- [ ] 数据库备份策略已验证。

## 4. 发版步骤

1. 创建发版分支 `release/x.y.z`（仅当需要冻结时）。
2. 更新 `package.json` 版本号、change-log.md。
3. 提交 PR 合入 main。
4. 打 tag：`git tag -a vX.Y.Z -m "..."`，`git push origin vX.Y.Z`。
5. 在目标环境执行：
   ```bash
   git fetch --tags
   git checkout vX.Y.Z
   pnpm install --frozen-lockfile
   pnpm start
   ```
6. 冒烟测试（5 项核心用例）。
7. 通知干系人（PO / 业务用户）。

## 5. 回滚

- 回滚 = 切回上一个 tag：`git checkout v<prev>` + 重启。
- 数据迁移类变更必须事先有反向脚本，否则禁止纳入 release。
- 回滚后必须在 risks.md 登记并触发根因分析。

## 6. 频率

- MVP 期间：每周末一次 PATCH/MINOR 发布。
- 上线后：双周一次 MINOR；HOTFIX 不限。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
