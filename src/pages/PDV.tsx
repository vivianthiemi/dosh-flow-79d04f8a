import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  LogOut,
  ClipboardList,
  DoorClosed,
  Percent,
  DollarSign,
  LayoutGrid,
  Sparkles,
  X,
  ArrowUpDown,
  ScanLine,
  ScanBarcode,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Produto = {
  id: string;
  sku: string;
  nome: string;
  fornecedor: string;
  preco: number;
};

type ItemVenda = Produto & { qtd: number };

const MOCK_PRODUTOS: Produto[] = [
  { id: "1", sku: "06314308959", nome: "Body Scrub 412 VIP Rose", fornecedor: "Caplife", preco: 10 },
  { id: "2", sku: "1072", nome: "Body Scrub Esfoliante Corporal 412 Vip Rosé", fornecedor: "Caplife", preco: 10 },
  { id: "3", sku: "1060", nome: "Body Splash 412 Vip Rosé", fornecedor: "Caplife", preco: 10 },
  { id: "4", sku: "1083", nome: "Body Splash 412 Vip Rosé", fornecedor: "Caplife", preco: 10 },
  { id: "5", sku: "35", nome: "Bruma/glow - Glow Ouro", fornecedor: "Porán", preco: 10 },
  { id: "6", sku: "201", nome: "Hidratante Facial Vitamina C", fornecedor: "Porán", preco: 24.9 },
  { id: "7", sku: "202", nome: "Sérum Antiidade Retinol", fornecedor: "Porán", preco: 49.9 },
  { id: "8", sku: "303", nome: "Protetor Solar FPS 50", fornecedor: "Caplife", preco: 39.9 },
];

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function PDV() {
  const [busca, setBusca] = useState("");
  const [destacado, setDestacado] = useState(0);
  const [itens, setItens] = useState<ItemVenda[]>([]);
  const [descontoTipo, setDescontoTipo] = useState<"%" | "$">("%");
  const [desconto, setDesconto] = useState(0);
  const [scanMode, setScanMode] = useState(false);
  const [lastScan, setLastScan] = useState<{ sku: string; nome: string; ok: boolean } | null>(null);
  const buscaRef = useRef<HTMLInputElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);
  const scanBufferRef = useRef("");
  const scanTimerRef = useRef<number | null>(null);

  const resultados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return MOCK_PRODUTOS;
    return MOCK_PRODUTOS.filter(
      (p) =>
        p.nome.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.fornecedor.toLowerCase().includes(q),
    );
  }, [busca]);

  // Atalhos: foco na busca + navegação
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        buscaRef.current?.focus();
        buscaRef.current?.select();
      } else if (e.key === "F4") {
        e.preventDefault();
        setBusca("");
      } else if (e.key === "Escape") {
        setBusca("");
        buscaRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Reset destaque quando muda busca
  useEffect(() => {
    setDestacado(0);
  }, [busca]);

  // Scroll para o item destacado
  useEffect(() => {
    const el = listaRef.current?.querySelector<HTMLDivElement>(
      `[data-idx="${destacado}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [destacado]);

  const adicionarItem = (p: Produto) => {
    setItens((curr) => {
      const existente = curr.find((i) => i.id === p.id);
      if (existente) {
        return curr.map((i) =>
          i.id === p.id ? { ...i, qtd: i.qtd + 1 } : i,
        );
      }
      return [...curr, { ...p, qtd: 1 }];
    });
    if (!scanMode) {
      buscaRef.current?.focus();
      buscaRef.current?.select();
    }
  };

  // Modo escaneamento: captura globalmente o input do leitor (USB/teclado)
  // e ao receber Enter procura o SKU exato e adiciona ao carrinho.
  useEffect(() => {
    if (!scanMode) return;
    buscaRef.current?.blur();

    const resetBuffer = () => {
      scanBufferRef.current = "";
      if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    };

    const onKey = (e: KeyboardEvent) => {
      // Ignora teclas de função / atalhos já tratados
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "F2" || e.key === "F4" || e.key === "Escape") return;

      if (e.key === "Enter") {
        e.preventDefault();
        const code = scanBufferRef.current.trim();
        resetBuffer();
        if (!code) return;
        const p = MOCK_PRODUTOS.find(
          (x) => x.sku.toLowerCase() === code.toLowerCase(),
        );
        if (p) {
          adicionarItem(p);
          setLastScan({ sku: p.sku, nome: p.nome, ok: true });
          toast.success(`Adicionado: ${p.nome}`, { description: `SKU ${p.sku}` });
        } else {
          setLastScan({ sku: code, nome: "Produto não encontrado", ok: false });
          toast.error(`SKU não encontrado: ${code}`);
        }
        return;
      }

      if (e.key.length === 1) {
        // Evita digitar em outros campos enquanto o modo está ativo
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
          target.blur();
        }
        e.preventDefault();
        scanBufferRef.current += e.key;
        if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
        // Reseta buffer se ficar inativo por >300ms (digitação humana)
        scanTimerRef.current = window.setTimeout(resetBuffer, 300);
      }
    };

    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      resetBuffer();
    };
  }, [scanMode]);

  const alterarQtd = (id: string, delta: number) => {
    setItens((curr) =>
      curr
        .map((i) => (i.id === id ? { ...i, qtd: i.qtd + delta } : i))
        .filter((i) => i.qtd > 0),
    );
  };

  const removerItem = (id: string) => {
    setItens((curr) => curr.filter((i) => i.id !== id));
  };

  const handleBuscaKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setDestacado((d) => Math.min(d + 1, resultados.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setDestacado((d) => Math.max(d - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const p = resultados[destacado];
      if (p) adicionarItem(p);
    }
  };

  const subtotal = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
  const totalItens = itens.reduce((s, i) => s + i.qtd, 0);
  const valorDesconto =
    descontoTipo === "%" ? (subtotal * desconto) / 100 : Math.min(desconto, subtotal);
  const total = Math.max(subtotal - valorDesconto, 0);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4">
          <Button variant="outline" size="sm" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            ADM
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold">PDV</span>
            <Badge variant="outline" className="font-normal">
              Glow 10 Penápolis
            </Badge>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
              PDV #01
            </Badge>
            <Badge className="bg-emerald-600 hover:bg-emerald-600">
              Turno aberto · {totalItens} vendas
            </Badge>
            <Button
              variant={scanMode ? "default" : "outline"}
              size="sm"
              onClick={() => setScanMode((v) => !v)}
              className={cn(
                "gap-2",
                scanMode && "bg-emerald-600 text-primary-foreground hover:bg-emerald-700",
              )}
              aria-pressed={scanMode}
            >
              <ScanBarcode className="h-4 w-4" />
              {scanMode ? "Escaneando" : "Escanear"}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <DoorClosed className="h-4 w-4" /> Fechar Turno
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <ClipboardList className="h-4 w-4" /> Turnos
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
        <div className="hidden border-t bg-muted/40 px-4 py-1 text-xs text-muted-foreground md:block">
          <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono">F2</kbd> Busca ·{" "}
          <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono">↑↓</kbd> Navegar ·{" "}
          <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono">Enter</kbd> Adicionar ·{" "}
          <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono">F4</kbd> Limpar ·{" "}
          <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono">Esc</kbd> Cancelar ·{" "}
          <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono">F12</kbd> Finalizar
        </div>
      </header>

      <div className="grid gap-4 p-4 lg:grid-cols-[1fr_360px]">
        {/* Coluna principal */}
        <div className="space-y-3">
          {/* Modo escaneamento */}
          {scanMode && (
            <div className="flex items-center gap-3 rounded-lg border-2 border-emerald-500/60 bg-emerald-50 px-4 py-3 shadow-sm">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-primary-foreground">
                <ScanLine className="h-5 w-5" />
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/40" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-900">
                  Modo escaneamento ativo
                </p>
                <p className="text-xs text-emerald-800/80">
                  {lastScan
                    ? lastScan.ok
                      ? `Último: ${lastScan.sku} · ${lastScan.nome}`
                      : `SKU não encontrado: ${lastScan.sku}`
                    : "Aponte o leitor para o código de barras…"}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setScanMode(false)}
                className="gap-2"
              >
                <X className="h-4 w-4" /> Sair
              </Button>
            </div>
          )}

          {/* Busca */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={buscaRef}
              autoFocus
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={handleBuscaKey}
              placeholder="Leia o código de barras ou digite SKU / nome / fornecedor"
              className="h-14 border-2 border-primary/50 pl-10 pr-10 text-base shadow-sm focus-visible:border-primary focus-visible:ring-primary/20"
            />
            {busca && (
              <button
                onClick={() => setBusca("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Resultados */}
          {busca && (
            <div
              ref={listaRef}
              className="max-h-72 overflow-y-auto rounded-lg border bg-background shadow-sm"
            >
              {resultados.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Nenhum produto encontrado para "{busca}"
                </div>
              )}
              {resultados.map((p, idx) => {
                const ativo = idx === destacado;
                return (
                  <div
                    key={p.id}
                    data-idx={idx}
                    onMouseEnter={() => setDestacado(idx)}
                    onClick={() => adicionarItem(p)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 border-l-4 px-3 py-2.5 text-sm transition-colors",
                      ativo
                        ? "border-l-primary bg-primary/10 ring-1 ring-inset ring-primary/30"
                        : "border-l-transparent hover:bg-muted/60",
                    )}
                  >
                    {ativo && (
                      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        <ArrowUpDown className="h-3 w-3" /> Enter
                      </div>
                    )}
                    <span className="w-28 truncate font-mono text-xs text-muted-foreground">
                      {p.sku}
                    </span>
                    <span className={cn("flex-1 truncate", ativo && "font-semibold")}>
                      {p.nome}
                    </span>
                    <Badge variant="outline" className="font-normal">
                      {p.fornecedor}
                    </Badge>
                    <span className="w-20 text-right font-semibold tabular-nums">
                      {brl(p.preco)}
                    </span>
                    <Button
                      size="icon"
                      variant={ativo ? "default" : "ghost"}
                      className="h-8 w-8 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        adicionarItem(p);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Carrinho */}
          <div className="rounded-lg border bg-background shadow-sm">
            <div className="grid grid-cols-[40px_120px_1fr_90px_100px_110px_40px] items-center gap-2 border-b bg-muted/40 px-3 py-2 text-xs font-semibold text-muted-foreground">
              <span>#</span>
              <span>SKU</span>
              <span>Produto</span>
              <span className="text-center">Qtd</span>
              <span className="text-right">Unit.</span>
              <span className="text-right">Total</span>
              <span></span>
            </div>
            {itens.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-muted-foreground">
                <ShoppingBag className="h-10 w-10 opacity-40" />
                <p className="text-sm">
                  Leia um código de barras ou digite para iniciar a venda
                </p>
              </div>
            ) : (
              itens.map((i, idx) => (
                <div
                  key={i.id}
                  className="grid grid-cols-[40px_120px_1fr_90px_100px_110px_40px] items-center gap-2 border-b px-3 py-2 text-sm last:border-b-0"
                >
                  <span className="text-muted-foreground">{idx + 1}</span>
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {i.sku}
                  </span>
                  <span className="truncate">{i.nome}</span>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => alterarQtd(i.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center tabular-nums">{i.qtd}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => alterarQtd(i.id, +1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-right tabular-nums">{brl(i.preco)}</span>
                  <span className="text-right font-semibold tabular-nums">
                    {brl(i.preco * i.qtd)}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removerItem(i.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar resumo */}
        <aside className="space-y-3">
          <div className="rounded-lg border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Itens</span>
              <span className="font-semibold tabular-nums">{totalItens}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Produtos</span>
              <span className="font-semibold tabular-nums">{itens.length}</span>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-base font-semibold tabular-nums">
                {brl(subtotal)}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <span className="text-sm text-muted-foreground">Desconto</span>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant={descontoTipo === "%" ? "default" : "outline"}
                  onClick={() => setDescontoTipo("%")}
                  className="h-9 w-9"
                >
                  <Percent className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={descontoTipo === "$" ? "default" : "outline"}
                  onClick={() => setDescontoTipo("$")}
                  className="h-9 w-9"
                >
                  <DollarSign className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min={0}
                  value={desconto || ""}
                  onChange={(e) => setDesconto(Number(e.target.value) || 0)}
                  onFocus={(e) => e.currentTarget.select()}
                  placeholder={descontoTipo === "%" ? "0%" : "R$ 0,00"}
                  className="h-9 text-right tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border-2 border-primary/40 bg-primary/5 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total a pagar
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-primary">
              {brl(total)}
            </p>
          </div>

          <Button
            disabled={itens.length === 0}
            className="h-12 w-full text-base font-semibold"
          >
            Finalizar Venda
            <kbd className="ml-2 rounded bg-primary-foreground/20 px-1.5 py-0.5 text-xs font-mono">
              F12
            </kbd>
          </Button>
        </aside>
      </div>
    </div>
  );
}
