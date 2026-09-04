import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { LoginPage } from "@/pages/LoginPage";
import { Desktop } from "@/components/desktop/Desktop";
import { WelcomeOverlay } from "@/components/desktop/WelcomeOverlay";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 } },
});

/**
 * Shell de "sistema operacional": sem roteador no topo.
 * Cada janela (módulo) tem seu próprio MemoryRouter — routers irmãos, nunca aninhados.
 */
export function App() {
  const token = useAuth((s) => s.token);
  const welcome = useAuth((s) => s.welcome);
  return (
    <QueryClientProvider client={queryClient}>
      {token ? <Desktop /> : <LoginPage />}
      {token && welcome && <WelcomeOverlay />}
    </QueryClientProvider>
  );
}
