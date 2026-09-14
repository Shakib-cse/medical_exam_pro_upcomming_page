"use client";

import React from "react";
import Image from "next/image";
import BackgroundCanvas from "@/components/BackgroundCanvas";

export default function UpcomingHomePage() {
  return (
    <div className="relative min-h-screen bg-[#030d17] text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Dynamic Background Network Canvas */}
      <BackgroundCanvas />

      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-b from-[#1D82EB]/15 via-[#FF6B00]/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Top spacer */}
      <div className="pt-8 sm:pt-12 px-6" />

      {/* Main Centered Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center my-auto py-12">
        {/* Medical Exam Pro Logo */}
        <div className="relative h-14 sm:h-20 w-64 sm:w-80 mb-8 flex items-center justify-center">
          <Image
            src="/images/headerlogo.png"
            alt="Medical Exam Pro"
            width={320}
            height={80}
            priority
            className="object-contain w-auto h-full drop-shadow-md"
          />
        </div>

        {/* Launching Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#071d33]/90 border border-[#1D82EB]/30 text-xs sm:text-sm font-medium text-slate-200 shadow-xl shadow-[#04101e] mb-6">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]"></span>
          </span>
          <span className="tracking-wide">
            Launching <strong className="text-white font-bold">November 2026</strong>
          </span>
        </div>

        {/* One Short Description */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-xl">
          The clinical exam preparation platform for the UK MSRA and medical recruitment exams. Arriving soon on this domain.
        </p>
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Medical Exam Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
