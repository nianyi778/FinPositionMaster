import type { ReactNode } from "react";

type Severity = "error" | "warning" | "info";

const severityMeta: Record<Severity, { label: string; color: string; emoji: string }> = {
  error: { label: "严重", color: "text-destructive", emoji: "🟥" },
  warning: { label: "警告", color: "text-amber-600", emoji: "🟧" },
  info: { label: "提示", color: "text-emerald-600", emoji: "🟢" },
};

type AlertRowProps = {
  title: string;
  details: string;
  severity: Severity;
  trailing?: ReactNode;
};

function AlertRow({ title, details, severity, trailing }: AlertRowProps) {
  const meta = severityMeta[severity];
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="text-lg font-semibold" aria-hidden>
        {meta.emoji}
      </div>
      <div className="flex-1 space-y-1 text-sm">
        <div className="flex items-center justify-between gap-4 text-base font-semibold text-foreground">
          <span className={meta.color}>{title}</span>
          {trailing}
        </div>
        <p className="text-muted-foreground">{details}</p>
      </div>
    </div>
  );
}

export { AlertRow };
