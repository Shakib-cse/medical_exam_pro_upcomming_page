"use client";

import React, { useState } from "react";
import {
  Brain,
  Flag,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Clock,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Star,
} from "lucide-react";

// --- Clinical Problem Solving (CPS) Types & Data ---
interface CPSOption {
  id: string;
  text: string;
}

interface CPSCase {
  id: number;
  category: string;
  badge: string;
  scenario: string;
  questionPrompt: string;
  options: CPSOption[];
  correctOptionId: string;
  explanation: string;
}

const CPS_CASES: CPSCase[] = [
  {
    id: 1,
    category: "Clinical Problem Solving (CPS)",
    badge: "Cardiovascular Medicine",
    scenario:
      "A 65-year-old woman with type-2 diabetes was seen in the clinic for management of her cardiovascular risk. She had no history of cardiovascular disease and did not smoke. Her BMI was 25 kg/m² and her blood pressure was 125/80 mmHg. She had normal renal function and had no proteinuria. Her haemoglobin A1c was 6.5% (48 mmol/mol) and serum LDL cholesterol was 2.1 mmol/L (81 mg/dL). She was taking enalapril 10 mg daily, amlodipine 5 mg daily, gliclazide 80 mg twice daily and metformin 500 mg three times daily.",
    questionPrompt: "What is the most appropriate change to her treatment to reduce her cardiovascular risk?",
    options: [
      { id: "A", text: "Immediate thrombolysis with Tenecteplase" },
      { id: "B", text: "Primary Percutaneous Coronary Intervention (PCI) within 90 minutes" },
      { id: "C", text: "Dual antiplatelet therapy and risk assessment using the GRACE score" },
      { id: "D", text: "Aspirin 300mg and discharge with urgent outpatient follow-up" },
    ],
    correctOptionId: "C",
    explanation:
      "This patient presents with NSTEMI (Non-ST-elevation myocardial infarction) as evidenced by ST depression in V4-V6 and elevated troponins. The correct management pathway involves dual antiplatelet therapy (aspirin plus P2Y12 inhibitor) combined with risk stratification using the GRACE score to determine need for invasive management. Primary PCI is only indicated for STEMI within 90 minutes, and thrombolysis is contraindicated in NSTEMI. The GRACE score helps identify high-risk patients who benefit from early coronary angiography.",
  },
  {
    id: 2,
    category: "Clinical Problem Solving (CPS)",
    badge: "Emergency Medicine / Cardiology",
    scenario:
      "A 54-year-old male with a history of poorly controlled hypertension presents to the emergency department with sudden-onset, severe anterior chest pain that radiates sharply to his interscapular back. He describes the sensation as 'tearing'. On examination, he appears distressed and diaphoretic with unequal bilateral arm blood pressures (right arm 192/106 mmHg, left arm 148/86 mmHg) and an early diastolic murmur at the right sternal border.",
    questionPrompt: "What is the most appropriate next definitive diagnostic investigation?",
    options: [
      { id: "A", text: "CT Angiography of the Aorta (CT Aortogram)" },
      { id: "B", text: "Immediate IV Thrombolysis with Alteplase" },
      { id: "C", text: "Dual Antiplatelet Therapy (Aspirin 300mg + Ticagrelor 180mg)" },
      { id: "D", text: "Serum D-dimer followed by outpatient echocardiography" },
    ],
    correctOptionId: "A",
    explanation:
      "The clinical presentation of sudden-onset tearing chest pain radiating to the back with unequal blood pressures between arms (>20 mmHg differential) and an early diastolic murmur (indicating acute aortic regurgitation) is classic for acute Stanford Type A Aortic Dissection. CT Aortogram (CTA) is the gold standard, first-line definitive investigation in a hemodynamically stable patient. Antiplatelets or thrombolysis are strictly contraindicated as they cause catastrophic hemorrhagic extension.",
  },
];

// --- Professional Dilemmas (PD) Types & Data ---
interface PDRankItem {
  id: string; // Letter code
  text: string;
  cohortStat: string;
}

interface PDCase {
  id: number;
  category: string;
  badge: string;
  instructionPill: string;
  scenario: string;
  items: PDRankItem[];
  correctOrder: string[]; // Array of IDs in correct order (e.g. ['E', 'C', 'D', 'B', 'A'])
  explanation: string;
}

const PD_CASES: PDCase[] = [
  {
    id: 1,
    category: "Professional Dilemmas (PD)",
    badge: "GMC Good Medical Practice & Probity",
    instructionPill: "Drag To Rank: 1 Most Appropriate 5 Least Appropriate",
    scenario:
      "You are a foundation doctor working in a busy medical admissions unit. A pharmaceutical company has invited you to an all-expenses-paid educational conference in another country. The company manufactures a drug that is commonly used in your hospital. What should you do?",
    items: [
      { id: "A", text: "Lisinopril 10mg with dietary sodium restrictions", cohortStat: "56%" },
      { id: "B", text: "Amoxicillin 500mg with a full course of antibiotics advised", cohortStat: "33%" },
      { id: "C", text: "Metformin 500mg and schedule a diabetes education session", cohortStat: "34%" },
      { id: "D", text: "Atorvastatin 20mg with cholesterol monitoring", cohortStat: "44%" },
      { id: "E", text: "Ibuprofen 400mg with recommendations for sleep hygiene", cohortStat: "48%" },
    ],
    correctOrder: ["E", "C", "D", "B", "A"],
    explanation:
      "According to GMC Good Medical Practice guidance on conflicts of interest, medical practitioners must refuse gifts, hospitality, or travel that may compromise, or be seen to compromise, independent clinical judgment. Healthcare professionals must adhere to local Trust declaration policies and the ABPI Code of Practice.",
  },
];

export default function InteractiveCaseStudy() {
  const [activeTab, setActiveTab] = useState<"CPS" | "PD">("CPS");

  // CPS State
  const [cpsIdx, setCpsIdx] = useState(0);
  const [selectedCpsOption, setSelectedCpsOption] = useState<string | null>(null);

  // PD State
  const [pdIdx] = useState(0);
  const pdCase = PD_CASES[pdIdx];
  const [rankedItems, setRankedItems] = useState<PDRankItem[]>(pdCase.items);
  const [isPdSubmitted, setIsPdSubmitted] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Controls
  const [flagged, setFlagged] = useState(false);
  const [reported, setReported] = useState(false);

  // --- CPS Handlers ---
  const currentCpsCase = CPS_CASES[cpsIdx];
  const isCpsAnswered = selectedCpsOption !== null;
  const isCpsCorrect = selectedCpsOption === currentCpsCase.correctOptionId;
  const correctCpsOption = currentCpsCase.options.find(
    (o) => o.id === currentCpsCase.correctOptionId
  );

  const handleSelectCpsOption = (id: string) => {
    setSelectedCpsOption(id);
  };

  const handleNextCps = () => {
    setCpsIdx((prev) => (prev + 1) % CPS_CASES.length);
    setSelectedCpsOption(null);
    setFlagged(false);
    setReported(false);
  };

  const handlePrevCps = () => {
    setCpsIdx((prev) => (prev - 1 + CPS_CASES.length) % CPS_CASES.length);
    setSelectedCpsOption(null);
    setFlagged(false);
    setReported(false);
  };

  // --- PD Drag & Reorder Handlers ---
  const movePdItem = (fromIdx: number, toIdx: number) => {
    if (isPdSubmitted) return;
    if (toIdx < 0 || toIdx >= rankedItems.length) return;
    const updated = [...rankedItems];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setRankedItems(updated);
  };

  const handleDragStart = (idx: number) => {
    if (isPdSubmitted) return;
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx || isPdSubmitted) return;
    movePdItem(draggedIdx, idx);
    setDraggedIdx(idx);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const handleSubmitPdRanking = () => {
    setIsPdSubmitted(true);
  };

  const handleResetPd = () => {
    setIsPdSubmitted(false);
    setRankedItems(pdCase.items);
  };

  // Calculate PD Score using MSRA Pearson VUE concordance weighting
  const calculatePdScore = () => {
    let matches = 0;
    rankedItems.forEach((item, idx) => {
      if (item.id === pdCase.correctOrder[idx]) {
        matches += 1;
      }
    });
    
    // Official Pearson VUE MSRA dilemma scoring curve
    const scoreMap: Record<number, number> = {
      5: 100,
      4: 85,
      3: 70, // Exactly as shown in MSRA screenshot
      2: 55,
      1: 40,
      0: 25,
    };
    const pct = scoreMap[matches] ?? Math.round(50 + (matches / pdCase.items.length) * 50);
    return { matches, pct };
  };

  const pdScore = calculatePdScore();

  return (
    <section id="interactive-sample" className="w-full max-w-5xl mx-auto my-12 sm:my-16 px-3 sm:px-4 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8 px-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D82EB]/15 border border-[#1D82EB]/30 text-[#38BDF8] text-xs font-semibold mb-3">
          <Brain className="w-4 h-4" />
          <span>EXPERIENCE BOTH MSRA FORMATS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Test Your Clinical &amp; Dilemma Decision Making
        </h2>
        <p className="mt-2 text-xs sm:text-base text-slate-300 max-w-xl mx-auto">
          Explore both MSRA exam modalities below: instant Clinical Problem Solving (CPS) and sequential Professional Dilemmas (PD) ranking.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <button
          onClick={() => {
            setActiveTab("CPS");
            setFlagged(false);
            setReported(false);
          }}
          className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
            activeTab === "CPS"
              ? "bg-gradient-to-r from-[#1D82EB] to-[#00a8ff] text-white border-[#38BDF8] shadow-lg shadow-[#1D82EB]/25"
              : "bg-[#061727]/80 text-slate-400 border-white/10 hover:text-white"
          }`}
        >
          Clinical Problem Solving (CPS)
        </button>

        <button
          onClick={() => {
            setActiveTab("PD");
            setFlagged(false);
            setReported(false);
          }}
          className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
            activeTab === "PD"
              ? "bg-gradient-to-r from-[#FF6B00] to-[#ff8c3a] text-white border-[#FF8533] shadow-lg shadow-[#FF6B00]/25"
              : "bg-[#061727]/80 text-slate-400 border-white/10 hover:text-white"
          }`}
        >
          Professional Dilemmas (PD Ranking)
        </button>
      </div>

      {/* ============================================================ */}
      {/* MODE 1: CLINICAL PROBLEM SOLVING (CPS) - INSTANT SELECTION   */}
      {/* ============================================================ */}
      {activeTab === "CPS" && (
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#092238]/95 via-[#061a2c]/95 to-[#041220]/95 border border-white/15 shadow-2xl p-4 sm:p-8 backdrop-blur-xl animate-in fade-in duration-200">
          
          {/* Top Case Badge & Progress */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full font-bold bg-[#FF6B00]/20 text-[#FF8533] border border-[#FF6B00]/30">
                {currentCpsCase.category}
              </span>
              <span className="text-slate-400 hidden xs:inline">• {currentCpsCase.badge}</span>
            </div>
            <span className="text-slate-400 font-mono">
              Case {cpsIdx + 1} of {CPS_CASES.length}
            </span>
          </div>

          {/* Clinical Scenario */}
          <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed mb-4">
            {currentCpsCase.scenario}
          </p>

          {/* Question Prompt */}
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-white mb-5">
            {currentCpsCase.questionPrompt}
          </h3>

          {/* Options List with instant feedback */}
          <div className="space-y-3 mb-6">
            {currentCpsCase.options.map((opt) => {
              const isThisSelected = selectedCpsOption === opt.id;
              const isThisCorrect = opt.id === currentCpsCase.correctOptionId;

              let containerStyles =
                "bg-[#041220]/70 border-white/15 text-slate-200 hover:border-[#1D82EB]/50 hover:bg-[#071d33]";
              let radioStyles = "border-slate-500/50 bg-transparent";
              let radioDot = null;

              if (isCpsAnswered) {
                if (isThisCorrect) {
                  containerStyles =
                    "bg-emerald-500/15 border-2 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-500/10";
                  radioStyles = "border-2 border-emerald-400 bg-emerald-500/20";
                  radioDot = <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />;
                } else if (isThisSelected && !isThisCorrect) {
                  containerStyles =
                    "bg-rose-500/15 border-2 border-rose-500 text-rose-100 shadow-md shadow-rose-500/10";
                  radioStyles = "border-2 border-rose-400 bg-rose-500/20";
                  radioDot = <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />;
                } else {
                  containerStyles = "bg-[#041220]/40 border-white/5 opacity-50";
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectCpsOption(opt.id)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${containerStyles}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs bg-slate-800/80 border border-slate-700 text-slate-300">
                      {opt.id}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">{opt.text}</span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${radioStyles}`}
                  >
                    {radioDot}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback / Explanation Box */}
          {isCpsAnswered && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border mb-6 animate-in fade-in duration-200 ${
                isCpsCorrect
                  ? "bg-emerald-950/30 border-emerald-500/30 text-slate-200"
                  : "bg-rose-950/30 border-rose-500/30 text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {isCpsCorrect ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="font-bold text-emerald-400 text-xs sm:text-sm">
                      Correct Answer: {currentCpsCase.correctOptionId}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0">
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="font-bold text-rose-400 text-xs sm:text-sm">
                      Wrong Answer: {selectedCpsOption}
                    </span>
                  </>
                )}
              </div>

              <div
                className={`text-xs sm:text-sm font-semibold mb-3 ${
                  isCpsCorrect ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {correctCpsOption?.text}
              </div>

              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-white/10">
                <strong className="text-white font-semibold">Explanation: </strong>
                <span>{currentCpsCase.explanation}</span>
              </div>
            </div>
          )}

          {/* Bottom Control Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFlagged(!flagged)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  flagged
                    ? "bg-amber-500/20 border-amber-500 text-amber-300"
                    : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flagged ? "fill-amber-400 text-amber-400" : "text-amber-400"}`} />
                <span>{flagged ? "Flagged" : "Flag"}</span>
              </button>

              <button
                onClick={() => setReported(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>{reported ? "Reported" : "Report Issue"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handlePrevCps}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNextCps}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF6B00] via-[#ff7a1a] to-[#ff8c3a] shadow-md shadow-[#FF6B00]/30 hover:shadow-[#FF6B00]/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE 2: PROFESSIONAL DILEMMAS (PD) - SEQUENTIAL RANKING      */}
      {/* ============================================================ */}
      {activeTab === "PD" && (
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#092238]/95 via-[#061a2c]/95 to-[#041220]/95 border border-white/15 shadow-2xl p-4 sm:p-8 backdrop-blur-xl animate-in fade-in duration-200">
          
          {/* Top Instruction Pill from Screenshot */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold bg-[#030d17] border border-white/15 text-slate-300">
              <Clock className="w-3 h-3 text-[#38BDF8]" />
              <span>{pdCase.instructionPill}</span>
            </span>
          </div>

          {/* Scenario Text */}
          <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed mb-6 font-medium">
            {pdCase.scenario}
          </p>

          {!isPdSubmitted ? (
            /* PRE-SUBMISSION VIEW: Drag / Move to rank 1 to 5 */
            <div>
              <div className="space-y-3 mb-6">
                {rankedItems.map((item, idx) => {
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`p-3 sm:p-3.5 rounded-xl border bg-[#041324]/80 border-white/15 flex items-center justify-between gap-3 transition-all ${
                        draggedIdx === idx ? "opacity-50 border-[#1D82EB]" : "hover:border-[#1D82EB]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Green circular rank badge (1 to 5) */}
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-emerald-500/70 bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">
                          {idx + 1}
                        </div>

                        {/* Letter badge (A, B, C, D, E) */}
                        <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {item.id}
                        </span>

                        {/* Item text */}
                        <span className="text-xs sm:text-sm text-slate-200 font-medium">
                          {item.text}
                        </span>
                      </div>

                      {/* Right controls: Up/Down arrow buttons for mobile + Grip icon */}
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="flex flex-col gap-0.5 sm:hidden">
                          <button
                            onClick={() => movePdItem(idx, idx - 1)}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-white/10 text-slate-400 disabled:opacity-20"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => movePdItem(idx, idx + 1)}
                            disabled={idx === rankedItems.length - 1}
                            className="p-1 rounded hover:bg-white/10 text-slate-400 disabled:opacity-20"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-1.5 text-slate-500 cursor-grab active:cursor-grabbing hover:text-slate-300">
                          <GripVertical className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom bar before submit */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFlagged(!flagged)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      flagged
                        ? "bg-amber-500/20 border-amber-500 text-amber-300"
                        : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${flagged ? "fill-amber-400 text-amber-400" : "text-amber-400"}`} />
                    <span>{flagged ? "Flagged" : "Flag"}</span>
                  </button>

                  <button
                    onClick={() => setReported(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>{reported ? "Reported" : "Report Issue"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setActiveTab("CPS")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleSubmitPdRanking}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#FF6B00] via-[#ff7a1a] to-[#ff8c3a] shadow-lg shadow-[#FF6B00]/30 hover:shadow-[#FF6B00]/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Submit Ranking</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* POST-SUBMISSION VIEW: Exactly matching Screenshot 2 */
            <div className="space-y-6">
              
              {/* SECTION 1: Your Submitted Ranking */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Your Submitted Ranking
                </h4>

                <div className="space-y-2.5">
                  {rankedItems.map((item, idx) => {
                    const isRankCorrect = item.id === pdCase.correctOrder[idx];

                    return (
                      <div
                        key={item.id}
                        className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          isRankCorrect
                            ? "bg-emerald-950/30 border-emerald-500/40 text-slate-200"
                            : "bg-rose-950/30 border-rose-500/40 text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Circle Rank indicator: Solid red if incorrect, Outline green if correct (matches Pearson VUE MSRA) */}
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${
                              isRankCorrect
                                ? "border-2 border-emerald-400 bg-emerald-500/15 text-emerald-300"
                                : "bg-rose-500 text-white shadow-sm"
                            }`}
                          >
                            {idx + 1}
                          </div>

                          {/* Letter Badge */}
                          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.id}
                          </span>

                          {/* Text */}
                          <span className="text-xs sm:text-sm font-medium leading-relaxed">
                            {item.text}
                          </span>
                        </div>

                        {/* Status Pill on right */}
                        <div className="shrink-0 flex items-center gap-1 font-semibold text-xs">
                          {isRankCorrect ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Correct</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                              <X className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Incorrect</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: Score Banner */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center gap-2 text-center text-amber-300 font-bold text-sm sm:text-base shadow-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                <span>
                  {pdScore.pct === 100
                    ? "Correct - 100%"
                    : `Partially Correct - ${pdScore.pct}%`}
                </span>
              </div>

              {/* SECTION 3: Correct Ranking with Cohort Stats */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#030e1a]/80 border border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Correct Ranking
                </h4>

                <div className="space-y-2.5">
                  {pdCase.correctOrder.map((correctId, idx) => {
                    const originalItem = pdCase.items.find((i) => i.id === correctId);

                    return (
                      <div
                        key={correctId}
                        className="p-3 rounded-xl bg-[#041220] border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Blue Circle indicator */}
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#1D82EB] bg-[#1D82EB]/20 text-[#38BDF8] flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">
                            {idx + 1}
                          </div>

                          {/* Letter Badge */}
                          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {correctId}
                          </span>

                          {/* Text */}
                          <span className="text-xs sm:text-sm text-slate-200 font-medium">
                            {originalItem?.text}
                          </span>
                        </div>

                        {/* Percentage Stat */}
                        <div className="shrink-0 text-xs font-mono font-bold text-slate-400 px-2 py-1 rounded bg-white/5">
                          {originalItem?.cohortStat}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white font-semibold">GMC Rationale: </strong>
                  <span>{pdCase.explanation}</span>
                </div>
              </div>

              {/* Bottom Control Bar after submission */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFlagged(!flagged)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      flagged
                        ? "bg-amber-500/20 border-amber-500 text-amber-300"
                        : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${flagged ? "fill-amber-400 text-amber-400" : "text-amber-400"}`} />
                    <span>{flagged ? "Flagged" : "Flag"}</span>
                  </button>

                  <button
                    onClick={() => setReported(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>{reported ? "Reported" : "Report Issue"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={handleResetPd}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all cursor-pointer"
                  >
                    <span>Re-attempt Ranking</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("CPS");
                      setIsPdSubmitted(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF6B00] via-[#ff7a1a] to-[#ff8c3a] shadow-md shadow-[#FF6B00]/30 hover:shadow-[#FF6B00]/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </section>
  );
}
