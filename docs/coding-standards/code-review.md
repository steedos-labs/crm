---
title: Code Review 规范
doc_id: CS-005
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Architect, Product Owner]
created: 2026-04-27
updated: 2026-04-27
related: [CS-000, CS-004, AIW-001]
---

# Code Review 规范

## 1. 目标

确保 AI 生成的元数据/代码/文档符合本项目规范，且业务行为符合产品意图。

## 2. 评审者职责

| 角色 | 关注点 |
|---|---|
| Tech Lead | 命名、目录、YAML 风格、对象关系一致性 |
| Architect | 性能、扩展性、依赖、版本兼容 |
| Product Owner | 业务流程是否符合 user story / FLOW |
| Security Reviewer | 权限、字段级敏感数据、审计 |

PR 必须有 Tech Lead 评审通过；权限或数据模型变更需 Architect 与 PO 同时通过。

## 3. 通用 Checklist

### 3.1 元数据

- [ ] 文件命名、目录、API name 全部满足 [naming.md](./naming.md) 与 [directory.md](./directory.md)。
- [ ] YAML 风格通过 yamllint。
- [ ] `is_name`、`enable_search`、`enable_audit` 等关键开关合理。
- [ ] Lookup `reference_to` 指向已存在对象。
- [ ] 公式字段语义正确，并在 [data-model/<object>.md](../data-model/) 记录。
- [ ] Listview 含必要的 columns / filter_scope / sort。
- [ ] Permission 字段权限与 [permissions/permission-model.md](../permissions/permission-model.md) 一致。

### 3.2 触发器 / 函数

- [ ] 触发器 `when` 选择正确（before/after × insert/update/delete）。
- [ ] 函数无副作用泄漏（不修改无关对象）。
- [ ] 错误统一抛出 `CRM_<MODULE>_<NAME>` 错误码（[api/README.md](../api/README.md)）。
- [ ] 含手动测试用例（关联 FLOW 文档 AC-xx）。
- [ ] 长事务/批量操作有上限保护（如 `members.length <= 1000`）。

### 3.3 文档

- [ ] frontmatter 完整（doc_id、version、status、owner、reviewers、related）。
- [ ] 变更记录追加新版本。
- [ ] 与本次 PR 元数据变更同步（无遗漏字段、无失效引用）。

### 3.4 数据

- [ ] data.yml 不含真实客户 PII。
- [ ] 引用的对象/字段存在。
- [ ] 数据规模 ≤ 各对象初始化建议（leads ≤ 50、accounts ≤ 20 等）。

## 4. AI 生成专项

AI 输出常见问题，必须重点排查：

| 风险 | 检查 |
|---|---|
| 幻觉字段 | 字段名/类型在 Steedos `object-fields` skill 中存在 |
| 关系闭环失败 | lookup 双向是否一致；删除策略 (`onDelete`) 合理 |
| 权限默认过宽 | 默认 `modifyAllRecords` 必须为 false |
| 公式硬编码 | 不要在 formula 中写魔法数字，提取为字段或常量 |
| 重复定义 | 同字段在 fields 段与 fields/ 目录同时出现 |
| 文档与代码漂移 | data-model.md / API 表中字段与 yml 一致 |

## 5. 审批流程

1. 作者自检（用本文档 §3 + §4 自查）→ 在 PR 描述勾选。
2. 评审人逐项验证；在 GitHub Review 中给出 `request_changes` / `approve`。
3. 任意 `request_changes` 未消解前禁止合入。
4. 合入后由作者在 [project-management/change-log.md](../project-management/change-log.md) 记录条目。

## 6. 拒绝合入的硬条件

- 启动报错（`steedos restart` 失败）。
- yamllint / markdownlint 失败。
- 缺少手动验收用例。
- 修改了既有字段类型或删除字段而未提供迁移说明。
- 未链接 doc_id。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
