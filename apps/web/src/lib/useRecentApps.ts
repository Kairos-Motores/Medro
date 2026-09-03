import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./auth";
import { MODULES, type ModuleDef, type ModuleId, moduleById } from "@/modules/registry";

const DEFAULT_RECENT_MODULES: ModuleId[] = [
  "medro-pro",
  "os-medro",
  "central-bobinagem",
  "inspecao-qualidade",
  "ferramentaria",
  "peritagem",
  "dpt-laudos",
  "caldeiraria",
  "balanceamento",
  "configuracoes",
];

export function useRecentApps() {
  const user = useAuth((s) => s.user);
  const can = useAuth((s) => s.can);
  const userId = user?.login || user?.matProtheus || "default_user";
  const storageKey = `medro_recent_apps_${userId}`;

  const [recentIds, setRecentIds] = useState<ModuleId[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as ModuleId[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Garante que não haja duplicatas
          return Array.from(new Set(parsed));
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_RECENT_MODULES;
  });

  // Atualiza storage quando recentIds muda
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(recentIds));
    } catch {
      // ignore storage error
    }
  }, [recentIds, storageKey]);

  // Registra a abertura de um aplicativo, movendo-o para a primeira posição
  const recordAppOpen = useCallback((moduleId: ModuleId) => {
    setRecentIds((prev) => {
      const next = [moduleId, ...prev.filter((id) => id !== moduleId)];
      return next;
    });
  }, []);

  // Retorna os módulos recentes filtrados por permissão do usuário
  const getRecentModules = useCallback(
    (limit: number): ModuleDef[] => {
      // Módulos acessíveis para este usuário
      const accessibleModules = MODULES.filter((m) => !m.access || can(...m.access));
      const accessibleIds = new Set(accessibleModules.map((m) => m.id));

      // Ordena de acordo com o histórico de recentes
      const ordered: ModuleDef[] = [];
      const seen = new Set<ModuleId>();

      // 1. Adiciona os que estão no histórico de recentes
      for (const id of recentIds) {
        if (accessibleIds.has(id) && !seen.has(id)) {
          const mod = accessibleModules.find((m) => m.id === id);
          if (mod) {
            ordered.push(mod);
            seen.add(id);
          }
        }
      }

      // 2. Completa com o restante dos módulos acessíveis, se necessário
      for (const mod of accessibleModules) {
        if (!seen.has(mod.id)) {
          ordered.push(mod);
          seen.add(mod.id);
        }
      }

      // Se o usuário tem limit ou menos, mostra todos os que tem. Se tiver mais, mostra limit.
      if (ordered.length <= limit) {
        return ordered;
      }
      return ordered.slice(0, limit);
    },
    [recentIds, can],
  );

  return {
    recentIds,
    recordAppOpen,
    getRecentModules,
  };
}
