"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Award,
  CheckCircle2,
  Copy,
  Share2,
  Lock,
  ArrowRight,
  Stethoscope,
  Zap,
} from "lucide-react";

interface VIPPassData {
  name: string;
  email: string;
  specialty: string;
  stage: string;
  vipId: string;
  joinedAt: string;
}

const SPECIALTIES = [
  "General Practice (GP)",
  "Clinical Radiology",
  "Anaesthetics & ACCS",
  "Psychiatry",
  "Ophthalmology",
  "Core Surgical Training (CST)",
  "Emergency Medicine (ACCS EM)",
  "Internal Medicine Training (IMT)",
  "Obstetrics & Gynaecology (O&G)",
  "Paediatrics",
  "Public Health / Other",
];

const STAGES = [
  "Foundation Doctor (FY1/FY2)",
  "Clinical Fellow / Trust Grade",
  "International Medical Graduate (IMG)",
  "Core Trainee / Specialist Registrar",
  "Final Year Medical Student",
];

export default function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [stage, setStage] = useState(STAGES[0]);
  const [loading, setLoading] = useState(false);
  const [submittedPass, setSubmittedPass] = useState<VIPPassData | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Check if user already registered previously in localStorage
    try {
      const saved = localStorage.getItem("kmep_vip_pass");
      if (saved) {
        setSubmittedPass(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const triggerConfetti = () => {
    // Cinematic double confetti cannon
    const end = Date.now() + 1200;
    const colors = ["#FF6B00", "#1D82EB", "#00d2ff", "#10B981", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your name or doctor title.");
      return;
    }

    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }

    setLoading(true);

    // Generate randomized VIP number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newPass: VIPPassData = {
      name: name.trim().startsWith("Dr") ? name.trim() : `Dr. ${name.trim()}`,
      email: email.trim(),
      specialty,
      stage,
      vipId: `KMEP-${randomNum}`,
      joinedAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    try {
      // POST directly to Next.js API route which stores in Neon PostgreSQL
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPass),
      });

      const data = await res.json();
      if (!res.ok) {
        console.warn("[Waitlist] Response warning:", data);
      }
    } catch (err) {
      console.error("[Waitlist] Network or DB error:", err);
    } finally {
      setSubmittedPass(newPass);
      setLoading(false);

      try {
        localStorage.setItem("kmep_vip_pass", JSON.stringify(newPass));
      } catch {
        // ignore
      }

      triggerConfetti();
    }
  };

  const handleCopyLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(
      `I just claimed VIP Early Access to Kawan Medical Exam Pro! Get 10,000+ MSRA questions and early launch perks: ${url}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out Kawan Medical Exam Pro! They are launching the next-gen UK MSRA platform with 10,000+ clinical questions & mock exams very soon. Claim your VIP Early Access pass: ${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <section id="vip-waitlist" className="w-full max-w-4xl mx-auto my-8 sm:my-12 px-3 sm:px-4 scroll-mt-24">
      {/* Container Card */}
      <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 bg-gradient-to-b from-[#092845]/90 via-[#071d33]/95 to-[#041220]/95 border border-[#1D82EB]/30 shadow-2xl shadow-[#04101e] backdrop-blur-2xl overflow-hidden">
        {/* Decorative corner glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B00]/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1D82EB]/20 rounded-full blur-[90px] pointer-events-none" />

        {submittedPass ? (
          /* VIP PASS ISSUED VIEW */
          <div className="relative z-10 flex flex-col items-center text-center py-2 sm:py-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4 sm:mb-6">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>VIP Access Confirmed • Priority Invitation Activated</span>
            </div>

            <h3 className="text-xl sm:text-3xl font-bold text-white mb-2">
              Welcome aboard, {submittedPass.name}!
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mb-6 sm:mb-8 px-2">
              Your official launch access pass has been minted. We will notify you directly at{" "}
              <span className="text-[#38BDF8] font-mono font-medium">{submittedPass.email}</span> on{" "}
              <strong className="text-white">15 October 2026</strong>.
            </p>

            {/* Digital Holographic VIP Pass Card - Mobile optimized */}
            <div className="w-full max-w-md mx-auto p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0c2f52] via-[#082038] to-[#04111e] border-2 border-[#1D82EB]/50 shadow-2xl relative overflow-hidden group text-left">
              {/* Card Hologram shimmer bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 mb-3 sm:mb-4 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Stethoscope className="w-5 h-5 text-[#FF6B00] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                    KAWAN MEDICAL EXAM PRO
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono font-bold bg-[#FF6B00]/20 text-[#FF8533] border border-[#FF6B00]/30 shrink-0">
                  VIP FOUNDER PASS
                </span>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                <div>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400">Doctor / Candidate</span>
                  <p className="text-base sm:text-lg font-bold text-white truncate">{submittedPass.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">Target Specialty</span>
                    <p className="text-xs font-semibold text-[#38BDF8] truncate">{submittedPass.specialty}</p>
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">Career Stage</span>
                    <p className="text-xs font-semibold text-slate-200 truncate">{submittedPass.stage}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 border-t border-white/10">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">VIP Member ID</span>
                    <p className="text-xs sm:text-sm font-mono font-bold text-amber-400">{submittedPass.vipId}</p>
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">Official Launch</span>
                    <p className="text-xs font-mono font-bold text-slate-200">15 October 2026</p>
                  </div>
                </div>
              </div>

              {/* Locked Perks List with Secret Surprise */}
              <div className="mt-4 pt-3 sm:mt-5 sm:pt-4 border-t border-white/10">
                <span className="text-[11px] font-semibold text-slate-300 block mb-2">Locked Early Privileges:</span>
                <ul className="text-xs text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white">Priority Platform Access on 15 October</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-amber-200 font-semibold">🎁 Secret VIP Bonuses &amp; Gifts (Unlocking on Launch!)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>7 Days Complimentary Full Mock Simulator</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sharing / Referral buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 sm:mt-8 w-full max-w-md">
              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all active:scale-95 cursor-pointer"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#38BDF8]" />}
                <span>{copiedLink ? "Link Copied!" : "Copy Share Link"}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 transition-all active:scale-95 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#25D366]" />
                <span>Share with Doctor Colleagues</span>
              </button>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("kmep_vip_pass");
                setSubmittedPass(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4 mt-4 cursor-pointer"
            >
              Register Another Candidate
            </button>
          </div>
        ) : (
          /* FORM VIEW */
          <div className="relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 px-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-[#FF8533] text-xs font-semibold mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>EXCLUSIVE FOUNDER COHORT ACCESS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Claim VIP Early Access &amp; Secret Perks
              </h2>
              <p className="mt-2 text-xs sm:text-base text-slate-300">
                Reserve your priority access before our official launch on{" "}
                <strong className="text-white">15 October 2026</strong>. Early enrollees will unlock secret bonus question packs, mystery rewards, and exciting perks revealed immediately upon launch!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium text-center">
                  {errorMsg}
                </div>
              )}

              {/* Name input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#041220]/80 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#1D82EB] focus:ring-2 focus:ring-[#1D82EB]/25 transition-all"
                  required
                />
              </div>

              {/* Email input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address (NHS or Personal)
                </label>
                <input
                  type="email"
                  placeholder="doctor@example.com or name@nhs.net"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#041220]/80 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#1D82EB] focus:ring-2 focus:ring-[#1D82EB]/25 transition-all"
                  required
                />
              </div>

              {/* Grid: Specialty & Career Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Target Specialty
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#041220] border border-white/15 text-white text-sm focus:outline-none focus:border-[#1D82EB] transition-all cursor-pointer"
                  >
                    {SPECIALTIES.map((spec) => (
                      <option key={spec} value={spec} className="bg-[#07192c] text-white">
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Current Career Stage
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#041220] border border-white/15 text-white text-sm focus:outline-none focus:border-[#1D82EB] transition-all cursor-pointer"
                  >
                    {STAGES.map((stg) => (
                      <option key={stg} value={stg} className="bg-[#07192c] text-white">
                        {stg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white text-sm sm:text-base bg-gradient-to-r from-[#FF6B00] via-[#ff7a1a] to-[#ff8c3a] shadow-xl shadow-[#FF6B00]/30 hover:shadow-[#FF6B00]/50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Minting Your VIP Access Pass...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-200 fill-amber-200 shrink-0" />
                      <span>Claim VIP Early Access &amp; Secret Perks</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                    </>
                  )}
                </button>
              </div>

              {/* Privacy assurance */}
              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                <Lock className="w-3 h-3 text-slate-500" />
                <span>Zero spam. You will only receive launch alerts and exclusive early-bird privileges.</span>
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
