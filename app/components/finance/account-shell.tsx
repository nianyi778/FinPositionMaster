import { type ReactNode, useMemo, useState } from "react";
import { href, Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import type { AssetPosition, FinanceAccount } from "~/lib/finance/data";
import { HoldingImporter } from "./holding-importer";

// const ACCOUNT_TABS = [
//   { label: "概览", path: "/admin/accounts/:accountId/dashboard" },
//   { label: "仓位", path: "/admin/accounts/:accountId/allocation" },
//   { label: "标的", path: "/admin/accounts/:accountId/assets" },
// ] as const;

type AccountShellProps = {
  account: FinanceAccount;
  children: ReactNode;
};

function AccountShell({ account, children }: AccountShellProps) {
  const location = useLocation();
  const [customHoldings, setCustomHoldings] = useState<AssetPosition[]>([]);
  const crumbs = useMemo(
    () => [
      { label: "首页", to: "/admin" },
      { label: "账户", to: "/admin/accounts" },
      { label: account.name, to: location.pathname },
    ],
    [account.name, location.pathname],
  );

  const appendOrUpdate = (asset: AssetPosition) => {
    setCustomHoldings((prev) => {
      const index = prev.findIndex((row) => row.code === asset.code);
      if (index >= 0) {
        const confirm = window.confirm(
          `代码 ${asset.code} 已存在，是否覆盖？取消则追加`,
        );
        if (!confirm) {
          return [...prev, asset];
        }
        const next = [...prev];
        next[index] = asset;
        return next;
      }
      return [...prev, asset];
    });
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
          {account.type}
        </p>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-semibold text-2xl">{account.name}</h1>
            <p className="text-muted-foreground text-sm">
              {account.managerNote}
            </p>
          </div>
          <span className="flex space-x-3">
            <div className="flex flex-wrap items-center justify-end gap-3 pb-2">
              <HoldingImporter
                onAdd={appendOrUpdate}
                defaultCurrency={account.currency}
                buttonLabel="新增持仓"
              />
            </div>
          </span>
        </div>
      </header>
      {/* <nav className="flex gap-3 rounded-2xl border border-border bg-background/50 p-1 font-medium text-muted-foreground text-sm">
        {ACCOUNT_TABS.map((tab) => {
          const tabHref = href(tab.path, { accountId: account.id });
          const isActive = location.pathname === tabHref;
          return (
            <Link
              key={tab.path}
              to={tabHref}
              className={`flex-1 rounded-xl px-4 py-2 text-center transition ${
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "hover:bg-muted/20"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav> */}
      {children}
    </section>
  );
}

export { AccountShell };
