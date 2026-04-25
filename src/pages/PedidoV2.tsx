import {
  FileText,
  User,
  MapPin,
  Package,
  CreditCard,
  Printer,
  CheckCircle2,
  Calendar,
  Hash,
} from "lucide-react";
import SectionCard from "@/components/SectionCard";
import InfoField from "@/components/InfoField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import globoxLogo from "@/assets/globox-logo.png";

const orderData = {
  numero: "PED-2026-0184",
  data: "24/04/2026",
  status: "Aprovado",
  consultor: "Maria Silva",
};

const cliente = {
  nome: "João Pedro Almeida",
  telefone: "(18) 99876-5432",
};

const enderecoEntrega = {
  cep: "16306-030",
  rua: "Rua Augusto Pereira de Moraes, 451",
  bairro: "Vila Martins",
  cidade: "Penápolis/SP",
  complemento: "Casa dos fundos",
};

const items = [
  { id: 1, nome: "Shampoo Hidratante 300ml", qtd: 2, valor: 32.9 },
  { id: 2, nome: "Condicionador Reparador 300ml", qtd: 2, valor: 34.5 },
  { id: 3, nome: "Máscara Capilar Intensiva 250g", qtd: 1, valor: 58.0 },
  { id: 4, nome: "Óleo Capilar 60ml", qtd: 1, valor: 45.9 },
];

const subtotal = items.reduce((acc, i) => acc + i.qtd * i.valor, 0);
const frete = 12.5;
const total = subtotal + frete;
const totalQtd = items.reduce((acc, i) => acc + i.qtd, 0);

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const PedidoV2 = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card print:border-b-2">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={globoxLogo} alt="Globox Cosméticos" className="h-16 w-auto sm:h-20" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Pedido de Venda
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Globox Cosméticos
                </p>
              </div>
            </div>
            <Button
              onClick={() => window.print()}
              variant="outline"
              size="sm"
              className="print:hidden"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6">
        {/* Resumo do Pedido */}
        <SectionCard title="Resumo do Pedido" icon={<FileText className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Número
              </span>
              <p className="flex items-center gap-1 text-sm font-medium text-foreground">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                {orderData.numero}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Data
              </span>
              <p className="flex items-center gap-1 text-sm font-medium text-foreground">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {orderData.data}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </span>
              <Badge className="gap-1 bg-accent text-accent-foreground hover:bg-accent">
                <CheckCircle2 className="h-3 w-3" />
                {orderData.status}
              </Badge>
            </div>
            <InfoField label="Consultor" value={orderData.consultor} />
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Cliente */}
          <SectionCard title="Cliente" icon={<User className="h-4 w-4" />}>
            <div className="space-y-4">
              <InfoField label="Nome" value={cliente.nome} />
              <InfoField label="Telefone" value={cliente.telefone} />
            </div>
          </SectionCard>

          {/* Endereço de Entrega */}
          <SectionCard title="Endereço de Entrega" icon={<MapPin className="h-4 w-4" />}>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{enderecoEntrega.rua}</p>
                <p className="text-sm text-muted-foreground">
                  {enderecoEntrega.bairro} — {enderecoEntrega.cidade}
                </p>
                <p className="text-sm text-muted-foreground">CEP: {enderecoEntrega.cep}</p>
                {enderecoEntrega.complemento && (
                  <p className="mt-1 text-xs italic text-muted-foreground">
                    {enderecoEntrega.complemento}
                  </p>
                )}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Itens */}
        <SectionCard title="Itens do Pedido" icon={<Package className="h-4 w-4" />}>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.nome}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.qtd} × {formatBRL(item.valor)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-foreground">
                  {formatBRL(item.qtd * item.valor)}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-5" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal ({totalQtd} {totalQtd === 1 ? "item" : "itens"})
              </span>
              <span className="font-medium text-foreground">{formatBRL(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frete</span>
              <span className="font-medium text-foreground">{formatBRL(frete)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Total
              </span>
              <span className="text-2xl font-bold text-primary">{formatBRL(total)}</span>
            </div>
          </div>
        </SectionCard>

        {/* Pagamento */}
        <SectionCard title="Pagamento" icon={<CreditCard className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            <InfoField label="Forma" value="PIX" />
            <InfoField label="Condição" value="À vista" />
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Situação
              </span>
              <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                Pago
              </Badge>
            </div>
          </div>
        </SectionCard>

        <p className="pt-2 text-center text-xs text-muted-foreground">
          Documento gerado automaticamente · Globox Cosméticos
        </p>
      </main>
    </div>
  );
};

export default PedidoV2;
