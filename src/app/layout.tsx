import type { Metadata, Viewport } from 'next';
import { Geologica, Golos_Text } from 'next/font/google';
import type { ReactNode } from 'react';
import { appStoreId, meta, siteUrl } from '@/content/site';
import './globals.css';

// Mongolian needs the Cyrillic extension (ө, ү); the tögrög sign ₮ sits in Latin Extended.
// next/font reads these calls at build time, so the options have to be written out literally.
const head = Geologica({ subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'], display: 'swap', variable: '--font-head' });
const body = Golos_Text({ subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'], display: 'swap', variable: '--font-body' });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: meta.title,
  description: meta.description,
  applicationName: 'BiD Pay',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'mn_MN', siteName: 'BiD Pay', title: meta.title, description: meta.description, url: '/' },
  twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
  itunes: { appId: appStoreId },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f7f6f2',
};

/**
 * Runs before first paint. When the 3D scene can play (motion allowed, WebGL present) it marks the page so the
 * still image behind the scene stays hidden instead of flashing first. See Hero.tsx and globals.css.
 */
const sceneGate = `(function(){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&window.WebGLRenderingContext)document.documentElement.setAttribute('data-3d','')}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="mn" className={`${head.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: sceneGate }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
