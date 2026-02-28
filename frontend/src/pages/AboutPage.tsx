import React from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { aboutSEO } from '@/utils/seoData';
import { usePageTracking } from '@/hooks/usePageTracking';
import { Zap, Shield, Globe, Users, Star, Heart } from 'lucide-react';

export function AboutPage() {
  usePageTracking('about');

  return (
    <>
      <SEOHead title={aboutSEO.title} description={aboutSEO.description} keywords={aboutSEO.keywords} />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
            About <span className="gradient-text">ToolsHub Free</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            We're on a mission to make professional-grade image and PDF tools accessible to everyone, completely free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: <Zap size={24} className="text-primary" />, title: 'Lightning Fast', desc: 'All processing happens directly in your browser using modern Web APIs. No waiting for server uploads.' },
            { icon: <Shield size={24} className="text-primary" />, title: 'Privacy First', desc: 'Your files never leave your device. We have zero access to your documents, images, or data.' },
            { icon: <Globe size={24} className="text-primary" />, title: 'Always Free', desc: 'No subscriptions, no hidden fees, no account required. Just open and use.' },
          ].map(item => (
            <div key={item.title} className="p-6 bg-card border border-border rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">{item.icon}</div>
              <h2 className="font-display font-semibold text-foreground mb-2">{item.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="prose-dark mb-16">
          <h2 className="font-display font-bold text-2xl text-foreground mb-4">Our Story</h2>
          <p>ToolsHub Free was created to solve a simple problem: why should people pay for basic image and PDF tools? We believe that essential productivity tools should be free, fast, and accessible to everyone regardless of their technical expertise or budget.</p>
          <p>Our platform offers 20+ professional tools for image manipulation and PDF management, all running entirely in your browser. From compressing images for your website to merging PDF documents for work, we've got you covered.</p>

          <h2 className="font-display font-bold text-2xl text-foreground mb-4 mt-8">What We Offer</h2>
          <ul>
            <li><strong>Image Tools:</strong> Compress, resize, crop, rotate, convert between formats (JPG, PNG, WebP), remove backgrounds, and view metadata.</li>
            <li><strong>PDF Tools:</strong> Merge, split, compress, lock, unlock, add watermarks, add page numbers, convert to/from images.</li>
            <li><strong>Privacy:</strong> All processing is client-side. Your files are never uploaded to our servers.</li>
            <li><strong>No Limits:</strong> Use our tools as many times as you need, with no daily limits or file count restrictions.</li>
          </ul>

          <h2 className="font-display font-bold text-2xl text-foreground mb-4 mt-8">Our Commitment</h2>
          <p>We are committed to keeping ToolsHub Free accessible to everyone. Our tools are supported by non-intrusive advertising, which allows us to maintain and improve the platform without charging users.</p>
          <p>We continuously work to improve our tools, add new features, and ensure the best possible user experience. Your feedback is invaluable to us.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '20+', label: 'Free Tools' },
            { value: '100%', label: 'Browser-Based' },
            { value: '0', label: 'Files Uploaded' },
            { value: '∞', label: 'Uses Allowed' },
          ].map(stat => (
            <div key={stat.label} className="p-4 bg-card border border-border rounded-xl">
              <p className="font-display font-bold text-3xl gradient-text mb-1">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
