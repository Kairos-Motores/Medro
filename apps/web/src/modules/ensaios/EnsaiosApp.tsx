import React, { useState } from "react";
import { Gauge, Search, Plus, CheckCircle2, AlertTriangle, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EnsaioItem {
  id: string;
  os: string;
  cliente: string;
  motor: string;
  potencia: string;
  tensao: string;
  data: string;
  inspetor: string;
  status: "Aprovado" | "Em Análise" | "Reprovado";
  resOhmica: { rs: number; st: number; tr: number; desbalanceamentoPct: number };
  isolamento: { valorGigaOhm: number; indicePolarizacao: number; tensaoTesteKV: number };
  surgeTest: "Conforme" | "Não Conforme";
  hiPot: { tensaoKV: number; fugaMA: number; resultado: "Aprovado" | "Reprovado" };
  vibracaoMmS: number;
  observacao: string;
}

const INITIAL_ENSAIOS: EnsaioItem[] = [
  {
    id: "1",
    os: "145920",
    cliente: "Vale S.A.",
    motor: "WEG W22 250cv",
    potencia: "250 cv / 185 kW",
    tensao: "440 V",
    data: "02/09/2026",
    inspetor: "Carlos Eduardo (Eng. Ensaios)",
    status: "Aprovado",
    resOhmica: { rs: 0.042, st: 0.042, tr: 0.041, desbalanceamentoPct: 0.8 },
    isolamento: { valorGigaOhm: 125.4, indicePolarizacao: 3.2, tensaoTesteKV: 2.5 },
    surgeTest: "Conforme",
    hiPot: { tensaoKV: 1.88, fugaMA: 0.45, resultado: "Aprovado" },
    vibracaoMmS: 0.85,
    observacao: "Motor aprovado para entrega com todos os testes estáticos e dinâmicos dentro das normas ABNT NBR e IEC.",
  },
  {
    id: "2",
    os: "145935",
    cliente: "Alunorte",
    motor: "WEG W22 150cv",
    potencia: "150 cv / 110 kW",
    tensao: "380 V",
    data: "01/09/2026",
    inspetor: "Marcos Vinicius",
    status: "Em Análise",
    resOhmica: { rs: 0.088, st: 0.092, tr: 0.089, desbalanceamentoPct: 2.4 },
    isolamento: { valorGigaOhm: 18.2, indicePolarizacao: 1.9, tensaoTesteKV: 1.0 },
    surgeTest: "Conforme",
    hiPot: { tensaoKV: 1.76, fugaMA: 1.2, resultado: "Aprovado" },
    vibracaoMmS: 1.4,
    observacao: "Índice de polarização limítrofe (1.9). Recomendado reaquecimento em estufa antes do teste final a vazio.",
  },
  {
    id: "3",
    os: "145980",
    cliente: "Hydro Albras",
    motor: "WEG HGF 315cv (AT)",
    potencia: "315 cv / 230 kW",
    tensao: "4160 V",
    data: "02/09/2026",
    inspetor: "Carlos Eduardo (Eng. Ensaios)",
    status: "Aprovado",
    resOhmica: { rs: 0.285, st: 0.286, tr: 0.284, desbalanceamentoPct: 0.5 },
    isolamento: { valorGigaOhm: 850.0, indicePolarizacao: 4.1, tensaoTesteKV: 5.0 },
    surgeTest: "Conforme",
    hiPot: { tensaoKV: 9.32, fugaMA: 0.8, resultado: "Aprovado" },
    vibracaoMmS: 0.65,
    observacao: "Ensaio de alta tensão 4.16kV excelente. Níveis de vibração nos mancais dianteiro e traseiro abaixo de 0.7 mm/s.",
  },
];

export function EnsaiosApp() {
  const [ensaios, setEnsaios] = useState<EnsaioItem[]>(INITIAL_ENSAIOS);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<EnsaioItem | null>(ensaios[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newOs, setNewOs] = useState("");
  const [newCliente, setNewCliente] = useState("");
  const [newMotor, setNewMotor] = useState("");
  const [newPotencia, setNewPotencia] = useState("100 cv");
  const [newTensao, setNewTensao] = useState("440 V");
  const [newInspetor, setNewInspetor] = useState("Inspetor Técnico");
  const [newResRS, setNewResRS] = useState(0.05);
  const [newResST, setNewResST] = useState(0.05);
  const [newResTR, setNewResTR] = useState(0.05);
  const [newIsolGiga, setNewIsolGiga] = useState(85.0);
  const [newIP, setNewIP] = useState(3.0);
  const [newVib, setNewVib] = useState(0.9);
  const [newObs, setNewObs] = useState("Motor em conformidade com critérios técnicos de ensaios.");

  const handleAddEnsaio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOs.trim() || !newCliente.trim()) return;

    const maxRes = Math.max(newResRS, newResST, newResTR);
    const minRes = Math.min(newResRS, newResST, newResTR);
    const avg = (newResRS + newResST + newResTR) / 3;
    const desbalanceamento = avg > 0 ? Number((((maxRes - minRes) / avg) * 100).toFixed(1)) : 0;

    const item: EnsaioItem = {
      id: String(Date.now()),
      os: newOs.trim(),
      cliente: newCliente.trim(),
      motor: newMotor.trim() || "Motor Trifásico",
      potencia: newPotencia,
      tensao: newTensao,
      data: new Date().toLocaleDateString("pt-BR"),
      inspetor: newInspetor,
      status: desbalanceamento < 2 && newIP >= 2.0 ? "Aprovado" : "Em Análise",
      resOhmica: {
        rs: newResRS,
        st: newResST,
        tr: newResTR,
        desbalanceamentoPct: desbalanceamento,
      },
      isolamento: {
        valorGigaOhm: newIsolGiga,
        indicePolarizacao: newIP,
        tensaoTesteKV: 2.5,
      },
      surgeTest: "Conforme",
      hiPot: {
        tensaoKV: 2.0,
        fugaMA: 0.5,
        resultado: "Aprovado",
      },
      vibracaoMmS: newVib,
      observacao: newObs,
    };

    setEnsaios([item, ...ensaios]);
    setSelectedItem(item);
    setIsModalOpen(false);
    setNewOs("");
    setNewCliente("");
  };

  const filtered = ensaios.filter(
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
          <div className="flex size-8 items-center justify-center rounded-xl bg-accent-cyan/15 text-accent-cyan shadow-sm">
            <Gauge className="size-4.5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Ensaios Elétricos</h1>
            <p className="text-[11px] text-muted-foreground">
              Resistência ôhmica, ensaios de isolamento, Surge Test, Hi-Pot e vibração
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar OS, cliente ou inspetor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="h-8 gap-1.5 text-xs">
            <Plus className="size-3.5" /> Novo Ensaio
          </Button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 pb-2">
        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Ensaios Realizados</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">{ensaios.length}</span>
            <span className="text-xs text-muted-foreground">laudos</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">100% Conformes</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-green">
              {ensaios.filter((i) => i.status === "Aprovado").length}
            </span>
            <span className="text-xs text-muted-foreground">liberados</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Em Análise / Re-teste</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-amber">
              {ensaios.filter((i) => i.status === "Em Análise").length}
            </span>
            <span className="text-xs text-muted-foreground">ajustes</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Índice de Aprovação</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">
              {ensaios.length > 0
                ? Math.round((ensaios.filter((i) => i.status === "Aprovado").length / ensaios.length) * 100)
                : 100}
              %
            </span>
            <span className="text-xs text-muted-foreground">qualidade</span>
          </div>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex flex-1 gap-5 overflow-hidden p-5 pt-3">
        {/* Left: Lista de Ensaios */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-surface">
          <div className="border-b border-border/80 bg-surface-2/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
            Laudos de Ensaios Recentes
          </div>
          <div className="divide-y divide-border/60">
            {filtered.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              const isAprovado = item.status === "Aprovado";
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`flex items-center justify-between p-4 transition-colors cursor-pointer hover:bg-surface-2/50 ${
                    isSelected ? "bg-surface-2 border-l-4 border-l-accent-cyan" : ""
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
                        {item.status}
                      </span>
                      <span className="text-xs text-muted-foreground">· {item.cliente}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.motor} · <span className="font-medium text-foreground">{item.potencia}</span> · {item.tensao}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>Desbalanceamento: <strong className="text-foreground">{item.resOhmica.desbalanceamentoPct}%</strong></span>
                      <span>·</span>
                      <span>Isolamento: <strong className="text-foreground">{item.isolamento.valorGigaOhm} GΩ</strong></span>
                      <span>·</span>
                      <span>IP: <strong className="text-foreground">{item.isolamento.indicePolarizacao}</strong></span>
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

        {/* Right: Detalhe do Laudo de Ensaio */}
        <div className="hidden lg:flex w-[420px] flex-col rounded-2xl border border-border bg-surface p-5 overflow-y-auto">
          {selectedItem ? (
            <div className="flex flex-col gap-4">
              <div className="border-b border-border pb-3 flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-semibold text-accent-cyan">Relatório de Ensaio Elétrico</span>
                  <h2 className="text-lg font-bold text-foreground">OS {selectedItem.os}</h2>
                  <p className="text-xs text-muted-foreground">{selectedItem.cliente} · {selectedItem.motor}</p>
                </div>
                <div
                  className={`flex size-9 items-center justify-center rounded-xl border ${
                    selectedItem.status === "Aprovado"
                      ? "border-accent-green/30 bg-accent-green/10 text-accent-green"
                      : "border-accent-amber/30 bg-accent-amber/10 text-accent-amber"
                  }`}
                >
                  {selectedItem.status === "Aprovado" ? <ShieldCheck className="size-5" /> : <AlertTriangle className="size-5" />}
                </div>
              </div>

              {/* 1. Resistência Ôhmica */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                    1. Resistência Ôhmica (mΩ)
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      selectedItem.resOhmica.desbalanceamentoPct <= 2.0
                        ? "bg-accent-green/15 text-accent-green"
                        : "bg-accent-amber/15 text-accent-amber"
                    }`}
                  >
                    Desb: {selectedItem.resOhmica.desbalanceamentoPct}% (Max: 2%)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-center">
                  <div className="rounded border border-border bg-surface p-1.5">
                    <span className="text-[10px] text-muted-foreground block">R - S</span>
                    <span className="font-bold text-foreground">{selectedItem.resOhmica.rs} Ω</span>
                  </div>
                  <div className="rounded border border-border bg-surface p-1.5">
                    <span className="text-[10px] text-muted-foreground block">S - T</span>
                    <span className="font-bold text-foreground">{selectedItem.resOhmica.st} Ω</span>
                  </div>
                  <div className="rounded border border-border bg-surface p-1.5">
                    <span className="text-[10px] text-muted-foreground block">T - R</span>
                    <span className="font-bold text-foreground">{selectedItem.resOhmica.tr} Ω</span>
                  </div>
                </div>
              </div>

              {/* 2. Isolamento e Surge Test */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  2. Isolamento & Surge Test
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded border border-border bg-surface p-2">
                    <span className="text-[10px] text-muted-foreground block">Megômetro (2.5kV):</span>
                    <span className="font-mono text-sm font-bold text-accent-green">{selectedItem.isolamento.valorGigaOhm} GΩ</span>
                  </div>
                  <div className="rounded border border-border bg-surface p-2">
                    <span className="text-[10px] text-muted-foreground block">Índice Polarização (IP):</span>
                    <span className="font-mono text-sm font-bold text-foreground">{selectedItem.isolamento.indicePolarizacao}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground">Surge Test (Surto):</span>
                  <span className="font-semibold text-accent-green flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> {selectedItem.surgeTest}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hi-Pot ({selectedItem.hiPot.tensaoKV} kV):</span>
                  <span className="font-mono font-medium text-foreground">
                    Fuga: {selectedItem.hiPot.fugaMA} mA ({selectedItem.hiPot.resultado})
                  </span>
                </div>
              </div>

              {/* 3. Vibração e Parecer */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  3. Ensaio a Vazio & Parecer
                </span>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Vibração Global (RMS):</span>
                  <span className="font-mono font-bold text-foreground">{selectedItem.vibracaoMmS} mm/s (Grau A)</span>
                </div>
                <div className="mt-1 rounded border border-border/60 bg-surface p-2.5 text-muted-foreground">
                  <strong className="text-foreground block mb-0.5">Parecer Técnico:</strong>
                  {selectedItem.observacao}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground flex justify-between">
                  <span>Inspetor: <strong className="text-foreground">{selectedItem.inspetor}</strong></span>
                  <span>Data: <strong className="text-foreground">{selectedItem.data}</strong></span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal Novo Ensaio */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-surface shadow-mac-3">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Novo Ensaio Elétrico</h3>
                <p className="text-[12px] text-muted-foreground">Registro de medições elétricas e isolamento</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddEnsaio} className="flex flex-col gap-4 overflow-y-auto p-5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Número da OS</label>
                  <Input placeholder="Ex: 146120" value={newOs} onChange={(e) => setNewOs(e.target.value)} required />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Cliente</label>
                  <Input placeholder="Ex: Vale S.A." value={newCliente} onChange={(e) => setNewCliente(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Modelo do Motor</label>
                <Input placeholder="Ex: WEG W22 150cv" value={newMotor} onChange={(e) => setNewMotor(e.target.value)} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Resist. R-S (Ω)</label>
                  <Input type="number" step="0.001" value={newResRS} onChange={(e) => setNewResRS(parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Resist. S-T (Ω)</label>
                  <Input type="number" step="0.001" value={newResST} onChange={(e) => setNewResST(parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Resist. T-R (Ω)</label>
                  <Input type="number" step="0.001" value={newResTR} onChange={(e) => setNewResTR(parseFloat(e.target.value) || 0)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Isolamento (GΩ)</label>
                  <Input type="number" step="0.1" value={newIsolGiga} onChange={(e) => setNewIsolGiga(parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Índice Pol. (IP)</label>
                  <Input type="number" step="0.1" value={newIP} onChange={(e) => setNewIP(parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Vibração (mm/s)</label>
                  <Input type="number" step="0.05" value={newVib} onChange={(e) => setNewVib(parseFloat(e.target.value) || 0)} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Parecer Técnico</label>
                <Input value={newObs} onChange={(e) => setNewObs(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-2">
                <Button variant="neutral" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Salvar Ensaio
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
