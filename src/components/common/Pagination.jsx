import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ offset, limit = 20, currentCount = 0, onPageChange }) {
  const currentPage = Math.floor(offset / limit) + 1;
  const startItem = currentCount > 0 ? offset + 1 : 0;
  const endItem = offset + currentCount;

  const handlePrev = () => {
    if (offset > 0) {
      onPageChange(Math.max(0, offset - limit));
    }
  };

  const handleNext = () => {
    if (currentCount >= limit) {
      onPageChange(offset + limit);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-[#dfe7e2] font-sans">
      
      {/* Range Info */}
      <div className="text-xs text-[#68756f] font-mono">
        {currentCount > 0 ? (
          <span>
            Showing <strong className="text-[#12221d]">{startItem}–{endItem}</strong> jobs (Page {currentPage})
          </span>
        ) : (
          <span>No items to display</span>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={offset <= 0}
          className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-[#dfe7e2] text-[#12221d] hover:bg-[#f7faf8] hover:border-[#19714e]/40 text-xs font-semibold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#dfe7e2] shadow-xs"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        {/* Current Page Badge */}
        <span className="px-3 py-1.5 bg-[#123c2c] text-white text-xs font-bold font-mono rounded-xl">
          {currentPage}
        </span>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentCount < limit}
          className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-[#dfe7e2] text-[#12221d] hover:bg-[#f7faf8] hover:border-[#19714e]/40 text-xs font-semibold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#dfe7e2] shadow-xs"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
