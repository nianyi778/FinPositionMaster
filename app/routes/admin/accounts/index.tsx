import { href, Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { AppInfo } from "~/lib/config";
import type { FinanceAccount } from "~/lib/finance/data";
import { financeAccounts } from "~/lib/finance/data";
import { formatCurrency } from "~/lib/finance/utils";
import type { Route } from "./+types/index";

type MetricCardProps = {
  title: string;
  value: string;
  description?: string;
};

function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="pt-0">
        <p className="font-semibold text-3xl">{value}</p>
      </CardContent>
    </Card>
  );
}

const aggregatedHoldings = financeAccounts.flatMap(
  (account) => account.topHoldings,
);
const totalAssets = financeAccounts.reduce(
  (sum, account) => sum + account.totalAssets,
  0,
);
const totalHoldingsCount = aggregatedHoldings.length;
const currencyTotals = aggregatedHoldings.reduce<Record<string, number>>(
  (acc, holding) => {
    acc[holding.currency] = (acc[holding.currency] ?? 0) + holding.amount;
    return acc;
  },
  {},
);
const assetTypeTotals = aggregatedHoldings.reduce<Record<string, number>>(
  (acc, holding) => {
    acc[holding.type] = (acc[holding.type] ?? 0) + holding.amount;
    return acc;
  },
  {},
);

const assetTypeSummary = Object.entries(assetTypeTotals).map(
  ([label, value]) => ({
    label,
    value,
  }),
);

const currencySummary = Object.entries(currencyTotals).map(
  ([currency, value]) => ({
    label: currency,
    value,
  }),
);

export const meta: Route.MetaFunction = () => {
  return [{ title: `Accounts - ${AppInfo.name}` }];
};

export const handle = {
  breadcrumb: () => [
    { label: "账户", to: "/admin/accounts" },
  ],
};

export default function AccountsRoute() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
          资金管理 · 标的配置
        </p>
        <h1 className="font-semibold text-3xl">全账户资产 & 标的分析</h1>
        <p className="text-muted-foreground text-sm">
          支持账户金额、标的数量、币种、ETF/正股等维度的快速对比，参考
          <a className="text-primary hover:underline" href="/docs/data-spec.md">
            数据规范
          </a>
          进一步对齐导入标准。
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="账户总资产"
          value={formatCurrency(totalAssets, "CNY")}
          description={`${financeAccounts.length} 个账户 · 平均 ${formatCurrency(
            totalAssets / financeAccounts.length,
            "CNY",
          )}`}
        />
        <MetricCard
          title="标的总数"
          value={`${totalHoldingsCount} 项`}
          description="含 ETF / 正股 / 加密"
        />
        <MetricCard
          title="平均标的/账户"
          value={(totalHoldingsCount / financeAccounts.length).toFixed(1)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>币种暴露</CardTitle>
            <CardDescription>TEF/正股均按当前持仓自动统计</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {currencySummary.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm"
              >
                <span>{item.label}</span>
                <span className="font-semibold">
                  {formatCurrency(
                    item.value,
                    item.label === "CNY" ? "CNY" : item.label,
                  )}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>类型分布</CardTitle>
            <CardDescription>TEF（ETF） vs 正股（股票）</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {assetTypeSummary.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm"
              >
                <span>{item.label}</span>
                <span className="font-semibold">
                  {item.value.toFixed(0)} 单位
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>关注维度</CardTitle>
            <CardDescription>
              可通过设置仓位偏离、标的占比与转化金额
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 text-sm">
            <p>• 支持按账户/标的/币种/ETF/正股筛选</p>
            <p>• 默认以 TEF（ETF）+正股组合进行资产配置</p>
            <p>• 可在设置页调整换算金额与偏离阀值</p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
              账户清单
            </p>
            <h2 className="font-semibold text-xl">单账户资产 / 标的概览</h2>
          </div>
          <Link
            to={href("/admin/accounts/settings")}
            className="font-medium text-primary text-sm hover:underline"
          >
            前往仓位 & 标的设置 →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {financeAccounts.map((account) => (
            <AccountSummaryCard key={account.id} account={account} />
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-background/60 px-6 py-5">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
              分析模组
            </p>
            <h3 className="font-semibold text-lg">TEF / 正股 & 账户金额分析</h3>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-muted-foreground text-xs">
            支持多币种
          </span>
        </header>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="font-semibold text-muted-foreground text-sm">
              账户金额分布
            </p>
            <div className="grid gap-2 rounded-2xl border border-border bg-card p-4 text-sm">
              {financeAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between"
                >
                  <span>{account.name}</span>
                  <span className="font-semibold">
                    {formatCurrency(account.totalAssets, account.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-muted-foreground text-sm">
              每个账户标的数量
            </p>
            <div className="grid gap-2 rounded-2xl border border-border bg-card p-4 text-sm">
              {financeAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between"
                >
                  <span>{account.name}</span>
                  <span className="font-semibold">
                    {account.topHoldings.length} 项
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

function AccountSummaryCard({ account }: { account: FinanceAccount }) {
  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle>{account.name}</CardTitle>
        <CardDescription>{account.type}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <p className="font-semibold text-2xl text-foreground">
          {formatCurrency(account.totalAssets, account.currency)}
        </p>
        <div className="flex flex-wrap gap-2 text-muted-foreground text-xs">
          <span className="rounded-full border border-border px-3 py-1">
            {account.topHoldings.length} 标的
          </span>
          <span className="rounded-full border border-border px-3 py-1">
            核心 {account.roles.core.percentage}% / 防守{" "}
            {account.roles.defense.percentage}% / 进攻{" "}
            {account.roles.offense.percentage}%
          </span>
        </div>
        <Link
          to={href("/admin/accounts/:accountId/dashboard", {
            accountId: account.id,
          })}
          className="font-medium text-primary text-sm hover:underline"
        >
          查看账户分析 →
        </Link>
      </CardContent>
    </Card>
  );
}
