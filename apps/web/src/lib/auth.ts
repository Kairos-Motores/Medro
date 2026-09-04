import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSession, AccessToken } from "@medro/shared";
import { hasAccess } from "@medro/shared";

interface AuthState {
  token: string | null;
  user: UserSession | null;
  /** true logo após um login nesta aba — dispara a transição de boas-vindas.
   *  Não é persistido: recarregar a página com sessão salva não reanima. */
  welcome: boolean;
  setSession: (token: string, user: UserSession) => void;
  /** atualiza só os dados do usuário (sync com /auth/me) sem reanimar o welcome */
  refreshUser: (user: UserSession) => void;
  updateAcessoMod: (acessoMod: string) => void;
  dismissWelcome: () => void;
  clear: () => void;
  can: (...tokens: AccessToken[]) => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      welcome: false,
      setSession: (token, user) => set({ token, user, welcome: true }),
      refreshUser: (user) => set({ user }),
      updateAcessoMod: (acessoMod) => {
        const u = get().user;
        if (u) {
          set({ user: { ...u, acessoMod } });
        }
      },
      dismissWelcome: () => set({ welcome: false }),
      clear: () => set({ token: null, user: null, welcome: false }),
      can: (...tokens) => {
        const mod = get().user?.acessoMod ?? "";
        return tokens.every((t) => hasAccess(mod, t));
      },
    }),
    {
      name: "medro.auth",
      partialize: (s) => ({ token: s.token, user: s.user }),
    },
  ),
);
