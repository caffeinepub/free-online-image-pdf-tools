import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { SEOHead } from '@/components/seo/SEOHead';
import { blogSEO } from '@/utils/seoData';
import { seedBlogPosts } from '@/utils/seedBlogPosts';
import { usePageTracking } from '@/hooks/usePageTracking';
import { AdBanner } from '@/components/ads/AdBanner';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function BlogIndexPage() {
  usePageTracking('blog');
  const categories = ['All', ...Array.from(new Set(seedBlogPosts.map(p => p.category)))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? seedBlogPosts
    : seedBlogPosts.filter(p => p.category === activeCategory);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'ToolsHub Free Blog',
    description: blogSEO.description,
    url: typeof window !== 'undefined' ? `${window.location.origin}/blog` : '',
  };

  return (
    <>
      <SEOHead title={blogSEO.title} description={blogSEO.description} keywords={blogSEO.keywords} schema={schema} />
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl text-foreground mb-4">
            Blog & <span className="gradient-text">Guides</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Tips, tutorials, and guides for getting the most out of free online image and PDF tools.
          </p>
        </div>

        {/* Google AdSense Banner Here */}
        <div className="flex justify-center mb-10">
          <AdBanner width={728} height={90} label="Advertisement" />
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="bg-card border border-border flex-wrap h-auto gap-1 p-1">
            {categories.map(cat => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="data-[state=active]:gradient-bg data-[state=active]:text-background text-sm"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(post => (
            <Link
              key={post.id}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="group bg-card border border-border rounded-xl overflow-hidden tool-card-hover"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <Tag size={10} /> {post.category}
                  </span>
                </div>
                <h2 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2 leading-snug">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><User size={11} /> {post.author}</span>
                    <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
                  </div>
                  <ArrowRight size={14} className="group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No articles in this category yet.</p>
        )}
      </div>
    </>
  );
}
