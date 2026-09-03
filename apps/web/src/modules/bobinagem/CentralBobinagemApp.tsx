import React, { useState } from "react";
import { RotateCw, Search, Plus, CheckCircle2, Flame, Wrench, ShieldAlert, FileText, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FichaBobinagem {
  id: string;
  os: string;
  cliente: string;
  motor: string;
  potencia: string;
  tensao: string;
  polos: number;
  ranhuras: number;
  espirasPorRanhura: number;
  passo: string;
  fiosPorEspiras: string;
  ligacao: string;
  pesoCobreKg: number;
  etapa: "Desmanche" | "Isolamento" | "Bobinagem" | "Inserção" | "Amarração" | "Estufa";
  progresso: number;
}

const INITIAL_FICHAS: FichaBobinagem[] = [
  {
    id: "1",
    os: "145920",
    cliente: "Vale S.A.",
    motor: "WEG W22 250cv",
    potencia: "250 cv / 185 kW",
    tensao: "440 / 760 V",
    polos: 4,
    ranhuras: 72,
    espirasPorRanhura: 14,
    passo: "1:10 - 1:12",
    fiosPorEspiras: "2x 15 AWG + 1x 16 AWG",
    ligacao: "Dupla Estrela Paralelo (YY)",
    pesoCobreKg: 68.5,
    etapa: "Inserção",
    progresso: 65,
  },
  {
    id: "2",
    os: "145935",
    cliente: "Alunorte",
    motor: "WEG W22 150cv",
    potencia: "150 cv / 110 kW",
    tensao: "380 / 660 V",
    polos: 2,
    ranhuras: 48,
    espirasPorRanhura: 18,
    passo: "1:12 - 1:14",
    fiosPorEspiras: "3x 17 AWG",
    ligacao: "Estrela Série (Y)",
    pesoCobreKg: 42.0,
    etapa: "Bobinagem",
    progresso: 40,
  },
  {
    id: "3",
    os: "145980",
    cliente: "Hydro Albras",
    motor: "WEG HGF 315cv (AT)",
    potencia: "315 cv / 230 kW",
    tensao: "4160 V",
    polos: 6,
    ranhuras: 90,
    espirasPorRanhura: 26,
    passo: "1:8 - 1:10",
    fiosPorEspiras: "Fio Chato Perfilado 4.5x2.0mm",
    ligacao: "Estrela Série Classe H",
    pesoCobreKg: 115.0,
    etapa: "Estufa",
    progresso: 90,
  },
  {
    id: "4",
    os: "146010",
    cliente: "Suzano Celulose",
    motor: "WEG W21 50cv",
    potencia: "50 cv / 37 kW",
    tensao: "220 / 380 / 440 V",
    polos: 4,
    ranhuras: 48,
    espirasPorRanhura: 22,
    passo: "1:10",
    fiosPorEspiras: "2x 18 AWG",
    ligacao: "Triângulo (Δ)",
    pesoCobreKg: 24.5,
    etapa: "Isolamento",
    progresso: 25,
  },
];

export function CentralBobinagemApp() {
  const [fichas, setFichas] = useState<FichaBobinagem[]>(INITIAL_FICHAS);
  const [search, setSearch] = useState("");
  const [selectedFicha, setSelectedFicha] = useState<FichaBobinagem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new sheet
  const [newOs, setNewOs] = useState("");
  const [newCliente, setNewCliente] = useState("");
  const [newMotor, setNewMotor] = useState("");
  const [newPotencia, setNewPotencia] = useState("");
  const [newTensao, setNewTensao] = useState("380 / 660 V");
  const [newPolos, setNewPolos] = useState(4);
  const [newRanhuras, setNewRanhuras] = useState(72);
  const [newEspiras, setNewEspiras] = useState(16);
  const [newPasso, setNewPasso] = useState("1:10 - 1:12");
  const [newFios, setNewFios] = useState("2x 16 AWG");
  const [newLigacao, setNewLigacao] = useState("Estrela (Y)");
  const [newPeso, setNewPeso] = useState(35);

  const handleAddFicha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOs.trim() || !newCliente.trim()) return;

    const item: FichaBobinagem = {
      id: String(Date.now()),
      os: newOs.trim(),
      cliente: newCliente.trim(),
      motor: newMotor.trim() || "Motor Elétrico Trifásico",
      potencia: newPotencia.trim() || "75 cv",
      tensao: newTensao,
      polos: Number(newPolos),
      ranhuras: Number(newRanhuras),
      espirasPorRanhura: Number(newEspiras),
      passo: newPasso,
      fiosPorEspiras: newFios,
      ligacao: newLigacao,
      pesoCobreKg: Number(newPeso),
      etapa: "Isolamento",
      progresso: 15,
    };

    setFichas([item, ...fichas]);
    setIsModalOpen(false);
    setNewOs("");
    setNewCliente("");
    setNewMotor("");
  };

  const filtered = fichas.filter(
    (f) =>
      f.os.toLowerCase().includes(search.toLowerCase()) ||
      f.cliente.toLowerCase().includes(search.toLowerCase()) ||
      f.motor.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-full w-full flex-col bg-bg text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between border-b border-border bg-surface/90 px-5 py-3.5 backdrop-blur-md gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-accent-amber/15 text-accent-amber shadow-sm">
            <RotateCw className="size-4.5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Central de Bobinagem</h1>
            <p className="text-[11px] text-muted-foreground">
              Fichas de enrolamento, cálculo de espiras e controle de etapas
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
            <Plus className="size-3.5" /> Nova Ficha
          </Button>
        </div>
      </header>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 pb-2">
        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Em Execução</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">{fichas.length}</span>
            <span className="text-xs text-muted-foreground">motores</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Na Inserção</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-amber">
              {fichas.filter((f) => f.etapa === "Inserção" || f.etapa === "Bobinagem").length}
            </span>
            <span className="text-xs text-muted-foreground">bobinagens</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Na Estufa / Cura</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-rose">
              {fichas.filter((f) => f.etapa === "Estufa").length}
            </span>
            <span className="text-xs text-muted-foreground">em impregnação</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Cobre Total (Alocado)</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-indigo">
              {fichas.reduce((acc, curr) => acc + curr.pesoCobreKg, 0).toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">kg fio</span>
          </div>
        </div>
      </div>

      {/* Main Content: Split Master-Detail */}
      <div className="flex flex-1 gap-5 overflow-hidden p-5 pt-3">
        {/* Left: Lista de Fichas */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-surface">
          <div className="border-b border-border/80 bg-surface-2/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
            Ordens de Serviço no Setor de Rebobinamento
          </div>
          <div className="divide-y divide-border/60">
            {filtered.map((f) => {
              const isSelected = selectedFicha?.id === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFicha(f)}
                  className={`flex items-center justify-between p-4 transition-colors cursor-pointer hover:bg-surface-2/50 ${
                    isSelected ? "bg-surface-2 border-l-4 border-l-accent-amber" : ""
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-foreground">OS {f.os}</span>
                      <span className="rounded bg-accent-amber/15 px-2 py-0.5 text-[10px] font-bold text-accent-amber">
                        {f.etapa}
                      </span>
                      <span className="text-xs text-muted-foreground">· {f.cliente}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {f.motor} · <span className="font-medium text-foreground">{f.potencia}</span> · {f.polos} Polos · {f.ranhuras} Ranhuras
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>Passo: <strong className="text-foreground">{f.passo}</strong></span>
                      <span>·</span>
                      <span>Espiras: <strong className="text-foreground">{f.espirasPorRanhura}</strong></span>
                      <span>·</span>
                      <span>Cobre: <strong className="text-foreground">{f.pesoCobreKg} kg</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 text-right">
                      <span className="text-xs font-bold text-foreground">{f.progresso}%</span>
                      <div className="h-1.5 w-full rounded-full bg-surface-2 overflow-hidden mt-1">
                        <div className="h-full rounded-full bg-accent-amber" style={{ width: `${f.progresso}%` }} />
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detalhe Técnico da Ficha Selecionada */}
        <div className="hidden lg:flex w-96 flex-col rounded-2xl border border-border bg-surface p-5 overflow-y-auto">
          {selectedFicha ? (
            <div className="flex flex-col gap-4">
              <div className="border-b border-border pb-3">
                <span className="font-mono text-xs font-semibold text-accent-amber">Ficha Técnica de Enrolamento</span>
                <h2 className="text-lg font-bold text-foreground">OS {selectedFicha.os}</h2>
                <p className="text-xs text-muted-foreground">{selectedFicha.cliente} · {selectedFicha.motor}</p>
              </div>

              {/* Dados Elétricos */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  Parâmetros de Projeto
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Potência:</span>
                    <span className="font-medium text-foreground">{selectedFicha.potencia}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Tensão:</span>
                    <span className="font-medium text-foreground">{selectedFicha.tensao}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Polos:</span>
                    <span className="font-medium text-foreground">{selectedFicha.polos} Polos</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Ranhuras:</span>
                    <span className="font-medium text-foreground">{selectedFicha.ranhuras}</span>
                  </div>
                </div>
              </div>

              {/* Dados de Bobinagem */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  Dados de Bobinagem
                </span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Espiras por Ranhura:</span>
                    <span className="font-mono font-bold text-foreground">{selectedFicha.espirasPorRanhura}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passo do Grupo:</span>
                    <span className="font-mono font-bold text-foreground">{selectedFicha.passo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fios por Espira:</span>
                    <span className="font-mono font-bold text-accent-indigo">{selectedFicha.fiosPorEspiras}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo de Ligação:</span>
                    <span className="font-medium text-foreground">{selectedFicha.ligacao}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Peso Estimado:</span>
                    <span className="font-mono font-bold text-accent-green">{selectedFicha.pesoCobreKg} kg</span>
                  </div>
                </div>
              </div>

              {/* Checklist de Etapas */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  Fluxo de Produção
                </span>
                <div className="space-y-1.5">
                  {[
                    { label: "Desmanche & Queima Controlada", ok: true },
                    { label: "Limpeza & Isolamento Ranhuras (Nomex/Mylar)", ok: true },
                    { label: "Confecção das Bobinas", ok: selectedFicha.progresso >= 40 },
                    { label: "Inserção & Cunha", ok: selectedFicha.progresso >= 65 },
                    { label: "Amarração & Solda dos Terminais", ok: selectedFicha.progresso >= 80 },
                    { label: "Impregnação Verniz & Cura em Estufa", ok: selectedFicha.progresso >= 90 },
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className={`size-2 rounded-full ${
                          step.ok ? "bg-accent-green" : "bg-muted-foreground/30"
                        }`}
                      />
                      <span className={step.ok ? "text-foreground font-medium" : "text-muted-foreground"}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground p-6">
              <FileText className="size-8 opacity-40 mb-2" />
              <p className="text-xs">Selecione uma ordem de serviço ao lado para ver a ficha completa de bobinagem.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nova Ficha */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-surface shadow-mac-3">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Nova Ficha de Bobinagem</h3>
                <p className="text-[12px] text-muted-foreground">Cadastro dos dados de enrolamento do motor</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddFicha} className="flex flex-col gap-4 overflow-y-auto p-5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Número da OS</label>
                  <Input placeholder="Ex: 146050" value={newOs} onChange={(e) => setNewOs(e.target.value)} required />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Cliente</label>
                  <Input placeholder="Ex: Vale S.A." value={newCliente} onChange={(e) => setNewCliente(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Modelo do Motor</label>
                <Input placeholder="Ex: WEG W22 100cv" value={newMotor} onChange={(e) => setNewMotor(e.target.value)} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Potência</label>
                  <Input placeholder="100 cv" value={newPotencia} onChange={(e) => setNewPotencia(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Tensão</label>
                  <Input placeholder="380/660V" value={newTensao} onChange={(e) => setNewTensao(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Polos</label>
                  <Input type="number" value={newPolos} onChange={(e) => setNewPolos(Number(e.target.value))} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Ranhuras</label>
                  <Input type="number" value={newRanhuras} onChange={(e) => setNewRanhuras(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Espiras/Ranh.</label>
                  <Input type="number" value={newEspiras} onChange={(e) => setNewEspiras(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Passo</label>
                  <Input value={newPasso} onChange={(e) => setNewPasso(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Fios / Bitola</label>
                  <Input placeholder="2x 17 AWG" value={newFios} onChange={(e) => setNewFios(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Peso Cobre (kg)</label>
                  <Input type="number" value={newPeso} onChange={(e) => setNewPeso(Number(e.target.value))} />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-2">
                <Button variant="neutral" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Cadastrar Ficha
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
