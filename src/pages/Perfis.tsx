import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PersonType = "PF" | "PJ";
type Role = "cliente" | "fornecedor" | "usuario";

interface Perfil {
  id: string;
  name: string;
  fantasyName?: string;
  type: PersonType;
  email?: string;
  document: string;
  phone?: string;
  city?: string;
  uf?: string;
  roles: Role[];
}

const perfis: Perfil[] = [
  { id: "1", name: "49.363.103 Lays Rodrigues Cardoso", fantasyName: "Authentica", type: "PJ", email: "rodriguescardosolays76@gmail.com", document: "49.363.103/0001-05", phone: "(15) 9667-1273", city: "Bauru", uf: "SP", roles: ["cliente"] },
  { id: "2", name: "A Escolhida Makeup", type: "PJ", document: "50.523.594/0001-93", phone: "(14) 99819-8164", city: "Marília", uf: "SP", roles: ["cliente"] },
  { id: "3", name: "Amanda Walerio", type: "PF", email: "nandawalerio19@gmail.com", document: "455.454.918-64", roles: ["cliente", "usuario"] },
  { id: "4", name: "Cap Life Cosmeticos, Jah Cosmeticos Do Brasil Ltda", type: "PJ", document: "34.456.774/0001-43", roles: ["fornecedor"] },
  { id: "5", name: "Comercio Ponto Aura Central Ltda", type: "PJ", document: "61.904.164/0001-38", roles: ["fornecedor"] },
  { id: "6", name: "Fina Maquiagem E Acessorios Ltda", type: "PJ", document: "44.223.752/0001-97", roles: ["fornecedor"] },
  { id: "7", name: "Prolink Industria Quimica Ltda", type: "PJ", document: "01.140.700/0001-44", roles: ["fornecedor"] },
  { id: "8", name: "Rafael Afiação", type: "PJ", document: "24.385.425/0001-24", phone: "(14) 99131-8118", city: "Marília", uf: "SP", roles: ["cliente"] },
  { id: "9", name: "Bianca Toledo", type: "PF", email: "bianca.toledo@email.com", document: "321.654.987-00", phone: "(14) 98765-4321", city: "Bauru", uf: "SP", roles: ["cliente"] },
  { id: "10", name: "Distribuidora Beleza Pura Ltda", type: "PJ", document: "12.345.678/0001-90", phone: "(11) 3456-7890", city: "São Paulo", uf: "SP", roles: ["fornecedor"] },
  { id: "11", name: "Carolina Mendes", type: "PF", email: "carol@email.com", document: "987.123.456-12", roles: ["cliente"] },
  { id: "12", name: "Studio Glow Cosméticos", fantasyName: "Glow", type: "PJ", document: "55.111.222/0001-33", phone: "(14) 3333-2222", city: "Marília", uf: "SP", roles: ["cliente"] },
];

const roleConfig: Record<Role, { label: string; className: string }> = {
  cliente: { label: "Cliente", className: "bg-accent/10 text-accent border-accent/30" },
  fornecedor: { label: "Fornecedor", className: "bg-highlight/15 text-foreground border-highlight/40" },
  usuario: { label: "Usuário", className: "bg-primary/10 text-primary border-primary/30" },
};

const typeConfig: Record<PersonType, { className: string }> = {
  PF: { className: "bg-primary/10 text-primary" },
  PJ: { className: "bg-accent/10 text-accent" },
};

const getInitials = (name: string) =>
  name
    .replace(/^\d+[.\d]*\s*/, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

const tabs = [
  { key: "todos", label: "Todos", icon: Users },
  { key: "clientes", label: "Clientes", icon: Users },
  { key: "fornecedores", label: "Fornecedores", icon: Users },
] as const;

type TabKey = typeof tabs[number]["key"];

const PAGE_SIZE = 8;

const RowAction = ({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: typeof Pencil;
  label: string;
  onClick?: () => void;
  variant?: "default" | "destructive";
}) => (
  <button
    title={label}
    aria-label={label}
    onClick={onClick}
    className={cn(
      "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors",
      "hover:bg-secondary hover:text-foreground",
      variant === "destructive" && "hover:bg-destructive/10 hover:text-destructive"
    )}
  >
    <Icon className="h-4 w-4" />
  </button>
);

const Perfis = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("todos");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const counts = useMemo(
    () => ({
      todos: perfis.length,
      clientes: perfis.filter((p) => p.roles.includes("cliente")).length,
      fornecedores: perfis.filter((p) => p.roles.includes("fornecedor")).length,
    }),
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return perfis.filter((p) => {
      if (activeTab === "clientes" && !p.roles.includes("cliente")) return false;
      if (activeTab === "fornecedores" && !p.roles.includes("fornecedor")) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.document.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q)
      );
    });
  }, [activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Perfis</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerencie clientes, fornecedores e usuários em um só lugar
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Perfil
          </Button>
        </header>

        {/* Toolbar */}
        <div className="mb-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Tabs */}
            <div className="inline-flex w-fit items-center gap-1 rounded-lg bg-secondary p-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                const count = counts[tab.key];
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setPage(1);
                    }}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                    <span
                      className={cn(
                        "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-background text-muted-foreground"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Buscar por nome, documento, e-mail…"
                  className="pl-9 pr-9"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    aria-label="Limpar busca"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {filtered.length} {filtered.length === 1 ? "perfil encontrado" : "perfis encontrados"}
            </span>
          </div>
        </div>

        {/* Table — desktop */}
        <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3">Perfil</th>
                  <th className="px-5 py-3">Contato</th>
                  <th className="px-5 py-3">Documento</th>
                  <th className="px-5 py-3">Localização</th>
                  <th className="px-5 py-3">Papéis</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-muted-foreground">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                          <Users className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Nenhum perfil encontrado</p>
                        <p className="text-xs">Ajuste os filtros ou crie um novo perfil.</p>
                      </div>
                    </td>
                  </tr>
                )}

                {pageItems.map((p, idx) => (
                  <tr
                    key={p.id}
                    className={cn(
                      "group border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/30",
                      idx % 2 === 1 && "bg-secondary/10"
                    )}
                  >
                    {/* Perfil */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                            typeConfig[p.type].className
                          )}
                        >
                          {getInitials(p.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-foreground">
                              {p.name}
                            </span>
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[10px] font-bold",
                                typeConfig[p.type].className
                              )}
                            >
                              {p.type}
                            </span>
                          </div>
                          {p.fantasyName && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Fantasia: <span className="font-medium">{p.fantasyName}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contato */}
                    <td className="px-5 py-3.5 text-sm">
                      <div className="space-y-1">
                        {p.email ? (
                          <div className="flex items-center gap-1.5 text-foreground">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="max-w-[200px] truncate" title={p.email}>
                              {p.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/60">—</span>
                        )}
                        {p.phone && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{p.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Documento */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-foreground">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        {p.document}
                      </div>
                    </td>

                    {/* Localização */}
                    <td className="px-5 py-3.5 text-sm">
                      {p.city ? (
                        <div className="flex items-center gap-1.5 text-foreground">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            {p.city}
                            {p.uf && <span className="text-muted-foreground"> / {p.uf}</span>}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </td>

                    {/* Papéis */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {p.roles.map((r) => (
                          <span
                            key={r}
                            className={cn(
                              "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
                              roleConfig[r].className
                            )}
                          >
                            {roleConfig[r].label}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-0.5 opacity-60 transition-opacity group-hover:opacity-100">
                        <RowAction icon={BarChart3} label="Estatísticas" />
                        <RowAction icon={Pencil} label="Editar" />
                        <RowAction icon={Trash2} label="Excluir" variant="destructive" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-5 py-3 text-xs text-muted-foreground">
              <span>
                Página <span className="font-semibold text-foreground">{currentPage}</span> de{" "}
                <span className="font-semibold text-foreground">{totalPages}</span>
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 gap-1"
                >
                  Próxima <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Cards — mobile */}
        <div className="space-y-3 md:hidden">
          {pageItems.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                    typeConfig[p.type].className
                  )}
                >
                  {getInitials(p.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-foreground">{p.name}</h3>
                      {p.fantasyName && (
                        <p className="text-xs text-muted-foreground">Fantasia: {p.fantasyName}</p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold",
                        typeConfig[p.type].className
                      )}
                    >
                      {p.type}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3 w-3" /> {p.document}
                    </div>
                    {p.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3" /> <span className="truncate">{p.email}</span>
                      </div>
                    )}
                    {p.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3" /> {p.phone}
                      </div>
                    )}
                    {p.city && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" /> {p.city}
                        {p.uf && ` / ${p.uf}`}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.roles.map((r) => (
                      <span
                        key={r}
                        className={cn(
                          "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
                          roleConfig[r].className
                        )}
                      >
                        {roleConfig[r].label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-1 border-t border-border pt-3">
                <RowAction icon={BarChart3} label="Estatísticas" />
                <RowAction icon={Pencil} label="Editar" />
                <RowAction icon={Trash2} label="Excluir" variant="destructive" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Perfis;
