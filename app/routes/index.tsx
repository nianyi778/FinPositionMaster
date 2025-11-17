import {
  BarChart3Icon,
  CheckCircleIcon,
  ListTodoIcon,
  type LucideIcon,
  PieChartIcon,
  SparklesIcon,
  TargetIcon,
  UserCogIcon,
} from "lucide-react";
import { href, Link } from "react-router";
import { Button } from "~/components/ui/button";

import { useAuthUser } from "~/hooks/use-auth-user";
import { AppInfo } from "~/lib/config";
import type { Route } from "./+types";

type NavLink = {
  icon: LucideIcon;
  label: string;
  description: string;
  tone?: "primary" | "secondary";
};

const featureHighlights = [
  {
    icon: SparklesIcon,
    title: "多账户协同",
    detail: "跨平台资产统一视图，实时同步仓位与资金流。",
  },
  {
    icon: TargetIcon,
    title: "三角色规则",
    detail: "核心 / 防守 / 进攻三条策略线，自动追踪偏离。",
  },
  {
    icon: CheckCircleIcon,
    title: "自动预警",
    detail: "预置监控规则，偏离 + 风险事件第一时间提醒。",
  },
];

export const meta: Route.MetaFunction = () => {
  return [{ title: `Home - ${AppInfo.name}` }];
};

export default function HomeRoute(_: Route.ComponentProps) {
  const { user } = useAuthUser();
  const isAuthenticated = Boolean(user);
  const firstName = isAuthenticated ? user.name.split(" ")[0] : "Guest";
  const heroDescription = isAuthenticated
    ? "Multi-account + 三角色仓位 + 预警机制已经配置完毕。点击任意入口即可进入深度分析。"
    : "多账户展示、三角色仓位与预警机制先行准备，先登录或注册即可体验演示页面。";
  const ctaHref = isAuthenticated ? "/admin/accounts" : "/auth/sign-in";
  const ctaLabel = isAuthenticated ? "前往资金管理" : "立即登录试用";
  const navLinks: NavLink[] = [
    {
      icon: PieChartIcon,
      label: "资金管理",
      description: "多账户 + 三角色仓位与标的配置",
      tone: "primary",
    },
    {
      icon: BarChart3Icon,
      label: "仓位分析",
      description: "集中度、货币暴露和预警一览",
    },
    {
      icon: ListTodoIcon,
      label: "Todo List",
      description: "灵活管理待办事项",
    },
    {
      icon: UserCogIcon,
      label: "账户设置",
      description: "管理个人信息与安全选项",
    },
  ];

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-4xl border border-border bg-linear-to-br from-primary/10 via-white to-slate-50 px-8 py-10 shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
        <div className="-right-10 -top-6 pointer-events-none absolute h-48 w-48 rounded-full bg-linear-to-br from-primary/60 via-cyan-400 to-transparent opacity-70 blur-3xl" />
        <div className="-left-12 pointer-events-none absolute top-10 h-32 w-32 rounded-full bg-linear-to-br from-emerald-200 to-transparent opacity-80 blur-3xl" />
        <div className="relative space-y-4 text-slate-900">
          <p className="font-semibold text-muted-foreground text-sm tracking-[0.4em]">
            Welcome Back
          </p>
          <h1 className="font-semibold text-3xl text-foreground leading-tight sm:text-4xl">
            <span className="mr-2">👋</span>
            {firstName}，欢迎来到 {AppInfo.name}
          </h1>
          <p className="max-w-3xl text-base text-muted-foreground">
            {heroDescription}
          </p>
          <div className="flex flex-wrap gap-3 pt-5">
            <Button variant="default" size="sm" asChild>
              <Link to={href(ctaHref)}>{ctaLabel}</Link>
            </Button>
            {isAuthenticated && (
              <Button variant="ghost" size="sm" asChild>
                <Link to={href("/admin/analytics")}>查看分析与预警</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatChip label="账户总数" value="3" />
          <StatChip label="目标偏离" value="+6.2%" hint="核心仓" />
          <StatChip label="预警中" value="3 条" hint="自动监控" />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-[0.4em]">
            快捷入口
          </p>
          <h2 className="font-semibold text-2xl text-foreground">
            探索你的工作台
          </h2>
          <p className="text-muted-foreground text-sm">
            自定义卡片让你快速到达常用页面，并持续掌握仓位与资产。
          </p>
        </div>
        <NavLinks links={navLinks} />
      </section>

      <section className="grid gap-6 rounded-[28px] border border-border bg-gradient-to-br from-slate-900 to-slate-900/70 p-8 text-white shadow-lg shadow-slate-900/40 md:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <p className="text-white/60 text-xs uppercase tracking-[0.4em]">
            产品亮点
          </p>
          <h3 className="font-semibold text-3xl">
            像企业官网一样介绍你的资金管理系统
          </h3>
          <p className="text-base text-white/80">
            支持多账户整合、角色划分规则与自动预警，帮助团队在单一面板内掌握资产、策略与风险。
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-white/80">
            <span className="flex items-center gap-2 rounded-full border border-white/30 px-3 py-1">
              <CheckCircleIcon size={16} />
              24/7 监控
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/30 px-3 py-1">
              <SparklesIcon size={16} />
              灰度迭代
            </span>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featureHighlights.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/20 bg-white/5 p-4 shadow-[0_10px_30px_rgba(2,6,23,0.3)] backdrop-blur"
            >
              <feature.icon className="text-white" size={26} />
              <h4 className="mt-3 font-semibold text-lg">{feature.title}</h4>
              <p className="mt-1 text-sm text-white/70">{feature.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid">
        <div className="space-y-3 rounded-[28px] border border-border/60 border-dashed bg-gradient-to-br from-slate-100/80 via-white to-white p-6">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.4em]">
            Call to Action
          </p>
          <h4 className="font-semibold text-foreground text-lg">
            准备好沉浸在资金管理的官网体验中了么？
          </h4>
          <p className="text-muted-foreground text-sm">
            点击“前往资金管理”或“查看分析与预警”，马上进入多账户、角色、预警的协同工作流。
          </p>
          <div className="flex items-center justify-center">
            <Button variant="default" size="lg" asChild>
              <Link to={href("/admin/accounts")}>开始演示</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function NavLinks({ links }: { links: NavLink[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {links.map((link) => (
        <li key={link.label}>
          <span
            className={`group flex h-full flex-col justify-between rounded-2xl border border-border p-5 text-left transition hover:border-primary/70 hover:bg-gradient-to-br hover:from-primary/10 hover:to-transparent ${
              link.tone === "primary"
                ? "bg-linear-to-br from-primary/20 to-primary/5"
                : "bg-card"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="rounded-2xl bg-white/60 p-2 shadow-slate-900/5 shadow-sm transition group-hover:shadow-lg">
                <link.icon size={24} className="text-primary" />
              </div>
              <span className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                {link.tone === "primary" ? "重点" : "常用"}
              </span>
            </div>
            <div className="mt-6 space-y-1">
              <h3 className="font-semibold text-foreground text-lg">
                {link.label}
              </h3>
              <p className="text-muted-foreground text-sm">
                {link.description}
              </p>
            </div>
          </span>
        </li>
      ))}
    </ul>
  );
}

function StatChip({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white/80 px-4 py-3 shadow-sm">
      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.3em]">
        {label}
      </p>
      <p className="font-semibold text-2xl text-foreground">{value}</p>
      {hint ? (
        <p className="text-muted-foreground text-xs">{hint}</p>
      ) : (
        <span className="text-transparent text-xs">.</span>
      )}
    </div>
  );
}
