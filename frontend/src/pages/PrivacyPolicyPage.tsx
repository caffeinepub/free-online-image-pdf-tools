import React from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { privacySEO } from '@/utils/seoData';
import { usePageTracking } from '@/hooks/usePageTracking';

export function PrivacyPolicyPage() {
  usePageTracking('privacy-policy');
  const lastUpdated = 'February 28, 2026';

  return (
    <>
      <SEOHead title={privacySEO.title} description={privacySEO.description} keywords={privacySEO.keywords} />
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-display font-bold text-4xl text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: {lastUpdated}</p>
        <div className="prose-dark space-y-6">
          <p>At ToolsHub Free, we are committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our website and tools.</p>

          <h2>1. Information We Collect</h2>
          <p><strong>Files and Documents:</strong> All file processing (images, PDFs) happens entirely in your browser using client-side JavaScript. Your files are never uploaded to our servers and we have no access to them.</p>
          <p><strong>Usage Data:</strong> We may collect anonymous usage statistics such as which tools are used most frequently, page views, and general traffic patterns. This data does not include any personally identifiable information.</p>
          <p><strong>Contact Form:</strong> When you submit our contact form, we collect your name, email address, and message to respond to your inquiry.</p>

          <h2>2. How We Use Information</h2>
          <ul>
            <li>To improve our tools and user experience</li>
            <li>To respond to your inquiries and support requests</li>
            <li>To analyze usage patterns and optimize performance</li>
            <li>To display relevant advertisements through Google AdSense</li>
          </ul>

          <h2>3. Cookies and Tracking</h2>
          <p>We use cookies and similar tracking technologies to:</p>
          <ul>
            <li>Remember your preferences</li>
            <li>Analyze site traffic and usage patterns</li>
            <li>Serve relevant advertisements through Google AdSense</li>
          </ul>
          <p>Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>

          <h2>4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Google AdSense:</strong> For displaying advertisements. Google's use of advertising cookies enables it to serve ads based on your visits to our site and other sites on the Internet.</li>
            <li><strong>Google Analytics:</strong> For analyzing website traffic and usage patterns.</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>Since all file processing occurs locally in your browser, your documents and images are never transmitted to our servers. We implement appropriate security measures to protect any data we do collect.</p>

          <h2>6. Children's Privacy</h2>
          <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>

          <h2>7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated date.</p>

          <h2>8. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us through our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
        </div>
      </div>
    </>
  );
}
