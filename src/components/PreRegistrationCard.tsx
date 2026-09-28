"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface StatsData {
  totalRegistered: number;
  maxDiscountSpots: number;
  spotsRemaining: number;
  isDiscountAvailable: boolean;
  discountPercentage: number;
}

interface SuccessResult {
  email: string;
  fullName: string;
  queueNumber: number;
  isEligibleForDiscount: boolean;
  discountPercentage: number;
  discountCode: string;
  spotsRemaining?: number;
}

export default function PreRegistrationCard() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030/api/v1";

  // Form State
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // UI / Async State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [successData, setSuccessData] = useState<SuccessResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Resend Countdown
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Fetch live stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Resend OTP Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/preregistration/stats`);
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
      }
    } catch {
      // Fallback defaults if backend is momentarily unreachable
      setStats({
        totalRegistered: 0,
        maxDiscountSpots: 100,
        spotsRemaining: 100,
        isDiscountAvailable: true,
        discountPercentage: 50,
      });
    }
  };

  // Step 1: Submit Registration (Sends OTP to Gmail)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedFullName = fullName.trim();
    if (!trimmedFullName || trimmedFullName.length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/preregistration/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: trimmedFullName,
          email: trimmedEmail,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register. Please try again.");
      }

      // If user was already registered and verified
      if (data.alreadyRegistered && data.data) {
        setSuccessData(data.data);
        setStep("success");
        return;
      }

      // Move to OTP verification step
      setStep("otp");
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      // Focus first OTP input on next tick
      setTimeout(() => {
        document.getElementById("otp-0")?.focus();
      }, 100);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle OTP input typing & auto-advance
  const handleOtpChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Handle multiple digits (pasted or typed)
    if (clean.length > 1) {
      const pasted = clean.slice(0, 6).split("");
      const newOtp = ["", "", "", "", "", ""];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || "";
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pasted.length - 1, 5);
      document.getElementById(`otp-${nextIndex}`)?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = clean.slice(-1);
    setOtp(newOtp);

    // Auto advance
    if (clean && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Step 2: Handle Clipboard Paste for OTP (distributes all digits across all 6 boxes)
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digits = pastedText.replace(/\D/g, "").slice(0, 6);
    if (!digits) return;

    const newOtp = ["", "", "", "", "", ""];
    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i];
    }
    setOtp(newOtp);

    // Focus the last filled box
    const focusIndex = Math.min(digits.length - 1, 5);
    document.getElementById(`otp-${focusIndex}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        document.getElementById(`otp-${index - 1}`)?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      document.getElementById(`otp-${index - 1}`)?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Step 2: Submit OTP Verification
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/preregistration/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid verification code.");
      }

      setSuccessData(data.data);
      setStep("success");
      fetchStats(); // refresh remaining count
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/preregistration/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not resend code.");
      }

      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyDiscountCode = () => {
    if (successData?.discountCode) {
      navigator.clipboard.writeText(successData.discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-7">
      {/* Outer Card Container */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#071c35] to-[#041224] border border-[#1D82EB]/40 p-5 sm:p-7 shadow-2xl shadow-[#020b16]/90 backdrop-blur-md transition-all duration-300 hover:border-[#1D82EB]/60">
        
        {/* Glow corner accents */}
        <div className="absolute -top-px -left-px w-16 h-16 bg-gradient-to-br from-[#1D82EB]/30 to-transparent rounded-tl-2xl pointer-events-none" />
        <div className="absolute -bottom-px -right-px w-16 h-16 bg-gradient-to-tl from-[#FF6B00]/20 to-transparent rounded-br-2xl pointer-events-none" />

        {/* STEP 1: REGISTRATION FORM */}
        {step === "form" && (
          <div>
            {/* Header Content matching the mockup */}
            <div className="text-center mb-5">
              {/* Spots remaining badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d2a4d]/80 border border-[#1D82EB]/30 text-xs font-medium text-sky-200 mb-3.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>
                  {stats ? (
                    <>
                      <strong className="text-white font-bold">{stats.spotsRemaining}</strong> of{" "}
                      {stats.maxDiscountSpots} early-bird spots left
                    </>
                  ) : (
                    "Reserved for first 100 registrations"
                  )}
                </span>
              </div>

              <h2 className="text-sm sm:text-base font-normal text-slate-300">
                Register your email for a
              </h2>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight my-1 drop-shadow-sm">
                50% launch discount
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-sm mx-auto leading-relaxed">
                on your first subscription, reserved for the first 100 registrations.
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
            <form onSubmit={handleRegister} className="space-y-3">
              {/* Full Name Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  minLength={2}
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === "otp" && (
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
            <form onSubmit={handleVerifyOtp} className="space-y-4">
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
                    onPaste={handleOtpPaste}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
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
                onClick={() => {
                  setStep("form");
                  setError(null);
                }}
                className="hover:text-slate-200 transition-colors cursor-pointer"
              >
                ← Change email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || isLoading}
                className="text-sky-400 hover:text-sky-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {canResend ? "Resend OTP Code" : `Resend in ${countdown}s`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS & SPOT RESERVED */}
        {step === "success" && successData && (
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
                Congratulations! You are officially confirmed in the <strong className="text-emerald-400 font-bold">first 100 early-bird registrations</strong>. Your spot for the 50% launch discount is reserved.
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
                📧 <strong>Registered Email:</strong> <span className="text-white font-medium">{successData.email}</span>
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
        )}
      </div>
    </div>
  );
}
