import { useState } from "react";
import { Image, Send, Sparkles, Filter } from "lucide-react";
import PostCard from "./PostCard";
import { dummyPosts } from "../../data/dummyPosts";
import { useAuth } from "../../context/AuthContext";

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(dummyPosts);
  const [newPostText, setNewPostText] = useState("");
  const [filterTag, setFilterTag] = useState("All");

  /**
   * Create a new post in local state for demonstration.
   * TODO: Integrate POST /api/v1/posts when backend Spring Boot API is active.
   */
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const createdPost = {
      id: "post_user_" + Date.now(),
      author: {
        name: user?.username || "You",
        handle: `@${(user?.username || "you").toLowerCase().replace(/\s+/g, "")}`,
        role: "SkillCart Member",
        initials: (user?.username || "Y").substring(0, 2).toUpperCase(),
        avatarBg: "bg-[#123c2c]",
      },
      timestamp: "Just now",
      content: newPostText.trim(),
      image: null,
      likesCount: 0,
      commentsCount: 0,
      tags: ["CareerUpdate"],
    };

    setPosts([createdPost, ...posts]);
    setNewPostText("");
  };

  // TODO: Fetch posts dynamically from backend API using useEffect:
  // useEffect(() => {
  //   fetch('/api/v1/posts').then(res => res.json()).then(data => setPosts(data));
  // }, []);

  return (
    <div className="flex flex-col gap-5 w-full">
      
      {/* ── Quick Post Creation Box ── */}
      <div className="bg-white border border-[#dfe7e2] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#123c2c] text-white font-bold text-xs flex items-center justify-center shrink-0">
            {user?.username ? user.username.substring(0, 2).toUpperCase() : "ME"}
          </div>
          <form onSubmit={handleCreatePost} className="flex-1 flex flex-col gap-3">
            <textarea
              rows={2}
              placeholder="Share a career milestone, job search win, or ask the community..."
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="w-full text-xs sm:text-sm text-[#12221d] placeholder-[#68756f]/60 bg-[#f7faf8] border border-[#dfe7e2] rounded-xl p-3 outline-none resize-none focus:border-[#19714e] focus:bg-white transition-all duration-200"
            />
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#dfe7e2]/60">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#68756f] hover:text-[#19714e] hover:bg-[#dff8eb] rounded-lg transition-colors"
                >
                  <Image size={15} />
                  <span className="hidden sm:inline">Media</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#68756f] hover:text-[#19714e] hover:bg-[#dff8eb] rounded-lg transition-colors"
                >
                  <Sparkles size={15} className="text-[#b9ef84]" />
                  <span className="hidden sm:inline">AI Assist</span>
                </button>
              </div>
              <button
                type="submit"
                disabled={!newPostText.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#123c2c] hover:bg-[#19714e] text-white text-xs font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
              >
                <span>Post</span>
                <Send size={13} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Feed Filter Bar ── */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#12221d]">
          <Filter size={14} className="text-[#19714e]" />
          <span>Feed Filter:</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
          {["All", "Trending", "Hiring", "Tips", "Success"].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 shrink-0 ${
                filterTag === tag
                  ? "bg-[#123c2c] text-white"
                  : "bg-white border border-[#dfe7e2] text-[#68756f] hover:text-[#12221d]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Posts List ── */}
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* End of Feed Banner */}
      <div className="py-6 text-center text-xs text-[#68756f] border-t border-[#dfe7e2]/60 mt-2">
        🎉 You are all caught up for today!
      </div>

    </div>
  );
}
