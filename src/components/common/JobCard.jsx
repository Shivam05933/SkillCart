import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  Building2,
  Bookmark,
  ArrowUpRight,
} from "lucide-react";

export default function JobCard({ job }) {
  const [saved, setSaved] = useState(false);

  // Helper to format currency salary cleanly
  const formatSalary = (min, max, currency) => {
    if (!min && !max) return "Competitive";
    const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : `${currency} `;
    
    if (currency === "INR" && (min >= 100000 || max >= 100000)) {
      const minL = (min / 100000).toFixed(min % 100000 === 0 ? 0 : 1);
      const maxL = (max / 100000).toFixed(max % 100000 === 0 ? 0 : 1);
      return `${symbol}${minL}L - ${symbol}${maxL}L / yr`;
    }
    return `${symbol}${min?.toLocaleString()} - ${symbol}${max?.toLocaleString()} / yr`;
  };

  // Helper to format experience range
  const formatExperience = (min, max) => {
    if (min === 0 && max === 0) return "Freshers / Entry Level";
    if (min === 0 && max === 1) return "0–1 yrs exp";
    return `${min}–${max} yrs exp`;
  };

  // Format date string
  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const isClosingSoon = job.status?.toUpperCase() === "CLOSING SOON";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white border border-[#dfe7e2] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#19714e]/40 transition-colors flex flex-col justify-between group cursor-pointer"
    >
      <div>
        
        {/* Top Header: Company Avatar, Title, Status & Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            {/* Company Logo Badge */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              className="w-11 h-11 rounded-xl bg-[#123c2c] text-[#b9ef84] font-bold text-sm flex items-center justify-center shrink-0 shadow-xs font-['Space_Grotesk'] group-hover:bg-[#19714e] transition-colors"
            >
              {job.company_name ? job.company_name.charAt(0).toUpperCase() : "J"}
            </motion.div>

            <div>
              {/* Job Title */}
              <h3 className="font-bold text-base text-[#12221d] font-['Space_Grotesk'] group-hover:text-[#19714e] transition-colors line-clamp-1">
                {job.job_title}
              </h3>
              
              {/* Company Name */}
              <p className="text-xs font-medium text-[#68756f] flex items-center gap-1.5 mt-0.5">
                <Building2 size={13} className="text-[#19714e]" />
                <span className="text-[#12221d]">{job.company_name}</span>
                {job.department && (
                  <>
                    <span>•</span>
                    <span className="text-[#68756f]">{job.department}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Bookmark Action */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
            className={`p-2 rounded-xl transition-colors shrink-0 ${
              saved
                ? "bg-[#dff8eb] text-[#19714e]"
                : "hover:bg-[#f7faf8] text-[#68756f] hover:text-[#12221d]"
            }`}
            title={saved ? "Saved" : "Save Job"}
          >
            <Bookmark size={17} className={saved ? "fill-[#19714e]" : ""} />
          </motion.button>
        </div>

        {/* Badges Row: Work Mode, Employment Type, Status */}
        <div className="flex flex-wrap items-center gap-1.5 my-3">
          <span className="text-[11px] font-semibold text-[#19714e] bg-[#dff8eb] px-2.5 py-0.5 rounded-lg border border-[#dff8eb]">
            {job.work_mode || "On-site"}
          </span>
          <span className="text-[11px] font-medium text-[#12221d] bg-[#f7faf8] border border-[#dfe7e2] px-2.5 py-0.5 rounded-lg">
            {job.employment_type || "Full-Time"}
          </span>
          {isClosingSoon && (
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
              Closing Soon
            </span>
          )}
          {job.industry && (
            <span className="text-[11px] text-[#68756f] bg-white border border-[#dfe7e2] px-2 py-0.5 rounded-lg truncate max-w-[180px]">
              {job.industry}
            </span>
          )}
        </div>

        {/* Job Details Meta Grid */}
        <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-[#dfe7e2]/60 text-xs text-[#68756f]">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin size={14} className="text-[#19714e] shrink-0" />
            <span className="truncate">{job.location || "Multiple Locations"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Briefcase size={14} className="text-[#19714e] shrink-0" />
            <span>{formatExperience(job.experience_min, job.experience_max)}</span>
          </div>

          <div className="flex items-center gap-1.5 col-span-2 text-[#12221d] font-semibold mt-0.5">
            <IndianRupee size={14} className="text-[#19714e] shrink-0" />
            <span className="font-mono text-xs">
              {formatSalary(job.salary_min, job.salary_max, job.currency)}
            </span>
          </div>
        </div>

      </div>

      {/* Footer Actions: Posted Date & Apply Button */}
      <div className="pt-3 border-t border-[#dfe7e2]/70 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 text-[#68756f] text-[11px] font-mono">
          <Clock size={13} />
          <span>Posted {formatDate(job.posted_date)}</span>
        </div>

        {/* Apply Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Add job details page navigation
          }}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#123c2c] hover:bg-[#19714e] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
        >
          <span>Apply</span>
          <ArrowUpRight size={14} />
        </motion.button>
      </div>

    </motion.article>
  );
}
