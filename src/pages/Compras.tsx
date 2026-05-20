import { useMemo, useState } from "react";
import {
  ShoppingBag,
  Plus,
  Upload,
  ChevronLeft,
  ChevronRight,
  Trash2,
  LayoutList,
  MapPin,
  Package,
  TrendingUp,
  Truck,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StatusKey = "ag_recebimento" | "cancelado" | "finalizado" | "enviado";
type TabKey = "todos" | "viagens" | "compras";

interface CompraItem {
  id: string;
  data: string;
  fornecedor: string;
  status: StatusKey;
  unidades: number;
  frete: number | null;
  totalCusto: number;
  tipo: "compra" | "viagem";
}

const compras: CompraItem[] = [
  { id: "1", data: "13/05/2026", fornecedor: "Fina Maquiagem E Acessorios Ltda", status: "ag_recebimento", unidades: 360, frete: 347.99, totalCusto: 1952.4, tipo: "compra" },
  { id: "2", data: "13/05/2026", fornecedor: "Cap Life Cosmeticos, Jah Cosmeticos Do Brasil Ltda", status: "cancelado", unidades: 1224, frete: null, totalCusto: 6715.32, tipo: "compra" },
  { id: "3", data: "13/05/2026", fornecedor: "Via Brasil Cosméticos E Perfumaria Ltda.", status: "finalizado", unidades: 240, frete: 110.0, totalCusto: 2012.4, tipo: "compra" },
];

const statusConfig: Record<StatusKey, { label: string; className: string }> = {
  ag_recebimento: { label: "Ag. Recebimento", className: "bg-highlight/15 text-foreground border-highlight/40" },
  cancelado: { label: "Cancelado", className: "bg-destructive/10 text-destructive border-destructive/30" },
  finalizado: { label: "Finalizado", className: "bg-accent/10 text-accent border-accent/30" },
  enviado: { label: "Enviado", className: "bg-primary/10 text-primary border-primary/30" },
};

const tabs: { key: TabKey; label: string; icon: typeof LayoutList }[] = [
  { key: "todos", label: "Todos", icon: LayoutList },
  { key: "viagens", label: "Viagens", icon: MapPin },
  { key: "compras", label: "Compras", icon: ShoppingBag },
];

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Compras = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("compras");

  const filtered = useMemo(() => {
    if (activeTab === "todos") return compras;
    if (activeTab === "viagens") return compras.filter((c) => c.tipo === "viagem");
    return compras.filter((c) => c.tipo === "compra");
  }, [activeTab]);

  const totals = useMemo(() => {
    const ativos = filtered.filter((c) => c.status !== "cancelado");
    return {
      count: filtered.length,
      investido: ativos.reduce((a, b) => a + b.totalCusto, 0),
      frete: ativos.reduce((a, b) => a + (b.frete ?? 0), 0),
    };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
        <TrendingUp className="h-5 w-5 text-accent" />
        <span className="font-display text-lg font-bold tracking-tight">Dosh Flow</span>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-10 lg:py-10">
        {/* Page header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent sm:inline-flex">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Compras
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Consulte e gerencie viagens e pedidos de compra
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex w-full gap-1 rounded-xl border border-border bg-card p-1 shadow-sm sm:w-auto">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:flex-initial",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action bar */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4" /> Nova Compra
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" /> Importar NF-e
          </Button>

          {/* Period (full width on mobile) */}
          <div className="col-span-2 flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1.5 shadow-sm sm:col-span-1 sm:ml-auto sm:w-64">
            <button className="rounded p-1 hover:bg-muted" aria-label="Mês anterior">
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            <Calendar className="h-4 w-4 text-primary" />
            <span className="flex-1 text-center text-sm font-medium text-foreground">
              Maio de 2026
            </span>
            <button className="rounded p-1 hover:bg-muted" aria-label="Próximo mês">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mb-4 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          <KpiPill icon={Package} label={`${totals.count} ${activeTab === "viagens" ? "viagens" : "compras"}`} />
          <KpiPill icon={TrendingUp} label="Investido" value={formatBRL(totals.investido)} tone="accent" />
          <KpiPill icon={Truck} label="Frete total" value={formatBRL(totals.frete)} tone="muted" />
        </div>

        {/* List */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          {/* Desktop table */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-[110px_minmax(0,1.4fr)_140px_90px_110px_110px_130px_50px] items-center gap-3 border-b border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Data</span>
              <span>Fornecedor</span>
              <span>Status</span>
              <span className="text-right">Unidades</span>
              <span className="text-right">Frete</span>
              <span className="text-right">Frete/Un</span>
              <span className="text-right">Total Custo</span>
              <span></span>
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((c) => {
                const s = statusConfig[c.status];
                const cancel = c.status === "cancelado";
                const freteUn = c.frete && c.unidades ? c.frete / c.unidades : null;
                return (
                  <li
                    key={c.id}
                    className="grid grid-cols-[110px_minmax(0,1.4fr)_140px_90px_110px_110px_130px_50px] items-center gap-3 px-5 py-4 text-sm transition-colors hover:bg-muted/30"
                  >
                    <span className="text-muted-foreground">{c.data}</span>
                    <span className="truncate font-semibold text-foreground">{c.fornecedor}</span>
                    <span>
                      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide", s.className)}>
                        {s.label}
                      </span>
                    </span>
                    <span className={cn("text-right tabular-nums", cancel ? "text-muted-foreground" : "text-foreground")}>{c.unidades}</span>
                    <span className="text-right tabular-nums text-muted-foreground">
                      {c.frete ? formatBRL(c.frete) : "—"}
                    </span>
                    <span className="text-right tabular-nums text-muted-foreground">
                      {freteUn ? `${formatBRL(freteUn)}/un` : "—"}
                    </span>
                    <span className={cn("text-right font-bold tabular-nums", cancel ? "text-muted-foreground line-through" : "text-foreground")}>
                      {formatBRL(c.totalCusto)}
                    </span>
                    <button
                      className="flex justify-end text-muted-foreground hover:text-destructive disabled:opacity-30"
                      disabled={c.status === "finalizado"}
                      aria-label="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
              <span>{filtered.length} {activeTab === "viagens" ? "viagens" : "compras"}</span>
              <span className="font-bold text-foreground tabular-nums">{formatBRL(totals.investido)}</span>
            </div>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-border lg:hidden">
            {filtered.map((c) => {
              const s = statusConfig[c.status];
              const cancel = c.status === "cancelado";
              const freteUn = c.frete && c.unidades ? c.frete / c.unidades : null;
              return (
                <li key={c.id} className="p-4">
                  {/* Top row: status + date + delete */}
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide", s.className)}>
                        {s.label}
                      </span>
                      <span className="text-[11px] tabular-nums text-muted-foreground">{c.data}</span>
                    </div>
                    <button
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                      disabled={c.status === "finalizado"}
                      aria-label="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Supplier name */}
                  <h3 className={cn("text-[15px] font-semibold leading-snug", cancel ? "text-muted-foreground" : "text-foreground")}>
                    {c.fornecedor}
                  </h3>

                  {/* Total cost — hero */}
                  <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-border pt-3">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Total custo
                    </span>
                    <span className={cn("font-display text-xl font-bold tabular-nums", cancel ? "text-muted-foreground line-through" : "text-foreground")}>
                      {formatBRL(c.totalCusto)}
                    </span>
                  </div>

                  {/* Sub-metrics grid */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <MiniStat label="Unidades" value={c.unidades.toString()} />
                    <MiniStat label="Frete" value={c.frete ? formatBRL(c.frete) : "—"} />
                    <MiniStat label="Frete/un" value={freteUn ? formatBRL(freteUn) : "—"} />
                  </div>
                </li>
              );
            })}
            <li className="flex items-center justify-between px-4 py-3 text-xs text-muted-foreground">
              <span>{filtered.length} {activeTab === "viagens" ? "viagens" : "compras"}</span>
              <span className="font-bold text-foreground tabular-nums">{formatBRL(totals.investido)}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const KpiPill = ({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: typeof Package;
  label: string;
  value?: string;
  tone?: "default" | "accent" | "muted";
}) => (
  <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
    <Icon
      className={cn(
        "h-4 w-4 shrink-0",
        tone === "accent" ? "text-accent" : tone === "muted" ? "text-muted-foreground" : "text-primary",
      )}
    />
    <div className="min-w-0 leading-tight">
      <p className="truncate text-[11px] text-muted-foreground">{label}</p>
      {value && <p className="truncate text-sm font-bold tabular-nums text-foreground">{value}</p>}
    </div>
  </div>
);

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-muted/40 px-2.5 py-2">
    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
      {label}
    </p>
    <p className="mt-0.5 truncate text-sm font-semibold tabular-nums text-foreground">{value}</p>
  </div>
);

export default Compras;
