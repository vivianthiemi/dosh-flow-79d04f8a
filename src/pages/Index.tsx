import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Truck,
  Landmark,
  Users,
  Copy,
} from "lucide-react";
import SectionCard from "@/components/SectionCard";
import InfoField from "@/components/InfoField";
import SupplierCard from "@/components/SupplierCard";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const companyData = {
  nomeFantasia: "GLOBOX COSMÉTICOS",
  razaoSocial: "GLOBOX COSMETICOS LTDA",
  cnpj: "64.795.585/0001-66",
  abertura: "29/01/2026",
  ie: "521.224.310.119",
  im: "—",
  nire: "35269024963",
  telefone: "(18) 99145-5226",
  endereco: "Rua Duque de Caxias, 6b",
  bairro: "Centro",
  cidade: "Piratininga/SP",
  cep: "17490-056",
  emailComercial: "vendas@globoxcosmeticos.com.br",
  emailNfe: "nfe@globoxcosmeticos.com.br",
  emailFinanceiro: "financeiro@globoxcosmeticos.com.br",
  whatsappFinanceiro: "(14) 99135-3133",
};

const deliveryAddress = {
  endereco: "Rua Augusto Pereira de Moraes, 451",
  bairro: "Vila Martins",
  cidade: "Penápolis/SP",
  cep: "16306-030",
};

const bankData = {
  banco: "SICREDI — 748",
  agencia: "3021",
  conta: "73020-3",
  chavePix: "64.795.585/0001-66",
};

const suppliers = [
  { name: "CÉLIA & JUNIOR", responsible: "Islene Ingride", contact: "(11) 91489-4826", city: "São Paulo/SP" },
  { name: "DERMACHEM", responsible: "Thália Xaraba", contact: "(17) 99238-5704", city: "São José do Rio Preto/SP" },
  { name: "RHENUKS", responsible: "Felipe", contact: "(18) 99676-4856", city: "Coroados/SP" },
];

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copiado!");
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {companyData.nomeFantasia}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {companyData.razaoSocial}
              </p>
            </div>
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">
              Ativa
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6">
        {/* Dados da Empresa */}
        <SectionCard title="Dados Cadastrais" icon={<Building2 className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
            <InfoField label="CNPJ" value={companyData.cnpj} />
            <InfoField label="Data Abertura" value={companyData.abertura} />
            <InfoField label="Inscrição Estadual" value={companyData.ie} />
            <InfoField label="NIRE" value={companyData.nire} />
            <InfoField label="Inscrição Municipal" value={companyData.im} />
            <InfoField label="Telefone" value={companyData.telefone} />
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Endereço" value={companyData.endereco} />
              <InfoField label="Bairro" value={companyData.bairro} />
              <div className="flex gap-6">
                <InfoField label="Cidade/UF" value={companyData.cidade} />
                <InfoField label="CEP" value={companyData.cep} />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Contatos / E-mails */}
        <SectionCard title="E-mails e Contatos" icon={<Mail className="h-4 w-4" />}>
          <div className="space-y-3">
            {[
              { label: "E-mail Comercial", value: companyData.emailComercial, hint: "" },
              { label: "E-mail Financeiro (DANFE + Boleto)", value: companyData.emailFinanceiro, hint: "Enviar cópia da DANFE em PDF e Boleto" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3"
              >
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </span>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                  {item.hint && (
                    <p className="mt-0.5 text-xs text-muted-foreground italic">{item.hint}</p>
                  )}
                </div>
                <button
                  onClick={() => copyToClipboard(item.value)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  title="Copiar"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            ))}

            <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <Phone className="h-4 w-4 text-primary" />
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  WhatsApp Financeiro
                </span>
                <p className="text-sm font-medium text-foreground">{companyData.whatsappFinanceiro}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Endereço de Entrega */}
          <SectionCard title="Endereço de Entrega" icon={<Truck className="h-4 w-4" />}>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{deliveryAddress.endereco}</p>
                <p className="text-sm text-muted-foreground">
                  {deliveryAddress.bairro} — {deliveryAddress.cidade}
                </p>
                <p className="text-sm text-muted-foreground">CEP: {deliveryAddress.cep}</p>
                <p className="mt-2 text-xs italic text-muted-foreground">
                  Recebimento em horário comercial
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Dados Bancários */}
          <SectionCard title="Dados Bancários" icon={<Landmark className="h-4 w-4" />}>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Banco" value={bankData.banco} />
              <InfoField label="Agência" value={bankData.agencia} />
              <InfoField label="Conta" value={bankData.conta} />
              <div className="space-y-1">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Chave PIX
                </span>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-foreground">{bankData.chavePix}</p>
                  <button
                    onClick={() => copyToClipboard(bankData.chavePix)}
                    className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copiar PIX"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Referência Comercial */}
        <SectionCard title="Referência Comercial" icon={<Users className="h-4 w-4" />}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((s) => (
              <SupplierCard key={s.name} {...s} />
            ))}
          </div>
        </SectionCard>
      </main>
    </div>
  );
};

export default Index;
