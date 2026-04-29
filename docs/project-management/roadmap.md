# 项目路线图

## 目标

本路线图用于管理 CRM 项目的阶段性交付。所有开发任务必须以 `docs/design.md` 为设计基线，并在 `docs/project-management/tasks.md` 中登记和跟踪。

## 阶段规划

| 阶段 | 名称 | 目标 | 状态 | 关联任务文档 |
| --- | --- | --- | --- | --- |
| 第一阶段 | 基础工程和主数据 | 建立 Steedos 基础工程、CRM 包、应用导航、基础权限集、客户主数据 | 待验收 | `docs/project-management/sprints/phase-1-foundation.md` |
| 第二阶段 | 销售过程 | 实现商机、商机产品、销售活动、销售任务和线索转化 | 待验收 | `docs/project-management/sprints/phase-2-sales.md` |
| 第三阶段 | 报价合同 | 实现产品、价格表、报价、报价明细、合同、发票和相关自动化 | 待验收 | `docs/project-management/sprints/phase-3-contracts.md` |
| 第四阶段 | 服务和分析 | 实现客户服务记录、CRM 首页、销售仪表盘、报表和自动化校验 | 待验收 | `docs/project-management/sprints/phase-4-service-analytics.md` |

## 阶段进入标准

- 前一阶段任务已全部进入“已完成”状态。
- 本阶段任务已在 `tasks.md` 中登记。
- 本阶段涉及的设计变更已更新到 `docs/design.md`。

## 阶段完成标准

- 阶段内任务均已完成验收。
- 新增对象均以 `crm_` 开头。
- 新增对象均包含对象定义、字段、权限、列表视图和导航入口。
- 中文文档已同步更新。
- 已使用项目已有命令完成必要验证。

