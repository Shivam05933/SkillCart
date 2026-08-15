import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, FileText, CheckCircle2, TrendingUp, ArrowRight, Bookmark, Award, Users, Download } from "lucide-react";
import AppHeader from "../../components/common/AppHeader";
import Feed from "../../components/common/Feed";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import resumeService from "../../services/resumeService";

export default function HomePage() {
  const { user } = useAuth();
  const { targetJobTitle, extractedSkills, downloadUrl } = useApp();

  const userSkills = extractedSkills.length > 0
    ? extractedSkills.slice(0, 5)
    : ["React", "TypeScript", "Node.js", "Tailwind CSS"];

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#12221d] font-sans flex flex-col selection:bg-[#dff8eb] selection:text-[#19714e]">
      
      {/* Top Navigation Bar with active HOME tab */}
      <AppHeader />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          
          {/* ── LEFT SIDEBAR: User Career Snapshot ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3 space-y-5"
          >
            
            {/* User Profile Card */}
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white border border-[#dfe7e2] rounded-2xl overflow-hidden shadow-xs"
            >
              {/* Header banner */}
              <div className="h-16 bg-gradient-to-r from-[#123c2c] to-[#19714e] relative" />
              
              <div className="px-5 pb-5 pt-0 relative">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-[#123c2c] text-white border-4 border-white font-bold text-lg flex items-center justify-center -mt-7 shadow-xs">
                  {user?.username ? user.username.substring(0, 2).toUpperCase() : "US"}
                </div>

                <h3 className="font-bold text-base text-[#12221d] font-['Space_Grotesk'] mt-2">
                  {user?.username || "Career Seeker"}
                </h3>
                <p className="text-xs text-[#19714e] font-semibold mt-0.5">
                  {targetJobTitle || "Software Engineer"}
                </p>
                <p className="text-[11px] text-[#68756f] mt-1">
                  {user?.email || "user@skillcart.com"}
                </p>

                {/* Resume Status Snippet */}
                <div className="mt-4 pt-4 border-t border-[#dfe7e2]/70 flex items-center justify-between text-xs">
                  <span className="text-[#68756f]">Resume Status</span>
                  <span className="font-bold text-[#19714e] bg-[#dff8eb] px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </div>

                {/* Skills tags preview */}
                <div className="mt-3 pt-3 border-t border-[#dfe7e2]/70">
                  <span className="text-[11px] font-semibold text-[#68756f] uppercase tracking-wider block mb-2">
                    Top Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {userSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#f7faf8] border border-[#dfe7e2] text-[#12221d] px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links */}
                <div className="mt-4 flex flex-col gap-2">
                  {downloadUrl && (
                    <button
                      type="button"
                      onClick={() => resumeService.downloadResume(downloadUrl)}
                      className="w-full py-2 px-3 rounded-xl bg-[#19714e] hover:bg-[#123c2c] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Download size={14} />
                      <span>Download Resume</span>
                    </button>
                  )}
                  <Link
                    to="/resume"
                    className="w-full py-2 px-3 rounded-xl bg-[#f7faf8] hover:bg-[#dff8eb] text-[#19714e] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#dfe7e2]"
                  >
                    <FileText size={14} />
                    <span>Update Resume</span>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Quick Navigation Shortcuts Widget */}
            <div className="bg-white border border-[#dfe7e2] rounded-2xl p-4 shadow-xs space-y-2 text-xs font-semibold text-[#68756f]">
              <Link
                to="/jobs"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f7faf8] hover:text-[#12221d] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#19714e]" />
                  <span>Matched Jobs</span>
                </div>
                <span className="bg-[#b9ef84] text-[#123c2c] font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                  12 New
                </span>
              </Link>
              <Link
                to="/for-you"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f7faf8] hover:text-[#12221d] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Bookmark size={16} className="text-[#19714e]" />
                  <span>Saved Opportunities</span>
                </div>
                <span className="text-[#68756f] text-[11px]">4</span>
              </Link>
            </div>

          </motion.aside>

          {/* ── CENTER COLUMN: Main Social Feed ── */}
          <section className="lg:col-span-6 space-y-5">
            <Feed />
          </section>

          {/* ── RIGHT SIDEBAR: Career Insights & Trending Topics ── */}
          <aside className="lg:col-span-3 space-y-5">
            
            {/* Trending Career Topics Widget */}
            <div className="bg-white border border-[#dfe7e2] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#12221d] flex items-center gap-1.5 font-['Space_Grotesk']">
                  <TrendingUp size={15} className="text-[#19714e]" />
                  <span>Trending Discussions</span>
                </h4>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-2 rounded-xl hover:bg-[#f7faf8] transition-colors cursor-pointer">
                  <span className="text-[10px] text-[#68756f] block">#React19 • 1,420 posts</span>
                  <span className="font-semibold text-[#12221d] hover:text-[#19714e]">
                    React 19 Server Components adoption in SaaS
                  </span>
                </div>
                <div className="p-2 rounded-xl hover:bg-[#f7faf8] transition-colors cursor-pointer">
                  <span className="text-[10px] text-[#68756f] block">#JobMarket • 890 posts</span>
                  <span className="font-semibold text-[#12221d] hover:text-[#19714e]">
                    Q3 Remote Hiring Trends & Salary Benchmark
                  </span>
                </div>
                <div className="p-2 rounded-xl hover:bg-[#f7faf8] transition-colors cursor-pointer">
                  <span className="text-[10px] text-[#68756f] block">#InterviewPrep • 2,100 posts</span>
                  <span className="font-semibold text-[#12221d] hover:text-[#19714e]">
                    Top System Design Questions at Stripe & Vercel
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Network Connections Widget */}
            <div className="bg-white border border-[#dfe7e2] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#12221d] flex items-center gap-1.5 font-['Space_Grotesk']">
                  <Users size={15} className="text-[#19714e]" />
                  <span>People You May Know</span>
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      JD
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#12221d] block leading-none">John Doe</span>
                      <span className="text-[10px] text-[#68756f]">Tech Lead @ Stripe</span>
                    </div>
                  </div>
                  <button className="px-2.5 py-1 text-[11px] font-semibold text-[#19714e] bg-[#dff8eb] hover:bg-[#b9ef84]/40 rounded-lg transition-colors">
                    Connect
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                      AK
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#12221d] block leading-none">Anna Khan</span>
                      <span className="text-[10px] text-[#68756f]">Staff Engineer @ Vercel</span>
                    </div>
                  </div>
                  <button className="px-2.5 py-1 text-[11px] font-semibold text-[#19714e] bg-[#dff8eb] hover:bg-[#b9ef84]/40 rounded-lg transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Copyright */}
            <div className="text-[11px] text-[#68756f] px-2 space-y-1">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a href="#about" className="hover:underline">About</a>
                <a href="#help" className="hover:underline">Help Center</a>
                <a href="#privacy" className="hover:underline">Privacy & Terms</a>
              </div>
              <p>© 2024 SkillCart, Inc. All rights reserved.</p>
            </div>

          </aside>

        </motion.div>
      </main>

    </div>
  );
}
