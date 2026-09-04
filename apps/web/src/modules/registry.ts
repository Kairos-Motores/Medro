import type { AccessToken } from "@medro/shared";
import {
  Wrench,
  ClipboardList,
  Gauge,
  FlaskConical,
  Flame,
  Orbit,
  FileText,
  Hammer,
  Users,
  QrCode,
  ShieldCheck,
  Activity,
  RotateCw,
  ClipboardCheck,
  Settings,
  BarChart3,
  Boxes,
  FilePlus2,
  LayoutTemplate,
  ArrowLeftRight,
  type LucideIcon,
} from "lucide-react";

/**
 * Registro de módulos e telas do Medro (70 telas no escopo — docs/06-revisao.md).
 * Fase 2: `element` das telas ainda é <StubScreen>, exceto DPT (em implementação).
 */

export type ModuleId =
  | "migracao"
  | "configuracoes"
  | "medro-pro"
  | "central-bobinagem"
  | "inspecao-qualidade"
  | "planejamento"
  | "almoxarifado"
  | "os-medro"
  | "peritagem"
  | "pcp"
  | "caldeiraria"
  | "balanceamento"
  | "ferramentaria"
  | "terceirizados"
  | "dpt-laudos"
  | "laudos-gen"
  | "rascunhos-folder"
  | "modelos-folder"
  | "modelo-builder"
  | "cipa"
  | "ssma"
  | "tarefas";

export type AccentKey =
  | "blue" | "indigo" | "teal" | "cyan" | "green" | "amber" | "rose" | "violet" | "slate";

export interface ModuleDef {
  id: ModuleId;
  label: string;
  short: string;
  desc: string;
  icon: LucideIcon;
  /** rota base do módulo */
  path: string;
  /** tokens exigidos p/ ver o módulo no hub */
  access?: AccessToken[];
  accent: AccentKey;
  ready?: boolean;
}

export const MODULES: ModuleDef[] = [
  {
    id: "migracao",
    label: "Migração",
    short: "Migração",
    desc: "Painel de controle e monitoramento da transcrição da base legada para o novo modelo",
    icon: ArrowLeftRight,
    path: "/migracao",
    accent: "cyan",
    ready: true,
  },
  {
    id: "medro-pro",
    label: "Medro Pro",
    short: "APS",
    desc: "Torre de Controle Macro, Cockpit Operacional e Kanban Tático",
    icon: Activity,
    path: "/medro-pro",
    accent: "violet",
    ready: true,
  },
  {
    id: "central-bobinagem",
    label: "Central de Bobinagem",
    short: "Bobinagem",
    desc: "Cálculo de espiras, dados de enrolamento e controle de rebobinamento",
    icon: RotateCw,
    path: "/bobinagem",
    accent: "amber",
    ready: true,
  },
  {
    id: "inspecao-qualidade",
    label: "Inspeção de Qualidade",
    short: "Qualidade",
    desc: "Checklist pós-manutenção: itens recuperados, trocados, pintura e acabamento",
    icon: ClipboardCheck,
    path: "/qualidade",
    access: ["INS"],
    accent: "green",
    ready: true,
  },
  {
    id: "planejamento",
    label: "Planejamento",
    short: "Planej.",
    desc: "Indicadores de peritagem, escopo de serviços, peças e compras externas",
    icon: BarChart3,
    path: "/planejamento",
    accent: "indigo",
    ready: true,
  },
  {
    id: "almoxarifado",
    label: "Almoxarifado",
    short: "Almox.",
    desc: "Gestão de estoque físico/financeiro (SB2 Protheus) e reservas de OS",
    icon: Boxes,
    path: "/almoxarifado",
    accent: "amber",
    ready: true,
  },
  { id: "os-medro", label: "OS Medro", short: "OS", desc: "Entrada, produção e finalização de ordens de serviço", icon: Wrench, path: "/os", access: ["OS"], accent: "blue" },
  { id: "configuracoes", label: "Configurações", short: "Config", desc: "Aparência, perfil, filiais, notificações e preferências", icon: Settings, path: "/configuracoes", accent: "slate", ready: true },
  { id: "peritagem", label: "Ensaios", short: "Ensaios", desc: "Ensaios elétricos, testes de isolamento, resistência ôhmica, Surge Test e vibração", icon: Gauge, path: "/ensaios", access: ["AVA"], accent: "cyan", ready: true },
  { id: "dpt-laudos", label: "Dep. Técnico", short: "DPT", desc: "Laudos técnicos, links e QR codes", icon: FileText, path: "/dpt", access: ["DPT"], accent: "teal", ready: true },
  { id: "laudos-gen", label: "Gerador de Laudos", short: "Laudos", desc: "Montagem e emissão do laudo técnico da OS (PDF)", icon: FilePlus2, path: "/laudos-gen", access: ["DPT"], accent: "teal", ready: true },
  { id: "modelos-folder", label: "Modelos de Laudo", short: "Modelos", desc: "Construtor e gerência dos modelos de laudo (estrutura reaproveitável entre OS)", icon: LayoutTemplate, path: "/laudos-gen/modelos", access: ["DPT"], accent: "teal", ready: true },
  { id: "caldeiraria", label: "Usinagem e Caldeiraria", short: "Usinagem & Cald.", desc: "Controle, recuperação, usinagem e fabricação de peças mecânicas", icon: Flame, path: "/caldeiraria", access: ["CAL"], accent: "amber", ready: true },
  { id: "balanceamento", label: "Balanceamento", short: "Balanc.", desc: "Balanceamento dinâmico de rotores", icon: Orbit, path: "/balanceamento", accent: "slate" },
  { id: "ferramentaria", label: "Ferramentaria", short: "Ferram.", desc: "Gestão global de ferramentas, cautelas, calibrações RBC e rastreamento multiunidades", icon: Hammer, path: "/ferramentaria", access: ["FER"], accent: "slate", ready: true },
  { id: "terceirizados", label: "Terceirizados", short: "Terceir.", desc: "Serviços externos por OS — envio, pendências de retorno e histórico", icon: Users, path: "/terceirizados", access: ["TER"], accent: "indigo", ready: true },
  { id: "tarefas", label: "Tarefas", short: "Tarefas", desc: "Tarefas operacionais e QR", icon: FlaskConical, path: "/tarefas", accent: "slate" },
  { id: "ssma", label: "SSMA", short: "SSMA", desc: "Saúde, Segurança e Meio Ambiente", icon: ShieldCheck, path: "/ssma", access: ["SSMA"], accent: "green" },
];

/** classes utilitárias por acento */
export interface AccentClasses {
  text: string;
  softBg: string;
  ring: string;
  dot: string;
  borderL: string;
  hoverBorder: string;
}
export const ACCENT: Record<AccentKey, AccentClasses> = {
  blue: { text: "text-accent-blue", softBg: "bg-accent-blue/10", ring: "ring-accent-blue/30", dot: "bg-accent-blue", borderL: "border-l-accent-blue", hoverBorder: "hover:border-accent-blue/50" },
  indigo: { text: "text-accent-indigo", softBg: "bg-accent-indigo/10", ring: "ring-accent-indigo/30", dot: "bg-accent-indigo", borderL: "border-l-accent-indigo", hoverBorder: "hover:border-accent-indigo/50" },
  teal: { text: "text-accent-teal", softBg: "bg-accent-teal/10", ring: "ring-accent-teal/30", dot: "bg-accent-teal", borderL: "border-l-accent-teal", hoverBorder: "hover:border-accent-teal/50" },
  cyan: { text: "text-accent-cyan", softBg: "bg-accent-cyan/10", ring: "ring-accent-cyan/30", dot: "bg-accent-cyan", borderL: "border-l-accent-cyan", hoverBorder: "hover:border-accent-cyan/50" },
  green: { text: "text-accent-green", softBg: "bg-accent-green/10", ring: "ring-accent-green/30", dot: "bg-accent-green", borderL: "border-l-accent-green", hoverBorder: "hover:border-accent-green/50" },
  amber: { text: "text-accent-amber", softBg: "bg-accent-amber/10", ring: "ring-accent-amber/30", dot: "bg-accent-amber", borderL: "border-l-accent-amber", hoverBorder: "hover:border-accent-amber/50" },
  rose: { text: "text-accent-rose", softBg: "bg-accent-rose/10", ring: "ring-accent-rose/30", dot: "bg-accent-rose", borderL: "border-l-accent-rose", hoverBorder: "hover:border-accent-rose/50" },
  violet: { text: "text-accent-violet", softBg: "bg-accent-violet/10", ring: "ring-accent-violet/30", dot: "bg-accent-violet", borderL: "border-l-accent-violet", hoverBorder: "hover:border-accent-violet/50" },
  slate: { text: "text-accent-slate", softBg: "bg-accent-slate/10", ring: "ring-accent-slate/30", dot: "bg-accent-slate", borderL: "border-l-accent-slate", hoverBorder: "hover:border-accent-slate/50" },
};

export const moduleById = (id: ModuleId) => MODULES.find((m) => m.id === id)!;

// ── telas (para rotas stub + navegação) ──────────────────────────────────────
export interface ScreenDef {
  id: string;
  path: string;
  title: string;
  module: ModuleId;
  powerApps: string;
  access?: AccessToken[];
}

export const SCREENS: ScreenDef[] = [
  // OS Medro
  { id: "TelaInicial_Medro_Nova", path: "/os", title: "OS Medro", module: "os-medro", powerApps: "TelaInicial_Medro_Nova", access: ["OS"] },
  { id: "Entrada_Medro_Nova", path: "/os/entrada", title: "Entrada", module: "os-medro", powerApps: "Entrada_Medro_Nova", access: ["OS"] },
  { id: "Finalizar_Medro_Nova", path: "/os/finalizar", title: "Finalizar", module: "os-medro", powerApps: "Finalizar_Medro_Nova", access: ["OS"] },
  { id: "EdicaoOS_Medro", path: "/os/editar", title: "Editar OS", module: "os-medro", powerApps: "EdicaoOS_Medro", access: ["_OS_EDOS"] },
  { id: "Gestao_Pendencias_Medro", path: "/os/pendencias", title: "Pendências", module: "os-medro", powerApps: "Gestao_Pendencias_Medro", access: ["OS"] },
  { id: "EscopoDeManuten", path: "/escopo", title: "Escopo de Manutenção", module: "os-medro", powerApps: "EscopoDeManuten", access: ["ESCOPO"] },
  // Configurações
  { id: "CONFIG_PRINCIPAL", path: "/configuracoes", title: "Configurações", module: "configuracoes", powerApps: "CONFIG_PRINCIPAL" },
  // PCP
  { id: "COD_GERENCIAMENTO", path: "/gerenciamento", title: "Gerenciamento", module: "pcp", powerApps: "COD_GERENCIAMENTO", access: ["GER"] },
  { id: "TelaPCP_SLZ", path: "/gerenciamento/pcp", title: "PCP", module: "pcp", powerApps: "TelaPCP_SLZ", access: ["GER"] },
  { id: "Requisição_PCP", path: "/pcp/requisicao", title: "Requisição PCP", module: "pcp", powerApps: "Requisição_PCP", access: ["_PCP_RQ"] },
  // Peritagem
  { id: "AvaliacaoFinal", path: "/avaliacao-final", title: "Avaliação Final", module: "peritagem", powerApps: "AvaliacaoFinal", access: ["AVA"] },
  { id: "GaleriaPeritagem", path: "/peritagem", title: "Peritagem", module: "peritagem", powerApps: "GaleriaPeritagem" },
  { id: "FormInspec", path: "/inspecao", title: "Inspeção", module: "peritagem", powerApps: "FormInspec", access: ["INS"] },
  { id: "EnsaioTemporizado", path: "/ensaio", title: "Ensaio Temporizado", module: "peritagem", powerApps: "EnsaioTemporizado", access: ["TES"] },
  { id: "LiberarEnsaio", path: "/ensaio/liberar", title: "Liberar Ensaio", module: "peritagem", powerApps: "LiberarEnsaio", access: ["TES"] },
  // Caldeiraria
  { id: "Controle_Caldeiraria", path: "/caldeiraria", title: "Usinagem e Caldeiraria", module: "caldeiraria", powerApps: "Controle_Caldeiraria", access: ["CAL"] },
  { id: "Caldeiraria_Novo", path: "/caldeiraria/novo", title: "Nova Peça / Serviço", module: "caldeiraria", powerApps: "Caldeiraria_Novo", access: ["_CAL_CAD"] },
  { id: "Caldeiraria_Historico", path: "/caldeiraria/historico", title: "Histórico", module: "caldeiraria", powerApps: "Caldeiraria_Histórico", access: ["CAL"] },
  // Balanceamento
  { id: "Rel_Balanceamento", path: "/balanceamento", title: "Balanceamento", module: "balanceamento", powerApps: "Rel_Balanceamento" },
  // Ferramentaria
  { id: "T_Ferramentaria", path: "/ferramentaria", title: "Ferramentaria", module: "ferramentaria", powerApps: "T_Ferramentaria", access: ["FER"] },
  // Terceirizados
  { id: "ControleTerceirizado", path: "/terceirizados", title: "Terceirizados", module: "terceirizados", powerApps: "ControleTerceirizado", access: ["TER"] },
  { id: "NovoRegistroTerceir", path: "/terceirizados/novo", title: "Novo Registro", module: "terceirizados", powerApps: "NovoRegistroTerceir", access: ["_TER_CAD"] },
  // Tarefas
  { id: "EntradaTarefa", path: "/tarefas", title: "Entrada de Tarefa", module: "tarefas", powerApps: "EntradaTarefa" },
  // SSMA
  { id: "GestaoSSMA", path: "/ssma", title: "SSMA", module: "ssma", powerApps: "VotaçãoCIPA", access: ["SSMA"] },
];

export const byPath = (path: string) => SCREENS.find((s) => s.path === path);
export { QrCode };
