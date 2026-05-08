# CRM —— AI 自动化编程实践项目

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/steedos-labs/crm)

> **本项目是一个 AI 自动化编程的示范项目。** 从系统设计、数据建模、权限配置、页面搭建到业务逻辑，**全部由 AI Agent（GitHub Copilot / Claude Code 等）自动生成和维护**，人工只负责需求描述和最终验收。

## 什么是 AI 自动化编程？

传统软件开发需要工程师手写每一行代码；本项目证明，通过结构化的 AI 提示词和 Steedos 低代码平台，可以让 AI Agent 完整承担：

- **需求分析** → AI 根据业务描述生成设计文档
- **数据建模** → AI 生成对象、字段、关系的 YAML 元数据
- **权限配置** → AI 为每个角色生成增删改查权限
- **页面搭建** → AI 用 Amis Schema 搭建列表、详情、表单页面
- **业务逻辑** → AI 编写触发器、函数等服务端代码
- **测试验证** → AI 生成端到端测试并在 CI 中自动执行

人工只需要：**用中文描述需求 → 审核 AI 的输出 → 给出反馈**。

## 一键运行（GitHub Codespaces）

点击上方徽章或在仓库页选择 **Code → Codespaces → Create codespace**，环境会自动：

1. 安装 Node.js 20 + pnpm 9
2. 复制 `.env.example` 为 `.env`
3. 执行 `pnpm install`（会顺带下载内嵌的 MongoDB / Redis 二进制）

启动完成后**开两个终端**：

```bash
# 终端 A：启动开发依赖（嵌入式 MongoDB 副本集 + Redis），保持前台运行
pnpm dev:deps

# 终端 B：启动 Steedos（监听元数据热重载）
pnpm dev
```

`pnpm dev:deps` 通过 `mongodb-memory-server`（副本集模式，支持事务）和 `redis-memory-server` **在 Node 进程内拉起内嵌依赖**，无需 Docker，并把连接地址写入 `.env.local`，`pnpm dev` / `pnpm start` 会自动读取。

数据默认持久化到 `./.steedos/dev-db`。设置 `EPHEMERAL=1 pnpm dev:deps` 可改为纯内存模式（退出即清空）。Ctrl+C 停止 `dev:deps` 时会自动清理 `.env.local` 中由它管理的段（不影响你手写的其他变量）。

VS Code 会自动转发 `5100` 端口并打开浏览器。

如果机器上已经有 MongoDB / Redis（或想用 Docker），见下文「常用命令」表格。

## 项目目标

用 AI 自动化编程构建一套可维护、可扩展的 CRM 系统，验证"**人工写需求、AI 写代码**"这一开发模式在真实业务场景中的可行性。

- 开发过程优先采用 Steedos **元数据驱动**模式（YAML 配置、Amis 页面），最大化 AI 生成的稳定性和可审查性。
- 只有声明式配置无法表达时，才由 AI 生成 JavaScript/TypeScript 代码。
- 所有代码、配置、文档均由 AI 产出，通过 CI 自动验证，人工只做需求描述和验收。

##  安装 Skills（AI 专用）

在 Copilot / Claude Code 等 AI 工具中执行以下命令，为 AI Agent 安装 Steedos 知识库，使 AI 能精准生成符合平台规范的元数据：

```
npx skills add steedos/steedos-platform
```

## AI 自动化开发提示词

以下提示词**按顺序**发给 AI，可驱动 AI 从零完成整个 CRM 项目：

| 步骤 | 提示词 |
|------|--------|
| 1 | 帮我初始化为 steedos 项目。 |
| 2 | 本项目基于 steedos 开发 CRM 应用，目标全部使用 AI 开发，请帮我初始化系统提示词。 |
| 3 | 做整体设计，编写设计文档。 |
| 4 | 整个项目由 AI 开发，帮我编写开发计划，以便于我逐条验收开发任务。 |
| 5 | 完成第一阶段的开发。 |
| 6 | 在我本地安装 MongoDB、Redis。 |
| 7 | 启动服务，测试确认。 |
| 8 | 使用 chrome mcp 在浏览器中测试。 |

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

AI Agent 在本仓库中开发时，必须遵循以下指令和文档，确保 AI 产出的元数据符合平台规范、可追溯、可验收：

| 文档 | 用途 |
|------|------|
| `.github/copilot-instructions.md` | GitHub Copilot 项目级系统提示词 |
| `CLAUDE.md` | Claude Code 项目级指令 |
| `docs/design.md` | 总体设计文档（AI 生成） |
| `docs/project-management/roadmap.md` | 项目路线图（AI 生成） |
| `docs/project-management/tasks.md` | 任务进度（AI 维护） |
| `docs/project-management/acceptance-checklist.md` | 通用验收清单（人工审核） |
| `docs/project-management/change-log.md` | 变更记录（AI 维护） |

**核心约定（AI 必须遵守）：**
- Steedos 元数据优先，YAML 配置优于手写代码
- 所有自定义对象 API 名必须以 `crm_` 开头
- 所有文档必须使用中文

## 常用命令

项目脚本遵循主流约定：`pnpm dev` 是开发循环（启动应用并热重载），不再附带拉起依赖；起依赖单独用 `pnpm dev:deps` 或 `pnpm deps:up`。按场景选择：

| 场景 | 命令 |
|---|---|
| 标准开发循环（最常用） | 终端 A `pnpm dev:deps`（嵌入式 mongo+redis，写 `.env.local`）<br/>终端 B `pnpm dev`（`steedos start`，监听元数据热重载） |
| 已用 Docker 跑 mongo/redis | `pnpm deps:up` 起容器 → `pnpm dev` |
| 类生产 / 对接外部依赖 | 按 `.env.example` 配 `MONGO_URL` / `TRANSPORTER` / `CACHER`（注意 mongo 必须副本集），再 `pnpm start` |
| 元数据离线校验 | `pnpm test`（无外部依赖，387 项校验） |
| MongoDB 连通性烟雾测试 | `pnpm test:mongo` |
| 端到端业务链路测试 | `pnpm test:e2e`（自带嵌入式 mongo+redis+steedos） |

```bash
pnpm install
pnpm dev:deps     # 终端 A：嵌入式 MongoDB（副本集）+ Redis，前台运行
pnpm dev          # 终端 B：steedos start（开发模式，监听元数据热重载）
pnpm start        # 等价于 pnpm dev，按主流约定用于"无 watch 语义"的标准启动
pnpm deps:up      # 用 Docker 起 mongo+redis（副本集自动 init）
pnpm deps:down    # 停止并清理 docker compose
pnpm test         # 元数据校验
pnpm test:mongo   # MongoDB 连通性
pnpm test:e2e     # 端到端业务链路测试
```

### 说明

- **`pnpm dev` 不再嵌入依赖**：与 Next.js / Vite / Strapi / NocoBase 等保持一致；不会和你本地已经在运行的 MongoDB / Redis 冲突
- **`pnpm dev:deps` 端口非默认**：MongoDB `27027`、Redis `6399`，避免和本地常驻服务（27017 / 6379）打架；可通过 `DEV_MONGO_PORT` / `DEV_REDIS_PORT` 覆盖
- **`.env.local` 自动管理**：`pnpm dev:deps` 启动时把连接 URL 以受管段（`# >>> pnpm dev:deps managed >>>`）写入 `.env.local`，Ctrl+C 停止时只清理这个段，**不会动你手写的其他变量**
- **MongoDB 必须副本集**：Steedos 的 `service-core-objects`、`ai` 等模块用事务，事务只能在副本集/分片下使用。`pnpm dev:deps` 用 `MongoMemoryReplSet`，`docker-compose.yml` 用 `mongo:7 --replSet rs0` 并在 healthcheck 里幂等地 `rs.initiate()`

`pnpm test` 会执行 `scripts/test-metadata.js`，对 CRM 元数据进行基础校验（JSON/YAML 解析、`crm_` 前缀、对象目录结构、应用页签注册等），无需任何外部依赖。

`pnpm test:mongo` 会执行 `scripts/test-mongo.js`，校验 `MONGO_URL` 指向的 MongoDB 端口可达。本地可先 `pnpm deps:up` 启动依赖，CI 则通过 GitHub Actions `services` 自动拉起 mongo:6 容器（见 `.github/workflows/ci.yml` 的 `mongo-smoke-test` 任务）。

`pnpm test:e2e` 会用 Vitest 启动一套完全自包含的 e2e：

- 通过 `mongodb-memory-server`（副本集模式，支持事务）和 `redis-memory-server` 在本进程内拉起 MongoDB 与 Redis；
- 在随机端口启动 `steedos start`，等待 `/api/health_check` + 注册接口就绪；
- 注册账号 → 创建租户 → 拿到 token，再以 `Bearer <spaceId>,<token>` 调用 v6 数据/函数 API；
- 串行执行 `tests/e2e/specs/10-crm-flow.spec.mjs` 中覆盖全部 15 个 CRM 业务对象的链路（线索→转化→客户/联系人→产品/价目表→商机/商机产品→报价/报价明细→合同→发票→服务工单触发器校验→活动/任务），最后做反向数据清理；
- 服务器日志写入 `.steedos/e2e-server.log`，CI 失败时会作为 artifact 上传。

整个 e2e **不会污染本地已有的 MongoDB / Redis**：内嵌 server 监听随机端口，运行结束自动关闭。

如果当前阶段尚未创建 `package.json` 或 Steedos 配置文件，应先按 Steedos 项目结构补齐基础工程文件。

