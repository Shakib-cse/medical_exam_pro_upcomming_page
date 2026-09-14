"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "When will Kawan Medical Exam Pro go live on the main domain?",
    answer:
      "The platform is currently in final staging and testing and will be officially launched on this domain soon.",
  },
  {
    question: "What makes Medical Exam Pro different from existing question banks?",
    answer:
      "Medical Exam Pro is built specifically for UK medical recruitment exams, featuring authentic clinical question scenarios, GMC and NICE guideline alignments, and realistic exam pacing.",
  },
  {
    question: "Which medical exams and specialties are covered?",
    answer:
      "Our initial launch prioritizes the UK Multi-Specialty Recruitment Assessment (MSRA), serving candidates applying for General Practice (GP), Clinical Radiology, Anaesthetics & ACCS, Psychiatry, Ophthalmology, Core Surgical Training (CST), Emergency Medicine, and Obstetrics & Gynaecology.",
  },
  {
    question: "Will there be mobile app support for iOS and Android?",
    answer:
      "Yes. Mobile companion apps with offline caching will accompany the platform so candidates can review questions during ward rounds or commutes.",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="w-full max-w-4xl mx-auto my-12 sm:my-20 px-3 sm:px-4 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 px-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold mb-3">
          <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-xs sm:text-base text-slate-300">
          Direct answers about Kawan Medical Exam Pro and the upcoming platform.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-[#08223a]/90 border-[#1D82EB]/40 shadow-xl shadow-[#04101e]"
                  : "bg-[#051626]/70 border-white/10 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#38BDF8] shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
