import { Outlet } from "react-router";
import { requireAuth, requireUser } from "~/middlewares/auth-guard";
import { Menu } from "~/components/settings/settings-menu";
import type { Route } from "./+types/layout";

export const middleware = [requireAuth];

export async function loader(_: Route.LoaderArgs) {
  return requireUser();
}

export default function Layout(_: Route.ComponentProps) {
  return (
    <>
      <Menu />
      <Outlet />
    </>
  );
}
