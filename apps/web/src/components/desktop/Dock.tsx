import React, { useState, useRef, useEffect, useMemo } from "react";
import { LayoutGrid, Search, X, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useWM } from "@/lib/wm";
import { cn } from "@/lib/cn";
import { MODULES, ACCENT, type ModuleDef } from "@/modules/registry";
import { useRecentApps } from "@/lib/useRecentApps";

export function Dock({ hidden = false }: { hidden?: boolean }) {
  const can = useAuth((s) => s.can);
  const { windows, open, focus, setLaunchpad, activeId } = useWM();
  const { getRecentModules, recordAppOpen } = useRecentApps();

  // Verifica se há alguma janela aberta
  const hasOpenApps = windows.length > 0;

  // Limite de apps recentes: 3 se houver apps abertos, 6 se não houver
  const limit = hasOpenApps ? 3 : 6;
  const recentModules = getRecentModules(limit);

  // Monitora e registra sempre a janela ativa como mais recente
  useEffect(() => {
    if (!activeId) return;
    const win = windows.find((w) => w.id === activeId);
    if (win) {
      recordAppOpen(win.moduleId);
    }
  }, [activeId, windows, recordAppOpen]);

  // Estado da barra de pesquisa:
  // Quando não há apps abertos: expandida por padrão
  // Quando há apps abertos: colapsada por padrão, expande ao clicar
  const [manualExpand, setManualExpand] = useState(false);
  const isSearchExpanded = !hasOpenApps || manualExpand;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fecha a expansão manual ao fechar todos os apps ou ao abrir um app
  useEffect(() => {
    if (!hasOpenApps) {
      setManualExpand(false);
    }
  }, [hasOpenApps]);

  // Foca o input quando expandir manualmente
  useEffect(() => {
    if (manualExpand && inputRef.current) {
      inputRef.current.focus();
    }
  }, [manualExpand]);

  // Fecha a expansão manual e resultados ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        if (hasOpenApps) {
          setManualExpand(false);
        }
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hasOpenApps]);

  // Módulos filtrados para o Spotlight da pesquisa rápida
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return MODULES.filter((m) => {
      const allowed = !m.access || can(...m.access);
      if (!allowed) return false;
      return (
        m.label.toLowerCase().includes(q) ||
        m.short.toLowerCase().includes(q) ||
        m.desc.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, can]);

  // Navegação por teclado no resultado da busca
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearchQuery("");
      if (hasOpenApps) setManualExpand(false);
      inputRef.current?.blur();
      return;
    }
    if (filteredModules.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredModules.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredModules.length) % filteredModules.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filteredModules[selectedIndex];
      if (target) {
        handleOpenApp(target);
      }
    }
  };

  const handleOpenApp = (m: ModuleDef) => {
    recordAppOpen(m.id);
    open(m.id, m.label);
    setSearchQuery("");
    if (hasOpenApps) {
      setManualExpand(false);
    }
  };

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-2.5 lg:pb-3 transition-all duration-300 ease-out",
        hidden ? "translate-y-28 opacity-0 pointer-events-none" : "translate-y-0 opacity-100",
      )}
    >
      <div className="material-menu pointer-events-auto flex items-center gap-1.5 rounded-2xl border border-white/25 dark:border-white/10 px-2 py-1.5 shadow-mac-2 transition-all duration-300 ease-out">
        {/* Botão Launchpad */}
        <button
          onClick={() => setLaunchpad(true)}
          className="group relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-slate-500/90 to-slate-700/90 text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          title="Launchpad"
        >
          <LayoutGrid className="size-5" />
          <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-elevated-dark px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 shadow-sm">
            Launchpad
          </span>
        </button>

        {/* Separador vertical */}
        <span className="mx-1 h-8 w-px shrink-0 self-center bg-black/10 dark:bg-white/15" />

        {/* Lista de Aplicativos Recentes (6 quando vazio, 3 quando houver app aberto) */}
        <div className="flex items-center gap-1.5 transition-all duration-300 ease-out">
          {recentModules.map((m) => {
            const Icon = m.icon;
            const a = ACCENT[m.accent];
            const win = windows.find((w) => w.moduleId === m.id);
            const running = !!win;
            const isActive = win && win.id === activeId && !win.minimized;

            return (
              <button
                key={m.id}
                onClick={() => handleOpenApp(m)}
                title={m.label}
                className={cn(
                  "group relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-black/5 dark:border-white/10 bg-surface/90 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-md",
                  a.text,
                )}
              >
                <Icon className="size-[22px]" strokeWidth={2} />

                {/* Indicador de janela em execução / ativa */}
                {running && (
                  <span
                    className={cn(
                      "absolute -bottom-1 size-1 rounded-full transition-all duration-200",
                      isActive ? "bg-foreground w-2" : "bg-foreground/40",
                    )}
                  />
                )}

                {/* Tooltip macOS */}
                <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-elevated-dark px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 shadow-sm">
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Separador vertical antes da busca */}
        <span className="mx-1 h-8 w-px shrink-0 self-center bg-black/10 dark:bg-white/15" />

        {/* Caixa de Entrada / Pesquisa Fixa no Extremo Direito */}
        <div ref={searchContainerRef} className="relative flex items-center">
          {/* Dropdown de Resultados da Pesquisa (Spotlight Popover) */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute bottom-full right-0 mb-3 w-72 sm:w-80 rounded-2xl border border-white/20 dark:border-white/10 bg-surface/95 p-2 shadow-mac-3 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
              <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-1.5">
                <span>Aplicativos Encontrados</span>
                <span>{filteredModules.length}</span>
              </div>

              <div className="mt-1 max-h-64 overflow-y-auto space-y-0.5">
                {filteredModules.length > 0 ? (
                  filteredModules.map((item, idx) => {
                    const Icon = item.icon;
                    const a = ACCENT[item.accent];
                    const isSelected = idx === selectedIndex;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleOpenApp(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-2.5 py-2 cursor-pointer transition-colors text-xs",
                          isSelected
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "hover:bg-surface-2 text-foreground",
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div
                            className={cn(
                              "flex size-7 shrink-0 items-center justify-center rounded-lg border border-black/5 dark:border-white/10 bg-surface",
                              isSelected ? "text-primary-foreground" : a.text,
                            )}
                          >
                            <Icon className="size-4" />
                          </div>
                          <div className="truncate">
                            <span className="block truncate">{item.label}</span>
                            <span
                              className={cn(
                                "block text-[10px] truncate",
                                isSelected ? "text-primary-foreground/80" : "text-muted-foreground",
                              )}
                            >
                              {item.desc}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight className="size-3.5 opacity-60 shrink-0 ml-1" />
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    Nenhum aplicativo encontrado para "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Container animado da caixa de busca */}
          <div
            className={cn(
              "relative flex items-center overflow-hidden rounded-xl border border-black/5 dark:border-white/10 bg-surface/90 backdrop-blur-md transition-all duration-300 ease-in-out cursor-pointer",
              isSearchExpanded ? "w-52 sm:w-64 h-11 px-3 shadow-xs cursor-text" : "w-11 h-11 justify-center hover:-translate-y-1 hover:shadow-md",
            )}
            onClick={() => {
              if (!isSearchExpanded) {
                setManualExpand(true);
              }
              inputRef.current?.focus();
            }}
          >
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                if (!isSearchExpanded) {
                  setManualExpand(true);
                }
                inputRef.current?.focus();
              }}
              className={cn(
                "flex items-center justify-center p-0.5 bg-transparent border-0 focus:outline-none cursor-pointer",
                isSearchExpanded ? "text-muted-foreground mr-2" : "text-foreground hover:text-primary",
              )}
              title={isSearchExpanded ? "Buscar aplicativo" : "Pesquisar aplicativos"}
            >
              <Search className="size-4 shrink-0 transition-colors duration-200" />
            </button>

            {/* Input de texto visível apenas quando expandido */}
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Buscar app..."
              className={cn(
                "h-full w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none transition-opacity duration-200",
                isSearchExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none w-0",
              )}
            />

            {/* Botão limpar quando houver texto digitado */}
            {isSearchExpanded && searchQuery.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery("");
                  inputRef.current?.focus();
                }}
                className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}

            {/* Botão recolher quando expandido manualmente enquanto apps estão abertos */}
            {hasOpenApps && isSearchExpanded && searchQuery.length === 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setManualExpand(false);
                }}
                className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                title="Recolher busca"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
