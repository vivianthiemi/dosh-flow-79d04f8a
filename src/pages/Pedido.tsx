import {
  Package,
  Calendar,
  User,
  Hash,
  CreditCard,
  FileText,
  CheckCircle2,
  Printer,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import globoxLogo from "@/assets/globox-logo.png";
import globoxLogo from "@/assets/globox-logo.png";

const orderData = {
  numero: "#1000",
  status: "APROVADO",
  dataEmissao: "11/04/2026",
  consultor: "Vivian Ikehara",
  cliente: "Murilo Constantino Botelho",
};

const company = {
  nome: "Globox Cosmeticos Ltda",
  cnpj: "64.795.585/0001-66",
  telefone: "18 - 99150-7249",
  endereco: "Antonio Martins De Barros, 72, Chacara Palestina, Penapolis, SP",
};

const items = [
  {
    num: 1,
    descricao: "Body Splash Body Juice Maracuja Dermachem Laboratory 200ml",
    codigo: "7908346904057",
    un: "un",
    qtd: 10,
    valorUnit: 7.08,
    valorTotal: 70.8,
  },
  {
    num: 2,
    descricao: "Body Splash Body Juice Melancia Dermachem Laboratory 200ml",
    codigo: "7908346904002",
    un: "un",
    qtd: 10,
    valorUnit: 7.87,
    valorTotal: 78.7,
  },
];

const parcelas = [
  { parcela: "Entrada", vencimento: "10/04/2026", forma: "Boleto", valor: 29.5 },
  { parcela: "1ª parcela", vencimento: "17/04/2026", forma: "Boleto", valor: 40.0 },
  { parcela: "2ª parcela", vencimento: "24/04/2026", forma: "Boleto", valor: 40.0 },
  { parcela: "3ª parcela", vencimento: "01/05/2026", forma: "Boleto", valor: 40.0 },
];

const totalItens = items.length;
const totalQtd = items.reduce((s, i) => s + i.qtd, 0);
const totalProdutos = items.reduce((s, i) => s + i.valorTotal, 0);

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Pedido = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={globoxLogo} alt="Globox" className="h-16 w-auto" />
            <div>
              <p className="text-sm font-medium text-foreground">{company.nome}</p>
              <p className="text-xs text-muted-foreground">CNPJ: {company.cnpj}</p>
              <p className="text-xs text-muted-foreground">{company.telefone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-1 h-4 w-4" /> Imprimir
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        {/* Pedido Header Card */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Pedido {orderData.numero}
                </h1>
                <p className="text-sm text-muted-foreground">{company.endereco}</p>
              </div>
            </div>
            <Badge className="w-fit bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/15 text-sm px-3 py-1">
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              {orderData.status}
            </Badge>
          </div>

          <Separator className="my-5" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex items-start gap-2">
              <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Cliente
                </p>
                <p className="text-sm font-medium text-foreground">{orderData.cliente}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Hash className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Nº do Pedido
                </p>
                <p className="text-sm font-medium text-foreground">{orderData.numero}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Data de Emissão
                </p>
                <p className="text-sm font-medium text-foreground">{orderData.dataEmissao}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Consultor
                </p>
                <p className="text-sm font-medium text-foreground">{orderData.consultor}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-primary/5 px-5 py-3">
            <Package className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
              Itens do Pedido
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="text-center">Un.</TableHead>
                <TableHead className="text-center">Qtd.</TableHead>
                <TableHead className="text-right">R$ Unit.</TableHead>
                <TableHead className="text-right">R$ Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.num}>
                  <TableCell className="text-center font-medium">{item.num}</TableCell>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  <TableCell className="text-muted-foreground text-xs font-mono">
                    {item.codigo}
                  </TableCell>
                  <TableCell className="text-center">{item.un}</TableCell>
                  <TableCell className="text-center font-medium">{item.qtd}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.valorUnit)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(item.valorTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-sm text-muted-foreground">
                  Nº de itens: <strong>{totalItens}</strong> · Soma das Qtdes:{" "}
                  <strong>{totalQtd}</strong>
                </TableCell>
                <TableCell colSpan={2} className="text-right text-sm">
                  Total de Produtos
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(totalProdutos)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} className="text-right text-sm font-bold">
                  Total do Pedido
                </TableCell>
                <TableCell className="text-right text-lg font-bold text-primary">
                  {formatCurrency(totalProdutos)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        {/* Condições de Pagamento */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-primary/5 px-5 py-3">
            <CreditCard className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
              Condições de Pagamento
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Parcela</TableHead>
                <TableHead>Data de Vencimento</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parcelas.map((p, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{p.parcela}</TableCell>
                  <TableCell>{p.vencimento}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {p.forma}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(p.valor)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Recibo de Recebimento */}
        <div className="rounded-xl border border-dashed border-border bg-card shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-muted-foreground text-lg">✂</span>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Recibo de Recebimento
            </p>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            Recebemos de <strong>{company.nome.toUpperCase()}</strong> os produtos constantes no
            pedido de venda <strong>{orderData.numero}</strong> no valor de{" "}
            <strong>{formatCurrency(totalProdutos)}</strong>.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-6">
            {["Data de Recebimento", "Nome Legível", "Assinatura"].map((label) => (
              <div key={label} className="space-y-2">
                <div className="h-px border-b border-foreground/30" />
                <p className="text-xs text-center text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          {company.nome} · Pedido {orderData.numero} · Emitido em {orderData.dataEmissao}
        </p>
      </main>
    </div>
  );
};

export default Pedido;
