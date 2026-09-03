import React, { useState } from "react";
import {
  Hammer,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRightLeft,
  Calendar,
  ShieldAlert,
  User,
  QrCode,
  SlidersHorizontal,
  X,
  Gauge,
  Zap,
  RotateCw,
  Wrench,
  ChevronRight,
  Sparkles,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type CategoriaFerramenta =
  | "Metrologia & Precisão"
  | "Instrumentação Elétrica"
  | "Hidráulico & Força"
  | "Elétricas & Pneumáticas"
  | "Dispositivos Especiais";

export type StatusFerramenta =
  | "Disponível"
  | "Cautelada (Em Uso)"
  | "Calibração Vencida"
  | "Em Manutenção"
  | "Em Trânsito / Transferência";

export interface HistoricoMovimentacao {
  id: string;
  data: string;
  tipo: "Cautela" | "Devolução" | "Transferência" | "Calibração";
  responsavel: string;
  osDestino?: string;
  filialOrigem?: string;
  filialDestino?: string;
  observacao?: string;
}

export interface Ferramenta {
  id: string;
  patrimonio: string;
  descricao: string;
  categoria: CategoriaFerramenta;
  fabricante: string;
  modelo: string;
  numeroSerie: string;
  filial: "São Luís (SLZ)" | "Barcarena (BRC)" | "Parauapebas (PRP)" | "Aveiro (AVE)" | "São José dos Campos (SJC)";
  localizacaoFisica: string;
  status: StatusFerramenta;
  requerCalibracao: boolean;
  dataUltimaCalibracao?: string;
  dataProximaCalibracao?: string;
  diasParaVencerCalibracao?: number;
  orgaoCalibrador?: string;
  cautelaAtual?: {
    colaborador: string;
    matricula: string;
    os: string;
    dataRetirada: string;
    previsaoDevolucao: string;
  };
  historico: HistoricoMovimentacao[];
}

const INITIAL_FERRAMENTAS: Ferramenta[] = [
  {
    id: "1",
    patrimonio: "FER-SLZ-0142",
    descricao: "Micrômetro Externo Digital 100-125mm 0.001mm",
    categoria: "Metrologia & Precisão",
    fabricante: "Mitutoyo",
    modelo: "QuantuMike IP65 293-144-30",
    numeroSerie: "MTY-8842109",
    filial: "São Luís (SLZ)",
    localizacaoFisica: "Armário de Metrologia - Gaveta B2",
    status: "Cautelada (Em Uso)",
    requerCalibracao: true,
    dataUltimaCalibracao: "15/03/2026",
    dataProximaCalibracao: "15/03/2027",
    diasParaVencerCalibracao: 194,
    orgaoCalibrador: "Mitutoyo do Brasil (RBC)",
    cautelaAtual: {
      colaborador: "Marcos Vinicius Pereira",
      matricula: "OP-4821",
      os: "145920",
      dataRetirada: "02/09/2026 08:30",
      previsaoDevolucao: "02/09/2026 17:30",
    },
    historico: [
      { id: "h1", data: "02/09/2026 08:30", tipo: "Cautela", responsavel: "Marcos Vinicius Pereira", osDestino: "145920", observacao: "Medição de colo de rolamento do eixo dianteiro" },
      { id: "h2", data: "28/08/2026 16:00", tipo: "Devolução", responsavel: "Carlos Eduardo", osDestino: "145890", observacao: "Devolvido limpo e higienizado" },
    ],
  },
  {
    id: "2",
    patrimonio: "FER-SLZ-0089",
    descricao: "Megômetro Digital 10kV de Alta Tensão c/ Teste de IP/DA",
    categoria: "Instrumentação Elétrica",
    fabricante: "Megger",
    modelo: "MIT1025 10kV Insulation Resistance",
    numeroSerie: "MGG-2024-9182",
    filial: "São Luís (SLZ)",
    localizacaoFisica: "Bancada de Ensaios Elétricos",
    status: "Disponível",
    requerCalibracao: true,
    dataUltimaCalibracao: "10/01/2026",
    dataProximaCalibracao: "10/01/2027",
    diasParaVencerCalibracao: 130,
    orgaoCalibrador: "LabMet RBC",
    historico: [
      { id: "h3", data: "01/09/2026 14:10", tipo: "Devolução", responsavel: "Rafael Costa Peixoto", osDestino: "145980", observacao: "Ensaio de motor 4.16kV concluído" },
    ],
  },
  {
    id: "3",
    patrimonio: "FER-PRP-0034",
    descricao: "Sacador Hidráulico de Rolamentos e Polias 50 Toneladas",
    categoria: "Hidráulico & Força",
    fabricante: "Enerpac",
    modelo: "BHP-580 Master Puller Set",
    numeroSerie: "ENP-550912",
    filial: "Parauapebas (PRP)",
    localizacaoFisica: "Almoxarifado Pesado - Prateleira D",
    status: "Disponível",
    requerCalibracao: false,
    historico: [
      { id: "h4", data: "20/08/2026 10:00", tipo: "Transferência", responsavel: "Logística Medro", filialOrigem: "São Luís (SLZ)", filialDestino: "Parauapebas (PRP)", observacao: "Remessa para desmontagem de motor de moinho Carajás" },
    ],
  },
  {
    id: "4",
    patrimonio: "FER-BRC-0051",
    descricao: "Torquímetro de Estalo 1/2\" 40-200 N.m",
    categoria: "Metrologia & Precisão",
    fabricante: "Gedore",
    modelo: "Torcofix K 4550-20",
    numeroSerie: "GED-4550-109",
    filial: "Barcarena (BRC)",
    localizacaoFisica: "Quadro de Ferramentas - Montagem",
    status: "Calibração Vencida",
    requerCalibracao: true,
    dataUltimaCalibracao: "15/08/2025",
    dataProximaCalibracao: "15/08/2026",
    diasParaVencerCalibracao: -18,
    orgaoCalibrador: "Inmetro / RBC Cert",
    historico: [
      { id: "h5", data: "16/08/2026 08:00", tipo: "Calibração", responsavel: "Qualidade BRC", observacao: "Bloqueado para uso operacional por vencimento de calibração" },
    ],
  },
  {
    id: "5",
    patrimonio: "FER-SLZ-0210",
    descricao: "Aquecedor Indutivo de Rolamentos portátil até 120kg",
    categoria: "Dispositivos Especiais",
    fabricante: "SKF",
    modelo: "TIH 100M / 230V Induction Heater",
    numeroSerie: "SKF-IND-7782",
    filial: "São Luís (SLZ)",
    localizacaoFisica: "Setor de Montagem e Ajustagem",
    status: "Disponível",
    requerCalibracao: true,
    dataUltimaCalibracao: "05/05/2026",
    dataProximaCalibracao: "05/05/2027",
    diasParaVencerCalibracao: 245,
    orgaoCalibrador: "SKF Reliability Systems",
    historico: [],
  },
  {
    id: "6",
    patrimonio: "FER-SJC-0012",
    descricao: "Analisador de Vibração e Balanceador Dinâmico em Campo",
    categoria: "Instrumentação Elétrica",
    fabricante: "SKF",
    modelo: "Microlog Analyzer GX Series CMXA 75",
    numeroSerie: "SKF-MLG-9031",
    filial: "São José dos Campos (SJC)",
    localizacaoFisica: "Laboratório Preditivo",
    status: "Cautelada (Em Uso)",
    requerCalibracao: true,
    dataUltimaCalibracao: "12/04/2026",
    dataProximaCalibracao: "12/04/2027",
    diasParaVencerCalibracao: 222,
    orgaoCalibrador: "SKF Condition Monitoring RBC",
    cautelaAtual: {
      colaborador: "Felipe Andrade (Eng. Preditiva)",
      matricula: "OP-3310",
      os: "146050",
      dataRetirada: "02/09/2026 13:00",
      previsaoDevolucao: "03/09/2026 18:00",
    },
    historico: [],
  },
  {
    id: "7",
    patrimonio: "FER-AVE-0019",
    descricao: "Chave de Impacto Pneumática 1\" Pesada 2440 N.m",
    categoria: "Elétricas & Pneumáticas",
    fabricante: "Ingersoll Rand",
    modelo: "285B-6 Heavy Duty Impact Wrench",
    numeroSerie: "IR-285B-4412",
    filial: "Aveiro (AVE)",
    localizacaoFisica: "Oficina Mecânica - Bancada 02",
    status: "Disponível",
    requerCalibracao: false,
    historico: [],
  },
];

const FILIAIS = [
  "Todas",
  "São Luís (SLZ)",
  "Barcarena (BRC)",
  "Parauapebas (PRP)",
  "Aveiro (AVE)",
  "São José dos Campos (SJC)",
] as const;

export function FerramentariaApp() {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>(INITIAL_FERRAMENTAS);
  const [search, setSearch] = useState("");
  const [filtroFilial, setFiltroFilial] = useState<string>("Todas");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("Todas");
  const [filtroStatus, setFiltroStatus] = useState<string>("Todas");
  const [selectedTool, setSelectedTool] = useState<Ferramenta | null>(ferramentas[0] || null);

  // Modais
  const [isNovoModalOpen, setIsNovoModalOpen] = useState(false);
  const [isCautelaModalOpen, setIsCautelaModalOpen] = useState(false);
  const [isDevolucaoModalOpen, setIsDevolucaoModalOpen] = useState(false);
  const [isTransferenciaModalOpen, setIsTransferenciaModalOpen] = useState(false);

  // Cautela Form
  const [cautelaColaborador, setCautelaColaborador] = useState("");
  const [cautelaMatricula, setCautelaMatricula] = useState("");
  const [cautelaOs, setCautelaOs] = useState("");
  const [cautelaPrevisao, setCautelaPrevisao] = useState("Hoje às 17:30");

  // Devolucao Form
  const [devolucaoCondicao, setDevolucaoCondicao] = useState<"Perfeita" | "Com Avaria" | "Necessita Calibração">("Perfeita");
  const [devolucaoObs, setDevolucaoObs] = useState("");

  // Transferência Form
  const [transferDestino, setTransferDestino] = useState<Ferramenta["filial"]>("Parauapebas (PRP)");
  const [transferMotivo, setTransferMotivo] = useState("");

  // Novo Item Form
  const [novoPatrimonio, setNovoPatrimonio] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novaCategoria, setNovaCategoria] = useState<CategoriaFerramenta>("Metrologia & Precisão");
  const [novoFabricante, setNovoFabricante] = useState("");
  const [novoModelo, setNovoModelo] = useState("");
  const [novoSerie, setNovoSerie] = useState("");
  const [novaFilial, setNovaFilial] = useState<Ferramenta["filial"]>("São Luís (SLZ)");
  const [novoLocal, setNovoLocal] = useState("");
  const [novoRequerCalib, setNovoRequerCalib] = useState(true);
  const [novaProxCalib, setNovaProxCalib] = useState("01/09/2027");

  // Handler: Realizar Cautela
  const handleConfirmCautela = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool || !cautelaColaborador.trim() || !cautelaOs.trim()) return;

    const novaCautela = {
      colaborador: cautelaColaborador.trim(),
      matricula: cautelaMatricula.trim() || "OP-GERAL",
      os: cautelaOs.trim(),
      dataRetirada: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
      previsaoDevolucao: cautelaPrevisao,
    };

    const mov: HistoricoMovimentacao = {
      id: String(Date.now()),
      data: novaCautela.dataRetirada,
      tipo: "Cautela",
      responsavel: novaCautela.colaborador,
      osDestino: novaCautela.os,
      observacao: `Retirado para atendimento à OS ${novaCautela.os}`,
    };

    const updated = ferramentas.map((f) => {
      if (f.id === selectedTool.id) {
        return {
          ...f,
          status: "Cautelada (Em Uso)" as StatusFerramenta,
          cautelaAtual: novaCautela,
          historico: [mov, ...f.historico],
        };
      }
      return f;
    });

    setFerramentas(updated);
    setSelectedTool(updated.find((f) => f.id === selectedTool.id) || null);
    setIsCautelaModalOpen(false);
    setCautelaColaborador("");
    setCautelaOs("");
  };

  // Handler: Confirmar Devolução
  const handleConfirmDevolucao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool) return;

    const responsavel = selectedTool.cautelaAtual?.colaborador || "Operador";
    const os = selectedTool.cautelaAtual?.os;

    const mov: HistoricoMovimentacao = {
      id: String(Date.now()),
      data: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
      tipo: "Devolução",
      responsavel,
      osDestino: os,
      observacao: `Devolvido em condição: ${devolucaoCondicao}. ${devolucaoObs}`.trim(),
    };

    const novoStatus: StatusFerramenta = devolucaoCondicao === "Com Avaria" ? "Em Manutenção" : "Disponível";

    const updated = ferramentas.map((f) => {
      if (f.id === selectedTool.id) {
        return {
          ...f,
          status: novoStatus,
          cautelaAtual: undefined,
          historico: [mov, ...f.historico],
        };
      }
      return f;
    });

    setFerramentas(updated);
    setSelectedTool(updated.find((f) => f.id === selectedTool.id) || null);
    setIsDevolucaoModalOpen(false);
    setDevolucaoObs("");
  };

  // Handler: Transferir Filial
  const handleConfirmTransferencia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool) return;

    const origem = selectedTool.filial;
    const destino = transferDestino;

    const mov: HistoricoMovimentacao = {
      id: String(Date.now()),
      data: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
      tipo: "Transferência",
      responsavel: "Logística Inter-Filiais",
      filialOrigem: origem,
      filialDestino: destino,
      observacao: transferMotivo.trim() || `Transferência de ${origem} para ${destino}`,
    };

    const updated = ferramentas.map((f) => {
      if (f.id === selectedTool.id) {
        return {
          ...f,
          filial: destino,
          status: "Disponível" as StatusFerramenta,
          cautelaAtual: undefined,
          historico: [mov, ...f.historico],
        };
      }
      return f;
    });

    setFerramentas(updated);
    setSelectedTool(updated.find((f) => f.id === selectedTool.id) || null);
    setIsTransferenciaModalOpen(false);
    setTransferMotivo("");
  };

  // Handler: Cadastrar Nova Ferramenta
  const handleAddFerramenta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoPatrimonio.trim() || !novaDescricao.trim()) return;

    const nova: Ferramenta = {
      id: String(Date.now()),
      patrimonio: novoPatrimonio.trim().toUpperCase(),
      descricao: novaDescricao.trim(),
      categoria: novaCategoria,
      fabricante: novoFabricante.trim() || "Genérico",
      modelo: novoModelo.trim() || "Industrial",
      numeroSerie: novoSerie.trim() || "S/N",
      filial: novaFilial,
      localizacaoFisica: novoLocal.trim() || "Almoxarifado Central",
      status: "Disponível",
      requerCalibracao: novoRequerCalib,
      dataProximaCalibracao: novoRequerCalib ? novaProxCalib : undefined,
      diasParaVencerCalibracao: novoRequerCalib ? 365 : undefined,
      orgaoCalibrador: novoRequerCalib ? "Laboratório Credenciado RBC" : undefined,
      historico: [
        {
          id: "init",
          data: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
          tipo: "Devolução",
          responsavel: "Cadastro no Sistema",
          observacao: "Entrada em inventário ativo",
        },
      ],
    };

    setFerramentas([nova, ...ferramentas]);
    setSelectedTool(nova);
    setIsNovoModalOpen(false);
    setNovoPatrimonio("");
    setNovaDescricao("");
  };

  // Filtros aplicados
  const filtered = ferramentas.filter((f) => {
    const matchSearch =
      f.patrimonio.toLowerCase().includes(search.toLowerCase()) ||
      f.descricao.toLowerCase().includes(search.toLowerCase()) ||
      f.fabricante.toLowerCase().includes(search.toLowerCase()) ||
      f.numeroSerie.toLowerCase().includes(search.toLowerCase());
    const matchFilial = filtroFilial === "Todas" || f.filial.includes(filtroFilial);
    const matchCategoria = filtroCategoria === "Todas" || f.categoria === filtroCategoria;
    const matchStatus = filtroStatus === "Todas" || f.status === filtroStatus;
    return matchSearch && matchFilial && matchCategoria && matchStatus;
  });

  // KPIs
  const totalFerramentas = ferramentas.length;
  const emUsoCount = ferramentas.filter((f) => f.status === "Cautelada (Em Uso)").length;
  const vencidasCount = ferramentas.filter(
    (f) => f.requerCalibracao && f.diasParaVencerCalibracao !== undefined && f.diasParaVencerCalibracao <= 0,
  ).length;
  const disponiveisCount = ferramentas.filter((f) => f.status === "Disponível").length;

  return (
    <div className="flex h-full w-full flex-col bg-bg text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between border-b border-border bg-surface/90 px-5 py-3.5 backdrop-blur-md gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-accent-slate/15 text-accent-slate shadow-sm">
            <Hammer className="size-4.5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Gestão Global de Ferramentaria</h1>
            <p className="text-[11px] text-muted-foreground">
              Controle de patrimônio, cautelas, calibrações RBC e rastreamento multiunidades
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Seletor de Filial */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1 text-xs">
            <Building2 className="size-3.5 text-muted-foreground" />
            <select
              value={filtroFilial}
              onChange={(e) => setFiltroFilial(e.target.value)}
              className="bg-transparent text-foreground focus:outline-none text-xs font-medium cursor-pointer"
            >
              {FILIAIS.map((fil) => (
                <option key={fil} value={fil}>
                  {fil === "Todas" ? "Todas as Unidades" : fil}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-44 sm:w-60">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar patrimônio, modelo, marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsNovoModalOpen(true)} className="h-8 gap-1.5 text-xs">
            <Plus className="size-3.5" /> Nova Ferramenta
          </Button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 pb-2">
        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Parque Global de Ferramentas</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">{totalFerramentas}</span>
            <span className="text-xs text-muted-foreground">ativos catalogados</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Disponíveis em Claviculário</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-green">{disponiveisCount}</span>
            <span className="text-xs text-muted-foreground">prontas p/ uso</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Cauteladas / Em Operação</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-indigo">{emUsoCount}</span>
            <span className="text-xs text-muted-foreground">com técnicos</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Calibração RBC Vencida</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-xl font-bold ${vencidasCount > 0 ? "text-accent-rose" : "text-accent-green"}`}>
              {vencidasCount}
            </span>
            <span className="text-xs text-muted-foreground">requer aferição</span>
          </div>
        </div>
      </div>

      {/* Categorias & Status Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pb-2 text-xs border-b border-border/60">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-semibold text-muted-foreground mr-1">Categoria:</span>
          {["Todas", "Metrologia & Precisão", "Instrumentação Elétrica", "Hidráulico & Força", "Elétricas & Pneumáticas", "Dispositivos Especiais"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                filtroCategoria === cat
                  ? "bg-accent-slate text-white shadow-xs font-semibold"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground mr-1">Status:</span>
          {["Todas", "Disponível", "Cautelada (Em Uso)", "Calibração Vencida"].map((st) => (
            <button
              key={st}
              onClick={() => setFiltroStatus(st)}
              className={`rounded-lg px-2 py-0.5 text-[10px] font-medium transition-all ${
                filtroStatus === st
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Split View */}
      <div className="flex flex-1 gap-5 overflow-hidden p-5 pt-3">
        {/* Left: Lista de Ferramentas */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-surface">
          <div className="border-b border-border/80 bg-surface-2/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground flex justify-between items-center">
            <span>Inventário de Ferramental</span>
            <span className="text-[11px] font-mono font-medium">{filtered.length} ferramentas encontradas</span>
          </div>

          <div className="divide-y divide-border/60">
            {filtered.map((item) => {
              const isSelected = selectedTool?.id === item.id;
              const isCautelada = item.status === "Cautelada (Em Uso)";
              const isCalibVencida = item.status === "Calibração Vencida";

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedTool(item)}
                  className={`flex items-center justify-between p-3.5 transition-colors cursor-pointer hover:bg-surface-2/50 ${
                    isSelected ? "bg-surface-2 border-l-4 border-l-accent-slate" : ""
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground bg-surface-2 px-1.5 py-0.5 rounded border border-border">
                        {item.patrimonio}
                      </span>
                      <span className="font-semibold text-xs text-foreground">{item.descricao}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>Unidade: <strong className="text-foreground">{item.filial}</strong></span>
                      <span>·</span>
                      <span>{item.fabricante} {item.modelo}</span>
                      <span>·</span>
                      <span className="font-mono text-[10px]">S/N: {item.numeroSerie}</span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${
                          isCautelada
                            ? "bg-accent-indigo/15 text-accent-indigo border-accent-indigo/30"
                            : isCalibVencida
                            ? "bg-accent-rose/15 text-accent-rose border-accent-rose/30"
                            : "bg-accent-green/15 text-accent-green border-accent-green/30"
                        }`}
                      >
                        {item.status}
                      </span>

                      {isCautelada && item.cautelaAtual && (
                        <span className="text-muted-foreground text-[10px]">
                          Com: <strong className="text-foreground">{item.cautelaAtual.colaborador}</strong> (OS {item.cautelaAtual.os})
                        </span>
                      )}

                      {item.requerCalibracao && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Gauge className="size-3 text-accent-slate" />
                          <span>Próx. Calibração: <strong className={isCalibVencida ? "text-accent-rose" : "text-foreground"}>{item.dataProximaCalibracao}</strong></span>
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Prontuário Completo da Ferramenta */}
        <div className="hidden lg:flex w-[460px] flex-col rounded-2xl border border-border bg-surface p-5 overflow-y-auto">
          {selectedTool ? (
            <div className="flex flex-col gap-4">
              <div className="border-b border-border pb-3 flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-semibold text-accent-slate">Prontuário de Ativo</span>
                  <h2 className="text-base font-bold text-foreground">{selectedTool.descricao}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs font-bold bg-surface-2 px-2 py-0.5 rounded border border-border">
                      {selectedTool.patrimonio}
                    </span>
                    <span className="text-xs text-muted-foreground">{selectedTool.filial}</span>
                  </div>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent-slate/15 text-accent-slate">
                  <Hammer className="size-5" />
                </div>
              </div>

              {/* Botões de Ação Operacional */}
              <div className="grid grid-cols-2 gap-2">
                {selectedTool.status === "Disponível" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsCautelaModalOpen(true)}
                    className="gap-1.5 text-xs col-span-2"
                  >
                    <User className="size-3.5" /> Cautelar / Emprestar Ferramenta
                  </Button>
                )}

                {selectedTool.status === "Cautelada (Em Uso)" && (
                  <Button
                    variant="tinted"
                    size="sm"
                    onClick={() => setIsDevolucaoModalOpen(true)}
                    className="gap-1.5 text-xs col-span-2 text-accent-green border border-accent-green/30 bg-accent-green/10"
                  >
                    <CheckCircle2 className="size-3.5" /> Registrar Devolução ao Claviculário
                  </Button>
                )}

                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => setIsTransferenciaModalOpen(true)}
                  className="gap-1.5 text-xs"
                >
                  <ArrowRightLeft className="size-3.5" /> Transferir de Filial
                </Button>

                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => alert(`Certificado RBC ${selectedTool.patrimonio} emitido por ${selectedTool.orgaoCalibrador || "RBC"}`)}
                  className="gap-1.5 text-xs"
                >
                  <QrCode className="size-3.5" /> Etiqueta / Certificado
                </Button>
              </div>

              {/* Bloco de Cautela Atual (Se em uso) */}
              {selectedTool.cautelaAtual && (
                <div className="rounded-xl border border-accent-indigo/30 bg-accent-indigo/10 p-3 text-xs flex flex-col gap-1.5">
                  <div className="flex items-center justify-between font-semibold uppercase text-[10px] tracking-wider text-accent-indigo">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" /> Cautela Ativa em Chão de Fábrica
                    </span>
                    <span>OS {selectedTool.cautelaAtual.os}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span className="text-muted-foreground">Operador Responsável:</span>
                    <span className="font-bold">{selectedTool.cautelaAtual.colaborador} ({selectedTool.cautelaAtual.matricula})</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span className="text-muted-foreground">Retirada em:</span>
                    <span className="font-mono">{selectedTool.cautelaAtual.dataRetirada}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span className="text-muted-foreground">Previsão Devolução:</span>
                    <span className="font-medium text-accent-indigo">{selectedTool.cautelaAtual.previsaoDevolucao}</span>
                  </div>
                </div>
              )}

              {/* Dados Técnicos e Localização */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  Especificações & Armazenamento
                </span>
                <div className="grid grid-cols-2 gap-2 text-foreground">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Fabricante / Marca:</span>
                    <span className="font-medium">{selectedTool.fabricante}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Modelo:</span>
                    <span className="font-medium">{selectedTool.modelo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Número de Série:</span>
                    <span className="font-mono text-xs">{selectedTool.numeroSerie}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Local Físico / Gaveta:</span>
                    <span className="font-medium">{selectedTool.localizacaoFisica}</span>
                  </div>
                </div>
              </div>

              {/* Calibração RBC / Metrologia */}
              {selectedTool.requerCalibracao && (
                <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Gauge className="size-3.5 text-accent-slate" /> Controle Metrológico (RBC)
                    </span>
                    <span className="font-bold text-accent-green">ISO 9001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última Calibração:</span>
                    <span className="font-mono font-medium text-foreground">{selectedTool.dataUltimaCalibracao || "Pendente"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Validade / Próxima:</span>
                    <span className={`font-mono font-bold ${selectedTool.status === "Calibração Vencida" ? "text-accent-rose" : "text-foreground"}`}>
                      {selectedTool.dataProximaCalibracao}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Laboratório Emissor:</span>
                    <span className="font-medium text-foreground">{selectedTool.orgaoCalibrador}</span>
                  </div>
                </div>
              )}

              {/* Histórico de Movimentações */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  Rastreabilidade & Histórico Recente
                </span>
                {selectedTool.historico.length > 0 ? (
                  <div className="space-y-2">
                    {selectedTool.historico.map((h) => (
                      <div key={h.id} className="border-b border-border/50 pb-1.5 text-foreground flex flex-col gap-0.5">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs">{h.tipo}: {h.responsavel}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">{h.data}</span>
                        </div>
                        {h.osDestino && (
                          <span className="text-[11px] text-accent-indigo">Ordem de Serviço vinculada: OS {h.osDestino}</span>
                        )}
                        {h.filialOrigem && h.filialDestino && (
                          <span className="text-[11px] text-accent-amber">De: {h.filialOrigem} ➔ Para: {h.filialDestino}</span>
                        )}
                        {h.observacao && (
                          <span className="text-[10px] text-muted-foreground italic">{h.observacao}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-[11px]">Nenhuma movimentação registrada.</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal 1: Cautela de Ferramenta */}
      {isCautelaModalOpen && selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl border border-border bg-surface shadow-mac-3">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Cautelar Ferramenta</h3>
                <p className="text-[12px] text-muted-foreground">Retirada temporária para operação em OS</p>
              </div>
              <button
                onClick={() => setIsCautelaModalOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmCautela} className="flex flex-col gap-4 overflow-y-auto p-5 text-xs">
              <div className="rounded-xl border border-border bg-surface-2/60 p-3 flex flex-col gap-1">
                <span className="font-mono text-[10px] text-muted-foreground">{selectedTool.patrimonio}</span>
                <span className="font-semibold text-foreground text-xs">{selectedTool.descricao}</span>
                <span className="text-[11px] text-muted-foreground">Unidade: {selectedTool.filial}</span>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Nome do Colaborador / Técnico</label>
                <Input
                  placeholder="Ex: Carlos Eduardo ou Marcos Vinicius"
                  value={cautelaColaborador}
                  onChange={(e) => setCautelaColaborador(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Matrícula</label>
                  <Input placeholder="OP-4821" value={cautelaMatricula} onChange={(e) => setCautelaMatricula(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Ordem de Serviço (OS)</label>
                  <Input placeholder="145920" value={cautelaOs} onChange={(e) => setCautelaOs(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Previsão de Devolução</label>
                <Input value={cautelaPrevisao} onChange={(e) => setCautelaPrevisao(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-2">
                <Button variant="neutral" size="sm" type="button" onClick={() => setIsCautelaModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Confirmar Retirada
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Devolução de Ferramenta */}
      {isDevolucaoModalOpen && selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl border border-border bg-surface shadow-mac-3">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Registrar Devolução</h3>
                <p className="text-[12px] text-muted-foreground">Retorno da ferramenta ao claviculário da unidade</p>
              </div>
              <button
                onClick={() => setIsDevolucaoModalOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDevolucao} className="flex flex-col gap-4 overflow-y-auto p-5 text-xs">
              <div className="rounded-xl border border-border bg-surface-2/60 p-3 flex flex-col gap-1">
                <span className="font-mono text-[10px] text-muted-foreground">{selectedTool.patrimonio}</span>
                <span className="font-semibold text-foreground text-xs">{selectedTool.descricao}</span>
                <span className="text-[11px] text-muted-foreground">
                  Com: {selectedTool.cautelaAtual?.colaborador} (OS {selectedTool.cautelaAtual?.os})
                </span>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Condição de Devolução</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(["Perfeita", "Com Avaria", "Necessita Calibração"] as const).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setDevolucaoCondicao(cond)}
                      className={`p-2 rounded-lg border text-center text-xs font-medium transition-all ${
                        devolucaoCondicao === cond
                          ? "border-accent-green bg-accent-green/10 text-accent-green font-bold"
                          : "border-border bg-surface hover:bg-surface-2 text-muted-foreground"
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Observações / Inspeção Visual</label>
                <Input
                  placeholder="Limpeza realizada, cabos íntegros, pontas preservadas..."
                  value={devolucaoObs}
                  onChange={(e) => setDevolucaoObs(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-2">
                <Button variant="neutral" size="sm" type="button" onClick={() => setIsDevolucaoModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Confirmar Recebimento
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Transferência entre Filiais */}
      {isTransferenciaModalOpen && selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl border border-border bg-surface shadow-mac-3">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Transferir entre Filiais</h3>
                <p className="text-[12px] text-muted-foreground">Remessa de ferramental para outra unidade operacional</p>
              </div>
              <button
                onClick={() => setIsTransferenciaModalOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmTransferencia} className="flex flex-col gap-4 overflow-y-auto p-5 text-xs">
              <div className="rounded-xl border border-border bg-surface-2/60 p-3 flex flex-col gap-1">
                <span className="font-mono text-[10px] text-muted-foreground">{selectedTool.patrimonio}</span>
                <span className="font-semibold text-foreground text-xs">{selectedTool.descricao}</span>
                <span className="text-[11px] text-muted-foreground">Origem atual: <strong>{selectedTool.filial}</strong></span>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Unidade / Filial de Destino</label>
                <select
                  value={transferDestino}
                  onChange={(e) => setTransferDestino(e.target.value as Ferramenta["filial"])}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  {FILIAIS.filter((f) => f !== "Todas" && f !== selectedTool.filial).map((fil) => (
                    <option key={fil} value={fil}>
                      {fil}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Motivo da Remessa / OS</label>
                <Input
                  placeholder="Ex: Atendimento emergencial à OS 146100 em Parauapebas"
                  value={transferMotivo}
                  onChange={(e) => setTransferMotivo(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-2">
                <Button variant="neutral" size="sm" type="button" onClick={() => setIsTransferenciaModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Confirmar Transferência
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Cadastro de Nova Ferramenta */}
      {isNovoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-surface shadow-mac-3">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Cadastrar Nova Ferramenta</h3>
                <p className="text-[12px] text-muted-foreground">Registro de patrimônio no inventário multiunidades</p>
              </div>
              <button
                onClick={() => setIsNovoModalOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddFerramenta} className="flex flex-col gap-4 overflow-y-auto p-5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Código Patrimônio</label>
                  <Input placeholder="Ex: FER-SLZ-0250" value={novoPatrimonio} onChange={(e) => setNovoPatrimonio(e.target.value)} required />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Filial Proprietária</label>
                  <select
                    value={novaFilial}
                    onChange={(e) => setNovaFilial(e.target.value as Ferramenta["filial"])}
                    className="w-full h-8 rounded-md border border-border bg-surface px-2.5 text-xs text-foreground focus:outline-none"
                  >
                    {FILIAIS.filter((f) => f !== "Todas").map((fil) => (
                      <option key={fil} value={fil}>
                        {fil}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Descrição Completa</label>
                <Input
                  placeholder="Ex: Micrômetro Externo 0-25mm 0.001mm"
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Categoria</label>
                  <select
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value as CategoriaFerramenta)}
                    className="w-full h-8 rounded-md border border-border bg-surface px-2.5 text-xs text-foreground focus:outline-none"
                  >
                    <option value="Metrologia & Precisão">Metrologia & Precisão</option>
                    <option value="Instrumentação Elétrica">Instrumentação Elétrica</option>
                    <option value="Hidráulico & Força">Hidráulico & Força</option>
                    <option value="Elétricas & Pneumáticas">Elétricas & Pneumáticas</option>
                    <option value="Dispositivos Especiais">Dispositivos Especiais</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Localização Física</label>
                  <Input placeholder="Armário B / Prateleira 2" value={novoLocal} onChange={(e) => setNovoLocal(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Fabricante / Marca</label>
                  <Input placeholder="Mitutoyo / SKF / Gedore" value={novoFabricante} onChange={(e) => setNovoFabricante(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Modelo</label>
                  <Input placeholder="QuantuMike" value={novoModelo} onChange={(e) => setNovoModelo(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Número de Série</label>
                  <Input placeholder="MTY-99120" value={novoSerie} onChange={(e) => setNovoSerie(e.target.value)} />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface-2/40 p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Requer Calibração Periódica (RBC)?</span>
                  <input
                    type="checkbox"
                    checked={novoRequerCalib}
                    onChange={(e) => setNovoRequerCalib(e.target.checked)}
                    className="size-4 rounded accent-primary cursor-pointer"
                  />
                </div>
                {novoRequerCalib && (
                  <div>
                    <label className="text-[10px] font-semibold uppercase text-muted-foreground">Data da Próxima Calibração</label>
                    <Input value={novaProxCalib} onChange={(e) => setNovaProxCalib(e.target.value)} />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-2">
                <Button variant="neutral" size="sm" type="button" onClick={() => setIsNovoModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Salvar Ferramenta
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
