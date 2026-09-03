import React, { useState } from "react";
import { ClipboardCheck, Search, Plus, CheckCircle2, AlertTriangle, ShieldCheck, Paintbrush, Wrench, RefreshCw, X, PackageCheck, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChecklistItem {
  descricao: string;
  tipo: "recuperado" | "trocado" | "pintura" | "mecanica" | "identificacao";
  status: "Conforme" | "Atenção" | "Não Conforme";
  detalhe?: string;
}

interface InspecaoFinal {
  id: string;
  os: string;
  cliente: string;
  motor: string;
  potencia: string;
  data: string;
  inspetor: string;
  status: "Liberado p/ Expedição" | "Retrabalho Pendente" | "Em Inspeção";
  espessuraPinturaMicrons: number;
  corPintura: string;
  acabamentoGeral: "Excelente" | "Bom" | "Regular";
  giroLivre: boolean;
  folgaAxialMm: number;
  itensRecuperados: string[];
  itensTrocados: string[];
  checklist: ChecklistItem[];
  parecerExpedicao: string;
}

const INITIAL_INSPECOES_QUALIDADE: InspecaoFinal[] = [
  {
    id: "1",
    os: "145920",
    cliente: "Vale S.A.",
    motor: "WEG W22 250cv",
    potencia: "250 cv / 185 kW",
    data: "02/09/2026",
    inspetor: "Marcos Vinicius (Insp. Qualidade)",
    status: "Liberado p/ Expedição",
    espessuraPinturaMicrons: 145,
    corPintura: "Azul WEG 5009 (Epóxi Alta Espessura)",
    acabamentoGeral: "Excelente",
    giroLivre: true,
    folgaAxialMm: 0.18,
    itensRecuperados: ["Colo dos rolamentos do eixo (metalização + retífica)", "Alojamento tampa dianteira DE", "Roscas dos pés da carcaça"],
    itensTrocados: ["Rolamento DE 6319 C3", "Rolamento NDE 6316 C3", "Retentores Viton", "Graxeiras inox", "Placa de bornes"],
    checklist: [
      { descricao: "Recuperação do eixo e munhões dentro das tolerâncias H7/k6", tipo: "recuperado", status: "Conforme", detalhe: "Dimensional conferido com micrômetro" },
      { descricao: "Rolamentos dianteiro e traseiro novos e lubrificados (Graxa Mobil Polyrex EM)", tipo: "trocado", status: "Conforme", detalhe: "Folga C3 verificada" },
      { descricao: "Substituição completa de retentores e vedações V-Ring", tipo: "trocado", status: "Conforme" },
      { descricao: "Pintura padrão cliente: espessura uniforme, livre de escorridos ou bolhas", tipo: "pintura", status: "Conforme", detalhe: "145 µm (Norma: 120-160 µm)" },
      { descricao: "Proteção anticorrosiva e óleo protetivo na ponta do eixo e chaveta", tipo: "pintura", status: "Conforme" },
      { descricao: "Giro livre do rotor sem interferência, atrito ou ruído mecânico", tipo: "mecanica", status: "Conforme" },
      { descricao: "Folga axial e radial dentro do padrão do fabricante", tipo: "mecanica", status: "Conforme", detalhe: "Folga axial: 0.18 mm" },
      { descricao: "Plaqueta de identificação legível, dados remarcados e sentido de rotação", tipo: "identificacao", status: "Conforme" },
    ],
    parecerExpedicao: "Equipamento inspecionado pós-manutenção geral. Todos os componentes recuperados e substituídos atendem às normas técnicas. Liberado para embalagem e expedição.",
  },
  {
    id: "2",
    os: "145935",
    cliente: "Alunorte",
    motor: "WEG W22 150cv",
    potencia: "150 cv / 110 kW",
    data: "01/09/2026",
    inspetor: "Carlos Eduardo",
    status: "Retrabalho Pendente",
    espessuraPinturaMicrons: 85,
    corPintura: "Cinza Munsell N6.5",
    acabamentoGeral: "Regular",
    giroLivre: true,
    folgaAxialMm: 0.22,
    itensRecuperados: ["Eixo ponta dianteira", "Chaveteiro fresado"],
    itensTrocados: ["Rolamentos 6316 C3", "Placa de bornes nova"],
    checklist: [
      { descricao: "Recuperação do eixo e chaveteiro", tipo: "recuperado", status: "Conforme" },
      { descricao: "Rolamentos novos instalados", tipo: "trocado", status: "Conforme" },
      { descricao: "Pintura final: espessura abaixo da especificação", tipo: "pintura", status: "Não Conforme", detalhe: "Medido 85 µm (Mínimo exigido: 120 µm). Falhas na base." },
      { descricao: "Giro livre do rotor", tipo: "mecanica", status: "Conforme" },
      { descricao: "Plaqueta de identificação", tipo: "identificacao", status: "Atenção", detalhe: "Plaqueta sem remarcação da nova data de revisão" },
    ],
    parecerExpedicao: "Retrabalho solicitado no setor de Pintura para aplicação de nova demão de acabamento e remarcação da plaqueta.",
  },
  {
    id: "3",
    os: "145980",
    cliente: "Hydro Albras",
    motor: "WEG HGF 315cv (AT)",
    potencia: "315 cv / 230 kW",
    data: "02/09/2026",
    inspetor: "Marcos Vinicius (Insp. Qualidade)",
    status: "Liberado p/ Expedição",
    espessuraPinturaMicrons: 160,
    corPintura: "Verde Segurança Epóxi Industrial",
    acabamentoGeral: "Excelente",
    giroLivre: true,
    folgaAxialMm: 0.15,
    itensRecuperados: ["Tampas usinadas", "Eixo retificado nos assentos dos mancais", "Caixa de ligação recuperada"],
    itensTrocados: ["Rolamentos isolados para inversor (Insocoat)", "Defletores", "Parafusos em aço 8.8", "Graxeiras"],
    checklist: [
      { descricao: "Usinagem das tampas e caixa de ligação", tipo: "recuperado", status: "Conforme" },
      { descricao: "Rolamentos isolados Insocoat novos instalados", tipo: "trocado", status: "Conforme" },
      { descricao: "Pintura anticorrosiva de alta performance", tipo: "pintura", status: "Conforme", detalhe: "160 µm com laudo aderência" },
      { descricao: "Giro mecânico e verificação com torquímetro", tipo: "mecanica", status: "Conforme" },
      { descricao: "Plaqueta técnica e certificados de ensaios anexados", tipo: "identificacao", status: "Conforme" },
    ],
    parecerExpedicao: "Revisão mecânica completa aprovada com excelência. Motor pronto para envio ao cliente.",
  },
];

export function InspecaoQualidadeApp() {
  const [inspecoes, setInspecoes] = useState<InspecaoFinal[]>(INITIAL_INSPECOES_QUALIDADE);
  const [search, setSearch] = useState("");
  const [selectedInspecao, setSelectedInspecao] = useState<InspecaoFinal | null>(inspecoes[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newOs, setNewOs] = useState("");
  const [newCliente, setNewCliente] = useState("");
  const [newMotor, setNewMotor] = useState("");
  const [newPotencia, setNewPotencia] = useState("100 cv");
  const [newInspetor, setNewInspetor] = useState("Inspetor de Qualidade");
  const [newEspessura, setNewEspessura] = useState(130);
  const [newCor, setNewCor] = useState("Azul WEG 5009");
  const [newFolga, setNewFolga] = useState(0.18);
  const [newItensRec, setNewItensRec] = useState("Eixo retificado, Rosca dos pés");
  const [newItensTroc, setNewItensTroc] = useState("Rolamentos 6314 C3 novos, Retentores novos");
  const [newParecer, setNewParecer] = useState("Equipamento revisado, montado e aprovado no checklist final.");

  const handleAddInspecao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOs.trim() || !newCliente.trim()) return;

    const itensRecArray = newItensRec.split(",").map((s) => s.trim()).filter(Boolean);
    const itensTrocArray = newItensTroc.split(",").map((s) => s.trim()).filter(Boolean);

    const item: InspecaoFinal = {
      id: String(Date.now()),
      os: newOs.trim(),
      cliente: newCliente.trim(),
      motor: newMotor.trim() || "Motor Trifásico",
      potencia: newPotencia,
      data: new Date().toLocaleDateString("pt-BR"),
      inspetor: newInspetor,
      status: "Liberado p/ Expedição",
      espessuraPinturaMicrons: Number(newEspessura),
      corPintura: newCor,
      acabamentoGeral: "Excelente",
      giroLivre: true,
      folgaAxialMm: Number(newFolga),
      itensRecuperados: itensRecArray,
      itensTrocados: itensTrocArray,
      checklist: [
        ...itensRecArray.map((r) => ({ descricao: `Recuperação: ${r}`, tipo: "recuperado" as const, status: "Conforme" as const })),
        ...itensTrocArray.map((t) => ({ descricao: `Substituição: ${t}`, tipo: "trocado" as const, status: "Conforme" as const })),
        { descricao: `Pintura final: ${newCor} (${newEspessura} µm)`, tipo: "pintura", status: "Conforme" },
        { descricao: "Giro livre e folga axial conferida", tipo: "mecanica", status: "Conforme" },
        { descricao: "Plaqueta de identificação e identificação de giro", tipo: "identificacao", status: "Conforme" },
      ],
      parecerExpedicao: newParecer,
    };

    setInspecoes([item, ...inspecoes]);
    setSelectedInspecao(item);
    setIsModalOpen(false);
    setNewOs("");
    setNewCliente("");
  };

  const filtered = inspecoes.filter(
    (i) =>
      i.os.toLowerCase().includes(search.toLowerCase()) ||
      i.cliente.toLowerCase().includes(search.toLowerCase()) ||
      i.motor.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-full w-full flex-col bg-bg text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between border-b border-border bg-surface/90 px-5 py-3.5 backdrop-blur-md gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-accent-green/15 text-accent-green shadow-sm">
            <ClipboardCheck className="size-4.5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Inspeção de Qualidade</h1>
            <p className="text-[11px] text-muted-foreground">
              Checklist final pós-manutenção · Itens recuperados, trocados, pintura e acabamento
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
            <Plus className="size-3.5" /> Novo Checklist Final
          </Button>
        </div>
      </header>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 pb-2">
        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Inspeções Totais</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">{inspecoes.length}</span>
            <span className="text-xs text-muted-foreground">motores</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Liberados p/ Expedição</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-green">
              {inspecoes.filter((i) => i.status === "Liberado p/ Expedição").length}
            </span>
            <span className="text-xs text-muted-foreground">100% conformes</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Retrabalhos Pendentes</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-amber">
              {inspecoes.filter((i) => i.status === "Retrabalho Pendente").length}
            </span>
            <span className="text-xs text-muted-foreground">ajustes</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Itens Inspecionados</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">
              {inspecoes.reduce((acc, curr) => acc + curr.checklist.length, 0)}
            </span>
            <span className="text-xs text-muted-foreground">pontos auditados</span>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="flex flex-1 gap-5 overflow-hidden p-5 pt-3">
        {/* Left: Lista de Inspeções */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-surface">
          <div className="border-b border-border/80 bg-surface-2/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
            Equipamentos Inspecionados Pós-Manutenção
          </div>
          <div className="divide-y divide-border/60">
            {filtered.map((item) => {
              const isSelected = selectedInspecao?.id === item.id;
              const isLiberado = item.status === "Liberado p/ Expedição";
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedInspecao(item)}
                  className={`flex items-center justify-between p-4 transition-colors cursor-pointer hover:bg-surface-2/50 ${
                    isSelected ? "bg-surface-2 border-l-4 border-l-accent-green" : ""
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-foreground">OS {item.os}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                          isLiberado
                            ? "bg-accent-green/15 text-accent-green border-accent-green/30"
                            : "bg-accent-amber/15 text-accent-amber border-accent-amber/30"
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs text-muted-foreground">· {item.cliente}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.motor} · <span className="font-medium text-foreground">{item.potencia}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <RefreshCw className="size-3 text-accent-indigo" />
                        <span>Recuperados: <strong className="text-foreground">{item.itensRecuperados.length}</strong></span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Wrench className="size-3 text-primary" />
                        <span>Trocados: <strong className="text-foreground">{item.itensTrocados.length}</strong></span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Paintbrush className="size-3 text-accent-amber" />
                        <span>Pintura: <strong className="text-foreground">{item.espessuraPinturaMicrons} µm</strong></span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground">{item.data}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detalhe do Checklist Final */}
        <div className="hidden lg:flex w-[460px] flex-col rounded-2xl border border-border bg-surface p-5 overflow-y-auto">
          {selectedInspecao ? (
            <div className="flex flex-col gap-4">
              <div className="border-b border-border pb-3 flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-semibold text-accent-green">Laudo de Inspeção Final</span>
                  <h2 className="text-lg font-bold text-foreground">OS {selectedInspecao.os}</h2>
                  <p className="text-xs text-muted-foreground">{selectedInspecao.cliente} · {selectedInspecao.motor}</p>
                </div>
                <div
                  className={`flex size-9 items-center justify-center rounded-xl border ${
                    selectedInspecao.status === "Liberado p/ Expedição"
                      ? "border-accent-green/30 bg-accent-green/10 text-accent-green"
                      : "border-accent-amber/30 bg-accent-amber/10 text-accent-amber"
                  }`}
                >
                  {selectedInspecao.status === "Liberado p/ Expedição" ? (
                    <PackageCheck className="size-5" />
                  ) : (
                    <AlertTriangle className="size-5" />
                  )}
                </div>
              </div>

              {/* Seção 1: Itens Recuperados */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <div className="flex items-center gap-1.5 font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  <RefreshCw className="size-3.5 text-accent-indigo" />
                  <span>Itens Recuperados / Usinados ({selectedInspecao.itensRecuperados.length})</span>
                </div>
                <ul className="space-y-1">
                  {selectedInspecao.itensRecuperados.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-foreground">
                      <CheckCircle2 className="size-3.5 text-accent-indigo shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Seção 2: Itens Trocados / Novos */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <div className="flex items-center gap-1.5 font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  <Wrench className="size-3.5 text-primary" />
                  <span>Itens Trocados / Novos ({selectedInspecao.itensTrocados.length})</span>
                </div>
                <ul className="space-y-1">
                  {selectedInspecao.itensTrocados.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-foreground">
                      <CheckCircle2 className="size-3.5 text-accent-green shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Seção 3: Pintura e Acabamento */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <div className="flex items-center gap-1.5 font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  <Paintbrush className="size-3.5 text-accent-amber" />
                  <span>Pintura e Proteção Superficial</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-foreground">
                  <div className="rounded border border-border bg-surface p-2">
                    <span className="text-[10px] text-muted-foreground block">Padrão / Cor:</span>
                    <span className="font-medium text-xs">{selectedInspecao.corPintura}</span>
                  </div>
                  <div className="rounded border border-border bg-surface p-2">
                    <span className="text-[10px] text-muted-foreground block">Espessura Película:</span>
                    <span className="font-bold text-xs font-mono text-accent-green">
                      {selectedInspecao.espessuraPinturaMicrons} µm
                    </span>
                  </div>
                </div>
              </div>

              {/* Seção 4: Mecânica e Montagem */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  Checklist Mecânico Final
                </span>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Giro livre do rotor:</span>
                  <span className="font-semibold text-accent-green flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Conforme (sem atrito)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Folga Axial:</span>
                  <span className="font-mono font-bold text-foreground">{selectedInspecao.folgaAxialMm} mm</span>
                </div>
              </div>

              {/* Parecer de Expedição */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-1.5">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  Parecer Final de Liberação
                </span>
                <p className="text-foreground leading-relaxed">{selectedInspecao.parecerExpedicao}</p>
                <div className="mt-2 pt-2 border-t border-border/60 flex justify-between text-[11px] text-muted-foreground">
                  <span>Inspetor: <strong className="text-foreground">{selectedInspecao.inspetor}</strong></span>
                  <span>Data: <strong className="text-foreground">{selectedInspecao.data}</strong></span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal Novo Checklist Final */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-surface shadow-mac-3">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Novo Checklist Final Pós-Manutenção</h3>
                <p className="text-[12px] text-muted-foreground">Inspeção de itens recuperados, trocados e acabamento</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddInspecao} className="flex flex-col gap-4 overflow-y-auto p-5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Número da OS</label>
                  <Input placeholder="Ex: 146150" value={newOs} onChange={(e) => setNewOs(e.target.value)} required />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Cliente</label>
                  <Input placeholder="Ex: Vale S.A." value={newCliente} onChange={(e) => setNewCliente(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Modelo do Motor</label>
                  <Input placeholder="Ex: WEG W22 200cv" value={newMotor} onChange={(e) => setNewMotor(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Potência</label>
                  <Input placeholder="200 cv" value={newPotencia} onChange={(e) => setNewPotencia(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Itens Recuperados / Usinados (separados por vírgula)
                </label>
                <Input
                  placeholder="Ex: Eixo metalizado e retificado, Alojamento da tampa dianteira usinado"
                  value={newItensRec}
                  onChange={(e) => setNewItensRec(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Itens Trocados / Novos (separados por vírgula)
                </label>
                <Input
                  placeholder="Ex: Rolamento 6318 C3 novo, Retentores Viton, Placa de bornes"
                  value={newItensTroc}
                  onChange={(e) => setNewItensTroc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Cor / Padrão</label>
                  <Input value={newCor} onChange={(e) => setNewCor(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Espessura Tinta (µm)</label>
                  <Input type="number" value={newEspessura} onChange={(e) => setNewEspessura(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Folga Axial (mm)</label>
                  <Input type="number" step="0.01" value={newFolga} onChange={(e) => setNewFolga(Number(e.target.value))} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Parecer de Expedição</label>
                <Input value={newParecer} onChange={(e) => setNewParecer(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-2">
                <Button variant="neutral" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Salvar Checklist Final
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
