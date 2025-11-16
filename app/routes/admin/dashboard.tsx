import { href, Link } from "react-router";
import { AccountCard } from "~/components/finance/account-card";
import { Button } from "~/components/ui/button";
import { AppInfo } from "~/lib/config";
import { type FinanceAccount, financeAccounts } from "~/lib/finance/data";
import type { Route } from "./+types/index";

export const meta: Route.MetaFunction = () => {
  return [{ title: `Accounts - ${AppInfo.name}` }];
};

export const handle = {
  breadcrumb: () => [{ label: "账户仪表板", to: "/admin/dashboard" }],
};

export default function AccountsRoute() {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
            多账户资金管理
          </p>
          <h1 className="font-semibold text-2xl">账户列表</h1>
          <p className="text-muted-foreground text-sm">
            共 {financeAccounts.length} 个账户 · 多角色仓位梳理
          </p>
        </div>
        <Button variant="default" size="sm" asChild>
          <Link to={href("/admin")}>添加账户</Link>
        </Button>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {financeAccounts.map((account: FinanceAccount) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </section>
  );
}
