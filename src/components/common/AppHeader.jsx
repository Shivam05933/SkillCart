import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Briefcase, Sparkles, LogOut, Search } from "lucide-react";
import Logo from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";

export default function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "HOME", path: "/home", icon: Home },
    { label: "JOBS", path: "/jobs", icon: Briefcase },
    { label: "FOR YOU", path: "/for-you", icon: Sparkles },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-30 w-full bg-[#f7faf8]/85 backdrop-blur-md border-b border-[#dfe7e2]/80 font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-8 shrink-0"
        >
          <Logo />
        </motion.div>

        {/* Center: Main Navigation Tabs (HOME, JOBS, FOR YOU) with framer-motion layout pill */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === "/for-you" && location.pathname === "/foryou");

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#123c2c] rounded-xl shadow-xs"
                  />
                )}
                <span className={`relative z-10 flex items-center gap-2 ${isActive ? "text-white" : "text-[#68756f] hover:text-[#12221d]"}`}>
                  <Icon size={16} strokeWidth={isActive ? 2.3 : 1.8} />
                  <span>{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right: User Avatar & Actions */}
        <div className="flex items-center gap-3">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#dfe7e2] text-xs text-[#68756f] focus-within:border-[#19714e] transition-all"
          >
            <Search size={14} className="text-[#68756f]" />
            <input
              type="text"
              placeholder="Search posts, jobs, skills..."
              className="bg-transparent outline-none text-xs text-[#12221d] w-36 lg:w-48 placeholder-[#68756f]/60"
            />
          </motion.div>

          {/* User Profile Pill / Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#dfe7e2]/80">
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="w-8 h-8 rounded-full bg-[#19714e] text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer"
            >
              {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1, color: "#dc2626" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-lg text-[#68756f] hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
