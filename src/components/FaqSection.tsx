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
      "The official platform launch is set for 15 October 2026 at 09:00 London (BST). All cloud infrastructure and Pearson VUE simulator clusters are currently in final staging. Doctors who reserve their VIP Early Access pass will receive immediate priority notification and access at launch.",
  },
  {
    question: "What perks do I get with early enrolment today?",
    answer:
      "Early enrollees lock in priority platform access, secret post-launch bonuses, complimentary full mock exam simulator trials, and exclusive gifts that will be unveiled immediately after our 15 October launch!",
  },
  {
    question: "What makes Medical Exam Pro different from existing question banks?",
    answer:
      "Unlike outdated banks with obsolete question styles, Medical Exam Pro is built from scratch by UK NHS consultants and high-scoring registrars. We feature exact Pearson VUE test center software emulation, 2026 NICE guideline updates, and AI predictive rank analytics that forecast your specialty recruitment decile.",
  },
  {
    question: "Which medical exams and specialties are covered at launch?",
    answer:
      "Our initial launch prioritizes the UK Multi-Specialty Recruitment Assessment (MSRA), serving candidates applying for General Practice (GP), Clinical Radiology, Anaesthetics & ACCS, Psychiatry, Ophthalmology, Core Surgical Training (CST), Emergency Medicine, and Obstetrics & Gynaecology.",
  },
  {
    question: "Will there be mobile app support for iOS and Android?",
    answer:
      "Yes. The mobile companion apps are releasing alongside the web platform, featuring full offline question caching so you can revise smoothly during commutes or in hospital basements.",
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
          Everything You Need to Know
        </h2>
        <p className="mt-2 text-xs sm:text-base text-slate-300">
          Got questions about the 15 October launch? Here are direct answers.
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
