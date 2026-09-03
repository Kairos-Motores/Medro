import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModuleId } from "@/modules/registry";

/**
 * Organização do Launchpad em "pastas" (estilo macOS/iOS), definida pelo usuário
 * e persistida SÓ para ele (localStorage do navegador — mesmo padrão de
 * `useAuth` e `useDesktopShortcuts`). Para persistir entre dispositivos seria
 * preciso um endpoint de preferências por usuário (ver comentário no fim).
 */
export interface LaunchpadFolder {
  id: string;
  name: string;
  moduleIds: ModuleId[];
}

interface State {
  folders: LaunchpadFolder[];
  folderOf: (moduleId: ModuleId) => LaunchpadFolder | null;
  createFolder: (name: string, moduleId: ModuleId) => void;
  addToFolder: (folderId: string, moduleId: ModuleId) => void;
  removeFromFolder: (folderId: string, moduleId: ModuleId) => void;
  renameFolder: (folderId: string, name: string) => void;
  dissolveFolder: (folderId: string) => void;
}

const uid = () => `f_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

function pull(folders: LaunchpadFolder[], moduleId: ModuleId): LaunchpadFolder[] {
  return folders
    .map((f) => ({ ...f, moduleIds: f.moduleIds.filter((m) => m !== moduleId) }))
    .filter((f) => f.moduleIds.length > 0);
}

export const useLaunchpadLayout = create<State>()(
  persist(
    (set, get) => ({
      folders: [],
      folderOf: (moduleId) => get().folders.find((f) => f.moduleIds.includes(moduleId)) ?? null,
      createFolder: (name, moduleId) =>
        set((s) => ({
          folders: [
            ...pull(s.folders, moduleId),
            { id: uid(), name: name.trim() || "Nova pasta", moduleIds: [moduleId] },
          ],
        })),
      addToFolder: (folderId, moduleId) =>
        set((s) => {
          const cleaned = pull(s.folders, moduleId);
          const exists = cleaned.some((f) => f.id === folderId);
          return {
            folders: exists
              ? cleaned.map((f) =>
                  f.id === folderId ? { ...f, moduleIds: [...f.moduleIds, moduleId] } : f,
                )
              : cleaned,
          };
        }),
      removeFromFolder: (folderId, moduleId) =>
        set((s) => ({
          folders: s.folders
            .map((f) =>
              f.id === folderId
                ? { ...f, moduleIds: f.moduleIds.filter((m) => m !== moduleId) }
                : f,
            )
            .filter((f) => f.moduleIds.length > 0),
        })),
      renameFolder: (folderId, name) =>
        set((s) => ({
          folders: s.folders.map((f) => (f.id === folderId ? { ...f, name: name.trim() || f.name } : f)),
        })),
      dissolveFolder: (folderId) =>
        set((s) => ({ folders: s.folders.filter((f) => f.id !== folderId) })),
    }),
    { name: "medro.launchpad" },
  ),
);

/*
 * Persistência entre dispositivos (opcional, depois):
 *   1. tabela/coluna por usuário no Dataverse (ex.: cr4a1_ui_prefs, JSON) chaveada pelo login;
 *   2. GET /me/ui-prefs no login → hidrata este store (e o de atalhos);
 *   3. subscribe do store → PUT /me/ui-prefs com debounce.
 * O restante do código (Launchpad, DesktopIcons) não muda — só a origem do estado.
 */
