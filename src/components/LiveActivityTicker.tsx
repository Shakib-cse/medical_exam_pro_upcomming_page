"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, X } from "lucide-react";

interface ActivityItem {
  name: string;
  deanery: string;
  specialty: string;
  timeAgo: string;
}

const ACTIVITIES: ActivityItem[] = [
  { name: "Dr. Alistair M.", deanery: "London (KSS)", specialty: "Radiology", timeAgo: "2m ago" },
  { name: "Dr. Chloe T.", deanery: "West Midlands", specialty: "General Practice", timeAgo: "5m ago" },
  { name: "Dr. Farhan A.", deanery: "Severn Deanery", specialty: "Anaesthetics", timeAgo: "8m ago" },
  { name: "Dr. Emily W.", deanery: "Oxford / Thames Valley", specialty: "Core Surgery", timeAgo: "12m ago" },
  { name: "Dr. Priya N.", deanery: "Scotland East", specialty: "Psychiatry", timeAgo: "15m ago" },
  { name: "Dr. Daniel R.", deanery: "North West (Manchester)", specialty: "Emergency Med", timeAgo: "19m ago" },
];

export default function LiveActivityTicker() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % ACTIVITIES.length);
        setVisible(true);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  const current = ACTIVITIES[currentIdx];

  return (
    <aside aria-label="Recent registrations" className="fixed bottom-6 sm:bottom-5 left-3 right-3 sm:right-auto sm:left-5 z-40 max-w-sm pointer-events-auto">
      <div
        className={`transition-all duration-400 transform ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        } rounded-2xl bg-[#071d33]/95 backdrop-blur-xl border border-[#1D82EB]/30 p-2.5 sm:p-3.5 shadow-2xl shadow-[#020b14] flex items-center justify-between gap-2.5 sm:gap-3`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-emerald-400 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>

          <div className="text-left">
            <div className="text-xs font-semibold text-white flex items-center gap-1.5 flex-wrap">
              <span>{current.name}</span>
              <span className="text-slate-400 text-[10px]">({current.deanery})</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Reserved VIP pass for <span className="text-[#38BDF8] font-medium">{current.specialty}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pl-2 border-l border-white/10 shrink-0">
          <span className="text-[10px] text-slate-400 font-mono">{current.timeAgo}</span>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Dismiss notifications"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
