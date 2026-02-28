import React from 'react';
import { Link } from '@tanstack/react-router';
import { Zap, Heart } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();
  const appId = typeof window !== 'undefined' ? encodeURIComponent(window.location.hostname) : 'toolshub-free';

  const toolLinks = [
    { label: 'Image Compressor', href: '/tools/image-compressor' },
    { label: 'Image Resizer', href: '/tools/image-resizer' },
    { label: 'JPG to PNG', href: '/tools/jpg-to-png' },
    { label: 'PDF Merge', href: '/tools/pdf-merge' },
    { label: 'PDF Split', href: '/tools/pdf-split' },
    { label: 'PDF to JPG', href: '/tools/pdf-to-jpg' },
  ];

  const legalLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'Terms & Conditions', href: '/terms' },
  ];

  const hashtags = [
    '#FreeOnlineTools', '#ImageCompressor', '#PDFConverter', '#OnlineTools',
    '#AdSenseWebsite', '#SEOTools', '#WebTools', '#DigitalTools',
  ];

  return (
    <footer className="bg-card border-t border-border mt-16 pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Zap size={16} className="text-background" />
              </div>
              <span className="font-display font-bold text-lg gradient-text">ToolsHub Free</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Free online tools for images and PDFs. Fast, secure, and no signup required.
            </p>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Popular Tools</h3>
            <ul className="space-y-2">
              {toolLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              {legalLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog & Admin */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary text-sm transition-colors">Blog</Link></li>
              <li><Link to="/admin" className="text-muted-foreground hover:text-primary text-sm transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="section-divider mb-6" />

        {/* Hashtags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {hashtags.map(tag => (
            <span key={tag} className="text-xs text-muted-foreground/60 hover:text-primary transition-colors cursor-default">{tag}</span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {year} ToolsHub Free. All rights reserved.</p>
          <p className="font-medium text-foreground">Created by Anurag Singh</p>
          <p className="flex items-center gap-1">
            Built with <Heart size={13} className="text-red-400 fill-red-400" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
