import React, { useState } from "react";
import { Boxes, Search, Plus, AlertCircle, CheckCircle2, ShoppingCart, ArrowDownRight, ArrowUpRight, Filter, ChevronRight, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProdutoSB2 {
  b2_cod: string;
  descricao: string;
  b2_local: string;
  nomeArmazem: string;
  unidadeMedida: string;
  b2_qatu: number;
  b2_reserva: number;
  b2_dispo: number;
  b2_salped: number;
  b2_estseg: number;
  b2_cm1: number;
  b2_vatu1: number;
  categoria: "Rolamentos" | "Fios e Cabos" | "Vernizes e Químicos" | "Vedações" | "Isolantes";
}

const INITIAL_SB2: ProdutoSB2[] = [
  {
    b2_cod: "ROL-6319-C3",
    descricao: "Rolamento de Esferas 6319 C3 SKF Explorer",
    b2_local: "01",
    nomeArmazem: "01 - Almoxarifado Central",
    unidadeMedida: "PC",
    b2_qatu: 6,
    b2_reserva: 2,
    b2_dispo: 4,
    b2_salped: 4,
    b2_estseg: 4,
    b2_cm1: 1850.0,
    b2_vatu1: 11100.0,
    categoria: "Rolamentos",
  },
  {
    b2_cod: "ROL-6316-C3",
    descricao: "Rolamento de Esferas 6316 C3 SKF",
    b2_local: "01",
    nomeArmazem: "01 - Almoxarifado Central",
    unidadeMedida: "PC",
    b2_qatu: 8,
    b2_reserva: 3,
    b2_dispo: 5,
    b2_salped: 0,
    b2_estseg: 4,
    b2_cm1: 1240.0,
    b2_vatu1: 9920.0,
    categoria: "Rolamentos",
  },
  {
    b2_cod: "FIO-ESM-16AWG",
    descricao: "Fio de Cobre Esmaltado 16 AWG Classe H 200°C",
    b2_local: "02",
    nomeArmazem: "02 - Bobinagem / Fiação",
    unidadeMedida: "KG",
    b2_qatu: 185.0,
    b2_reserva: 68.5,
    b2_dispo: 116.5,
    b2_salped: 100.0,
    b2_estseg: 80.0,
    b2_cm1: 94.5,
    b2_vatu1: 17482.5,
    categoria: "Fios e Cabos",
  },
  {
    b2_cod: "FIO-ESM-17AWG",
    descricao: "Fio de Cobre Esmaltado 17 AWG Classe H 200°C",
    b2_local: "02",
    nomeArmazem: "02 - Bobinagem / Fiação",
    unidadeMedida: "KG",
    b2_qatu: 42.0,
    b2_reserva: 42.0,
    b2_dispo: 0.0,
    b2_salped: 60.0,
    b2_estseg: 50.0,
    b2_cm1: 96.0,
    b2_vatu1: 4032.0,
    categoria: "Fios e Cabos",
  },
  {
    b2_cod: "VRN-LACKTHERM-1331",
    descricao: "Verniz Impregnação WEG Lacktherm 1331 Poliéster",
    b2_local: "02",
    nomeArmazem: "02 - Bobinagem / Fiação",
    unidadeMedida: "LT",
    b2_qatu: 65.0,
    b2_reserva: 15.0,
    b2_dispo: 50.0,
    b2_salped: 0,
    b2_estseg: 30.0,
    b2_cm1: 78.0,
    b2_vatu1: 5070.0,
    categoria: "Vernizes e Químicos",
  },
  {
    b2_cod: "RET-VITON-95X120",
    descricao: "Retentor de Óleo 95x120x12 Viton com Mola",
    b2_local: "01",
    nomeArmazem: "01 - Almoxarifado Central",
    unidadeMedida: "PC",
    b2_qatu: 2,
    b2_reserva: 2,
    b2_dispo: 0,
    b2_salped: 6,
    b2_estseg: 4,
    b2_cm1: 145.0,
    b2_vatu1: 290.0,
    categoria: "Vedações",
  },
  {
    b2_cod: "ISOL-NOMEX-025",
    descricao: "Papel Isolante Nomex DuPont 0.25mm Rolo",
    b2_local: "02",
    nomeArmazem: "02 - Bobinagem / Fiação",
    unidadeMedida: "M2",
    b2_qatu: 45.0,
    b2_reserva: 12.0,
    b2_dispo: 33.0,
    b2_salped: 0,
    b2_estseg: 20.0,
    b2_cm1: 110.0,
    b2_vatu1: 4950.0,
    categoria: "Isolantes",
  },
  {
    b2_cod: "ROL-INSOC-6319",
    descricao: "Rolamento Isolado Cerâmico SKF Insocoat 6319/C3VL0241",
    b2_local: "01",
    nomeArmazem: "01 - Almoxarifado Central",
    unidadeMedida: "PC",
    b2_qatu: 1,
    b2_reserva: 1,
    b2_dispo: 0,
    b2_salped: 2,
    b2_estseg: 2,
    b2_cm1: 6800.0,
    b2_vatu1: 6800.0,
    categoria: "Rolamentos",
  },
];

export function AlmoxarifadoApp() {
  const [produtos, setProdutos] = useState<ProdutoSB2[]>(INITIAL_SB2);
  const [search, setSearch] = useState("");
  const [selectedLocal, setSelectedLocal] = useState("todos");
  const [selectedItem, setSelectedItem] = useState<ProdutoSB2 | null>(produtos[0] || null);
  const [isReservaModalOpen, setIsReservaModalOpen] = useState(false);

  // Reserva form states
  const [reservaOs, setReservaOs] = useState("");
  const [reservaQtd, setReservaQtd] = useState(1);
  const [reservaObs, setReservaObs] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);

  const handleConfirmReserva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !reservaOs.trim() || reservaQtd <= 0) return;

    if (reservaQtd > selectedItem.b2_dispo) {
      alert(`Quantidade solicitada (${reservaQtd}) excede o saldo disponível líquido (${selectedItem.b2_dispo} ${selectedItem.unidadeMedida})!`);
      return;
    }

    const updated = produtos.map((p) => {
      if (p.b2_cod === selectedItem.b2_cod && p.b2_local === selectedItem.b2_local) {
        const novaReserva = p.b2_reserva + reservaQtd;
        const novoDispo = p.b2_qatu - novaReserva;
        return {
          ...p,
          b2_reserva: novaReserva,
          b2_dispo: novoDispo,
        };
      }
      return p;
    });

    setProdutos(updated);
    setSelectedItem((prev) => (prev ? { ...prev, b2_reserva: prev.b2_reserva + reservaQtd, b2_dispo: prev.b2_dispo - reservaQtd } : null));
    setIsReservaModalOpen(false);
    setSuccessAlert(true);
    setTimeout(() => setSuccessAlert(false), 3000);
  };

  const filtered = produtos.filter((p) => {
    const matchSearch =
      p.b2_cod.toLowerCase().includes(search.toLowerCase()) ||
      p.descricao.toLowerCase().includes(search.toLowerCase()) ||
      p.categoria.toLowerCase().includes(search.toLowerCase());
    const matchLocal = selectedLocal === "todos" || p.b2_local === selectedLocal;
    return matchSearch && matchLocal;
  });

  const valorTotalEstoque = produtos.reduce((acc, curr) => acc + curr.b2_vatu1, 0);
  const itensCriticos = produtos.filter((p) => p.b2_dispo <= p.b2_estseg).length;
  const totalReservado = produtos.reduce((acc, curr) => acc + curr.b2_reserva, 0);
  const totalEmCompras = produtos.reduce((acc, curr) => acc + curr.b2_salped, 0);

  return (
    <div className="flex h-full w-full flex-col bg-bg text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between border-b border-border bg-surface/90 px-5 py-3.5 backdrop-blur-md gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-accent-amber/15 text-accent-amber shadow-sm">
            <Boxes className="size-4.5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Almoxarifado & Estoque (SB2)</h1>
            <p className="text-[11px] text-muted-foreground">
              Gestão físico-financeira integrada ao TOTVS Protheus · Saldos, reservas para OS e ressuprimento
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Local Filter */}
          <select
            value={selectedLocal}
            onChange={(e) => setSelectedLocal(e.target.value)}
            className="h-8 rounded-lg border border-border bg-surface px-2.5 text-xs text-foreground focus:outline-none"
          >
            <option value="todos">Todos Armazéns</option>
            <option value="01">01 - Almoxarifado Central</option>
            <option value="02">02 - Bobinagem / Fiação</option>
          </select>

          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar código SB2, descrição ou tipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsReservaModalOpen(true)}
            className="h-8 gap-1.5 text-xs"
            disabled={!selectedItem || selectedItem.b2_dispo <= 0}
          >
            <Plus className="size-3.5" /> Reservar p/ OS
          </Button>
        </div>
      </header>

      {/* Success alert banner */}
      {successAlert && (
        <div className="bg-accent-green/15 text-accent-green border-b border-accent-green/30 px-5 py-2 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4" />
          Reserva de material realizada com sucesso para a Ordem de Serviço! Atualizado no saldo SB2.
        </div>
      )}

      {/* KPI Cards do SB2 */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 pb-2">
        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Valor Total Estoque (B2_VATU1)</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-accent-amber">
              R$ {(valorTotalEstoque / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-muted-foreground">físico/financeiro</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Abaixo do Ponto Pedido</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-xl font-bold ${itensCriticos > 0 ? "text-accent-rose" : "text-accent-green"}`}>
              {itensCriticos} itens
            </span>
            <span className="text-xs text-muted-foreground">reposição urgente</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Reservado p/ Manutenção (B2_RESERVA)</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-indigo">{totalReservado}</span>
            <span className="text-xs text-muted-foreground">itens empenhados</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Pedidos em Trânsito (B2_SALPED)</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent-green">{totalEmCompras}</span>
            <span className="text-xs text-muted-foreground">a caminho</span>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="flex flex-1 gap-5 overflow-hidden p-5 pt-3">
        {/* Left: Tabela SB2 do Protheus */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-surface">
          <div className="border-b border-border/80 bg-surface-2/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground flex justify-between items-center">
            <span>Catálogo de Saldos Físico e Financeiro (Protheus SB2010)</span>
            <span className="text-[11px] font-mono font-medium">{filtered.length} itens cadastrados</span>
          </div>

          <div className="divide-y divide-border/60">
            {filtered.map((item) => {
              const isSelected = selectedItem?.b2_cod === item.b2_cod && selectedItem?.b2_local === item.b2_local;
              const isCritico = item.b2_dispo <= item.b2_estseg;

              return (
                <div
                  key={`${item.b2_cod}-${item.b2_local}`}
                  onClick={() => setSelectedItem(item)}
                  className={`flex items-center justify-between p-3.5 transition-colors cursor-pointer hover:bg-surface-2/50 ${
                    isSelected ? "bg-surface-2 border-l-4 border-l-accent-amber" : ""
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground bg-surface-2 px-1.5 py-0.5 rounded border border-border">
                        {item.b2_cod}
                      </span>
                      <span className="font-semibold text-xs text-foreground">{item.descricao}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>Armazém: <strong className="text-foreground">{item.nomeArmazem}</strong></span>
                      <span>·</span>
                      <span>Categoria: <strong className="text-foreground">{item.categoria}</strong></span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px]">
                      <span className="text-muted-foreground">
                        Físico: <strong className="font-mono text-foreground">{item.b2_qatu} {item.unidadeMedida}</strong>
                      </span>
                      <span>·</span>
                      <span className="text-muted-foreground">
                        Reservado: <strong className="font-mono text-accent-indigo">{item.b2_reserva} {item.unidadeMedida}</strong>
                      </span>
                      <span>·</span>
                      <span className="text-muted-foreground">
                        Disponível:{" "}
                        <strong className={`font-mono font-bold ${item.b2_dispo > 0 ? "text-accent-green" : "text-accent-rose"}`}>
                          {item.b2_dispo} {item.unidadeMedida}
                        </strong>
                      </span>
                      {item.b2_salped > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-muted-foreground">
                            Em Pedido: <strong className="font-mono text-accent-amber">+{item.b2_salped}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold font-mono text-foreground">
                      R$ {item.b2_vatu1.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${
                        isCritico
                          ? "bg-accent-rose/15 text-accent-rose border-accent-rose/30"
                          : "bg-accent-green/15 text-accent-green border-accent-green/30"
                      }`}
                    >
                      {isCritico ? "Estoque Crítico" : "Saldo Normal"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detalhe do Produto SB2 */}
        <div className="hidden lg:flex w-[440px] flex-col rounded-2xl border border-border bg-surface p-5 overflow-y-auto">
          {selectedItem ? (
            <div className="flex flex-col gap-4">
              <div className="border-b border-border pb-3 flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-semibold text-accent-amber">Ficha de Estoque SB2</span>
                  <h2 className="text-base font-bold text-foreground">{selectedItem.descricao}</h2>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">Código Protheus: {selectedItem.b2_cod}</p>
                </div>
                <div className="flex size-9 items-center justify-center rounded-xl bg-accent-amber/15 text-accent-amber">
                  <Package className="size-5" />
                </div>
              </div>

              {/* Bloco Saldos Físicos */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  Composição do Saldo Físico ({selectedItem.unidadeMedida})
                </span>
                <div className="grid grid-cols-3 gap-2 font-mono text-center">
                  <div className="rounded border border-border bg-surface p-2">
                    <span className="text-[10px] text-muted-foreground block">Atual Físico (B2_QATU)</span>
                    <span className="text-sm font-bold text-foreground">{selectedItem.b2_qatu}</span>
                  </div>
                  <div className="rounded border border-border bg-surface p-2">
                    <span className="text-[10px] text-muted-foreground block">Reservado (B2_RESERVA)</span>
                    <span className="text-sm font-bold text-accent-indigo">{selectedItem.b2_reserva}</span>
                  </div>
                  <div className="rounded border border-border bg-surface p-2">
                    <span className="text-[10px] text-muted-foreground block">Disponível (B2_DISPO)</span>
                    <span className={`text-sm font-bold ${selectedItem.b2_dispo > 0 ? "text-accent-green" : "text-accent-rose"}`}>
                      {selectedItem.b2_dispo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloco Financeiro e Ressuprimento */}
              <div className="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs flex flex-col gap-2">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                  Valoração e Ponto de Ressuprimento
                </span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Custo Médio Unitário (B2_CM1):</span>
                    <span className="font-mono font-bold text-foreground">
                      R$ {selectedItem.b2_cm1.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor Total em Estoque (B2_VATU1):</span>
                    <span className="font-mono font-bold text-accent-amber">
                      R$ {selectedItem.b2_vatu1.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estoque de Segurança (B2_ESTSEG):</span>
                    <span className="font-mono font-medium text-foreground">
                      {selectedItem.b2_estseg} {selectedItem.unidadeMedida}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saldo em Pedido de Compras (B2_SALPED):</span>
                    <span className="font-mono font-bold text-accent-green">
                      {selectedItem.b2_salped} {selectedItem.unidadeMedida}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de Ação Rápida */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  block
                  onClick={() => setIsReservaModalOpen(true)}
                  disabled={selectedItem.b2_dispo <= 0}
                  className="gap-1.5"
                >
                  <Plus className="size-4" /> Reservar este Item para Ordem de Serviço
                </Button>
                {selectedItem.b2_dispo <= 0 && (
                  <span className="text-[11px] text-accent-rose mt-1 block text-center">
                    Saldo disponível zerado. Aguarde o recebimento de compras.
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal Reservar Material para OS */}
      {isReservaModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl border border-border bg-surface shadow-mac-3">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Reservar Peça para OS</h3>
                <p className="text-[12px] text-muted-foreground">Empenho de estoque via tabela SB2</p>
              </div>
              <button
                onClick={() => setIsReservaModalOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReserva} className="flex flex-col gap-4 overflow-y-auto p-5 text-xs">
              <div className="rounded-xl border border-border bg-surface-2/60 p-3 flex flex-col gap-1">
                <span className="font-mono text-[10px] text-muted-foreground">{selectedItem.b2_cod}</span>
                <span className="font-semibold text-foreground text-xs">{selectedItem.descricao}</span>
                <span className="text-[11px] text-muted-foreground">
                  Saldo Disponível: <strong className="text-accent-green">{selectedItem.b2_dispo} {selectedItem.unidadeMedida}</strong>
                </span>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Ordem de Serviço (OS)</label>
                <Input placeholder="Ex: 145920" value={reservaOs} onChange={(e) => setReservaOs(e.target.value)} required />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Quantidade a Reservar ({selectedItem.unidadeMedida})
                </label>
                <Input
                  type="number"
                  min="1"
                  max={selectedItem.b2_dispo}
                  value={reservaQtd}
                  onChange={(e) => setReservaQtd(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Observação da Manutenção</label>
                <Input
                  placeholder="Ex: Aplicação no mancal dianteiro da OS 145920"
                  value={reservaObs}
                  onChange={(e) => setReservaObs(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-2">
                <Button variant="neutral" size="sm" type="button" onClick={() => setIsReservaModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Confirmar Reserva
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
