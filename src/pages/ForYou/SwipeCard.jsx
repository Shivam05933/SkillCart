import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  X,
  Bookmark,
  Info,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

/**
 * SwipeCard Component
 * Displays a single Tinder-style job card with drag gestures & action buttons.
 *
 * TODO: REMOVE STATIC DATA
 * TODO: Fetch For You jobs from backend API
 * TODO: Replace with real AI matching logic if needed
 * TODO: Improve swipe animation later
 */
export default function SwipeCard({
  job,
  isFront,
  stackIndex = 0,
  onSwipe,
  onClickCard,
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacityLeft = useTransform(x, [-120, -20], [1, 0]);
  const opacityRight = useTransform(x, [20, 120], [0, 1]);

  const [exitDirection, setExitDirection] = useState(null);

  const handleDragEnd = (_, info) => {
    if (!isFront) return;
    const swipeThreshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      setExitDirection("right");
      onSwipe("right");
    } else if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -velocityThreshold
    ) {
      setExitDirection("left");
      onSwipe("left");
    }
  };

  const handleActionButton = (direction, e) => {
    e.stopPropagation();
    if (!isFront) return;
    setExitDirection(direction);
    onSwipe(direction);
  };

  // Stack offsets for visual depth
  const scale = 1 - stackIndex * 0.04;
  const yOffset = stackIndex * 12;
  const zIndex = 10 - stackIndex;

  const jobTitle = job?.title || job?.job_title || job?.role || "Software Engineer";
  const companyName = job?.company || job?.company_name || job?.employer || "Tech Corp";
  const location = job?.location || job?.city || "Remote / Various";
  const experience = job?.experience || job?.experience_level || job?.exp_required || "2+ yrs exp";
  const workMode = job?.work_mode || job?.work_type || job?.remote_type || "Hybrid";
  const jobType = job?.job_type || job?.type || "Full-time";
  const salary = job?.salary || job?.salary_range || job?.compensation || "$120k - $150k / yr";
  const matchScore = job?.match_score || job?.score || 94;

  return (
    <motion.div
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        zIndex,
      }}
      initial={{ scale: 0.95, y: yOffset + 20, opacity: 0 }}
      animate={{
        scale,
        y: yOffset,
        opacity: stackIndex > 2 ? 0 : 1,
        transition: { duration: 0.3 },
      }}
      exit={{
        x: exitDirection === "right" ? 500 : exitDirection === "left" ? -500 : 0,
        opacity: 0,
        transition: { duration: 0.25 },
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileGrab={{ cursor: "grabbing" }}
      className={`absolute inset-0 w-full h-full rounded-3xl bg-white border border-[#dfe7e2] shadow-2xl shadow-[#123c2c]/15 overflow-hidden flex flex-col justify-between select-none ${
        isFront ? "cursor-grab" : "pointer-events-none"
      }`}
    >
      {/* ------------------------------------------------------------------ */}
      {/* DRAG SWIPE OVERLAY INDICATORS */}
      {/* ------------------------------------------------------------------ */}
      {isFront && (
        <>
          {/* RIGHT SWIPE INDICATOR (SAVE) */}
          <motion.div
            style={{ opacity: opacityRight }}
            className="absolute top-6 left-6 z-20 pointer-events-none border-4 border-emerald-500 rounded-2xl px-4 py-1.5 bg-emerald-500/10 backdrop-blur-xs transform -rotate-12"
          >
            <span className="text-emerald-600 font-extrabold text-xl tracking-wider uppercase flex items-center gap-1.5 font-['Space_Grotesk']">
              <Bookmark size={22} className="fill-emerald-600" /> SAVE
            </span>
          </motion.div>

          {/* LEFT SWIPE INDICATOR (PASS) */}
          <motion.div
            style={{ opacity: opacityLeft }}
            className="absolute top-6 right-6 z-20 pointer-events-none border-4 border-rose-500 rounded-2xl px-4 py-1.5 bg-rose-500/10 backdrop-blur-xs transform rotate-12"
          >
            <span className="text-rose-600 font-extrabold text-xl tracking-wider uppercase flex items-center gap-1.5 font-['Space_Grotesk']">
              <X size={24} strokeWidth={3} /> PASS
            </span>
          </motion.div>
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* CARD BODY CONTENT */}
      {/* ------------------------------------------------------------------ */}
      <div
        onClick={() => isFront && onClickCard(job)}
        className="p-6 sm:p-8 flex-1 flex flex-col justify-between cursor-pointer"
      >
        {/* Top Match Badge & Company Pill */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dff8eb] text-[#19714e] text-xs font-bold border border-[#19714e]/20">
              <Sparkles size={14} />
              <span>{matchScore}% AI Match</span>
            </div>
            <span className="text-[11px] font-semibold text-[#68756f] bg-[#f7faf8] px-2.5 py-1 rounded-lg border border-[#dfe7e2]">
              {workMode}
            </span>
          </div>

          {/* Company & Job Title */}
          <div className="space-y-1.5 mb-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#68756f]">
              <Building2 size={15} className="text-[#19714e]" />
              <span className="truncate">{companyName}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-[#12221d] leading-snug tracking-tight">
              {jobTitle}
            </h2>
          </div>

          {/* Location & Salary Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-[#52615a] bg-[#f7faf8] px-3 py-1.5 rounded-xl border border-[#dfe7e2]">
              <MapPin size={14} className="text-[#19714e]" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#52615a] bg-[#f7faf8] px-3 py-1.5 rounded-xl border border-[#dfe7e2]">
              <Briefcase size={14} className="text-[#19714e]" />
              <span>{jobType}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#19714e] font-bold bg-[#dff8eb]/60 px-3 py-1.5 rounded-xl border border-[#19714e]/20">
              <DollarSign size={14} />
              <span>{salary}</span>
            </div>
          </div>

          {/* Key Job Info Badges */}
          <div className="space-y-3 pt-4 border-t border-[#dfe7e2]/80">
            <div className="flex items-center justify-between text-xs text-[#68756f]">
              <span>Experience Level:</span>
              <span className="font-semibold text-[#12221d]">{experience}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#68756f]">
              <span>Role Focus:</span>
              <span className="font-semibold text-[#12221d] truncate max-w-[180px]">
                {job?.category || job?.department || "Engineering"}
              </span>
            </div>
          </div>
        </div>

        {/* Click to view detail callout */}
        <div className="pt-4 flex items-center justify-between text-xs font-semibold text-[#19714e] border-t border-[#dfe7e2]/60 hover:underline">
          <span>Click card for full details</span>
          <ChevronRight size={16} />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* FRONT CARD SWIPE ACTION BUTTONS */}
      {/* ------------------------------------------------------------------ */}
      {isFront && (
        <div className="p-4 sm:p-5 bg-[#f7faf8] border-t border-[#dfe7e2] flex items-center justify-around gap-4 z-20">
          {/* REJECT BUTTON (LEFT SWIPE) */}
          <button
            type="button"
            onClick={(e) => handleActionButton("left", e)}
            title="Reject Job (Swipe Left)"
            className="w-13 h-13 rounded-2xl bg-white border-2 border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-sm"
          >
            <X size={24} strokeWidth={2.5} />
          </button>

          {/* DETAIL BUTTON */}
          <button
            type="button"
            onClick={() => onClickCard(job)}
            title="View Full Details"
            className="w-11 h-11 rounded-xl bg-white border border-[#dfe7e2] text-[#68756f] hover:text-[#12221d] hover:border-[#19714e] hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            <Info size={20} />
          </button>

          {/* SAVE BUTTON (RIGHT SWIPE) */}
          <button
            type="button"
            onClick={(e) => handleActionButton("right", e)}
            title="Save Job (Swipe Right)"
            className="w-13 h-13 rounded-2xl bg-[#123c2c] text-[#b9ef84] hover:bg-[#19714e] hover:text-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-md shadow-[#123c2c]/15"
          >
            <Bookmark size={22} className="fill-current" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
