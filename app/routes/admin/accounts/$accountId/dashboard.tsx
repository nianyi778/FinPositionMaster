import { useMemo } from "react";
import { Link, useParams } from "react-router";
import { AccountShell } from "~/components/finance/account-shell";
import { ChartCard } from "~/components/finance/chart-card";
import { RoleDistributionChart } from "~/components/finance/role-distribution-chart";
import { RoleSlider } from "~/components/finance/role-slider";
import { Sparkline } from "~/components/finance/sparkline";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { AppInfo } from "~/lib/config";
import { getAccountById } from "~/lib/finance/data";
import { formatCurrency } from "~/lib/finance/utils";
import type { Route } from "./+types/dashboard";

const ROLE_LABELS: Record<string, string> = {
  core: "核心仓",
  defense: "防守仓",
  offense: "进攻仓",
  custom: "自定义仓",
};
const ROLE_KEYS = ["core", "defense", "offense"] as const;

export const meta: Route.MetaFunction = () => {
  return [{ title: `Dashboard - ${AppInfo.name}` }];
};

export const handle = {
  breadcrumb: () => [
    { label: "账户", to: "/admin/accounts" },
    { label: "账户看板" },
  ],
};

export default function AccountDashboardRoute() {
  const { accountId } = useParams<{ accountId: string }>();
  const account = useMemo(
    () => (accountId ? getAccountById(accountId) : undefined),
    [accountId],
  );

  if (!account) {
    return <p className="text-muted-foreground text-sm">账户未找到</p>;
  }

  const roleCards = ROLE_KEYS.map((key) => {
    const role = account.roles[key];
    return (
      <RoleSlider
        key={key}
        label={ROLE_LABELS[key] ?? key}
        value={role.percentage}
        deviation={role.deviation}
        roleKey={key}
      />
    );
  });

  return (
    <AccountShell account={account}>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="账户资产" description="总资产及趋势">
          <Sparkline
            accountHistory={
              account.trendHistory?.length ? account.trendHistory : undefined
            }
            accountLabel={account.name}
            benchmarkLabel="标普 500"
            currency={account.currency}
          />
        </ChartCard>
        <ChartCard title="角色结构" description="当前仓位占比">
          <RoleDistributionChart
            segments={[
              {
                label: "核心",
                value: account.roles.core.percentage,
                color: "#3A82F7",
              },
              {
                label: "防守",
                value: account.roles.defense.percentage,
                color: "#4CAF50",
              },
              {
                label: "进攻",
                value: account.roles.offense.percentage,
                color: "#EF5350",
              },
            ]}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">{roleCards}</div>

      <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
              标的 Top 5
            </p>
            <h2 className="font-semibold text-lg">按持仓金额排序</h2>
          </div>
          <span className="text-muted-foreground text-xs">
            <Link
              to={`/admin/accounts/${account.id}/detail`}
              className="font-medium text-primary text-sm hover:underline"
            >
              更多详情 →
            </Link>
          </span>
        </header>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>代码</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>上限</TableHead>
              <TableHead>持仓金额</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {account.topHoldings.map((asset) => (
              <TableRow key={asset.code}>
                <TableCell>
                  <p className="font-semibold">{asset.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {asset.sector}
                  </p>
                </TableCell>
                <TableCell>{asset.code}</TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>{ROLE_LABELS[asset.role]}</TableCell>
                <TableCell>{asset.limit}%</TableCell>
                <TableCell>
                  {formatCurrency(asset.amount, asset.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </AccountShell>
  );
}
