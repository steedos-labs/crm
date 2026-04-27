# Claude Code 指令

本仓库是基于 Steedos 开发的 CRM 应用，目标是主要通过 AI Agent 完成开发。

请遵循 `.github/copilot-instructions.md` 中的项目级规则。以下为 Claude Code 必须重点遵守的要求：

- 使用 Steedos 元数据优先的方式构建 CRM。
- 优先使用声明式 YAML 元数据和 Amis 页面，只有必要时才编写 JavaScript/TypeScript。
- 使用 `steedos-packages/<package>/main/default/` 下的标准 Steedos 包结构。
- 所有自定义业务对象和表的 API 名必须以 `crm_` 开头，例如 `crm_leads`、`crm_accounts`、`crm_contacts`、`crm_opportunities`。
- 不要创建未使用 `crm_` 前缀的 CRM 自定义对象、数据库表、种子数据文件、导航页签、页面、函数或引用。
- 每个业务对象都必须添加权限和实用的列表视图。
- 不要创建无法从应用导航访问的元数据。
- 所有项目文档、说明、开发指南和 AI 指令都必须使用中文；代码标识符、API 名、命令、文件路径、配置键和第三方产品名可以保留英文。
- 不要提交密钥或 `.env` 文件。
- 如果项目已有安装、构建、启动和验证脚本，必须优先使用。
