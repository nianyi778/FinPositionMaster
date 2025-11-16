import { href, Link } from "react-router";
import type { FinanceAccount } from "~/lib/finance/data";
import { formatCurrency } from "~/lib/finance/utils";

function AccountCard({ account }: { account: FinanceAccount }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {account.type}
          </p>
          <h3 className="mt-1 text-lg font-semibold">{account.name}</h3>
        </div>
        <Link
          to={href("/admin/accounts/:accountId/dashboard", {
            accountId: account.id,
          })}
          className="text-primary text-sm font-medium"
        >
          查看详情 →
        </Link>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{account.managerNote}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-2xl font-semibold">
          {formatCurrency(account.totalAssets, account.currency)}
        </p>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            account.trend.startsWith("+")
              ? "bg-emerald-100 text-emerald-600"
              : "bg-muted/30 text-muted-foreground"
          }`}
        >
          {account.trend}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        {([
          ["核心仓", account.roles.core.percentage],
          ["防守仓", account.roles.defense.percentage],
          ["进攻仓", account.roles.offense.percentage],
        ] as const).map(([label, pct]) => (
          <span
            key={label}
            className="rounded-full border border-border px-3 py-1"
          >
            {label} {pct}%
          </span>
        ))}
      </div>
    </article>
  );
}

export { AccountCard };
