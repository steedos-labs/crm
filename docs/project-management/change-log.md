# 变更记录

## 记录规则

当需求、设计、对象模型、权限策略、交付范围或验收标准发生变化时，必须在本文件记录。AI Agent 开发前应先检查本文件，避免按旧设计继续实现。

## 变更模板

```markdown
## YYYY-MM-DD：变更标题

- 变更类型：需求 / 设计 / 数据模型 / 权限 / 计划 / 验收
- 影响范围：
- 变更原因：
- 变更内容：
- 后续动作：
```

## 2026-04-27：初始化 AI 开发规则

- 变更类型：计划
- 影响范围：全项目
- 变更原因：项目目标为主要通过 AI Agent 完成 CRM 开发。
- 变更内容：
  - 新增 Copilot 项目指令 `.github/copilot-instructions.md`。
  - 新增 Claude Code 项目指令 `CLAUDE.md`。
  - 明确所有自定义业务对象和表名必须使用 `crm_` 前缀。
  - 明确所有项目文档必须使用中文。
- 后续动作：后续任务必须先读取 AI 指令、总体设计和项目管理文档。

## 2026-04-27：文档体系模块化重构 + `crm_` 前缀强约束

- 变更类型：设计 / 计划
- 影响范围：全部 docs/、命名规范、对象 API、权限矩阵
- 变更原因：原 `docs/design.md` 单文件聚合无法支撑企业级评审；多包共存需要稳定命名空间。
- 变更内容：
  - 拆分 `docs/` 为 architecture / data-model / business-flows / permissions / api / coding-standards / delivery / ai-workflow / project-management / product 模块，每文档带 doc_id + 版本 + 生命周期。
  - 新增 [coding-standards/directory.md](./coding-standards/directory.md)（CS-002）、[coding-standards/naming.md](./coding-standards/naming.md)（CS-001）、ADR-0001..0004。
  - 统一所有业务对象、应用、角色 API name 至 `crm_` 前缀（详见 [ADR-0004](./adr/0004-object-naming-prefix.md)）。
  - 新增 [risks.md](./risks.md)、sprints/meetings 模板、[ai-workflow/prompts/](../ai-workflow/prompts/) 7 个提示词。
- 后续动作：W1 启动前完成 `docs/README.md` 索引刷新；CI 落地 yamllint + markdownlint + 命名前缀校验。

## 2026-04-29：完成第一阶段全部开发交付

- 变更类型：数据模型 / 权限 / 计划
- 影响范围：`steedos-packages/crm/main/default/objects/` 下 `crm_accounts`、`crm_contacts`、`crm_leads`；`docs/project-management/tasks.md`、`docs/project-management/sprints/phase-1-foundation.md`
- 变更原因：执行第一阶段「基础工程和主数据」交付目标，完成 CRM-005、CRM-006、CRM-007。
- 变更内容：
  - `crm_accounts` 客户对象：对象定义 + 10 个字段（含 `account_number` 自动编号、`account_type`、`industry`、`level`、`status` 等）+ 3 个列表视图（全部客户、我的客户、重点客户）+ 5 个权限文件（admin / 销售经理 / 销售人员 / 服务人员 / 财务人员）。
  - `crm_contacts` 联系人对象：对象定义 + 9 个字段（`account` 关联客户、`is_primary`、`status` 等）+ 3 个列表视图（全部、我的、主要联系人）+ 5 个权限文件。
  - `crm_leads` 线索对象：对象定义 + 13 个字段（含 `lead_number` 日期自动编号、`source`、`status`、`converted_account/contact/opportunity` 转化引用）+ 4 个列表视图（全部、我的、待跟进、已转化）+ 5 个权限文件。
  - CRM-001 ~ CRM-007 状态由「待开始」更新为「待验收」。
  - 三个对象均在 `crm.app.yml` 中已通过既有页签 `object_crm_*` 接入侧边栏导航。
- 验证：`npm install` 通过；`npm start` 启动到 Steedos 元数据加载阶段无 YAML 解析或元数据校验报错；后续连接 MongoDB / Redis 失败属于本机基础设施缺失，非元数据问题。
- 后续动作：人工验收第一阶段任务后状态置为「已完成」；进入第二阶段销售过程开发（CRM-008 起）。

## 2026-04-27：初始化总体设计和项目管理文档

- 变更类型：设计
- 影响范围：总体设计、任务管理、验收流程
- 变更原因：需要在项目内通过文档管理 AI 开发计划、进度和验收。
- 变更内容：
  - 新增 `docs/design.md` 作为总体设计基线。
  - 新增 `docs/project-management/roadmap.md` 管理阶段路线。
  - 新增 `docs/project-management/tasks.md` 管理总任务清单和状态。
  - 新增 `docs/project-management/acceptance-checklist.md` 管理通用验收标准。
  - 新增阶段任务文档。
- 后续动作：每次开发前从 `tasks.md` 领取一个待开始任务。

