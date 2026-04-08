interface InfoFieldProps {
  label: string;
  value: string;
  className?: string;
}

const InfoField = ({ label, value, className = "" }: InfoFieldProps) => (
  <div className={`space-y-1 ${className}`}>
    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
    <p className="text-sm font-medium text-foreground">{value}</p>
  </div>
);

export default InfoField;
