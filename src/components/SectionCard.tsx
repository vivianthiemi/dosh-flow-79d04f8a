import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const SectionCard = ({ title, icon, children }: SectionCardProps) => (
  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 border-b border-border bg-primary/5 px-5 py-3">
      <span className="text-primary">{icon}</span>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
        {title}
      </h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

export default SectionCard;
