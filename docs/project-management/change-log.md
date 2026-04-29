# 变更记录

## 记录规则

当需求、设计、对象模型、权限策略、交付范围或验收标准发生变化时，必须在本文件记录。AI Agent 开发前应先检查本文件，避免按旧设计继续实现。

## 2026-04-29：完成第二阶段销售过程交付

- 变更类型：数据模型 / 自动化 / 计划
- 影响范围：`steedos-packages/crm/main/default/objects/` 下 `crm_opportunities`、`crm_opportunity_products`、`crm_activities`、`crm_tasks`；`steedos-packages/crm/main/default/functions/crm_leads_convert.function.yml`；`crm.app.yml`；`tabs/object_crm_*.tab.yml`；`tasks.md`、`phase-2-sales.md`
- 变更原因：执行第二阶段「销售过程」交付目标，完成 CRM-008 ~ CRM-012。
- 变更内容：
  - `crm_opportunities` 商机对象：对象定义 + 11 个字段（含 `opportunity_number` 自动编号、`stage`、`amount`、`probability`、`expected_close_date`、`source_lead`、`primary_contact` 等）+ 4 个列表视图（全部 / 我的 / 进行中 / 赢单）+ 5 个权限文件。
  - `crm_opportunity_products` 商机产品对象：对象定义 + 6 个字段（`opportunity` master-detail、`product_name` 占位、`quantity`、`unit_price`、`amount` formula）+ 1 个列表视图 + 5 个权限文件。第三阶段引入 `crm_products` 后将把 `product_name` 替换为产品 lookup。
  - `crm_activities` 销售活动对象：对象定义 + 10 个字段（含 `activity_type` 拜访/电话/会议/邮件、关联客户/联系人/商机）+ 3 个列表视图 + 5 个权限文件。
  - `crm_tasks` 销售任务对象：对象定义 + 11 个字段（`assignee` 用户 lookup、`due_date`、`priority`、`status`、关联线索/客户/联系人/商机）+ 5 个列表视图（全部 / 我的 / 今日到期 / 逾期任务 / 已完成）+ 5 个权限文件。
  - 线索转化：在 `crm_leads` 上新增 `convert_lead` amis 按钮，弹出对话框收集客户名称、商机名称、预计金额和预计成交日期，提交到 REST function `POST /api/v6/functions/crm_leads/convert`；function 创建客户、联系人、商机并回写 `converted_account`、`converted_contact`、`converted_opportunity` 与 `status=converted`。已转化线索按钮自动隐藏。
  - CRM 应用导航新增「跟进」分组，整合销售活动和销售任务；销售分组新增商机和商机产品。
- 验证（API + 浏览器双验证）：
  - REST：`GET /api/v6/objects/crm_{opportunities,opportunity_products,activities,tasks}` 全部 200；CRUD 创建样本数据成功；`POST /api/v6/functions/crm_leads/convert` 一次性产出 `account_id`/`contact_id`/`opportunity_id` 并完成线索回写。
  - 浏览器：登录后侧边栏显示「客户 / 销售 / 跟进」三组共 7 个页签，列表视图渲染无「接口报错」；商机详情页正确显示 `OPP-20260429-0001`、来源线索 `LEAD-20260429-0001`、主要联系人「李四」、客户 lookup「潜在客户公司(转化)」；商机产品 `amount` 字段（formula）正确计算 `quantity * unit_price`。
- 已知修复点：
  - Steedos REST function 的 `_name` 等于 `name` 去掉 `<objectApiName>_` 前缀；URL 路径必须使用去前缀后的名字（即 `/api/v6/functions/crm_leads/convert`）。
  - 函数脚本中请求体在 `ctx.input`，而 `ctx.params` 仅含 `userId`/`spaceId`。
  - `formula` 字段使用 Salesforce 风格语法（裸变量名，如 `quantity * unit_price`），不要写 `${var}` 或 `{var}`。
  - `percent` 字段以 0~1 存储；`defaultValue: 0.1` 表示 10%。
- 后续动作：人工验收第二阶段任务后状态置为「已完成」；进入第三阶段（CRM-013 起）实现产品、价格表、报价、合同、发票。

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
- 验证：`npm install` 通过；本地启动 `mongod`/`redis-server` 后 `npm start` 完成元数据加载，CRM 包注入 `.steedos/steedos-packages.yml` 后 `service @crm/steedos-package-crm started`；REST `GET /api/v6/objects/crm_{accounts,contacts,leads}` 返回完整元数据；POST CRUD 写入成功；浏览器登录后进入「客户关系管理」应用，客户 / 联系人 / 线索三个列表页正常加载、字段渲染正确、`lead_number` 自动编号生效、`crm_contacts.account` lookup 正常显示关联客户。
- 已知修复：
  - `steedos-packages/crm/package.service.js` 增加 `@steedos/service-package-loader` mixin，否则元数据不会被扫描。
  - 新增 `.steedos/steedos-packages.yml` 注册 `@crm/steedos-package-crm` 为本地包；`steedos-config.yml` 中的 `metadata_packages` 字段并不被 Steedos 实际读取。
  - 列表视图 `sort` 块字段名修正为 `field_name`（对齐 Steedos schema）。
  - 在根 `package.json` 增加 `overrides.graphql=15.10.2`，统一 `@steedos/objectql` 与 `apollo-server` 树的 graphql 版本，修复浏览器侧 `POST /graphql 500`（"Cannot use GraphQLScalarType from another module or realm"）导致列表「接口报错：{}」。
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

