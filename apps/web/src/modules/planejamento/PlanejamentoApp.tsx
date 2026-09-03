import React, { useState } from "react";
import { BarChart3, Search, Plus, CheckCircle2, AlertTriangle, Clock, ShoppingCart, Wrench, RefreshCw, ChevronRight, X, ArrowUpRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ServicoEscopo {
  descricao: string;
  setor: string;
  tempoHH: number;
  valorEstimado: number;
}

interface PecaSubstituicao {
  descricao: string;
  quantidade: number;
  unidade: string;
  origem: "Estoque" | "Compra Externa" | "Fabricação";
  custoEstimado: number;
}

interface CompraExterna {
  itemOuServico: string;
  fornecedorSugerido: string;
  prazoDias: number;
  valorPrevisto: number;
  status: "Cotado" | "Em Aprovação" | "Pedido Emitido" | "Aguardando Entrega";
}

interface PeritagemPlanejamento {
  id: string;
  os: string;
  cliente: string;
  motor: string;
  potencia: string;
  dataPeritagem: string;
  statusAprovacao: "Aprovado pelo Cliente" | "Aguardando Proposta" | "Em Análise Comercial" | "Recusado";
  valorTotalProposto: number;
  prazoTotalDias: number;
  peritoResponsavel: string;
  servicos: ServicoEscopo[];
  substituicoes: PecaSubstituicao[];
  comprasExternas: CompraExterna[];
  diagnosticoPeritagem: string;
}

const INITIAL_PLANEJAMENTOS: PeritagemPlanejamento[] = [
  {
    id: "1",
    os: "145920",
    cliente: "Vale S.A. - Mina de Carajás",
    motor: "WEG W22 250cv 4P",
    potencia: "250 cv / 185 kW",
    dataPeritagem: "28/08/2026",
    statusAprovacao: "Aprovado pelo Cliente",
    valorTotalProposto: 48500.0,
    prazoTotalDias: 14,
    peritoResponsavel: "Ricardo Menezes (Técnico Peritagem)",
    diagnosticoPeritagem: "Curto-circuito estatórico fase-massa decorrente de surto de tensão. Danificação nos alojamentos das tampas por sobreaquecimento nos rolamentos originais.",
    servicos: [
      { descricao: "Rebobinamento completo do estator classe H", setor: "Rebobinamento", tempoHH: 48, valorEstimado: 24000 },
      { descricao: "Metalização e retífica dos colos de rolamento do eixo", setor: "Usinagem", tempoHH: 14, valorEstimado: 6800 },
      { descricao: "Recuperação do alojamento de rolamento tampa DE", setor: "Caldeiraria/Usinagem", tempoHH: 8, valorEstimado: 4200 },
      { descricao: "Balanceamento dinâmico do rotor em 2 planos", setor: "Balanceamento", tempoHH: 6, valorEstimado: 2500 },
      { descricao: "Pintura epóxi padrão Vale e ensaios finais", setor: "Pintura/Ensaios", tempoHH: 12, valorEstimado: 3800 },
    ],
    substituicoes: [
      { descricao: "Rolamento 6319 C3 (SKF Explorer)", quantidade: 1, unidade: "PC", origem: "Estoque", custoEstimado: 1850 },
      { descricao: "Rolamento 6316 C3 (SKF Explorer)", quantidade: 1, unidade: "PC", origem: "Estoque", custoEstimado: 1420 },
      { descricao: "Jogo de retentores Viton especiais", quantidade: 2, unidade: "JG", origem: "Compra Externa", custoEstimado: 480 },
      { descricao: "Placa de bornes 6 pinos M10", quantidade: 1, unidade: "PC", origem: "Estoque", custoEstimado: 650 },
    ],
    comprasExternas: [
      { itemOuServico: "Jogo de retentores Viton especiais alta temp.", fornecedorSugerido: "Vedaflex Vedacoes Industriais", prazoDias: 3, valorPrevisto: 480, status: "Aguardando Entrega" },
      { itemOuServico: "Análise metalográfica de falha no eixo", fornecedorSugerido: "LabMet Ensaios Mecânicos", prazoDias: 5, valorPrevisto: 1200, status: "Pedido Emitido" },
    ],
  },
  {
    id: "2",
    os: "145935",
    cliente: "Alunorte Alumina do Norte",
    motor: "WEG W22 150cv 2P",
    potencia: "150 cv / 110 kW",
    dataPeritagem: "29/08/2026",
    statusAprovacao: "Em Análise Comercial",
    valorTotalProposto: 29800.0,
    prazoTotalDias: 10,
    peritoResponsavel: "Carlos Eduardo",
    diagnosticoPeritagem: "Desgaste mecânico por fadiga nos mancais, sem queima elétrica no bobinado. Indicado banho químico de estufa, impregnação preventiva e usinagem de ponta de eixo.",
    servicos: [
      { descricao: "Lavagem química desengraxante + estufa", setor: "Lavagem", tempoHH: 8, valorEstimado: 2800 },
      { descricao: "Impregnação preventiva a vácuo com resina poliéster", setor: "Rebobinamento", tempoHH: 10, valorEstimado: 4500 },
      { descricao: "Fresamento de chaveteiro e alinhamento de eixo", setor: "Usinagem", tempoHH: 12, valorEstimado: 5600 },
      { descricao: "Balanceamento de alta precisão 3600 RPM", setor: "Balanceamento", tempoHH: 8, valorEstimado: 3400 },
      { descricao: "Montagem, testes a vazio e pintura", setor: "Montagem", tempoHH: 14, valorEstimado: 4200 },
    ],
    substituicoes: [
      { descricao: "Rolamento 6316 C3", quantidade: 2, unidade: "PC", origem: "Estoque", custoEstimado: 2200 },
      { descricao: "Ventilador plástico reforçado Ø350mm", quantidade: 1, unidade: "PC", origem: "Compra Externa", custoEstimado: 850 },
    ],
    comprasExternas: [
      { itemOuServico: "Ventilador plástico reforçado Ø350mm original WEG", fornecedorSugerido: "Distribuidora Eletromotores", prazoDias: 4, valorPrevisto: 850, status: "Cotado" },
    ],
  },
  {
    id: "3",
    os: "145980",
    cliente: "Hydro Albras Alumínio",
    motor: "WEG HGF 315cv (Alta Tensão 4.16kV)",
    potencia: "315 cv / 230 kW",
    dataPeritagem: "30/08/2026",
    statusAprovacao: "Aprovado pelo Cliente",
    valorTotalProposto: 92400.0,
    prazoTotalDias: 21,
    peritoResponsavel: "Ricardo Menezes",
    diagnosticoPeritagem: "Enrolamento de alta tensão com perda severa de rigidez dielétrica e descarga parcial. Necessidade de rebobinamento com bobinas pré-formadas e rolamentos especiais isolados.",
    servicos: [
      { descricao: "Rebobinamento AT com bobinas pré-formadas VPI", setor: "Rebobinamento", tempoHH: 96, valorEstimado: 54000 },
      { descricao: "Usinagem de precisão nas tampas com inserção de bucha de aço", setor: "Usinagem", tempoHH: 18, valorEstimado: 9200 },
      { descricao: "Caldeiraria na carcaça e defletores", setor: "Caldeiraria", tempoHH: 12, valorEstimado: 4800 },
      { descricao: "Ensaio temporizado de surto e Hi-Pot 9.5kV", setor: "Ensaios", tempoHH: 16, valorEstimado: 6500 },
    ],
    substituicoes: [
      { descricao: "Rolamento isolado Insocoat 6319/C3VL0241", quantidade: 1, unidade: "PC", origem: "Compra Externa", custoEstimado: 6800 },
      { descricao: "Rolamento de rolos NU 319 ECM", quantidade: 1, unidade: "PC", origem: "Compra Externa", custoEstimado: 4200 },
      { descricao: "Sensores de temperatura PT-100 mancais e estator", quantidade: 6, unidade: "PC", origem: "Estoque", custoEstimado: 1950 },
    ],
    comprasExternas: [
      { itemOuServico: "Rolamento Insocoat e NU 319 SKF com blindagem cerâmica", fornecedorSugerido: "SKF do Brasil Distribuição", prazoDias: 7, valorPrevisto: 11000, status: "Aguardando Entrega" },
      { itemOuServico: "Fabricação externa de jogo de bobinas pré-formadas AT", fornecedorSugerido: "EletroForm Bobinas Especiais", prazoDias: 10, valorPrevisto: 18500, status: "Pedido Emitido" },
    ],
  },
];

export function PlanejamentoApp() {
  const [planejamentos, setPlanejamentos] = useState<PeritagemPlanejamento[]>(INITIAL_PLANEJAMENTOS);
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PeritagemPlanejamento | null>(planejamentos[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newOs, setNewOs] = useState("");
  const [newCliente, setNewCliente] = useState("");
  const [newMotor, setNewMotor] = useState("");
  const [newPotencia, setNewPotencia] = useState("150 cv");
  const [newValor, setNewValor] = useState(35000);
  const [newPrazo, setNewPrazo] = useState(12);
  const [newDiagnostico, setNewDiagnostico] = useState("");
  const [newServicosStr, setNewServicosStr] = useState("Rebobinamento completo (Rebobinamento, 40h), Retífica de eixo (Usinagem, 12h)");
  const [newPecasStr, setNewPecasStr] = useState("Rolamentos 6316 C3 (2 un), Retentores (2 un)");

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOs.trim() || !newCliente.trim()) return;

    const servicosParsed: ServicoEscopo[] = newServicosStr.split(",").map((s) => ({
      descricao: s.trim(),
      setor: "Oficina Geral",
      tempoHH: 20,
      valorEstimado: 8000,
    }));

    const pecasParsed: PecaSubstituicao[] = newPecasStr.split(",").map((p) => ({
      descricao: p.trim(),
      quantidade: 1,
      unidade: "PC",
      origem: "Estoque",
      custoEstimado: 1200,
    }));

    const item: PeritagemPlanejamento = {
      id: String(Date.now()),
      os: newOs.trim(),
      cliente: newCliente.trim(),
      motor: newMotor.trim() || "Motor Trifásico",
      potencia: newPotencia,
      dataPeritagem: new Date().toLocaleDateString("pt-BR"),
      statusAprovacao: "Aguardando Proposta",
      valorTotalProposto: Number(newValor),
      prazoTotalDias: Number(newPrazo),
      peritoResponsavel: "Peritagem Técnica",
      diagnosticoPeritagem: newDiagnostico.trim() || "Peritagem dimensional e elétrica realizada.",
      servicos: servicosParsed,
      substituicoes: pecasParsed,
      comprasExternas: [],
    };

    setPlanejamentos([item, ...planejamentos]);
    setSelectedPlan(item);
    setIsModalOpen(false);
    setNewOs("");
    setNewCliente("");
  };

  const filtered = planejamentos.filter(
    (p) =>
      p.os.toLowerCase().includes(search.toLowerCase()) ||
      p.cliente.toLowerCase().includes(search.toLowerCase()) ||
      p.motor.toLowerCase().includes(search.toLowerCase()),
  );

  const totalProposto = planejamentos.reduce((acc, curr) => acc + curr.valorTotalProposto, 0);
  const totalAprovado = planejamentos
    .filter((p) => p.statusAprovacao === "Aprovado pelo Cliente")
    .reduce((acc, curr) => acc + curr.valorTotalProposto, 0);
  const taxaAprovacao = totalProposto > 0 ? Math.round((totalAprovado / totalProposto) * 100) : 0;

  return (
    <div className="flex h-full w-full flex-col bg-bg text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between border-b border-border bg-surface/90 px-5 py-3.5 backdrop-blur-md gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-accent-indigo/15 text-accent-indigo shadow-sm">
            <BarChart3 className="size-4.5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Planejamento & Escopo</h1>
            <p className="text-[11px] text-muted-foreground">
              Análise de indicadores de peritagem, serviços, substituições e compras externas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar OS, cliente ou motor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="h-8 gap-1.5 text-xs">
            <Plus className="size-3.5" /> Novo Escopo Peritado
          </Button>
        </div>
      </header>

      {/* KPI Cards de Planejamento */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 pb-2">
        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Equipamentos Peritados</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">{planejamentos.length}</span>
            <span className="text-xs text-muted-foreground">motores no fluxo</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Volume de Vendas / Propostas</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-indigo">
              R$ {(totalProposto / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-muted-foreground">proposto</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Taxa de Conversão / Aprovação</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-green">{taxaAprovacao}%</span>
            <span className="text-xs text-muted-foreground">aprovado cliente</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Compras Externas / Terceirizados</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-amber">
              {planejamentos.reduce((acc, curr) => acc + curr.comprasExternas.length, 0)}
            </span>
            <span className="text-xs text-muted-foreground">itens encomendados</span>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="flex flex-1 gap-5 overflow-hidden p-5 pt-3">
        {/* Left: Lista de Equipamentos Peritados */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-surface">
          <div className="border-b border-border/80 bg-surface-2/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground flex justify-between items-center">
            <span>Ordens de Serviço com Peritagem Concluída</span>
            <span className="text-[11px] font-mono font-medium">{filtered.length} itens</span>
          </div>
          <div className="divide-y divide-border/60">
            {filtered.map((item) => {
              const isSelected = selectedPlan?.id === item.id;
              const isAprovado = item.statusAprovacao === "Aprovado pelo Cliente";
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedPlan(item)}
                  className={`flex items-center justify-between p-4 transition-colors cursor-pointer hover:bg-surface-2/50 ${
                    isSelected ? "bg-surface-2 border-l-4 border-l-accent-indigo" : ""
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-foreground">OS {item.os}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                          isAprovado
                            ? "bg-accent-green/15 text-accent-green border-accent-green/30"
                            : "bg-accent-amber/15 text-accent-amber border-accent-amber/30"
                        }`}
                      >
                        {item.statusAprovacao}
                      </span>
                      <span className="text-xs text-muted-foreground">· {item.cliente}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.motor} · <span className="font-medium text-foreground">{item.potencia}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span>Serviços: <strong className="text-foreground">{item.servicos.length}</strong></span>
                      <span>·</span>
                      <span>Substituições: <strong className="text-foreground">{item.substituicoes.length}</strong></span>
                      <span>·</span>
                      <span>Compras Externas: <strong className="text-accent-amber">{item.comprasExternas.length}</strong></span>
                      <span>·</span>
                      <span>Prazo: <strong className="text-foreground">{item.prazoTotalDias} dias</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold font-mono text-accent-indigo">
                      R$ {item.valorTotalProposto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{item.dataPeritagem}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Painel de Escopo Detalhado */}
        <div className="hidden lg:flex w-[480px] flex-col rounded-2xl border border-border bg-surface p-5 overflow-y-auto">
          {selectedPlan ? (
            <div className="flex flex-col gap-4">
              <div className="border-b border-border pb-3 flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-semibold text-accent-indigo">Escopo Comercial & Técnico</span>
                  <h2 className="text-lg font-bold text-foreground">OS {selectedPlan.os}</h2>
                  <p className="text-xs text-muted-foreground">{selectedPlan.cliente} · {selectedPlan.motor}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-accent-green block">
                    R$ {selectedPlan.valorTotalProposto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Prazo: {selectedPlan.prazoTotalDias} dias úteis</span>
                </div>
              </div>

              {/* Diagnóstico da Peritagem */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-1.5">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  Diagnóstico Técnico Inicial (Peritagem)
                </span>
                <p className="text-foreground leading-relaxed">{selectedPlan.diagnosticoPeritagem}</p>
                <span className="text-[10px] text-muted-foreground mt-1">Perito: {selectedPlan.peritoResponsavel}</span>
              </div>

              {/* Serviços Planejados */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <div className="flex items-center justify-between font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Wrench className="size-3.5 text-primary" /> Serviços a Executar ({selectedPlan.servicos.length})
                  </span>
                  <span>Total H.H: {selectedPlan.servicos.reduce((acc, curr) => acc + curr.tempoHH, 0)}h</span>
                </div>
                <div className="space-y-1.5">
                  {selectedPlan.servicos.map((serv, idx) => (
                    <div key={idx} className="flex justify-between items-center text-foreground border-b border-border/40 pb-1">
                      <div>
                        <span className="font-medium block">{serv.descricao}</span>
                        <span className="text-[10px] text-muted-foreground">Setor: {serv.setor} · {serv.tempoHH} HH</span>
                      </div>
                      <span className="font-mono font-semibold text-xs text-muted-foreground">
                        R$ {serv.valorEstimado.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peças a Substituir */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <div className="flex items-center justify-between font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <RefreshCw className="size-3.5 text-accent-green" /> Peças para Substituição ({selectedPlan.substituicoes.length})
                  </span>
                </div>
                <div className="space-y-1.5">
                  {selectedPlan.substituicoes.map((peca, idx) => (
                    <div key={idx} className="flex justify-between items-center text-foreground border-b border-border/40 pb-1">
                      <div>
                        <span className="font-medium block">{peca.descricao}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {peca.quantidade} {peca.unidade} · Origem: <strong className={peca.origem === "Estoque" ? "text-accent-green" : "text-accent-amber"}>{peca.origem}</strong>
                        </span>
                      </div>
                      <span className="font-mono font-semibold text-xs text-muted-foreground">
                        R$ {peca.custoEstimado.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compras Externas / Terceirização */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <div className="flex items-center justify-between font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ShoppingCart className="size-3.5 text-accent-amber" /> Compras Externas & Terceirizados ({selectedPlan.comprasExternas.length})
                  </span>
                </div>
                {selectedPlan.comprasExternas.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedPlan.comprasExternas.map((compra, idx) => (
                      <div key={idx} className="rounded border border-border bg-surface p-2 flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-foreground">{compra.itemOuServico}</span>
                          <span className="rounded bg-accent-amber/15 text-accent-amber px-1.5 py-0.5 text-[9px] font-bold">
                            {compra.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>Fornecedor: {compra.fornecedorSugerido}</span>
                          <span className="font-mono font-bold text-foreground">R$ {compra.valorPrevisto.toLocaleString("pt-BR")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-[11px]">Nenhuma compra externa ou terceirização necessária para esta OS.</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal Novo Escopo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-surface shadow-mac-3">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Registrar Escopo Peritado</h3>
                <p className="text-[12px] text-muted-foreground">Entrada de serviços, peças e compras externas pós-peritagem</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddPlan} className="flex flex-col gap-4 overflow-y-auto p-5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Número da OS</label>
                  <Input placeholder="Ex: 146200" value={newOs} onChange={(e) => setNewOs(e.target.value)} required />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Cliente</label>
                  <Input placeholder="Ex: Vale S.A." value={newCliente} onChange={(e) => setNewCliente(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Modelo Motor</label>
                  <Input placeholder="Ex: WEG W22 200cv" value={newMotor} onChange={(e) => setNewMotor(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Potência</label>
                  <Input placeholder="200 cv" value={newPotencia} onChange={(e) => setNewPotencia(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Valor Proposto (R$)</label>
                  <Input type="number" value={newValor} onChange={(e) => setNewValor(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Prazo Estimado (Dias)</label>
                  <Input type="number" value={newPrazo} onChange={(e) => setNewPrazo(Number(e.target.value))} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Diagnóstico da Peritagem</label>
                <Input placeholder="Motivo da falha, queima estatórica, folga nos mancais..." value={newDiagnostico} onChange={(e) => setNewDiagnostico(e.target.value)} />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Serviços a Executar (separados por vírgula)</label>
                <Input value={newServicosStr} onChange={(e) => setNewServicosStr(e.target.value)} />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Peças a Substituir (separados por vírgula)</label>
                <Input value={newPecasStr} onChange={(e) => setNewPecasStr(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-2">
                <Button variant="neutral" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Cadastrar Planejamento
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
