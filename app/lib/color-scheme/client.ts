import type { ColorScheme } from "./components";

const COOKIE_NAME = "__color-scheme";
const COOKIE_MAX_AGE = 34560000;
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

let systemMediaListener:
  | ((event: MediaQueryListEvent | MediaQueryList) => void)
  | null = null;
let systemMediaQuery: MediaQueryList | null = null;

declare global {
  interface Window {
    __betterAuthColorScheme?: ColorScheme;
  }
}

function clearSystemListener() {
  if (systemMediaListener && systemMediaQuery?.removeEventListener) {
    systemMediaQuery.removeEventListener("change", systemMediaListener as () => void);
  }
  systemMediaListener = null;
  systemMediaQuery = null;
}

function updateSystemClass(media: MediaQueryList | MediaQueryListEvent) {
  if (media.matches) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function serializeCookie(colorScheme: ColorScheme) {
  if (colorScheme === "system") {
    return `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
  }
  return `${COOKIE_NAME}=${colorScheme}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
}

function setCookie(colorScheme: ColorScheme) {
  document.cookie = serializeCookie(colorScheme);
}

export function applyColorSchemeOnClient(colorScheme: ColorScheme) {
  if (typeof document === "undefined") return;
  clearSystemListener();
  window.__betterAuthColorScheme = colorScheme;
  if (colorScheme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (colorScheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    const media = window.matchMedia(MEDIA_QUERY);
    updateSystemClass(media);
    systemMediaListener = (event: MediaQueryListEvent | MediaQueryList) =>
      updateSystemClass(event);
    systemMediaQuery = media;
    media.addEventListener("change", systemMediaListener as (event: MediaQueryListEvent) => void);
  }
  setCookie(colorScheme);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<ColorScheme>("color-scheme-update", {
        detail: colorScheme,
      }),
    );
  }
}

export function getClientColorSchemeOverride(): ColorScheme | undefined {
  if (typeof window === "undefined") return undefined;
  return window.__betterAuthColorScheme;
}
