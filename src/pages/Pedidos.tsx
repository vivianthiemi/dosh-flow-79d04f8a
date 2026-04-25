import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Pencil,
  Printer,
  Trash2,
  Plus,
  Search,
  TrendingUp,
  Calendar,
  SlidersHorizontal,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type StatusKey = "orcamento" | "aprovado" | "programado" | "cancelado";

interface PedidoItem {
  id: string;
  codigo: string;
  descricao: string;
  vigencia: string;
  parcelas: string;
  cliente: string;
  categoria: string;
  valor: number;
  data: string;
  liquidada: boolean;
  status: StatusKey;
}

const pedidos: PedidoItem[] = [
  { id: "94049", codigo: "1", descricao: "Ingrid", vigencia: "—", parcelas: "—", cliente: "Ingrid Felipe", categoria: "4.01.01 Produtos", valor: 2706.92, data: "09/01/2026", liquidada: true, status: "aprovado" },
  { id: "97167", codigo: "2", descricao: "Orçamento Nathalia", vigencia: "30 dias", parcelas: "1x", cliente: "Nathalia Almeida", categoria: "4.01.01 Produtos", valor: 1219.64, data: "16/01/2026", liquidada: false, status: "orcamento" },
  { id: "97264", codigo: "3", descricao: "Venda balcão", vigencia: "—", parcelas: "1x", cliente: "Jaqueline Torrezan", categoria: "4.01.01 Produtos", valor: 472.35, data: "16/01/2026", liquidada: true, status: "aprovado" },
  { id: "97718", codigo: "4", descricao: "Globox kit", vigencia: "—", parcelas: "2x", cliente: "Nathalia Almeida", categoria: "4.01.01 Produtos", valor: 444.30, data: "19/01/2026", liquidada: true, status: "aprovado" },
  { id: "97793", codigo: "5", descricao: "Globox kit", vigencia: "—", parcelas: "3x", cliente: "Carol", categoria: "4.01.01 Produtos", valor: 1076.53, data: "19/01/2026", liquidada: true, status: "aprovado" },
  { id: "97802", codigo: "6", descricao: "Outbox solo", vigencia: "—", parcelas: "1x", cliente: "Estefany", categoria: "4.01.01 Produtos", valor: 325.13, data: "19/01/2026", liquidada: false, status: "programado" },
  { id: "98135", codigo: "9", descricao: "Globox", vigencia: "—", parcelas: "1x", cliente: "Nathalia Almeida", categoria: "4.01.01 Produtos", valor: 86.66, data: "20/01/2026", liquidada: true, status: "aprovado" },
  { id: "98155", codigo: "10", descricao: "Outbox alto alegre", vigencia: "—", parcelas: "1x", cliente: "Shirley Sabor de Fruta", categoria: "4.01.01 Produtos", valor: 111.55, data: "20/01/2026", liquidada: true, status: "aprovado" },
  { id: "98188", codigo: "11", descricao: "Outbox", vigencia: "—", parcelas: "1x", cliente: "Carol", categoria: "4.01.01 Produtos", valor: 58.80, data: "20/01/2026", liquidada: false, status: "cancelado" },
  { id: "98372", codigo: "12", descricao: "Outbox premium", vigencia: "—", parcelas: "2x", cliente: "Juliana", categoria: "4.01.01 Produtos", valor: 437.89, data: "20/01/2026", liquidada: true, status: "aprovado" },
];

const statusConfig: Record<StatusKey, { label: string; className: string }> = {
  orcamento: { label: "Orçamento", className: "bg-highlight/15 text-foreground border-highlight/40" },
  aprovado: { label: "Aprovado", className: "bg-accent/10 text-accent border-accent/30" },
  programado: { label: "Programado", className: "bg-primary/10 text-primary border-primary/30" },
  cancelado: { label: "Cancelado", className: "bg-destructive/10 text-destructive border-destructive/30" },
};

const tabs: { key: "todos" | StatusKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "orcamento", label: "Orçamento" },
  { key: "aprovado", label: "Aprovado" },
  { key: "programado", label: "Programado" },
  { key: "cancelado", label: "Cancelado" },
];

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Pedidos = () => {
  const [activeTab, setActiveTab] = useState<"todos" | StatusKey>("todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: pedidos.length };
    (Object.keys(statusConfig) as StatusKey[]).forEach((k) => {
      c[k] = pedidos.filter((p) => p.status === k).length;
    });
    return c;
  }, []);

  const totals = useMemo(() => {
    const sum = (s: StatusKey) => pedidos.filter((p) => p.status === s).reduce((a, b) => a + b.valor, 0);
    return {
      cancelado: sum("cancelado"),
      previsto: sum("orcamento") + sum("programado"),
      aprovado: sum("aprovado"),
      total: pedidos.reduce((a, b) => a + b.valor, 0),
    };
  }, []);

  const filtered = useMemo(() => {
    return pedidos
      .filter((p) => activeTab === "todos" || p.status === activeTab)
      .filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.cliente.toLowerCase().includes(q) ||
          p.descricao.toLowerCase().includes(q) ||
          p.id.includes(q)
        );
      });
  }, [activeTab, search]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length ? new Set() : new Set(filtered.map((p) => p.id)),
    );

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
        <TrendingUp className="h-5 w-5 text-accent" />
        <span className="font-display text-lg font-bold tracking-tight">Shift Up</span>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Pedidos
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerencie orçamentos e vendas com flexibilidade e precisão.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Novo Pedido
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Search className="h-4 w-4" /> Filtros e busca
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Mais filtros
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Limpar
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:flex-row">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1.5 lg:w-72">
              <button className="rounded p-1 hover:bg-muted">
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              <Calendar className="h-4 w-4 text-primary" />
              <div className="flex-1 text-center">
                <p className="text-xs font-medium text-foreground">Período personalizado</p>
                <p className="text-[11px] text-muted-foreground">01/01/26 até 31/01/26</p>
              </div>
              <button className="rounded p-1 hover:bg-muted">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por cliente, descrição ou ID..."
                className="pl-9"
              />
            </div>

            <Button className="lg:w-28">Buscar</Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard label="Cancelado" count={counts.cancelado} value={totals.cancelado} tone="destructive" />
          <KpiCard label="Previsto" count={counts.orcamento + counts.programado} value={totals.previsto} tone="highlight" />
          <KpiCard label="Aprovado" count={counts.aprovado} value={totals.aprovado} tone="accent" />
          <KpiCard label="Total" count={counts.todos} value={totals.total} tone="primary" />
        </div>

        {/* Tabs + Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="-mx-1 flex gap-1.5 overflow-x-auto border-b border-border px-4 py-3">
            {tabs.map((t) => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
                  )}
                >
                  <span>{t.label}</span>
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-xs tabular-nums",
                      isActive ? "bg-primary-foreground/20" : "bg-background/60 text-muted-foreground",
                    )}
                  >
                    {counts[t.key] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-[40px_70px_minmax(0,1.4fr)_90px_140px_110px_80px_130px_80px] items-center gap-3 border-b border-border bg-muted/40 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border accent-primary"
                checked={selected.size > 0 && selected.size === filtered.length}
                onChange={toggleAll}
              />
              <span>Cód.</span>
              <span>Cliente</span>
              <span>Parcelas</span>
              <span className="text-right">Valor (R$)</span>
              <span>Data</span>
              <span className="text-center">Liquid.</span>
              <span>Situação</span>
              <span></span>
            </div>

            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((p) => {
                  const status = statusConfig[p.status];
                  const isSelected = selected.has(p.id);
                  return (
                    <li
                      key={p.id}
                      className={cn(
                        "grid grid-cols-[40px_70px_minmax(0,1.4fr)_90px_140px_110px_80px_130px_80px] items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/30",
                        isSelected && "bg-primary/5",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border accent-primary"
                        checked={isSelected}
                        onChange={() => toggle(p.id)}
                      />
                      <span className="text-xs tabular-nums text-muted-foreground">{p.codigo}</span>
                      <Link to="/pedido-v2" className="truncate font-medium text-foreground hover:text-primary">
                        {p.cliente}
                      </Link>
                      <span className="text-xs tabular-nums text-muted-foreground">{p.parcelas}</span>
                      <span className="text-right font-semibold tabular-nums text-foreground">
                        {formatCurrency(p.valor)}
                      </span>
                      <span className="tabular-nums text-muted-foreground">{p.data}</span>
                      <span className="flex justify-center">
                        {p.liquidada ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                        ) : (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                        )}
                      </span>
                      <span>
                        <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", status.className)}>
                          {status.label}
                        </span>
                      </span>
                      <div className="flex items-center justify-end gap-0.5">
                        <RowAction icon={Pencil} label="Editar" />
                        <RowAction icon={Printer} label="Imprimir" />
                        <RowAction icon={Trash2} label="Excluir" tone="danger" />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden">
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((p) => {
                  const status = statusConfig[p.status];
                  return (
                    <li key={p.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[11px] text-muted-foreground">#{p.id}</span>
                            <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", status.className)}>
                              {status.label}
                            </span>
                            {p.liquidada && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-accent">
                                <Check className="h-3 w-3" strokeWidth={3} /> Liquidado
                              </span>
                            )}
                          </div>
                          <Link to="/pedido-v2" className="mt-1 block truncate text-base font-semibold text-foreground">
                            {p.descricao}
                          </Link>
                          <p className="text-sm text-muted-foreground">{p.cliente}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {p.parcelas} · {p.data}
                          </p>
                        </div>
                        <p className="text-base font-bold tabular-nums text-foreground">
                          {formatCurrency(p.valor)}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                          <Pencil className="h-3.5 w-3.5" /> Editar
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                          <Printer className="h-3.5 w-3.5" /> Imprimir
                        </Button>
                        <Button variant="outline" size="sm" className="px-3 text-destructive hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>
              {selected.size > 0
                ? `${selected.size} selecionado${selected.size > 1 ? "s" : ""}`
                : `${filtered.length} pedido${filtered.length !== 1 ? "s" : ""}`}
            </span>
            <span>
              Total exibido: <strong className="text-foreground">{formatCurrency(filtered.reduce((a, b) => a + b.valor, 0))}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({
  label,
  count,
  value,
  tone,
}: {
  label: string;
  count: number;
  value: number;
  tone: "destructive" | "highlight" | "accent" | "primary";
}) => {
  const tones = {
    destructive: "border-l-destructive",
    highlight: "border-l-highlight",
    accent: "border-l-accent",
    primary: "border-l-primary",
  };
  return (
    <div className={cn("rounded-xl border border-border border-l-4 bg-card p-4 shadow-sm", tones[tone])}>
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className="text-xs tabular-nums text-muted-foreground">({count})</span>
      </div>
      <p className="mt-1.5 font-display text-xl font-bold tabular-nums text-foreground sm:text-2xl">
        {formatCurrency(value)}
      </p>
    </div>
  );
};

const RowAction = ({
  icon: Icon,
  label,
  tone,
}: {
  icon: typeof Pencil;
  label: string;
  tone?: "danger";
}) => (
  <button
    aria-label={label}
    className={cn(
      "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
      tone === "danger" && "hover:bg-destructive/10 hover:text-destructive",
    )}
  >
    <Icon className="h-3.5 w-3.5" />
  </button>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
    <div className="rounded-full bg-secondary p-3">
      <Search className="h-6 w-6 text-muted-foreground" />
    </div>
    <p className="text-sm font-medium text-foreground">Nenhum pedido encontrado</p>
    <p className="text-xs text-muted-foreground">Tente ajustar os filtros ou crie um novo pedido.</p>
  </div>
);

export default Pedidos;
