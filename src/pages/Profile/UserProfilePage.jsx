import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowLeft,
  UserCheck,
  UserPlus,
  Loader2,
  AlertCircle,
  FileText,
  Users,
  Calendar,
  Mail,
  Share2,
  Check,
  Sparkles,
  RefreshCw,
  X,
  Plus,
} from "lucide-react";

import AppHeader from "../../components/common/AppHeader";
import PostCard from "../../components/common/PostCard";
import CreatePostModal from "../../components/common/CreatePostModal";
import Skeleton from "../../components/ui/Skeleton";
import authService from "../../services/authService";
import socialService from "../../services/socialService";
import { useAuth } from "../../context/AuthContext";

// Helper to get logged-in user ID
function getCurrentUserId() {
  try {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        const id = userObj?.id || userObj?.userId;
        if (id) return id;
      } catch (e) {}
    }

    const token = localStorage.getItem("token");
    if (!token || typeof token !== "string" || !token.includes(".")) {
      return null;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    return (
      payload?.userId ||
      payload?.id ||
      (payload?.sub && !isNaN(payload?.sub) ? payload?.sub : null) ||
      null
    );
  } catch {
    return null;
  }
}

export default function UserProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const loggedInUserId = getCurrentUserId();

  // Search input state on the page
  const [searchInput, setSearchInput] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  // User & Profile State
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Tab: "posts" | "followers" | "following" | "about"
  const [activeTab, setActiveTab] = useState("posts");

  // Posts State
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsPage, setPostsPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);

  // Follow State
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);

  // Followers & Following Lists
  const [followersList, setFollowersList] = useState([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [subFollowingStates, setSubFollowingStates] = useState({});
  const [subFollowLoading, setSubFollowLoading] = useState({});

  // Share Toast
  const [copiedLink, setCopiedLink] = useState(false);

  // Derive if this is the logged-in user's own profile
  const resolvedUserId = userData?.id || userData?.userId || userData?._id;
  const isMyProfile = Boolean(
    loggedInUserId && resolvedUserId && String(loggedInUserId) === String(resolvedUserId)
  );

  // ============================================================
  // FETCH USER BY USERNAME
  // Endpoint: GET https://skillcart-auth.onrender.com/api/v1/auth/users/{username}
  // ============================================================
  const fetchUserData = useCallback(async () => {
    if (!username || !username.trim()) {
      setError("Please specify a username to search.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUserData(null);
      setProfileData(null);
      setPosts([]);
      setFollowersList([]);
      setFollowingList([]);

      console.log(`[UserProfilePage] Fetching user by username: ${username}`);
      const res = await authService.getUserByUsername(username.trim());
      console.log(`[UserProfilePage] User API Response:`, res);

      // Handle direct or nested responses
      const rawUser = res?.data || res?.user || res;
      if (!rawUser || (typeof rawUser === "object" && Object.keys(rawUser).length === 0)) {
        throw new Error(`User "@${username}" not found.`);
      }

      setUserData(rawUser);

      // Extract user ID
      const uid = rawUser?.id || rawUser?.userId || rawUser?._id;

      // Set fallback counts
      setFollowersCount(Number(rawUser?.followersCount ?? 0));
      setFollowingCount(Number(rawUser?.followingCount ?? 0));
      setPostsCount(Number(rawUser?.postsCount ?? 0));

      if (uid) {
        // Load additional social profile data
        loadSocialProfile(uid, rawUser);
        loadUserPosts(uid);
        loadFollowers(uid);
        loadFollowing(uid);
      }
    } catch (err) {
      console.error("[UserProfilePage] Error fetching user:", err);
      const msg =
        err?.status === 404
          ? `User "@${username}" was not found.`
          : err?.message || "Failed to load user profile.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Load Social Profile
  const loadSocialProfile = async (uid, fallbackUser) => {
    try {
      const socialProf = await socialService.getProfile(uid).catch(() => null);
      if (socialProf) {
        setProfileData(socialProf);
        setFollowersCount(Number(socialProf.followersCount ?? 0));
        setFollowingCount(Number(socialProf.followingCount ?? 0));
        setPostsCount(Number(socialProf.postsCount ?? 0));
        setIsFollowing(Boolean(socialProf.followingByMe));
      }

      // Check following status directly
      const statusRes = await socialService.getFollowingStatus(uid).catch(() => null);
      if (statusRes !== null && statusRes !== undefined) {
        const following =
          typeof statusRes === "boolean"
            ? statusRes
            : statusRes?.following ?? statusRes?.isFollowing ?? false;
        setIsFollowing(Boolean(following));
      }
    } catch (e) {
      console.warn("Could not load social profile stats:", e);
    }
  };

  // Load User Posts
  const loadUserPosts = async (uid, pageNum = 0) => {
    try {
      setPostsLoading(true);
      const postsRes = await socialService.getUserPosts(uid, pageNum, 10).catch(() => null);
      const postItems = Array.isArray(postsRes)
        ? postsRes
        : postsRes?.content || postsRes?.posts || [];

      if (pageNum === 0) {
        setPosts(postItems);
        setPostsPage(0);
      } else {
        setPosts((prev) => [...prev, ...postItems]);
        setPostsPage(pageNum);
      }
      setHasMorePosts(postItems.length >= 10);
      if (pageNum === 0 && postItems.length > 0) {
        setPostsCount((prev) => Math.max(prev, postItems.length));
      }
    } catch (e) {
      console.warn("Failed to load user posts:", e);
    } finally {
      setPostsLoading(false);
    }
  };

  // Load Followers
  const loadFollowers = async (uid) => {
    try {
      setFollowersLoading(true);
      const res = await socialService.getFollowers(uid).catch(() => null);
      const list = Array.isArray(res)
        ? res
        : res?.content || res?.users || res?.followers || [];
      setFollowersList(list);

      const statusMap = {};
      list.forEach((u) => {
        const id = u.id || u.userId;
        if (id) {
          statusMap[id] = Boolean(u.followingByMe || u.isFollowing);
        }
      });
      setSubFollowingStates((prev) => ({ ...prev, ...statusMap }));
    } catch (e) {
      console.warn("Failed to load followers:", e);
    } finally {
      setFollowersLoading(false);
    }
  };

  // Load Following
  const loadFollowing = async (uid) => {
    try {
      setFollowingLoading(true);
      const res = await socialService.getFollowing(uid).catch(() => null);
      const list = Array.isArray(res)
        ? res
        : res?.content || res?.users || res?.following || [];
      setFollowingList(list);

      const statusMap = {};
      list.forEach((u) => {
        const id = u.id || u.userId;
        if (id) {
          statusMap[id] = isMyProfile
            ? true
            : Boolean(u.followingByMe || (u.isFollowing ?? true));
        }
      });
      setSubFollowingStates((prev) => ({ ...prev, ...statusMap }));
    } catch (e) {
      console.warn("Failed to load following list:", e);
    } finally {
      setFollowingLoading(false);
    }
  };

  // Handle load more posts
  const handleLoadMorePosts = async () => {
    if (!resolvedUserId || loadingMorePosts || !hasMorePosts) return;
    try {
      setLoadingMorePosts(true);
      const nextPage = postsPage + 1;
      const postsRes = await socialService.getUserPosts(resolvedUserId, nextPage, 10);
      const postItems = Array.isArray(postsRes)
        ? postsRes
        : postsRes?.content || postsRes?.posts || [];

      if (postItems.length > 0) {
        setPosts((prev) => [...prev, ...postItems]);
        setPostsPage(nextPage);
        setHasMorePosts(postItems.length >= 10);
      } else {
        setHasMorePosts(false);
      }
    } catch (e) {
      setHasMorePosts(false);
    } finally {
      setLoadingMorePosts(false);
    }
  };

  // Toggle Follow for the main profile
  const handleFollowToggle = async () => {
    if (!resolvedUserId || isMyProfile || followLoading) return;

    const previousState = isFollowing;
    const nextState = !isFollowing;

    try {
      setFollowLoading(true);
      setIsFollowing(nextState);
      setFollowersCount((prev) => Math.max(0, prev + (nextState ? 1 : -1)));

      if (previousState) {
        await socialService.unfollowUser(resolvedUserId);
      } else {
        await socialService.followUser(resolvedUserId);
      }
    } catch (err) {
      console.error("Follow action failed:", err);
      // Rollback
      setIsFollowing(previousState);
      setFollowersCount((prev) => Math.max(0, prev + (previousState ? 1 : -1)));
    } finally {
      setFollowLoading(false);
    }
  };

  // Toggle follow for items in followers/following list
  const handleSubUserFollowToggle = async (targetUserId) => {
    if (!targetUserId || subFollowLoading[targetUserId]) return;

    const currentlyFollowing = Boolean(subFollowingStates[targetUserId]);
    const nextState = !currentlyFollowing;

    try {
      setSubFollowLoading((prev) => ({ ...prev, [targetUserId]: true }));
      setSubFollowingStates((prev) => ({ ...prev, [targetUserId]: nextState }));

      if (currentlyFollowing) {
        await socialService.unfollowUser(targetUserId);
      } else {
        await socialService.followUser(targetUserId);
      }
    } catch (err) {
      console.error("Sub follow toggle failed:", err);
      setSubFollowingStates((prev) => ({ ...prev, [targetUserId]: currentlyFollowing }));
    } finally {
      setSubFollowLoading((prev) => ({ ...prev, [targetUserId]: false }));
    }
  };

  // Copy Profile Link
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Search input submit
  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    const clean = searchInput.trim().replace(/^@/, "");
    if (clean) {
      navigate(`/user/${encodeURIComponent(clean)}`);
      setSearchInput("");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Derived user details
  const displayUsername = userData?.username || username || "user";
  const displayName =
    userData?.name ||
    userData?.fullName ||
    userData?.displayName ||
    profileData?.name ||
    displayUsername;
  const userEmail = userData?.email || profileData?.email || null;
  const initial = (displayUsername || displayName || "U").trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#1e2e28] flex flex-col selection:bg-[#b9ef84] selection:text-[#123c2c]">
      {/* APP HEADER */}
      <AppHeader />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TOP SEARCH & NAVIGATION BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
          {/* Back Button */}
          <Link
            to="/home"
            className="
              inline-flex items-center gap-2
              text-xs sm:text-sm font-semibold
              text-[#68756f] hover:text-[#123c2c]
              transition-colors
              w-fit py-1.5 px-3 rounded-xl
              hover:bg-[#dfe7e2]/40
            "
          >
            <ArrowLeft size={16} />
            <span>Back to Feed</span>
          </Link>

          {/* Quick Search Another User */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 max-w-md w-full sm:w-auto"
          >
            <div className="relative flex-1 sm:w-72">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#19714e] font-semibold text-xs">
                @
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search other user..."
                className="
                  w-full pl-8 pr-8 py-2
                  bg-white border border-[#dfe7e2]
                  rounded-2xl text-xs sm:text-sm
                  text-[#123c2c] placeholder:text-[#8d9e96]
                  focus:outline-none focus:border-[#19714e] focus:ring-2 focus:ring-[#19714e]/10
                  transition-all shadow-2xs
                "
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8d9e96] hover:text-[#123c2c]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!searchInput.trim()}
              className="
                px-3.5 py-2
                rounded-2xl bg-[#123c2c] hover:bg-[#19714e]
                disabled:opacity-40 disabled:cursor-not-allowed
                text-white text-xs font-bold
                flex items-center gap-1.5
                transition-all shrink-0 cursor-pointer shadow-2xs
              "
            >
              <Search size={14} />
              <span className="hidden xs:inline">Search</span>
            </button>
          </form>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white border border-[#dfe7e2] rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <Skeleton className="w-24 h-24 rounded-3xl shrink-0" />
                <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                  <Skeleton className="h-6 w-48 mx-auto sm:mx-0 rounded-lg" />
                  <Skeleton className="h-4 w-32 mx-auto sm:mx-0 rounded-lg" />
                  <div className="flex items-center justify-center sm:justify-start gap-4 pt-2">
                    <Skeleton className="h-8 w-20 rounded-xl" />
                    <Skeleton className="h-8 w-20 rounded-xl" />
                    <Skeleton className="h-8 w-20 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-44 w-full rounded-3xl" />
                <Skeleton className="h-44 w-full rounded-3xl" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-3xl" />
              </div>
            </div>
          </div>
        )}

        {/* ERROR / NOT FOUND STATE */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#dfe7e2] rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs"
          >
            <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-xs">
              <AlertCircle size={32} />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#123c2c] mb-2">
              User Not Found
            </h2>

            <p className="text-sm text-[#68756f] mb-6 leading-relaxed">
              {error}
            </p>

            <div className="space-y-3 max-w-sm mx-auto">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Try another username..."
                  className="
                    flex-1 px-4 py-2.5
                    bg-[#f7faf8] border border-[#dfe7e2]
                    rounded-2xl text-xs sm:text-sm
                    text-[#123c2c] placeholder:text-[#8d9e96]
                    focus:outline-none focus:border-[#19714e]
                  "
                />
                <button
                  type="submit"
                  disabled={!searchInput.trim()}
                  className="
                    px-4 py-2.5 rounded-2xl bg-[#123c2c] hover:bg-[#19714e]
                    disabled:opacity-40 text-white text-xs font-bold
                    transition-all shrink-0 cursor-pointer
                  "
                >
                  Search
                </button>
              </form>

              <div className="pt-2">
                <Link
                  to="/home"
                  className="
                    inline-flex items-center justify-center gap-2
                    w-full py-2.5 px-4
                    rounded-2xl border border-[#dfe7e2]
                    text-xs font-bold text-[#123c2c]
                    hover:bg-[#f7faf8] transition-colors
                  "
                >
                  <ArrowLeft size={14} />
                  <span>Return to Home Feed</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUCCESS / PROFILE CONTENT */}
        {!loading && !error && userData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* PROFILE HEADER CARD */}
            <div className="bg-white border border-[#dfe7e2] rounded-3xl p-5 sm:p-8 shadow-xs relative overflow-hidden">
              {/* Background gradient subtle glow */}
              <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-[#dff8eb]/60 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                {/* Avatar & Basic Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#123c2c] to-[#19714e] text-[#b9ef84] text-3xl font-black flex items-center justify-center shadow-md shrink-0 border-2 border-white">
                    {initial}
                  </div>

                  {/* Names & Metadata */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h1 className="text-xl sm:text-2xl font-black text-[#123c2c] tracking-tight truncate">
                        {displayName}
                      </h1>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#dff8eb] text-[#19714e] text-xs font-bold border border-[#b9ef84]/40">
                        @{displayUsername}
                      </span>
                      {isMyProfile && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#123c2c] text-[#b9ef84] text-xs font-bold">
                          You
                        </span>
                      )}
                    </div>

                    {userEmail && (
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#68756f]">
                        <Mail size={13} className="text-[#19714e]" />
                        <span>{userEmail}</span>
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-[#46544e] max-w-lg pt-1">
                      {userData?.bio ||
                        userData?.headline ||
                        "SkillCart Community Member & Professional."}
                    </p>

                    {/* Stats Pills */}
                    <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 pt-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setActiveTab("posts")}
                        className={`
                          px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5
                          ${
                            activeTab === "posts"
                              ? "bg-[#123c2c] text-[#b9ef84]"
                              : "bg-[#f7faf8] text-[#46544e] hover:bg-[#dfe7e2]"
                          }
                        `}
                      >
                        <FileText size={13} />
                        <span>
                          <strong className="font-bold">{postsCount}</strong> Posts
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab("followers")}
                        className={`
                          px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5
                          ${
                            activeTab === "followers"
                              ? "bg-[#123c2c] text-[#b9ef84]"
                              : "bg-[#f7faf8] text-[#46544e] hover:bg-[#dfe7e2]"
                          }
                        `}
                      >
                        <Users size={13} />
                        <span>
                          <strong className="font-bold">{followersCount}</strong> Followers
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab("following")}
                        className={`
                          px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5
                          ${
                            activeTab === "following"
                              ? "bg-[#123c2c] text-[#b9ef84]"
                              : "bg-[#f7faf8] text-[#46544e] hover:bg-[#dfe7e2]"
                          }
                        `}
                      >
                        <UserCheck size={13} />
                        <span>
                          <strong className="font-bold">{followingCount}</strong> Following
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile Actions */}
                <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center w-full md:w-auto pt-2 md:pt-0">
                  {/* Share Link Button */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    title="Copy Profile Link"
                    className="
                      p-2.5 rounded-2xl border border-[#dfe7e2]
                      text-[#123c2c] hover:bg-[#f7faf8]
                      transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 text-xs font-semibold
                    "
                  >
                    {copiedLink ? (
                      <>
                        <Check size={15} className="text-[#19714e]" />
                        <span className="text-[#19714e]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={15} />
                        <span className="hidden sm:inline">Share</span>
                      </>
                    )}
                  </button>

                  {/* Follow Button */}
                  {!isMyProfile && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`
                        px-5 py-2.5 rounded-2xl text-xs font-bold
                        flex items-center gap-2 transition-all cursor-pointer shadow-2xs
                        ${
                          isFollowing
                            ? "bg-[#dff8eb] text-[#19714e] border border-[#19714e]/30 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            : "bg-[#123c2c] hover:bg-[#19714e] text-white"
                        }
                      `}
                    >
                      {followLoading ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : isFollowing ? (
                        <>
                          <UserCheck size={15} />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={15} className="text-[#b9ef84]" />
                          <span>Follow</span>
                        </>
                      )}
                    </motion.button>
                  )}

                  {/* Create Post Modal Trigger if My Profile */}
                  {isMyProfile && (
                    <button
                      type="button"
                      onClick={() => setIsCreatePostOpen(true)}
                      className="
                        px-4 py-2.5 rounded-2xl bg-[#123c2c] hover:bg-[#19714e]
                        text-white text-xs font-bold flex items-center gap-1.5
                        transition-all cursor-pointer shadow-2xs
                      "
                    >
                      <Plus size={15} className="text-[#b9ef84]" />
                      <span>Create Post</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex items-center gap-2 border-b border-[#dfe7e2] pb-2 overflow-x-auto">
              {[
                { id: "posts", label: "Posts", count: postsCount, icon: FileText },
                { id: "followers", label: "Followers", count: followersCount, icon: Users },
                { id: "following", label: "Following", count: followingCount, icon: UserCheck },
                { id: "about", label: "About", icon: Calendar },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap
                      ${
                        isActive
                          ? "bg-[#123c2c] text-white shadow-xs"
                          : "text-[#68756f] hover:text-[#123c2c] hover:bg-white"
                      }
                    `}
                  >
                    <Icon size={15} className={isActive ? "text-[#b9ef84]" : ""} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`
                          px-2 py-0.5 rounded-full text-2xs font-bold
                          ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-[#dfe7e2] text-[#46544e]"
                          }
                        `}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT */}
            <div className="pt-2">
              {/* TAB 1: POSTS */}
              {activeTab === "posts" && (
                <div className="space-y-4 max-w-3xl">
                  {postsLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-44 w-full rounded-3xl" />
                      <Skeleton className="h-44 w-full rounded-3xl" />
                    </div>
                  ) : posts.length > 0 ? (
                    <>
                      {posts.map((post) => (
                        <PostCard
                          key={post.id || post._id || Math.random()}
                          post={post}
                          onPostDeleted={(deletedId) =>
                            setPosts((prev) => prev.filter((p) => p.id !== deletedId))
                          }
                          onFollowToggle={(targetId, followed) => {
                            if (targetId === resolvedUserId) {
                              setIsFollowing(followed);
                            }
                          }}
                        />
                      ))}

                      {hasMorePosts && (
                        <div className="text-center pt-4">
                          <button
                            type="button"
                            onClick={handleLoadMorePosts}
                            disabled={loadingMorePosts}
                            className="
                              px-5 py-2.5 rounded-2xl bg-white border border-[#dfe7e2]
                              hover:bg-[#f7faf8] text-xs font-bold text-[#123c2c]
                              transition-all cursor-pointer shadow-2xs inline-flex items-center gap-2
                            "
                          >
                            {loadingMorePosts ? (
                              <>
                                <Loader2 size={14} className="animate-spin text-[#19714e]" />
                                <span>Loading posts...</span>
                              </>
                            ) : (
                              <span>Load More Posts</span>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-white border border-[#dfe7e2] rounded-3xl p-10 text-center shadow-xs">
                      <div className="w-12 h-12 rounded-2xl bg-[#dff8eb] text-[#19714e] flex items-center justify-center mx-auto mb-3">
                        <FileText size={22} />
                      </div>
                      <h3 className="text-base font-bold text-[#123c2c] mb-1">
                        No Posts Yet
                      </h3>
                      <p className="text-xs text-[#68756f]">
                        @{displayUsername} has not published any posts on SkillCart yet.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: FOLLOWERS */}
              {activeTab === "followers" && (
                <div className="bg-white border border-[#dfe7e2] rounded-3xl p-5 sm:p-6 shadow-xs max-w-3xl">
                  <h3 className="text-sm font-bold text-[#123c2c] mb-4 flex items-center gap-2">
                    <Users size={16} className="text-[#19714e]" />
                    <span>Followers ({followersList.length})</span>
                  </h3>

                  {followersLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-14 w-full rounded-2xl" />
                      <Skeleton className="h-14 w-full rounded-2xl" />
                      <Skeleton className="h-14 w-full rounded-2xl" />
                    </div>
                  ) : followersList.length > 0 ? (
                    <div className="divide-y divide-[#dfe7e2]">
                      {followersList.map((fUser) => {
                        const fid = fUser.id || fUser.userId;
                        const fUsername = fUser.username || fUser.name || "user";
                        const fName = fUser.name || fUser.fullName || fUsername;
                        const fInitial = (fUsername || "U").charAt(0).toUpperCase();
                        const fIsMe = Boolean(
                          loggedInUserId && fid && String(loggedInUserId) === String(fid)
                        );
                        const fIsFollowing = Boolean(subFollowingStates[fid]);

                        return (
                          <div
                            key={fid || Math.random()}
                            className="py-3.5 flex items-center justify-between gap-3"
                          >
                            <Link
                              to={`/user/${encodeURIComponent(fUsername)}`}
                              className="flex items-center gap-3 group min-w-0 flex-1"
                            >
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#123c2c] to-[#19714e] text-[#b9ef84] text-sm font-bold flex items-center justify-center shrink-0">
                                {fInitial}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-[#123c2c] group-hover:text-[#19714e] transition-colors truncate">
                                  {fName}
                                </h4>
                                <p className="text-2xs text-[#68756f] truncate">
                                  @{fUsername}
                                </p>
                              </div>
                            </Link>

                            {!fIsMe && (
                              <button
                                type="button"
                                onClick={() => handleSubUserFollowToggle(fid)}
                                disabled={subFollowLoading[fid]}
                                className={`
                                  px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0
                                  ${
                                    fIsFollowing
                                      ? "bg-[#dff8eb] text-[#19714e] border border-[#19714e]/30"
                                      : "bg-[#123c2c] text-white hover:bg-[#19714e]"
                                  }
                                `}
                              >
                                {subFollowLoading[fid] ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : fIsFollowing ? (
                                  <>
                                    <UserCheck size={13} />
                                    <span>Following</span>
                                  </>
                                ) : (
                                  <>
                                    <UserPlus size={13} />
                                    <span>Follow</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-[#68756f]">
                      No followers yet.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: FOLLOWING */}
              {activeTab === "following" && (
                <div className="bg-white border border-[#dfe7e2] rounded-3xl p-5 sm:p-6 shadow-xs max-w-3xl">
                  <h3 className="text-sm font-bold text-[#123c2c] mb-4 flex items-center gap-2">
                    <UserCheck size={16} className="text-[#19714e]" />
                    <span>Following ({followingList.length})</span>
                  </h3>

                  {followingLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-14 w-full rounded-2xl" />
                      <Skeleton className="h-14 w-full rounded-2xl" />
                      <Skeleton className="h-14 w-full rounded-2xl" />
                    </div>
                  ) : followingList.length > 0 ? (
                    <div className="divide-y divide-[#dfe7e2]">
                      {followingList.map((fUser) => {
                        const fid = fUser.id || fUser.userId;
                        const fUsername = fUser.username || fUser.name || "user";
                        const fName = fUser.name || fUser.fullName || fUsername;
                        const fInitial = (fUsername || "U").charAt(0).toUpperCase();
                        const fIsMe = Boolean(
                          loggedInUserId && fid && String(loggedInUserId) === String(fid)
                        );
                        const fIsFollowing = Boolean(subFollowingStates[fid]);

                        return (
                          <div
                            key={fid || Math.random()}
                            className="py-3.5 flex items-center justify-between gap-3"
                          >
                            <Link
                              to={`/user/${encodeURIComponent(fUsername)}`}
                              className="flex items-center gap-3 group min-w-0 flex-1"
                            >
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#123c2c] to-[#19714e] text-[#b9ef84] text-sm font-bold flex items-center justify-center shrink-0">
                                {fInitial}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-[#123c2c] group-hover:text-[#19714e] transition-colors truncate">
                                  {fName}
                                </h4>
                                <p className="text-2xs text-[#68756f] truncate">
                                  @{fUsername}
                                </p>
                              </div>
                            </Link>

                            {!fIsMe && (
                              <button
                                type="button"
                                onClick={() => handleSubUserFollowToggle(fid)}
                                disabled={subFollowLoading[fid]}
                                className={`
                                  px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0
                                  ${
                                    fIsFollowing
                                      ? "bg-[#dff8eb] text-[#19714e] border border-[#19714e]/30"
                                      : "bg-[#123c2c] text-white hover:bg-[#19714e]"
                                  }
                                `}
                              >
                                {subFollowLoading[fid] ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : fIsFollowing ? (
                                  <>
                                    <UserCheck size={13} />
                                    <span>Following</span>
                                  </>
                                ) : (
                                  <>
                                    <UserPlus size={13} />
                                    <span>Follow</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-[#68756f]">
                      Not following anyone yet.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ABOUT */}
              {activeTab === "about" && (
                <div className="bg-white border border-[#dfe7e2] rounded-3xl p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-[#123c2c] mb-2">
                      About @{displayUsername}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#46544e] leading-relaxed">
                      {userData?.bio ||
                        userData?.about ||
                        "No detailed bio provided yet."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#dfe7e2]">
                    <div className="bg-[#f7faf8] p-4 rounded-2xl border border-[#dfe7e2]">
                      <div className="text-2xs uppercase tracking-wider text-[#68756f] font-bold">
                        Username
                      </div>
                      <div className="text-sm font-bold text-[#123c2c] mt-0.5">
                        @{displayUsername}
                      </div>
                    </div>

                    {userEmail && (
                      <div className="bg-[#f7faf8] p-4 rounded-2xl border border-[#dfe7e2]">
                        <div className="text-2xs uppercase tracking-wider text-[#68756f] font-bold">
                          Contact Email
                        </div>
                        <div className="text-sm font-bold text-[#123c2c] mt-0.5 truncate">
                          {userEmail}
                        </div>
                      </div>
                    )}

                    <div className="bg-[#f7faf8] p-4 rounded-2xl border border-[#dfe7e2]">
                      <div className="text-2xs uppercase tracking-wider text-[#68756f] font-bold">
                        SkillCart Account
                      </div>
                      <div className="text-sm font-bold text-[#19714e] mt-0.5 flex items-center gap-1.5">
                        <Sparkles size={14} />
                        <span>Verified Member</span>
                      </div>
                    </div>

                    <div className="bg-[#f7faf8] p-4 rounded-2xl border border-[#dfe7e2]">
                      <div className="text-2xs uppercase tracking-wider text-[#68756f] font-bold">
                        Total Contributions
                      </div>
                      <div className="text-sm font-bold text-[#123c2c] mt-0.5">
                        {postsCount} Posts published
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* CREATE POST MODAL IF OPENED */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={(newP) => {
          if (newP) {
            setPosts((prev) => [newP, ...prev]);
            setPostsCount((prev) => prev + 1);
          }
        }}
      />
    </div>
  );
}
