"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 pb-2 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto rounded-full px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border transition-all duration-300 ${
          scrolled
            ? "bg-[#061727]/95 backdrop-blur-xl border-[#1D82EB]/30 shadow-2xl shadow-[#04101e]/80"
            : "bg-[#08223a]/80 backdrop-blur-md border-white/10 shadow-lg"
        }`}
      >
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="relative h-7 sm:h-9 w-32 sm:w-44 flex items-center">
            <Image
              src="/images/headerlogo.png"
              alt="Kawan Medical Exam Pro"
              width={180}
              height={44}
              priority
              className="object-contain max-h-7 sm:max-h-9 w-auto"
            />
          </div>
        </div>

        {/* Center Status Badge (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 bg-[#041322]/80 border border-[#1D82EB]/30 rounded-full px-3.5 py-1 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-200 tracking-wide">UK MSRA Preparation Platform</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => scrollToSection("interactive-sample")}
            className="group relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#FF6B00] to-[#ff8c3a] shadow-lg shadow-[#FF6B00]/30 hover:shadow-[#FF6B00]/50 hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            <span>Try Sample Case</span>
            <ArrowRight className="hidden xs:inline w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 shrink-0" />
          </button>
        </div>
      </div>
    </header>
  );
}
