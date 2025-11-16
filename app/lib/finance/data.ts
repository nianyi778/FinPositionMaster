export type FinanceRole = "core" | "defense" | "offense" | "custom";

export interface RoleAllocation {
  percentage: number;
  deviation: number;
}

export interface AssetPosition {
  name: string;
  code: string;
  type: string;
  role: FinanceRole;
  limit: number;
  amount: number;
  currency: string;
  sector: string;
}

export interface FinanceAccount {
  id: string;
  name: string;
  type: string;
  currency: string;
  totalAssets: number;
  trend: string;
  trendHistory: number[];
  roles: Record<FinanceRole, RoleAllocation>;
  topHoldings: AssetPosition[];
  managerNote: string;
}

export interface AnalyticsSnapshot {
  roleDistribution: Array<{ label: string; value: number }>;
  focusExposure: Array<{ label: string; value: number; tier: "high" | "medium" | "low" }>;
  currencyExposure: Array<{ label: string; value: number }>;
  concentration: { hhi: number };
  alerts: Array<{ severity: "error" | "warning" | "info"; title: string; details: string }>;
}

export const financeAccounts: FinanceAccount[] = [
  {
    id: "securities-a",
    name: "证券账户A",
    type: "证券账户",
    currency: "CNY",
    totalAssets: 820000,
    trend: "+2.3%",
    trendHistory: [760000, 780000, 795000, 808000, 815000, 820000],
    managerNote: "核心仓稳健配置，防守仓偏离7%",
    roles: {
      core: { percentage: 60, deviation: 12 },
      defense: { percentage: 25, deviation: -7 },
      offense: { percentage: 15, deviation: -3 },
      custom: { percentage: 0, deviation: 0 },
    },
    topHoldings: [
      {
        name: "腾讯控股",
        code: "0700",
        type: "股票",
        role: "core",
        limit: 10,
        amount: 120000,
        currency: "CNY",
        sector: "互联网",
      },
      {
        name: "微软",
        code: "MSFT",
        type: "股票",
        role: "core",
        limit: 10,
        amount: 80000,
        currency: "USD",
        sector: "科技",
      },
      {
        name: "Invesco QQQ",
        code: "QQQ",
        type: "ETF",
        role: "offense",
        limit: 20,
        amount: 50000,
        currency: "USD",
        sector: "科技",
      },
      {
        name: "比特币",
        code: "BTC",
        type: "加密",
        role: "defense",
        limit: 5,
        amount: 30000,
        currency: "USD",
        sector: "加密",
      },
    ],
  },
  {
    id: "crypto-guard",
    name: "加密卫士",
    type: "加密账户",
    currency: "USD",
    totalAssets: 12000,
    trend: "-1.1%",
    trendHistory: [14500, 14000, 13500, 13200, 12300, 12000],
    managerNote: "高波动策略，进攻仓需要观察",
    roles: {
      core: { percentage: 30, deviation: -5 },
      defense: { percentage: 40, deviation: 8 },
      offense: { percentage: 30, deviation: 2 },
      custom: { percentage: 0, deviation: 0 },
    },
    topHoldings: [
      {
        name: "比特币",
        code: "BTC",
        type: "加密",
        role: "offense",
        limit: 20,
        amount: 5000,
        currency: "USD",
        sector: "加密",
      },
      {
        name: "以太坊",
        code: "ETH",
        type: "加密",
        role: "offense",
        limit: 15,
        amount: 3200,
        currency: "USD",
        sector: "加密",
      },
      {
        name: "USDC",
        code: "USDC",
        type: "稳定币",
        role: "defense",
        limit: 20,
        amount: 1200,
        currency: "USD",
        sector: "货币",
      },
    ],
  },
  {
    id: "us-equity",
    name: "美股账户",
    type: "证券账户",
    currency: "USD",
    totalAssets: 50000,
    trend: "+4.5%",
    trendHistory: [44000, 45000, 46200, 47600, 49500, 50000],
    managerNote: "进攻仓优选 AI/赛道龙头",
    roles: {
      core: { percentage: 45, deviation: -3 },
      defense: { percentage: 20, deviation: 5 },
      offense: { percentage: 35, deviation: 6 },
      custom: { percentage: 0, deviation: 0 },
    },
    topHoldings: [
      {
        name: "Apple",
        code: "AAPL",
        type: "股票",
        role: "core",
        limit: 12,
        amount: 8000,
        currency: "USD",
        sector: "科技",
      },
      {
        name: "NVIDIA",
        code: "NVDA",
        type: "股票",
        role: "core",
        limit: 12,
        amount: 7000,
        currency: "USD",
        sector: "科技",
      },
      {
        name: "ARKK",
        code: "ARKK",
        type: "ETF",
        role: "offense",
        limit: 15,
        amount: 5000,
        currency: "USD",
        sector: "创新",
      },
      {
        name: "SPY",
        code: "SPY",
        type: "ETF",
        role: "defense",
        limit: 10,
        amount: 4000,
        currency: "USD",
        sector: "指数",
      },
    ],
  },
];

export const analyticsSnapshot: AnalyticsSnapshot = {
  roleDistribution: [
    { label: "核心仓", value: 62 },
    { label: "防守仓", value: 24 },
    { label: "进攻仓", value: 14 },
  ],
  focusExposure: [
    { label: "AI 赛道", value: 42, tier: "high" },
    { label: "Web3", value: 10, tier: "medium" },
    { label: "金融", value: 8, tier: "low" },
    { label: "医疗", value: 12, tier: "low" },
  ],
  currencyExposure: [
    { label: "USD", value: 72 },
    { label: "JPY", value: 20 },
    { label: "HKD", value: 8 },
  ],
  concentration: {
    hhi: 0.19,
  },
  alerts: [
    {
      severity: "error",
      title: "核心仓过度集中",
      details: "核心仓偏离目标 +12%，建议调低 MSFT",
    },
    {
      severity: "warning",
      title: "MSFT 占比偏高",
      details: "MSFT 在所有账户中的集中度达 13%",
    },
    {
      severity: "info",
      title: "美元暴露偏高",
      details: "美元资产占比 72%，观察汇率风险",
    },
  ],
};

export function getAccountById(accountId: string) {
  return financeAccounts.find((account) => account.id === accountId);
}
