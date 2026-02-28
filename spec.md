# Specification

## Summary
**Goal:** Build a full-featured free online tools website ("ToolsHub Free") with 10 image tools, 11 PDF tools, a blog, legal pages, an admin analytics panel, AdSense-ready ad slot placeholders, and comprehensive SEO — all on a dark gradient UI theme.

**Planned changes:**

### UI & Theme
- Dark navy/charcoal base palette (`#0d0d1a`–`#1a1a2e`) with cyan-to-violet gradient accents applied consistently across all pages
- Hero section with gradient background, headline, subheadline, and search/browse CTA
- Card-based tool grid with hover glow effects and smooth CSS transitions
- Tab navigation on homepage switching between "Image Tools" and "PDF Tools" categories
- Header with no owner name; footer displays "Created by Anurag Singh" and SEO hashtags
- Fully mobile-responsive layout

### Image Tools (10 dedicated pages under `/tools/`)
- Image Compressor, Image Resizer, JPG to PNG, PNG to JPG, Image Cropper, Image Rotator, Image to WebP, WebP to JPG, Background Remover (basic color-based), Image Metadata Viewer
- All tools are client-side using Canvas API; each produces a downloadable output
- Each page includes: SEO title/meta, OG tags, Twitter Card, JSON-LD Tool schema, breadcrumb, FAQ section, related tools links

### PDF Tools (11 dedicated pages under `/tools/`)
- PDF Merge, PDF Split, PDF Compressor, PDF Lock (password), PDF Unlock, Add Watermark, PDF Page Number Adder, PDF to JPG, JPG to PDF, PDF to Word (text extraction), Word/HTML to PDF
- Client-side using `pdf-lib` and `pdfjs-dist`; backend used for any heavier processing
- Each page includes: SEO title/meta, OG tags, Twitter Card, JSON-LD Tool schema, breadcrumb, FAQ section, related tools links

### AdSense-Compatible Ad Layout (placeholders only)
- Header leaderboard slot (728×90) with `<!-- Google AdSense Banner Here -->` comment
- In-content banner ads between tool sections
- Sidebar rectangle (300×250) on tool pages
- Sticky bottom bar ad on all pages
- Delayed dismissible popup ad appearing after 5 seconds
- Ad block placeholders interspersed every 4–6 tools in the homepage grid

### Admin Panel (`/admin`)
- Login page with username/password; session gated via React state
- Dashboard: total visitors, daily visitors, per-tool usage counts, most-used tools ranked list, total page views, ad click simulation counter
- Simple bar/line chart for analytics trends
- Unauthenticated users redirected to `/admin/login`
- Analytics data (visitor counts, tool usage, page views, contact messages) stored in Motoko backend

### SEO
- Unique H1/H2 hierarchy, meta title, meta description on every page
- OG and Twitter Card tags site-wide
- `sitemap.xml` listing all tool, blog, and legal pages
- `robots.txt` configured
- FAQ JSON-LD and BreadcrumbList JSON-LD on tool pages
- Internal linking between related tools and blog posts
- US-traffic keyword targeting on key pages

### Legal Pages
- About Us (`/about`), Contact (`/contact`), Privacy Policy (`/privacy-policy`), Disclaimer (`/disclaimer`), Terms & Conditions (`/terms`)
- Contact form stores submissions in Motoko backend; shows success confirmation
- All pages professionally written, AdSense-compliant, linked in footer

### Blog Section
- Blog index at `/blog` with category filters
- Individual article pages with consistent template: title, meta, OG, JSON-LD Article schema, author, date, related tools sidebar
- At least 3 seed articles targeting US image/PDF tool keywords
- Internal links from articles to relevant tool pages

### Backend (Motoko)
- Single main actor storing: visitor counts, daily visits, tool usage counts, page views, ad click simulation counts, contact form messages

**User-visible outcome:** Users can visit a professional dark-themed website, use 21 free browser-based image and PDF tools, read SEO-optimized blog posts, access legal pages, and see AdSense-ready ad placements. The site owner can log into `/admin` to view analytics. The footer credits "Created by Anurag Singh."
