import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./auth";

const BASE = import.meta.env.VITE_API_URL ?? "/api";

/** Busca a foto de perfil (cr4a1_imgperfil) como object URL. null se não houver. */
export function useProfilePhoto() {
  const token = useAuth((s) => s.token);
  const temFoto = useAuth((s) => s.user?.temFoto);
  const cred = useAuth((s) => s.user?.credencialId);

  return useQuery({
    queryKey: ["me", "photo", cred],
    enabled: !!token && !!temFoto,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    queryFn: async () => {
      const res = await fetch(`${BASE}/me/photo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    },
  });
}
