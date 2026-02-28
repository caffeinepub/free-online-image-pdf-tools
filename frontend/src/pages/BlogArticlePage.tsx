import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { SEOHead } from '@/components/seo/SEOHead';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { seedBlogPosts } from '@/utils/seedBlogPosts';
import { getToolById } from '@/utils/toolsData';
import { usePageTracking } from '@/hooks/usePageTracking';
import { AdBanner } from '@/components/ads/AdBanner';
import { Calendar, User, Tag, ArrowRight, ArrowLeft } from 'lucide-react';

export function BlogArticlePage() {
  const { slug } = useParams({ from: '/blog/$slug' });
  const post = seedBlogPosts.find(p => p.slug === slug);
  usePageTracking(`blog-${slug}`);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display font-bold text-3xl text-foreground mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
        <Link to="/blog" className="btn-gradient px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  const relatedTools = post.relatedTools.map(id => getToolById(id)).filter(Boolean);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.metaDescription,
      author: { '@type': 'Person', name: post.author },
      datePublished: post.date,
      publisher: { '@type': 'Organization', name: 'ToolsHub Free' },
      url: `${origin}/blog/${post.slug}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${origin}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${origin}/blog/${post.slug}` },
      ],
    },
  ];

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="font-display font-bold text-2xl text-foreground mt-8 mb-4">{line.slice(3)}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="font-display font-semibold text-xl text-foreground mt-6 mb-3">{line.slice(4)}</h3>);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        const items: string[] = [];
        while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
          items.push(lines[i].slice(2));
          i++;
        }
        elements.push(
          <ul key={`ul-${i}`} className="list-disc pl-6 space-y-1 mb-4 text-muted-foreground">
            {items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />)}
          </ul>
        );
        continue;
      } else if (line.match(/^\d+\. /)) {
        const items: string[] = [];
        while (i < lines.length && lines[i].match(/^\d+\. /)) {
          items.push(lines[i].replace(/^\d+\. /, ''));
          i++;
        }
        elements.push(
          <ol key={`ol-${i}`} className="list-decimal pl-6 space-y-1 mb-4 text-muted-foreground">
            {items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />)}
          </ol>
        );
        continue;
      } else if (line.trim() === '') {
        // skip empty lines
      } else {
        elements.push(
          <p key={i} className="text-muted-foreground leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }}
          />
        );
      }
      i++;
    }
    return elements;
  };

  return (
    <>
      <SEOHead
        title={post.metaTitle}
        description={post.metaDescription}
        keywords={post.keywords}
        schema={schema}
        type="article"
      />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Tag size={11} /> {post.category}
                </span>
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4 leading-tight">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
              </div>
            </header>

            {/* Google AdSense Banner Here */}
            <div className="flex justify-center mb-8">
              <AdBanner width={728} height={90} label="Advertisement" />
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              {renderContent(post.content)}
            </div>

            <div className="mt-8 flex justify-between">
              <Link to="/blog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft size={14} /> Back to Blog
              </Link>
            </div>
          </article>

          <aside className="lg:col-span-1 space-y-6">
            {/* Google AdSense Banner Here — 300x250 */}
            <AdBanner width={300} height={250} label="Advertisement — 300×250" />

            {relatedTools.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="font-display font-semibold text-foreground mb-4 text-sm">Related Tools</h3>
                <div className="space-y-2">
                  {relatedTools.map(tool => tool && (
                    <Link
                      key={tool.id}
                      to={tool.route}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-all group"
                    >
                      <span className="text-lg">{tool.icon}</span>
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{tool.name}</span>
                      <ArrowRight size={12} className="ml-auto text-muted-foreground group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
