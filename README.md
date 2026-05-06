# CRM

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/steedos-labs/crm)

基于 Steedos 开发的 CRM 应用模板，目标是主要通过 AI Agent 完成系统设计、元数据建模、页面配置和业务功能开发。

## 一键运行（GitHub Codespaces）

点击上方徽章或在仓库页选择 **Code → Codespaces → Create codespace**，环境会自动：

1. 安装 Node.js 20 + pnpm 9
2. 复制 `.env.example` 为 `.env`
3. 执行 `pnpm install`（会顺带下载内嵌的 MongoDB / Redis 二进制）

启动完成后在终端运行：

```bash
pnpm dev
```

`pnpm dev` 会通过 `mongodb-memory-server` 和 `redis-memory-server` **在 Node 进程内拉起内嵌的 MongoDB 与 Redis**，无需 Docker 或本地服务，再启动 Steedos。VS Code 会自动转发 `5100` 端口并打开浏览器。

数据默认持久化到 `./.steedos/dev-db`。设置 `EPHEMERAL=1 pnpm dev` 可改为纯内存模式（退出即清空）。

如需对接已经在运行的真实 MongoDB / Redis，使用 `pnpm start` 并按 `.env.example` 配置 `MONGO_URL`、`TRANSPORTER`、`CACHER`。

## 项目目标

本项目用于构建一套可维护、可扩展的 CRM 系统。开发时优先采用 Steedos 元数据驱动模式，能通过对象、字段、权限、列表视图、应用、页签和 Amis 页面配置实现的能力，不优先编写自定义代码。

##  安装 Skills

```
npx skills add steedos/steedos-platform
```

## AI 自动化开发提示词

按顺序发给AI

- 帮我初始化为 steedos 项目。
- 本项目基于steedos开发crm应用，目标全部使用ai 开发，请帮我初始化系统提示词。
- 做整体设计，编写设计文档。
- 整个项目由 ai 开发，帮我编写开发计划，以便于我逐条验收开发任务。
- 完成一阶段的开发。
- 在我本地安装 mongodb , redis
- 启动服务，测试确认。
- 使用 chrome mcp 在浏览器中测试

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

## AI 相关文档

- Copilot 项目指令：`.github/copilot-instructions.md`
- Claude Code 项目指令：`CLAUDE.md`
- 总体设计文档：`docs/design.md`
- 项目路线图：`docs/project-management/roadmap.md`
- 任务进度：`docs/project-management/tasks.md`
- 通用验收清单：`docs/project-management/acceptance-checklist.md`
- 变更记录：`docs/project-management/change-log.md`

AI Agent 在本仓库中开发时必须遵循以上指令文件，尤其是 Steedos 元数据优先、`crm_` 前缀和中文文档要求。

## 常用命令

项目初始化后优先使用 `package.json` 中已有脚本。常见命令如下：

```bash
pnpm install
pnpm dev          # 一键启动（内嵌 MongoDB + Redis，无需 Docker）
pnpm start        # 使用 .env 中外部 MongoDB / Redis 启动
pnpm run build
pnpm test
pnpm test:mongo
pnpm test:e2e     # 端到端业务链路测试（自动拉起内嵌 MongoDB / Redis 与 Steedos）
```

`pnpm test` 会执行 `scripts/test-metadata.js`，对 CRM 元数据进行基础校验（JSON/YAML 解析、`crm_` 前缀、对象目录结构、应用页签注册等），无需任何外部依赖。

`pnpm test:mongo` 会执行 `scripts/test-mongo.js`，校验 `MONGO_URL` 指向的 MongoDB 端口可达。本地可先 `docker compose up -d mongo` 启动依赖，CI 则通过 GitHub Actions `services` 自动拉起 mongo:6 容器（见 `.github/workflows/ci.yml` 的 `mongo-smoke-test` 任务）。

`pnpm test:e2e` 会用 Vitest 启动一套完全自包含的 e2e：

- 通过 `mongodb-memory-server`（副本集模式，支持事务）和 `redis-memory-server` 在本进程内拉起 MongoDB 与 Redis；
- 在随机端口启动 `steedos start`，等待 `/api/health_check` + 注册接口就绪；
- 注册账号 → 创建租户 → 拿到 token，再以 `Bearer <spaceId>,<token>` 调用 v6 数据/函数 API；
- 串行执行 `tests/e2e/specs/10-crm-flow.spec.mjs` 中覆盖全部 15 个 CRM 业务对象的链路（线索→转化→客户/联系人→产品/价目表→商机/商机产品→报价/报价明细→合同→发票→服务工单触发器校验→活动/任务），最后做反向数据清理；
- 服务器日志写入 `.steedos/e2e-server.log`，CI 失败时会作为 artifact 上传。

整个 e2e **不会污染本地已有的 MongoDB / Redis**：内嵌 server 监听随机端口，运行结束自动关闭。

如果当前阶段尚未创建 `package.json` 或 Steedos 配置文件，应先按 Steedos 项目结构补齐基础工程文件。

