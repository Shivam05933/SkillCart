import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Layers,
  Loader2,
} from "lucide-react";
import jobService from "../../services/jobService";

/**
 * Full Screen Job Detail Modal (FIXED CONTAINER LAYOUT)
 * Fetches full job details from endpoint:
 * GET https://skillcartcampany-production.up.railway.app/jobs/:id
 */
export default function JobDetailModal({
  job,
  onClose,
  isSaved,
  onToggleSave,
}) {
  const [fetchedJob, setFetchedJob] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const jobId = job?.id || job?._id || job?.job_id || 1;

  // --------------------------------------------------------------------------
  // FETCH FULL DETAILS FROM LIVE API (https://skillcartcampany-production.up.railway.app/jobs/:id)
  // --------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    if (!jobId) return;

    const fetchFullDetails = async () => {
      setIsLoadingDetails(true);
      setFetchError(null);
      try {
        // Fetch full job details from https://skillcartcampany-production.up.railway.app/jobs/:id
        const detailData = await jobService.getJobById(jobId);
        if (isMounted && detailData) {
          setFetchedJob(detailData);
        }
      } catch (err) {
        console.warn(`Could not fetch full details for job ID ${jobId}:`, err);
        if (isMounted) {
          setFetchError("Displaying preview details.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingDetails(false);
        }
      }
    };

    fetchFullDetails();
    return () => {
      isMounted = false;
    };
  }, [jobId]);

  if (!job && !fetchedJob) return null;

  // Active combined payload prioritizing freshly fetched details
  const activeJob = fetchedJob || job || {};

  // Dynamic field normalization
  const jobTitle = activeJob?.job_title || activeJob?.title || activeJob?.role || "Software Engineer";
  const companyName = activeJob?.company_name || activeJob?.company || activeJob?.employer || "Tech Corp";
  const location = activeJob?.location || activeJob?.city || "Remote / Various";
  
  // Format Experience Range
  let experience = "2-5 yrs";
  if (activeJob?.experience_min !== undefined && activeJob?.experience_max !== undefined) {
    experience = `${activeJob.experience_min}–${activeJob.experience_max} yrs`;
  } else if (activeJob?.experience || activeJob?.experience_level) {
    experience = activeJob.experience || activeJob.experience_level;
  }

  const workMode = activeJob?.work_mode || activeJob?.work_type || activeJob?.remote_type || "Hybrid";
  const jobType = activeJob?.employment_type || activeJob?.job_type || activeJob?.type || "Full-time";
  
  // Format Salary
  let salary = "Competitive Salary";
  if (activeJob?.salary_min || activeJob?.salary_max) {
    const symbol = activeJob.currency === "INR" ? "₹" : "$";
    salary = `${symbol}${activeJob.salary_min?.toLocaleString() || "N/A"} - ${symbol}${activeJob.salary_max?.toLocaleString() || "N/A"} / yr`;
  } else if (activeJob?.salary || activeJob?.salary_range || activeJob?.compensation) {
    salary = activeJob.salary || activeJob.salary_range || activeJob.compensation;
  }

  const industry = activeJob?.industry || activeJob?.department || activeJob?.category || "Engineering & Tech";
  const postedDate = activeJob?.posted_date || activeJob?.postedDate || activeJob?.created_at || "Recently posted";
  const description =
    activeJob?.description ||
    activeJob?.details ||
    "Join our high-impact engineering team to build scalable software solutions, collaborate with cross-functional partners, and solve complex product challenges.";

  const rawSkills = activeJob?.skills || activeJob?.required_skills || activeJob?.technologies || [];
  const skills = Array.isArray(rawSkills)
    ? rawSkills
    : typeof rawSkills === "string"
    ? rawSkills.split(",").map((s) => s.trim())
    : ["React", "TypeScript", "Node.js", "System Architecture"];

  const handleApply = () => {
    // TODO: Integrate apply API later
    alert(`Application submitted for ${jobTitle} at ${companyName}!`);
  };

  return (
    <AnimatePresence>
      {/* ------------------------------------------------------------------ */}
      {/* FULL SCREEN OVERLAY CONTAINER */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#0e1d18]/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden font-sans"
      >
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-4xl h-full sm:h-[90vh] bg-[#f7faf8] text-[#12221d] rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border border-[#dfe7e2]"
        >
          {/* ------------------------------------------------------------------ */}
          {/* 1. FIXED TOP NAVIGATION HEADER */}
          {/* ------------------------------------------------------------------ */}
          <header className="shrink-0 bg-[#f7faf8]/95 backdrop-blur-md border-b border-[#dfe7e2] px-6 h-16 sm:h-18 flex items-center justify-between z-20">
            {/* TOP LEFT: Back Arrow Button */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#dfe7e2] text-xs font-semibold text-[#12221d] hover:bg-[#dff8eb] hover:text-[#19714e] transition-colors shadow-2xs group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Cards</span>
            </button>

            {/* FETCHING BADGE OR SAVE BUTTON */}
            <div className="flex items-center gap-3">
              {isLoadingDetails && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#19714e]/10 text-[#19714e] text-xs font-medium animate-pulse">
                  <Loader2 size={13} className="animate-spin" />
                  <span>Fetching full details...</span>
                </div>
              )}

              {/* TOP RIGHT: Save / Bookmark Button */}
              <button
                type="button"
                onClick={() => onToggleSave(activeJob)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSaved
                    ? "bg-[#19714e] text-white border-[#19714e] shadow-xs"
                    : "bg-white text-[#52615a] border-[#dfe7e2] hover:text-[#12221d]"
                }`}
              >
                <Bookmark size={15} className={isSaved ? "fill-white" : ""} />
                <span>{isSaved ? "Saved" : "Save Job"}</span>
              </button>
            </div>
          </header>

          {/* ------------------------------------------------------------------ */}
          {/* 2. SCROLLABLE JOB DETAILS BODY */}
          {/* ------------------------------------------------------------------ */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
            
            {/* Main Header & Title Card */}
            <div className="bg-white border border-[#dfe7e2] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#19714e] bg-[#dff8eb] px-3.5 py-1.5 rounded-full border border-[#19714e]/20">
                  <Sparkles size={14} /> AI Matched Recommendation
                </div>
                <span className="text-[11px] font-mono text-[#68756f] bg-[#f7faf8] px-2.5 py-1 rounded-lg border border-[#dfe7e2]">
                  Job ID: {jobId}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-[#12221d] tracking-tight leading-tight">
                  {jobTitle}
                </h1>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#68756f] mt-2 flex-wrap">
                  <Building2 size={16} className="text-[#19714e]" />
                  <span>{companyName}</span>
                  <span>•</span>
                  <MapPin size={16} className="text-[#19714e]" />
                  <span>{location}</span>
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#dfe7e2]/80">
                <div className="p-3 rounded-2xl bg-[#f7faf8] border border-[#dfe7e2]">
                  <span className="text-[11px] font-medium text-[#68756f] block">Job Type</span>
                  <span className="text-xs font-bold text-[#12221d] mt-1 block truncate">{jobType}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#f7faf8] border border-[#dfe7e2]">
                  <span className="text-[11px] font-medium text-[#68756f] block">Work Mode</span>
                  <span className="text-xs font-bold text-[#12221d] mt-1 block truncate">{workMode}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#f7faf8] border border-[#dfe7e2]">
                  <span className="text-[11px] font-medium text-[#68756f] block">Experience</span>
                  <span className="text-xs font-bold text-[#12221d] mt-1 block truncate">{experience}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#f7faf8] border border-[#dfe7e2]">
                  <span className="text-[11px] font-medium text-[#68756f] block">Salary</span>
                  <span className="text-xs font-bold text-[#19714e] mt-1 block truncate">{salary}</span>
                </div>
              </div>
            </div>

            {/* Overview & Metadata */}
            <div className="bg-white border border-[#dfe7e2] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-[#12221d] border-b border-[#dfe7e2] pb-3">
                Overview Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#f7faf8] border border-[#dfe7e2]">
                  <Layers size={18} className="text-[#19714e]" />
                  <div>
                    <span className="text-[#68756f] block">Category / Industry</span>
                    <span className="font-bold text-[#12221d]">{industry}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#f7faf8] border border-[#dfe7e2]">
                  <Calendar size={18} className="text-[#19714e]" />
                  <div>
                    <span className="text-[#68756f] block">Date Posted</span>
                    <span className="font-bold text-[#12221d]">{postedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Role Description */}
            <div className="bg-white border border-[#dfe7e2] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-[#12221d]">
                Full Role Description
              </h3>
              <p className="text-xs sm:text-sm text-[#52615a] leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Required Skills Chips */}
            {skills.length > 0 && (
              <div className="bg-white border border-[#dfe7e2] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-[#12221d]">
                  Required Skills & Qualifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#dff8eb] text-[#19714e] text-xs font-semibold border border-[#19714e]/20"
                    >
                      <CheckCircle2 size={13} />
                      <span>{sk}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 3. STICKY BOTTOM APPLY BAR */}
          {/* ------------------------------------------------------------------ */}
          <footer className="shrink-0 bg-white border-t border-[#dfe7e2] p-4 sm:p-5 flex items-center justify-between shadow-lg z-20">
            <div className="hidden sm:block">
              <span className="text-[11px] font-medium text-[#68756f] block">Compensation Range</span>
              <span className="text-sm font-bold text-[#19714e]">{salary}</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl border border-[#dfe7e2] text-xs font-semibold text-[#68756f] hover:text-[#12221d]"
              >
                Close
              </button>

              {/* STICKY APPLY BUTTON */}
              {/* TODO: Integrate apply API later */}
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 sm:flex-initial px-8 py-3 rounded-xl bg-[#123c2c] hover:bg-[#19714e] text-white text-xs font-bold shadow-md shadow-[#123c2c]/15 transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Apply Now</span>
                <ExternalLink size={15} />
              </button>
            </div>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
