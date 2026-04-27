# CRM 文档中心

本目录是 Steedos CRM 项目的**单一事实来源 (Single Source of Truth)**。所有产品、技术、规范、项目管理文档由 Claude Code AI 协同维护，人工评审。

## 1. 目录结构

| 目录 | 内容 | 维护频率 |
|---|---|---|
| [product/](./product/) | 产品愿景、用户故事、功能清单、用户手册 | 每个 Sprint |
| [architecture/](./architecture/) | 总体架构、技术栈、部署拓扑、ER 图 | 重大变更时 |
| [data-model/](./data-model/) | 各对象字段表、关系、生命周期 | 每次对象变更 |
| [business-flows/](./business-flows/) | 业务流程图、用例、测试场景 | 每次流程变更 |
| [permissions/](./permissions/) | 角色矩阵、对象/字段权限、共享规则 | 每次权限变更 |
| [api/](./api/) | REST 接口、自定义 function、Webhook 契约 | 每次 API 变更 |
| [coding-standards/](./coding-standards/) | 命名、YAML 风格、提交、PR、Review 规范 | 季度评审 |
| [delivery/](./delivery/) | DoD、验收、发版流程、Checklist | 重大流程变更 |
| [project-management/](./project-management/) | Roadmap、Backlog、Sprint 日志、风险、ADR、会议 | 每周 |
| [ai-workflow/](./ai-workflow/) | AI 协作约定、提示词库、产物模板 | 持续 |

## 2. 文档约定

1. **语言**：默认中文；面向开发者的纯技术片段可保留英文。
2. **格式**：Markdown (CommonMark)，禁止 emoji，图表使用 Mermaid。
3. **文件名**：kebab-case，如 `lead-conversion.md`，避免空格。
4. **Front-matter**：所有受控文档以 YAML front-matter 开头（见下）。
5. **链接**：内部链接使用相对路径；外部链接附稳定 URL。
6. **引用**：引用代码用 `path:line` 形式，例如 `steedos-packages/crm/main/default/objects/leads/leads.object.yml:12`。

### 标准 Front-matter

```yaml
---
title: <文档标题>
doc_id: <模块前缀>-<编号>      # 如 ARCH-001 / PM-003
version: 0.1.0
status: draft | review | approved | deprecated
owner: <负责人>
reviewers: [<reviewer1>, <reviewer2>]
created: YYYY-MM-DD
updated: YYYY-MM-DD
related: [<doc_id>, ...]
---
```

## 3. 文档生命周期

```
draft → review → approved → (变更) → review → approved → deprecated
```

- **draft**：作者起草中，可随意修改。
- **review**：等待评审，禁止重写，只接受评审意见的修改。
- **approved**：进入受控状态，任何变更必须新增版本号并经过 review。
- **deprecated**：保留历史，标注替代文档。

## 4. 版本与变更

- 文档版本号采用 `MAJOR.MINOR.PATCH`：
  - MAJOR：结构性变更，影响多个下游文档。
  - MINOR：新增章节或新增内容。
  - PATCH：拼写、链接、轻微措辞修订。
- 重大变更需在文档底部追加 `## 变更记录` 表格。

## 5. 文档 ID 前缀

| 前缀 | 含义 | 示例目录 |
|---|---|---|
| PROD | 产品 | product/ |
| ARCH | 架构 | architecture/ |
| DM | 数据模型 | data-model/ |
| FLOW | 业务流程 | business-flows/ |
| PERM | 权限 | permissions/ |
| API | API | api/ |
| CS | 编码规范 | coding-standards/ |
| DEL | 交付 | delivery/ |
| AIW | AI 工作流 | ai-workflow/ |
| PM | 项目管理 | project-management/ |
| ADR | 架构决策 | project-management/adr/ |

## 6. 索引

- 全局路线图：[project-management/roadmap.md](./project-management/roadmap.md)
- 任务总表：[project-management/tasks.md](./project-management/tasks.md)
- 风险登记：[project-management/risks.md](./project-management/risks.md)
- 当前 Sprint：[project-management/sprints/](./project-management/sprints/)（模板：[_template.md](./project-management/sprints/_template.md)）
- 会议纪要：[project-management/meetings/](./project-management/meetings/)（模板：[_template.md](./project-management/meetings/_template.md)）
- 变更记录：[project-management/change-log.md](./project-management/change-log.md)
- 决策记录索引：[project-management/adr/README.md](./project-management/adr/README.md)
- 编码规范：[coding-standards/naming.md](./coding-standards/naming.md) · [coding-standards/directory.md](./coding-standards/directory.md)
- 数据模型：[data-model/README.md](./data-model/README.md)
- 权限模型：[permissions/permission-model.md](./permissions/permission-model.md)
- AI 工作流：[ai-workflow/README.md](./ai-workflow/README.md) · [prompts/](./ai-workflow/prompts/)
- 交付与验收：[delivery/README.md](./delivery/README.md)
