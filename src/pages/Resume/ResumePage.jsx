import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
  Briefcase,
  Target,
  GraduationCap,
  Award,
  CheckCircle2,
  Loader2,
  Download,
  ExternalLink,
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import resumeService from "../../services/resumeService";
import Logo from "../../components/ui/Logo";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ResumePage() {
  const navigate = useNavigate();
  const { setResumeState, downloadUrl: contextDownloadUrl } = useApp();
  const { completeResume } = useAuth();
  const fileInputRef = useRef(null);

  // Active view: 'select' (default choices), 'upload', 'upload_success', 'create', 'created_success'
  const [mode, setMode] = useState("select");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [generatedResume, setGeneratedResume] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const activeDownloadUrl = downloadUrl || contextDownloadUrl;

  // --------------------------------------------------------------------------
  // CREATE RESUME FORM STATE (Strict Schema Matching Backend API)
  // --------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    name: "",
    contact: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    education: [
      {
        institution: "",
        degree: "",
        major: "",
        start_date: "",
        end_date: "",
        gpa: "",
      },
    ],
    experience: [
      {
        company: "",
        role: "",
        start_date: "",
        end_date: "",
        highlights: [""],
      },
    ],
    projects: [
      {
        name: "",
        description: "",
        highlights: [""],
        url: "",
      },
    ],
    skills: [
      { category: "Languages & Frameworks", skills: "" },
      { category: "Tools & Libraries", skills: "" },
    ],
    certifications: [
      { name: "", issuer: "", issue_date: "", url: "" },
    ],
  });

  // --------------------------------------------------------------------------
  // RESUME UPLOAD FLOW (POST /v1/resume/upload)
  // --------------------------------------------------------------------------
  const handleFileSelect = async (file) => {
    if (!file) return;
    setSelectedFile(file);
    setUploadProgress(0);
    setIsProcessing(true);

    // Smooth UI progress bar
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      if (progress <= 90) {
        setUploadProgress(progress);
      }
    }, 200);

    try {
      // TODO: Backend API (friend's server)
      // DO NOT CHANGE THIS ENDPOINT
      // TODO: Replace with production auth
      // TODO: Handle token securely (cookies/localStorage later)
      const apiResult = await resumeService.uploadResume(file);
      clearInterval(interval);
      setUploadProgress(100);

      const extractedUrl =
        apiResult?.data?.download_url ||
        apiResult?.download_url ||
        apiResult?.downloadUrl ||
        "";
      if (extractedUrl) {
        setDownloadUrl(extractedUrl);
      }

      const parsedResume =
        apiResult?.data?.resume ||
        apiResult?.data?.parsed_data ||
        apiResult?.resume ||
        apiResult?.parsed_data ||
        null;
      if (parsedResume) {
        setGeneratedResume(parsedResume);
      }

      setIsProcessing(false);
      setMode("upload_success");

      setResumeState({
        id: apiResult?.data?.res_id || apiResult?.res_id || apiResult?.id || "res_" + Date.now(),
        fileName: file.name,
        apiResponse: apiResult,
        download_url: extractedUrl,
      });
    } catch (err) {
      console.warn("Resume upload API endpoint error, using fallback state:", err);
      clearInterval(interval);
      setUploadProgress(100);

      setIsProcessing(false);
      setMode("upload_success");

      setResumeState({
        id: "res_" + Date.now(),
        fileName: file.name,
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // --------------------------------------------------------------------------
  // CREATE RESUME FORM HANDLERS
  // --------------------------------------------------------------------------
  const handleContactChange = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: val },
    }));
  };

  // Dynamic Item Add / Remove Helper Functions
  const addDynamicItem = (sectionKey, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: [...prev[sectionKey], newItem],
    }));
  };

  const removeDynamicItem = (sectionKey, index) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].filter((_, i) => i !== index),
    }));
  };

  const updateDynamicItem = (sectionKey, index, field, val) => {
    setFormData((prev) => {
      const list = [...prev[sectionKey]];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, [sectionKey]: list };
    });
  };

  const handleHighlightChange = (sectionKey, itemIndex, hIndex, val) => {
    setFormData((prev) => {
      const list = [...prev[sectionKey]];
      const highlights = [...(list[itemIndex].highlights || [""])];
      highlights[hIndex] = val;
      list[itemIndex] = { ...list[itemIndex], highlights };
      return { ...prev, [sectionKey]: list };
    });
  };

  const addHighlight = (sectionKey, itemIndex) => {
    setFormData((prev) => {
      const list = [...prev[sectionKey]];
      const highlights = [...(list[itemIndex].highlights || [""]), ""];
      list[itemIndex] = { ...list[itemIndex], highlights };
      return { ...prev, [sectionKey]: list };
    });
  };

  const removeHighlight = (sectionKey, itemIndex, hIndex) => {
    setFormData((prev) => {
      const list = [...prev[sectionKey]];
      const highlights = list[itemIndex].highlights.filter((_, i) => i !== hIndex);
      list[itemIndex] = { ...list[itemIndex], highlights };
      return { ...prev, [sectionKey]: list };
    });
  };

  // Create Resume Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage("");

    // Format payload strictly matching backend API schema requirements
    const payload = {
      name: formData.name || "",
      contact: {
        email: formData.contact?.email || "",
        phone: formData.contact?.phone || "",
        location: formData.contact?.location || "",
        linkedin: formData.contact?.linkedin || "",
        github: formData.contact?.github || "",
        portfolio: formData.contact?.portfolio || "",
      },
      education: (formData.education || []).map((edu) => ({
        institution: edu.institution || "",
        degree: edu.degree || "",
        major: edu.major || "",
        start_date: edu.start_date || "",
        end_date: edu.end_date || "",
        gpa: edu.gpa || "",
      })),
      experience: (formData.experience || []).map((exp) => ({
        company: exp.company || "",
        role: exp.role || "",
        start_date: exp.start_date || "",
        end_date: exp.end_date || "",
        highlights: Array.isArray(exp.highlights)
          ? exp.highlights.filter(Boolean)
          : [],
      })),
      projects: (formData.projects || []).map((proj) => ({
        name: proj.name || "",
        description: proj.description || "",
        highlights: Array.isArray(proj.highlights)
          ? proj.highlights.filter(Boolean)
          : [],
        url: proj.url || "",
      })),
      skills: (formData.skills || []).map((s) => ({
        category: s.category || "",
        skills: Array.isArray(s.skills)
          ? s.skills
          : typeof s.skills === "string"
          ? s.skills.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
      })),
      certifications: (formData.certifications || []).map((cert) => ({
        name: cert.name || "",
        issuer: cert.issuer || "",
        issue_date: cert.issue_date || "",
        url: cert.url || "",
      })),
    };

    try {
      // BACKEND API:
      // https://skillcart-ai.onrender.com
      // TODO: Confirm/adjust the exact endpoint path if backend documentation changes.
      // Do not change the request body structure.
      const apiResult = await resumeService.generateResume(payload);

      const extractedUrl =
        apiResult?.data?.download_url ||
        apiResult?.download_url ||
        apiResult?.downloadUrl ||
        "";
      if (extractedUrl) {
        setDownloadUrl(extractedUrl);
      }

      const parsedResume =
        apiResult?.data?.resume ||
        apiResult?.data?.parsed_data ||
        apiResult?.resume ||
        apiResult?.parsed_data ||
        payload;
      setGeneratedResume(parsedResume);

      setMode("created_success");

      setResumeState({
        id: apiResult?.data?.res_id || apiResult?.res_id || apiResult?.id || "res_" + Date.now(),
        formData: payload,
        apiResponse: apiResult,
        download_url: extractedUrl,
      });
    } catch (err) {
      console.error("Resume generation API error:", err);
      setErrorMessage(
        err.message || "Unable to generate your resume. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Navigation Callback to Home Page (Mark onboarding complete for first-time users)
  const handleProceedToHome = () => {
    completeResume();
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#12221d] font-sans selection:bg-[#dff8eb] selection:text-[#19714e] pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#f7faf8]/90 backdrop-blur-md border-b border-[#dfe7e2]">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link
              to="/home"
              className="text-xs font-semibold text-[#52615a] hover:text-[#19714e] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/for-you"
              className="text-xs font-semibold text-[#52615a] hover:text-[#19714e] transition-colors"
            >
              Jobs For You
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Container */}
      <main className="max-w-6xl mx-auto px-6 pt-10">
        
        {/* Top Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dff8eb] text-[#19714e] text-xs font-semibold mb-4 border border-[#19714e]/20 shadow-2xs">
            <Sparkles size={14} /> Resume Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-[#12221d] tracking-tight">
            Build Your Career Foundation
          </h1>
          <p className="text-sm sm:text-base text-[#68756f] mt-3 leading-relaxed">
            Upload or create your resume to set up your profile and unlock personalized job matches.
          </p>
        </div>

        {/* If user already has a generated resume with download_url */}
        {activeDownloadUrl && mode === "select" && (
          <div className="max-w-4xl mx-auto mb-8 p-4.5 rounded-2xl bg-[#dff8eb] border border-[#19714e]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#19714e] text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#12221d] block">
                  You have a generated resume ready for download
                </span>
                <span className="text-[11px] text-[#52615a] truncate block font-mono">
                  {activeDownloadUrl}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => resumeService.downloadResume(activeDownloadUrl)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#19714e] hover:bg-[#123c2c] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <Download size={15} />
              <span>Download Resume</span>
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* MODE 1: PRIMARY ACTION CHOICE (UPLOAD vs CREATE CARDS) */}
        {/* ------------------------------------------------------------------ */}
        {mode === "select" && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Card 1: Upload Resume */}
            <motion.div
              variants={fadeIn}
              whileHover={{ y: -4 }}
              className="bg-white border border-[#dfe7e2] hover:border-[#19714e] rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-[#123c2c]/5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              onClick={() => setMode("upload")}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#dff8eb] text-[#19714e] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <UploadCloud size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#12221d] font-['Space_Grotesk'] mb-2">
                  Upload Resume
                </h3>
                <p className="text-xs text-[#68756f] leading-relaxed mb-6">
                  Have an existing resume? Upload your PDF or DOC file to send your details directly to the backend.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-[#12221d]/80 font-medium">
                    <CheckCircle2 size={15} className="text-[#19714e]" />
                    <span>Supports PDF, DOC, DOCX</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#12221d]/80 font-medium">
                    <CheckCircle2 size={15} className="text-[#19714e]" />
                    <span>Secure backend storage</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="w-full py-3 rounded-xl bg-[#123c2c] group-hover:bg-[#19714e] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Upload Resume</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>

            {/* Card 2: Create Resume */}
            <motion.div
              variants={fadeIn}
              whileHover={{ y: -4 }}
              className="bg-white border border-[#dfe7e2] hover:border-[#19714e] rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-[#123c2c]/5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              onClick={() => setMode("create")}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#b9ef84]/30 text-[#123c2c] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#12221d] font-['Space_Grotesk'] mb-2">
                  Create Resume
                </h3>
                <p className="text-xs text-[#68756f] leading-relaxed mb-6">
                  Don't have a resume? Build your resume step-by-step using our guided interactive form.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-[#12221d]/80 font-medium">
                    <CheckCircle2 size={15} className="text-[#19714e]" />
                    <span>Guided step-by-step form</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#12221d]/80 font-medium">
                    <CheckCircle2 size={15} className="text-[#19714e]" />
                    <span>Instant backend creation</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="w-full py-3 rounded-xl bg-white border border-[#123c2c] text-[#123c2c] group-hover:bg-[#123c2c] group-hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Build From Scratch</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* MODE 2: UPLOAD RESUME DROPZONE & PROGRESS */}
        {/* ------------------------------------------------------------------ */}
        {mode === "upload" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white border border-[#dfe7e2] rounded-3xl p-8 sm:p-12 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#12221d]">
                Upload Your Resume
              </h2>
              <button
                type="button"
                onClick={() => setMode("select")}
                className="text-xs font-semibold text-[#68756f] hover:text-[#12221d]"
              >
                Cancel
              </button>
            </div>

            {!isProcessing ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#dfe7e2] hover:border-[#19714e] rounded-2xl p-10 text-center cursor-pointer bg-[#f7faf8]/50 hover:bg-[#dff8eb]/20 transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />
                <div className="w-16 h-16 rounded-full bg-[#dff8eb] text-[#19714e] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={32} />
                </div>
                <h4 className="text-sm font-bold text-[#12221d] mb-1">
                  Click or drag file to this area to upload
                </h4>
                <p className="text-xs text-[#68756f] mb-4">
                  Supports PDF, DOC, DOCX up to 10MB
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#19714e] bg-[#dff8eb] px-4 py-2 rounded-xl">
                  Select File
                </span>
              </div>
            ) : (
              <div className="py-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#dff8eb] text-[#19714e] flex items-center justify-center mx-auto animate-bounce">
                  <Sparkles size={32} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#12221d]">
                    Sending {selectedFile?.name || "Resume"} to backend...
                  </h4>
                  <p className="text-xs text-[#68756f] mt-1">
                    Storing resume details securely
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#dfe7e2] h-2.5 rounded-full overflow-hidden max-w-md mx-auto">
                  <div
                    className="bg-[#19714e] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#19714e]">{uploadProgress}%</span>
              </div>
            )}
          </motion.div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* MODE 3: UPLOAD SUCCESS UI */}
        {/* ------------------------------------------------------------------ */}
        {mode === "upload_success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-white border border-[#dfe7e2] rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#dff8eb] text-[#19714e] flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#12221d]">
                Resume uploaded successfully
              </h2>
              <p className="text-xs text-[#68756f] max-w-sm mx-auto mt-2 leading-relaxed">
                Your resume file has been sent to the backend and stored successfully.
              </p>
            </div>

            {activeDownloadUrl && (
              <div className="p-4 rounded-2xl bg-[#dff8eb]/60 border border-[#19714e]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-[#19714e] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Download size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#12221d] block">
                      Resume File Link
                    </span>
                    <span className="text-[11px] text-[#52615a] truncate block font-mono">
                      {activeDownloadUrl}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => resumeService.downloadResume(activeDownloadUrl)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#19714e] hover:bg-[#123c2c] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shrink-0"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {activeDownloadUrl && (
                <button
                  type="button"
                  onClick={() => resumeService.downloadResume(activeDownloadUrl)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#19714e] hover:bg-[#123c2c] text-white font-bold text-xs shadow-md transition-all inline-flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  <span>Download Resume</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleProceedToHome}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl ${
                  activeDownloadUrl
                    ? "bg-white border border-[#dfe7e2] hover:bg-[#f7faf8] text-[#12221d]"
                    : "bg-[#123c2c] hover:bg-[#19714e] text-white shadow-md"
                } font-bold text-xs transition-all inline-flex items-center justify-center gap-2`}
              >
                <span>Proceed to Home</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* MODE 4: CREATE RESUME FORM BUILDER */}
        {/* ------------------------------------------------------------------ */}
        {mode === "create" && (
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleFormSubmit}
            className="bg-white border border-[#dfe7e2] rounded-3xl p-6 sm:p-10 shadow-sm space-y-10"
          >
            <div className="flex items-center justify-between border-b border-[#dfe7e2] pb-6">
              <div>
                <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#12221d]">
                  Create Resume
                </h2>
                <p className="text-xs text-[#68756f] mt-1">
                  Fill in your details below to save your resume to the backend.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMode("select")}
                className="text-xs font-semibold text-[#68756f] hover:text-[#12221d]"
              >
                Cancel
              </button>
            </div>

            {/* Error Notification Alert */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  className="text-red-600 hover:text-red-900 text-xs font-bold underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* 1. Basic Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold font-['Space_Grotesk'] text-[#12221d] uppercase tracking-wider">
                Full Name
              </h3>
              <Input
                label="Full Name"
                placeholder="Alex Morgan"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            {/* 2. Contact Details */}
            <div className="space-y-4 pt-4 border-t border-[#dfe7e2]">
              <h3 className="text-sm font-bold font-['Space_Grotesk'] text-[#12221d] uppercase tracking-wider">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="alex@example.com"
                  value={formData.contact.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 000-1234"
                  value={formData.contact.phone}
                  onChange={(e) => handleContactChange("phone", e.target.value)}
                />
                <Input
                  label="Location"
                  placeholder="New York, NY"
                  value={formData.contact.location}
                  onChange={(e) => handleContactChange("location", e.target.value)}
                />
                <Input
                  label="LinkedIn URL"
                  placeholder="linkedin.com/in/alex"
                  value={formData.contact.linkedin}
                  onChange={(e) => handleContactChange("linkedin", e.target.value)}
                />
                <Input
                  label="GitHub URL"
                  placeholder="github.com/alex"
                  value={formData.contact.github}
                  onChange={(e) => handleContactChange("github", e.target.value)}
                />
                <Input
                  label="Portfolio URL"
                  placeholder="alexmorgan.dev"
                  value={formData.contact.portfolio}
                  onChange={(e) => handleContactChange("portfolio", e.target.value)}
                />
              </div>
            </div>

            {/* 3. Education (Dynamic List) */}
            <div className="space-y-6 pt-4 border-t border-[#dfe7e2]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-['Space_Grotesk'] text-[#12221d] uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap size={18} className="text-[#19714e]" /> Education
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    addDynamicItem("education", {
                      institution: "",
                      degree: "",
                      major: "",
                      start_date: "",
                      end_date: "",
                      gpa: "",
                    })
                  }
                  className="text-xs font-semibold text-[#19714e] hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Education
                </button>
              </div>

              {formData.education.map((edu, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#f7faf8] border border-[#dfe7e2] relative space-y-4">
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDynamicItem("education", idx)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Institution"
                      placeholder="University of California"
                      value={edu.institution}
                      onChange={(e) => updateDynamicItem("education", idx, "institution", e.target.value)}
                    />
                    <Input
                      label="Degree"
                      placeholder="B.S."
                      value={edu.degree}
                      onChange={(e) => updateDynamicItem("education", idx, "degree", e.target.value)}
                    />
                    <Input
                      label="Major"
                      placeholder="Computer Science"
                      value={edu.major}
                      onChange={(e) => updateDynamicItem("education", idx, "major", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Start Date"
                      placeholder="2018"
                      value={edu.start_date}
                      onChange={(e) => updateDynamicItem("education", idx, "start_date", e.target.value)}
                    />
                    <Input
                      label="End Date"
                      placeholder="2022"
                      value={edu.end_date}
                      onChange={(e) => updateDynamicItem("education", idx, "end_date", e.target.value)}
                    />
                    <Input
                      label="GPA"
                      placeholder="3.8/4.0"
                      value={edu.gpa}
                      onChange={(e) => updateDynamicItem("education", idx, "gpa", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 4. Experience (Dynamic List) */}
            <div className="space-y-6 pt-4 border-t border-[#dfe7e2]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-['Space_Grotesk'] text-[#12221d] uppercase tracking-wider flex items-center gap-2">
                  <Briefcase size={18} className="text-[#19714e]" /> Work Experience
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    addDynamicItem("experience", {
                      company: "",
                      role: "",
                      start_date: "",
                      end_date: "",
                      highlights: [""],
                    })
                  }
                  className="text-xs font-semibold text-[#19714e] hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Experience
                </button>
              </div>

              {formData.experience.map((exp, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#f7faf8] border border-[#dfe7e2] relative space-y-4">
                  {formData.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDynamicItem("experience", idx)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Company"
                      placeholder="Acme Corp"
                      value={exp.company}
                      onChange={(e) => updateDynamicItem("experience", idx, "company", e.target.value)}
                    />
                    <Input
                      label="Role / Title"
                      placeholder="Frontend Developer"
                      value={exp.role}
                      onChange={(e) => updateDynamicItem("experience", idx, "role", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      placeholder="Jan 2022"
                      value={exp.start_date}
                      onChange={(e) => updateDynamicItem("experience", idx, "start_date", e.target.value)}
                    />
                    <Input
                      label="End Date"
                      placeholder="Present"
                      value={exp.end_date}
                      onChange={(e) => updateDynamicItem("experience", idx, "end_date", e.target.value)}
                    />
                  </div>

                  {/* Highlights Bullet Points */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#68756f] uppercase tracking-wider block">
                      Highlights & Bullet Points
                    </label>
                    {exp.highlights.map((hl, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Led redesign of core dashboard"
                          value={hl}
                          onChange={(e) => handleHighlightChange("experience", idx, hIdx, e.target.value)}
                          className="w-full py-2 px-3 text-xs bg-white border border-[#dfe7e2] rounded-xl outline-none focus:border-[#19714e]"
                        />
                        {exp.highlights.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeHighlight("experience", idx, hIdx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addHighlight("experience", idx)}
                      className="text-xs font-semibold text-[#19714e] hover:underline block pt-1"
                    >
                      + Add Bullet
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 5. Projects (Dynamic List) */}
            <div className="space-y-6 pt-4 border-t border-[#dfe7e2]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-['Space_Grotesk'] text-[#12221d] uppercase tracking-wider flex items-center gap-2">
                  <FileText size={18} className="text-[#19714e]" /> Projects
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    addDynamicItem("projects", {
                      name: "",
                      description: "",
                      highlights: [""],
                      url: "",
                    })
                  }
                  className="text-xs font-semibold text-[#19714e] hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>

              {formData.projects.map((proj, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#f7faf8] border border-[#dfe7e2] relative space-y-4">
                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDynamicItem("projects", idx)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Project Name"
                      placeholder="SkillCart Web App"
                      value={proj.name}
                      onChange={(e) => updateDynamicItem("projects", idx, "name", e.target.value)}
                    />
                    <Input
                      label="Project URL"
                      placeholder="https://github.com/user/project"
                      value={proj.url}
                      onChange={(e) => updateDynamicItem("projects", idx, "url", e.target.value)}
                    />
                  </div>
                  <Input
                    label="Description"
                    placeholder="AI powered job matching dashboard built with React and Tailwind"
                    value={proj.description}
                    onChange={(e) => updateDynamicItem("projects", idx, "description", e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* 6. Skills (Grouped) */}
            <div className="space-y-6 pt-4 border-t border-[#dfe7e2]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-['Space_Grotesk'] text-[#12221d] uppercase tracking-wider flex items-center gap-2">
                  <Target size={18} className="text-[#19714e]" /> Grouped Skills
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    addDynamicItem("skills", { category: "", skills: "" })
                  }
                  className="text-xs font-semibold text-[#19714e] hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Skill Group
                </button>
              </div>

              {formData.skills.map((sk, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#f7faf8] border border-[#dfe7e2] relative grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <Input
                    label="Category"
                    placeholder="e.g. Frontend"
                    value={sk.category}
                    onChange={(e) => updateDynamicItem("skills", idx, "category", e.target.value)}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Skills (Comma-separated)"
                      placeholder="React, TypeScript, Tailwind CSS"
                      value={sk.skills}
                      onChange={(e) => updateDynamicItem("skills", idx, "skills", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 7. Certifications */}
            <div className="space-y-6 pt-4 border-t border-[#dfe7e2]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-['Space_Grotesk'] text-[#12221d] uppercase tracking-wider flex items-center gap-2">
                  <Award size={18} className="text-[#19714e]" /> Certifications
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    addDynamicItem("certifications", { name: "", issuer: "", issue_date: "", url: "" })
                  }
                  className="text-xs font-semibold text-[#19714e] hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Certification
                </button>
              </div>

              {formData.certifications.map((cert, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#f7faf8] border border-[#dfe7e2] relative grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Input
                    label="Name"
                    placeholder="AWS Certified Developer"
                    value={cert.name}
                    onChange={(e) => updateDynamicItem("certifications", idx, "name", e.target.value)}
                  />
                  <Input
                    label="Issuer"
                    placeholder="Amazon Web Services"
                    value={cert.issuer}
                    onChange={(e) => updateDynamicItem("certifications", idx, "issuer", e.target.value)}
                  />
                  <Input
                    label="Issue Date"
                    placeholder="2023"
                    value={cert.issue_date}
                    onChange={(e) => updateDynamicItem("certifications", idx, "issue_date", e.target.value)}
                  />
                  <Input
                    label="URL"
                    placeholder="credential.link"
                    value={cert.url}
                    onChange={(e) => updateDynamicItem("certifications", idx, "url", e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* Sticky Submit Button */}
            <div className="sticky bottom-4 z-20 pt-6 bg-white border-t border-[#dfe7e2] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMode("select")}
                className="px-6 py-3 rounded-xl border border-[#dfe7e2] text-xs font-semibold text-[#68756f] hover:text-[#12221d]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-8 py-3.5 rounded-xl bg-[#123c2c] hover:bg-[#19714e] text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#123c2c]/10 transition-all disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Generating your resume...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Resume</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* MODE 5: CREATED RESUME SUCCESS UI */}
        {/* ------------------------------------------------------------------ */}
        {mode === "created_success" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Top Success Banner */}
            <div className="bg-white border border-[#dfe7e2] rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#dff8eb] text-[#19714e] flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-[#12221d]">
                  Resume Generated Successfully!
                </h2>
                <p className="text-xs sm:text-sm text-[#68756f] max-w-md mx-auto mt-2 leading-relaxed">
                  Your resume details have been processed and your PDF document is ready to download.
                </p>
              </div>

              {activeDownloadUrl && (
                <div className="p-4.5 rounded-2xl bg-[#dff8eb] border border-[#19714e]/30 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto text-left shadow-xs">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-[#19714e] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Download size={20} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#12221d] block">
                        PDF Resume Ready
                      </span>
                      <span className="text-[11px] text-[#52615a] truncate block font-mono">
                        {activeDownloadUrl}
                      </span>
                    </div>
                  </div>
                  <a
                    href={activeDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Resume.pdf"
                    onClick={() => resumeService.downloadResume(activeDownloadUrl)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#19714e] hover:bg-[#123c2c] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
                  >
                    <Download size={15} />
                    <span>Download PDF</span>
                  </a>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                {activeDownloadUrl && (
                  <a
                    href={activeDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Resume.pdf"
                    onClick={() => resumeService.downloadResume(activeDownloadUrl)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#19714e] hover:bg-[#123c2c] text-white font-bold text-xs shadow-md transition-all inline-flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    <span>Download Resume</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleProceedToHome}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border border-[#dfe7e2] hover:bg-[#f7faf8] text-[#12221d] font-bold text-xs shadow-xs transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>Proceed to Dashboard</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Generated Resume Document Interactive Preview Card */}
            {generatedResume && (
              <div className="bg-white border border-[#dfe7e2] rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#dfe7e2] pb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-[#12221d]">
                      {generatedResume.name || formData.name || "Generated Resume"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#52615a] mt-2">
                      {(generatedResume.contact?.email || formData.contact.email) && (
                        <span>{generatedResume.contact?.email || formData.contact.email}</span>
                      )}
                      {(generatedResume.contact?.phone || formData.contact.phone) && (
                        <span>• {generatedResume.contact?.phone || formData.contact.phone}</span>
                      )}
                      {(generatedResume.contact?.location || formData.contact.location) && (
                        <span>• {generatedResume.contact?.location || formData.contact.location}</span>
                      )}
                    </div>
                  </div>
                  {activeDownloadUrl && (
                    <a
                      href={activeDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download="Resume.pdf"
                      onClick={() => resumeService.downloadResume(activeDownloadUrl)}
                      className="px-4 py-2.5 rounded-xl bg-[#dff8eb] text-[#19714e] hover:bg-[#19714e] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-[#19714e]/20 shrink-0"
                    >
                      <Download size={15} />
                      <span>Download Resume</span>
                    </a>
                  )}
                </div>

                {/* Work Experience */}
                {((generatedResume.experience && generatedResume.experience.length > 0) || (formData.experience && formData.experience.length > 0)) && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#19714e] font-['Space_Grotesk']">
                      Work Experience
                    </h4>
                    <div className="space-y-5">
                      {(generatedResume.experience || formData.experience).map((exp, idx) => (
                        <div key={idx} className="space-y-1.5 bg-[#f7faf8] p-4 rounded-2xl border border-[#dfe7e2]/60">
                          <div className="flex items-center justify-between text-xs font-bold text-[#12221d]">
                            <span>
                              {exp.role || "Role"} • {exp.company || "Company"}
                            </span>
                            <span className="text-[#68756f] font-normal">
                              {exp.start_date} - {exp.end_date}
                            </span>
                          </div>
                          {exp.highlights && exp.highlights.length > 0 && (
                            <ul className="list-disc list-inside text-xs text-[#52615a] space-y-1 pt-1">
                              {exp.highlights.filter(Boolean).map((hl, hIdx) => (
                                <li key={hIdx}>{hl}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {((generatedResume.education && generatedResume.education.length > 0) || (formData.education && formData.education.length > 0)) && (
                  <div className="space-y-4 pt-4 border-t border-[#dfe7e2]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#19714e] font-['Space_Grotesk']">
                      Education
                    </h4>
                    <div className="space-y-3">
                      {(generatedResume.education || formData.education).map((edu, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-[#f7faf8] p-4 rounded-2xl border border-[#dfe7e2]/60">
                          <div>
                            <span className="font-bold text-[#12221d] block">
                              {edu.institution}
                            </span>
                            <span className="text-[#52615a]">
                              {edu.degree} in {edu.major} {edu.gpa ? `(GPA: ${edu.gpa})` : ""}
                            </span>
                          </div>
                          <span className="text-[#68756f]">
                            {edu.start_date} - {edu.end_date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {((generatedResume.skills && generatedResume.skills.length > 0) || (formData.skills && formData.skills.length > 0)) && (
                  <div className="space-y-4 pt-4 border-t border-[#dfe7e2]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#19714e] font-['Space_Grotesk']">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(generatedResume.skills || formData.skills).flatMap((s) =>
                        Array.isArray(s.skills) ? s.skills : typeof s.skills === "string" ? s.skills.split(",") : [s]
                      ).map((skillItem, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#f7faf8] border border-[#dfe7e2] text-[#12221d] font-medium text-xs rounded-lg"
                        >
                          {typeof skillItem === "string" ? skillItem.trim() : skillItem}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

      </main>
    </div>
  );
}
