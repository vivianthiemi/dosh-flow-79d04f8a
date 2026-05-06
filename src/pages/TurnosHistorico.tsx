import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Turno {
  caixa: string;
  operador: string;
  abertura: string;
  fechamento: string;
  vendas: number;
  total: number;
  dinheiro: number;
  saldoAbertura: number;
  contado: number;
}

const turnos: Turno[] = [
  { caixa: "#01", operador: "Daniela Garcia", abertura: "05/05/26, 11:22", fechamento: "05/05/26, 21:14", vendas: 13, total: 610, dinheiro: 340, saldoAbertura: 300, contado: 640 },
  { caixa: "#01", operador: "Daniela Garcia", abertura: "04/05/26, 12:01", fechamento: "04/05/26, 21:27", vendas: 20, total: 760, dinheiro: 110, saldoAbertura: 300, contado: 760 },
  { caixa: "#01", operador: "Vivian Ikehara", abertura: "02/05/26, 07:58", fechamento: "02/05/26, 20:26", vendas: 98, total: 5892.8, dinheiro: 1420, saldoAbertura: 300, contado: 1735 },
  { caixa: "#02", operador: "Marcos Lima", abertura: "01/05/26, 08:15", fechamento: "01/05/26, 19:48", vendas: 54, total: 3120.5, dinheiro: 980, saldoAbertura: 300, contado: 1280 },
  { caixa: "#01", operador: "Vivian Ikehara", abertura: "30/04/26, 08:02", fechamento: "30/04/26, 20:11", vendas: 76, total: 4210.3, dinheiro: 1150, saldoAbertura: 300, contado: 1430 },
];

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function TurnosHistorico() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-start gap-4">
          <Link
            to="/"
            className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            PDV
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Turnos do Caixa
            </h1>
            <p className="text-sm text-muted-foreground">
              Histórico de abertura e fechamento de caixa.
            </p>
          </div>
        </header>

        {/* Desktop: tabela */}
        <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 text-left font-semibold">Caixa</th>
                  <th className="px-4 py-3 text-left font-semibold">Operador</th>
                  <th className="px-4 py-3 text-left font-semibold">Abertura</th>
                  <th className="px-4 py-3 text-left font-semibold">Fechamento</th>
                  <th className="px-4 py-3 text-right font-semibold">Vendas</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                  <th className="px-4 py-3 text-right font-semibold">Dinheiro</th>
                  <th className="px-4 py-3 text-right font-semibold">Saldo Abert.</th>
                  <th className="px-4 py-3 text-right font-semibold">Contado</th>
                  <th className="px-4 py-3 text-right font-semibold">Diferença</th>
                </tr>
              </thead>
              <tbody>
                {turnos.map((t, i) => {
                  const esperado = t.dinheiro + t.saldoAbertura;
                  const diferenca = t.contado - esperado;
                  return (
                    <tr
                      key={i}
                      className="border-b border-border/60 last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.caixa}</td>
                      <td className="px-4 py-3">{t.operador}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.abertura}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.fechamento}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{t.vendas}</td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">{fmt(t.total)}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{fmt(t.dinheiro)}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{fmt(t.saldoAbertura)}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{fmt(t.contado)}</td>
                      <td
                        className={cn(
                          "px-4 py-3 text-right font-medium tabular-nums",
                          diferenca === 0 && "text-muted-foreground",
                          diferenca > 0 && "text-emerald-600",
                          diferenca < 0 && "text-destructive",
                        )}
                      >
                        {diferenca > 0 ? "+" : ""}
                        {fmt(diferenca)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile: cards */}
        <div className="space-y-3 md:hidden">
          {turnos.map((t, i) => {
            const esperado = t.dinheiro + t.saldoAbertura;
            const diferenca = t.contado - esperado;
            return (
              <div key={i} className="rounded-lg border border-border bg-card p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">{t.operador}</p>
                    <p className="font-mono text-xs text-muted-foreground">Caixa {t.caixa}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold tabular-nums">{fmt(t.total)}</p>
                    <p className="text-xs text-muted-foreground">{t.vendas} vendas</p>
                  </div>
                </div>
                <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Abertura</p>
                    <p>{t.abertura}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fechamento</p>
                    <p>{t.fechamento}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Dinheiro</p>
                    <p className="tabular-nums">{fmt(t.dinheiro)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Saldo abert.</p>
                    <p className="tabular-nums">{fmt(t.saldoAbertura)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contado</p>
                    <p className="tabular-nums">{fmt(t.contado)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Diferença</p>
                    <p
                      className={cn(
                        "font-medium tabular-nums",
                        diferenca === 0 && "text-muted-foreground",
                        diferenca > 0 && "text-emerald-600",
                        diferenca < 0 && "text-destructive",
                      )}
                    >
                      {diferenca > 0 ? "+" : ""}
                      {fmt(diferenca)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
