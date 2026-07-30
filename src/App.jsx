import { useState } from "react";
import { motion } from "framer-motion";
import { FaTwitter, FaLinkedin } from "react-icons/fa";

import {
  ArrowRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  FileCheck2,
  FileUp,
  Gauge,
  Menu,
  MessageSquareText,
  Play,
  Search,
  Sparkles,
  Target,
  Upload,
  X,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const features = [
  {
    icon: FileUp,
    title: "Resume parsing",
    text: "Turn a PDF into a structured profile in seconds, with zero manual data entry.",
    tone: "mint",
  },
  {
    icon: Gauge,
    title: "ATS score checker",
    text: "See exactly how recruiters and screening systems read your resume.",
    tone: "peach",
  },
  {
    icon: Sparkles,
    title: "AI resume improver",
    text: "Rewrite bullet points with sharper language tailored to your next role.",
    tone: "lilac",
  },
  {
    icon: Target,
    title: "Smart job matching",
    text: "Discover roles where your skills, story, and ambition are a strong fit.",
    tone: "sky",
  },
  {
    icon: MessageSquareText,
    title: "AI interview practice",
    text: "Build confidence with realistic questions and feedback on every answer.",
    tone: "yellow",
  },
  {
    icon: BarChart3,
    title: "Performance dashboard",
    text: "Track your progress from first draft to signed offer in one calm workspace.",
    tone: "rose",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload your resume",
    text: "Drop in your latest PDF and let SkillCart map your experience.",
  },
  {
    number: "02",
    title: "Get your AI analysis",
    text: "Understand your strengths, gaps, and score across the signals that matter.",
  },
  {
    number: "03",
    title: "Make it remarkable",
    text: "Use precise suggestions to sharpen your resume and career narrative.",
  },
  {
    number: "04",
    title: "Apply with confidence",
    text: "Match with better-fit roles and rehearse every interview moment.",
  },
];

const showcase = {
  analysis: {
    label: "Resume Analysis",
    title: "Know what is working before you apply.",
    text: "Get a clear, recruiter-minded read on your resume with practical fixes you can make today.",
    metric: "82",
    metricLabel: "Overall ATS score",
  },
  matching: {
    label: "Job Matching",
    title: "Spend energy on the right opportunities.",
    text: "SkillCart connects your strengths to a living shortlist of roles you can genuinely win.",
    metric: "94%",
    metricLabel: "Match confidence",
  },
  interview: {
    label: "Interview AI",
    title: "Practice until your thinking feels effortless.",
    text: "Work through role-specific prompts, then get feedback that makes your next answer stronger.",
    metric: "4.8/5",
    metricLabel: "Answer clarity",
  },
};

function Logo({ compact = false }) {
  return (
    <a className="logo" href="#top" aria-label="SkillCart home">
      <span className="logo-mark">
        <span />
      </span>
      <span>{compact ? "skillcart" : "skillcart"}</span>
    </a>
  );
}

function Button({
  children,
  variant = "primary",
  href = "#start",
  icon: Icon,
}) {
  return (
    <a className={`button button-${variant}`} href={href}>
      {children}
      {Icon && <Icon size={16} strokeWidth={2.2} />}
    </a>
  );
}

function SectionIntro({ eyebrow, title, text, align = "left" }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`section-intro ${align === "center" ? "section-intro-center" : ""}`}
    >
      <div className="eyebrow">
        <span />
        {eyebrow}
      </div>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </motion.div>
  );
}

function DashboardPreview() {
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

function ShowcasePreview({ tab }) {
  const data = showcase[tab];
  return (
    <motion.div
      key={tab}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="showcase-ui"
    >
      <div className="showcase-windowbar">
        <span className="window-dots">
          <i />
          <i />
          <i />
        </span>
        <span>skillcart / {tab}</span>
        <span>•••</span>
      </div>
      <div className="showcase-body">
        <div className="showcase-head">
          <div>
            <span className="preview-kicker">AI INSIGHT</span>
            <h4>{data.label}</h4>
          </div>
          <div className="tiny-avatar">AM</div>
        </div>
        <div className="showcase-columns">
          <div className="metric-panel">
            <span className="metric-ring">
              <b>{data.metric}</b>
              <small>{data.metricLabel}</small>
            </span>
            <div className="metric-bars">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="insight-list">
            <div className="insight-title">
              What to focus on next <Sparkles size={14} />
            </div>
            <div className="insight-row">
              <span className="insight-check">
                <Check size={12} />
              </span>
              <span>Make your impact measurable</span>
              <em>High impact</em>
            </div>
            <div className="insight-row">
              <span className="insight-check">
                <Check size={12} />
              </span>
              <span>Bring skills into your summary</span>
              <em>Quick win</em>
            </div>
            <div className="insight-row">
              <span className="insight-check">
                <Check size={12} />
              </span>
              <span>Add one more project outcome</span>
              <em>Suggested</em>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("analysis");
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div id="top" className="site-shell">
      <nav className="navbar">
        <div className="nav-inner">
          <Logo />
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>
              Features
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>
              Pricing
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
            <div className="mobile-actions">
              <Button variant="ghost" href="#login">
                Log in
              </Button>
              <Button href="#start" icon={ArrowRight}>
                Get started
              </Button>
            </div>
          </div>
          <div className="nav-actions">
            <a className="login-link" href="#login">
              Log in
            </a>
            <Button href="#start" icon={ArrowRight}>
              Get started
            </Button>
          </div>
          <button
            className="menu-toggle"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <main>
        <section className="hero-section">
          <div className="hero-glow glow-one" />
          <div className="hero-glow glow-two" />
          <div className="container hero-grid">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="hero-copy"
            >
              <motion.div variants={fadeUp} className="eyebrow">
                <span />
                THE AI CAREER COPILOT
              </motion.div>
              <motion.h1 variants={fadeUp}>
                Make your next move <em>remarkable.</em>
              </motion.h1>
              <motion.p variants={fadeUp}>
                SkillCart helps you turn your experience into your next
                opportunity with AI-powered tools that know what hiring teams
                look for.
              </motion.p>
              <motion.div variants={fadeUp} className="hero-actions">
                <Button href="#start" icon={ArrowRight}>
                  Start for free
                </Button>
                <a className="demo-link" href="#showcase">
                  <span>
                    <Play size={13} fill="currentColor" />
                  </span>{" "}
                  See how it works
                </a>
              </motion.div>
              <motion.div variants={fadeUp} className="hero-note">
                <div className="avatar-stack">
                  <span>J</span>
                  <span>M</span>
                  <span>K</span>
                  <span>+</span>
                </div>
                <span>Join 12,000+ ambitious people getting career-ready</span>
              </motion.div>
            </motion.div>
            <DashboardPreview />
          </div>
          <div className="hero-bottom">
            <div className="container hero-bottom-inner">
              <span>
                Built for every step between <strong>“I’m ready”</strong> and{" "}
                <strong>“You’re hired.”</strong>
              </span>
              <div className="trust-logos">
                <b>notion</b>
                <b>Vercel</b>
                <b>loom</b>
                <b>stripe</b>
                <b>figma</b>
              </div>
            </div>
          </div>
        </section>

        <motion.section
          id="features"
          className="section features-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={stagger}
        >
          <div className="container">
            <SectionIntro
              eyebrow="YOUR CAREER, UPGRADED"
              title={
                <>
                  Everything you need to move
                  <br className="desktop-break" /> from potential to{" "}
                  <span className="accent-text">progress.</span>
                </>
              }
              text="One focused workspace for the work that makes the work happen."
            />
            <div className="feature-grid">
              {features.map(({ icon: Icon, title, text, tone }) => (
                <motion.article
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="feature-card"
                  key={title}
                >
                  <div className={`feature-icon ${tone}`}>
                    <Icon size={21} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <a href="#showcase" aria-label={`Explore ${title}`}>
                    <ArrowRight size={17} />
                  </a>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="how-it-works"
          className="section steps-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          variants={stagger}
        >
          <div className="container">
            <SectionIntro
              eyebrow="A BETTER WAY FORWARD"
              title="From first draft to first day."
              text="A clear, calm process that turns career momentum into a daily habit."
            />
            <div className="steps-grid">
              <div className="steps-line" />
              {steps.map((step, index) => (
                <motion.div
                  variants={fadeUp}
                  className="step-item"
                  key={step.number}
                >
                  <div className={`step-number ${index === 0 ? "active" : ""}`}>
                    {step.number}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="showcase"
          className="section showcase-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={stagger}
        >
          <div className="container showcase-container">
            <SectionIntro
              eyebrow="ONE PLACE TO GET BETTER"
              title={
                <>
                  A little more clarity
                  <br /> goes a <span className="accent-text">long way.</span>
                </>
              }
              text="See the signal behind the noise, then make your next best move."
            />
            <div className="showcase-tabs">
              {Object.entries(showcase).map(([key, value]) => (
                <button
                  key={key}
                  className={activeTab === key ? "active" : ""}
                  onClick={() => setActiveTab(key)}
                >
                  {value.label}
                </button>
              ))}
            </div>
            <div className="showcase-grid">
              <div className="showcase-copy">
                <div className="showcase-number">
                  0{Object.keys(showcase).indexOf(activeTab) + 1}
                </div>
                <h3>{showcase[activeTab].title}</h3>
                <p>{showcase[activeTab].text}</p>
                <a className="text-link" href="#start">
                  Explore {showcase[activeTab].label.toLowerCase()}{" "}
                  <ArrowRight size={16} />
                </a>
              </div>
              <ShowcasePreview tab={activeTab} />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="section benefits-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <div className="container benefits-grid">
            <SectionIntro
              eyebrow="WHY SKILLCART"
              title={
                <>
                  Your unfair advantage
                  <br /> is <span className="accent-text">consistency.</span>
                </>
              }
              text="Small improvements compound. SkillCart makes sure you always know which one matters most."
            />
            <div className="benefit-list">
              <motion.div variants={fadeUp}>
                <span className="benefit-icon">
                  <Zap size={18} />
                </span>
                <div>
                  <h3>Save time on the busywork</h3>
                  <p>
                    Let AI handle the formatting, scanning, and searching so you
                    can focus on the story.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={fadeUp}>
                <span className="benefit-icon">
                  <Target size={18} />
                </span>
                <div>
                  <h3>Increase your odds</h3>
                  <p>
                    Show up stronger for the roles that match where you want to
                    go next.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={fadeUp}>
                <span className="benefit-icon">
                  <Sparkles size={18} />
                </span>
                <div>
                  <h3>Get an expert in your corner</h3>
                  <p>
                    Personalized suggestions, available whenever your momentum
                    shows up.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="section testimonials-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={stagger}
        >
          <div className="container">
            <SectionIntro
              eyebrow="THEY’RE MOVING FORWARD"
              title="The confidence looks good on you."
              align="center"
            />
            <div className="testimonial-grid">
              <motion.article variants={fadeUp} className="testimonial-card">
                <div className="quote-mark">“</div>
                <p>
                  SkillCart made my resume feel like me, just sharper. I went
                  from sending applications into a void to getting three
                  interviews in a week.
                </p>
                <div className="person">
                  <div className="person-avatar avatar-one">SR</div>
                  <div>
                    <strong>Samira R.</strong>
                    <span>Product Designer · Berlin</span>
                  </div>
                  <span className="stars">★★★★★</span>
                </div>
              </motion.article>
              <motion.article
                variants={fadeUp}
                className="testimonial-card featured-testimonial"
              >
                <div className="quote-mark">“</div>
                <p>
                  The interview practice is a game changer. The feedback is
                  specific enough to actually change how I answer, not just
                  generic encouragement.
                </p>
                <div className="person">
                  <div className="person-avatar avatar-two">DC</div>
                  <div>
                    <strong>David C.</strong>
                    <span>Software Engineer · Toronto</span>
                  </div>
                  <span className="stars">★★★★★</span>
                </div>
              </motion.article>
              <motion.article variants={fadeUp} className="testimonial-card">
                <div className="quote-mark">“</div>
                <p>
                  I finally have a process. My job search feels less like a
                  second job and more like a plan I can trust.
                </p>
                <div className="person">
                  <div className="person-avatar avatar-three">LP</div>
                  <div>
                    <strong>Leo P.</strong>
                    <span>Marketing Lead · London</span>
                  </div>
                  <span className="stars">★★★★★</span>
                </div>
              </motion.article>
            </div>
          </div>
        </motion.section>

        <section id="start" className="cta-section">
          <div className="cta-pattern" />
          <div className="container cta-inner">
            <div className="eyebrow light">
              <span />
              YOUR NEXT CHAPTER STARTS HERE
            </div>
            <h2>
              Ready to make your
              <br />
              <em>move?</em>
            </h2>
            <p>
              Build the career you keep thinking about. Your first step is free.
            </p>
            <Button href="#top" variant="light" icon={ArrowRight}>
              Get started free
            </Button>
            <div className="cta-note">
              <Check size={14} /> No credit card required <span />{" "}
              <Check size={14} /> Free forever plan
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="footer">
        <div className="container footer-top">
          <div className="footer-brand">
            <Logo />
            <p>
              The AI career copilot for people
              <br />
              who are going places.
            </p>
          </div>
          <div className="footer-col">
            <strong>Product</strong>
            <a href="#features">Features</a>
            <a href="#showcase">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#start">Changelog</a>
          </div>
          <div className="footer-col">
            <strong>Company</strong>
            <a href="#contact">About us</a>
            <a href="#contact">
              Careers <small>We’re hiring</small>
            </a>
            <a href="#contact">Contact</a>
            <a href="#contact">Blog</a>
          </div>
          <div className="footer-col">
            <strong>Resources</strong>
            <a href="#contact">Help center</a>
            <a href="#contact">Career guides</a>
            <a href="#contact">Community</a>
            <a href="#contact">Privacy</a>
          </div>
          <div className="footer-newsletter">
            <strong>Get the good stuff.</strong>
            <p>A thoughtful note on work, once a month.</p>
            <div className="email-box">
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
              />
              <button aria-label="Subscribe">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2024 SkillCart, Inc. Made for the next move.</span>
          <div className="socials">
            <a href="#contact" aria-label="Twitter">
              <FaTwitter size={16} />
            </a>
            <a href="#contact" aria-label="LinkedIn">
              <FaLinkedin size={16} />
            </a>
            <a href="#contact" aria-label="Search">
              <Search size={16} />
            </a>
          </div>
          <span>
            Made with intention <span className="heart">♥</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
