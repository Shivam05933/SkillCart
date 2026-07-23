import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
function useCounter(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!startOnView || isInView) {
      let startTime = null;
      const animate = (timestamp) => {
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

// Parallax hover effect hook
function useParallaxHover(strength = 10) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / strength);
    y.set((e.clientY - centerY) / strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { x: xSpring, y: ySpring, handleMouseMove, handleMouseLeave };
}

// Section wrapper with scroll animation
function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, type: 'spring', stiffness: 80, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Navbar Component
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

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
      <div className="px-4 py-3 mx-auto max-w-7xl sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-500 to-mint-400 shadow-glow">
                <Brain className="w-4 h-4 text-white sm:w-5 sm:h-5" />
              </div>
              <div className="absolute flex items-center justify-center w-3 h-3 bg-white rounded-full -bottom-1 -right-1 sm:w-4 sm:h-4">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-teal-500" />
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900 sm:text-xl">SkillCart</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-1 md:flex">
            {navLinks.map((link) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="relative px-3 py-2 text-sm font-medium text-gray-600 transition-colors lg:px-4 hover:text-gray-900"
                onMouseEnter={() => setHoveredLink(link)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {hoveredLink === link && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 rounded-lg bg-teal-50 -z-10"
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
          <div className="items-center hidden gap-2 md:flex lg:gap-3">
            <motion.button
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors lg:px-4 hover:text-gray-900"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
            <motion.button
              className="px-4 lg:px-5 py-2 lg:py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-mint-500 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-shadow"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="p-2 text-gray-700 md:hidden"
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
              className="overflow-hidden md:hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <motion.a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="block px-4 py-3 text-gray-600 transition-colors hover:text-gray-900 hover:bg-teal-50 rounded-xl"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link}
                  </motion.a>
                ))}
                <div className="px-4 pt-2 space-y-2">
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

// Floating Skill Card with parallax
function FloatingSkillCard({ skill, delay, style }) {
  const parallax = useParallaxHover(8);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute px-3 py-2 cursor-pointer glass rounded-xl shadow-card"
      style={{
        ...style,
        x: parallax.x,
        y: parallax.y,
        boxShadow: isHovered
          ? '0 20px 40px rgba(20, 184, 166, 0.2), 0 0 30px rgba(20, 184, 166, 0.1)'
          : undefined
      }}
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
      onMouseMove={parallax.handleMouseMove}
      onMouseLeave={() => {
        parallax.handleMouseLeave();
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      whileHover={{ scale: 1.15 }}
    >
      <div className="flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: skill.color }}
          animate={{ scale: isHovered ? 1.5 : 1 }}
        />
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
      className="relative w-48 p-5 glass rounded-3xl sm:p-6 shadow-float sm:w-52"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
    >
      {/* Avatar */}
      <div className="flex items-center gap-3 mb-4 sm:gap-4">
        <motion.div
          className="flex items-center justify-center w-12 h-12 rounded-full sm:w-14 sm:h-14 bg-gradient-to-br from-teal-400 to-mint-300"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xl sm:text-2xl">👤</span>
        </motion.div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 sm:text-base">Alex Johnson</h4>
          <p className="text-xs text-gray-500 sm:text-sm">Full Stack Developer</p>
        </div>
      </div>

      {/* Jobs Found */}
      <div className="p-4 text-white bg-gradient-to-br from-teal-500 to-mint-400 rounded-2xl">
        <p className="mb-1 text-xs font-medium opacity-80">Jobs Found</p>
        <div className="flex items-end gap-2">
          <span ref={ref} className="text-3xl font-bold sm:text-4xl">{count}</span>
          <span className="text-xl sm:text-2xl">+</span>
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
        <span className="relative flex w-3 h-3">
          <span className="absolute inline-flex w-full h-full bg-teal-400 rounded-full opacity-75 animate-ping" />
          <span className="relative inline-flex w-3 h-3 bg-teal-500 rounded-full" />
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

  const skillPositions = [
    { top: '15%', left: '2%', transform: 'translateX(0)' },
    { top: '20%', right: '5%' },
    { bottom: '25%', right: '2%' },
    { bottom: '15%', left: '5%' },
    { top: '5%', left: '35%', transform: 'translateX(-50%)' },
  ];

  const headline = "Upload Your Resume Once. Let AI Find Your Dream Job.";

  return (
    <section className="relative min-h-screen pt-16 overflow-hidden gradient-hero sm:pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute rounded-full -top-40 -right-40 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-br from-teal-200/40 to-mint-200/40 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute rounded-full top-1/2 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-br from-accent-200/30 to-teal-200/30 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 sm:py-20 lg:py-32">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-20">
          {/* Left Content */}
          <div className="space-y-6 text-center sm:space-y-8 lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-2 mx-auto border border-teal-100 rounded-full sm:px-4 bg-white/80 shadow-card lg:mx-0"
            >
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Job Matching</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl xl:text-6xl">
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
              className="max-w-xl mx-auto text-base leading-relaxed text-gray-600 sm:text-lg lg:mx-0"
            >
              Our MERN-driven smart optimization ecosystem analyzes your skills, optimizes your resume for each role,
              and automatically applies to matched positions. Land your dream job faster.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:justify-start"
            >
              <motion.button
                className="relative px-6 py-3 overflow-hidden font-semibold text-white bg-gray-900 shadow-xl group sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2 text-sm sm:gap-3 sm:text-base">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
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
                className="relative px-6 py-3 overflow-hidden font-semibold text-gray-700 transition-colors border-2 border-gray-200 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl hover:border-teal-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2 text-sm sm:gap-3 sm:text-base">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
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
              className="flex items-center justify-center gap-4 pt-4 sm:gap-6 lg:justify-start"
            >
              <div className="flex -space-x-2 sm:-space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center w-8 h-8 text-sm border-2 border-white rounded-full sm:w-10 sm:h-10 bg-gradient-to-br from-gray-200 to-gray-300"
                  >
                    {['👨', '👩', '🧑', '👨'][i]}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-gray-900 sm:text-sm">10,000+ Professionals</p>
                <p className="text-xs text-gray-500">Trust SkillCart for their career</p>
              </div>
            </motion.div>
          </div>

          {/* Right Visual */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Central Profile Card */}
              <motion.div
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <ProfileCard />
              </motion.div>

              {/* Floating Skill Cards - Hidden on mobile, visible on larger screens */}
              <div className="hidden sm:block">
                {skills.map((skill, i) => (
                  <FloatingSkillCard
                    key={skill.name}
                    skill={skill}
                    delay={0.2 + i * 0.2}
                    style={skillPositions[i]}
                  />
                ))}
              </div>

              {/* Orbiting Ring */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[350px] h-[280px] sm:h-[350px] rounded-full border border-dashed border-teal-200 opacity-60"
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
function ATSScoreProgress({ score }) {
  const ref = useRef(null);
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
    <div ref={ref} className="relative w-28 sm:w-32 h-28 sm:h-32">
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
        <span className="text-xl font-bold text-gray-900 sm:text-2xl">{displayScore}%</span>
      </div>
    </div>
  );
}

// Feature Card Component with hover effects
function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const parallax = useParallaxHover(5);
  const [isHovered, setIsHovered] = useState(false);

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
      style={{
        x: parallax.x,
        y: parallax.y,
        boxShadow: isHovered
          ? '0 25px 50px rgba(20, 184, 166, 0.15), 0 0 40px rgba(20, 184, 166, 0.1)'
          : undefined
      }}
      onMouseMove={parallax.handleMouseMove}
      onMouseLeave={() => {
        parallax.handleMouseLeave();
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`${gridClass[feature.variant]} bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-card border border-gray-100 group cursor-pointer relative overflow-hidden`}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 transition-all duration-500 bg-gradient-to-br from-teal-50/0 to-mint-50/0 group-hover:from-teal-50/50 group-hover:to-mint-50/30" />

      <div className="relative">
        <div className="flex items-start gap-3 mb-3 sm:gap-4 sm:mb-4">
          <div className="flex items-center justify-center w-10 h-10 text-white transition-transform duration-300 shadow-lg sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-mint-400 shadow-teal-500/25 group-hover:scale-110">
            {feature.icon}
          </div>
          {feature.variant === 'small' && (
            <div className="flex-1">
              <h3 className="mb-1 text-base font-semibold text-gray-900 sm:text-lg">{feature.title}</h3>
              <p className="text-xs text-gray-500 sm:text-sm">{feature.description}</p>
            </div>
          )}
        </div>

        {feature.variant !== 'small' && (
          <>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">{feature.title}</h3>
            <p className="mb-4 text-sm text-gray-600 sm:text-base sm:mb-6">{feature.description}</p>
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
    <div className="relative h-40 sm:h-48 perspective-1000">
      <motion.div
        className="absolute inset-0 w-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        style={{ transformStyle: 'preserve-3d' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div
          className="absolute inset-0 p-3 border border-gray-200 cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl sm:p-4"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="flex items-center justify-center bg-teal-100 rounded-lg w-7 h-7 sm:w-8 sm:h-8">
              <FileSearch className="w-3 h-3 text-teal-600 sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs font-medium text-gray-700 sm:text-sm">Original Resume</span>
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-2 bg-gray-200 rounded-full" style={{ width: `${80 - i * 15}%` }} />
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400 sm:mt-4">Click to see optimized version</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 p-3 border border-teal-200 cursor-pointer bg-gradient-to-br from-teal-50 to-mint-50 rounded-xl sm:rounded-2xl sm:p-4"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="flex items-center justify-center bg-teal-500 rounded-lg w-7 h-7 sm:w-8 sm:h-8">
              <Target className="w-3 h-3 text-white sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs font-medium text-teal-700 sm:text-sm">Role-Specific</span>
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
          <p className="mt-3 text-xs text-teal-600 sm:mt-4">Click to flip back</p>
        </div>
      </motion.div>
    </div>
  );
}

// Skill Gap Timeline
function SkillGapTimeline() {
  const ref = useRef(null);
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
      <div className="absolute h-1 bg-gray-100 rounded-full top-4 left-4 right-4">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-mint-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>

      {/* Week nodes */}
      <div className="relative flex justify-between pt-2">
        {weeks.map((item, i) => (
          <motion.div
            key={item.week}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <div
              className="flex items-center justify-center mb-2 text-xs font-bold text-gray-600 bg-white border-2 rounded-full w-7 h-7 sm:w-8 sm:h-8"
              style={{ borderColor: progress > i * 25 ? item.color : '#e5e7eb' }}
            >
              {item.week}
            </div>
            <span className="hidden text-xs text-gray-600 sm:block">{item.skill}</span>
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
          whileHover={{ x: 4, boxShadow: '0 4px 20px rgba(20, 184, 166, 0.15)' }}
          className="flex items-center gap-2 p-2 transition-colors cursor-pointer sm:gap-3 sm:p-3 rounded-xl bg-gray-50 hover:bg-teal-50 group"
        >
          <div className="flex items-center justify-center w-8 h-8 text-base bg-white border border-gray-200 rounded-lg sm:w-10 sm:h-10 sm:text-lg">
            {['🔵', '🟣', '🔷'][i]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate sm:text-sm">{job.title}</p>
            <p className="text-xs text-gray-500">{job.company}</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-teal-600">{job.match}%</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Career Insight Box
function CareerInsightBox() {
  return (
    <div className="p-3 text-white bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl sm:p-4">
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <Bot className="w-4 h-4 text-teal-400 sm:w-5 sm:h-5" />
        <span className="text-xs font-medium text-gray-300 sm:text-sm">AI Career Copilot</span>
      </div>
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Hiring Chances</span>
          <div className="flex items-center gap-2">
            <div className="w-20 sm:w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-400 to-mint-300"
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>
            <span className="text-xs font-semibold sm:text-sm">85%</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Expected Salary</span>
          <span className="text-xs font-semibold sm:text-sm">
            $145K
            <span className="ml-1 text-teal-400">+18%</span>
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
      icon: <Brain className="w-5 h-5 sm:w-6 sm:h-6" />,
      variant: 'large',
      component: <ATSScoreProgress score={94} />,
    },
    {
      title: 'Resume Flex',
      description: 'Automatically tailor your resume for each specific role while maintaining your authentic voice.',
      icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6" />,
      variant: 'medium',
      component: <ResumeFlexDemo />,
    },
    {
      title: 'AI Job Search',
      description: 'Intelligent matching that finds roles aligned with your skills.',
      icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />,
      variant: 'small',
    },
    {
      title: 'Auto Apply',
      description: 'One-click applications to multiple matched positions.',
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      variant: 'small',
    },
    {
      title: 'Skill Gap Analysis',
      description: 'Identify missing skills and get a personalized learning roadmap.',
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      variant: 'large',
      component: <SkillGapTimeline />,
    },
    {
      title: 'Career Copilot',
      description: 'Get insights on hiring chances and salary predictions.',
      icon: <Bot className="w-5 h-5 sm:w-6 sm:h-6" />,
      variant: 'medium',
      component: <CareerInsightBox />,
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        {/* Section Header */}
        <AnimatedSection className="mb-12 text-center sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-xs sm:text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl xl:text-5xl">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="max-w-2xl mx-auto text-base text-gray-600 sm:text-lg">
            Our AI-powered platform handles everything from resume optimization to automated applications.
          </p>
        </AnimatedSection>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-[180px] sm:auto-rows-[200px]">
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    { num: 1, title: 'Upload Resume', icon: <Upload className="w-4 h-4 sm:w-5 sm:h-5" />, description: 'Drop your resume' },
    { num: 2, title: 'Skills Extraction', icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />, description: 'AI identifies skills' },
    { num: 3, title: 'Predictive Match', icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" />, description: 'Match with jobs' },
    { num: 4, title: 'Resume Flex', icon: <Layers className="w-4 h-4 sm:w-5 sm:h-5" />, description: 'Tailor for roles' },
    { num: 5, title: 'Auto Apply', icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />, description: 'Apply automatically' },
  ];

  return (
    <section id="about" className="py-16 overflow-hidden bg-white sm:py-20 lg:py-32">
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        {/* Section Header */}
        <AnimatedSection className="mb-12 text-center sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-xs sm:text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl xl:text-5xl">
            Your Journey to the Perfect Job
          </h2>
          <p className="max-w-2xl mx-auto text-base text-gray-600 sm:text-lg">
            Five simple steps powered by AI to transform your job search
          </p>
        </AnimatedSection>

        {/* Pipeline */}
        <div ref={ref} className="relative">
          {/* Connection Line - Hidden on mobile */}
          <svg className="absolute inset-0 hidden w-full h-full pointer-events-none lg:block" viewBox="0 0 1000 200">
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
          <div className="relative grid grid-cols-2 gap-4 px-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center sm:gap-6 lg:gap-8 sm:px-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              >
                <motion.div
                  className="flex items-center justify-center w-12 h-12 mb-3 text-white shadow-lg sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-mint-400 shadow-teal-500/25 sm:mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {step.icon}
                </motion.div>
                <div className="bg-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-card border border-gray-100 text-center w-full max-w-[120px] sm:max-w-[150px]">
                  <span className="inline-block px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full mb-1">
                    Step {step.num}
                  </span>
                  <h4 className="mb-1 text-xs font-semibold text-gray-900 sm:text-sm">{step.title}</h4>
                  <p className="hidden text-xs text-gray-500 sm:block">{step.description}</p>
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
    <section className="py-16 sm:py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        {/* Section Header */}
        <AnimatedSection className="mb-12 text-center sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-xs sm:text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl xl:text-5xl">
            Loved by Thousands of Professionals
          </h2>
          <p className="max-w-2xl mx-auto text-base text-gray-600 sm:text-lg">
            See how SkillCart has helped others land their dream jobs
          </p>
        </AnimatedSection>

        {/* Testimonials Slider */}
        <div className="relative max-w-3xl mx-auto sm:max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-white border border-gray-100 rounded-2xl sm:rounded-3xl sm:p-8 lg:p-12 shadow-card"
            >
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
                <div className="flex items-center justify-center flex-shrink-0 mx-auto text-2xl w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-100 to-mint-100 sm:text-3xl sm:mx-0">
                  {testimonials[currentIndex].avatar}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center gap-1 mb-3 sm:justify-start">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-teal-400 sm:w-5 sm:h-5 fill-teal-400" />
                    ))}
                  </div>
                  <p className="mb-6 text-base leading-relaxed text-gray-700 sm:text-lg">
                    "{testimonials[currentIndex].text}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonials[currentIndex].name}</p>
                    <p className="text-xs text-gray-500 sm:text-sm">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
            <motion.button
              onClick={prevSlide}
              className="flex items-center justify-center w-10 h-10 text-gray-600 transition-colors bg-white border border-gray-200 sm:w-12 sm:h-12 rounded-xl hover:border-teal-300 hover:text-teal-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {/* Progress dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex ? 'w-6 sm:w-8 bg-teal-500' : 'w-2 bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextSlide}
              className="flex items-center justify-center w-10 h-10 text-gray-600 transition-colors bg-white border border-gray-200 sm:w-12 sm:h-12 rounded-xl hover:border-teal-300 hover:text-teal-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}

// FAQ Accordion
function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <motion.div
      className="overflow-hidden bg-white border border-gray-100 rounded-xl sm:rounded-2xl"
      initial={false}
    >
      <motion.button
        onClick={onClick}
        className="flex items-center justify-between w-full p-4 text-left sm:p-6"
        whileHover={{ backgroundColor: 'rgba(20, 184, 166, 0.05)' }}
      >
        <span className="pr-4 text-sm font-semibold text-gray-900 sm:text-base">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
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
            <div className="px-4 pb-4 text-sm text-gray-600 sm:px-6 sm:pb-6 sm:text-base">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

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
    <section className="py-16 bg-white sm:py-20 lg:py-32">
      <div className="max-w-3xl px-4 mx-auto sm:px-6">
        {/* Section Header */}
        <AnimatedSection className="mb-10 text-center sm:mb-12">
          <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-xs sm:text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-gray-600 sm:text-lg">
            Everything you need to know about SkillCart
          </p>
        </AnimatedSection>

        {/* FAQ Items */}
        <div className="space-y-3 sm:space-y-4">
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
    <footer className="py-12 text-white bg-gray-900 sm:py-16">
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        <div className="grid grid-cols-2 gap-6 mb-12 md:grid-cols-4 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-500 to-mint-400">
                <Brain className="w-4 h-4 text-white sm:w-5 sm:h-5" />
              </div>
              <span className="text-lg font-bold sm:text-xl">SkillCart</span>
            </div>
            <p className="max-w-sm mb-6 text-sm text-gray-400 sm:text-base">
              AI-powered job searching that helps you land your dream role faster.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {['twitter', 'linkedin', 'github'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="flex items-center justify-center w-8 h-8 transition-colors bg-gray-800 sm:w-10 sm:h-10 rounded-xl hover:bg-teal-600"
                  whileHover={{ y: -2 }}
                />
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold sm:mb-4 sm:text-base">Product</h4>
            <ul className="space-y-2 sm:space-y-3">
              {['Features', 'Pricing', 'Enterprise', 'API'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs text-gray-400 transition-colors hover:text-white sm:text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold sm:mb-4 sm:text-base">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              {['About', 'Blog', 'Careers', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs text-gray-400 transition-colors hover:text-white sm:text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t border-gray-800 sm:flex-row">
          <p className="text-xs text-gray-500 sm:text-sm">
            &copy; 2026 SkillCart. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((link) => (
              <a key={link} href="#" className="text-xs text-gray-400 transition-colors hover:text-white sm:text-sm">
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
    <section className="py-8 sm:py-12 bg-gradient-to-r from-teal-600 to-mint-500">
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 sm:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center text-white"
            >
              <p className="mb-1 text-2xl font-bold sm:text-3xl lg:text-4xl">{stat.value}</p>
              <p className="text-xs sm:text-sm opacity-80">{stat.label}</p>
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
