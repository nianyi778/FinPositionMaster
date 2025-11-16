import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type ChartCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  badge?: ReactNode;
  chart?: ReactNode;
};

function ChartCard({
  title,
  description,
  children,
  badge,
  chart,
}: ChartCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{title}</CardTitle>
          {badge}
        </div>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="h-full space-y-4 pt-0">
        {chart ? (
          <div className="h-52 w-full min-h-[180px] min-w-0 overflow-hidden rounded-2xl border border-border bg-card">
            {chart}
          </div>
        ) : null}

        {children}
      </CardContent>
    </Card>
  );
}

export { ChartCard };
