import { AppInfo } from "~/lib/config";

export default function AppFooter() {
  return (
    <div className="border border-border bg-slate-950/95 py-10 text-sm text-white shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
      <footer className="mx-auto max-w-[1400px] p-4 sm:px-10">
        <div className="mx-auto flex w-full flex-wrap gap-8">
          <div className="flex flex-1 flex-col gap-3">
            <p className="font-semibold text-lg text-white/80 uppercase tracking-widest">
              {AppInfo.name}
            </p>
            <p className="text-white/60 text-xs">
              多账户与三角色策略的资金管理系统 · 构建在 React Router v7 +
              Cloudflare Workers + Better Auth。
            </p>
            <div className="flex gap-3 text-white/50 text-xs">
              <a href="mailto:hello@example.com" className="hover:text-white">
                Contact
              </a>
              <a
                href="https://better-auth.dev"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                Docs
              </a>
              <a
                href="https://github.com/claritydevai/better-auth"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                GitHub
              </a>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-white/60 text-xs uppercase tracking-[0.4em]">
              服务
            </p>
            <ul className="space-y-1 text-sm">
              <li>多账户协同</li>
              <li>角色策略</li>
              <li>资产预警</li>
            </ul>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-white/60 text-xs uppercase tracking-[0.4em]">
              资源
            </p>
            <ul className="space-y-1 text-sm">
              <li>案例合集</li>
              <li>开发者文档</li>
              <li>平台状态</li>
            </ul>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-white/60 text-xs uppercase tracking-[0.4em]">
              法律
            </p>
            <ul className="space-y-1 text-sm">
              <li>隐私政策</li>
              <li>使用条款</li>
              <li>安全报告</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-white/10 border-t pt-6 text-center text-white/60 text-xs uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} {AppInfo.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
