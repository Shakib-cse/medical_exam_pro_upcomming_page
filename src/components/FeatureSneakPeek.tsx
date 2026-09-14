"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Database,
  MonitorCheck,
  TrendingUp,
  Smartphone,
  CheckCircle,
  Layers,
  Sparkles,
} from "lucide-react";

interface FeatureTab {
  id: string;
  name: string;
  icon: React.ElementType;
  badge: string;
  heading: string;
  description: string;
  bulletPoints: string[];
  stats: { value: string; label: string }[];
  imageSrc?: string;
}

const TABS: FeatureTab[] = [
  {
    id: "qbank",
    name: "10,000+ Question Bank",
    icon: Database,
    badge: "Clinical Depth",
    heading: "Curated by UK NHS Consultants & Specialty Registrars",
    description:
      "Every question is crafted with authentic clinical scenarios reflecting the modern UK MSRA blueprint, GMC Good Medical Practice guidelines, and NICE recommendations.",
    bulletPoints: [
      "8,000+ Clinical Problem Solving (CPS) multiple-choice and extended matching cases",
      "2,500+ Professional Dilemma (PD) situational judgment questions with ranked scoring",
      "Regularly updated to reflect 2026 NICE guideline changes and GMC Good Medical Practice",
      "Granular topic filtering across all 12 major medical and surgical specialties",
    ],
    stats: [
      { value: "10,000+", label: "Vetted Questions" },
      { value: "100%", label: "Curriculum Match" },
      { value: "12", label: "Medical Specialties" },
    ],
    imageSrc: "/images/msraimage.png",
  },
  {
    id: "simulator",
    name: "Pearson VUE Simulator",
    icon: MonitorCheck,
    badge: "Exam Day Fidelity",
    heading: "Pixel-Perfect Test Center Experience",
    description:
      "Train in the exact environment you will face on exam day. Eliminate interface shock and master your time management under real exam pressure.",
    bulletPoints: [
      "Exact replicate of the Pearson VUE MSRA user interface, shortcuts, and navigation",
      "10 full-length timed mock exams replicating official 170-minute pacing",
      "Custom test builder: filter by unattempted, flagged, or incorrect questions",
      "Section split: 75-minute CPS and 95-minute Professional Dilemma simulation",
    ],
    stats: [
      { value: "10", label: "Full Mock Exams" },
      { value: "1:1", label: "VUE Interface Match" },
      { value: "170 min", label: "Full Test Rigor" },
    ],
    imageSrc: "/images/sectiontwo.png",
  },
  {
    id: "analytics",
    name: "AI Analytics & Rank Predictor",
    icon: TrendingUp,
    badge: "Smart Diagnosis",
    heading: "Know Your Decile Before Exam Day",
    description:
      "Our predictive AI algorithm correlates your practice performance against thousands of historical NHS candidate benchmarks to estimate your decile score.",
    bulletPoints: [
      "Predictive Specialty Match: Know your likelihood for Radiology, GP, Anaesthetics, or CST",
      "Topic Weakness Heatmap: Pinpoints low-yield study time and flags critical blindspots",
      "Speed & Pacing Analysis: Identifies questions where you spend disproportionate time",
      "Dynamic comparative ranking against national candidate peer percentiles",
    ],
    stats: [
      { value: "Top 10%", label: "Target Decile Aim" },
      { value: "94%", label: "Prediction Accuracy" },
      { value: "Real-time", label: "Peer Benchmarking" },
    ],
    imageSrc: "/images/about_doctors.png",
  },
  {
    id: "mobile",
    name: "Mobile & Offline Sync",
    icon: Smartphone,
    badge: "Everywhere You Go",
    heading: "Study Between Ward Rounds & Commutes",
    description:
      "Designed for busy NHS junior doctors. Seamlessly continue your revision on iOS and Android with instantaneous cloud synchronization.",
    bulletPoints: [
      "Native iOS & Android mobile companion apps releasing alongside web launch",
      "Download custom question blocks for offline practice in signal-dead hospital basements",
      "Rapid-fire audio clinical pearls for on-the-go commute listening",
      "Instant state synchronization between phone, tablet, and desktop browser",
    ],
    stats: [
      { value: "iOS & Android", label: "Cross-Platform" },
      { value: "Offline Mode", label: "Ward-Ready" },
      { value: "<1s", label: "Cloud Sync Speed" },
    ],
    imageSrc: "/images/mobile.png",
  },
];

export default function FeatureSneakPeek() {
  const [activeTabId, setActiveTabId] = useState("qbank");

  const currentTab = TABS.find((t) => t.id === activeTabId) || TABS[0];

  return (
    <section id="features-sneak-peek" className="w-full max-w-6xl mx-auto my-12 sm:my-20 px-3 sm:px-4 scroll-mt-24">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 px-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D82EB]/15 border border-[#1D82EB]/30 text-[#38BDF8] text-xs font-semibold mb-3">
          <Layers className="w-4 h-4" />
          <span>PLATFORM OVERVIEW</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Upcoming Platform Features
        </h2>
        <p className="mt-2 text-xs sm:text-base text-slate-300">
          Core training modules currently in preparation for UK MSRA candidates.
        </p>
      </div>

      {/* Tab Navigation Buttons */}
      <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-3 sm:pb-4 mb-4 sm:mb-6 no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 border cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-[#1D82EB] to-[#00a8ff] text-white border-[#38BDF8] shadow-lg shadow-[#1D82EB]/30 scale-[1.02]"
                  : "bg-[#061727]/80 text-slate-400 hover:text-slate-200 border-white/10 hover:border-white/20"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#09253f]/90 via-[#07192c]/95 to-[#041220]/95 border border-[#1D82EB]/25 p-4 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#38BDF8]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>{currentTab.badge}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {currentTab.heading}
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {currentTab.description}
            </p>

            {/* Bullet Points */}
            <ul className="space-y-3 pt-1">
              {currentTab.bulletPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              {currentTab.stats.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="block text-lg sm:text-2xl font-black font-mono text-[#38BDF8]">
                    {s.value}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#030d17] group">
              <div className="aspect-[4/3] relative w-full overflow-hidden">
                {currentTab.imageSrc ? (
                  <Image
                    src={currentTab.imageSrc}
                    alt={currentTab.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#071d33] text-slate-400">
                    Feature Preview
                  </div>
                )}
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#041220] via-transparent to-transparent opacity-80" />
              </div>

              {/* Status overlay badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#061727]/90 backdrop-blur-md border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-semibold text-white">Platform Staging</span>
                </div>
                <span className="text-[11px] font-mono text-[#38BDF8] font-medium">MSRA Module</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
