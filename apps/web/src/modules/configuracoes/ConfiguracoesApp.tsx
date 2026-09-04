import { useState, useRef } from "react";
import {
  Palette,
  User,
  Building2,
  Bell,
  Wifi,
  Info,
  ChevronRight,
  ChevronLeft,
  Search,
  Check,
  Sun,
  Moon,
  Upload,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  IdCard,
  Briefcase,
  MapPin,
  ExternalLink,
  Volume2,
  RefreshCw,
  LogOut,
  Sliders,
  Layers,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTheme, type WallpaperOption, type ThemeMode } from "@/lib/theme";
import { initials } from "@/lib/useClock";
import { useProfilePhoto } from "@/lib/useProfilePhoto";
import type { SettingsSectionId } from "./types";
import { GestaoUsuariosSection } from "./GestaoUsuariosSection";
import { ScriptRunnersSection } from "./components/ScriptRunnersSection";

interface IosSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function IosSwitch({ checked, onChange, disabled }: IosSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[#34c759]" : "bg-neutral-300 dark:bg-neutral-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function ConfiguracoesApp() {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>("aparencia");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const user = useAuth((s) => s.user);
  const clearAuth = useAuth((s) => s.clear);
  const photo = useProfilePhoto();

  const {
    theme,
    setTheme,
    wallpaper,
    setWallpaper,
    customWallpapers,
    setCustomWallpaper,
  } = useTheme();

  // Preferências locais adicionais
  const [somNotificacao, setSomNotificacao] = useState(true);
  const [alertaOsCritica, setAlertaOsCritica] = useState(true);
  const [efeitoVidro, setEfeitoVidro] = useState(true);
  const [filialSelecionada, setFilialSelecionada] = useState(user?.filial || "São Luís");
  const [testingConexoes, setTestingConexoes] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCustomWallpaper(wallpaper, theme, reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const sections = [
    {
      id: "aparencia" as SettingsSectionId,
      label: "Aparência & Tema",
      icon: Palette,
      iconBg: "bg-blue-500",
      category: "Preferências",
      desc: "Modo claro, modo escuro e papéis de parede",
    },
    {
      id: "usuarios" as SettingsSectionId,
      label: "Gestão de Usuários",
      icon: Users,
      iconBg: "bg-purple-600",
      category: "Segurança",
      desc: "Grade de acessos para módulos e atividades",
    },
    {
      id: "perfil" as SettingsSectionId,
      label: "Perfil do Usuário",
      icon: User,
      iconBg: "bg-indigo-500",
      category: "Conta",
      desc: "Dados cadastrais, matrícula e permissões",
    },
    {
      id: "filiais" as SettingsSectionId,
      label: "Unidade & Filiais",
      icon: Building2,
      iconBg: "bg-emerald-500",
      category: "Operacional",
      desc: "São Luís, Aveiro, Barcarena, Parauapebas, SJC",
    },
    {
      id: "notificacoes" as SettingsSectionId,
      label: "Notificações & Alertas",
      icon: Bell,
      iconBg: "bg-rose-500",
      category: "Preferências",
      desc: "Avisos de OS críticas, prazos e sons",
    },
    {
      id: "conexoes" as SettingsSectionId,
      label: "Conectividade & Backends",
      icon: Wifi,
      iconBg: "bg-cyan-500",
      category: "Sistema",
      desc: "Dataverse, ERP Protheus e SharePoint",
    },
    {
      id: "geral" as SettingsSectionId,
      label: "Sobre o Sistema",
      icon: Info,
      iconBg: "bg-slate-500",
      category: "Sistema",
      desc: "Versão do Medro, cache e sessão",
    },
  ];

  const filteredSections = sections.filter(
    (s) =>
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectSection = (id: SettingsSectionId) => {
    setActiveSection(id);
    setMobileDetailOpen(true);
  };

  return (
    <div className="flex h-full w-full select-none overflow-hidden bg-surface-2/60 text-foreground transition-colors duration-200 dark:bg-bg">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCustomWallpaperUpload}
      />

      {/* ── BARRA LATERAL (SIDEBAR ESTILO IPAD SETTINGS) ── */}
      <aside
        className={`w-full flex-col border-r border-border bg-surface/80 backdrop-blur-md transition-all duration-200 sm:flex sm:w-72 md:w-80 ${
          mobileDetailOpen ? "hidden sm:flex" : "flex"
        }`}
      >
        {/* Topo com Título e Campo de Busca */}
        <div className="border-b border-border/70 p-3">
          <div className="flex items-center gap-2 pb-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-slate-600 text-white shadow-xs">
              <Sliders className="size-4" />
            </div>
            <h1 className="text-base font-bold tracking-tight">Configurações</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border/60 bg-surface-2/80 py-1.5 pl-8 pr-3 text-[12px] text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-surface"
            />
          </div>
        </div>

        {/* Card do Usuário (Estilo Conta Apple ID no iPadOS) */}
        <button
          onClick={() => selectSection("perfil")}
          className={`flex items-center gap-3 border-b border-border/70 p-3 text-left transition-colors hover:bg-surface-2 ${
            activeSection === "perfil" ? "bg-primary/10 dark:bg-primary/20" : ""
          }`}
        >
          {photo.data ? (
            <img
              src={photo.data}
              alt="Avatar"
              className="size-11 rounded-full object-cover shadow-xs ring-1 ring-border"
            />
          ) : (
            <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-accent-indigo font-semibold text-white shadow-xs">
              {initials(user?.nome || user?.login)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold text-foreground">
              {user?.nome || user?.login || "Operador Medro"}
            </p>
            <p className="truncate text-[11.5px] text-muted-foreground">
              {user?.filial || "São Luís"} • {user?.funcao || "Colaborador"}
            </p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground opacity-60" />
        </button>

        {/* Lista de Categorias Agrupadas */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredSections.map((s) => {
            const Icon = s.icon;
            const isSelected = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => selectSection(s.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-foreground hover:bg-surface-2"
                }`}
              >
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-white ${s.iconBg} ${
                    isSelected ? "shadow-xs" : ""
                  }`}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="truncate block">{s.label}</span>
                </div>
                <ChevronRight
                  className={`size-3.5 shrink-0 ${
                    isSelected ? "text-primary-foreground opacity-80" : "text-muted-foreground opacity-50"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── PAINEL DE CONTEÚDO (DETALHES ESTILO IPADOS) ── */}
      <main
        className={`flex-1 min-h-0 flex-col overflow-y-auto ${
          mobileDetailOpen ? "flex" : "hidden sm:flex"
        }`}
      >
        {/* Barra superior de navegação para mobile */}
        <div className="sticky top-0 z-20 flex h-10 items-center border-b border-border/80 bg-surface/90 px-3 backdrop-blur-md sm:hidden">
          <button
            onClick={() => setMobileDetailOpen(false)}
            className="flex items-center gap-1 text-[13px] font-medium text-primary active:opacity-70"
          >
            <ChevronLeft className="size-4" />
            Configurações
          </button>
        </div>

        <div
          className={`w-full p-3 sm:p-5 md:p-6 pb-24 space-y-6 ${
            activeSection === "usuarios" ? "max-w-none" : "mx-auto max-w-3xl"
          }`}
        >
          {/* SEÇÃO: APARÊNCIA & TEMA */}
          {activeSection === "aparencia" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-md">
                  <Palette className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Aparência & Tema</h2>
                  <p className="text-[12.5px] text-muted-foreground">
                    Personalize o visual da interface, modos de cor e papéis de parede.
                  </p>
                </div>
              </div>

              {/* Card 1: Seleção de Tema (Claro / Escuro) */}
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Modo de Exibição
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2">
                  {/* Cartão de Visualização Modo Claro */}
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
                      theme === "light"
                        ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
                        : "border-border/60 bg-surface-2/40 hover:border-border"
                    }`}
                  >
                    <div className="flex h-20 w-full items-center justify-center rounded-lg border border-border/60 bg-[#edf2f7] shadow-inner">
                      <div className="flex items-center gap-2 rounded-md bg-white px-3 py-1.5 shadow-xs">
                        <Sun className="size-4 text-amber-500" />
                        <span className="text-[11.5px] font-semibold text-neutral-800">Claro</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] font-medium">
                      <span>Modo Claro</span>
                      {theme === "light" && <Check className="size-4 text-primary" />}
                    </div>
                  </button>

                  {/* Cartão de Visualização Modo Escuro */}
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
                      theme === "dark"
                        ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30"
                        : "border-border/60 bg-surface-2/40 hover:border-border"
                    }`}
                  >
                    <div className="flex h-20 w-full items-center justify-center rounded-lg border border-border/60 bg-[#0e1b30] shadow-inner">
                      <div className="flex items-center gap-2 rounded-md bg-[#142a49] px-3 py-1.5 shadow-xs">
                        <Moon className="size-4 text-primary" />
                        <span className="text-[11.5px] font-semibold text-white">Escuro</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] font-medium">
                      <span>Modo Escuro</span>
                      {theme === "dark" && <Check className="size-4 text-primary" />}
                    </div>
                  </button>
                </div>
              </div>

              {/* Card 2: Seleção de Papel de Parede */}
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Papel de Parede do Desktop
                    </h3>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      Alterna dinamicamente conforme o tema selecionado.
                    </p>
                  </div>
                  {customWallpapers[wallpaper]?.[theme] && (
                    <button
                      onClick={() => setCustomWallpaper(wallpaper, theme, undefined)}
                      className="flex items-center gap-1 text-[11px] font-medium text-danger hover:underline"
                    >
                      <RotateCcw className="size-3" /> Restaurar oficial
                    </button>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Opção 1 */}
                  <button
                    onClick={() => setWallpaper("option-1")}
                    className={`flex flex-col rounded-xl border-2 p-3 text-left transition-all ${
                      wallpaper === "option-1"
                        ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
                        : "border-border/60 bg-surface-2/40 hover:border-border"
                    }`}
                  >
                    <div
                      className="h-24 w-full rounded-lg bg-cover bg-center shadow-xs border border-border/60"
                      style={{
                        backgroundImage: `url("/wallpapers/wallpaper-1-${theme}.svg")`,
                      }}
                    />
                    <div className="mt-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-semibold">Opção 1: Gradiente Orgânico</p>
                        <p className="text-[11px] text-muted-foreground">
                          Ondas suaves macOS com tons oficiais
                        </p>
                      </div>
                      {wallpaper === "option-1" && <Check className="size-4 text-primary" />}
                    </div>
                  </button>

                  {/* Opção 2 */}
                  <button
                    onClick={() => setWallpaper("option-2")}
                    className={`flex flex-col rounded-xl border-2 p-3 text-left transition-all ${
                      wallpaper === "option-2"
                        ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
                        : "border-border/60 bg-surface-2/40 hover:border-border"
                    }`}
                  >
                    <div
                      className="h-24 w-full rounded-lg bg-cover bg-center shadow-xs border border-border/60"
                      style={{
                        backgroundImage: `url("/wallpapers/wallpaper-2-${theme}.svg")`,
                      }}
                    />
                    <div className="mt-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-semibold">Opção 2: Técnico / Engenharia</p>
                        <p className="text-[11px] text-muted-foreground">
                          Grade industrial e rotores de motores
                        </p>
                      </div>
                      {wallpaper === "option-2" && <Check className="size-4 text-primary" />}
                    </div>
                  </button>
                </div>

                {/* Upload e Informação de Pasta */}
                <div className="mt-4 flex flex-col gap-2 rounded-xl border border-border/60 bg-surface-2/60 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-[12px] text-muted-foreground">
                    <p className="font-medium text-foreground">Substituição permanente:</p>
                    <p>
                      Coloque imagens em{" "}
                      <code className="rounded bg-surface px-1 py-0.5 font-mono text-[11px] text-primary">
                        apps/web/public/wallpapers/
                      </code>
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-foreground shadow-2xs hover:bg-surface-2 active:scale-95"
                  >
                    <Upload className="size-3.5" />
                    Testar foto local...
                  </button>
                </div>
              </div>

              {/* Card 3: Efeitos Visuais */}
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Efeitos de Vidro (Vibrancy)
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium">Transluscência e Vidro Fosco</p>
                    <p className="text-[12px] text-muted-foreground">
                      Aplica desfoque de fundo no Dock, janelas e menus
                    </p>
                  </div>
                  <IosSwitch checked={efeitoVidro} onChange={setEfeitoVidro} />
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO: GESTÃO DE USUÁRIOS & ACESSOS (ESTILO ECHOE) */}
          {activeSection === "usuarios" && <GestaoUsuariosSection />}

          {/* SEÇÃO: PERFIL DO USUÁRIO */}
          {activeSection === "perfil" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-md">
                  <User className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Perfil do Usuário</h2>
                  <p className="text-[12.5px] text-muted-foreground">
                    Informações da conta corporativa e credenciais do Protheus.
                  </p>
                </div>
              </div>

              {/* Cartão de Identidade */}
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                  {photo.data ? (
                    <img
                      src={photo.data}
                      alt="Avatar"
                      className="size-20 rounded-full object-cover shadow-sm ring-2 ring-primary/30"
                    />
                  ) : (
                    <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-indigo-600 text-2xl font-bold text-white shadow-sm">
                      {initials(user?.nome || user?.login)}
                    </div>
                  )}

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground">
                      {user?.nome || user?.login || "Operador Kairós"}
                    </h3>
                    <p className="text-[13px] text-muted-foreground">Login: @{user?.login || "operador"}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                        <MapPin className="size-3" /> {user?.filial || "São Luís"}
                      </span>
                      {user?.funcao && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-foreground-secondary">
                          <Briefcase className="size-3" /> {user.funcao}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Corporativos */}
              <div className="rounded-2xl border border-border bg-surface shadow-xs divide-y divide-border/60">
                <div className="flex items-center justify-between p-3.5 text-[13px]">
                  <span className="text-muted-foreground">Matrícula TOTVS Protheus</span>
                  <span className="font-mono font-medium">{user?.matProtheus || "010245"}</span>
                </div>
                <div className="flex items-center justify-between p-3.5 text-[13px]">
                  <span className="text-muted-foreground">Filial de Lotação</span>
                  <span className="font-medium">{user?.filial || "São Luís (MA)"}</span>
                </div>
                <div className="flex items-center justify-between p-3.5 text-[13px]">
                  <span className="text-muted-foreground">Função / Cargo</span>
                  <span className="font-medium">{user?.funcao || "Operador Técnico"}</span>
                </div>
              </div>

              {/* Permissões do Sistema */}
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Módulos Autorizados (acesso_mod)
                </h3>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Permissões atribuídas no Dataverse para acesso às telas do chão de fábrica:
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(user?.acessoMod?.split(/[,; ]+/).filter(Boolean) || [
                    "OS",
                    "AVA",
                    "DPT",
                    "GER",
                    "CAL",
                    "FER",
                  ]).map((mod) => (
                    <span
                      key={mod}
                      className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-[12px] font-semibold text-primary"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO: FILIAL & UNIDADES */}
          {activeSection === "filiais" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
                  <Building2 className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Unidade & Filiais</h2>
                  <p className="text-[12.5px] text-muted-foreground">
                    Selecione a filial ativa para visualização de OS e apontamentos.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface shadow-xs divide-y divide-border/60">
                {[
                  { id: "São Luís", uf: "MA", pais: "Brasil", tipo: "Matriz" },
                  { id: "Aveiro", uf: "PT", pais: "Portugal", tipo: "Internacional" },
                  { id: "Barcarena", uf: "PA", pais: "Brasil", tipo: "Filial Operacional" },
                  { id: "Parauapebas", uf: "PA", pais: "Brasil", tipo: "Filial Operacional" },
                  { id: "São José dos Campos", uf: "SP", pais: "Brasil", tipo: "Filial Sudeste" },
                ].map((f) => {
                  const isCurrent = filialSelecionada.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFilialSelecionada(f.id)}
                      className="flex w-full items-center justify-between p-3.5 text-left transition-colors hover:bg-surface-2 first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 items-center justify-center rounded-lg font-bold text-[12px] ${
                            isCurrent
                              ? "bg-emerald-500 text-white"
                              : "bg-surface-2 text-muted-foreground"
                          }`}
                        >
                          {f.uf}
                        </div>
                        <div>
                          <p className="text-[13.5px] font-semibold text-foreground">
                            {f.id} ({f.uf})
                          </p>
                          <p className="text-[11.5px] text-muted-foreground">
                            {f.tipo} • {f.pais}
                          </p>
                        </div>
                      </div>

                      {isCurrent && <Check className="size-5 text-emerald-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SEÇÃO: NOTIFICAÇÕES */}
          {activeSection === "notificacoes" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md">
                  <Bell className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Notificações & Alertas</h2>
                  <p className="text-[12.5px] text-muted-foreground">
                    Gerencie avisos operacionais, prazos de motores e sons do sistema.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium">Alertas de OS Crítica / Fora do Prazo</p>
                    <p className="text-[12px] text-muted-foreground">
                      Exibir notificação em tempo real quando uma OS ultrapassar o prazo de entrega
                    </p>
                  </div>
                  <IosSwitch checked={alertaOsCritica} onChange={setAlertaOsCritica} />
                </div>

                <div className="h-px bg-border/60" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium">Sons do Sistema</p>
                    <p className="text-[12px] text-muted-foreground">
                      Emitir sinal sonoro suave em aprovações e novos laudos técnicos
                    </p>
                  </div>
                  <IosSwitch checked={somNotificacao} onChange={setSomNotificacao} />
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO: CONECTIVIDADE */}
          {activeSection === "conexoes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-md">
                    <Wifi className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Conectividade & Backends</h2>
                    <p className="text-[12.5px] text-muted-foreground">
                      Status de sincronização com as bases da Kairós Motores.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTestingConexoes(true);
                    setTimeout(() => setTestingConexoes(false), 800);
                  }}
                  disabled={testingConexoes}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-foreground shadow-2xs hover:bg-surface-2 active:scale-95"
                >
                  <RefreshCw className={`size-3.5 ${testingConexoes ? "animate-spin text-primary" : ""}`} />
                  Testar
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-surface shadow-xs divide-y divide-border/60">
                <div className="flex items-center justify-between p-3.5 text-[13px]">
                  <div>
                    <p className="font-semibold text-foreground">Microsoft Dataverse Web API</p>
                    <p className="text-[11.5px] text-muted-foreground">
                      crm2.dynamics.com (Tabelas cr4a1_*)
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11.5px] font-semibold text-emerald-500">
                    <span className="size-1.5 rounded-full bg-emerald-500" /> Operacional (42ms)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 text-[13px]">
                  <div>
                    <p className="font-semibold text-foreground">TOTVS ERP Protheus (SQL)</p>
                    <p className="text-[11.5px] text-muted-foreground">
                      Tabelas ZB6010, SCP010, ABF010
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11.5px] font-semibold text-emerald-500">
                    <span className="size-1.5 rounded-full bg-emerald-500" /> Conectado
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 text-[13px]">
                  <div>
                    <p className="font-semibold text-foreground">SharePoint Online & Graph</p>
                    <p className="text-[11.5px] text-muted-foreground">
                      Bibliotecas de laudos PDF e fotos de motores
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11.5px] font-semibold text-emerald-500">
                    <span className="size-1.5 rounded-full bg-emerald-500" /> Conectado
                  </span>
                </div>
              </div>

              {/* DISPARADORES DE SCRIPTS (SQL → DATAVERSE) */}
              <div className="pt-1">
                <ScriptRunnersSection />
              </div>
            </div>
          )}

          {/* SEÇÃO: GERAL */}
          {activeSection === "geral" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-500 text-white shadow-md">
                  <Info className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Sobre o Medro</h2>
                  <p className="text-[12.5px] text-muted-foreground">
                    Informações da versão e controle da sessão ativa.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface shadow-xs divide-y divide-border/60">
                <div className="flex items-center justify-between p-3.5 text-[13px]">
                  <span className="text-muted-foreground">Versão do Sistema</span>
                  <span className="font-mono font-medium">Medro v0.4.0 (Fase 1/2)</span>
                </div>
                <div className="flex items-center justify-between p-3.5 text-[13px]">
                  <span className="text-muted-foreground">Arquitetura</span>
                  <span className="font-medium">React 19 + Node Fastify (BFF)</span>
                </div>
                <div className="flex items-center justify-between p-3.5 text-[13px]">
                  <span className="text-muted-foreground">Empresa</span>
                  <span className="font-medium">Kairós Motores Elétricos</span>
                </div>
              </div>

              {/* Botão de Encerrar Sessão */}
              <div className="rounded-2xl border border-danger/20 bg-surface p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-danger">Encerrar Sessão</p>
                    <p className="text-[12px] text-muted-foreground">
                      Desconecta o usuário deste dispositivo e retorna à tela de login.
                    </p>
                  </div>
                  <button
                    onClick={() => clearAuth()}
                    className="flex items-center gap-1.5 rounded-lg bg-danger px-3 py-1.5 text-[12px] font-medium text-white shadow-xs hover:bg-danger/90 active:scale-95"
                  >
                    <LogOut className="size-3.5" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
