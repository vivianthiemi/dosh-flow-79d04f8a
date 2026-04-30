import { useState } from "react";
import { Plus, Trash2, Calculator, Package, TrendingUp, DollarSign } from "lucide-react";
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
  linha: string;
  qtdBox: number;
  qtd: number;
  valorUnit: number;
  margem: number;
}

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const novoItem = (): CotacaoItem => ({
  id: crypto.randomUUID(),
  codigo: "",
  nome: "",
  linha: "",
  qtdBox: 1,
  qtd: 1,
  valorUnit: 0,
  margem: 30,
});

const Precificacao = () => {
  const [items, setItems] = useState<CotacaoItem[]>([
    { id: crypto.randomUUID(), codigo: "SL12", nome: "Amor MM5+ Cilios Posticos - 5DCilios", linha: "Amor Anjo", qtdBox: 12, qtd: 12, valorUnit: 9.20, margem: 30 },
    { id: crypto.randomUUID(), codigo: "SP 2155", nome: "Kit e Esponja", linha: "Ss", qtdBox: 12, qtd: 12, valorUnit: 7.20, margem: 30 },
    { id: crypto.randomUUID(), codigo: "MOC 2353", nome: "Lip Oil Stawbery", linha: "Moc MAllure", qtdBox: 12, qtd: 12, valorUnit: 10.50, margem: 30 },
    { id: crypto.randomUUID(), codigo: "HL6185", nome: "Lip Oil Unicornio", linha: "Hold Morning", qtdBox: 12, qtd: 12, valorUnit: 8.40, margem: 30 },
    { id: crypto.randomUUID(), codigo: "MM087", nome: "Esponja Chanfrada", linha: "Mandala", qtdBox: 12, qtd: 12, valorUnit: 1.35, margem: 30 },
    { id: crypto.randomUUID(), codigo: "FR052", nome: "Paleta de sombra Eye Lux", linha: "Femme Paris", qtdBox: 24, qtd: 24, valorUnit: 5.30, margem: 30 },
    { id: crypto.randomUUID(), codigo: "YL151", nome: "Mascara Cilios", linha: "Yalanni", qtdBox: 12, qtd: 12, valorUnit: 4.60, margem: 30 },
    { id: crypto.randomUUID(), codigo: "AMOR B03", nome: "Cilios Posticos", linha: "Amor Anjo", qtdBox: 12, qtd: 12, valorUnit: 7.20, margem: 30 },
  ]);

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

  const lucroPrev = totais.venda - totais.custo;
  const margemMedia = totais.venda > 0 ? (lucroPrev / totais.venda) * 100 : 0;

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
        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Package className="h-3.5 w-3.5" />
              <span className="text-xs uppercase tracking-wider font-medium">Itens cotados</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{items.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{totais.qtd} unidades</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-3.5 w-3.5" />
              <span className="text-xs uppercase tracking-wider font-medium">Custo total</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totais.custo)}</p>
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
              <span className="text-xs uppercase tracking-wider font-medium">Margem média</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{margemMedia.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Lucro {formatCurrency(lucroPrev)}</p>
          </div>
        </div>

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
                  <TableHead className="min-w-[140px]">Linha</TableHead>
                  <TableHead className="text-center">Qtd.</TableHead>
                  <TableHead className="text-center">Qtd. / Box</TableHead>
                  <TableHead className="text-right">R$ Un.</TableHead>
                  <TableHead className="text-right">R$ Total</TableHead>
                  <TableHead className="text-center">Margem</TableHead>
                  <TableHead className="text-right">R$ Venda</TableHead>
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
                          value={it.linha}
                          placeholder="Linha / marca"
                          onChange={(e) => updateItem(it.id, "linha", e.target.value)}
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
                    <TableCell colSpan={11} className="text-center text-sm text-muted-foreground py-10">
                      Nenhum item adicionado. Clique em "Adicionar item" para começar a cotação.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {items.length > 0 && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={5} className="text-sm text-muted-foreground">
                      Total: <strong>{items.length}</strong> itens
                    </TableCell>
                    <TableCell className="text-center font-semibold">{totais.qtd}</TableCell>
                    <TableCell />
                    <TableCell className="text-center text-sm font-medium text-emerald-600">
                      {margemMedia.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-600">
                      {formatCurrency(totais.venda)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(totais.custo)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>
              )}
            </Table>
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
