import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "~/lib/utils";

type RoleSegment = {
  label: string;
  value: number;
  color: string;
};

type RoleDistributionChartProps = {
  segments: RoleSegment[];
  centerLabel?: string;
  className?: string;
};

function RoleDistributionChart({
  segments,
  centerLabel,
  className,
}: RoleDistributionChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground text-xs",
        className,
      )}
    >
      <div className="relative aspect-square h-full min-h-[200px] w-full min-w-0 max-w-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={3}
              stroke="transparent"
            >
              {segments.map((segment) => (
                <Cell key={segment.label} fill={segment.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value}%`, name]}
              contentStyle={{
                borderRadius: 8,
                borderColor: "rgb(226 232 240)",
                backgroundColor: "white",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-semibold text-foreground">
          <span className="text-xs">{centerLabel ?? "角色"}</span>
          <span className="mt-1 text-sm">{total ? `${total}%` : "0%"}</span>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="flex items-center justify-between text-muted-foreground text-sm"
          >
            <div className="flex items-center gap-2 text-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="font-medium">{segment.label}</span>
            </div>
            <span className="font-semibold text-foreground">
              {segment.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { RoleDistributionChart };
