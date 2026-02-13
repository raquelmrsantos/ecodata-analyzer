import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoData Analyzer",
  description:
    "AI-powered energy and sustainability analysis platform for anomaly detection, insights, and carbon footprint optimization.",
  keywords: [
    "energy analysis",
    "sustainability",
    "AI insights",
    "carbon footprint",
    "data analytics",
    "anomaly detection",
    "OpenAI",
  ],
  authors: [{ name: "Raquel Santos" }],
  openGraph: {
    title: "EcoData Analyzer",
    description:
      "AI-powered energy and sustainability intelligence with real-time insights.",
    url: "https://ecodata-analyzer.vercel.app",
    siteName: "EcoData Analyzer",
    locale: "en_US",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
