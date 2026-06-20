import type { Metadata } from "next";
import { DM_Sans, Fraunces, Geist_Mono } from "next/font/google";
import { AppFooter } from "@/components/layout/AppFooter";
import { Providers } from "./providers";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkyBook — Flight Search & Booking",
  description: "Search, compare, and book flights across major US airlines.",
  applicationName: "SkyBook",
  themeColor: "#0c1222",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col app-canvas">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          {children}
          <AppFooter />
        </Providers>
      </body>
    </html>
  );
}
