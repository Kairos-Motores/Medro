import { Outlet, useLocation } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { DesktopTopbar } from "./DesktopTopbar";
import { byPath, MODULES } from "@/modules/registry";

function deriveTitle(pathname: string): string | undefined {
  if (pathname === "/") return undefined;
  const scr = byPath(pathname);
  if (scr) return scr.title;
  const mod = MODULES.find((m) => m.path !== "/" && pathname.startsWith(m.path));
  return mod?.label;
}

/** Shell persistente e responsivo — sem menu lateral.
 *  Navegação: hub (tela principal) + switcher no header. */
export function AppLayout() {
  const { pathname } = useLocation();
  const title = deriveTitle(pathname);
  const transitionKey = pathname.split("/").slice(0, 3).join("/") || "/";
  const showBack = pathname !== "/";

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <AppHeader title={title} showBack={showBack} />
      <DesktopTopbar title={title} showBack={showBack} />

      <main className="relative flex-1">
        <div
          key={transitionKey}
          className="page-enter mx-auto w-full max-w-md p-4 lg:max-w-[1120px] lg:px-8 lg:py-7"
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
