export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  canonical?: string;
}

export const defaultOgImage = '/assets/generated/og-default.dim_1200x630.png';

export const homeSEO: SEOData = {
  title: 'Free Online Image & PDF Tools - Compress, Convert, Edit',
  description: 'Free online tools for images and PDFs. Compress images, convert PDF to Word, merge PDFs, resize photos, and 20+ more tools. Fast, free, no signup required.',
  keywords: 'free online tools, image compressor online, pdf converter free, resize image online free, merge pdf online, jpg to png, png to jpg, webp converter',
  ogImage: defaultOgImage,
};

export const blogSEO: SEOData = {
  title: 'Blog - Tips & Guides for Image & PDF Tools',
  description: 'Learn how to use free online image and PDF tools. Tips, guides, and tutorials for compressing images, converting PDFs, and more.',
  keywords: 'image tools guide, pdf tools tutorial, compress images tips, pdf converter guide',
  ogImage: defaultOgImage,
};

export const aboutSEO: SEOData = {
  title: 'About Us - Free Online Image & PDF Tools',
  description: 'Learn about our free online image and PDF tools platform. We provide fast, secure, browser-based tools for everyone.',
  keywords: 'about free online tools, image pdf tools platform',
  ogImage: defaultOgImage,
};

export const contactSEO: SEOData = {
  title: 'Contact Us - Free Online Image & PDF Tools',
  description: 'Get in touch with us. We\'d love to hear your feedback, suggestions, or questions about our free online tools.',
  keywords: 'contact free online tools, support image pdf tools',
  ogImage: defaultOgImage,
};

export const privacySEO: SEOData = {
  title: 'Privacy Policy - Free Online Image & PDF Tools',
  description: 'Our privacy policy explains how we handle your data. All file processing happens locally in your browser.',
  keywords: 'privacy policy online tools, data protection',
  ogImage: defaultOgImage,
};

export const disclaimerSEO: SEOData = {
  title: 'Disclaimer - Free Online Image & PDF Tools',
  description: 'Read our disclaimer about the use of our free online image and PDF tools.',
  keywords: 'disclaimer online tools',
  ogImage: defaultOgImage,
};

export const termsSEO: SEOData = {
  title: 'Terms & Conditions - Free Online Image & PDF Tools',
  description: 'Read our terms and conditions for using our free online image and PDF tools.',
  keywords: 'terms conditions online tools',
  ogImage: defaultOgImage,
};
