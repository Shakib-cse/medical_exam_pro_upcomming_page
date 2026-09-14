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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#030d17] text-slate-100 selection:bg-[#FF6B00] selection:text-white">
        {children}
      </body>
    </html>
  );
}
