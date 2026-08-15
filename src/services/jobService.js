import api from "./api";

/**
 * Live Job Service API endpoints.
 * Primary endpoint: https://skillcartcampany-production.up.railway.app/jobs
 */
const DIRECT_RAILWAY_URL = "https://skillcartcampany-production.up.railway.app/jobs";
const PROXY_RAILWAY_URL = "/api-proxy/railway/jobs";

export const jobService = {
  /**
   * Fetch paginated job listings from backend API.
   * Handles CORS fallback via local proxy and extracts payload from `items` field.
   * @param {{ limit?: number, offset?: number }} params
   * @returns {Promise<{ items: Array, total: number, limit: number, offset: number }>}
   */
  getJobs: async ({ limit = 20, offset = 0 } = {}) => {
    // TODO: API CALL — GET /jobs?limit=20&offset=0
    const query = `?limit=${limit}&offset=${offset}`;

    let response;
    try {
      // 1. Attempt direct request
      response = await fetch(`${DIRECT_RAILWAY_URL}${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // 2. Fallback to Vite dev server proxy if browser CORS fails
      response = await fetch(`${PROXY_RAILWAY_URL}${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs (Status ${response.status})`);
    }

    const data = await response.json();

    // Standardize response payload format
    let items = [];
    let total = 0;

    if (Array.isArray(data)) {
      items = data;
      total = data.length;
    } else if (data && Array.isArray(data.items)) {
      items = data.items;
      total = data.total || items.length;
    } else if (data && Array.isArray(data.data)) {
      items = data.data;
      total = data.total || items.length;
    }

    return {
      items,
      total,
      limit,
      offset,
    };
  },

  /**
   * Fetch AI-powered job matches for current user based on resume.
   * Endpoint: GET /api/v1/career/match
   * 1. Calls /api/v1/career/match endpoint
   * 2. Extracts returned array of job IDs
   * 3. Resolves corresponding full job details from the jobs pool to show on flash cards
   */
  getMatchedJobs: async () => {
    // TODO: Backend API (friend's server)
    // DO NOT CHANGE THIS ENDPOINT
    // Endpoint: GET /api/v1/career/match
    const RESUME_BASE_URL = "http://10.111.57.115:8000";
    const PROXY_RESUME_URL = "/api-proxy/resume-server";
    const token = localStorage.getItem("token") || (typeof window !== "undefined" ? window.__APP_TOKEN__ : "");
    const validToken = token && token !== "undefined" && token !== "null" && token.trim() !== "";
    const headers = {
      "Content-Type": "application/json",
      ...(validToken ? { Authorization: `Bearer ${token}` } : {}),
    };

    let matchData = null;

    // Step 1: Call /api/v1/career/match endpoint
    try {
      let response = await fetch(`${RESUME_BASE_URL}/api/v1/career/match`, {
        method: "GET",
        headers,
      }).catch(() => null);

      if (!response || !response.ok) {
        response = await fetch(`${PROXY_RESUME_URL}/api/v1/career/match`, {
          method: "GET",
          headers,
        }).catch(() => null);
      }

      if (!response || !response.ok) {
        response = await fetch(`${RESUME_BASE_URL}/career/match`, {
          method: "GET",
          headers,
        }).catch(() => null);
      }

      if (response && response.ok) {
        matchData = await response.json().catch(() => null);
      }
    } catch (err) {
      console.warn("Error requesting /api/v1/career/match endpoint:", err);
    }

    // Step 2: Fetch all available jobs pool to match IDs against
    const allJobsRes = await jobService.getJobs({ limit: 100 }).catch(() => ({ items: [] }));
    const allJobs = allJobsRes.items || [];

    // Step 3: Process match response (Extract IDs list or job objects)
    if (matchData) {
      let idsList = [];
      let directJobs = [];

      if (Array.isArray(matchData)) {
        if (matchData.length > 0 && typeof matchData[0] === "object" && (matchData[0].title || matchData[0].company || matchData[0].job_title)) {
          directJobs = matchData;
        } else {
          idsList = matchData;
        }
      } else if (matchData && typeof matchData === "object") {
        const rawItems = matchData.matched_jobs || matchData.ids || matchData.job_ids || matchData.jobs || matchData.data || matchData.items || [];
        if (Array.isArray(rawItems)) {
          if (rawItems.length > 0 && typeof rawItems[0] === "object" && (rawItems[0].title || rawItems[0].company || rawItems[0].job_title)) {
            directJobs = rawItems;
          } else {
            idsList = rawItems;
          }
        }
      }

      // If backend returned complete job objects directly
      if (directJobs.length > 0) {
        return directJobs;
      }

      // If backend returned a list of IDs (e.g. [1, 2, 3] or ["id1", "id2"])
      if (idsList.length > 0) {
        const matchedJobs = [];

        for (const rawId of idsList) {
          const targetId = String(rawId && typeof rawId === "object" ? rawId.id || rawId._id || rawId.job_id : rawId);
          const found = allJobs.find(
            (j) => String(j.id) === targetId || String(j._id) === targetId || String(j.job_id) === targetId
          );
          if (found) {
            matchedJobs.push(found);
          }
        }

        if (matchedJobs.length > 0) {
          return matchedJobs;
        }
      }
    }

    // Step 4: Fallback to all jobs if no IDs returned or match endpoint offline
    return allJobs;
  },

  /**
   * Fetch a single job by ID.
   * Endpoint: GET https://skillcartcampany-production.up.railway.app/jobs/:jobId
   * @param {string|number} jobId
   */
  getJobById: async (jobId) => {
    if (!jobId) throw new Error("Job ID is required to fetch full job details");

    let response;
    try {
      // 1. Direct fetch attempt to Railway endpoint
      response = await fetch(`${DIRECT_RAILWAY_URL}/${jobId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // 2. Proxy fallback
      response = await fetch(`${PROXY_RAILWAY_URL}/${jobId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!response || !response.ok) {
      try {
        return await api.get(`/jobs/${jobId}`);
      } catch (err) {
        throw new Error(`Failed to fetch job details for ID ${jobId}: ${err.message}`);
      }
    }

    return await response.json();
  },

  /**
   * Save / bookmark a job.
   * @param {string|number} jobId
   */
  saveJob: (jobId) => api.post(`/jobs/${jobId}/save`, {}),

  /**
   * Remove a saved job.
   * @param {string|number} jobId
   */
  unsaveJob: (jobId) => api.delete(`/jobs/${jobId}/save`),
};

export default jobService;
