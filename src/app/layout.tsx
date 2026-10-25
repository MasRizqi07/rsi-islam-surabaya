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
  src: [
    {
      path: './fonts/PlayfairDisplay-VariableFont_wght.woff2',
      style: 'normal',
    },
    {
      path: './fonts/PlayfairDisplay-Italic-VariableFont_wght.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-playfair',
  display: 'swap',
});

const plusJakarta = localFont({
  src: './fonts/PlusJakartaSans-VariableFont_wght.woff2',
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${HOSPITAL_FACTS.name} · Konsep "Hijau Tower"`,
  description: `Studi kasus portofolio independen redesign website ${HOSPITAL_FACTS.name}. Presisi medis berpadu warisan arsitektur islami modern.`,
  icons: {
    icon: '/assets/Logo-RSI-Baru-320x320.jpeg',
    shortcut: '/assets/Logo-RSI-Baru-320x320.jpeg',
    apple: '/assets/Logo-RSI-Baru-320x320.jpeg',
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
