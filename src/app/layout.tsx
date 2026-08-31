import type { Metadata } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Header } from "@/components/ui/header";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kalkulators.my.id - Pusat Kalkulator Indonesia",
  description: "Platform kalkulator utilitas terpadu untuk industri, finansial, medis, dan gaya hidup di Indonesia.",
};

import { Footer } from "@/components/ui/footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-base text-primary">
        <GoogleAnalytics gaId="G-WLPT61EFPG" />
        <NuqsAdapter>
          <Header />
          {children}
          <Footer />
        </NuqsAdapter>
      </body>
    </html>
  );
}
