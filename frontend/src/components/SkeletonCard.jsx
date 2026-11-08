
function SkeletonCard() {
  return (
    <div
      className="
        group overflow-hidden rounded-3xl
        bg-[#FFFEFC] dark:bg-[#28221E]
        border border-[#EEE7DF] dark:border-white/5
        shadow-sm
        animate-pulse
      "
      aria-label="Loading recipe"
      role="status"
    >
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F5D8C8]/40 dark:bg-[#3A302A]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skeleton-shimmer" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 h-7 w-20 rounded-full bg-white/60 dark:bg-white/10" />

        {/* Favorite Button */}
        <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/60 dark:bg-white/10" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5">

        {/* Category & Rating */}
        <div className="mb-4 flex items-center justify-between">
          <div className="h-3 w-24 rounded-full bg-[#F5D8C8] dark:bg-[#51453D]" />
          <div className="h-3 w-14 rounded-full bg-[#F5D8C8] dark:bg-[#51453D]" />
        </div>

        {/* Recipe Title */}
        <div className="mb-2 h-6 w-full rounded-lg bg-[#EDE5DC] dark:bg-[#51453D]" />
        <div className="mb-5 h-6 w-2/3 rounded-lg bg-[#EDE5DC] dark:bg-[#51453D]" />

        {/* Description */}
        <div className="mb-2 h-3 w-full rounded-full bg-[#F3EDE6] dark:bg-[#443A33]" />
        <div className="h-3 w-4/5 rounded-full bg-[#F3EDE6] dark:bg-[#443A33]" />

        {/* Divider */}
        <div className="my-5 border-t border-[#EEE7DF] dark:border-white/10" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#F5D8C8] dark:bg-[#51453D]" />
            <div className="h-3 w-16 rounded-full bg-[#EDE5DC] dark:bg-[#51453D]" />
          </div>

          <div className="h-3 w-16 rounded-full bg-[#F5D8C8] dark:bg-[#51453D]" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
