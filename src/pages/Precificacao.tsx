import { useState } from "react";
import { Plus, Trash2, Calculator, Package, TrendingUp, DollarSign, Fuel, UtensilsCrossed, ParkingSquare, Receipt, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

interface CotacaoItem {
  id: string;
  codigo: string;
  nome: string;
  marca: string;
  qtdBox: number;
  qtd: number;
  valorUnit: number;
  margem: number;
  fornecedor: string;
}

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const novoItem = (): CotacaoItem => ({
  id: crypto.randomUUID(),
  codigo: "",
  nome: "",
  marca: "",
  qtdBox: 1,
  qtd: 1,
  valorUnit: 0,
  margem: 30,
  fornecedor: "",
});

const Precificacao = () => {
  const [items, setItems] = useState<CotacaoItem[]>([
    { id: crypto.randomUUID(), codigo: "SL12", nome: "Amor MM5+ Cilios Posticos - 5DCilios", marca: "Amor Anjo", qtdBox: 12, qtd: 12, valorUnit: 9.20, margem: 30, fornecedor: "Seven" },
    { id: crypto.randomUUID(), codigo: "SP 2155", nome: "Kit e Esponja", marca: "Ss", qtdBox: 12, qtd: 12, valorUnit: 7.20, margem: 30, fornecedor: "Seven" },
    { id: crypto.randomUUID(), codigo: "MOC 2353", nome: "Lip Oil Stawbery", marca: "Moc MAllure", qtdBox: 12, qtd: 12, valorUnit: 10.50, margem: 30, fornecedor: "Seven" },
    { id: crypto.randomUUID(), codigo: "HL6185", nome: "Lip Oil Unicornio", marca: "Hold Morning", qtdBox: 12, qtd: 12, valorUnit: 8.40, margem: 30, fornecedor: "Seven" },
    { id: crypto.randomUUID(), codigo: "MM087", nome: "Esponja Chanfrada", marca: "Mandala", qtdBox: 12, qtd: 12, valorUnit: 1.35, margem: 30, fornecedor: "Seven" },
    { id: crypto.randomUUID(), codigo: "FR052", nome: "Paleta de sombra Eye Lux", marca: "Femme Paris", qtdBox: 24, qtd: 24, valorUnit: 5.30, margem: 30, fornecedor: "Seven" },
    { id: crypto.randomUUID(), codigo: "YL151", nome: "Mascara Cilios", marca: "Yalanni", qtdBox: 12, qtd: 12, valorUnit: 4.60, margem: 30, fornecedor: "Seven" },
    { id: crypto.randomUUID(), codigo: "AMOR B03", nome: "Cilios Posticos", marca: "Amor Anjo", qtdBox: 12, qtd: 12, valorUnit: 7.20, margem: 30, fornecedor: "Seven" },
  ]);

  const [despesas, setDespesas] = useState({
    combustivel: 0,
    alimentacao: 0,
    estacionamento: 0,
    pedagio: 0,
  });

  const updateDespesa = (field: keyof typeof despesas, value: number) =>
    setDespesas((prev) => ({ ...prev, [field]: value }));

  const updateItem = <K extends keyof CotacaoItem>(
    id: string,
    field: K,
    value: CotacaoItem[K],
  ) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)),
    );
  };

  const addItem = () => setItems((prev) => [...prev, novoItem()]);
  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const calcTotal = (it: CotacaoItem) => it.qtd * it.valorUnit;
  const calcVenda = (it: CotacaoItem) => it.valorUnit * (1 + it.margem / 100);

  const totais = items.reduce(
    (acc, it) => {
      const total = calcTotal(it);
      const totalVenda = calcVenda(it) * it.qtd;
      acc.qtd += it.qtd;
      acc.custo += total;
      acc.venda += totalVenda;
      return acc;
    },
    { qtd: 0, custo: 0, venda: 0 },
  );

  const totalDespesas =
    despesas.combustivel + despesas.alimentacao + despesas.estacionamento + despesas.pedagio;

  // Custo total = custo dos itens + despesas rateadas (afetam margem real)
  const custoTotalReal = totais.custo + totalDespesas;
  const lucroPrev = totais.venda - custoTotalReal;
  const margemMedia = totais.venda > 0 ? (lucroPrev / totais.venda) * 100 : 0;

  // Custo por fornecedor — despesas de viagem são rateadas por unidade
  // (despesa total ÷ total de unidades). Cada fornecedor recebe a soma
  // proporcional à quantidade de unidades que fornece.
  const despesaPorUnidade = totais.qtd > 0 ? totalDespesas / totais.qtd : 0;
  const custoPorFornecedor = (() => {
    const map = new Map<string, { custoItens: number; qtdItens: number; qtdUnidades: number }>();
    items.forEach((it) => {
      const key = it.fornecedor || "Sem fornecedor";
      const cur = map.get(key) ?? { custoItens: 0, qtdItens: 0, qtdUnidades: 0 };
      cur.custoItens += calcTotal(it);
      cur.qtdItens += 1;
      cur.qtdUnidades += it.qtd;
      map.set(key, cur);
    });
    return Array.from(map.entries())
      .map(([fornecedor, v]) => ({
        fornecedor,
        qtdItens: v.qtdItens,
        qtdUnidades: v.qtdUnidades,
        custoItens: v.custoItens,
        despesasRateio: despesaPorUnidade * v.qtdUnidades,
        custoTotal: v.custoItens + despesaPorUnidade * v.qtdUnidades,
      }))
      .sort((a, b) => b.custoTotal - a.custoTotal);
  })();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Precificação & Cotação de Compras
              </h1>
              <p className="text-xs text-muted-foreground">
                Calcule custo, margem e preço de venda dos itens cotados
              </p>
            </div>
          </div>
          <Button onClick={addItem} size="sm">
            <Plus className="mr-1 h-4 w-4" /> Adicionar item
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {/* Tabela */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-primary/5 px-5 py-3">
            <Package className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
              Itens em cotação
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="min-w-[100px]">Cód.</TableHead>
                  <TableHead className="min-w-[220px]">Descrição</TableHead>
                  <TableHead className="min-w-[140px]">Marca</TableHead>
                  <TableHead className="text-center">Qtd.</TableHead>
                  <TableHead className="text-center">Qtd. / Box</TableHead>
                  <TableHead className="text-right">R$ Un.</TableHead>
                  <TableHead className="text-right">R$ Total</TableHead>
                  <TableHead className="text-center">Margem</TableHead>
                  <TableHead className="text-right">R$ Venda</TableHead>
                  <TableHead className="min-w-[140px]">Fornecedor</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it, idx) => {
                  const total = calcTotal(it);
                  const venda = calcVenda(it);
                  return (
                    <TableRow key={it.id}>
                      <TableCell className="text-center text-muted-foreground font-medium">
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <Input
                          value={it.codigo}
                          placeholder="Cód."
                          onChange={(e) => updateItem(it.id, "codigo", e.target.value)}
                          className="h-9 font-mono text-xs"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={it.nome}
                          placeholder="Descrição do item"
                          onChange={(e) => updateItem(it.id, "nome", e.target.value)}
                          className="h-9"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={it.marca}
                          placeholder="Marca"
                          onChange={(e) => updateItem(it.id, "marca", e.target.value)}
                          className="h-9"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          value={it.qtd}
                          onChange={(e) => updateItem(it.id, "qtd", Number(e.target.value) || 0)}
                          className="h-9 w-20 text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={1}
                          value={it.qtdBox}
                          onChange={(e) => updateItem(it.id, "qtdBox", Number(e.target.value) || 0)}
                          className="h-9 w-20 text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={it.valorUnit}
                          onChange={(e) => updateItem(it.id, "valorUnit", Number(e.target.value) || 0)}
                          className="h-9 w-24 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(total)}
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <Input
                            type="number"
                            min={0}
                            step="0.1"
                            value={it.margem}
                            onChange={(e) => updateItem(it.id, "margem", Number(e.target.value) || 0)}
                            className="h-9 w-24 pr-7 text-right"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                            %
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        {formatCurrency(venda)}
                      </TableCell>
                      <TableCell>
                        <Input
                          value={it.fornecedor}
                          placeholder="Fornecedor"
                          onChange={(e) => updateItem(it.id, "fornecedor", e.target.value)}
                          className="h-9"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(it.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center text-sm text-muted-foreground py-10">
                      Nenhum item adicionado. Clique em "Adicionar item" para começar a cotação.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {items.length > 0 && (() => {
                const margemItens = totais.venda > 0 ? ((totais.venda - totais.custo) / totais.venda) * 100 : 0;
                return (
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={5} className="text-sm text-muted-foreground">
                        Total: <strong>{items.length}</strong> itens
                      </TableCell>
                      <TableCell className="text-center font-semibold">{totais.qtd}</TableCell>
                      <TableCell />
                      <TableCell className="text-right font-bold">
                        {formatCurrency(totais.custo)}
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium text-emerald-600">
                        {margemItens.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        {formatCurrency(totais.venda)}
                      </TableCell>
                      <TableCell />
                      <TableCell />
                    </TableRow>
                  </TableFooter>
                );
              })()}
            </Table>
          </div>
        </div>

        {/* Custos da Viagem */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-primary/5 px-5 py-3">
            <Truck className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
              Custos da Viagem
            </h2>
            <span className="ml-auto text-xs text-muted-foreground">
              Rateado proporcionalmente no custo dos itens
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5">
            {[
              { key: "combustivel" as const, label: "Combustível", icon: Fuel },
              { key: "alimentacao" as const, label: "Alimentação", icon: UtensilsCrossed },
              { key: "estacionamento" as const, label: "Estacionamento", icon: ParkingSquare },
              { key: "pedagio" as const, label: "Pedágio", icon: Receipt },
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    R$
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={despesas[key]}
                    onChange={(e) => updateDespesa(key, Number(e.target.value) || 0)}
                    className="h-10 pl-9 text-right font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-5 py-3">
            <span className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
              Total despesas
            </span>
            <span className="text-base font-bold text-foreground">
              {formatCurrency(totalDespesas)}
            </span>
          </div>
        </div>

        {/* Custo por Fornecedor */}
        {custoPorFornecedor.length > 0 && (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border bg-primary/5 px-5 py-3">
              <DollarSign className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
                Custo por Fornecedor
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="text-center">Itens</TableHead>
                  <TableHead className="text-right">Custo dos itens</TableHead>
                  <TableHead className="text-right">Despesas (÷ unidades)</TableHead>
                  <TableHead className="text-right">Custo total</TableHead>
                  <TableHead className="text-right">% do total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {custoPorFornecedor.map((f) => {
                  const pct = custoTotalReal > 0 ? (f.custoTotal / custoTotalReal) * 100 : 0;
                  return (
                    <TableRow key={f.fornecedor}>
                      <TableCell className="font-medium">{f.fornecedor}</TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {f.qtdItens}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(f.custoItens)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatCurrency(f.despesasRateio)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(f.custoTotal)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {pct.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="font-semibold">Total</TableCell>
                  <TableCell className="text-center font-semibold">{items.length}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totais.custo)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totalDespesas)}</TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {formatCurrency(custoTotalReal)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">100,0%</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}

        {/* Totalização (cards no final) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Package className="h-3.5 w-3.5" />
              <span className="text-xs uppercase tracking-wider font-medium">Itens cotados</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-bold text-foreground leading-none">{items.length}</p>
              <span className="text-xs text-muted-foreground">itens</span>
              <span className="text-muted-foreground/50 mx-1">·</span>
              <p className="text-base font-semibold text-foreground leading-none">{totais.qtd}</p>
              <span className="text-xs text-muted-foreground">un</span>
            </div>
            <div className="mt-3 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Rateio por unidade</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(despesaPorUnidade)}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-3.5 w-3.5" />
              <span className="text-xs uppercase tracking-wider font-medium">Custo total</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(custoTotalReal)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Itens {formatCurrency(totais.custo)} + desp. {formatCurrency(totalDespesas)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-xs uppercase tracking-wider font-medium">Venda prevista</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totais.venda)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-xs uppercase tracking-wider font-medium">Margem real</span>
            </div>
            <p className={`text-2xl font-bold ${lucroPrev >= 0 ? "text-emerald-600" : "text-destructive"}`}>
              {margemMedia.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Lucro {formatCurrency(lucroPrev)}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={addItem}>
            <Plus className="mr-1 h-4 w-4" /> Adicionar item
          </Button>
          <Button>Salvar cotação</Button>
        </div>
      </main>
    </div>
  );
};

export default Precificacao;
