import { href, Link, Outlet } from "react-router";
import AppFooter from "~/components/admin/layout/footer";
import { AppLogo } from "~/components/app-logo";
import { ColorSchemeToggle } from "~/components/color-scheme-toggle";
import { UserNav } from "~/components/user-nav";
import { loadAuthSession, loadSessionMiddleware } from "~/middlewares/auth-guard";
import type { Route } from "./+types/layout";

export const middleware = [loadSessionMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
  const session = await loadAuthSession(request, context);
  return session;
}

export default function AuthenticatedLayout(_: Route.ComponentProps) {
  return (
    <>
      <div className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md">
        <header className="mx-auto max-w-[1400px]">
          <div className="flex w-full items-center justify-between p-4 sm:px-10">
            <Link to={href("/")} className="flex items-center gap-2">
              <AppLogo />
            </Link>
            <div className="flex items-center gap-4">
              <ColorSchemeToggle />
              <UserNav />
            </div>
          </div>
        </header>
      </div>

      <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-10 sm:py-10">
        <Outlet />
      </main>
      <AppFooter />
    </>
  );
}
