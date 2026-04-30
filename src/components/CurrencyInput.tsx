import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  prefix?: string;
}

const formatBR = (n: number) =>
  n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const parseBR = (s: string): number => {
  // Mantém apenas dígitos, vírgulas e pontos. Trata "1.234,56" e "1234.56".
  const cleaned = s.replace(/[^\d.,-]/g, "");
  if (!cleaned) return 0;
  // Se tem vírgula, considera vírgula como decimal (formato BR)
  if (cleaned.includes(",")) {
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    return Number(normalized) || 0;
  }
  return Number(cleaned) || 0;
};

export const CurrencyInput = ({
  value,
  onChange,
  className,
  placeholder = "0,00",
  disabled,
  prefix = "R$",
}: CurrencyInputProps) => {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(formatBR(value));

  // Sincroniza quando o valor externo muda e o usuário NÃO está editando
  useEffect(() => {
    if (!focused) setDraft(formatBR(value));
  }, [value, focused]);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
        {prefix}
      </span>
      <Input
        inputMode="decimal"
        value={draft}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={(e) => {
          setFocused(true);
          e.currentTarget.select();
        }}
        onChange={(e) => {
          setDraft(e.target.value);
          onChange(parseBR(e.target.value));
        }}
        onBlur={() => {
          setFocused(false);
          setDraft(formatBR(value));
        }}
        className={cn("h-9 pl-7 text-right tabular-nums", className)}
      />
    </div>
  );
};
