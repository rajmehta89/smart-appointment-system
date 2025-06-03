import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "SmartBooking - Appointment System",
  description: "Book and manage your appointments with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
