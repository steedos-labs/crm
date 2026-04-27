---
title: 提示词 - 新建对象
doc_id: AIW-PROMPT-NEW-OBJECT
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Architect]
created: 2026-04-27
updated: 2026-04-27
related: [AIW-001, CS-001, CS-002, DM-001]
---

# Prompt：新建业务对象

## 何时使用

新增一个 CRM 业务对象（线索/客户/合同等）时调用本模板，目标产出 = 一个 `crm_<plural>` 对象目录、字段、listview、permission，并同步 data-model 文档。

## 必读上下文（AI 调用前自行读取）

- [docs/coding-standards/naming.md](../../coding-standards/naming.md)
- [docs/coding-standards/directory.md](../../coding-standards/directory.md)
- [docs/coding-standards/yaml-style.md](../../coding-standards/yaml-style.md)
- [docs/data-model/README.md](../../data-model/README.md)
- [docs/permissions/permission-model.md](../../permissions/permission-model.md)

## 输入字段（人填写）

| 字段 | 必填 | 示例 |
|---|---|---|
| 业务名（中文） | 是 | 线索 |
| API name | 是 | `crm_leads` |
| 名称字段类型 | 是 | autonumber `LEAD-{0000}` / text |
| 主要字段（≥3） | 是 | company / first_name / email / status / score / owner |
| 关系 | 否 | converted_account → crm_accounts (lookup) |
| 角色权限差异 | 是 | 见 PERM-001 §3 |
| 是否 Sprint 范围 | 是 | W1 / W2 / W3 / W4 |

## 期望产出

```
steedos-packages/crm/main/default/objects/<api_name>/
├── <api_name>.object.yml
├── fields/
│   ├── <field>.field.yml
│   └── …
├── listviews/
│   └── all.listview.yml
└── permissions/
    ├── crm_admin.permission.yml
    ├── crm_sales_manager.permission.yml
    └── …（覆盖所有相关角色）
```

并同步：

- 新建 `docs/data-model/<api_name>.md`（字段表 + 生命周期）。
- 在 [docs/data-model/README.md](../../data-model/README.md) §对象清单追加一行。
- 在 [docs/project-management/tasks.md](../../project-management/tasks.md) 把对应任务标 `done`。

## 验收

- [ ] `steedos restart` 无报错；左侧菜单出现该对象 Tab（如已注册 application/tab）。
- [ ] 列表页可新建/编辑/删除一条记录。
- [ ] 不同角色登录权限矩阵符合 PERM-001。
- [ ] yamllint / markdownlint 通过。
