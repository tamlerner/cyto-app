import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      {Icon && <Icon className="h-6 w-6" />}
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}