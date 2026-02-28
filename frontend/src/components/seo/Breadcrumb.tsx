import React from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [{ label: 'Home', href: '/' }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
      {allItems.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={14} className="opacity-50" />}
          {item.href && i < allItems.length - 1 ? (
            <Link to={item.href} className="hover:text-primary transition-colors flex items-center gap-1">
              {i === 0 && <Home size={13} />}
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium flex items-center gap-1">
              {i === 0 && <Home size={13} />}
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
