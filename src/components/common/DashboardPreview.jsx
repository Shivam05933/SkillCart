import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  FileCheck2,
  Gauge,
  MessageSquareText,
  Target,
  Zap,
} from "lucide-react";
import { fadeUp } from "../../utils/animations";

export default function DashboardPreview() {
  return (
    <motion.div variants={fadeUp} className="dashboard-wrap">
      <div className="dashboard-shadow" />
      <div className="dashboard-card">
        <div className="dashboard-topbar">
          <div className="window-dots">
            <i />
            <i />
            <i />
          </div>
          <div className="preview-url">app.skillcart.ai / overview</div>
          <Bell size={15} />
        </div>
        <div className="dashboard-content">
          <aside className="preview-sidebar">
            <div className="mini-brand">
              <span className="logo-mark">
                <span />
              </span>
            </div>
            <div className="side-nav active">
              <BarChart3 size={15} /> Overview
            </div>
            <div className="side-nav">
              <FileCheck2 size={15} /> Resume
            </div>
            <div className="side-nav">
              <BriefcaseBusiness size={15} /> Jobs
            </div>
            <div className="side-nav">
              <MessageSquareText size={15} /> Practice
            </div>
            <div className="sidebar-bottom">
              <div className="avatar">AM</div>
              <span>Alex Morgan</span>
            </div>
          </aside>
          <main className="preview-main">
            <div className="preview-header">
              <div>
                <div className="preview-kicker">MONDAY, OCTOBER 21</div>
                <h4>
                  Good morning, Alex <span>✦</span>
                </h4>
              </div>
              <div className="preview-status">
                <span /> Profile strength: 78%
              </div>
            </div>
            <div className="stat-row">
              <div className="stat-box stat-featured">
                <div className="stat-label">Resume score</div>
                <div className="score-number">
                  82<span>/100</span>
                </div>
                <div className="progress">
                  <span />
                </div>
                <div className="stat-foot">
                  <span>↑ 14 points this week</span>
                  <Gauge size={15} />
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Job matches</div>
                <div className="stat-value">24</div>
                <div className="stat-foot">
                  <span className="muted">8 new this week</span>
                  <Target size={15} />
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Practice streak</div>
                <div className="stat-value">
                  06 <small>days</small>
                </div>
                <div className="stat-foot">
                  <span className="muted">Keep it going</span>
                  <Zap size={15} />
                </div>
              </div>
            </div>
            <div className="preview-grid">
              <div className="chart-box">
                <div className="box-title">
                  Application activity{" "}
                  <span>
                    Last 30 days <ChevronDown size={12} />
                  </span>
                </div>
                <div className="chart">
                  <div className="chart-y">
                    <span>12</span>
                    <span>8</span>
                    <span>4</span>
                    <span>0</span>
                  </div>
                  <div className="chart-lines">
                    <i />
                    <i />
                    <i />
                    <i />
                    <svg viewBox="0 0 320 100" preserveAspectRatio="none">
                      <path
                        d="M0,86 C25,80 33,72 52,76 S85,64 103,68 S126,32 148,47 S178,62 196,44 S223,51 240,30 S269,24 288,35 S305,10 320,14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                    </svg>
                    <div className="chart-labels">
                      <span>Sep 22</span>
                      <span>Sep 29</span>
                      <span>Oct 06</span>
                      <span>Oct 13</span>
                      <span>Oct 21</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="jobs-box">
                <div className="box-title">
                  Top matches{" "}
                  <span>
                    View all <ArrowRight size={12} />
                  </span>
                </div>
                <div className="job-item">
                  <div className="company-logo coral">F</div>
                  <div>
                    <strong>Product Designer</strong>
                    <small>Figma · Remote</small>
                  </div>
                  <span>96%</span>
                </div>
                <div className="job-item">
                  <div className="company-logo blue">N</div>
                  <div>
                    <strong>UX Researcher</strong>
                    <small>Notion · New York</small>
                  </div>
                  <span>91%</span>
                </div>
                <div className="job-item">
                  <div className="company-logo black">V</div>
                  <div>
                    <strong>Design Lead</strong>
                    <small>Vercel · Remote</small>
                  </div>
                  <span>88%</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="float-card score-float"
      >
        <div className="float-icon">
          <Check size={14} />
        </div>
        <div>
          <strong>ATS score improved</strong>
          <span>+14 points this week</span>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 4.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="float-card match-float"
      >
        <div className="match-avatars">
          <span>A</span>
          <span>B</span>
          <span>C</span>
        </div>
        <div>
          <strong>24 job matches</strong>
          <span>Waiting for you</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
