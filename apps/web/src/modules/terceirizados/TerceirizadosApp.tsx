import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  Building2,
  ArrowUpDown,
  RefreshCw,
  Clock,
  AlertTriangle,
  PackageCheck,
  CircleDollarSign,
  ChevronRight,
  Flame,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { FILIAIS } from "@medro/shared";
import { cn } from "@/lib/cn";
import { SPRING_SNAPPY } from "@/lib/motion";
import { useTerceirizados, useTerceirizadosKpis, type Terceirizado } from "./api";
import { NovoRegistroModal } from "./components/NovoRegistroModal";
import { DetalheModal } from "./components/DetalheModal";

type Tab = "pendentes" | "historico";

const fmtData = (s: string | null) => {
  if (!s) return "—";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleDateString("pt-BR");
};
const fmtMoeda = (s: string | null) => {
  if (!s) return null;
  const n = Number(String(s).replace(/[^0-9.,-]/g, "").replace(",", "."));
  if (!Number.isFinite(n) || n === 0) return null;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export function TerceirizadosApp() {
  const { user, can } = useAuth();
  const canCadastrar = can("_TER_CAD");

  const [filial, setFilial] = useState<string>(user?.filial || "São Luís");
  const [tab, setTab] = useState<Tab>("pendentes");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [novoOpen, setNovoOpen] = useState(false);
  const [selecionado, setSelecionado] = useState<Terceirizado | null>(null);

  const { data, isLoading, isFetching, refetch } = useTerceirizados({
    filial,
    status: tab,
    search: search.trim() || undefined,
    order,
  });
  const { data: kpis } = useTerceirizadosKpis(filial);

  const itens = data?.items ?? [];
  const offline = data ? !data.fromDataverse : false;

  const kpiCards = useMemo(
    () => [
      { label: "Pendentes de retorno", value: kpis?.totalPendentes ?? 0, icon: Clock, tone: "text-primary" },
      { label: "Emergenciais", value: kpis?.emergenciais ?? 0, icon: Flame, tone: "text-danger" },
      { label: "Prazo vencido", value: kpis?.atrasados ?? 0, icon: AlertTriangle, tone: "text-warning" },
      { label: "Retornaram (7 dias)", value: kpis?.retornaram7d ?? 0, icon: PackageCheck, tone: "text-success" },
    ],
    [kpis],
  );

  return (
    <div className="flex h-full flex-col bg-bg text-foreground">
      {/* Cabeçalho */}
      <div className="shrink-0 border-b border-border bg-surface px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-indigo/30 bg-accent-indigo/15 text-accent-indigo">
            <Users className="size-5" />
          </div>
          <div className="mr-auto">
            <h1 className="text-[15px] font-semibold">Terceirizados</h1>
            <p className="text-[11.5px] text-muted-foreground">
              Serviços externos por OS · <span className="font-mono text-accent-indigo">cr4a1_servicosterceirizados</span>
              {offline && <span className="ml-2 rounded bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold text-warning">offline · dados de exemplo</span>}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Building2 className="size-3.5 text-accent-indigo" />
            <Select
              value={filial}
              onValueChange={setFilial}
              size="sm"
              className="w-40"
              aria-label="Filial"
            >
              <SelectItem value="Todas">Todas as filiais</SelectItem>
              {FILIAIS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </Select>
          </div>

          <Button
            variant="neutral"
            size="sm"
            onClick={() => refetch()}
            title="Atualizar"
            className="gap-1.5"
          >
            <RefreshCw className={cn("size-3.5", isFetching && "animate-spin")} />
          </Button>

          {canCadastrar && (
            <Button size="sm" onClick={() => setNovoOpen(true)} className="gap-1.5 bg-accent-indigo text-white hover:brightness-95">
              <Plus className="size-4" /> Novo registro
            </Button>
          )}
        </div>

        {/* KPIs */}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {kpiCards.map((k) => (
            <div key={k.label} className="rounded-lg border border-border bg-surface-2/60 px-3 py-2">
              <div className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
                <k.icon className={cn("size-3.5", k.tone)} /> {k.label}
              </div>
              <div className="mt-0.5 text-[20px] font-semibold tabular-nums">{k.value}</div>
            </div>
          ))}
        </div>
        {kpis && kpis.valorPendente > 0 && (
          <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
            <CircleDollarSign className="size-3.5 text-accent-indigo" />
            Valor em serviços pendentes:{" "}
            <strong className="text-foreground">
              {kpis.valorPendente.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </strong>
          </p>
        )}
      </div>

      {/* Abas + busca */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-surface px-5 py-2.5">
        <div className="flex rounded-md border border-border bg-surface-2 p-0.5">
          {([
            { id: "pendentes", label: "Pendentes de retorno", icon: Clock },
            { id: "historico", label: "Histórico", icon: History },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium transition-colors",
                tab === t.id ? "bg-surface text-foreground shadow-ios-1" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="size-3.5" /> {t.label}
            </button>
          ))}
        </div>

        <div className="relative ml-auto flex items-center">
          <Search className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por OS, N° OR, empresa…"
            className="h-8 w-56 pl-8 text-[12px]"
          />
        </div>
        <Button
          variant="neutral"
          size="sm"
          onClick={() => setOrder((o) => (o === "desc" ? "asc" : "desc"))}
          className="gap-1.5 text-[12px]"
          title="Alternar ordem por data de criação"
        >
          <ArrowUpDown className="size-3.5" />
          {order === "desc" ? "Mais recentes" : "Mais antigos"}
        </Button>
      </div>

      {/* Lista */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            <RefreshCw className="size-4 animate-spin" />
          </div>
        ) : itens.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-1 text-center">
            <PackageCheck className="size-6 text-success" />
            <p className="text-[13px] font-semibold">
              {tab === "pendentes" ? "Nenhum serviço aguardando retorno." : "Sem histórico para este filtro."}
            </p>
            <p className="text-[11.5px] text-muted-foreground">
              {tab === "pendentes"
                ? "Tudo que foi enviado para terceiros já retornou."
                : "Registros com data de retorno aparecem aqui."}
            </p>
          </div>
        ) : (
          <div className="mx-auto grid max-w-3xl gap-2.5">
            <AnimatePresence initial={false} mode="popLayout">
              {itens.map((it) => (
                <motion.button
                  key={it.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={SPRING_SNAPPY}
                  whileHover={{ y: -1 }}
                  onClick={() => setSelecionado(it)}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-3.5 text-left transition-colors hover:border-accent-indigo/50"
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border text-[11px] font-bold",
                      it.situacao === "Emergencial"
                        ? "border-danger/30 bg-danger/10 text-danger"
                        : "border-border bg-surface-2 text-muted-foreground",
                    )}
                    title={it.situacao}
                  >
                    {it.situacao === "Emergencial" ? <Flame className="size-4" /> : "OS"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-[13.5px] font-semibold">{it.titulo || "(sem OS)"}</span>
                      {it.nOr && (
                        <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10.5px] text-muted-foreground">
                          OR {it.nOr}
                        </span>
                      )}
                      {fmtMoeda(it.totalValor) && (
                        <span className="rounded bg-success/15 px-1.5 py-0.5 text-[10.5px] font-semibold text-success">
                          {fmtMoeda(it.totalValor)}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[12px] text-foreground-secondary">
                      {it.peca}
                      {it.servicos.filter(Boolean).length > 0 && (
                        <span className="text-muted-foreground"> · {it.servicos.filter(Boolean).join(" · ")}</span>
                      )}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                      {it.empresa && <span>Fornecedor: {it.empresa}</span>}
                      <span>Registro: {fmtData(it.dataRegistro)}</span>
                      {tab === "pendentes"
                        ? it.previsaoRetorno && (
                            <span
                              className={cn(
                                new Date(it.previsaoRetorno).getTime() < Date.now() && "font-semibold text-warning",
                              )}
                            >
                              Previsão: {fmtData(it.previsaoRetorno)}
                            </span>
                          )
                        : <span>Retorno: {fmtData(it.dataRetorno)}</span>}
                    </div>
                  </div>

                  <ChevronRight className="mt-2 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <NovoRegistroModal open={novoOpen} onClose={() => setNovoOpen(false)} filialAtual={filial} />
      <DetalheModal
        registro={selecionado}
        onClose={() => setSelecionado(null)}
      />
    </div>
  );
}
