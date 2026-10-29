import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { HOSPITAL_FACTS } from '@/data/facts';
import { SkipLink } from '@/components/shell/SkipLink';
import { DisclaimerBanner } from '@/components/shell/DisclaimerBanner';
import { EmergencyBar } from '@/components/shell/EmergencyBar';
import { Header } from '@/components/shell/Header';
import { Footer } from '@/components/shell/Footer';

const playfair = localFont({
  src: './fonts/PlayfairDisplay-VariableFont_wght.woff2',
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
});

const plusJakarta = localFont({
  src: './fonts/PlusJakartaSans-VariableFont_wght.woff2',
  variable: '--font-jakarta',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: `${HOSPITAL_FACTS.name} · Konsep "Hijau Tower"`,
  description: `Studi kasus portofolio independen redesign website ${HOSPITAL_FACTS.name}. Presisi medis berpadu warisan arsitektur islami modern.`,
  icons: {
    icon: '/tower-icon.svg',
    shortcut: '/tower-icon.svg',
    apple: '/tower-icon.svg',
  },
  openGraph: {
    title: `${HOSPITAL_FACTS.name} · Konsep "Hijau Tower"`,
    description: `Studi kasus portofolio independen redesign website ${HOSPITAL_FACTS.name}. Presisi medis berpadu warisan arsitektur islami modern.`,
    images: ['/tower-icon.svg'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="antialiased bg-ivory text-ink selection:bg-tower-800 selection:text-gold-100">
        <SkipLink />
        <DisclaimerBanner />
        <EmergencyBar />
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 pb-20 md:pb-0 focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
