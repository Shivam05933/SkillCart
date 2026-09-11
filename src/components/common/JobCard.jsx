import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  Building2,
  Bookmark,
  ArrowUpRight,
  Sparkles,
  Zap,
  BrainCircuit,
  Globe,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

import EvaluateFitButton from "./EvaluateFitButton";
import JobEvaluationModal from "./JobEvaluationModal";
import PrepareCategoryModal from "./PrepareCategoryModal";

/**
 * Helper to generate deterministic gradient background based on company name
 */
function getCompanyGradient(name = "J") {
  const charCode = (name && typeof name === "string" ? name.charCodeAt(0) : 74) || 74;
  const gradients = [
    "from-[#123c2c] to-[#19714e] text-[#b9ef84]",
    "from-indigo-900 to-purple-800 text-purple-200",
    "from-emerald-900 to-teal-700 text-teal-200",
    "from-cyan-900 to-blue-800 text-cyan-200",
    "from-slate-900 to-emerald-900 text-emerald-300",
  ];
  return gradients[charCode % gradients.length];
}

/**
 * Helper to style work mode badge with distinct color combinations
 */
function getWorkModeBadge(mode = "On-site") {
  if (!mode || typeof mode !== "string") return "bg-gray-50 text-gray-700 border-gray-200";
  const modeLower = mode.toLowerCase();
  if (modeLower.includes("remote")) {
    return "bg-teal-50 text-teal-700 border-teal-200/80";
  }
  if (modeLower.includes("hybrid")) {
    return "bg-indigo-50 text-indigo-700 border-indigo-200/80";
  }
  return "bg-amber-50 text-amber-700 border-amber-200/80";
}

export default function JobCard({
  job,
  resId,
  onClick,
  isSaved,
  onToggleSave,
  saving = false,
}) {
  const navigate = useNavigate();
  const saved = isSaved ?? false;
  const [logoFailed, setLogoFailed] = useState(false);

  // Fallbacks & normalized fields from API response
  const jobTitle =
    job?.job_title ||
    job?.title ||
    job?.project_role ||
    "Position Opportunity";

  const companyName =
    job?.company_name ||
    job?.company?.company_name ||
    job?.company?.name ||
    job?.company ||
    "Company";

  const department = job?.department || null;
  const workMode = job?.work_mode || null;
  const employmentType = job?.employment_type || null;
  const location = job?.location || "Location Not Specified";
  const source = job?.source || null;
  const status = job?.status || null;
  const isClosingSoon = status?.toUpperCase() === "CLOSING SOON";
  const isActive = status?.toLowerCase() === "active";

  const logoUrl = job?.logo_url || job?.company?.logo_url || null;
  const websiteUrl = job?.company_website || job?.website || null;
  const linkedinUrl = job?.linkedin_url || null;

  // Helper to format currency salary cleanly
  const formatSalary = (min, max, currency) => {
    if (min === null && max === null) return null;
    const curr = currency || "INR";
    const symbol =
      curr === "INR" ? "₹" : curr === "USD" ? "$" : curr === "EUR" ? "€" : `${curr} `;

    if (min !== null && max !== null) {
      if (curr === "INR" && (min >= 100000 || max >= 100000)) {
        const minL = (min / 100000).toFixed(min % 100000 === 0 ? 0 : 1);
        const maxL = (max / 100000).toFixed(max % 100000 === 0 ? 0 : 1);
        return `${symbol}${minL}L - ${symbol}${maxL}L / yr`;
      }
      return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()} / yr`;
    }

    if (min !== null) {
      if (curr === "INR" && min >= 100000) {
        const minL = (min / 100000).toFixed(min % 100000 === 0 ? 0 : 1);
        return `From ${symbol}${minL}L / yr`;
      }
      return `From ${symbol}${min.toLocaleString()} / yr`;
    }

    if (max !== null) {
      if (curr === "INR" && max >= 100000) {
        const maxL = (max / 100000).toFixed(max % 100000 === 0 ? 0 : 1);
        return `Up to ${symbol}${maxL}L / yr`;
      }
      return `Up to ${symbol}${max.toLocaleString()} / yr`;
    }

    return null;
  };

  // Helper to format experience range
  const formatExperience = (min, max) => {
    if (min === null && max === null) return "Exp: Not Specified";
    if (min === 0 && max === 0) return "Freshers / Entry Level";
    if (min !== null && max !== null) {
      if (min === max) return `${min} yrs exp`;
      return `${min}–${max} yrs exp`;
    }
    if (min !== null) return `${min}+ yrs exp`;
    if (max !== null) return `Up to ${max} yrs exp`;
    return "Exp: Not Specified";
  };

  // Format date string
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  const formattedPostedDate = formatDate(job?.posted_date);
  const formattedSalary = formatSalary(job?.salary_min, job?.salary_max, job?.currency);
  const formattedExperience = formatExperience(job?.experience_min, job?.experience_max);
  const avatarGradient = getCompanyGradient(companyName);
  const workModeStyle = getWorkModeBadge(workMode);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    if (onToggleSave && !saving) {
      onToggleSave(job);
    }
  };

  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState(null);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleSelectCategory = (category) => {
    setIsCategoryModalOpen(false);
    const jobId = job?.id ?? job?.job_id ?? job?._id;
    if (jobId) {
      navigate(`/interview/prepare/${jobId}?category=${encodeURIComponent(category)}`, {
        state: { job, resId, category },
      });
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          y: -4,
          scale: 1.008,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
        onClick={onClick}
        className="bg-white border border-[#dfe7e2] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:shadow-[#19714e]/10 hover:border-[#19714e]/50 transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden"
      >
        {/* Top Accent Gradient Border Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#123c2c] via-[#19714e] to-[#b9ef84] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div>
          {/* Top Header: Company Logo/Avatar, Title, Company Info & Bookmark */}
          <div className="flex items-start justify-between gap-2.5 mb-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Company Logo / Avatar */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-[#dfe7e2] shadow-2xs flex items-center justify-center shrink-0 overflow-hidden relative"
              >
                {logoUrl && !logoFailed ? (
                  <img
                    src={logoUrl}
                    alt={companyName}
                    onError={() => setLogoFailed(true)}
                    loading="lazy"
                    className="w-full h-full object-contain p-1 rounded-xl sm:rounded-2xl"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${avatarGradient} font-bold text-sm sm:text-base flex items-center justify-center font-['Space_Grotesk']`}
                  >
                    {companyName.charAt(0).toUpperCase()}
                  </div>
                )}
              </motion.div>

              <div className="flex-1 min-w-0">
                {/* Job Title */}
                <h3 className="font-bold text-sm sm:text-base lg:text-lg text-[#12221d] font-['Space_Grotesk'] group-hover:text-[#19714e] transition-colors line-clamp-1 leading-snug">
                  {jobTitle}
                </h3>

                {/* Company Name, Dept & Links */}
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] sm:text-xs font-medium text-[#68756f] flex-wrap">
                  <div className="flex items-center gap-1 min-w-0">
                    <Building2 size={13} className="text-[#19714e] shrink-0" />
                    <span className="text-[#12221d] font-semibold truncate max-w-[140px] sm:max-w-[180px]">
                      {companyName}
                    </span>
                  </div>

                  {department && (
                    <>
                      <span className="text-[#68756f]/50">•</span>
                      <span className="text-[#68756f] truncate max-w-[110px] sm:max-w-[140px]">
                        {department}
                      </span>
                    </>
                  )}

                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#68756f] hover:text-[#19714e] transition-colors p-0.5 rounded"
                      title="Company Website"
                    >
                      <Globe size={12} />
                    </a>
                  )}

                  {linkedinUrl && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#68756f] hover:text-[#0a66c2] transition-colors p-0.5 rounded"
                      title="Company LinkedIn"
                    >
                      <FaLinkedin size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Bookmark Action */}
            <motion.button
              whileHover={{ scale: saving ? 1 : 1.15 }}
              whileTap={{ scale: saving ? 1 : 0.85 }}
              onClick={handleBookmarkClick}
              disabled={saving}
              className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all duration-200 shrink-0 border ${
                saved
                  ? "bg-[#dff8eb] text-[#19714e] border-[#19714e]/30 shadow-xs"
                  : "bg-[#f7faf8] text-[#68756f] border-[#dfe7e2] hover:text-[#12221d] hover:bg-white"
              }`}
              title={saving ? "Saving..." : saved ? "Saved" : "Save Job"}
            >
              <Bookmark size={15} className={saved ? "fill-[#19714e]" : ""} />
            </motion.button>
          </div>

          {/* Badges Row: Work Mode, Employment Type, Status, Source, Posted Date */}
          <div className="flex flex-wrap items-center gap-1.5 my-2.5">
            {workMode && (
              <span
                className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-xl border ${workModeStyle}`}
              >
                {workMode}
              </span>
            )}

            {employmentType && (
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#12221d] bg-[#f7faf8] border border-[#dfe7e2] px-2.5 py-0.5 rounded-xl">
                {employmentType}
              </span>
            )}

            {isClosingSoon && (
              <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-xl animate-pulse">
                🔥 Closing Soon
              </span>
            )}

            {!isClosingSoon && isActive && (
              <span className="text-[10px] sm:text-[11px] font-bold text-[#19714e] bg-[#dff8eb] border border-[#19714e]/20 px-2.5 py-0.5 rounded-xl flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19714e] animate-pulse" />
                <span>Active</span>
              </span>
            )}

            

            {formattedPostedDate && (
              <span className="text-[10px] sm:text-[11px] font-medium text-[#68756f] bg-white border border-[#dfe7e2] px-2 py-0.5 rounded-xl flex items-center gap-1 shrink-0 ml-auto sm:ml-0">
                <Clock size={11} className="text-[#19714e]" />
                <span>{formattedPostedDate}</span>
              </span>
            )}
          </div>

          {/* Job Details Meta Grid: Location, Experience, Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 my-3 pt-2.5 border-t border-[#dfe7e2]/70 text-xs text-[#68756f]">
            <div className="flex items-center gap-2 truncate p-2 rounded-xl bg-[#f7faf8]/70 border border-[#dfe7e2]/60">
              <MapPin size={13} className="text-[#19714e] shrink-0" />
              <span className="truncate font-medium text-[#12221d]">{location}</span>
            </div>

            <div className="flex items-center gap-2 truncate p-2 rounded-xl bg-[#f7faf8]/70 border border-[#dfe7e2]/60">
              <Briefcase size={13} className="text-[#19714e] shrink-0" />
              <span className="truncate font-medium text-[#12221d]">{formattedExperience}</span>
            </div>

            <div className="flex items-center gap-2 col-span-1 sm:col-span-2 p-2 rounded-xl bg-[#dff8eb]/40 border border-[#19714e]/20 text-xs">
              <IndianRupee size={14} className="shrink-0 text-[#19714e]" />
              <span className="font-semibold text-[#123c2c] truncate">
                {formattedSalary || "Salary: Competitive / Disclosed on Apply"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row: Evaluate Fit | Prepare | Apply */}
        <div className="flex items-center justify-between w-full gap-1.5 sm:gap-2 pt-1.5">
          {/* 1. EVALUATE FIT */}
          <EvaluateFitButton
            job={job}
            resId={resId}
            className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 sm:gap-1.5 h-10 px-2 sm:px-3 rounded-xl bg-[#dff8eb] hover:bg-[#c9f2df] text-[#123c2c] text-[11px] sm:text-xs font-bold border border-[#19714e]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-2xs truncate"
            onStartEvaluate={() => {
              setIsEvaluationModalOpen(true);
              setIsEvaluating(true);
              setEvaluationError(null);
              setEvaluationResult(null);
            }}
            onResult={(result) => {
              setEvaluationResult(result);
              setIsEvaluating(false);
            }}
            onError={(err) => {
              setEvaluationError(err?.message || "Evaluation failed.");
              setIsEvaluating(false);
            }}
          />

          {/* 2. PREPARE (Interview Preparation) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              const jobId = job?.id ?? job?.job_id ?? job?._id;
              if (jobId) {
                setIsCategoryModalOpen(true);
              } else {
                alert("Job ID not available for interview preparation.");
              }
            }}
            className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 sm:gap-1.5 h-10 px-2 sm:px-3 rounded-xl bg-[#f7faf8] hover:bg-[#eaf5ef] text-[#123c2c] hover:text-[#19714e] text-[11px] sm:text-xs font-bold border border-[#dfe7e2] hover:border-[#19714e]/40 transition-all shadow-2xs hover:shadow-xs cursor-pointer truncate"
            title="Prepare for this Interview with AI"
          >
            <BrainCircuit size={14} className="text-[#19714e] shrink-0" />
            <span className="truncate">Prepare</span>
          </motion.button>

          {/* 3. APPLY */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              const applyUrl =
                job?.apply_url ||
                job?.job_url ||
                job?.url ||
                job?.link ||
                job?.source_url;

              if (applyUrl) {
                window.open(applyUrl, "_blank", "noopener,noreferrer");
              } else if (onClick) {
                onClick();
              } else {
                alert(`No direct application link available for ${job?.job_title || "this position"}.`);
              }
            }}
            className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 sm:gap-1.5 h-10 px-2 sm:px-3 rounded-xl bg-[#123c2c] hover:bg-[#19714e] text-white text-[11px] sm:text-xs font-bold transition-all shadow-md shadow-[#123c2c]/15 cursor-pointer truncate"
          >
            <span className="truncate">Apply</span>
            <ArrowUpRight size={13} className="shrink-0 text-[#b9ef84]" />
          </motion.button>
        </div>
      </motion.article>

      {/* EVALUATION MODAL */}
      {isEvaluationModalOpen && (
        <JobEvaluationModal
          isLoading={isEvaluating}
          result={evaluationResult}
          error={evaluationError}
          job={job}
          onClose={() => {
            setIsEvaluationModalOpen(false);
            setIsEvaluating(false);
            setEvaluationResult(null);
            setEvaluationError(null);
          }}
        />
      )}

      {/* PREPARE CATEGORY SELECTION MODAL */}
      <PrepareCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        job={job}
        onSelectCategory={handleSelectCategory}
      />
    </>
  );
}


