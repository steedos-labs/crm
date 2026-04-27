# CRM 系统总体设计

## 设计目标

本项目基于 Steedos 构建企业 CRM 应用，覆盖从线索获取、客户沉淀、联系人维护、商机推进、报价合同、开票回款到客户服务的核心业务闭环。系统优先采用 Steedos 元数据驱动方式实现，通过对象、字段、权限、列表视图、应用、页签、页面和种子数据完成主要功能。

核心目标如下：

- 建立统一的客户主数据，沉淀客户、联系人、商机和服务历史。
- 支持销售团队管理线索、商机、活动、任务、报价和合同。
- 支持管理层查看销售漏斗、业绩预测、客户服务和回款状态。
- 保持低代码可扩展能力，后续功能优先通过 Steedos 元数据迭代。
- 所有自定义业务对象和表名必须使用 `crm_` 前缀。
- 所有项目文档、说明和 AI 指令必须使用中文。

## 设计原则

- **元数据优先**：优先使用 Steedos 对象、字段、权限、列表视图、应用和 Amis 页面实现。
- **业务闭环**：围绕客户生命周期组织数据，不创建孤立业务对象。
- **可审计**：重要业务对象开启审计、回收站、附件和 API 能力。
- **可导航**：所有核心对象必须出现在 CRM 应用导航中。
- **可扩展**：对象命名、字段命名和关系设计保持清晰，便于后续 AI Agent 继续扩展。
- **权限明确**：每个业务对象都必须配置对象权限，避免默认暴露或不可用。

## 技术架构

### 平台架构

系统采用 Steedos 标准项目结构：

```text
.
├── package.json
├── steedos-config.yml
├── steedos-packages/
│   └── crm/
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
├── docs/
├── .github/copilot-instructions.md
└── CLAUDE.md
```

### 分层说明

| 层级 | 设计内容 |
| --- | --- |
| 应用层 | CRM 应用、侧边栏分组、对象页签、仪表盘页面 |
| 元数据层 | 对象、字段、列表视图、权限、按钮、页面、种子数据 |
| 服务层 | 必要时通过 Steedos functions 和 triggers 实现自动化 |
| 数据层 | Steedos 对象对应业务表，所有自定义对象使用 `crm_` 前缀 |

## 应用设计

### CRM 主应用

应用文件建议为 `steedos-packages/crm/main/default/applications/crm.app.yml`。

| 属性 | 建议值 |
| --- | --- |
| 应用名称 | 客户关系管理 |
| 应用代码 | `crm` |
| 图标 | `opportunity` |
| 颜色 | `orange` |
| 移动端 | 启用 |
| 侧边栏 | 启用 |

### 导航分组

CRM 应用侧边栏按业务场景分组：

| 分组 | 页签 |
| --- | --- |
| 首页 | CRM 首页、销售仪表盘 |
| 客户 | 客户、联系人 |
| 销售 | 线索、商机、销售活动、销售任务 |
| 产品报价 | 产品、价格表、报价、报价明细 |
| 合同财务 | 合同、发票 |
| 服务 | 客户服务记录 |
| 配置 | 线索来源、销售阶段、服务类型等基础数据 |

对象页签建议显式创建 `.tab.yml` 文件，页签名称可采用 `object_crm_accounts`、`object_crm_contacts` 等形式；应用 `tabs` 数组中也可以直接引用对象 API 名作为隐式对象页签。为便于后续维护，推荐显式页签。

## 数据模型设计

### 核心对象清单

所有对象都必须使用 `crm_` 前缀。

| 对象 API 名 | 中文名称 | 说明 | 图标 |
| --- | --- | --- | --- |
| `crm_leads` | 线索 | 尚未确认的潜在客户或商机来源 | `lead` |
| `crm_accounts` | 客户 | 企业客户、组织客户或重要个人客户 | `account` |
| `crm_contacts` | 联系人 | 客户下的联系人和关键决策人 | `contact` |
| `crm_opportunities` | 商机 | 已确认的销售机会和销售过程 | `opportunity` |
| `crm_opportunity_products` | 商机产品 | 商机中关联的产品明细 | `product` |
| `crm_activities` | 销售活动 | 拜访、电话、会议、邮件等销售互动 | `event` |
| `crm_tasks` | 销售任务 | 跟进任务、待办事项和提醒 | `task` |
| `crm_products` | 产品 | 可销售的产品或服务 | `product` |
| `crm_price_books` | 价格表 | 产品价格版本和价格策略 | `pricebook` |
| `crm_quotes` | 报价 | 面向客户的报价单 | `quotes` |
| `crm_quote_items` | 报价明细 | 报价单中的产品、数量和金额 | `order_item` |
| `crm_contracts` | 合同 | 已确认的商务合同 | `contract` |
| `crm_invoices` | 发票 | 开票、收款和财务状态记录 | `currency` |
| `crm_service_cases` | 客户服务记录 | 售后问题、投诉、需求和服务工单 | `case` |

### 对象关系

| 主对象 | 关联对象 | 关系类型 | 说明 |
| --- | --- | --- | --- |
| `crm_accounts` | `crm_contacts` | lookup | 一个客户可有多个联系人 |
| `crm_accounts` | `crm_opportunities` | lookup | 一个客户可有多个商机 |
| `crm_accounts` | `crm_activities` | lookup | 客户相关销售活动 |
| `crm_accounts` | `crm_service_cases` | lookup | 客户服务历史 |
| `crm_contacts` | `crm_opportunities` | lookup | 商机可关联主要联系人 |
| `crm_leads` | `crm_accounts` | lookup | 线索转化后关联客户 |
| `crm_leads` | `crm_contacts` | lookup | 线索转化后关联联系人 |
| `crm_leads` | `crm_opportunities` | lookup | 线索转化后关联商机 |
| `crm_opportunities` | `crm_opportunity_products` | master_detail | 商机产品随商机生命周期管理 |
| `crm_opportunities` | `crm_quotes` | lookup | 一个商机可产生多个报价 |
| `crm_quotes` | `crm_quote_items` | master_detail | 报价明细随报价管理 |
| `crm_quotes` | `crm_contracts` | lookup | 报价确认后形成合同 |
| `crm_contracts` | `crm_invoices` | lookup | 合同可关联多张发票 |
| `crm_products` | `crm_opportunity_products` | lookup | 商机产品引用产品 |
| `crm_products` | `crm_quote_items` | lookup | 报价明细引用产品 |
| `crm_price_books` | `crm_products` | lookup | 产品可关联默认价格表 |

### 关键字段设计

#### `crm_leads` 线索

| 字段 API 名 | 类型 | 中文名称 | 说明 |
| --- | --- | --- | --- |
| `lead_number` | autonumber | 线索编号 | 显示名称，格式建议为 `LEAD-{YYYY}{MM}{DD}-{0000}` |
| `company` | text | 公司名称 | 线索公司 |
| `contact_name` | text | 联系人姓名 | 线索联系人 |
| `mobile` | text | 手机 | 联系方式 |
| `email` | email | 邮箱 | 联系方式 |
| `source` | select | 线索来源 | 官网、展会、转介绍、广告、手工录入等 |
| `status` | select | 线索状态 | 新建、跟进中、已转化、无效 |
| `owner` | lookup | 负责人 | 使用 Steedos 标准字段 |
| `converted_account` | lookup | 转化客户 | 指向 `crm_accounts` |
| `converted_contact` | lookup | 转化联系人 | 指向 `crm_contacts` |
| `converted_opportunity` | lookup | 转化商机 | 指向 `crm_opportunities` |

#### `crm_accounts` 客户

| 字段 API 名 | 类型 | 中文名称 | 说明 |
| --- | --- | --- | --- |
| `name` | text | 客户名称 | 客户显示名称 |
| `account_number` | autonumber | 客户编号 | 唯一业务编号 |
| `account_type` | select | 客户类型 | 潜在客户、正式客户、渠道伙伴、供应商 |
| `industry` | select | 行业 | 行业分类 |
| `level` | select | 客户级别 | A、B、C、D |
| `phone` | text | 电话 | 客户电话 |
| `website` | url | 官网 | 客户网站 |
| `address` | textarea | 地址 | 客户地址 |
| `status` | select | 客户状态 | 启用、停用、黑名单 |

#### `crm_contacts` 联系人

| 字段 API 名 | 类型 | 中文名称 | 说明 |
| --- | --- | --- | --- |
| `name` | text | 联系人姓名 | 联系人显示名称 |
| `account` | lookup | 所属客户 | 指向 `crm_accounts` |
| `title` | text | 职务 | 联系人职位 |
| `department` | text | 部门 | 所属部门 |
| `mobile` | text | 手机 | 手机号 |
| `email` | email | 邮箱 | 邮箱地址 |
| `is_primary` | boolean | 主要联系人 | 是否为客户主要联系人 |
| `status` | select | 状态 | 在职、离职、未知 |

#### `crm_opportunities` 商机

| 字段 API 名 | 类型 | 中文名称 | 说明 |
| --- | --- | --- | --- |
| `opportunity_number` | autonumber | 商机编号 | 显示名称，格式建议为 `OPP-{YYYY}{MM}{DD}-{0000}` |
| `name` | text | 商机名称 | 商机标题 |
| `account` | lookup | 客户 | 指向 `crm_accounts` |
| `primary_contact` | lookup | 主要联系人 | 指向 `crm_contacts` |
| `stage` | select | 销售阶段 | 初步沟通、需求确认、方案报价、商务谈判、赢单、输单 |
| `amount` | currency | 预计金额 | 商机预计成交金额 |
| `probability` | percent | 成交概率 | 按阶段自动或手工维护 |
| `expected_close_date` | date | 预计成交日期 | 销售预测使用 |
| `source` | lookup | 来源线索 | 指向 `crm_leads` |
| `loss_reason` | textarea | 输单原因 | 输单时填写 |

#### `crm_products` 产品

| 字段 API 名 | 类型 | 中文名称 | 说明 |
| --- | --- | --- | --- |
| `name` | text | 产品名称 | 产品显示名称 |
| `product_code` | text | 产品编码 | 唯一编码 |
| `category` | select | 产品分类 | 软件、硬件、服务、其他 |
| `unit` | select | 单位 | 套、个、年、月、人天 |
| `standard_price` | currency | 标准价 | 默认销售价格 |
| `status` | select | 状态 | 上架、下架 |

#### `crm_quotes` 报价

| 字段 API 名 | 类型 | 中文名称 | 说明 |
| --- | --- | --- | --- |
| `quote_number` | autonumber | 报价编号 | 显示名称 |
| `opportunity` | lookup | 商机 | 指向 `crm_opportunities` |
| `account` | lookup | 客户 | 指向 `crm_accounts` |
| `status` | select | 报价状态 | 草稿、已提交、已发送、已接受、已拒绝 |
| `total_amount` | currency | 报价总额 | 汇总报价明细 |
| `valid_until` | date | 有效期至 | 报价有效日期 |

#### `crm_contracts` 合同

| 字段 API 名 | 类型 | 中文名称 | 说明 |
| --- | --- | --- | --- |
| `contract_number` | autonumber | 合同编号 | 显示名称 |
| `account` | lookup | 客户 | 指向 `crm_accounts` |
| `opportunity` | lookup | 商机 | 指向 `crm_opportunities` |
| `quote` | lookup | 报价 | 指向 `crm_quotes` |
| `amount` | currency | 合同金额 | 合同总金额 |
| `start_date` | date | 开始日期 | 合同开始 |
| `end_date` | date | 结束日期 | 合同结束 |
| `status` | select | 合同状态 | 草稿、审批中、执行中、已完成、已终止 |

#### `crm_invoices` 发票

| 字段 API 名 | 类型 | 中文名称 | 说明 |
| --- | --- | --- | --- |
| `invoice_number` | autonumber | 发票编号 | 显示名称 |
| `contract` | lookup | 合同 | 指向 `crm_contracts` |
| `account` | lookup | 客户 | 指向 `crm_accounts` |
| `invoice_amount` | currency | 开票金额 | 发票金额 |
| `paid_amount` | currency | 已收金额 | 回款金额 |
| `invoice_date` | date | 开票日期 | 开票时间 |
| `status` | select | 发票状态 | 未开票、已开票、部分回款、已回款、作废 |

#### `crm_service_cases` 客户服务记录

| 字段 API 名 | 类型 | 中文名称 | 说明 |
| --- | --- | --- | --- |
| `case_number` | autonumber | 服务编号 | 显示名称 |
| `account` | lookup | 客户 | 指向 `crm_accounts` |
| `contact` | lookup | 联系人 | 指向 `crm_contacts` |
| `case_type` | select | 服务类型 | 咨询、问题、投诉、需求、其他 |
| `priority` | select | 优先级 | 低、中、高、紧急 |
| `status` | select | 状态 | 新建、处理中、待客户反馈、已解决、已关闭 |
| `subject` | text | 主题 | 服务主题 |
| `description` | textarea | 问题描述 | 详细说明 |
| `resolution` | textarea | 解决方案 | 处理结果 |

## 业务流程设计

### 线索到商机

1. 销售或市场人员创建 `crm_leads`。
2. 线索进入“新建”状态，并分配负责人。
3. 销售跟进并记录 `crm_activities` 和 `crm_tasks`。
4. 线索确认有效后转化为 `crm_accounts`、`crm_contacts` 和 `crm_opportunities`。
5. 线索状态变更为“已转化”，保留转化后的对象引用。

### 商机到报价

1. 销售创建 `crm_opportunities` 并维护销售阶段、金额、预计成交日期。
2. 商机明细通过 `crm_opportunity_products` 维护产品、数量、单价和金额。
3. 需要对客户正式报价时创建 `crm_quotes`。
4. 报价明细通过 `crm_quote_items` 维护。
5. 报价被客户接受后进入合同阶段。

### 报价到合同和开票

1. 已接受的 `crm_quotes` 可生成或关联 `crm_contracts`。
2. 合同进入草稿、审批中、执行中、已完成等状态。
3. 合同执行过程中创建 `crm_invoices` 管理开票和回款状态。
4. 管理层可基于合同金额、开票金额和回款金额查看收入进度。

### 客户服务

1. 客户提出问题或需求时创建 `crm_service_cases`。
2. 服务人员维护优先级、状态、处理过程和解决方案。
3. 服务记录与客户、联系人关联，形成客户服务历史。
4. 已解决或关闭的服务记录可用于客户满意度和复购分析。

## 权限设计

### 权限集

| 权限集 | 说明 |
| --- | --- |
| `admin` | 系统管理员，拥有全部配置和数据管理权限 |
| `crm_sales_manager` | 销售经理，可查看团队销售数据和关键报表 |
| `crm_sales_user` | 销售人员，可管理自己负责的线索、客户、联系人、商机、活动和任务 |
| `crm_service_user` | 服务人员，可管理客户服务记录，并查看相关客户和联系人 |
| `crm_finance_user` | 财务人员，可查看合同并管理发票与回款信息 |

### 对象权限策略

| 对象 | 管理员 | 销售经理 | 销售人员 | 服务人员 | 财务人员 |
| --- | --- | --- | --- | --- | --- |
| `crm_leads` | 全部 | 查看全部、编辑 | 创建、查看、编辑 | 只读 | 无 |
| `crm_accounts` | 全部 | 查看全部、编辑 | 创建、查看、编辑 | 只读 | 只读 |
| `crm_contacts` | 全部 | 查看全部、编辑 | 创建、查看、编辑 | 只读 | 只读 |
| `crm_opportunities` | 全部 | 查看全部、编辑 | 创建、查看、编辑 | 只读 | 只读 |
| `crm_quotes` | 全部 | 查看全部、编辑 | 创建、查看、编辑 | 无 | 只读 |
| `crm_contracts` | 全部 | 查看全部、编辑 | 创建、查看、编辑 | 无 | 查看全部、编辑财务字段 |
| `crm_invoices` | 全部 | 只读 | 只读 | 无 | 创建、查看、编辑 |
| `crm_service_cases` | 全部 | 只读 | 只读 | 创建、查看、编辑 | 无 |

实际实现时应通过 `.permission.yml` 文件配置对象级权限，并按字段敏感性继续补充字段级权限。

## 列表视图设计

每个业务对象至少提供一个“全部”列表视图，并按角色补充常用视图。

| 对象 | 建议列表视图 |
| --- | --- |
| `crm_leads` | 全部线索、我的线索、待跟进线索、已转化线索 |
| `crm_accounts` | 全部客户、我的客户、重点客户、停用客户 |
| `crm_contacts` | 全部联系人、我的联系人、主要联系人 |
| `crm_opportunities` | 全部商机、我的商机、本月预计成交、赢单商机、输单商机 |
| `crm_tasks` | 我的任务、今日到期、逾期任务、已完成任务 |
| `crm_quotes` | 全部报价、草稿报价、已发送报价、已接受报价 |
| `crm_contracts` | 全部合同、执行中合同、即将到期合同、已完成合同 |
| `crm_invoices` | 全部发票、待开票、待回款、已回款 |
| `crm_service_cases` | 全部服务记录、我的服务记录、紧急问题、未关闭问题 |

## 页面与报表设计

### CRM 首页

建议使用 Amis 微页面实现，展示以下内容：

- 我的待办任务。
- 我的待跟进线索。
- 本月预计成交商机。
- 近期客户服务问题。
- 销售漏斗摘要。

### 销售仪表盘

建议后续使用 Steedos analytics 能力建设：

- 按销售阶段统计商机金额。
- 按负责人统计本月新增线索、商机和赢单金额。
- 按行业统计客户数量和商机金额。
- 按月份统计合同金额、开票金额和回款金额。
- 客户服务记录状态分布和平均关闭周期。

## 自动化设计

优先使用 Steedos 元数据和公式字段；只有无法声明式实现时才增加 trigger 或 function。

| 场景 | 建议实现 |
| --- | --- |
| 线索转化 | 自定义按钮调用 function，生成客户、联系人和商机 |
| 商机金额汇总 | 汇总字段或 trigger 汇总商机产品金额 |
| 报价金额汇总 | 汇总字段或 trigger 汇总报价明细金额 |
| 报价生成合同 | 自定义按钮调用 function |
| 合同到期提醒 | 定时任务或列表视图筛选“即将到期合同” |
| 服务关闭校验 | trigger 校验关闭时必须填写解决方案 |

## 数据初始化设计

建议通过 `main/default/data/` 提供基础种子数据：

- 线索来源：官网、展会、转介绍、广告、手工录入。
- 销售阶段：初步沟通、需求确认、方案报价、商务谈判、赢单、输单。
- 客户级别：A、B、C、D。
- 产品分类：软件、硬件、服务、其他。
- 服务类型：咨询、问题、投诉、需求、其他。

种子数据文件命名也应体现对应对象或配置用途，涉及自定义业务对象时必须使用 `crm_` 前缀。

## 实施路线

### 第一阶段：基础工程和主数据

- 创建 Steedos 基础项目文件。
- 创建 `steedos-packages/crm` 包。
- 实现 CRM 应用、页签和基础权限集。
- 实现 `crm_accounts`、`crm_contacts`、`crm_leads`。

### 第二阶段：销售过程

- 实现 `crm_opportunities`、`crm_opportunity_products`、`crm_activities`、`crm_tasks`。
- 增加商机阶段、销售任务、销售活动列表视图。
- 实现线索转化能力。

### 第三阶段：报价合同

- 实现 `crm_products`、`crm_price_books`、`crm_quotes`、`crm_quote_items`。
- 实现 `crm_contracts` 和 `crm_invoices`。
- 增加报价生成合同、合同开票相关能力。

### 第四阶段：服务和分析

- 实现 `crm_service_cases`。
- 实现 CRM 首页和销售仪表盘。
- 补充关键报表、数据初始化和自动化校验。

## 验收标准

- 所有自定义业务对象和表名均以 `crm_` 开头。
- 所有业务对象均有名称字段、权限文件和至少一个列表视图。
- CRM 应用可在侧边栏访问所有核心对象。
- 核心业务流程可串联：线索 → 客户/联系人/商机 → 报价 → 合同 → 发票 → 服务记录。
- 项目文档保持中文，代码标识符、文件路径、命令和配置键可保留英文。
- 变更后可通过项目已有命令完成安装、启动或构建验证。
