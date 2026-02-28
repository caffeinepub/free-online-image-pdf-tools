import React from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { FAQSection } from '@/components/seo/FAQSection';
import { RelatedTools } from './RelatedTools';
import { AdBanner } from '@/components/ads/AdBanner';
import { ToolData, getRelatedTools } from '@/utils/toolsData';
import { usePageTracking } from '@/hooks/usePageTracking';

interface ImageToolTemplateProps {
  tool: ToolData;
  children: React.ReactNode;
}

export function ImageToolTemplate({ tool, children }: ImageToolTemplateProps) {
  usePageTracking(tool.id);
  const relatedTools = getRelatedTools(tool.id);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.description,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web Browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
        { '@type': 'ListItem', position: 2, name: 'Tools', item: `${origin}/tools` },
        { '@type': 'ListItem', position: 3, name: tool.name, item: `${origin}${tool.route}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faq.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
  ];

  return (
    <>
      <SEOHead
        title={tool.metaTitle}
        description={tool.metaDescription}
        keywords={tool.keywords.join(', ')}
        schema={schema}
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumb items={[{ label: 'Tools', href: '/' }, { label: tool.name }]} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{tool.icon}</span>
                <div>
                  <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">{tool.name}</h1>
                  <p className="text-muted-foreground mt-1">{tool.description}</p>
                </div>
              </div>
            </div>

            {/* Tool UI */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              {children}
            </div>

            {/* In-content ad */}
            {/* Google AdSense Banner Here */}
            <div className="flex justify-center mb-8">
              <AdBanner width={728} height={90} label="Advertisement — In-Content" />
            </div>

            <FAQSection faqs={tool.faq} />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Google AdSense Banner Here — 300x250 Rectangle */}
            <div className="flex justify-center">
              <AdBanner width={300} height={250} label="Advertisement — 300×250" />
            </div>
            <RelatedTools tools={relatedTools} />
          </aside>
        </div>
      </div>
    </>
  );
}
