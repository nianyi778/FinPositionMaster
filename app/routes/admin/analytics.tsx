import { AlertRow } from "~/components/finance/alert-row";
import { ChartCard } from "~/components/finance/chart-card";
import { AppInfo } from "~/lib/config";
import { analyticsSnapshot } from "~/lib/finance/data";
import type { Route } from "./+types/analytics";

const ROLE_COLOR: Record<string, string> = {
  核心仓: "#3A82F7",
  防守仓: "#4CAF50",
  进攻仓: "#EF5350",
};

export const meta: Route.MetaFunction = () => {
  return [{ title: `Analytics - ${AppInfo.name}` }];
};

export default function AnalyticsRoute() {
  const {
    roleDistribution,
    focusExposure,
    currencyExposure,
    concentration,
    alerts,
  } = analyticsSnapshot;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
          仓位分析与预警
        </p>
        <h1 className="font-semibold text-2xl">多账户概览</h1>
        <p className="text-muted-foreground text-sm">
          核心 / 防守 / 进攻 · 风险 · 预警信息
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="角色偏离" description="跨账户仓位占比">
          <div className="space-y-3">
            {roleDistribution.map((role) => (
              <div key={role.label} className="space-y-1">
                <div className="flex items-center justify-between font-semibold text-foreground text-sm">
                  <span>{role.label}</span>
                  <span>{role.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-border">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${role.value}%`,
                      backgroundColor: ROLE_COLOR[role.label] ?? "#3A82F7",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="集中度指标" description="HHI 趋势监控">
          <div className="space-y-4">
            <div className="font-semibold text-3xl text-foreground">
              {(concentration.hhi * 100).toFixed(2)}%
            </div>
            <p className="text-muted-foreground text-sm">
              HHI 0.19 表示持仓集中度较高，建议关注单一标的。
            </p>
            <div className="h-40 rounded-2xl border border-border bg-gradient-to-br from-red-100 via-transparent to-transparent" />
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="主题暴露" description="行业/赛道分布">
          <div className="space-y-3">
            {focusExposure.map((item) => (
              <div key={item.label} className="space-y-1">
                <div
                  className="flex items-center justify-between font-semibold text-sm"
                >
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-border">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: "#3F7FFF",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="货币暴露" description="汇率风险提示">
          <div className="space-y-4">
            {currencyExposure.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between font-semibold text-sm"
              >
                <span>{item.label}</span>
                <span className="text-muted-foreground">{item.value}%</span>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2 text-center text-muted-foreground text-xs">
              {currencyExposure.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border px-2 py-1"
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
              预警中心
            </p>
            <h2 className="font-semibold text-lg">全局预警</h2>
          </div>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertRow
              key={alert.title}
              title={alert.title}
              details={alert.details}
              severity={alert.severity}
            />
          ))}
        </div>
      </section>
    </section>
  );
}
