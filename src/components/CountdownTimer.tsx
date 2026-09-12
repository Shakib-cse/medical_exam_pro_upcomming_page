"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { Calendar, Clock, Check } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const emptySubscribe = () => () => {};

export default function CountdownTimer() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 19,
    hours: 8,
    minutes: 42,
    seconds: 15,
  });
  const [calendarAdded, setCalendarAdded] = useState(false);

  useEffect(() => {
    // Exact Launch Target Date: 15 October 2026 at 09:00 BST (08:00 UTC)
    const targetDate = new Date("2026-10-15T08:00:00Z");

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCalendar = () => {
    const title = encodeURIComponent("Kawan Medical Exam Pro - Official Launch");
    const details = encodeURIComponent(
      "Kawan Medical Exam Pro goes live! Early access enrollees unlock secret launch perks, exclusive bonuses, and full platform access. 10,000+ MSRA questions, Pearson VUE simulator, and clinical analytics."
    );
    const location = encodeURIComponent("https://medicalexampro.com");
    // Google Calendar template targeting 15 October 2026 (20261015T080000Z to 20261015T120000Z)
    const dates = "20261015T080000Z/20261015T120000Z";
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(googleCalendarUrl, "_blank", "noopener,noreferrer");
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 4000);
  };

  const timeUnits = [
    { label: "DAYS", value: timeLeft.days, color: "from-[#1D82EB] to-[#38BDF8]" },
    { label: "HOURS", value: timeLeft.hours, color: "from-[#38BDF8] to-[#00d2ff]" },
    { label: "MINUTES", value: timeLeft.minutes, color: "from-[#FFA866] to-[#FF6B00]" },
    { label: "SECONDS", value: timeLeft.seconds, color: "from-[#FF6B00] to-[#ff4500]" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-4 sm:my-6 px-1 sm:px-4">
      {/* Launch Date Header (Mobile friendly centered/stacked) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 px-2">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-slate-300 text-center sm:text-left flex-wrap justify-center sm:justify-start">
          <span className="inline-block w-2 h-2 rounded-full bg-[#FF6B00] animate-ping shrink-0" />
          <span className="text-white font-bold uppercase tracking-wider">
            Launch Date: <span className="text-[#38BDF8]">15 October 2026</span>
          </span>
          <span className="text-slate-600 hidden xs:inline">•</span>
          <span className="text-slate-400 text-[11px] sm:text-xs">09:00 AM London (BST)</span>
        </div>

        <button
          onClick={handleAddToCalendar}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 px-3.5 py-1.5 rounded-full transition-all active:scale-95 shrink-0 cursor-pointer shadow-sm"
          title="Add 15 October launch reminder to Google Calendar"
        >
          {calendarAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Reminder Added</span>
            </>
          ) : (
            <>
              <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Add to Calendar</span>
            </>
          )}
        </button>
      </div>

      {/* Countdown Digits Grid - strictly optimized for mobile */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6">
        {timeUnits.map((unit, idx) => (
          <div
            key={unit.label}
            className="group relative flex flex-col items-center justify-center p-2.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#0d2a45]/90 to-[#07192c]/90 border border-white/10 shadow-xl shadow-[#030d17]/80 backdrop-blur-xl transition-all duration-300 hover:border-[#1D82EB]/40"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-t-xl sm:rounded-t-2xl" />

            {/* Glowing counter digits */}
            <div className="relative">
              <span
                className={`text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-mono tracking-tight bg-gradient-to-b ${unit.color} bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]`}
              >
                {mounted ? String(unit.value).padStart(2, "0") : "00"}
              </span>
            </div>

            {/* Unit Label */}
            <div className="mt-1 sm:mt-2 flex items-center justify-center">
              <span className="text-[9px] sm:text-xs md:text-sm font-bold tracking-wider sm:tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">
                {unit.label}
              </span>
            </div>

            {/* Subtle separator colon on desktop */}
            {idx < 3 && (
              <div className="hidden lg:block absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xl z-20 pointer-events-none">
                :
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ticker Subtext */}
      <div className="mt-4 text-center px-2">
        <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center gap-1.5 flex-wrap">
          <Clock className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
          <span>
            Going live on 15 October. Early enrolment unlocks <strong className="text-amber-300 font-bold">secret launch perks</strong> and exciting post-launch gifts!
          </span>
        </p>
      </div>
    </div>
  );
}
