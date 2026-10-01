"use client";

import React from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import type { StatsData } from "@/types/preregistration";

interface RegistrationFormStepProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
  error: string | null;
  stats: StatsData;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RegistrationFormStep({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  error,
  stats,
  onSubmit,
}: RegistrationFormStepProps) {
  return (
    <div>
      {/* Header Content matching the mockup */}
      <div className="text-center mb-5">
        {/* Spots remaining badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d2a4d]/80 border border-[#1D82EB]/30 text-xs font-medium text-sky-200 mb-3.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span>
            <strong className="text-white font-bold">{stats.spotsRemaining}</strong> of{" "}
            {stats.maxDiscountSpots} early-bird spots left
          </span>
        </div>

        <h2 className="text-sm sm:text-base font-normal text-slate-300">
          Register your email for a
        </h2>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight my-1 drop-shadow-sm">
          50% launch discount
        </div>
        <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-sm mx-auto leading-relaxed">
          Be among the first 100 clinicians to access Medical Exam Pro with half-price early access.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={onSubmit} className="space-y-3">
        {/* Name Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            required
            minLength={2}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#020b14]/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#1D82EB] focus:ring-1 focus:ring-[#1D82EB] transition-colors"
          />
        </div>

        {/* Email Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#020b14]/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#1D82EB] focus:ring-1 focus:ring-[#1D82EB] transition-colors"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            placeholder="Create password (for launch access)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#020b14]/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#1D82EB] focus:ring-1 focus:ring-[#1D82EB] transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-5 rounded-lg bg-[#1D82EB] hover:bg-[#1572d3] text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#1D82EB]/30 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Sending Verification Code...</span>
            </>
          ) : (
            <>
              <span>Register & Claim 50% Off</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-3.5 text-center text-[11px] text-slate-400">
        🔒 We will send a 6-digit OTP to your Gmail/inbox to verify your spot.
      </p>
    </div>
  );
}
