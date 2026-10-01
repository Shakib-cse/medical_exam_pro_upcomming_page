"use client";

import React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import type { SuccessResult } from "@/types/preregistration";

interface RegistrationSuccessStepProps {
  successData: SuccessResult;
}

export default function RegistrationSuccessStep({
  successData,
}: RegistrationSuccessStepProps) {
  return (
    <div className="text-center py-1">
      {/* Celebration Icon */}
      <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto mb-3">
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
      </div>

      <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-2">
        Registration Verified!
      </div>

      <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1">
        Spot #{successData.queueNumber} Secured
      </h3>

      {successData.isEligibleForDiscount ? (
        <p className="text-xs sm:text-sm text-slate-300 mb-4 max-w-sm mx-auto">
          Congratulations! You are officially confirmed in the{" "}
          <strong className="text-emerald-400 font-bold">first 100 early-bird registrations</strong>. Your spot for the 50% launch discount is reserved.
        </p>
      ) : (
        <p className="text-xs sm:text-sm text-slate-300 mb-4 max-w-sm mx-auto">
          You are confirmed on our official launch waitlist! We will notify you the moment MedicalExamPro goes live.
        </p>
      )}

      {/* Launch Notification Card */}
      <div className="p-4 rounded-xl bg-[#030d17]/90 border border-sky-500/30 text-xs text-slate-300 leading-relaxed text-left space-y-2 mb-2">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs border-b border-slate-800 pb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {successData.isEligibleForDiscount
              ? "50% Discount Reserved (First 100 Eligible)"
              : "Launch Waitlist Position Confirmed"}
          </span>
        </div>
        <p>
          📧 <strong>Registered Email:</strong>{" "}
          <span className="text-white font-medium">{successData.email}</span>
        </p>
        <p>
          🚀 <strong>Official Launch:</strong> November 2026
        </p>
        <p className="text-slate-400 pt-1 text-[11px] leading-normal border-t border-slate-800/60">
          {successData.isEligibleForDiscount
            ? "💡 Our team will email your exclusive 50% discount access directly to your inbox when we officially go live."
            : "💡 You will be among the first to receive access when MedicalExamPro launches."}
        </p>
      </div>
    </div>
  );
}
