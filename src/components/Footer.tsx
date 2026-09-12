"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Heart,
  Globe,
  MessageSquare,
  X,
  Check,
} from "lucide-react";

export default function Footer() {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactModalOpen(false);
      setContactSent(false);
      setContactEmail("");
      setContactMsg("");
    }, 2500);
  };

  return (
    <footer className="w-full border-t border-white/10 bg-[#020b14] pt-14 pb-10 px-4 sm:px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Domain status */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative h-9 w-44">
              <Image
                src="/images/headerlogo.png"
                alt="Kawan Medical Exam Pro"
                width={180}
                height={40}
                className="object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier digital preparation platform for UK Medical &amp; MSRA Recruitment Exams.
              Built by NHS doctors, for NHS doctors.
            </p>

            <div className="p-3 rounded-xl bg-[#07192c] border border-white/10 max-w-sm">
              <div className="flex items-center gap-2 text-xs text-[#38BDF8] font-mono mb-1">
                <Globe className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span className="font-bold">Official Domain Notice:</span>
              </div>
              <p className="text-[11px] text-slate-400">
                This page is live while DNS and server clusters are provisioned for the main domain of Kawan Medical Exam Pro.
              </p>
            </div>
          </div>

          {/* Col 2: Curricula & Specialties */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Covered Specialties (2026)
            </h4>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="hover:text-white transition-colors">General Practice (GP) Recruitment</li>
              <li className="hover:text-white transition-colors">Clinical Radiology ST1</li>
              <li className="hover:text-white transition-colors">Anaesthetics &amp; ACCS Training</li>
              <li className="hover:text-white transition-colors">Core Surgical Training (CST)</li>
              <li className="hover:text-white transition-colors">Psychiatry &amp; Emergency Medicine</li>
            </ul>
          </div>

          {/* Col 3: Direct Inquiries */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Institutional &amp; Support
            </h4>
            <p className="text-xs text-slate-400">
              Questions about institutional licenses or hospital trust subscriptions?
            </p>
            <button
              onClick={() => setContactModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Contact Founding Team</span>
            </button>
          </div>
        </div>

        {/* Bottom Compliance & Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>GMC Good Medical Practice (2024) Aligned</span>
            </div>
            <span>•</span>
            <span>NICE CKS Guidelines Standard</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#FF6B00] fill-[#FF6B00]" />
            <span>for UK Medical Aspirants</span>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#09253f] border border-white/15 shadow-2xl relative">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            {contactSent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Message Received</h4>
                <p className="text-xs text-slate-300">
                  Our academic and medical lead will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-4">
                <h4 className="text-lg font-bold text-white">Contact Medical Exam Pro</h4>
                <p className="text-xs text-slate-300">
                  Send a direct inquiry regarding domain deployment, questions, or institutional access.
                </p>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-300 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@nhs.net"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#041220] border border-white/15 text-white text-xs focus:outline-none focus:border-[#1D82EB]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="How can we assist you?"
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#041220] border border-white/15 text-white text-xs focus:outline-none focus:border-[#1D82EB]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#FF6B00] to-[#ff8c3a] text-white hover:brightness-110 transition-all cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
