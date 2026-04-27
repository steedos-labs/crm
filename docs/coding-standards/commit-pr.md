---
title: 提交与 PR 规范
doc_id: CS-004
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Architect]
created: 2026-04-27
updated: 2026-04-27
related: [CS-000, CS-001]
---

# 提交与 PR 规范

## 1. 分支

- 基线：`main`，永远可发布。
- 开发分支命名：`<type>/<scope>-<short-desc>`，参见 [naming.md](./naming.md#5-分支命名)。
- 每个 Issue 一条分支；分支生命周期 ≤ 1 个 Sprint。
- 禁止在 `main` 直接提交。

## 2. Commit 规范（Conventional Commits）

```
<type>(<scope>): <subject>

<body>

<footer>
```

| 字段 | 规则 |
|---|---|
| `type` | feat / fix / docs / refactor / chore / data / test / perf / build |
| `scope` | 对象或模块 API name，如 `leads`、`accounts`、`docs`、`ci` |
| `subject` | 不超过 72 字，祈使句，首字母小写，结尾无句号 |
| `body` | 解释 *为什么*；引用相关 doc_id 与 issue |
| `footer` | `BREAKING CHANGE:` / `Closes #123` |

### 示例

```
feat(leads): add convert trigger and helper function

- 新增 lead_convert.trigger.yml，after update 触发
- 当 status 转为 qualified 时调用 leads.convert function
- 关联 FLOW-101 接受用例 AC-101-01..03

Closes #42
```

### 禁止

- 一次提交修改 > 400 行（除新增对象初始化）。
- 把元数据 + JS 实现 + 文档混在同一 commit；按层次拆分。
- 使用 `--amend` 修改已推送 commit；改用 `revert` 或新 commit。
- 任何未授权的破坏性命令（force-push、reset --hard、checkout --）。

## 3. PR 规范

### 3.1 标题

= 主 commit subject。

### 3.2 描述模板

```markdown
## 摘要
<3 句以内说明动机与范围>

## 变更点
- 元数据：<对象/字段/触发器列表>
- 文档：<新增/更新的 doc_id>
- 数据：<是否含 data.yml 变更>

## 关联
- Issue: #...
- Doc: <doc_id 列表>
- Flow: FLOW-...

## 验收
- [ ] `steedos restart` 无错误
- [ ] 手动用例：AC-...-... 通过
- [ ] 文档同步
- [ ] yamllint 通过
- [ ] Code Review 通过 [code-review.md](./code-review.md)

## 截图（可选）
```

### 3.3 大小

| 类型 | 期望规模 |
|---|---|
| 单对象骨架 | ≤ 600 行（含字段） |
| Trigger / Function | ≤ 300 行 |
| 文档 | ≤ 800 行 |
| 数据/种子 | ≤ 500 行 |

超出必须拆分。

### 3.4 评审要求

- 至少 1 名非作者评审通过。
- 涉及权限/数据模型变更：必须 Architect + Product Owner 双签。
- AI 生成的 PR：必须由人工审阅每一处差异，不允许"全部接受"。

## 4. 合入策略

- 默认 `Squash and merge`，保留 PR 标题与正文要点。
- 长期分支例外：`Rebase and merge`（仅在 release 切版时）。
- 合入后立即删除分支。

## 5. Hook（W2 落地）

- pre-commit：yamllint、markdownlint、文件大小检查。
- pre-push：禁止推送 `node_modules`、`.env`、`steedos-storage`。
- commit-msg：Conventional Commits 校验。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
