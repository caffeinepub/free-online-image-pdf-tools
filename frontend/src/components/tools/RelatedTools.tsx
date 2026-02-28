import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { ToolData } from '@/utils/toolsData';

interface RelatedToolsProps {
  tools: ToolData[];
}

export function RelatedTools({ tools }: RelatedToolsProps) {
  if (!tools.length) return null;
  return (
    <section className="mt-8">
      <h3 className="text-lg font-display font-semibold mb-4 text-foreground">Related Tools</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tools.map(tool => (
          <Link
            key={tool.id}
            to={tool.route}
            className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <span className="text-2xl">{tool.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{tool.name}</p>
              <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
            </div>
            <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
