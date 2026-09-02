import { MemoryRouter, Route, Routes } from "react-router-dom";
import { DptModule } from "./DptModule";
import { DptLaudosLayout } from "./DptLaudosLayout";
import { LaudoDetailPage } from "./LaudoDetailPage";
import { LaudoFormPage } from "./LaudoFormPage";
import { QrCodesPage } from "./QrCodesPage";

/** App do módulo DPT com histórico próprio (roda dentro de uma janela). */
export function DptApp() {
  return (
    <MemoryRouter initialEntries={["/dpt"]}>
      <div className="mx-auto w-full max-w-[1180px] p-4 lg:p-6">
        <Routes>
          <Route path="/dpt" element={<DptModule />}>
            <Route element={<DptLaudosLayout />}>
              <Route index element={null} />
              <Route path="laudo/:id" element={<LaudoDetailPage />} />
            </Route>
            <Route path="laudo/novo" element={<LaudoFormPage />} />
            <Route path="laudo/:id/editar" element={<LaudoFormPage />} />
            <Route path="qrcodes" element={<QrCodesPage />} />
          </Route>
        </Routes>
      </div>
    </MemoryRouter>
  );
}
