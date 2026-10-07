"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Calendar, Mail } from "lucide-react";
import type { SuccessResult } from "@/types/preregistration";

interface RegistrationSuccessStepProps {
  successData: SuccessResult;
}

export default function RegistrationSuccessStep({
  successData,
}: RegistrationSuccessStepProps) {
  const isDiscount = successData.isEligibleForDiscount;

  return (
    <div className="text-center py-2">
      {/* Verification Icon */}
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto mb-3">
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
      </div>

      <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-2">
        Registration Verified
      </div>

      <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 tracking-tight">
        {isDiscount ? "50% Launch Discount Confirmed" : "Pre-Registration Confirmed"}
      </h3>

      <p className="text-xs sm:text-sm text-slate-300 mb-5 max-w-sm mx-auto leading-relaxed">
        {isDiscount
          ? "Thank you for registering. Your email address has been verified and your 50% early-bird launch discount has been secured."
          : "Thank you for registering. Your email address has been verified and you are confirmed on our official launch waitlist."}
      </p>

      {/* Confirmation Details Card */}
      <div className="p-4 rounded-xl bg-[#030d17]/90 border border-sky-500/30 text-xs text-slate-300 text-left space-y-3 mb-2">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs border-b border-slate-800 pb-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {isDiscount
              ? "Early-Bird 50% Discount Reserved"
              : "Launch Waitlist Confirmed"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-slate-400 block text-[11px]">Registered Email</span>
            <span className="text-white font-medium truncate block">{successData.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="text-slate-400 block text-[11px]">Target Launch</span>
            <span className="text-white font-medium block">November 2026</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 text-slate-400 text-[11px] leading-relaxed">
          {isDiscount
            ? "We will email your exclusive early-access link and discount activation instructions directly to this email when Medical Exam Pro launches."
            : "We will email your launch invitation directly to this email address when Medical Exam Pro officially opens."}
        </div>
      </div>
    </div>
  );
}
