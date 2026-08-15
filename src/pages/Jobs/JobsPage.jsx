import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  AlertCircle,
  Briefcase,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import AppHeader from "../../components/common/AppHeader";
import JobCard from "../../components/common/JobCard";
import Pagination from "../../components/common/Pagination";
import jobService from "../../services/jobService";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const LIMIT = 20;
  const [offset, setOffset] = useState(0);

  // Filter States (UI placeholders for future backend filtering)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkMode, setSelectedWorkMode] = useState("All");

  /**
   * Fetch live jobs from API whenever offset changes.
   * // TODO: API CALL — GET /jobs?limit=20&offset=0
   * // TODO: Replace static fetch with centralized API service later
   */
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: API CALL GET /jobs?limit=20&offset=0
      const res = await jobService.getJobs({ limit: LIMIT, offset });
      setJobs(res.items || []);
      setTotalJobsCount(res.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load jobs from server. Please try again.");
      setJobs([]);
      setTotalJobsCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [offset]);

  const handlePageChange = (newOffset) => {
    setOffset(newOffset);
  };

  // Filter jobs locally if search term or work mode selected (UI only placeholder)
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm.trim() ||
      job.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWorkMode =
      selectedWorkMode === "All" ||
      job.work_mode?.toLowerCase().includes(selectedWorkMode.toLowerCase());

    return matchesSearch && matchesWorkMode;
  });

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#12221d] font-sans flex flex-col selection:bg-[#dff8eb] selection:text-[#19714e]">
      
      {/* Top Navigation Bar with active JOBS tab */}
      <AppHeader />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Title & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dff8eb] text-[#19714e] text-xs font-semibold mb-2">
              <Briefcase size={14} /> Live Opportunities
            </div>
            <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-[#12221d] tracking-tight">
              Explore Jobs
            </h1>
            <p className="text-xs sm:text-sm text-[#68756f] mt-1">
              Browse verified technical and engineering roles matching your profile.
            </p>
          </div>

          <button
            onClick={fetchJobs}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#dfe7e2] text-[#12221d] hover:bg-[#f7faf8] text-xs font-semibold rounded-xl transition-all shadow-xs"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#19714e]" : ""} />
            <span>Refresh Listings</span>
          </button>
        </div>

        {/* ── SEARCH & FILTERS BAR ── */}
        {/* TODO: Add filters (future) — connect search inputs to backend query parameters */}
        <div className="bg-white border border-[#dfe7e2] rounded-2xl p-4 mb-8 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative flex items-center">
              <Search size={18} className="absolute left-3.5 text-[#68756f] pointer-events-none" />
              <input
                type="text"
                placeholder="Search job title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 text-xs sm:text-sm bg-[#f7faf8] border border-[#dfe7e2] rounded-xl text-[#12221d] placeholder-[#68756f]/60 outline-none focus:border-[#19714e] focus:bg-white transition-all"
              />
            </div>

            {/* Work Mode Filter Pill Group */}
            <div className="md:col-span-6 flex items-center justify-start md:justify-end gap-1.5 overflow-x-auto py-1">
              <span className="text-xs font-semibold text-[#68756f] mr-1 flex items-center gap-1">
                <SlidersHorizontal size={14} className="text-[#19714e]" />
                <span className="hidden sm:inline">Mode:</span>
              </span>
              {["All", "Remote", "Hybrid", "On-site"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedWorkMode(mode)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 shrink-0 ${
                    selectedWorkMode === mode
                      ? "bg-[#123c2c] text-white shadow-xs"
                      : "bg-[#f7faf8] border border-[#dfe7e2] text-[#68756f] hover:text-[#12221d]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 size={36} className="text-[#19714e] animate-spin mb-3" />
            <h3 className="font-bold text-base text-[#12221d] font-['Space_Grotesk']">
              Fetching live job opportunities...
            </h3>
            <p className="text-xs text-[#68756f] mt-1">Connecting to Railway API endpoint</p>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {!loading && error && (
          <div className="my-8 p-6 rounded-2xl bg-red-50 border border-red-200 text-center max-w-xl mx-auto flex flex-col items-center">
            <AlertCircle size={32} className="text-red-500 mb-2" />
            <h3 className="font-bold text-sm text-red-900">Failed to load jobs</h3>
            <p className="text-xs text-red-700 mt-1 mb-4">{error}</p>
            <button
              onClick={fetchJobs}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="py-16 px-4 bg-white border border-[#dfe7e2] rounded-2xl text-center max-w-md mx-auto my-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#dff8eb] text-[#19714e] flex items-center justify-center mx-auto mb-3">
              <Briefcase size={24} />
            </div>
            <h3 className="font-bold text-base text-[#12221d] font-['Space_Grotesk']">
              No jobs available
            </h3>
            <p className="text-xs text-[#68756f] mt-1 mb-4">
              {jobs.length > 0
                ? "No jobs match your selected filter criteria. Try clearing search filters."
                : "There are currently no listings on this page. Try navigating back or refreshing."}
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedWorkMode("All");
                setOffset(0);
              }}
              className="px-4 py-2 bg-[#123c2c] text-white text-xs font-semibold rounded-xl hover:bg-[#19714e] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ── JOBS GRID ── */}
        {!loading && !error && filteredJobs.length > 0 && (
          <div className="space-y-6">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.06 },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {/* TODO: Integrate with backend pagination properly */}
            <Pagination
              offset={offset}
              limit={LIMIT}
              currentCount={jobs.length}
              onPageChange={handlePageChange}
            />
          </div>
        )}

      </main>

    </div>
  );
}
