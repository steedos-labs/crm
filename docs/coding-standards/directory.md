---
title: 目录结构规范
doc_id: CS-002
version: 0.1.0
status: draft
owner: Architect
reviewers: [Tech Lead]
created: 2026-04-27
updated: 2026-04-27
related: [CS-000, CS-001, ARCH-001]
---

# 目录结构规范

## 1. 仓库根

```
crm/
├── package.json                # 工作区根，依赖 @steedos/server
├── pnpm-workspace.yaml         # workspace 声明（可选）
├── steedos-config.yml          # 项目级配置
├── .env.example                # MONGO_URL / ROOT_URL / B6_TRANSPORTER / B6_CACHER
├── .gitignore
├── README.md
├── docs/                       # 见 §3
└── steedos-packages/
    └── crm/                    # 主业务包，见 §2
```

禁止在仓库根直接放业务元数据；元数据一律置于 `steedos-packages/<pkg>/main/default/` 之下。

## 2. Steedos 包内部布局

```
steedos-packages/crm/
├── package.json                # 名称 @<scope>/crm；声明依赖
├── package.service.js          # 包入口（如需）
└── main/default/
    ├── objects/                # 业务对象（每对象一目录，目录名 = `crm_<plural>`）
    │   └── crm_<object>/
    │       ├── crm_<object>.object.yml
    │       ├── fields/
    │       │   └── <field>.field.yml
    │       ├── listviews/
    │       │   └── <view>.listview.yml
    │       ├── permissions/
    │       │   └── <role>.permission.yml
    │       └── triggers/       # 仅放对象内联触发器（非全局）
    ├── triggers/               # 跨对象 / 全局触发器
    ├── functions/              # 自定义函数 (.function.yml + 同名 .js)
    ├── applications/           # *.app.yml
    ├── tabs/                   # *.tab.yml
    ├── pages/                  # *.page.yml + *.page.amis.json
    ├── permissionsets/         # *.permissionset.yml
    ├── dashboards/             # *.dashboard.yml
    ├── questions/              # *.question.yml
    ├── translations/           # i18n
    │   ├── zh-CN/
    │   └── en/
    └── data/                   # 种子数据 *.data.yml
```

### 2.1 对象目录硬性规则

- 每个对象一个独立目录，目录名 = 对象 API name（snake_case 复数）。
- 字段超过 5 个时，`fields/` 必须按字段拆文件；少于等于 5 个允许内嵌 `<object>.object.yml`，但需在 §对象级 ADR 注明。
- listview / permission 一律拆文件，不内嵌 object 主文件。
- 严禁在对象目录放置非该对象专属的元数据（如全局 dashboard）。

### 2.2 命名一致性

文件名前缀必须等于元数据 `name`/`api_name`。任何不一致由 yamllint 自定义规则在 PR 阶段拦截。

## 3. 文档目录

```
docs/
├── README.md                   # 索引（doc_id 前缀表）
├── architecture/               # ARCH-xxx
├── data-model/                 # DM-xxx（每对象一文件）
├── business-flows/             # FLOW-xxx
├── permissions/                # PERM-xxx
├── api/                        # API-xxx
├── coding-standards/           # CS-xxx
├── delivery/                   # DEL-xxx
├── ai-workflow/                # AIW-xxx
│   └── prompts/                # AI 调用模板
├── project-management/         # PM-xxx
│   ├── roadmap.md
│   ├── tasks.md
│   ├── change-log.md
│   ├── risks.md
│   ├── acceptance-checklist.md
│   ├── sprints/
│   ├── meetings/
│   └── adr/
└── product/                    # PROD-xxx
```

## 4. 不允许出现的目录/文件

| 路径 | 原因 |
|---|---|
| 任意 `node_modules/` 提交 | 应 ignore |
| `steedos-storage/` | 运行时数据 |
| `.env`（除 `.env.example`） | 含密钥 |
| 仓库根的 `objects/`、`triggers/` | 必须落到 package 内 |
| `docs/design.md`（旧版聚合文件） | 已拆分至模块化文档；新增内容禁止再写入 |

## 5. 新增模块工作流

1. 在对应目录新建文件（命名遵循 [naming.md](./naming.md)）。
2. 同步在 [data-model/](../data-model/) 或 [business-flows/](../business-flows/) 增/改文档。
3. 在 [project-management/tasks.md](../project-management/tasks.md) 追加任务条目，状态置为"开发中"。
4. 提交 PR，引用 doc_id。

## 6. 校验

CI（W5 起）执行：

- `find steedos-packages -name '*.yml' | xargs yamllint`
- `markdownlint 'docs/**/*.md'`
- 自定义脚本：检查文件名与 `name`/`api_name` 一致，对象目录是否含必需子目录。

## 变更记录

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1.0 | 2026-04-27 | 初稿 | AI |
