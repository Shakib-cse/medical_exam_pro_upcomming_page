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
  title: "Kawan Medical Exam Pro — Launching Soon | The Ultimate UK MSRA Platform",
  description:
    "Prepare your strongest performance on the UK MSRA and specialty recruitment exams. 10,000+ clinical questions, realistic mock exam simulators, and AI analytics. Coming very soon to the official domain.",
  keywords: [
    "MSRA",
    "Medical Exam Pro",
    "Kawan Medical Exam Pro",
    "Clinical Problem Solving",
    "Professional Dilemma",
    "UK Medical Training",
    "GP Training",
    "Radiology MSRA",
    "Junior Doctors UK",
  ],
  openGraph: {
    title: "Kawan Medical Exam Pro — Launching Soon",
    description:
      "Thousands of carefully written questions by UK doctors, tailored to the real MSRA and UK medical training applications. Register for VIP Early Access.",
    images: [
      {
        url: "/images/banner.png",
        width: 1200,
        height: 630,
        alt: "Kawan Medical Exam Pro Launching Soon",
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
