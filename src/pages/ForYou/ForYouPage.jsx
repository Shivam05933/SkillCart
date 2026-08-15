import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  BookmarkCheck,
  RotateCcw,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import AppHeader from "../../components/common/AppHeader";
import jobService from "../../services/jobService";
import SwipeCard from "./SwipeCard";
import JobDetailModal from "./JobDetailModal";
import SavedJobs from "./SavedJobs";

/**
 * ForYouPage Component
 * AI Job Matching & Tinder-style Swipe UI Page.
 *
 * TODO: REMOVE STATIC DATA
 * TODO: Fetch For You jobs from backend API
 * TODO: Integrate real API for For You jobs
 * TODO: Persist saved jobs to backend
 * TODO: Improve swipe animation later
 */
export default function ForYouPage() {
  // TODO: Fetch For You jobs from backend API
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --------------------------------------------------------------------------
  // DYNAMIC BACKEND API FETCH STRUCTURE
  // --------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    const fetchMatchedJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Fetch matched jobs based on resume
        // GET /career/match (or future endpoint)
        // TODO: Integrate real API for For You jobs
        const matchedJobs = await jobService.getMatchedJobs();
        if (isMounted) {
          setJobs(matchedJobs);
        }
      } catch (err) {
        console.error("Failed to fetch For You jobs from backend API:", err);
        if (isMounted) {
          setError("Failed to load recommended jobs. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMatchedJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  // --------------------------------------------------------------------------
  // SWIPE ACTION HANDLERS
  // --------------------------------------------------------------------------
  const handleSwipe = (direction) => {
    // TODO: Improve swipe animation later
    if (currentIndex >= jobs.length) return;
    const currentJob = jobs[currentIndex];

    if (direction === "right" && currentJob) {
      // TODO: Persist saved jobs to backend
      setSavedJobs((prev) => {
        const jobId = currentJob.id || currentJob._id || currentJob.title;
        const exists = prev.some((j) => (j.id || j._id || j.title) === jobId);
        if (exists) return prev;
        return [...prev, currentJob];
      });
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleToggleSaveJob = (jobToToggle) => {
    if (!jobToToggle) return;
    const jobId = jobToToggle.id || jobToToggle._id || jobToToggle.title;
    setSavedJobs((prev) => {
      const exists = prev.some((j) => (j.id || j._id || j.title) === jobId);
      if (exists) {
        return prev.filter((j) => (j.id || j._id || j.title) !== jobId);
      } else {
        return [...prev, jobToToggle];
      }
    });
  };

  const handleRemoveSaved = (jobId) => {
    // TODO: Persist saved jobs to backend
    setSavedJobs((prev) => prev.filter((j) => (j.id || j._id || j.title) !== jobId));
  };

  const handleResetStack = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="min-h-screen bg-[#0e1d18] text-[#12221d] font-sans relative overflow-hidden flex flex-col selection:bg-[#dff8eb] selection:text-[#19714e]">
      {/* Background Gradient & Ambient Glass Glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#123c2c] via-[#0b241b] to-[#19714e]/40 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-[#19714e]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-[#b9ef84]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Top Header */}
      <AppHeader />

      {/* ------------------------------------------------------------------ */}
      {/* PAGE MAIN CONTAINER */}
      {/* ------------------------------------------------------------------ */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        
        {/* Top Radar Bar */}
        <div className="flex items-center justify-between gap-4 mb-4 bg-white/10 backdrop-blur-xl border border-white/15 p-4 rounded-3xl text-white shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#b9ef84] text-[#123c2c] flex items-center justify-center font-bold shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold font-['Space_Grotesk'] text-white leading-tight">
                For You • AI Match Radar
              </h1>
              <p className="text-xs text-white/70">
                Job recommendations tailored to your profile
              </p>
            </div>
          </div>

          {/* TOP RIGHT: Saved Jobs Button */}
          <button
            type="button"
            onClick={() => setShowSaved(!showSaved)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md ${
              showSaved
                ? "bg-[#b9ef84] text-[#123c2c]"
                : "bg-white/15 hover:bg-white/25 text-white border border-white/20"
            }`}
          >
            <BookmarkCheck size={16} />
            <span>Saved Jobs ({savedJobs.length})</span>
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* CONDITIONAL VIEW: SAVED JOBS vs SWIPE CARD STACK */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex-1 flex flex-col justify-center items-center">
          {showSaved ? (
            <div className="w-full">
              <SavedJobs
                savedJobs={savedJobs}
                onSelectJob={(job) => setSelectedJob(job)}
                onRemoveSaved={handleRemoveSaved}
                onBackToSwipe={() => setShowSaved(false)}
              />
            </div>
          ) : isLoading ? (
            <div className="py-20 text-center text-white space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto animate-spin">
                <Loader2 size={32} className="text-[#b9ef84]" />
              </div>
            </div>
          ) : error ? (
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-md mx-auto text-center space-y-4 shadow-xl">
              <p className="text-xs text-rose-600 font-semibold">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-xl bg-[#123c2c] text-white text-xs font-bold"
              >
                Retry
              </button>
            </div>
          ) : currentIndex >= jobs.length ? (
            /* ALL CARDS SWIPED SCREEN */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#dff8eb] text-[#19714e] flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#12221d]">
                  You've Seen All Matches!
                </h2>
                <p className="text-xs text-[#68756f] mt-2 leading-relaxed">
                  All available recommendations have been reviewed. Reset the stack to review again or check your saved jobs.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetStack}
                  className="px-5 py-3 rounded-xl bg-white border border-[#dfe7e2] text-xs font-bold text-[#12221d] hover:bg-[#f7faf8] flex items-center gap-2 shadow-2xs"
                >
                  <RotateCcw size={15} />
                  <span>Reset Stack</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSaved(true)}
                  className="px-5 py-3 rounded-xl bg-[#123c2c] text-white text-xs font-bold hover:bg-[#19714e] flex items-center gap-2 shadow-md"
                >
                  <BookmarkCheck size={15} />
                  <span>View Saved Jobs ({savedJobs.length})</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* SWIPE CARD STACK UI */
            <div className="w-full max-w-md flex flex-col items-center">
              
              {/* 6. SWIPE HINT / USER GUIDANCE BANNER */}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 flex items-center justify-center gap-2.5 text-xs font-semibold text-white/90 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 shadow-sm"
              >
                <span className="flex items-center gap-1 text-rose-300 animate-pulse">
                  <ArrowLeft size={13} /> Swipe left to skip
                </span>
                <span className="text-white/30">|</span>
                <span className="flex items-center gap-1 text-[#b9ef84] animate-pulse">
                  Swipe right to save <ArrowRight size={13} />
                </span>
              </motion.div>

              {/* CARD STACK CONTAINER */}
              <div className="relative w-full h-[530px] sm:h-[570px] my-auto">
                <AnimatePresence mode="popLayout">
                  {jobs.slice(currentIndex, currentIndex + 3).map((job, idx) => (
                    <SwipeCard
                      key={job.id || job._id || job.title + idx}
                      job={job}
                      isFront={idx === 0}
                      stackIndex={idx}
                      onSwipe={handleSwipe}
                      onClickCard={(clickedJob) => setSelectedJob(clickedJob)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* 1. FIXED FULL SCREEN JOB DETAIL MODAL */}
      {/* ------------------------------------------------------------------ */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          isSaved={savedJobs.some(
            (j) =>
              (j.id || j._id || j.title) ===
              (selectedJob.id || selectedJob._id || selectedJob.title)
          )}
          onToggleSave={handleToggleSaveJob}
        />
      )}
    </div>
  );
}
