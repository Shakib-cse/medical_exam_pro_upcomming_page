"use client";

import React, { useEffect, useState } from "react";
import {
  Download,
  Users,
  Search,
  RefreshCw,
  ArrowLeft,
  Stethoscope,
  Database,
} from "lucide-react";
import Link from "next/link";

interface LeadItem {
  id: string;
  vip_id: string;
  name: string;
  email: string;
  specialty: string;
  stage: string;
  created_at: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("ALL");

  const refreshLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/early-access/list");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/early-access/list")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!ignore) {
          setLeads(data.leads || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch leads:", err);
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Filtered leads
  const filtered = leads.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.vip_id.toLowerCase().includes(search.toLowerCase());

    const matchesSpecialty =
      filterSpecialty === "ALL" || item.specialty === filterSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  const uniqueSpecialties = Array.from(new Set(leads.map((l) => l.specialty)));

  return (
    <div className="min-h-screen bg-[#030d17] text-slate-100 p-4 sm:p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#38BDF8] hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Upcoming Launch Page</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Early Access Leads Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Neon PostgreSQL Live
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time candidate registrations stored in your Neon database for 15 October 2026 launch.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={refreshLeads}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <a
              href="/api/early-access?format=csv"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF6B00] via-[#ff7a1a] to-[#ff8c3a] shadow-lg shadow-[#FF6B00]/25 hover:shadow-[#FF6B00]/40 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV (Excel)</span>
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#092238]/90 to-[#051524]/90 border border-[#1D82EB]/30 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Early Access Applicants</span>
              <Users className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="text-3xl font-black text-white">{leads.length}</div>
            <p className="text-[11px] text-slate-400 mt-1">Verified records in Neon DB</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#092238]/90 to-[#051524]/90 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Target Exam Modality</span>
              <Stethoscope className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div className="text-xl font-bold text-white">UK MSRA 2026</div>
            <p className="text-[11px] text-[#FF8533] mt-1 font-semibold">Official Launch: 15 October 2026</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#092238]/90 to-[#051524]/90 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Database Engine</span>
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white">Neon Serverless</div>
            <p className="text-[11px] text-emerald-400 mt-1 font-mono">table: early_access_leads</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by doctor name, email, VIP ID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-[#041220] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#1D82EB]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 sm:pb-0">
            <button
              onClick={() => setFilterSpecialty("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filterSpecialty === "ALL"
                  ? "bg-[#1D82EB] text-white"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              All Specialties ({leads.length})
            </button>
            {uniqueSpecialties.map((spec) => {
              const count = leads.filter((l) => l.specialty === spec).length;
              return (
                <button
                  key={spec}
                  onClick={() => setFilterSpecialty(spec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    filterSpecialty === spec
                      ? "bg-[#1D82EB] text-white"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {spec} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Leads Table */}
        <div className="rounded-2xl border border-white/10 bg-[#06182a]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#38BDF8]" />
              <p className="text-xs">Loading leads from Neon PostgreSQL...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold text-white">No registrations found</p>
              <p className="text-xs text-slate-500 mt-1">
                {search ? "No records match your search filter." : "New signups from the early access form will appear here automatically."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#04101d] text-slate-400 uppercase text-[11px] font-bold border-b border-white/10 tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">VIP ID</th>
                    <th className="py-3.5 px-4">Doctor Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Specialty</th>
                    <th className="py-3.5 px-4">Career Stage</th>
                    <th className="py-3.5 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((row) => (
                    <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#FF8533]">
                        {row.vip_id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {row.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {row.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#1D82EB]/15 text-[#38BDF8] border border-[#1D82EB]/20 text-[11px] font-medium">
                          {row.specialty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {row.stage}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(row.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Kawan Medical Exam Pro • Confidential Early Enrolment Database • Protected by Neon PostgreSQL SSL
        </div>
      </div>
    </div>
  );
}
