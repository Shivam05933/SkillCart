import { motion } from "framer-motion";
import {
  ArrowLeft,
  Trash2,
  MapPin,
  Building2,
  Briefcase,
  DollarSign,
  ChevronRight,
  BookmarkCheck,
  Sparkles,
} from "lucide-react";

/**
 * SavedJobs Component
 * Renders user's saved jobs list with click-to-view detail and remove actions.
 *
 * TODO: REMOVE STATIC DATA
 * TODO: Fetch For You jobs from backend API
 * TODO: Persist saved jobs to backend
 */
export default function SavedJobs({
  savedJobs = [],
  onSelectJob,
  onRemoveSaved,
  onBackToSwipe,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* ------------------------------------------------------------------ */}
      {/* TOP HEADER */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white/90 backdrop-blur-md border border-[#dfe7e2] rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToSwipe}
            className="p-2.5 rounded-xl bg-[#f7faf8] border border-[#dfe7e2] text-[#68756f] hover:text-[#12221d] hover:bg-[#dff8eb] transition-colors"
            title="Back to Swipe Cards"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#12221d] flex items-center gap-2">
              <BookmarkCheck size={22} className="text-[#19714e]" />
              <span>Saved Opportunities</span>
            </h2>
            <p className="text-xs text-[#68756f] mt-0.5">
              Review and manage jobs you saved during swiping.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-[#19714e] bg-[#dff8eb] px-3.5 py-1.5 rounded-full border border-[#19714e]/20">
          {savedJobs.length} {savedJobs.length === 1 ? "Job Saved" : "Jobs Saved"}
        </span>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SAVED JOBS LIST */}
      {/* ------------------------------------------------------------------ */}
      {savedJobs.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-md border border-[#dfe7e2] rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#f7faf8] border border-[#dfe7e2] text-[#68756f] flex items-center justify-center mx-auto">
            <BookmarkCheck size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#12221d]">
              No Saved Jobs Yet
            </h3>
            <p className="text-xs text-[#68756f] mt-1 max-w-sm mx-auto">
              Swipe right on job cards to save them to your personal bookmark list.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToSwipe}
            className="px-6 py-3 rounded-xl bg-[#123c2c] hover:bg-[#19714e] text-white text-xs font-semibold transition-all inline-flex items-center gap-2 shadow-xs"
          >
            <span>Start Swiping Jobs</span>
            <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => {
            const jobTitle = job?.title || job?.job_title || job?.role || "Software Engineer";
            const companyName = job?.company || job?.company_name || job?.employer || "Tech Corp";
            const location = job?.location || job?.city || "Remote / Various";
            const salary = job?.salary || job?.salary_range || job?.compensation || "$120k - $150k";
            const workMode = job?.work_mode || job?.work_type || "Hybrid";

            return (
              <motion.div
                key={job.id || job._id || jobTitle + companyName}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-[#dfe7e2] hover:border-[#19714e] rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group cursor-pointer"
                onClick={() => onSelectJob(job)}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-[#19714e] bg-[#dff8eb] px-2.5 py-0.5 rounded-md border border-[#19714e]/20">
                      {workMode}
                    </span>
                    <span className="text-xs font-semibold text-[#68756f] flex items-center gap-1">
                      <Building2 size={13} className="text-[#19714e]" />
                      {companyName}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#12221d] group-hover:text-[#19714e] transition-colors">
                    {jobTitle}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-[#52615a] flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-[#19714e]" />
                      {location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#19714e]">
                      <DollarSign size={13} />
                      {salary}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSaved(job.id || job._id);
                    }}
                    title="Remove from saved jobs"
                    className="p-2.5 rounded-xl border border-[#dfe7e2] text-rose-500 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectJob(job)}
                    className="px-4 py-2.5 rounded-xl bg-[#123c2c] group-hover:bg-[#19714e] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>View Details</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
