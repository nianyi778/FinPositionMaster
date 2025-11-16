import { useId } from "react";
import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "~/lib/finance/utils";
import { cn } from "~/lib/utils";

const DEFAULT_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const DEFAULT_ACCOUNT_HISTORY = [
  820000, 780000, 800000, 810000, 840000, 860000, 880000,
];
const DEFAULT_BENCHMARK_HISTORY = [
  780000, 790000, 805000, 795000, 820000, 830000, 845000,
];

type SparklineDataPoint = {
  label: string;
  account: number;
  benchmark: number;
};

type SparklineProps = {
  accountHistory?: number[];
  benchmarkHistory?: number[];
  labels?: string[];
  accountLabel?: string;
  benchmarkLabel?: string;
  currency?: string;
  className?: string;
};

function Sparkline({
  accountHistory,
  benchmarkHistory,
  labels,
  accountLabel = "账户资产",
  benchmarkLabel = "S&P 500",
  currency = "CNY",
  className,
}: SparklineProps) {
  const id = useId();
  const historyAccount = accountHistory?.length
    ? accountHistory
    : DEFAULT_ACCOUNT_HISTORY;
  const historyBenchmark = benchmarkHistory?.length
    ? benchmarkHistory
    : DEFAULT_BENCHMARK_HISTORY;
  const maxLength = Math.max(
    historyAccount.length,
    historyBenchmark.length,
    labels?.length ?? 0,
    DEFAULT_LABELS.length,
  );
  const resolvedLabels = Array.from({ length: maxLength }, (_, index) => {
    const explicitLabel = labels?.[index];
    return (
      (typeof explicitLabel === "string"
        ? explicitLabel
        : DEFAULT_LABELS[index]) ?? `T${index + 1}`
    );
  }) as string[];

  const chartData: SparklineDataPoint[] = Array.from(
    { length: maxLength },
    (_, index) => {
      const label =
        resolvedLabels[index] ??
        resolvedLabels[resolvedLabels.length - 1] ??
        `T${index + 1}`;
      return {
        label,
        account:
          historyAccount[index] ??
          historyAccount[historyAccount.length - 1] ??
          0,
        benchmark:
          historyBenchmark[index] ??
          historyBenchmark[historyBenchmark.length - 1] ??
          0,
      };
    },
  );

  const accountColor = "#3A82F7";
  const benchmarkColor = "#34A853";

  return (
    <div
      className={cn("flex h-full w-full flex-col", className)}
      style={{ minHeight: 160 }}
    >
      <ResponsiveContainer className={"h-full w-full flex-1"}>
        <LineChart
          data={chartData}
          margin={{ top: 12, right: 18, bottom: 0, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            stroke="#9CA3AF"
            fontSize={12}
            padding={{ left: 0, right: 0 }}
          />
          <YAxis hide domain={["dataMin * 0.95", "dataMax * 1.05"]} />
          <Tooltip
            content={
              <SparklineTooltip
                currency={currency}
                accountLabel={accountLabel}
                benchmarkLabel={benchmarkLabel}
              />
            }
          />
          <defs>
            <linearGradient
              id={`sparkline-fill-${id}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={accountColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={accountColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="account"
            stroke={accountColor}
            strokeWidth={2.5}
            fill={`url(#sparkline-fill-${id})`}
            fillOpacity={1}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="account"
            stroke={accountColor}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="benchmark"
            stroke={benchmarkColor}
            strokeWidth={2}
            dot={{ r: 2, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap items-center gap-4 font-semibold text-muted-foreground text-xs">
        <span className="flex items-center gap-2 text-foreground">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accountColor }}
          />
          {accountLabel}
        </span>
        <span className="flex items-center gap-2 text-foreground">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: benchmarkColor }}
          />
          {benchmarkLabel}
        </span>
      </div>
    </div>
  );
}

type SparklineTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    dataKey?: string;
    name?: string;
    stroke?: string;
  }>;
  label?: string;
  currency?: string;
  accountLabel?: string;
  benchmarkLabel?: string;
};

function SparklineTooltip({
  active,
  payload,
  label,
  currency,
  accountLabel,
  benchmarkLabel,
}: SparklineTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const formatValue = (value?: number) => {
    if (value === undefined) {
      return "--";
    }
    return currency
      ? formatCurrency(value, currency)
      : value.toLocaleString("en-US", {
          maximumFractionDigits: 0,
        });
  };

  const accountPoint = payload.find((item) => item.dataKey === "account");
  const benchmarkPoint = payload.find((item) => item.dataKey === "benchmark");

  return (
    <div className="pointer-events-none rounded-md border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
        {label}
      </p>
      {accountPoint && (
        <div className="flex items-center gap-2 text-foreground text-sm">
          <span className="flex h-2 w-2 items-center justify-center rounded-full bg-[#3A82F7]" />
          <span>{accountLabel ?? "账户资产"}</span>
          <span className="font-semibold">
            {formatValue(accountPoint.value)}
          </span>
        </div>
      )}
      {benchmarkPoint && (
        <div className="mt-1 flex items-center gap-2 text-foreground text-sm">
          <span className="flex h-2 w-2 items-center justify-center rounded-full bg-[#34A853]" />
          <span>{benchmarkLabel ?? "S&P 500"}</span>
          <span className="font-semibold">
            {formatValue(benchmarkPoint.value)}
          </span>
        </div>
      )}
    </div>
  );
}

export { Sparkline };
