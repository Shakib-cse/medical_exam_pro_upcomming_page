import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#030d17",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://medicalexampro.com"),
  title: "Medical Exam Pro — Launching November 2026",
  description:
    "The clinical exam preparation platform for the UK MSRA and medical recruitment exams. Launching November 2026.",
  keywords: [
    "MSRA",
    "Medical Exam Pro",
    "Clinical Problem Solving",
    "Professional Dilemma",
    "UK Medical Training",
    "GP Training",
    "Radiology MSRA",
    "Junior Doctors UK",
  ],
  openGraph: {
    title: "Medical Exam Pro — Launching November 2026",
    description:
      "The clinical exam preparation platform for the UK MSRA and medical recruitment exams. Launching November 2026.",
    images: [
      {
        url: "/images/headerlogo.png",
        width: 731,
        height: 84,
        alt: "Medical Exam Pro",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

import Analytics from "@/components/Analytics";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        {/* Preconnect to backend API domain for instant TLS handshake */}
        <link rel="preconnect" href="https://medical-exam-pro-backend.vercel.app" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://medical-exam-pro-backend.vercel.app" />
        {/* DNS prefetch for deferred analytics scripts */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {/* Preload critical LCP brand logo in optimized WebP format */}
        <link rel="preload" href="/images/headerlogo.webp" as="image" type="image/webp" />
      </head>
      <body className="min-h-full flex flex-col bg-[#030d17] text-slate-100 selection:bg-[#FF6B00] selection:text-white">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
