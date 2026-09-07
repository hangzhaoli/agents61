/**
 * Market data cost catalog for Agents61.
 * Numbers are 2026 public list prices for planning — commercial display
 * rights are a separate (usually higher) contract.
 */

export type CostTier = 'free' | 'startup' | 'growth' | 'enterprise';

export interface DataVendor {
  id: string;
  name: string;
  markets: string[];
  bestFor: string;
  listPrice: string;
  commercialDisplay: string;
  tier: CostTier;
  caveat: string;
}

export const DATA_VENDORS: DataVendor[] = [
  {
    id: 'edgar',
    name: 'SEC EDGAR',
    markets: ['US'],
    bestFor: '10-K / 10-Q / 8-K 原文、财报事实层',
    listPrice: '$0',
    commercialDisplay: '官方公开数据，可引用原文',
    tier: 'free',
    caveat: '无行情、无标准化比率，需自己解析 XBRL',
  },
  {
    id: 'akshare',
    name: 'AKShare',
    markets: ['CN', 'US', 'HK'],
    bestFor: '原型验证、A股日线与基本面抓取',
    listPrice: '$0（开源）',
    commercialDisplay: '无官方展示授权，生产站不要直出',
    tier: 'free',
    caveat: '依赖公开网页接口，不稳定，不适合作为产品数据源',
  },
  {
    id: 'yahoo',
    name: 'Yahoo Finance (unofficial)',
    markets: ['US', 'ETF'],
    bestFor: '本地调试报价',
    listPrice: '$0',
    commercialDisplay: '禁止商用展示',
    tier: 'free',
    caveat: '随时封 IP，合规风险高',
  },
  {
    id: 'tushare',
    name: 'Tushare Pro',
    markets: ['CN', 'STAR', 'ETF'],
    bestFor: 'A股/科创板日线、财务、指数',
    listPrice: '¥0–1,500/年（积分档）+ 分钟数据另计',
    commercialDisplay: '个人研究友好；对外展示需确认条款，机构价约 3×',
    tier: 'startup',
    caveat: '积分制：120 分免费日线，2000 分 ¥200/年，分钟线另 ¥2,000/年',
  },
  {
    id: 'fmp',
    name: 'Financial Modeling Prep',
    markets: ['US', 'ETF'],
    bestFor: '估值、财报、比率、DCF、筛选器',
    listPrice: 'Free / $22 / $59 / $149 /月（年付）',
    commercialDisplay: '必须另签 Data Display Agreement（通常 $249+/月量级）',
    tier: 'startup',
    caveat: '个人档 ≠ 网站展示权。投研站首选基本面源',
  },
  {
    id: 'twelve',
    name: 'Twelve Data',
    markets: ['US', 'CN', 'HK', 'ETF'],
    bestFor: '多市场行情 + 技术指标',
    listPrice: 'Free 800次/天 · Grow $29 · Pro $99 · Ultra $329 /月',
    commercialDisplay: '对外分发需更高档或单独授权；Business 约 $1,099/月',
    tier: 'startup',
    caveat: '覆盖广，适合 A股+美股同一套接口',
  },
  {
    id: 'eodhd',
    name: 'EODHD',
    markets: ['US', 'CN', 'ETF'],
    bestFor: '全球 EOD + 基本面一体',
    listPrice: '约 $19.99 起/月',
    commercialDisplay: '有相对清晰的商用路径',
    tier: 'startup',
    caveat: '延迟与交易所覆盖要逐项核对',
  },
  {
    id: 'alpha-vantage',
    name: 'Alpha Vantage',
    markets: ['US', 'ETF'],
    bestFor: '早期原型、技术指标',
    listPrice: 'Free 25次/天 · Premium $49.99/月',
    commercialDisplay: '个人/内部为主，展示权需确认',
    tier: 'startup',
    caveat: '配额紧，不适合生产流量',
  },
  {
    id: 'massive',
    name: 'Massive (原 Polygon.io)',
    markets: ['US'],
    bestFor: '美股实时/分钟级行情',
    listPrice: 'Free EOD · $29 / $79 / $199 /月',
    commercialDisplay: 'Business 与交易所版权另议',
    tier: 'growth',
    caveat: '基本面弱，适合当行情层而不是财报层',
  },
  {
    id: 'finnhub',
    name: 'Finnhub',
    markets: ['US'],
    bestFor: '报价 + 日历 + 部分另类数据',
    listPrice: 'Free 60次/分 · 专业档公开约 $50–$200/月，全量约 $3,500/月',
    commercialDisplay: '公开档多为 personal use',
    tier: 'growth',
    caveat: '价格按数据类型拆分，一展开就贵',
  },
  {
    id: 'eastmoney',
    name: '东方财富 Choice',
    markets: ['CN', 'STAR', 'ETF', 'HK'],
    bestFor: 'A股机构级财务与研报',
    listPrice: '终端年费约数万元人民币',
    commercialDisplay: '需采购终端 + 数据再分发协议',
    tier: 'enterprise',
    caveat: '质量高，对早期 SaaS 过重',
  },
  {
    id: 'wind',
    name: 'Wind 万得',
    markets: ['CN', 'STAR', 'HK', 'US'],
    bestFor: '国内机构标准数据',
    listPrice: '专业版年费约十万元级人民币',
    commercialDisplay: '再分发极严，几乎只服务机构内部',
    tier: 'enterprise',
    caveat: 'MVP 不要碰',
  },
];

export const COST_PLAYBOOK = {
  dataCard: {
    label: '真实数据卡（FMP + Tushare，不上实时）',
    monthlyUsd: '开发期 ~$0–22；上线展示另议',
    stack: [
      '美股数据卡：FMP Starter $22/月（年付），含报价、财报、比率、DCF 输入',
      'A股/科创板/ETF 卡：Tushare 2000 积分 ¥200/年（日线+财务，够一张卡）',
      '上线给用户看：FMP Display License 须询价（个人档不能直接展示）',
    ],
    note: '数据卡不需要分钟线。Tushare 分钟线 ¥2,000/年、机构价 10 倍，MVP 不要买。',
  },
  mvp: {
    label: 'MVP / 冷启动（已接线）',
    monthlyUsd: '$0',
    stack: [
      'SEC EDGAR companyfacts：财报事实层，公开可引用，缓存 7 天',
      'FMP 免费档：仅服务端缓存，页面不展示行情',
    ],
    note: '数据卡只用 EDGAR 自算指标。没有实时报价。',
  },
  paid: {
    label: '有付费用户后（300 订阅）',
    monthlyUsd: '$250–600',
    stack: ['FMP Display License', 'Twelve Data Pro 或 EODHD（多市场）', 'Tushare 5000 积分 + 日线实时'],
    note: '真正的成本大头是展示授权，不是 LLM。',
  },
  scale: {
    label: '规模期（专业用户 / API）',
    monthlyUsd: '$1,000–5,000+',
    stack: ['Massive Business（美股实时）', 'Finnhub 或 Intrinio', 'Choice/Wind 仅当机构客户要求'],
    note: '实时推送会触发投资顾问合规风险，产品上应坚持延迟行情 + 研究报告。',
  },
};
