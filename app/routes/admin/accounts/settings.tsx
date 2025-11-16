import { useMemo, useState } from "react";
import { SliderControl } from "~/components/finance/slider-control";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { AppInfo } from "~/lib/config";
import type { FinanceRole } from "~/lib/finance/data";
import { financeAccounts } from "~/lib/finance/data";
import type { Route } from "./+types/settings";

const ROLE_KEYS: FinanceRole[] = ["core", "defense", "offense"];

const baseConversionValues = { USD: 150.4, HKD: 19.4, CNY: 1 };

export const meta: Route.MetaFunction = () => {
  return [{ title: `Accounts Settings - ${AppInfo.name}` }];
};

export const handle = {
  breadcrumb: () => [
    { label: "账户", to: "/admin/accounts" },
    { label: "全局设置" },
  ],
};

export default function AccountsSettingsRoute() {
  const [roleTargets, setRoleTargets] = useState<Record<FinanceRole, number>>({
    core: 55,
    defense: 30,
    offense: 15,
    custom: 0,
  });
  const [typeWeights, setTypeWeights] = useState<Record<string, number>>(() => {
    const types = Array.from(
      new Set(
        financeAccounts.flatMap((account) =>
          account.topHoldings.map((asset) => asset.type),
        ),
      ),
    );
    return types.reduce<Record<string, number>>((acc, type) => {
      acc[type] = Math.round(100 / types.length);
      return acc;
    }, {});
  });
  const [conversionRates, setConversionRates] = useState(baseConversionValues);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const aggregatedHoldings = useMemo(
    () => financeAccounts.flatMap((account) => account.topHoldings),
    [],
  );

  const typeEntries = useMemo(
    () =>
      Object.entries(typeWeights).map(([type, value]) => ({
        type,
        value,
      })),
    [typeWeights],
  );

  const handleSave = () => {
    setSavedAt(new Date().toLocaleTimeString());
  };

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
          仓位配置 · 资产权重
        </p>
        <h1 className="font-semibold text-3xl">全局设置</h1>
        <p className="text-muted-foreground text-sm">
          可依照{" "}
          <a className="text-primary hover:underline" href="/docs/data-spec.md">
            数据规范
          </a>{" "}
          的字段映射调整目标仓位和标的占比，默认换算金额则用来计算多币种资产的统一价值。
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>仓位目标</CardTitle>
            <CardDescription>核心 / 防守 / 进攻 的目标百分比</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {ROLE_KEYS.map((role) => (
              <div
                key={role}
                className="space-y-3 rounded-2xl border border-border bg-card p-4"
              >
                <div className="mt-3">
                  <SliderControl
                    value={roleTargets[role]}
                    onValueChange={(nextValue) =>
                      setRoleTargets((prev) => ({
                        ...prev,
                        [role]: Math.max(0, Math.min(100, nextValue)),
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between gap-4 font-semibold text-sm">
                  <span className="text-muted-foreground">目标仓位 (%)</span>
                  <Input
                    id={`${role}-target`}
                    type="number"
                    min={0}
                    max={100}
                    value={roleTargets[role]}
                    onChange={(event) =>
                      setRoleTargets((prev) => ({
                        ...prev,
                        [role]: Math.max(
                          0,
                          Math.min(100, Number(event.target.value)),
                        ),
                      }))
                    }
                    className="max-w-[140px]"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>默认换算金额</CardTitle>
            <CardDescription>用于跨币种资产的统一估值</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(conversionRates).map(([currency, amount]) => (
              <div
                key={currency}
                className="grid items-center gap-3 md:grid-cols-[120px_1fr]"
              >
                <div className="font-semibold">{currency}</div>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={amount}
                  onChange={(event) =>
                    setConversionRates((prev) => ({
                      ...prev,
                      [currency]: Math.max(0, Number(event.target.value)),
                    }))
                  }
                />
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button onClick={handleSave} size="sm">
              保存设置
            </Button>
            {savedAt ? (
              <p className="text-muted-foreground text-xs">已保存 {savedAt}</p>
            ) : (
              <p className="text-muted-foreground text-xs">尚未保存</p>
            )}
          </CardFooter>
        </Card>
      </div>

      <section className="space-y-2 rounded-2xl border border-border bg-background/50 p-5 text-muted-foreground text-sm">
        <p>
          说明：仓位、标的占比与默认换算金额将结合{" "}
          <strong>docs/data-spec.md</strong> 里 describe 的
          `holdings.csv`、`market-data.csv` 与 `config.json`
          字段，确保未来导入与系统计算保持一致。
        </p>
        <p>
          支持标准化的
          ETF（TEF）与正股、现金和替代资产类型，系统会自动在分析页转为统一基准（JPY/默认汇率）。
        </p>
      </section>
    </section>
  );
}
