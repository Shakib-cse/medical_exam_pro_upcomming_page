"use client";

import React, { useState, useEffect, useCallback } from "react";
import RegistrationFormStep from "./preregistration/RegistrationFormStep";
import OtpVerificationStep from "./preregistration/OtpVerificationStep";
import RegistrationSuccessStep from "./preregistration/RegistrationSuccessStep";
import {
  DEFAULT_STATS,
  type StatsData,
  type SuccessResult,
  type StepType,
} from "@/types/preregistration";

const STATS_STORAGE_KEY = "mep_prereg_stats";

export default function PreRegistrationCard() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://medical-exam-pro-backend.vercel.app/api/v1";

  // Form State
  const [step, setStep] = useState<StepType>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // UI / Async State - Instant default stats for zero layout shift
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData>(DEFAULT_STATS);
  const [successData, setSuccessData] = useState<SuccessResult | null>(null);

  // Resend Countdown
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Fetch live stats with timeout and sessionStorage caching for ultra-fast first paint
  const fetchStats = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${API_URL}/preregistration/stats`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const json = await res.json();
      if (json?.success && json?.data) {
        setStats(json.data);
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(json.data));
          } catch {
            // Ignore storage errors in private mode
          }
        }
      }
    } catch {
      // Keep existing or default stats gracefully without blocking UI
    }
  }, [API_URL]);

  // Load cached stats first, then revalidate in background
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem(STATS_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed.spotsRemaining === "number") {
            setStats(parsed);
          }
        }
      } catch {
        // Fallback to default stats
      }
    }
    fetchStats();
  }, [fetchStats]);

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

  // Step 1: Submit Registration (Sends OTP to Gmail)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError("Please enter your name (at least 2 characters).");
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
          fullName: trimmedName,
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

    if (clean && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Step 2: Handle Clipboard Paste for OTP
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
      fetchStats();
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

  return (
    <div className="w-full max-w-lg mx-auto mt-7">
      {/* Outer Card Container */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#071c35] to-[#041224] border border-[#1D82EB]/40 p-5 sm:p-7 shadow-2xl shadow-[#020b16]/90 backdrop-blur-md transition-all duration-300 hover:border-[#1D82EB]/60">
        {/* Glow corner accents */}
        <div className="absolute -top-px -left-px w-16 h-16 bg-gradient-to-br from-[#1D82EB]/30 to-transparent rounded-tl-2xl pointer-events-none" />
        <div className="absolute -bottom-px -right-px w-16 h-16 bg-gradient-to-tl from-[#FF6B00]/20 to-transparent rounded-br-2xl pointer-events-none" />

        {step === "form" && (
          <RegistrationFormStep
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
            error={error}
            stats={stats}
            onSubmit={handleRegister}
          />
        )}

        {step === "otp" && (
          <OtpVerificationStep
            email={email}
            otp={otp}
            isLoading={isLoading}
            error={error}
            countdown={countdown}
            canResend={canResend}
            onOtpChange={handleOtpChange}
            onOtpPaste={handleOtpPaste}
            onOtpKeyDown={handleOtpKeyDown}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onBackToForm={() => {
              setStep("form");
              setError(null);
            }}
          />
        )}

        {step === "success" && successData && (
          <RegistrationSuccessStep successData={successData} />
        )}
      </div>
    </div>
  );
}
