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

// Estilo "máquina registradora": o usuário digita só dígitos,
// os dois últimos viram centavos automaticamente (sem precisar de vírgula).
const digitsToNumber = (digits: string): number => {
  const onlyDigits = digits.replace(/\D/g, "");
  if (!onlyDigits) return 0;
  return Number(onlyDigits) / 100;
};

export const CurrencyInput = ({
  value,
  onChange,
  className,
  placeholder = "0,00",
  disabled,
  prefix = "R$",
}: CurrencyInputProps) => {
  const [display, setDisplay] = useState(formatBR(value));

  // Sincroniza quando o valor externo muda
  useEffect(() => {
    setDisplay(formatBR(value));
  }, [value]);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
        {prefix}
      </span>
      <Input
        inputMode="numeric"
        value={display}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => {
          const num = digitsToNumber(e.target.value);
          setDisplay(formatBR(num));
          onChange(num);
        }}
        className={cn("h-9 pl-7 text-right tabular-nums", className)}
      />
    </div>
  );
};
