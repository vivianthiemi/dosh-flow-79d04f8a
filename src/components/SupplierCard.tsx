import { User, Phone, MapPin } from "lucide-react";

interface SupplierCardProps {
  name: string;
  responsible: string;
  contact: string;
  city: string;
}

const SupplierCard = ({ name, responsible, contact, city }: SupplierCardProps) => (
  <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2.5 hover:shadow-md transition-shadow">
    <h3 className="text-sm font-bold text-foreground">{name}</h3>
    <div className="space-y-1.5 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <User className="h-3.5 w-3.5 text-primary" />
        <span>{responsible}</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="h-3.5 w-3.5 text-primary" />
        <span>{contact}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span>{city}</span>
      </div>
    </div>
  </div>
);

export default SupplierCard;
