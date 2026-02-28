import React from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { contactSEO } from '@/utils/seoData';
import { useContactForm } from '@/hooks/useContactForm';
import { usePageTracking } from '@/hooks/usePageTracking';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mail, MessageSquare, CheckCircle } from 'lucide-react';

export function ContactPage() {
  usePageTracking('contact');
  const { form, updateField, submit, isSubmitting, isSuccess, error } = useContactForm();

  return (
    <>
      <SEOHead title={contactSEO.title} description={contactSEO.description} keywords={contactSEO.keywords} />
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl text-foreground mb-4">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="text-muted-foreground text-lg">Have a question, suggestion, or feedback? We'd love to hear from you.</p>
        </div>

        {isSuccess ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">Message Sent!</h2>
            <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you as soon as possible.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={e => updateField('message', e.target.value)}
                  placeholder="Tell us how we can help..."
                  className="min-h-36 resize-y"
                />
              </div>
              {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
              <button
                onClick={submit}
                disabled={isSubmitting}
                className="btn-gradient w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Sending...</>
                ) : (
                  <><Mail size={18} /> Send Message</>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-card border border-border rounded-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Mail size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Email Support</h3>
              <p className="text-muted-foreground text-sm">We typically respond within 24-48 hours.</p>
            </div>
          </div>
          <div className="p-6 bg-card border border-border rounded-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquare size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Feedback</h3>
              <p className="text-muted-foreground text-sm">Help us improve by sharing your experience.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
