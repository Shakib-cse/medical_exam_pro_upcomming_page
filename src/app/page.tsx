"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import CountdownTimer from "@/components/CountdownTimer";
import WaitlistForm from "@/components/WaitlistForm";
import InteractiveCaseStudy from "@/components/InteractiveCaseStudy";
import FeatureSneakPeek from "@/components/FeatureSneakPeek";
import LiveActivityTicker from "@/components/LiveActivityTicker";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import {
  Sparkles,
  ArrowRight,
  Stethoscope,
} from "lucide-react";

export default function UpcomingHomePage() {
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030d17] text-slate-100 overflow-x-hidden">
      {/* Dynamic Background Network Canvas */}
      <BackgroundCanvas />

      {/* Floating Header */}
      <Navbar />

      {/* Hero Section */}
      <main className="relative z-10 pt-24 sm:pt-36 lg:pt-40 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          
          {/* Top Pill / Launch Date */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#0d2a45]/95 to-[#07192c]/95 border border-[#1D82EB]/40 text-[11px] sm:text-xs font-semibold text-[#38BDF8] shadow-lg shadow-[#04101e] mb-5 sm:mb-6 animate-float-slow">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]"></span>
            </span>
            <span className="tracking-wide">LAUNCHING 15 OCTOBER 2026 • KAWAN MEDICAL EXAM PRO</span>
          </div>

          {/* Headline - fully responsive */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12] sm:leading-[1.08] max-w-4xl px-1">
            Prepare Your Highest Decile on the{" "}
            <span className="bg-gradient-to-r from-[#FF6B00] via-[#ff8533] to-[#ffaa66] bg-clip-text text-transparent">
              UK MSRA
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed px-2">
            The next-generation clinical exam training platform is arriving on this domain on{" "}
            <strong className="text-white font-semibold">15 October 2026</strong>.
            Engineered by UK NHS doctors with 10,000+ realistic questions, Pearson VUE exam simulator, and AI rank analytics.
          </p>

          {/* Early Enrolment Mystery Perks Highlight */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FF6B00]/15 via-[#1D82EB]/15 to-[#FF6B00]/15 border border-[#FF6B00]/30 text-xs sm:text-sm text-slate-200 shadow-md">
            <span className="font-bold text-[#FF8533]">🎁 Early Enrolment Privilege:</span>
            <span className="text-slate-300 hidden xs:inline">
              Lock in priority access + secret exciting perks revealed after launch!
            </span>
            <span className="text-slate-300 xs:hidden">
              Secret perks &amp; gifts revealed upon launch!
            </span>
          </div>

          {/* Quick CTA Buttons - full width on mobile, inline on desktop */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md sm:max-w-none px-2">
            <button
              onClick={() => scrollToId("vip-waitlist")}
              className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#FF6B00] via-[#ff7a1a] to-[#ff8c3a] shadow-xl shadow-[#FF6B00]/30 hover:shadow-[#FF6B00]/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200 shrink-0" />
              <span>Claim VIP Early Access Pass</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            <button
              onClick={() => scrollToId("interactive-sample")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold text-slate-200 bg-[#071d33]/90 hover:bg-[#0c2f52] border border-white/15 hover:border-[#1D82EB]/50 transition-all active:scale-95 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span>Try Interactive Sample Case</span>
            </button>
          </div>

          {/* Countdown Clock */}
          <div className="w-full mt-6 sm:mt-10">
            <CountdownTimer />
          </div>

          {/* High-Level Stats Grid - clean 2x2 on mobile, 4-col on desktop */}
          <div className="w-full max-w-4xl mt-6 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
            <div className="flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#092742]/70 border border-white/10 backdrop-blur-md">
              <span className="text-xl sm:text-2xl font-black font-mono text-white">10,000+</span>
              <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5">MSRA Questions</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#092742]/70 border border-white/10 backdrop-blur-md">
              <span className="text-xl sm:text-2xl font-black font-mono text-[#38BDF8]">10 Full</span>
              <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Mock Simulators</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#092742]/70 border border-white/10 backdrop-blur-md">
              <span className="text-xl sm:text-2xl font-black font-mono text-[#FF8533]">1:1 VUE</span>
              <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Interface Replica</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#092742]/70 border border-white/10 backdrop-blur-md">
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">100% NHS</span>
              <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Consultant Vetted</span>
            </div>
          </div>
        </div>

        {/* Interactive Sample Section */}
        <InteractiveCaseStudy />

        {/* Feature Sneak Peek Tabs */}
        <FeatureSneakPeek />

        {/* VIP Waitlist Subscription Card */}
        <WaitlistForm />

        {/* FAQ Accordion */}
        <FaqSection />
      </main>

      {/* Real-Time Live Activity Notification Ticker */}
      <LiveActivityTicker />

      {/* Footer */}
      <Footer />
    </div>
  );
}
