import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { SkipLink } from '@/components/shell/SkipLink';
import { DisclaimerBanner } from '@/components/shell/DisclaimerBanner';
import { EmergencyBar } from '@/components/shell/EmergencyBar';
import { Header } from '@/components/shell/Header';
import { Footer } from '@/components/shell/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RS Islam Surabaya A. Yani · Konsep "Hijau Tower"',
  description: 'Studi kasus portofolio independen redesign website RS Islam Surabaya A. Yani. Presisi medis berpadu warisan arsitektur islami modern.',
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
    <html lang="id" className={`${playfair.variable} ${plusJakarta.variable}`}>
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
