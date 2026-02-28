import React from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { termsSEO } from '@/utils/seoData';
import { usePageTracking } from '@/hooks/usePageTracking';

export function TermsPage() {
  usePageTracking('terms');
  const lastUpdated = 'February 28, 2026';

  return (
    <>
      <SEOHead title={termsSEO.title} description={termsSEO.description} keywords={termsSEO.keywords} />
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-display font-bold text-4xl text-foreground mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-10">Last updated: {lastUpdated}</p>
        <div className="prose-dark space-y-6">
          <p>Please read these Terms and Conditions carefully before using ToolsHub Free. By accessing or using our website, you agree to be bound by these terms.</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By using ToolsHub Free, you confirm that you are at least 13 years of age and agree to these Terms and Conditions. If you do not agree, please do not use our services.</p>

          <h2>2. Description of Service</h2>
          <p>ToolsHub Free provides free online tools for image and PDF processing. All processing occurs locally in your browser. We reserve the right to modify, suspend, or discontinue any part of our service at any time.</p>

          <h2>3. Acceptable Use</h2>
          <p>You agree to use our tools only for lawful purposes. You must not:</p>
          <ul>
            <li>Use our tools to process illegal content</li>
            <li>Attempt to circumvent any security measures</li>
            <li>Use automated scripts to access our tools excessively</li>
            <li>Reproduce, duplicate, or resell any part of our service</li>
            <li>Use our tools to infringe on intellectual property rights</li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <p>The ToolsHub Free website, including its design, code, and content, is owned by us and protected by intellectual property laws. You may not copy, modify, or distribute our content without permission.</p>
          <p>You retain all rights to the files you process using our tools. We claim no ownership over your content.</p>

          <h2>5. Privacy</h2>
          <p>Your use of our service is also governed by our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>, which is incorporated into these Terms by reference.</p>

          <h2>6. Advertising</h2>
          <p>Our service is supported by advertising. By using our service, you agree to the display of advertisements. We use Google AdSense for advertising, which may use cookies to serve relevant ads.</p>

          <h2>7. Disclaimer of Warranties</h2>
          <p>Our tools are provided "as is" without warranties of any kind. We do not guarantee that our tools will be error-free, uninterrupted, or produce specific results.</p>

          <h2>8. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, ToolsHub Free shall not be liable for any damages arising from your use of our tools, including but not limited to data loss, file corruption, or business interruption.</p>

          <h2>9. Changes to Terms</h2>
          <p>We reserve the right to update these Terms at any time. Continued use of our service after changes constitutes acceptance of the new Terms.</p>

          <h2>10. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through appropriate legal channels.</p>

          <h2>11. Contact</h2>
          <p>For questions about these Terms, please contact us through our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
        </div>
      </div>
    </>
  );
}
