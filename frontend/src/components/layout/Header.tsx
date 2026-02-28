import React, { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Menu, X, Zap } from 'lucide-react';
import { AdBanner } from '@/components/ads/AdBanner';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Image Tools', href: '/?tab=image' },
    { label: 'PDF Tools', href: '/?tab=pdf' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border">
      {/* Google AdSense Banner Here — 728x90 Leaderboard */}
      <div className="hidden md:flex justify-center py-2 border-b border-border/50">
        <AdBanner width={728} height={90} label="Advertisement — 728×90 Leaderboard" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all">
              <Zap size={18} className="text-background" />
            </div>
            <div>
              <span className="font-display font-bold text-lg gradient-text">ToolsHub</span>
              <span className="text-foreground font-bold text-lg"> Free</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href.split('?')[0]}
                className="nav-link text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href.split('?')[0]}
                className="nav-link text-sm font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
