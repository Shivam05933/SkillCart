/**
 * Resume Service API endpoints.
 * Base URL: http://10.111.57.115:8000
 */

const RESUME_BASE_URL = "http://10.111.57.91:8082";
const GENERATE_RESUME_BASE_URL = "https://skillcart-ai.onrender.com";
const PROXY_RESUME_URL = "/api-proxy/resume-server";

export const resumeService = {
  /**
   * Post resume form data to generate resume details
   * Endpoint: POST https://skillcart-ai.onrender.com/api/v1/resume/generate
   * @param {Object} payload - Candidate resume data
   * @returns {Promise<Object>} API response details containing data.download_url
   */
  // BACKEND API:
  // https://skillcart-ai.onrender.com
  // TODO: Confirm/adjust the exact endpoint path if backend documentation changes.
  // Do not change the request body structure.
  generateResume: async (payload) => {
    const token = localStorage.getItem("token") || (typeof window !== "undefined" ? window.__APP_TOKEN__ : "");
    const validToken = token && token !== "undefined" && token !== "null" && token.trim() !== "";

    const headers = {
      "Content-Type": "application/json",
      ...(validToken ? { Authorization: `Bearer ${token}` } : {}),
    };

    let response;
    try {
      response = await fetch(`${GENERATE_RESUME_BASE_URL}/api/v1/resume/generate`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
    } catch (err) {
      try {
        response = await fetch(`${PROXY_RESUME_URL}/api/v1/resume/generate`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      } catch {
        throw new Error(
          `Unable to connect to resume generation backend (${GENERATE_RESUME_BASE_URL}). Please verify network connectivity and try again.`,
          { cause: err }
        );
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          errorData.error ||
          errorData.detail ||
          `Resume generation request failed with status ${response.status}`
      );
    }

    return response.json();
  },

  /**
   * Upload resume file (PDF / DOC / DOCX)
   * Endpoint: POST http://10.111.57.115:8000/api/v1/resume/upload
   * Appends 'file' and 'resume' form fields for backend compatibility
   * @param {File} file
   * @returns {Promise<Object>} API response details / analysis
   */
  uploadResume: async (file) => {
    // TODO: Backend API (friend's server)
    // DO NOT CHANGE THIS ENDPOINT
    // TODO: Fix token handling properly
    // TODO: Handle token securely (cookies/localStorage later)
    const token = localStorage.getItem("token") || (typeof window !== "undefined" ? window.__APP_TOKEN__ : "");
    const validToken = token && token !== "undefined" && token !== "null" && token.trim() !== "";

    // Build multipart FormData appending both 'file' and 'resume' field keys
    const formData = new FormData();
    formData.append("file", file);
    formData.append("resume", file);

    const headers = {
      ...(validToken ? { Authorization: `Bearer ${token}` } : {}),
    };

    let response;
    let errorDetail = "";

    // 1. Direct attempt to http://10.111.57.115:8000/api/v1/resume/upload
    try {
      response = await fetch(`${RESUME_BASE_URL}/api/v1/resume/upload`, {
        method: "POST",
        headers,
        body: formData,
      });
    } catch (err) {
      errorDetail = err.message;
    }

    // 2. Fallback attempt via local Vite proxy if CORS / network error occurred
    if (!response) {
      try {
        response = await fetch(`${PROXY_RESUME_URL}/api/v1/resume/upload`, {
          method: "POST",
          headers,
          body: formData,
        });
      } catch (err) {
        throw new Error(`Upload failed to connect to ${RESUME_BASE_URL}: ${err.message || errorDetail}`, { cause: err });
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          errorData.error ||
          errorData.detail ||
          `Backend resume upload failed with status ${response.status}`
      );
    }

    return response.json();
  },

  /**
   * Triggers download of generated resume via backend download_url
   * @param {string} downloadUrl - The download link from backend response (e.g. data.download_url)
   * @param {string} [filename] - Default file name for download
   */
  downloadResume: async (downloadUrl, filename = "SkillCart-Resume.pdf") => {
    if (!downloadUrl) {
      console.warn("No download URL provided for resume download.");
      return;
    }

    try {
      const token = localStorage.getItem("token") || (typeof window !== "undefined" ? window.__APP_TOKEN__ : "");
      const validToken = token && token !== "undefined" && token !== "null" && token.trim() !== "";

      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          ...(validToken ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        return;
      }
    } catch (err) {
      console.warn("Blob fetch failed for resume download, using direct download anchor fallback:", err);
    }

    // Direct anchor link click trigger (bypasses CORS restrictions)
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

export default resumeService;
