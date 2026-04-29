# 任务进度

## 状态说明

| 状态 | 含义 |
| --- | --- |
| 待开始 | 任务已定义，尚未开发 |
| 开发中 | AI Agent 正在开发 |
| 待验收 | AI Agent 已提交实现，等待人工验收 |
| 已完成 | 已通过验收 |
| 已阻塞 | 存在范围、设计、依赖或环境问题，暂不能继续 |

## 总任务清单

| 编号 | 阶段 | 任务 | 状态 | 负责人 | 验收标准 | 关联文档 |
| --- | --- | --- | --- | --- | --- | --- |
| CRM-001 | 第一阶段 | 初始化 Steedos 基础项目结构 | 待验收 | AI | `package.json`、`steedos-config.yml`、`.gitignore`、基础环境说明齐全 | `docs/project-management/sprints/phase-1-foundation.md` |
| CRM-002 | 第一阶段 | 创建 CRM Steedos 包 | 待验收 | AI | `steedos-packages/crm`、`package.json`、`package.service.js`、`main/default` 目录齐全 | `docs/project-management/sprints/phase-1-foundation.md` |
| CRM-003 | 第一阶段 | 创建 CRM 应用和导航框架 | 待验收 | AI | CRM 应用、侧边栏分组、首页和核心对象页签规划齐全 | `docs/project-management/sprints/phase-1-foundation.md` |
| CRM-004 | 第一阶段 | 创建基础权限集 | 待验收 | AI | `crm_sales_manager`、`crm_sales_user`、`crm_service_user`、`crm_finance_user` 权限集齐全 | `docs/project-management/sprints/phase-1-foundation.md` |
| CRM-005 | 第一阶段 | 实现 `crm_accounts` 客户对象 | 待验收 | AI | 对象、字段、权限、列表视图、页签齐全，可从 CRM 应用访问 | `docs/design.md` |
| CRM-006 | 第一阶段 | 实现 `crm_contacts` 联系人对象 | 待验收 | AI | 对象、字段、权限、列表视图、页签齐全，并关联 `crm_accounts` | `docs/design.md` |
| CRM-007 | 第一阶段 | 实现 `crm_leads` 线索对象 | 待验收 | AI | 对象、字段、权限、列表视图、页签齐全，并预留转化关联字段 | `docs/design.md` |
| CRM-008 | 第二阶段 | 实现 `crm_opportunities` 商机对象 | 待开始 | AI | 对象、字段、权限、列表视图、页签齐全，并关联客户和联系人 | `docs/project-management/sprints/phase-2-sales.md` |
| CRM-009 | 第二阶段 | 实现 `crm_opportunity_products` 商机产品对象 | 待开始 | AI | master-detail 关系、字段、权限、列表视图齐全 | `docs/project-management/sprints/phase-2-sales.md` |
| CRM-010 | 第二阶段 | 实现 `crm_activities` 销售活动对象 | 待开始 | AI | 支持拜访、电话、会议、邮件等活动记录 | `docs/project-management/sprints/phase-2-sales.md` |
| CRM-011 | 第二阶段 | 实现 `crm_tasks` 销售任务对象 | 待开始 | AI | 支持任务负责人、到期日期、状态和我的任务视图 | `docs/project-management/sprints/phase-2-sales.md` |
| CRM-012 | 第二阶段 | 实现线索转化能力 | 待开始 | AI | 可从线索生成客户、联系人和商机，并回写转化引用 | `docs/project-management/sprints/phase-2-sales.md` |
| CRM-013 | 第三阶段 | 实现 `crm_products` 产品对象 | 待开始 | AI | 产品编码、分类、单位、标准价、状态等字段齐全 | `docs/project-management/sprints/phase-3-contracts.md` |
| CRM-014 | 第三阶段 | 实现 `crm_price_books` 价格表对象 | 待开始 | AI | 价格表基础字段、权限和列表视图齐全 | `docs/project-management/sprints/phase-3-contracts.md` |
| CRM-015 | 第三阶段 | 实现 `crm_quotes` 报价对象 | 待开始 | AI | 报价编号、商机、客户、状态、总额、有效期字段齐全 | `docs/project-management/sprints/phase-3-contracts.md` |
| CRM-016 | 第三阶段 | 实现 `crm_quote_items` 报价明细对象 | 待开始 | AI | master-detail 关系、产品、数量、单价、金额字段齐全 | `docs/project-management/sprints/phase-3-contracts.md` |
| CRM-017 | 第三阶段 | 实现 `crm_contracts` 合同对象 | 待开始 | AI | 合同编号、客户、商机、报价、金额、日期和状态字段齐全 | `docs/project-management/sprints/phase-3-contracts.md` |
| CRM-018 | 第三阶段 | 实现 `crm_invoices` 发票对象 | 待开始 | AI | 合同、客户、开票金额、已收金额、开票日期和状态字段齐全 | `docs/project-management/sprints/phase-3-contracts.md` |
| CRM-019 | 第四阶段 | 实现 `crm_service_cases` 客户服务记录对象 | 待开始 | AI | 服务编号、客户、联系人、类型、优先级、状态和解决方案字段齐全 | `docs/project-management/sprints/phase-4-service-analytics.md` |
| CRM-020 | 第四阶段 | 实现 CRM 首页 | 待开始 | AI | 首页展示待办、待跟进线索、本月商机、服务问题和销售漏斗摘要 | `docs/project-management/sprints/phase-4-service-analytics.md` |
| CRM-021 | 第四阶段 | 实现销售仪表盘 | 待开始 | AI | 提供商机阶段、负责人业绩、合同金额、开票回款和服务状态统计 | `docs/project-management/sprints/phase-4-service-analytics.md` |
| CRM-022 | 第四阶段 | 补充基础种子数据 | 待开始 | AI | 线索来源、销售阶段、客户级别、产品分类、服务类型等数据齐全 | `docs/project-management/sprints/phase-4-service-analytics.md` |

## 使用规则

- 每次只允许 AI Agent 领取一个“待开始”任务。
- AI Agent 开始前必须把任务状态改为“开发中”。
- AI Agent 完成代码和文档后必须把任务状态改为“待验收”。
- 人工验收通过后才允许把任务状态改为“已完成”。
- 如果实现范围偏离 `docs/design.md`，必须先更新设计文档和变更记录。

