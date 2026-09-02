import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RequireAuth } from "./RequireAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import { HubPage } from "@/pages/HubPage";
import { StubScreen } from "@/modules/StubScreen";
import { SCREENS } from "@/modules/registry";
import { DptModule } from "@/modules/dpt/DptModule";
import { DptLaudosLayout } from "@/modules/dpt/DptLaudosLayout";
import { LaudoDetailPage } from "@/modules/dpt/LaudoDetailPage";
import { LaudoFormPage } from "@/modules/dpt/LaudoFormPage";
import { QrCodesPage } from "@/modules/dpt/QrCodesPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 } },
});

/** telas já implementadas — não caem no StubScreen */
const IMPLEMENTED = new Set(["/dpt"]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route index element={<HubPage />} />

            {/* Departamento Técnico */}
            <Route path="dpt" element={<DptModule />}>
              <Route element={<DptLaudosLayout />}>
                <Route index element={null} />
                <Route path="laudo/:id" element={<LaudoDetailPage />} />
              </Route>
              <Route path="laudo/novo" element={<LaudoFormPage />} />
              <Route path="laudo/:id/editar" element={<LaudoFormPage />} />
              <Route path="qrcodes" element={<QrCodesPage />} />
            </Route>

            {/* demais telas do registro → stub navegável */}
            {SCREENS.filter((s) => !IMPLEMENTED.has(s.path)).map((s) => (
              <Route key={s.id} path={s.path.replace(/^\//, "")} element={<StubScreen def={s} />} />
            ))}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
