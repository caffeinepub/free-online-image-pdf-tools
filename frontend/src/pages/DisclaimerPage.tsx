import React from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { disclaimerSEO } from '@/utils/seoData';
import { usePageTracking } from '@/hooks/usePageTracking';

export function DisclaimerPage() {
  usePageTracking('disclaimer');
  const lastUpdated = 'February 28, 2026';

  return (
    <>
      <SEOHead title={disclaimerSEO.title} description={disclaimerSEO.description} keywords={disclaimerSEO.keywords} />
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-display font-bold text-4xl text-foreground mb-2">Disclaimer</h1>
        <p className="text-muted-foreground mb-10">Last updated: {lastUpdated}</p>
        <div className="prose-dark space-y-6">
          <p>The information and tools provided on ToolsHub Free are for general informational and utility purposes only. By using our website, you accept this disclaimer in full.</p>

          <h2>1. Tool Accuracy</h2>
          <p>While we strive to provide accurate and reliable tools, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of our tools or the results they produce.</p>
          <p>Our tools are provided "as is" without any guarantee of fitness for a particular purpose. Results may vary depending on the input files, browser capabilities, and other factors.</p>

          <h2>2. File Processing Limitations</h2>
          <p>Our tools process files locally in your browser. Performance and results may vary based on:</p>
          <ul>
            <li>Browser type and version</li>
            <li>Device hardware capabilities</li>
            <li>File size and complexity</li>
            <li>Available system memory</li>
          </ul>

          <h2>3. PDF Tool Limitations</h2>
          <p>Our PDF tools provide basic functionality. For complex PDF operations, encrypted PDFs, or PDFs with advanced features, results may be limited. We recommend using professional PDF software for critical business documents.</p>

          <h2>4. No Professional Advice</h2>
          <p>Nothing on this website constitutes professional, legal, financial, or technical advice. Always consult appropriate professionals for important decisions.</p>

          <h2>5. External Links</h2>
          <p>Our website may contain links to external websites. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.</p>

          <h2>6. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, ToolsHub Free shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of our tools or services.</p>

          <h2>7. Indemnification</h2>
          <p>You agree to indemnify and hold harmless ToolsHub Free from any claims, damages, or expenses arising from your use of our tools or violation of these terms.</p>

          <h2>8. Changes</h2>
          <p>We reserve the right to modify this disclaimer at any time. Continued use of our website after changes constitutes acceptance of the updated disclaimer.</p>
        </div>
      </div>
    </>
  );
}
