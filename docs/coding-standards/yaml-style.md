---
title: YAML 风格规范
doc_id: CS-003
version: 0.1.0
status: draft
owner: Tech Lead
reviewers: [Architect]
created: 2026-04-27
updated: 2026-04-27
related: [CS-000]
---

# YAML 风格规范

适用于本项目所有 `*.yml` 元数据文件。

## 1. 基础

| 项 | 规则 |
|---|---|
| 缩进 | 2 空格，禁止 TAB |
| 字符集 | UTF-8，不带 BOM |
| 行尾 | LF（Unix） |
| 结尾 | 文件末尾必须有一个空行 |
| 行宽 | ≤ 120 列；超长 label/description 用 `>` 折行 |

## 2. 引号

- 字符串默认不加引号。
- 出现以下情形必须加双引号：
  - 含 `:`、`#`、`{`、`}`、`[`、`]`、`,`、`&`、`*`、`?`、`|`、`-`、`<`、`>`、`=`、`!`、`%`、`@`、`` ` `` 或前导/尾随空白
  - 全数字但表达字符串（如 `"01"`）
  - 布尔保留字面（`"yes"`、`"no"`、`"on"`、`"off"`）当字符串使用
- 多行内容用 `|`（保留换行）或 `>`（折叠为空格），按语义选择。

## 3. 布尔与空值

- 布尔统一写 `true` / `false`。禁用 `yes/no/on/off`。
- 空值用 `null` 不用 `~`。多数情况下应直接省略键。

## 4. 键顺序（对象 / 字段）

### 4.1 `*.object.yml`

```yaml
name:
label:
icon:
description:
enable_search: true
enable_tree: false
enable_chatter: true
enable_audit: true
list_views:
  default:
sidebar:
  type:
fields: []
```

### 4.2 `*.field.yml`（字段块）

```yaml
name:
label:
type:
required:
sortable:
searchable:
index:
omit:
hidden:
readonly:
defaultValue:
options:           # for select
reference_to:      # for lookup/master_detail
filtersFunction:
formula:
amount_field:      # for currency
scale:
precision:
```

> 不存在的属性直接省略，不写空值。

### 4.3 `*.permissionset.yml` / 对象 `*.permission.yml`

```yaml
name:
label:
license:
profiles: []
allowCreate: true
allowRead: true
allowEdit: true
allowDelete: false
modifyAllRecords: false
viewAllRecords: false
field_permissions:
  - field:
    readable: true
    editable: false
```

## 5. 列表与映射

- 列表项前空格 + 短横：`- name: foo`。
- 单行短列表可用 flow `[a, b, c]`，但 ≥ 4 项或含字典必须用块式。
- 字典中布尔/数字键禁用，必须用字符串。

## 6. 注释

- 仅在配置存在非显然约束时添加。
- 行内注释前必须有两个空格：`field: value  # 说明`。
- 不写"该字段是 xxx"这种从 label 即可推断的注释。

## 7. 国际化

- `label` 写默认语言（中文）。
- 多语言一律放在 `translations/<lang>.translation.yml`，禁止在对象 yml 中混杂语言后缀。

## 8. 公式与表达式

- 公式字段 `formula:` 用 `|` 多行，不缩进 yaml 之外内容：

  ```yaml
  formula: |
    IF(stage == 'closed_won', 1.0,
       IF(stage == 'negotiation', 0.7, 0.3))
  ```

- 复杂公式拆分为辅助字段，避免嵌套 > 3 层。

## 9. Lint

CI 集成 `yamllint`，配置见 `.yamllint.yml`（W2 落地）。规则严格度：

- `indentation: spaces=2`
- `line-length: max=120`
- `truthy: allowed-values=[true, false]`
- `key-duplicates: enable`
- `trailing-spaces: enable`
- `new-line-at-end-of-file: enable`

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
