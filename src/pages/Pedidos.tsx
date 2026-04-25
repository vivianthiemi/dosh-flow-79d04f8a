import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Pencil,
  Printer,
  Trash2,
  Plus,
  Search,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type StatusKey = "orcamento" | "aprovado" | "programado" | "cancelado";

interface PedidoItem {
  codigo: string;
  cliente: string;
  cidade: string;
  uf: string;
  status: StatusKey;
  total: number;
  data: string;
}

const pedidos: PedidoItem[] = [
  { codigo: "#1002", cliente: "Authentica", cidade: "Bauru", uf: "SP", status: "orcamento", total: 334.26, data: "24/04/2026" },
  { codigo: "#1001", cliente: "A Escolhida Makeup", cidade: "Marília", uf: "SP", status: "orcamento", total: 2575.51, data: "23/04/2026" },
  { codigo: "#1000", cliente: "Rafael Afiação", cidade: "Marília", uf: "SP", status: "orcamento", total: 432.7, data: "21/04/2026" },
];

const statusConfig: Record<StatusKey, { label: string; className: string }> = {
  orcamento: { label: "Orçamento", className: "bg-highlight/15 text-highlight-foreground border-highlight/30" },
  aprovado: { label: "Aprovado", className: "bg-accent/15 text-accent border-accent/30" },
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

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: pedidos.length };
    (Object.keys(statusConfig) as StatusKey[]).forEach((k) => {
      c[k] = pedidos.filter((p) => p.status === k).length;
    });
    return c;
  }, []);

  const filtered = useMemo(() => {
    return pedidos
      .filter((p) => activeTab === "todos" || p.status === activeTab)
      .filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.cliente.toLowerCase().includes(q) ||
          p.codigo.toLowerCase().includes(q) ||
          p.cidade.toLowerCase().includes(q)
        );
      });
  }, [activeTab, search]);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
        <TrendingUp className="h-5 w-5 text-accent" />
        <span className="font-display text-lg font-bold tracking-tight">Shift Up</span>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Pedidos
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerencie orçamentos e vendas
            </p>
          </div>
          <Button size="lg" className="w-full gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            Novo Pedido
          </Button>
        </div>

        {/* Filters card */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          {/* Tabs + search */}
          <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:pb-0">
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

            <div className="relative lg:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar pedido, cliente..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-[110px_minmax(0,1.4fr)_minmax(0,1fr)_140px_140px_120px_120px] items-center gap-4 border-b border-border bg-muted/40 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Código</span>
              <span>Cliente</span>
              <span>Cidade / UF</span>
              <span>Status</span>
              <span className="text-right">Total</span>
              <span>Data</span>
              <span className="text-right">Ações</span>
            </div>

            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((p) => {
                  const status = statusConfig[p.status];
                  return (
                    <li
                      key={p.codigo}
                      className="grid grid-cols-[110px_minmax(0,1.4fr)_minmax(0,1fr)_140px_140px_120px_120px] items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30"
                    >
                      <span className="font-mono text-sm font-semibold text-primary">{p.codigo}</span>
                      <Link to="/pedido-v2" className="truncate text-sm font-medium text-foreground hover:text-primary">
                        {p.cliente}
                      </Link>
                      <span className="truncate text-sm text-muted-foreground">
                        {p.cidade} / {p.uf}
                      </span>
                      <span>
                        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", status.className)}>
                          {status.label}
                        </span>
                      </span>
                      <span className="text-right text-sm font-semibold tabular-nums text-foreground">
                        {formatCurrency(p.total)}
                      </span>
                      <span className="text-sm tabular-nums text-muted-foreground">{p.data}</span>
                      <div className="flex items-center justify-end gap-1">
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
                    <li key={p.codigo} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-primary">{p.codigo}</span>
                            <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", status.className)}>
                              {status.label}
                            </span>
                          </div>
                          <Link to="/pedido-v2" className="mt-1 block truncate text-base font-semibold text-foreground">
                            {p.cliente}
                          </Link>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {p.cidade} / {p.uf} · {p.data}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold tabular-nums text-foreground">
                            {formatCurrency(p.total)}
                          </p>
                        </div>
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
        </div>
      </div>
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
      "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
      tone === "danger" && "hover:bg-destructive/10 hover:text-destructive",
    )}
  >
    <Icon className="h-4 w-4" />
  </button>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
    <div className="rounded-full bg-secondary p-3">
      <ShoppingCart className="h-6 w-6 text-muted-foreground" />
    </div>
    <p className="text-sm font-medium text-foreground">Nenhum pedido encontrado</p>
    <p className="text-xs text-muted-foreground">Tente ajustar os filtros ou crie um novo pedido.</p>
  </div>
);

export default Pedidos;
