import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { HoldingImporter } from "~/components/finance/holding-importer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { AppInfo } from "~/lib/config";
import type { AssetPosition, FinanceRole } from "~/lib/finance/data";
import { getAccountById } from "~/lib/finance/data";
import { formatCurrency } from "~/lib/finance/utils";

const ROLE_LABELS: Record<FinanceRole, string> = {
  core: "核心",
  defense: "防守",
  offense: "进攻",
  custom: "自定义",
};

const ROLE_KEYS: FinanceRole[] = ["core", "defense", "offense"];

export const meta = () => {
  return [{ title: `Account Detail - ${AppInfo.name}` }];
};

export const handle = {
  breadcrumb: () => [
    { label: "账户", to: "/admin/accounts" },
    { label: "持仓详情" },
  ],
};

export default function AccountDetailRoute() {
  const { accountId } = useParams<{ accountId: string }>();
  const account = useMemo(
    () => (accountId ? getAccountById(accountId) : undefined),
    [accountId],
  );
  const [holdings, setHoldings] = useState<AssetPosition[]>([]);

  useEffect(() => {
    if (account) {
      setHoldings(account.topHoldings);
    }
  }, [account]);

  if (!account) {
    return <p className="text-muted-foreground text-sm">账户未找到</p>;
  }

  const currencyBreakdown = useMemo(
    () =>
      holdings.reduce<Record<string, number>>((acc, holding) => {
        acc[holding.currency] = (acc[holding.currency] ?? 0) + holding.amount;
        return acc;
      }, {}),
    [holdings],
  );
  const typeBreakdown = useMemo(
    () =>
      holdings.reduce<Record<string, number>>((acc, holding) => {
        acc[holding.type] = (acc[holding.type] ?? 0) + holding.amount;
        return acc;
      }, {}),
    [holdings],
  );

  const appendOrReplace = (asset: AssetPosition) => {
    setHoldings((prev) => {
      const index = prev.findIndex((row) => row.code === asset.code);
      if (index >= 0) {
        const overwrite = window.confirm(
          `代码 ${asset.code} 已存在，是否覆盖？取消则追加`,
        );
        if (!overwrite) {
          return [...prev, asset];
        }
        const next = [...prev];
        next[index] = asset;
        return next;
      }
      return [...prev, asset];
    });
  };

  const roleStats = ROLE_KEYS.map((role) => ({
    label: ROLE_LABELS[role],
    value: account.roles[role].percentage,
  }));

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
              账户详情
            </p>
            <h1 className="font-semibold text-3xl">{account.name}</h1>
            <p className="text-muted-foreground text-sm">
              {account.managerNote}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-3xl">
              {formatCurrency(account.totalAssets, account.currency)}
            </p>
            <p className="text-green-600 text-sm">{account.trend} · 本月</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            {roleStats.map((role) => (
              <div
                key={role.label}
                className="rounded-2xl border border-border bg-background/70 p-4 text-sm"
              >
                <p className="text-muted-foreground text-xs">角色</p>
                <p className="font-semibold text-foreground">{role.label}</p>
                <p className="font-bold text-2xl text-primary">{role.value}%</p>
              </div>
            ))}
          </div>
          <HoldingImporter
            onAdd={appendOrReplace}
            defaultCurrency={account.currency}
          />
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background/50 p-4">
          <h2 className="font-semibold text-foreground text-sm">币种分布</h2>
          <div className="mt-3 space-y-2 text-muted-foreground text-sm">
            {Object.entries(currencyBreakdown).map(([currency, amount]) => (
              <div
                key={currency}
                className="flex items-center justify-between text-foreground"
              >
                <span>{currency}</span>
                <span>{formatCurrency(amount, currency)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-background/50 p-4">
          <h2 className="font-semibold text-foreground text-sm">标的类型</h2>
          <div className="mt-3 space-y-2 text-muted-foreground text-sm">
            {Object.entries(typeBreakdown).map(([type, amount]) => (
              <div
                key={type}
                className="flex items-center justify-between text-foreground"
              >
                <span>{type}</span>
                <span>{formatCurrency(amount, account.currency)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-background/50 p-4">
          <h2 className="font-semibold text-foreground text-sm">
            批量导入说明
          </h2>
          <p className="text-muted-foreground text-xs">
            CSV 支持 name,code,type,role,limit,amount,currency,sector
            顺序，导入会在已有持仓基础上追加或覆盖。
          </p>
        </div>
      </div>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
              全部标的
            </p>
            <h2 className="font-semibold text-xl">持仓明细</h2>
          </div>
          <span className="text-muted-foreground text-xs">实时更新</span>
        </div>
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
            {holdings.map((asset) => (
              <TableRow key={asset.code}>
                <TableCell>
                  <p className="font-semibold text-foreground">{asset.name}</p>
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
    </section>
  );
}
