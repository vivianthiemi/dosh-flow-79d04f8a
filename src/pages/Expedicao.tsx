import { useMemo, useState } from "react";
import {
  PackageCheck,
  PackageSearch,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Boxes,
  Users,
  TrendingUp,
  ArrowUpRight,
  Timer,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type StatusKey = "aguardando" | "separando" | "conferencia" | "expedido" | "atrasado";
type TabKey = "todos" | "aguardando" | "separando" | "expedido";

interface Pedido {
  id: string;
  numero: string;
  cliente: string;
  cidade: string;
  itens: number;
  volumes: number;
  transportadora: string;
  separador: string | null;
  prioridade: "alta" | "media" | "baixa";
  status: StatusKey;
  prazo: string;
  atualizadoEm: string;
}

const pedidos: Pedido[] = [
  { id: "1", numero: "#10482", cliente: "Bella Estética Ltda", cidade: "São Paulo/SP", itens: 24, volumes: 3, transportadora: "Jadlog", separador: "Marina S.", prioridade: "alta", status: "separando", prazo: "Hoje 14:00", atualizadoEm: "há 4 min" },
  { id: "2", numero: "#10481", cliente: "Studio Glow", cidade: "Campinas/SP", itens: 12, volumes: 1, transportadora: "Correios PAC", separador: null, prioridade: "media", status: "aguardando", prazo: "Hoje 17:00", atualizadoEm: "há 12 min" },
  { id: "3", numero: "#10480", cliente: "Espaço Beleza Pura", cidade: "Rio de Janeiro/RJ", itens: 48, volumes: 4, transportadora: "Loggi", separador: "Carlos R.", prioridade: "alta", status: "conferencia", prazo: "Hoje 13:00", atualizadoEm: "há 2 min" },
  { id: "4", numero: "#10479", cliente: "Salão Veneza", cidade: "Belo Horizonte/MG", itens: 8, volumes: 1, transportadora: "Jadlog", separador: "Ana P.", prioridade: "baixa", status: "expedido", prazo: "Ontem", atualizadoEm: "há 1h" },
  { id: "5", numero: "#10478", cliente: "Cosmétika Distribuidora", cidade: "Curitiba/PR", itens: 96, volumes: 8, transportadora: "Braspress", separador: "Pedro L.", prioridade: "alta", status: "atrasado", prazo: "Ontem 18:00", atualizadoEm: "há 22 min" },
  { id: "6", numero: "#10477", cliente: "Espaço Vida", cidade: "Santos/SP", itens: 16, volumes: 2, transportadora: "Loggi", separador: null, prioridade: "media", status: "aguardando", prazo: "Amanhã 12:00", atualizadoEm: "há 35 min" },
  { id: "7", numero: "#10476", cliente: "Studio Naturale", cidade: "Sorocaba/SP", itens: 32, volumes: 2, transportadora: "Correios SEDEX", separador: "Marina S.", prioridade: "media", status: "separando", prazo: "Hoje 16:00", atualizadoEm: "há 7 min" },
];

const statusConfig: Record<StatusKey, { label: string; className: string; dot: string }> = {
  aguardando:  { label: "Aguardando",   className: "bg-muted text-muted-foreground border-border",                       dot: "bg-muted-foreground" },
  separando:   { label: "Separando",    className: "bg-primary/10 text-primary border-primary/30",                       dot: "bg-primary" },
  conferencia: { label: "Conferência",  className: "bg-highlight/15 text-foreground border-highlight/40",                 dot: "bg-highlight" },
  expedido:    { label: "Expedido",     className: "bg-accent/10 text-accent border-accent/30",                           dot: "bg-accent" },
  atrasado:    { label: "Atrasado",     className: "bg-destructive/10 text-destructive border-destructive/30",            dot: "bg-destructive" },
};

const prioridadeConfig: Record<Pedido["prioridade"], { label: string; className: string }> = {
  alta:  { label: "Alta",  className: "text-destructive" },
  media: { label: "Média", className: "text-highlight-foreground" },
  baixa: { label: "Baixa", className: "text-muted-foreground" },
};

const tabs: { key: TabKey; label: string; icon: typeof Boxes }[] = [
  { key: "todos",      label: "Todos",      icon: Boxes },
  { key: "aguardando", label: "Aguardando", icon: Clock },
  { key: "separando",  label: "Em separação", icon: PackageSearch },
  { key: "expedido",   label: "Expedidos",  icon: Truck },
];

const KpiCard = ({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: typeof Boxes;
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "primary" | "accent" | "destructive" | "highlight";
}) => {
  const toneMap = {
    default: "bg-card text-foreground",
    primary: "bg-primary/5 text-primary",
    accent: "bg-accent/5 text-accent",
    destructive: "bg-destructive/5 text-destructive",
    highlight: "bg-highlight/10 text-foreground",
  } as const;
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

const ProgressBar = ({ value, total, tone }: { value: number; total: number; tone: string }) => {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((value / total) * 100));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{value} / {total}</span>
        <span className="font-medium text-foreground">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full transition-all", tone)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: StatusKey }) => {
  const cfg = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", cfg.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
};

const Expedicao = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("todos");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return pedidos.filter((p) => {
      if (activeTab !== "todos") {
        if (activeTab === "separando" && !(p.status === "separando" || p.status === "conferencia")) return false;
        if (activeTab === "aguardando" && p.status !== "aguardando") return false;
        if (activeTab === "expedido" && p.status !== "expedido") return false;
      }
      if (search) {
        const s = search.toLowerCase();
        return (
          p.numero.toLowerCase().includes(s) ||
          p.cliente.toLowerCase().includes(s) ||
          p.cidade.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [activeTab, search]);

  const kpis = useMemo(() => {
    const aguardando = pedidos.filter((p) => p.status === "aguardando").length;
    const separando = pedidos.filter((p) => p.status === "separando").length;
    const conferencia = pedidos.filter((p) => p.status === "conferencia").length;
    const expedido = pedidos.filter((p) => p.status === "expedido").length;
    const atrasado = pedidos.filter((p) => p.status === "atrasado").length;
    const itens = pedidos.reduce((a, b) => a + b.itens, 0);
    const volumes = pedidos.reduce((a, b) => a + b.volumes, 0);
    return { aguardando, separando, conferencia, expedido, atrasado, itens, volumes, total: pedidos.length };
  }, []);

  const separadores = useMemo(() => {
    const map = new Map<string, { nome: string; ativos: number; itens: number }>();
    pedidos
      .filter((p) => p.separador && (p.status === "separando" || p.status === "conferencia"))
      .forEach((p) => {
        const cur = map.get(p.separador!) ?? { nome: p.separador!, ativos: 0, itens: 0 };
        cur.ativos += 1;
        cur.itens += p.itens;
        map.set(p.separador!, cur);
      });
    return Array.from(map.values()).sort((a, b) => b.itens - a.itens);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold leading-tight tracking-tight sm:text-lg">Expedição</h1>
              <p className="text-[11px] text-muted-foreground sm:text-xs">Painel de separação e envio</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Tempo real
            </span>
            <Button size="sm" className="gap-1.5">
              <PackageCheck className="h-4 w-4" /> Nova expedição
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
        {/* KPIs */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <KpiCard icon={Boxes}         label="Pedidos hoje"  value={String(kpis.total)} hint={`${kpis.itens} itens · ${kpis.volumes} vols`} />
          <KpiCard icon={Clock}         label="Aguardando"    value={String(kpis.aguardando)} hint="Na fila" />
          <KpiCard icon={PackageSearch} label="Separando"     value={String(kpis.separando)} tone="primary" />
          <KpiCard icon={CheckCircle2}  label="Conferência"   value={String(kpis.conferencia)} tone="highlight" />
          <KpiCard icon={Truck}         label="Expedidos"     value={String(kpis.expedido)} tone="accent" hint="Saíram hoje" />
          <KpiCard icon={AlertTriangle} label="Atrasados"     value={String(kpis.atrasado)} tone="destructive" hint="Requer ação" />
        </section>

        {/* Progresso & Equipe */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Progresso do dia</h2>
              </div>
              <span className="text-xs text-muted-foreground">Atualizado há 1 min</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Separação</p>
                <ProgressBar value={kpis.separando + kpis.conferencia + kpis.expedido} total={kpis.total} tone="bg-primary" />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Conferência</p>
                <ProgressBar value={kpis.conferencia + kpis.expedido} total={kpis.total} tone="bg-highlight" />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Expedidos</p>
                <ProgressBar value={kpis.expedido} total={kpis.total} tone="bg-accent" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Tempo médio</p>
                  <p className="text-sm font-semibold">18 min</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Produtividade</p>
                  <p className="text-sm font-semibold text-accent">+12%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-xs text-muted-foreground">SLA em risco</p>
                  <p className="text-sm font-semibold">{kpis.atrasado}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Equipe ativa</h2>
            </div>
            <ul className="space-y-3">
              {separadores.map((s) => (
                <li key={s.nome} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {s.nome.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-tight">{s.nome}</p>
                      <p className="text-xs text-muted-foreground">{s.ativos} pedido{s.ativos > 1 ? "s" : ""} · {s.itens} itens</p>
                    </div>
                  </div>
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tabs + Filtros */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-1 items-center gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                    activeTab === key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-1 items-center gap-2 sm:flex-none">
              <div className="relative flex-1 sm:w-72">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar pedido, cliente ou cidade"
                  className="h-9 pl-8"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-4 w-4" /> <span className="hidden sm:inline">Filtros</span>
              </Button>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:block">
            <div className="grid grid-cols-[110px_1fr_140px_90px_120px_140px_140px_120px] gap-3 border-b border-border bg-muted/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Pedido</span>
              <span>Cliente</span>
              <span>Status</span>
              <span className="text-right">Itens</span>
              <span>Transportadora</span>
              <span>Separador</span>
              <span>Prazo</span>
              <span>Prioridade</span>
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((p) => (
                <li key={p.id} className="grid grid-cols-[110px_1fr_140px_90px_120px_140px_140px_120px] items-center gap-3 px-5 py-3 text-sm hover:bg-muted/30">
                  <span className="font-mono font-semibold text-foreground">{p.numero}</span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{p.cliente}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {p.cidade}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                  <span className="text-right tabular-nums">{p.itens} <span className="text-xs text-muted-foreground">/ {p.volumes}v</span></span>
                  <span className="truncate text-xs text-muted-foreground">{p.transportadora}</span>
                  <span className="truncate text-xs">{p.separador ?? <span className="italic text-muted-foreground">não atribuído</span>}</span>
                  <span className="text-xs text-foreground">{p.prazo}</span>
                  <span className={cn("text-xs font-semibold", prioridadeConfig[p.prioridade].className)}>
                    {prioridadeConfig[p.prioridade].label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-2.5 lg:hidden">
            {filtered.map((p) => (
              <li key={p.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold">{p.numero}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="mt-1 truncate text-[15px] font-medium leading-tight">{p.cliente}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {p.cidade}
                    </p>
                  </div>
                  <span className={cn("shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] font-semibold uppercase", prioridadeConfig[p.prioridade].className)}>
                    {prioridadeConfig[p.prioridade].label}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Itens</p>
                    <p className="font-semibold text-foreground">{p.itens} / {p.volumes}v</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Transp.</p>
                    <p className="truncate font-medium text-foreground">{p.transportadora}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Prazo</p>
                    <p className="font-semibold text-foreground">{p.prazo}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.separador ? `👤 ${p.separador}` : "Sem separador"}</span>
                  <span>{p.atualizadoEm}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Expedicao;
