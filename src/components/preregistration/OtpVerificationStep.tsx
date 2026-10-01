"use client";

import React from "react";
import { Mail, RefreshCw, ShieldCheck, AlertCircle } from "lucide-react";

interface OtpVerificationStepProps {
  email: string;
  otp: string[];
  isLoading: boolean;
  error: string | null;
  countdown: number;
  canResend: boolean;
  onOtpChange: (index: number, value: string) => void;
  onOtpPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onVerify: (e?: React.FormEvent) => void;
  onResend: () => void;
  onBackToForm: () => void;
}

export default function OtpVerificationStep({
  email,
  otp,
  isLoading,
  error,
  countdown,
  canResend,
  onOtpChange,
  onOtpPaste,
  onOtpKeyDown,
  onVerify,
  onResend,
  onBackToForm,
}: OtpVerificationStepProps) {
  return (
    <div className="text-center">
      {/* Header */}
      <div className="w-12 h-12 rounded-full bg-[#1D82EB]/15 border border-[#1D82EB]/30 text-[#1D82EB] flex items-center justify-center mx-auto mb-3">
        <Mail className="w-6 h-6 text-sky-400" />
      </div>

      <h3 className="text-lg font-bold text-white mb-1">
        Verify your email
      </h3>
      <p className="text-xs sm:text-sm text-slate-300 mb-1">
        We sent a 6-digit verification code to
      </p>
      <p className="text-xs sm:text-sm font-semibold text-sky-300 break-all mb-4">
        {email}
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* 6 Digit Input Boxes */}
      <form onSubmit={onVerify} className="space-y-4">
        <div className="flex justify-center items-center gap-2 sm:gap-2.5">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={digit}
              onPaste={onOtpPaste}
              onChange={(e) => onOtpChange(idx, e.target.value)}
              onKeyDown={(e) => onOtpKeyDown(idx, e)}
              className="w-10 sm:w-11 h-12 text-center text-lg font-mono font-bold text-white bg-[#020b14]/90 border border-slate-700 rounded-lg focus:border-[#1D82EB] focus:ring-2 focus:ring-[#1D82EB]/50 focus:outline-none transition-all"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={isLoading || otp.join("").length !== 6}
          className="w-full py-3 px-5 rounded-lg bg-[#1D82EB] hover:bg-[#1572d3] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1D82EB]/30 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm & Secure Spot</span>
            </>
          )}
        </button>
      </form>

      {/* Resend & Back actions */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onBackToForm}
          className="hover:text-slate-200 transition-colors cursor-pointer"
        >
          ← Change email
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={!canResend || isLoading}
          className="text-sky-400 hover:text-sky-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {canResend ? "Resend OTP Code" : `Resend in ${countdown}s`}
        </button>
      </div>
    </div>
  );
}
