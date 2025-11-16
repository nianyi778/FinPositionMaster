import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  // User routes
  layout("routes/layout.tsx", [
    index("routes/index.tsx"),

    ...prefix("settings", [
      layout("routes/settings/layout.tsx", [
        route("account", "routes/settings/account.tsx"),
        route("appearance", "routes/settings/appearance.tsx"),
        route("sessions", "routes/settings/sessions.tsx"),
        route("password", "routes/settings/password.tsx"),
        route("connections", "routes/settings/connections.tsx"),
      ]),
    ]),
  ]),

  // Better Auth routes
  ...prefix("auth", [
    layout("routes/auth/layout.tsx", [
      route("sign-in", "routes/auth/sign-in.tsx"),
      route("sign-up", "routes/auth/sign-up.tsx"),
      route("sign-out", "routes/auth/sign-out.tsx"),
    ]),
    route("forget-password", "routes/auth/forget-password.tsx"),
    route("reset-password", "routes/auth/reset-password.tsx"),
  ]),

  // Admin routes
  ...prefix("admin", [
    layout("routes/admin/layout.tsx", [
      index("routes/admin/index.tsx"),
      route("dashboard", "routes/admin/dashboard.tsx"),
      route("accounts", "routes/admin/accounts/index.tsx"),
      route("accounts/settings", "routes/admin/accounts/settings.tsx"),
      route(
        "accounts/:accountId/dashboard",
        "routes/admin/accounts/$accountId/dashboard.tsx",
      ),
      route(
        "accounts/:accountId/detail",
        "routes/admin/accounts/$accountId/detail.tsx",
      ),
      route("analytics", "routes/admin/analytics.tsx"),
      route("users", "routes/admin/users/index.tsx"),
    ]),
  ]),

  // Image routes
  route("images/*", "routes/images.ts"),

  // Better Auth and other API routes
  ...prefix("api", [
    route("auth/error", "routes/api/better-error.tsx"),
    route("auth/*", "routes/api/better.tsx"),
    route("color-scheme", "routes/api/color-scheme.ts"),
  ]),

  // Not found
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
