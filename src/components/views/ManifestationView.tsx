import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  Flame,
  CheckCircle2,
  Lock,
  Heart,
  Calendar,
  DollarSign,
  Briefcase,
  PenLine,
  Check
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';

export const ManifestationView: React.FC = () => {
  const { manifestation, updateManifestation, userName } = usePlacement();
  const [isEditing, setIsEditing] = useState(false);
  const [visionText, setVisionText] = useState(manifestation.visionStatement);
  const [whyText, setWhyText] = useState(manifestation.myWhy || manifestation.whyThisMatters || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updateManifestation({
      visionStatement: visionText,
      myWhy: whyText,
      whyThisMatters: whyText
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Calm North Star Header (Section 22) */}
      <div className="p-8 rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5856D6]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5856D6]">
              North Star Covenant
            </span>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-gray-200 dark:border-[#282830] hover:bg-gray-100 dark:hover:bg-[#1D1D22] text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel' : 'Edit Covenant'}</span>
          </button>
        </div>

        <div className="mt-4 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {manifestation.targetPackage}
          </h1>
          <div className="text-sm font-semibold text-[#5856D6] dark:text-[#7A79E0] mt-1">
            {manifestation.targetRole} • {manifestation.targetCompanies || manifestation.targetDream} • Class of {manifestation.targetYear}
          </div>

          {isEditing ? (
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Vision Statement</label>
                <textarea
                  value={visionText}
                  onChange={e => setVisionText(e.target.value)}
                  rows={3}
                  className="w-full mt-1 p-3 text-xs rounded-xl bg-gray-50 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:border-[#5856D6]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Why This Matters</label>
                <textarea
                  value={whyText}
                  onChange={e => setWhyText(e.target.value)}
                  rows={3}
                  className="w-full mt-1 p-3 text-xs rounded-xl bg-gray-50 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:border-[#5856D6]"
                />
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#5856D6] hover:bg-[#4745B8] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Save Vision Updates
              </button>
            </div>
          ) : (
            <blockquote className="mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-l-2 border-[#5856D6] pl-4 italic">
              "{manifestation.visionStatement}"
            </blockquote>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-[#1D1D22] text-gray-700 dark:text-gray-300 font-mono text-[10px] uppercase font-medium">
              Signed by: {userName}
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#34C759]/15 text-[#34C759] font-mono text-[10px] uppercase font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Covenant Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* WHY THIS MATTERS SECTION */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] shadow-sm space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
          Why This Goal Matters
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {whyText || manifestation.myWhy || "Achieving ₹23.3 LPA at Google L3 unlocks financial autonomy, technical mastery, and proves that disciplined daily execution triumphs over passive tutorial watching."}
        </p>
      </div>

      {/* NON-NEGOTIABLES SECTION */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
          Daily Non-Negotiables &amp; Operating Standards
        </h2>

        <div className="space-y-2.5">
          {(manifestation.dailyNonNegotiables || [
            "Never open YouTube tutorials before solving 2 LeetCode problems independently.",
            "Write all code in plain text or simple editors without autocomplete to simulate OA environments.",
            "Complete a minimum of 20 timed aptitude questions every day before dinner.",
            "Log honest post-interview debriefs immediately after every mock or real round.",
            "Zero social media doomscrolling during prime morning cognitive focus hours."
          ]).map((rule, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#1D1D22] border border-gray-100 dark:border-[#282830]"
            >
              <div className="w-5 h-5 rounded-full bg-[#5856D6]/15 text-[#5856D6] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                {rule}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
