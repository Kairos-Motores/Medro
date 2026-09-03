import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSession, AccessToken } from "@medro/shared";
import { hasAccess } from "@medro/shared";

interface AuthState {
  token: string | null;
  user: UserSession | null;
  setSession: (token: string, user: UserSession) => void;
  updateAcessoMod: (acessoMod: string) => void;
  clear: () => void;
  can: (...tokens: AccessToken[]) => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      updateAcessoMod: (acessoMod) => {
        const u = get().user;
        if (u) {
          set({ user: { ...u, acessoMod } });
        }
      },
      clear: () => set({ token: null, user: null }),
      can: (...tokens) => {
        const mod = get().user?.acessoMod ?? "";
        return tokens.every((t) => hasAccess(mod, t));
      },
    }),
    { name: "medro.auth" },
  ),
);
