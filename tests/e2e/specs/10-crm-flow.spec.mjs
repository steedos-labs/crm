import { describe, it, expect } from 'vitest';
import { api } from '../helpers/api.mjs';
import { getState, setState, clearState } from '../helpers/state.mjs';

// 把所有 CRM 业务对象的端到端流程串成一条按顺序执行的链路。
// 单文件可保证顺序执行，避免跨 spec 文件并行/重排导致的依赖断裂。
describe('10 CRM 端到端业务链路', () => {
  const getA = () => api();
  const ids = {};

  // ============ 线索 leads ============
  it('创建线索', async () => {
    const lead = await getA().record.create('crm_leads', {
      company: 'E2E 测试公司',
      contact_name: '张三',
      email: 'zhangsan@e2e.local',
      mobile: '13800000001',
      title: '采购总监',
      industry: 'manufacturing',
    });
    ids.lead = lead._id;
    expect(ids.lead).toBeTruthy();
    expect(lead.status).toBe('new');
  });

  it('更新线索状态为 qualified', async () => {
    const r = await getA().record.update('crm_leads', ids.lead, { status: 'qualified' });
    expect(r.status).toBe('qualified');
  });

  it('调用 convert 函数把线索转化为客户/联系人/商机', async () => {
    const conv = await getA().fn('crm_leads', 'convert', {
      lead_id: ids.lead,
      account_name: 'E2E 转化客户',
      opportunity_name: 'E2E 转化商机',
      amount: 100000,
      expected_close_date: '2030-12-31',
    });
    expect(conv).toBeTruthy();
    expect(conv.account_id).toBeTruthy();
    expect(conv.contact_id).toBeTruthy();
    expect(conv.opportunity_id).toBeTruthy();
    ids.convAccount = conv.account_id;
    ids.convContact = conv.contact_id;
    ids.convOpportunity = conv.opportunity_id;

    const lead = await getA().record.get('crm_leads', ids.lead);
    expect(lead.status).toBe('converted');
    expect(lead.converted_account).toBe(conv.account_id);
    expect(lead.converted_contact).toBe(conv.contact_id);
    expect(lead.converted_opportunity).toBe(conv.opportunity_id);
  });

  // ============ 客户与联系人 ============
  it('创建直营客户', async () => {
    const acc = await getA().record.create('crm_accounts', {
      name: 'E2E 直营客户',
      account_type: 'customer',
      industry: 'tech',
      website: 'https://e2e.local',
      phone: '021-88888888',
    });
    ids.account = acc._id;
    expect(ids.account).toBeTruthy();
    expect(acc.status).toBe('active');
  });

  it('在客户下创建联系人', async () => {
    const c = await getA().record.create('crm_contacts', {
      name: '李四',
      account: ids.account,
      title: 'CTO',
      email: 'lisi@e2e.local',
      mobile: '13800000002',
      is_primary: true,
    });
    ids.contact = c._id;
    expect(ids.contact).toBeTruthy();
    expect(c.account).toBe(ids.account);
  });

  it('更新客户信息（等级 / 描述）', async () => {
    const r = await getA().record.update('crm_accounts', ids.account, {
      level: 'a',
      description: '战略客户',
    });
    expect(r.level).toBe('a');
  });

  // ============ 产品与价格表 ============
  it('创建产品', async () => {
    const p = await getA().record.create('crm_products', {
      name: 'E2E 产品 A',
      product_code: 'E2E-A-001',
      category: 'software',
      unit: 'license',
      standard_price: 9999,
    });
    ids.product = p._id;
    expect(ids.product).toBeTruthy();
  });

  it('创建价格表', async () => {
    const pb = await getA().record.create('crm_price_books', {
      name: 'E2E 标准价目表',
      is_standard: true,
      active: true,
    });
    ids.priceBook = pb._id;
    expect(ids.priceBook).toBeTruthy();
  });

  it('为价格表添加价目条目', async () => {
    const entry = await getA().record.create('crm_price_book_entries', {
      price_book: ids.priceBook,
      product: ids.product,
      list_price: 8888,
      active: true,
    });
    ids.priceEntry = entry._id;
    expect(entry.price_book).toBe(ids.priceBook);
    expect(entry.product).toBe(ids.product);
  });

  // ============ 商机与商机产品 ============
  it('在客户下创建商机', async () => {
    const opp = await getA().record.create('crm_opportunities', {
      name: 'E2E 商机',
      account: ids.account,
      stage: 'qualification',
      amount: 50000,
      expected_close_date: '2030-06-30',
    });
    ids.opportunity = opp._id;
    expect(ids.opportunity).toBeTruthy();
  });

  it('为商机添加产品明细', async () => {
    const item = await getA().record.create('crm_opportunity_products', {
      opportunity: ids.opportunity,
      product: ids.product,
      quantity: 2,
      unit_price: 8888,
    });
    ids.oppLine = item._id;
    expect(item.opportunity).toBe(ids.opportunity);
    expect(item.product).toBe(ids.product);
  });

  it('推进商机阶段到 proposal', async () => {
    const r = await getA().record.update('crm_opportunities', ids.opportunity, { stage: 'proposal' });
    expect(r.stage).toBe('proposal');
  });

  // ============ 报价 ============
  it('为商机创建报价单', async () => {
    const q = await getA().record.create('crm_quotes', {
      name: 'E2E 报价单',
      account: ids.account,
      opportunity: ids.opportunity,
      valid_until: '2030-12-31',
      total_amount: 17776,
    });
    ids.quote = q._id;
    expect(ids.quote).toBeTruthy();
    expect(q.status).toBe('draft');
  });

  it('为报价单添加明细', async () => {
    const item = await getA().record.create('crm_quote_items', {
      quote: ids.quote,
      product: ids.product,
      quantity: 2,
      unit_price: 8888,
      discount_percent: 0,
    });
    ids.quoteItem = item._id;
    expect(item.quote).toBe(ids.quote);
  });

  it('报价单状态变更为 sent', async () => {
    const r = await getA().record.update('crm_quotes', ids.quote, { status: 'sent' });
    expect(r.status).toBe('sent');
  });

  // ============ 合同 ============
  it('从商机/报价创建合同', async () => {
    const c = await getA().record.create('crm_contracts', {
      name: 'E2E 合同',
      account: ids.account,
      opportunity: ids.opportunity,
      quote: ids.quote,
      amount: 17776,
      start_date: '2030-01-01',
      end_date: '2030-12-31',
    });
    ids.contract = c._id;
    expect(ids.contract).toBeTruthy();
    expect(c.status).toBe('draft');
  });

  it('合同推进到 active', async () => {
    const r = await getA().record.update('crm_contracts', ids.contract, { status: 'active' });
    expect(r.status).toBe('active');
  });

  // ============ 发票 ============
  it('从合同创建发票', async () => {
    const inv = await getA().record.create('crm_invoices', {
      account: ids.account,
      contract: ids.contract,
      invoice_amount: 17776,
      invoice_date: '2030-02-01',
      due_date: '2030-03-01',
    });
    ids.invoice = inv._id;
    expect(ids.invoice).toBeTruthy();
    expect(inv.status).toBe('not_issued');
  });

  it('发票登记部分回款', async () => {
    const r = await getA().record.update('crm_invoices', ids.invoice, {
      status: 'partially_paid',
      paid_amount: 10000,
      outstanding_amount: 7776,
    });
    expect(r.status).toBe('partially_paid');
  });

  // ============ 客户服务（含校验触发器） ============
  it('创建服务工单（默认值断言）', async () => {
    const c = await getA().record.create('crm_service_cases', {
      account: ids.account,
      subject: 'E2E 客户咨询',
      contact: ids.contact,
    });
    ids.serviceCase = c._id;
    expect(c.status).toBe('new');
    expect(c.priority).toBe('medium');
    expect(c.case_type).toBe('question');
  });

  it('未填 resolution 直接关闭应被触发器拒绝', async () => {
    let err;
    try {
      await getA().record.update('crm_service_cases', ids.serviceCase, { status: 'closed' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
    expect(String(err && err.message)).toMatch(/resolution|关闭|解决|必填/);
  });

  it('填写 resolution 后可关闭并自动写入 closed_at', async () => {
    const r = await getA().record.update('crm_service_cases', ids.serviceCase, {
      status: 'closed',
      resolution: '问题已解决',
    });
    expect(r.status).toBe('closed');
    expect(r.closed_at).toBeTruthy();
  });

  // ============ 销售活动与任务 ============
  it('创建销售活动', async () => {
    const act = await getA().record.create('crm_activities', {
      subject: 'E2E 客户拜访',
      activity_date: '2030-04-01',
      account: ids.account,
      contact: ids.contact,
      opportunity: ids.opportunity,
      duration: 60,
    });
    ids.activity = act._id;
    expect(act.activity_type).toBe('visit');
    expect(act.status).toBe('planned');
  });

  it('完成销售活动并填写结果', async () => {
    const r = await getA().record.update('crm_activities', ids.activity, {
      status: 'completed',
      outcome: '客户接受方案',
    });
    expect(r.status).toBe('completed');
  });

  it('创建跟进任务', async () => {
    const userId = getState('E2E_USER_ID');
    const t = await getA().record.create('crm_tasks', {
      subject: 'E2E 发送方案文档',
      assignee: userId,
      due_date: '2030-04-05',
      account: ids.account,
      opportunity: ids.opportunity,
    });
    ids.task = t._id;
    expect(t.status).toBe('not_started');
  });

  it('完成任务', async () => {
    const r = await getA().record.update('crm_tasks', ids.task, {
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
    expect(r.status).toBe('completed');
  });

  // ============ 反向清理（不影响 E2E 结果，但保持数据库整洁） ============
  it('反向删除产生的全部数据', async () => {
    const order = [
      ['crm_tasks', ids.task],
      ['crm_activities', ids.activity],
      ['crm_service_cases', ids.serviceCase],
      ['crm_invoices', ids.invoice],
      ['crm_contracts', ids.contract],
      ['crm_quote_items', ids.quoteItem],
      ['crm_quotes', ids.quote],
      ['crm_opportunity_products', ids.oppLine],
      ['crm_opportunities', ids.opportunity],
      ['crm_opportunities', ids.convOpportunity],
      ['crm_price_book_entries', ids.priceEntry],
      ['crm_price_books', ids.priceBook],
      ['crm_products', ids.product],
      ['crm_contacts', ids.contact],
      ['crm_contacts', ids.convContact],
      ['crm_accounts', ids.account],
      ['crm_accounts', ids.convAccount],
      ['crm_leads', ids.lead],
    ];
    for (const [obj, id] of order) {
      if (!id) continue;
      try {
        await getA().record.remove(obj, id);
      } catch (e) {
        if (!String(e.message).match(/not exist|not found|没有/)) {
          // 仅记录，不让清理失败影响测试结果
          console.warn(`[cleanup] ${obj}/${id}: ${e.message}`);
        }
      }
    }
    setState('E2E_LAST_RUN_AT', new Date().toISOString());
    clearState();
    expect(true).toBe(true);
  });
});
