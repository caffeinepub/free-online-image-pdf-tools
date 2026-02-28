import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { SEOHead } from '@/components/seo/SEOHead';
import { AdBanner } from '@/components/ads/AdBanner';
import { imageTools, pdfTools, ToolData } from '@/utils/toolsData';
import { homeSEO } from '@/utils/seoData';
import { usePageTracking } from '@/hooks/usePageTracking';
import { ArrowRight, Search, Zap, Shield, Globe } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

function ToolCard({ tool }: { tool: ToolData }) {
  return (
    <Link
      to={tool.route}
      className="group flex flex-col gap-3 p-5 bg-card border border-border rounded-xl tool-card-hover"
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl">{tool.icon}</span>
        <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors mt-1" />
      </div>
      <div>
        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
          {tool.name}
        </h3>
        <p className="text-muted-foreground text-xs mt-1 leading-relaxed line-clamp-2">{tool.description}</p>
      </div>
    </Link>
  );
}

function ToolGrid({ tools }: { tools: ToolData[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {tools.map((tool, i) => (
        <React.Fragment key={tool.id}>
          <ToolCard tool={tool} />
          {/* Google AdSense Banner Here — Between tools every 5 items */}
          {(i + 1) % 5 === 0 && i < tools.length - 1 && (
            <div className="col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-5 flex justify-center py-2">
              <AdBanner width={728} height={90} label="Advertisement — In-Content Banner" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function HomePage() {
  usePageTracking('homepage');
  const [search, setSearch] = useState('');

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ToolsHub Free',
    description: homeSEO.description,
    url: typeof window !== 'undefined' ? window.location.origin : '',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${typeof window !== 'undefined' ? window.location.origin : ''}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const filteredImage = imageTools.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPdf = pdfTools.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <SEOHead
        title={homeSEO.title}
        description={homeSEO.description}
        keywords={homeSEO.keywords}
        ogImage={homeSEO.ogImage}
        schema={websiteSchema}
      />

      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/assets/generated/hero-bg.dim_1920x600.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
            <Zap size={12} />
            <span>20+ Free Online Tools — No Signup Required</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight">
            Free Online{' '}
            <span className="gradient-text">Image & PDF</span>
            <br />Tools
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Compress images, convert PDFs, merge documents, and more — all free, fast, and secure. No uploads to servers. Everything runs in your browser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Link to="/tools/image-compressor" className="btn-gradient px-8 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
              Start Compressing <ArrowRight size={16} />
            </Link>
            <Link to="/tools/pdf-merge" className="px-8 py-3 rounded-xl font-semibold text-sm border border-border text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all inline-flex items-center gap-2">
              Merge PDFs <ArrowRight size={16} />
            </Link>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-card/80 border-border focus:border-primary/50"
            />
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: <Zap size={20} className="text-primary" />, title: 'Lightning Fast', desc: 'All processing in your browser' },
              { icon: <Shield size={20} className="text-primary" />, title: '100% Secure', desc: 'Files never leave your device' },
              { icon: <Globe size={20} className="text-primary" />, title: 'Always Free', desc: 'No signup, no limits' },
            ].map(f => (
              <div key={f.title} className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">{f.icon}</div>
                <div className="text-left">
                  <p className="font-semibold text-foreground text-sm">{f.title}</p>
                  <p className="text-muted-foreground text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
            All Free Online Tools
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Professional-grade tools for images and PDFs, completely free and browser-based.
          </p>
        </div>

        <Tabs defaultValue="image" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="image" className="data-[state=active]:gradient-bg data-[state=active]:text-background font-medium">
                🖼️ Image Tools ({imageTools.length})
              </TabsTrigger>
              <TabsTrigger value="pdf" className="data-[state=active]:gradient-bg data-[state=active]:text-background font-medium">
                📄 PDF Tools ({pdfTools.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="image" className="animate-fade-in">
            {filteredImage.length > 0 ? (
              <ToolGrid tools={filteredImage} />
            ) : (
              <p className="text-center text-muted-foreground py-12">No image tools match your search.</p>
            )}
          </TabsContent>

          <TabsContent value="pdf" className="animate-fade-in">
            {filteredPdf.length > 0 ? (
              <ToolGrid tools={filteredPdf} />
            ) : (
              <p className="text-center text-muted-foreground py-12">No PDF tools match your search.</p>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Between-tools ad block */}
      {/* Google AdSense Banner Here */}
      <div className="container mx-auto px-4 pb-8 flex justify-center">
        <AdBanner width={728} height={90} label="Advertisement — Between Sections" />
      </div>
    </>
  );
}
