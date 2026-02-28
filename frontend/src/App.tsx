import React, { Suspense, lazy, useEffect } from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useRouterState } from '@tanstack/react-router';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { StickyBottomAd } from './components/ads/StickyBottomAd';
import { PopupAd } from './components/ads/PopupAd';
import { Toaster } from '@/components/ui/sonner';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ImageCompressorPage = lazy(() => import('./pages/tools/ImageCompressorPage').then(m => ({ default: m.ImageCompressorPage })));
const ImageResizerPage = lazy(() => import('./pages/tools/ImageResizerPage').then(m => ({ default: m.ImageResizerPage })));
const JpgToPngPage = lazy(() => import('./pages/tools/JpgToPngPage').then(m => ({ default: m.JpgToPngPage })));
const PngToJpgPage = lazy(() => import('./pages/tools/PngToJpgPage').then(m => ({ default: m.PngToJpgPage })));
const ImageCropperPage = lazy(() => import('./pages/tools/ImageCropperPage').then(m => ({ default: m.ImageCropperPage })));
const ImageRotatorPage = lazy(() => import('./pages/tools/ImageRotatorPage').then(m => ({ default: m.ImageRotatorPage })));
const ImageToWebpPage = lazy(() => import('./pages/tools/ImageToWebpPage').then(m => ({ default: m.ImageToWebpPage })));
const WebpToJpgPage = lazy(() => import('./pages/tools/WebpToJpgPage').then(m => ({ default: m.WebpToJpgPage })));
const BackgroundRemoverPage = lazy(() => import('./pages/tools/BackgroundRemoverPage').then(m => ({ default: m.BackgroundRemoverPage })));
const ImageMetadataViewerPage = lazy(() => import('./pages/tools/ImageMetadataViewerPage').then(m => ({ default: m.ImageMetadataViewerPage })));
const PdfToWordPage = lazy(() => import('./pages/tools/PdfToWordPage').then(m => ({ default: m.PdfToWordPage })));
const WordToPdfPage = lazy(() => import('./pages/tools/WordToPdfPage').then(m => ({ default: m.WordToPdfPage })));
const PdfMergePage = lazy(() => import('./pages/tools/PdfMergePage').then(m => ({ default: m.PdfMergePage })));
const PdfSplitPage = lazy(() => import('./pages/tools/PdfSplitPage').then(m => ({ default: m.PdfSplitPage })));
const PdfCompressorPage = lazy(() => import('./pages/tools/PdfCompressorPage').then(m => ({ default: m.PdfCompressorPage })));
const PdfLockPage = lazy(() => import('./pages/tools/PdfLockPage').then(m => ({ default: m.PdfLockPage })));
const PdfUnlockPage = lazy(() => import('./pages/tools/PdfUnlockPage').then(m => ({ default: m.PdfUnlockPage })));
const PdfWatermarkPage = lazy(() => import('./pages/tools/PdfWatermarkPage').then(m => ({ default: m.PdfWatermarkPage })));
const PdfPageNumbersPage = lazy(() => import('./pages/tools/PdfPageNumbersPage').then(m => ({ default: m.PdfPageNumbersPage })));
const PdfToJpgPage = lazy(() => import('./pages/tools/PdfToJpgPage').then(m => ({ default: m.PdfToJpgPage })));
const JpgToPdfPage = lazy(() => import('./pages/tools/JpgToPdfPage').then(m => ({ default: m.JpgToPdfPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage').then(m => ({ default: m.DisclaimerPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const BlogIndexPage = lazy(() => import('./pages/BlogIndexPage').then(m => ({ default: m.BlogIndexPage })));
const BlogArticlePage = lazy(() => import('./pages/BlogArticlePage').then(m => ({ default: m.BlogArticlePage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Disables AdSense on admin routes by overriding the adsbygoogle push method
function AdSenseGuard() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  useEffect(() => {
    const isAdminRoute = pathname.startsWith('/admin');
    const win = window as unknown as Record<string, unknown>;

    if (isAdminRoute) {
      // Freeze the adsbygoogle array so no new ads are pushed on admin pages
      if (!Array.isArray(win['adsbygoogle'])) {
        win['adsbygoogle'] = [];
      }
      const arr = win['adsbygoogle'] as { push?: unknown; _disabled?: boolean };
      arr._disabled = true;
      arr.push = () => { /* noop on admin pages */ };
    } else {
      // Restore normal push behaviour on non-admin pages
      const arr = win['adsbygoogle'] as { push?: unknown; _disabled?: boolean } | undefined;
      if (arr && arr._disabled) {
        delete arr.push;
        delete arr._disabled;
      }
    }
  }, [pathname]);

  return null;
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdSenseGuard />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <StickyBottomAd />
      <PopupAd />
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: () => <HomePage /> });
const imageCompressorRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/image-compressor', component: () => <ImageCompressorPage /> });
const imageResizerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/image-resizer', component: () => <ImageResizerPage /> });
const jpgToPngRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/jpg-to-png', component: () => <JpgToPngPage /> });
const pngToJpgRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/png-to-jpg', component: () => <PngToJpgPage /> });
const imageCropperRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/image-cropper', component: () => <ImageCropperPage /> });
const imageRotatorRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/image-rotator', component: () => <ImageRotatorPage /> });
const imageToWebpRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/image-to-webp', component: () => <ImageToWebpPage /> });
const webpToJpgRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/webp-to-jpg', component: () => <WebpToJpgPage /> });
const backgroundRemoverRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/background-remover', component: () => <BackgroundRemoverPage /> });
const imageMetadataRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/image-metadata-viewer', component: () => <ImageMetadataViewerPage /> });
const pdfToWordRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/pdf-to-word', component: () => <PdfToWordPage /> });
const wordToPdfRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/word-to-pdf', component: () => <WordToPdfPage /> });
const pdfMergeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/pdf-merge', component: () => <PdfMergePage /> });
const pdfSplitRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/pdf-split', component: () => <PdfSplitPage /> });
const pdfCompressorRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/pdf-compressor', component: () => <PdfCompressorPage /> });
const pdfLockRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/pdf-lock', component: () => <PdfLockPage /> });
const pdfUnlockRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/pdf-unlock', component: () => <PdfUnlockPage /> });
const pdfWatermarkRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/pdf-watermark', component: () => <PdfWatermarkPage /> });
const pdfPageNumbersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/pdf-page-numbers', component: () => <PdfPageNumbersPage /> });
const pdfToJpgRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/pdf-to-jpg', component: () => <PdfToJpgPage /> });
const jpgToPdfRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tools/jpg-to-pdf', component: () => <JpgToPdfPage /> });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: () => <AboutPage /> });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: () => <ContactPage /> });
const privacyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/privacy-policy', component: () => <PrivacyPolicyPage /> });
const disclaimerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/disclaimer', component: () => <DisclaimerPage /> });
const termsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/terms', component: () => <TermsPage /> });
const blogIndexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/blog', component: () => <BlogIndexPage /> });
const blogArticleRoute = createRoute({ getParentRoute: () => rootRoute, path: '/blog/$slug', component: () => <BlogArticlePage /> });
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: () => <AdminLoginPage /> });
const adminLoginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/login', component: () => <AdminLoginPage /> });
const adminDashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/dashboard', component: () => <AdminDashboardPage /> });

const routeTree = rootRoute.addChildren([
  indexRoute,
  imageCompressorRoute, imageResizerRoute, jpgToPngRoute, pngToJpgRoute,
  imageCropperRoute, imageRotatorRoute, imageToWebpRoute, webpToJpgRoute,
  backgroundRemoverRoute, imageMetadataRoute,
  pdfToWordRoute, wordToPdfRoute, pdfMergeRoute, pdfSplitRoute,
  pdfCompressorRoute, pdfLockRoute, pdfUnlockRoute, pdfWatermarkRoute,
  pdfPageNumbersRoute, pdfToJpgRoute, jpgToPdfRoute,
  aboutRoute, contactRoute, privacyRoute, disclaimerRoute, termsRoute,
  blogIndexRoute, blogArticleRoute,
  adminRoute, adminLoginRoute, adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
