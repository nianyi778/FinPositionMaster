import { useRouteLoaderData } from "react-router";
import type { loader as authAdminLayoutLoader } from "~/routes/admin/layout";
import type { loader as authLayoutLoader } from "~/routes/layout";

export function useAuthUser() {
  const data = useRouteLoaderData<typeof authLayoutLoader>("routes/layout");
  return {
    user: data?.user ?? null,
    session: data ?? null,
  };
}

export function useAuthAdmin() {
  const data = useRouteLoaderData<typeof authAdminLayoutLoader>(
    "routes/admin/layout",
  );
  if (!data) throw new Error("No admin user data found.");
  return { ...data };
}
