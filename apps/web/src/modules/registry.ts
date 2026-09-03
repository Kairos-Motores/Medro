import type { AccessToken } from "@medro/shared";
import {
  Wrench,
  ClipboardList,
  Gauge,
  FlaskConical,
  Flame,
  Orbit,
  FileText,
  Route,
  Truck,
  Hammer,
  Users,
  Camera,
  QrCode,
  ShieldCheck,
  ListChecks,
  Activity,
  RotateCw,
  ClipboardCheck,
  Settings,
  BarChart3,
  Boxes,
  type LucideIcon,
} from "lucide-react";

/**
 * Registro de módulos e telas do Medro (70 telas no escopo — docs/06-revisao.md).
 * Fase 2: `element` das telas ainda é <StubScreen>, exceto DPT (em implementação).
 */

export type ModuleId =
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
  | "trajetos-ssma"
  | "checklist-veicular"
  | "ferramentaria"
  | "terceirizados"
  | "rds"
  | "relatorio-fotografico"
  | "dpt-laudos"
  | "cipa"
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
  { id: "caldeiraria", label: "Caldeiraria", short: "Caldeiraria", desc: "Recuperação e fabricação de peças", icon: Flame, path: "/caldeiraria", access: ["CAL"], accent: "amber" },
  { id: "balanceamento", label: "Balanceamento", short: "Balanc.", desc: "Balanceamento dinâmico de rotores", icon: Orbit, path: "/balanceamento", accent: "slate" },
  { id: "ferramentaria", label: "Ferramentaria", short: "Ferram.", desc: "Gestão global de ferramentas, cautelas, calibrações RBC e rastreamento multiunidades", icon: Hammer, path: "/ferramentaria", accent: "slate", ready: true },
  { id: "trajetos-ssma", label: "Trajetos / SSMA", short: "Trajetos", desc: "Deslocamento de equipes e segurança", icon: Route, path: "/trajetos", access: ["ROT"], accent: "teal" },
  { id: "checklist-veicular", label: "Checklist Veicular", short: "Checklist", desc: "Inspeção e histórico de veículos", icon: ListChecks, path: "/checklist-veicular", accent: "cyan" },
  { id: "terceirizados", label: "Terceirizados", short: "Terceir.", desc: "Serviços externos e pendências", icon: Users, path: "/terceirizados", access: ["TER"], accent: "indigo" },
  { id: "tarefas", label: "Tarefas", short: "Tarefas", desc: "Tarefas operacionais e QR", icon: FlaskConical, path: "/tarefas", accent: "slate" },
  { id: "rds", label: "RDS", short: "RDS", desc: "Requisição de saída / serviço", icon: Truck, path: "/rds", accent: "amber" },
  { id: "relatorio-fotografico", label: "Relatório Fotográfico", short: "Rel. Foto", desc: "Fotos de peritagem e relatórios", icon: Camera, path: "/relatorio-foto", accent: "slate" },
  { id: "cipa", label: "CIPA", short: "CIPA", desc: "Votação da comissão de segurança", icon: ShieldCheck, path: "/cipa", accent: "green" },
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
  { id: "Controle_Caldeiraria", path: "/caldeiraria", title: "Caldeiraria", module: "caldeiraria", powerApps: "Controle_Caldeiraria", access: ["CAL"] },
  { id: "Caldeiraria_Novo", path: "/caldeiraria/novo", title: "Nova Peça", module: "caldeiraria", powerApps: "Caldeiraria_Novo", access: ["_CAL_CAD"] },
  { id: "Caldeiraria_Historico", path: "/caldeiraria/historico", title: "Histórico", module: "caldeiraria", powerApps: "Caldeiraria_Histórico", access: ["CAL"] },
  // Balanceamento
  { id: "Rel_Balanceamento", path: "/balanceamento", title: "Balanceamento", module: "balanceamento", powerApps: "Rel_Balanceamento" },
  // Trajetos
  { id: "SelecaoTrajeto", path: "/trajetos", title: "Trajetos", module: "trajetos-ssma", powerApps: "SelecaoTrajeto", access: ["ROT"] },
  { id: "Seleção_trajeto_SSMA", path: "/ssma", title: "Trajetos SSMA", module: "trajetos-ssma", powerApps: "Seleção_trajeto_SSMA" },
  // Checklist veicular
  { id: "Checklist_veicular_slz", path: "/checklist-veicular", title: "Checklist Veicular", module: "checklist-veicular", powerApps: "Checklist_veicular_slz" },
  { id: "Novo_CheckList_Veicular", path: "/checklist-veicular/novo", title: "Novo Checklist", module: "checklist-veicular", powerApps: "Novo_CheckList_Veicular" },
  // Ferramentaria
  { id: "T_Ferramentaria", path: "/ferramentaria", title: "Ferramentaria", module: "ferramentaria", powerApps: "T_Ferramentaria", access: ["FER"] },
  // Terceirizados
  { id: "ControleTerceirizado", path: "/terceirizados", title: "Terceirizados", module: "terceirizados", powerApps: "ControleTerceirizado", access: ["TER"] },
  { id: "NovoRegistroTerceir", path: "/terceirizados/novo", title: "Novo Registro", module: "terceirizados", powerApps: "NovoRegistroTerceir", access: ["_TER_CAD"] },
  // Tarefas
  { id: "EntradaTarefa", path: "/tarefas", title: "Entrada de Tarefa", module: "tarefas", powerApps: "EntradaTarefa" },
  // RDS
  { id: "Req_RDS", path: "/rds", title: "RDS", module: "rds", powerApps: "Req_RDS" },
  { id: "Historico_RDS", path: "/rds/historico", title: "Histórico RDS", module: "rds", powerApps: "Historico_RDS" },
  // Relatório fotográfico
  { id: "Rel_Foto_Escolha", path: "/relatorio-foto", title: "Relatório Fotográfico", module: "relatorio-fotografico", powerApps: "Rel_Foto_Escolha" },
  { id: "Relatorio", path: "/relatorio/novo", title: "Novo Relatório", module: "relatorio-fotografico", powerApps: "Relatorio" },
  // CIPA
  { id: "VotaçãoCIPA", path: "/cipa", title: "Votação CIPA", module: "cipa", powerApps: "VotaçãoCIPA" },
];

export const byPath = (path: string) => SCREENS.find((s) => s.path === path);
export { QrCode };
