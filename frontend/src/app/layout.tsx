import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SmartBooking - Appointment System',
  description: 'Book and manage your appointments with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className={`${inter.variable} antialiased h-full`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 