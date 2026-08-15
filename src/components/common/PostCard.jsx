import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, MessageSquare, Share2, Bookmark, MoreHorizontal } from "lucide-react";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [bookmarked, setBookmarked] = useState(false);

  /**
   * UI-only toggle handler for post likes.
   * TODO: Integrate POST /api/v1/posts/:id/like backend API endpoint
   */
  const handleLikeToggle = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  /**
   * UI-only toggle handler for bookmarks.
   * TODO: Integrate POST /api/v1/posts/:id/bookmark backend API endpoint
   */
  const handleBookmarkToggle = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white border border-[#dfe7e2] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#19714e]/30 transition-colors"
    >
      
      {/* Post Header: Avatar, Author Info, Time & Actions */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs ${
              post.author.avatarBg || "bg-[#123c2c]"
            }`}
          >
            {post.author.initials || "U"}
          </motion.div>

          {/* Author Meta */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-[#12221d] hover:text-[#19714e] cursor-pointer transition-colors">
                {post.author.name}
              </span>
              <span className="text-xs text-[#68756f]">{post.author.handle}</span>
              <span className="text-xs text-[#68756f]">•</span>
              <span className="text-xs text-[#68756f] font-mono">{post.timestamp}</span>
            </div>
            <span className="text-xs text-[#68756f] line-clamp-1 mt-0.5">
              {post.author.role}
            </span>
          </div>
        </div>

        {/* More Options */}
        <button className="text-[#68756f] hover:text-[#12221d] p-1.5 rounded-lg hover:bg-[#f7faf8] transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Post Content */}
      <div className="text-xs sm:text-sm text-[#12221d] leading-relaxed whitespace-pre-line mb-4 font-normal">
        {post.content}
      </div>

      {/* Optional Hashtags / Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <motion.span
              whileHover={{ scale: 1.05 }}
              key={tag}
              className="text-[11px] font-medium text-[#19714e] bg-[#dff8eb] px-2.5 py-0.5 rounded-md hover:bg-[#b9ef84]/40 cursor-pointer transition-colors"
            >
              #{tag}
            </motion.span>
          ))}
        </div>
      )}

      {/* Optional Image Attachment */}
      {post.image && (
        <div className="mb-4 rounded-xl overflow-hidden border border-[#dfe7e2]/70 bg-[#f7faf8] max-h-96">
          <img
            src={post.image}
            alt="Post media attachment"
            className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      {/* Interactions Bar (Like, Comment, Share, Bookmark) */}
      <div className="pt-3 border-t border-[#dfe7e2]/70 flex items-center justify-between text-xs text-[#68756f]">
        
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like Button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleLikeToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-150 ${
              liked
                ? "bg-[#dff8eb] text-[#19714e] font-semibold"
                : "hover:bg-[#f7faf8] hover:text-[#12221d]"
            }`}
          >
            <ThumbsUp
              size={15}
              className={liked ? "fill-[#19714e] text-[#19714e]" : ""}
            />
            <span>{likesCount}</span>
            <span className="hidden sm:inline">Likes</span>
          </motion.button>

          {/* Comment Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              // TODO: Open comment drawer / expand comments from GET /api/v1/posts/:id/comments
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#f7faf8] hover:text-[#12221d] transition-all duration-150"
          >
            <MessageSquare size={15} />
            <span>{post.commentsCount || 0}</span>
            <span className="hidden sm:inline">Comments</span>
          </motion.button>
        </div>

        <div className="flex items-center gap-1">
          {/* Share */}
          <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-xl hover:bg-[#f7faf8] hover:text-[#12221d] transition-colors" title="Share post">
            <Share2 size={15} />
          </motion.button>

          {/* Bookmark */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-xl transition-colors ${
              bookmarked
                ? "text-[#19714e] bg-[#dff8eb]"
                : "hover:bg-[#f7faf8] hover:text-[#12221d]"
            }`}
            title="Save post"
          >
            <Bookmark size={15} className={bookmarked ? "fill-[#19714e]" : ""} />
          </motion.button>
        </div>

      </div>

    </motion.article>
  );
}
