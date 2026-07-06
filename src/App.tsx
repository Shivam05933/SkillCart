import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Upload,
  Play,
  Brain,
  FileSearch,
  Target,
  Zap,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Menu,
  X,
  Layers,
  Briefcase,
  Bot,
} from 'lucide-react';

// Animated counter hook
function useCounter(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!startOnView || isInView) {
      let startTime: number | null = null;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [end, duration, startOnView, isInView]);

  return { count, ref };
}

// Navbar Component
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Features', 'Pricing', 'About'];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass shadow-card' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-mint-400 flex items-center justify-center shadow-glow">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-teal-500" />
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">SkillCart</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                onMouseEnter={() => setHoveredLink(link)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {hoveredLink === link && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 bg-teal-50 rounded-lg -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {link}
                {hoveredLink === link && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-teal-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
            <motion.button
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-mint-500 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-shadow"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <motion.a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-teal-50 rounded-xl transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    {link}
                  </motion.a>
                ))}
                <div className="pt-2 space-y-2">
                  <button className="w-full px-4 py-2.5 text-gray-700 font-medium border border-gray-200 rounded-xl">
                    Login
                  </button>
                  <button className="w-full px-4 py-2.5 text-white font-semibold bg-gradient-to-r from-teal-600 to-mint-500 rounded-xl">
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

// Floating Skill Card
function FloatingSkillCard({ skill, delay, style }: { skill: { name: string; color: string }; delay: number; style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute glass rounded-xl px-3 py-2 shadow-card cursor-pointer"
      style={style}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -10, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: { duration: 3, delay: delay * 2, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{ scale: 1.1, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: skill.color }} />
        <span className="text-xs font-medium text-gray-700">{skill.name}</span>
      </div>
    </motion.div>
  );
}

// Profile Card with Jobs Found
function ProfileCard() {
  const { count, ref } = useCounter(633, 2500);

  return (
    <motion.div
      className="relative glass rounded-3xl p-6 shadow-float w-52"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
    >
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-mint-300 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-2xl">👤</span>
        </motion.div>
        <div>
          <h4 className="font-semibold text-gray-900">Alex Johnson</h4>
          <p className="text-sm text-gray-500">Full Stack Developer</p>
        </div>
      </div>

      {/* Jobs Found */}
      <div className="bg-gradient-to-br from-teal-500 to-mint-400 rounded-2xl p-4 text-white">
        <p className="text-xs font-medium opacity-80 mb-1">Jobs Found</p>
        <div className="flex items-end gap-2">
          <span ref={ref} className="text-4xl font-bold">{count}</span>
          <span className="text-2xl">+</span>
        </div>
        <div className="flex gap-1 mt-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full bg-white/30"
              animate={{ width: i < 4 ? '20px' : '10px' }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Pulse dot */}
      <div className="absolute top-3 right-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500" />
        </span>
      </div>
    </motion.div>
  );
}

// Hero Section
function HeroSection() {
  const skills = [
    { name: 'React', color: '#61DAFB' },
    { name: 'Node.js', color: '#339933' },
    { name: 'AWS', color: '#FF9900' },
    { name: 'Python', color: '#3776AB' },
    { name: 'Docker', color: '#2496ED' },
  ];

  const skillPositions: React.CSSProperties[] = [
    { top: '15%', left: '5%' },
    { top: '20%', right: '10%' },
    { bottom: '25%', right: '5%' },
    { bottom: '15%', left: '10%' },
    { top: '5%', left: '40%' },
  ];

  const headline = "Upload Your Resume Once. Let AI Find Your Dream Job.";

  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-teal-200/40 to-mint-200/40 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-accent-200/30 to-teal-200/30 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-card border border-teal-100"
            >
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Job Matching</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {headline.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                >
                  {word.includes('AI') ? (
                    <span className="text-gradient">{word}</span>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-gray-600 leading-relaxed max-w-xl"
            >
              Our MERN-driven smart optimization ecosystem analyzes your skills, optimizes your resume for each role,
              and automatically applies to matched positions. Land your dream job faster.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                className="group relative px-8 py-4 bg-gray-900 text-white rounded-2xl font-semibold shadow-xl overflow-hidden"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-teal-600 to-mint-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                className="relative px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-teal-300 transition-colors overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </span>
                <motion.div
                  className="absolute inset-0 rounded-full bg-teal-500/20"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white flex items-center justify-center text-sm"
                  >
                    {['👨', '👩', '🧑', '👨'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">10,000+ Professionals</p>
                <p className="text-xs text-gray-500">Trust SkillCart for their career</p>
              </div>
            </motion.div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative w-full h-[500px] lg:h-[600px]">
              {/* Central Profile Card */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <ProfileCard />
              </motion.div>

              {/* Floating Skill Cards */}
              {skills.map((skill, i) => (
                <FloatingSkillCard
                  key={skill.name}
                  skill={skill}
                  delay={0.2 + i * 0.2}
                  style={skillPositions[i]}
                />
              ))}

              {/* Orbiting Ring */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-dashed border-teal-200 opacity-60"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ATS Score Progress
function ATSScoreProgress({ score }: { score: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        let current = 0;
        const increment = () => {
          current += 1;
          setDisplayScore(Math.min(current, score));
          if (current < score) requestAnimationFrame(increment);
        };
        increment();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isInView, score]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div ref={ref} className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{displayScore}%</span>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ feature, index }: { feature: {
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: 'large' | 'medium' | 'small';
  component?: React.ReactNode;
}; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const gridClass = {
    large: 'lg:col-span-2 lg:row-span-2',
    medium: 'lg:col-span-1 lg:row-span-2',
    small: 'lg:col-span-1 lg:row-span-1',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`${gridClass[feature.variant]} bg-white rounded-3xl p-8 shadow-card border border-gray-100 group cursor-pointer relative overflow-hidden`}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-mint-50/0 group-hover:from-teal-50/50 group-hover:to-mint-50/30 transition-all duration-500" />

      <div className="relative">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-mint-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform duration-300">
            {feature.icon}
          </div>
          {feature.variant === 'small' && (
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          )}
        </div>

        {feature.variant !== 'small' && (
          <>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-6">{feature.description}</p>
          </>
        )}

        {feature.component}
      </div>
    </motion.div>
  );
}

// Resume Flex Component
function ResumeFlexDemo() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative h-48 perspective-1000">
      <motion.div
        className="absolute inset-0 w-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        style={{ transformStyle: 'preserve-3d' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200 cursor-pointer"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
              <FileSearch className="w-4 h-4 text-teal-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Original Resume</span>
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-2 bg-gray-200 rounded-full" style={{ width: `${80 - i * 15}%` }} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">Click to see optimized version</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-teal-50 to-mint-50 rounded-2xl p-4 border border-teal-200 cursor-pointer"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-teal-700">Role-Specific</span>
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="h-2 bg-teal-300 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${90 - i * 10}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              />
            ))}
          </div>
          <p className="text-xs text-teal-600 mt-4">Click to flip back</p>
        </div>
      </motion.div>
    </div>
  );
}

// Skill Gap Timeline
function SkillGapTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setProgress(100), 300);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const weeks = [
    { week: 1, skill: 'TypeScript', color: '#3178c6' },
    { week: 2, skill: 'GraphQL', color: '#e535ab' },
    { week: 3, skill: 'Docker', color: '#2496ed' },
    { week: 4, skill: 'Kubernetes', color: '#326ce5' },
  ];

  return (
    <div ref={ref} className="relative mt-4">
      {/* Progress Line */}
      <div className="absolute top-4 left-4 right-4 h-1 bg-gray-100 rounded-full">
        <motion.div
          className="h-full bg-gradient-to-r from-teal-500 to-mint-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>

      {/* Week nodes */}
      <div className="flex justify-between relative pt-2">
        {weeks.map((item, i) => (
          <motion.div
            key={item.week}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <div
              className="w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center text-xs font-bold text-gray-600 mb-2"
              style={{ borderColor: progress > i * 25 ? item.color : '#e5e7eb' }}
            >
              {item.week}
            </div>
            <span className="text-xs text-gray-600">{item.skill}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Job Match List
function JobMatchList() {
  const jobs = [
    { title: 'Senior Frontend Developer', company: 'Google', match: 98 },
    { title: 'Full Stack Engineer', company: 'Meta', match: 94 },
    { title: 'React Developer', company: 'Stripe', match: 91 },
  ];

  return (
    <div className="space-y-2">
      {jobs.map((job, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          whileHover={{ x: 4 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-teal-50 transition-colors cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-lg">
            {['🔵', '🟣', '🔷'][i]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
            <p className="text-xs text-gray-500">{job.company}</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-teal-600">{job.match}%</span>
            <span className="text-xs text-gray-400">match</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Career Insight Box
function CareerInsightBox() {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-5 h-5 text-teal-400" />
        <span className="text-sm font-medium text-gray-300">AI Career Copilot</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Hiring Chances</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-400 to-mint-300"
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>
            <span className="text-sm font-semibold">85%</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Expected Salary</span>
          <span className="text-sm font-semibold">
            $145K
            <span className="text-teal-400 ml-1">+18%</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      title: 'AI Resume Analyzer',
      description: 'Our advanced AI scans your resume against thousands of job descriptions to calculate your ATS compatibility score.',
      icon: <Brain className="w-6 h-6" />,
      variant: 'large' as const,
      component: <ATSScoreProgress score={94} />,
    },
    {
      title: 'Resume Flex',
      description: 'Automatically tailor your resume for each specific role while maintaining your authentic voice.',
      icon: <Layers className="w-6 h-6" />,
      variant: 'medium' as const,
      component: <ResumeFlexDemo />,
    },
    {
      title: 'AI Job Search',
      description: 'Intelligent matching that finds roles aligned with your skills and preferences.',
      icon: <Briefcase className="w-6 h-6" />,
      variant: 'small' as const,
    },
    {
      title: 'Auto Apply',
      description: 'One-click applications to multiple matched positions simultaneously.',
      icon: <Zap className="w-6 h-6" />,
      variant: 'small' as const,
    },
    {
      title: 'Skill Gap Analysis',
      description: 'Identify missing skills and get a personalized learning roadmap.',
      icon: <TrendingUp className="w-6 h-6" />,
      variant: 'large' as const,
      component: <SkillGapTimeline />,
    },
    {
      title: 'Career Copilot',
      description: 'Get insights on hiring chances and salary predictions.',
      icon: <Bot className="w-6 h-6" />,
      variant: 'medium' as const,
      component: <CareerInsightBox />,
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform handles everything from resume optimization to automated applications.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[200px]">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    { num: 1, title: 'Upload Resume', icon: <Upload className="w-5 h-5" />, description: 'Drop your resume and let AI analyze it' },
    { num: 2, title: 'Skills Extraction', icon: <Brain className="w-5 h-5" />, description: 'AI identifies your core competencies' },
    { num: 3, title: 'Predictive Match', icon: <Target className="w-5 h-5" />, description: 'Match with ideal job opportunities' },
    { num: 4, title: 'Resume Flex', icon: <Layers className="w-5 h-5" />, description: 'Tailor resume for each role' },
    { num: 5, title: 'Auto Apply', icon: <Zap className="w-5 h-5" />, description: 'Apply to matched positions automatically' },
  ];

  return (
    <section id="about" className="py-20 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Your Journey to the Perfect Job
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Five simple steps powered by AI to transform your job search
          </p>
        </motion.div>

        {/* Pipeline */}
        <div ref={ref} className="relative">
          {/* Connection Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 200">
            <motion.path
              d="M100,100 Q250,50 400,100 T700,100 T950,100"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="2"
              strokeDasharray="1000"
              initial={{ strokeDashoffset: 1000 }}
              animate={isInView ? { strokeDashoffset: 0 } : {}}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
          </svg>

          {/* Steps */}
          <div className="relative flex flex-wrap lg:justify-center gap-4 lg:gap-8 px-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-mint-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {step.icon}
                </motion.div>
                <div className="bg-white rounded-xl px-4 py-3 shadow-card border border-gray-100 text-center max-w-[150px]">
                  <span className="inline-block px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full mb-1">
                    Step {step.num}
                  </span>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Software Engineer at Google',
      avatar: '👩',
      rating: 5,
      text: "SkillCart transformed my job search. The AI matched me with positions I wouldn't have found otherwise, and the resume optimization helped me stand out. Got 3 offers in 2 weeks!",
    },
    {
      name: 'Michael Rodriguez',
      role: 'Full Stack Developer at Stripe',
      avatar: '👨',
      rating: 5,
      text: 'The skill gap analysis was eye-opening. I followed the learning roadmap and landed my dream role with a 40% salary increase. The auto-apply feature saved me hours every week.',
    },
    {
      name: 'Emily Watson',
      role: 'Frontend Lead at Meta',
      avatar: '👩',
      rating: 5,
      text: "I was skeptical at first, but the ATS analyzer helped me optimize my resume perfectly. My interview callbacks increased by 300%. Can't recommend SkillCart enough!",
    },
  ];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Loved by Thousands of Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how SkillCart has helped others land their dream jobs
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-8 lg:p-12 shadow-card border border-gray-100"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-mint-100 flex items-center justify-center text-3xl flex-shrink-0">
                  {testimonials[currentIndex].avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-teal-400 text-teal-400" />
                    ))}
                  </div>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    "{testimonials[currentIndex].text}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonials[currentIndex].name}</p>
                    <p className="text-sm text-gray-500">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              onClick={prevSlide}
              className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-teal-300 hover:text-teal-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Progress dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex ? 'w-8 bg-teal-500' : 'w-2 bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextSlide}
              className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-teal-300 hover:text-teal-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}

// FAQ Accordion
function FAQItem({ question, answer, isOpen, onClick }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="border border-gray-100 rounded-2xl overflow-hidden bg-white"
      initial={false}
    >
      <motion.button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left"
        whileHover={{ backgroundColor: 'rgba(20, 184, 166, 0.05)' }}
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 text-gray-600">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How accurate is the ATS scanning?',
      answer: 'Our AI-powered ATS scanner achieves 95%+ accuracy by analyzing your resume against actual ATS systems used by major companies. We continuously update our algorithms to match the latest ATS requirements and provide detailed feedback on exactly what needs improvement.',
    },
    {
      question: 'Is my resume data private and secure?',
      answer: 'Absolutely. Your resume is encrypted end-to-end and stored securely. We never share your personal data with third parties. You maintain full control and can delete your data at any time. We comply with GDPR and SOC 2 standards.',
    },
    {
      question: 'How does multi-role customization work?',
      answer: 'Our Resume Flex feature creates tailored versions of your resume for different job types. The AI analyzes job requirements and optimizes your resume keywords, sections, and formatting to maximize match rates for each specific role you apply to.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel anytime with no questions asked. Your subscription remains active until the end of your billing period, and you can continue using all features until then.',
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about SkillCart
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-mint-400 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SkillCart</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              AI-powered job searching that helps you land your dream role faster.
            </p>
            <div className="flex gap-4">
              {['twitter', 'linkedin', 'github'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors"
                  whileHover={{ y: -2 }}
                />
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Enterprise', 'API'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2026 SkillCart. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((link) => (
              <a key={link} href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Stats Bar
function StatsBar() {
  const stats = [
    { value: '10K+', label: 'Users' },
    { value: '50K+', label: 'Jobs Matched' },
    { value: '94%', label: 'ATS Accuracy' },
    { value: '2.5x', label: 'Faster Hiring' },
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-teal-600 to-mint-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center text-white"
            >
              <p className="text-3xl lg:text-4xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main App
export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
