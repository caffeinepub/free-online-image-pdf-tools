import React from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  schema?: object | object[];
  type?: 'website' | 'article';
}

export function SEOHead({ title, description, keywords, ogImage, canonical, schema, type = 'website' }: SEOHeadProps) {
  const fullTitle = title.includes('ToolsHub') ? title : `${title} | ToolsHub Free`;
  const ogImg = ogImage || '/assets/generated/og-default.dim_1200x630.png';
  const url = canonical || (typeof window !== 'undefined' ? window.location.href : '');

  React.useEffect(() => {
    document.title = fullTitle;
    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:image', ogImg, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:type', type, 'property');
    setMeta('twitter:card', 'summary_large_image', 'name');
    setMeta('twitter:title', fullTitle, 'name');
    setMeta('twitter:description', description, 'name');
    setMeta('twitter:image', ogImg, 'name');
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
      link.href = canonical;
    }
    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];
      schemas.forEach((s, i) => {
        const id = `schema-${i}`;
        let el = document.getElementById(id) as HTMLScriptElement;
        if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
        el.textContent = JSON.stringify(s);
      });
    }
    return () => {
      if (schema) {
        const schemas = Array.isArray(schema) ? schema : [schema];
        schemas.forEach((_, i) => { document.getElementById(`schema-${i}`)?.remove(); });
      }
    };
  }, [fullTitle, description, keywords, ogImg, url, type, canonical, schema]);

  return null;
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.content = content;
}
