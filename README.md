# CRM

基于 Steedos 开发的 CRM 应用模板，目标是主要通过 AI Agent 完成系统设计、元数据建模、页面配置和业务功能开发。

## 项目目标

本项目用于构建一套可维护、可扩展的 CRM 系统。开发时优先采用 Steedos 元数据驱动模式，能通过对象、字段、权限、列表视图、应用、页签和 Amis 页面配置实现的能力，不优先编写自定义代码。

## 技术栈

- 平台：Steedos
- 后端：Node.js、TypeScript/JavaScript、Moleculer 服务
- 前端：Steedos 页面、Amis
- 元数据：YAML
- 数据库：MongoDB；业务数据可按项目配置扩展 PostgreSQL/MySQL

## 目录约定

项目采用标准 Steedos 结构：

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
├── .github/copilot-instructions.md
└── CLAUDE.md
```

## 开发约定

- 所有自定义业务对象和表的 API 名必须以 `crm_` 开头，例如 `crm_leads`、`crm_accounts`、`crm_contacts`、`crm_opportunities`。
- 所有项目文档、说明、开发指南和 AI 指令必须使用中文。
- 每个业务对象都必须配置权限和实用的列表视图。
- 不要创建无法从应用导航访问的孤立元数据。
- 不要提交密钥或 `.env` 文件。

## AI 开发指令

- Copilot 项目指令：`.github/copilot-instructions.md`
- Claude Code 项目指令：`CLAUDE.md`

AI Agent 在本仓库中开发时必须遵循以上指令文件，尤其是 Steedos 元数据优先、`crm_` 前缀和中文文档要求。

## 常用命令

项目初始化后优先使用 `package.json` 中已有脚本。常见命令如下：

```bash
npm install
npm start
npm run build
```

如果当前阶段尚未创建 `package.json` 或 Steedos 配置文件，应先按 Steedos 项目结构补齐基础工程文件。
