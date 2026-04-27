# CRM 项目 AI 开发指令

本仓库是基于 Steedos 开发的 CRM 应用，目标是主要通过 AI Agent 完成开发。所有编码、配置、元数据和文档工作都必须遵循本项目级系统提示词。

## 主要目标

基于 Steedos 构建可维护的 CRM 系统。优先采用元数据驱动开发，能用 Steedos 声明式元数据、YAML 配置和 Amis 低代码页面完成的需求，不要优先编写命令式代码。

## 技术栈

- 平台：Steedos
- 后端：Node.js、TypeScript/JavaScript、Moleculer 服务
- 前端：Steedos 页面和 Amis Schema
- 元数据：Steedos 包中 `main/default` 目录下的 YAML 文件
- 存储：Steedos 元数据使用 MongoDB；业务数据可按配置使用 PostgreSQL/MySQL

## 仓库结构

使用标准 Steedos 项目结构：

```text
.
├── package.json
├── steedos-config.yml
├── steedos-packages/
│   └── <package>/
│       ├── package.json
│       ├── package.service.js
│       └── main/default/
│           ├── objects/
│           ├── applications/
│           ├── tabs/
│           ├── pages/
│           ├── triggers/
│           ├── functions/
│           ├── permissionsets/
│           └── data/
└── .github/copilot-instructions.md
```

如果缺少必需的项目文件，应按 Steedos 约定创建，不要自创框架结构。

## Steedos 元数据约定

- 在 `objects/<object_name>/` 中定义数据模型。
- 所有自定义业务对象和表的 API 名必须以 `crm_` 开头，例如 `crm_leads`、`crm_accounts`、`crm_contacts`、`crm_opportunities`。
- 不要创建未使用 `crm_` 前缀的 CRM 自定义对象、数据库表、种子数据文件、导航页签、页面、函数或引用。
- 使用现代拆分式元数据文件：
  - 字段：`objects/<object_name>/fields/<field_name>.field.yml`
  - 列表视图：`objects/<object_name>/listviews/<view_name>.listview.yml`
  - 权限：`objects/<object_name>/permissions/<permission>.permission.yml`
  - 按钮：`objects/<object_name>/buttons/<button_name>.button.yml`
- 在 `main/default/applications/*.app.yml` 中定义应用。
- 在 `main/default/tabs/*.tab.yml` 中定义导航页签。
- 在 `main/default/pages/` 中用成对的 `.page.yml` 和 `.page.amis.json` 文件定义自定义页面。
- 在 `main/default/triggers/*.trigger.yml` 中定义触发器。
- 在 `main/default/functions/*.function.yml` 中定义函数。
- 在 `main/default/data/` 中定义种子数据。

## CRM 领域原则

- 按需显式建模 CRM 概念：线索、客户、联系人、商机、活动、任务、产品、合同、发票和客户服务记录。
- API 名使用清晰英文，中文界面标签必须使用中文。
- CRM 实体之间优先使用 lookup 或 master-detail 关系，不要重复存储关联数据。
- 保留业务记录的可审计性；除非需求明确要求，否则避免破坏性更新。
- 每个业务对象都必须配置权限，确保可见性和增删改查行为是有意设计的。
- 每个需要用户浏览的对象都必须配置实用的列表视图。

## 文档要求

- 所有项目文档、说明、开发指南和 AI 指令都必须使用中文。
- 只有代码标识符、API 名、命令、文件路径、配置键和第三方产品名可以保留英文。
- 新增或更新文档时，优先写清楚业务含义、使用方式和约束条件。

## AI 开发流程

- 修改代码前先检查现有文件，并遵循当前项目模式。
- 遇到 Steedos 相关任务时，如果有可用的 Steedos skill 或参考资料，先使用再实现。
- 优先按小而完整的增量交付：对象 → 字段 → 权限 → 列表视图 → 页签/页面 → 种子数据 → 验证。
- 不要创建无法从应用导航访问的孤立元数据。
- 修改元数据或服务端代码后，如果项目已有命令，应重启或验证 Steedos 项目。
- 生成内容必须确定、稳定、易审查。

## 编码规范

- Steedos 元数据使用 YAML，并保持格式一致。
- 只有声明式元数据无法表达行为时，才使用 JavaScript/TypeScript。
- 避免宽泛的 `try/catch` 和静默失败；校验错误必须清晰暴露。
- 不要提交密钥；`.env` 仅用于本地，并使用文档化的环境变量。
- 不要添加不必要的依赖。
- 注释要少，只为不明显的业务逻辑添加说明。

## 构建与验证

- 如果存在 `package.json`，优先使用其中已有脚本。
- 常见命令包括：
  - `npm install`
  - `npm start`
  - `npm run build`
- 除非任务需要，不要引入新的构建、检查或测试工具。

## 输出要求

- 交付可运行的 Steedos 元数据和配置，不要只给解释。
- 只有在能帮助后续 AI Agent 或开发者使用功能时，才更新相关文档。
- 实现总结要说明具体修改的文件和新增的业务能力。
