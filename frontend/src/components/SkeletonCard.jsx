
function SkeletonCard() {
  return (
    <div
      className="
        group overflow-hidden rounded-[18px]
        bg-white dark:bg-[#42251A]
        border border-[#F0E2DD] dark:border-white/10
        shadow-[0_8px_28px_rgba(90,51,37,0.06)]
        animate-pulse
      "
      aria-label="Loading recipe"
      role="status"
    >
      {/* Image Skeleton */}
      <div className="
        relative aspect-[4/3] overflow-hidden
        bg-[#F7E5DE] dark:bg-[#522F22]
      ">
        <div className="
          absolute inset-0
          bg-gradient-to-r
          from-transparent
          via-white/55
          to-transparent
          skeleton-shimmer
        " />

        {/* Category Badge */}
        <div className="
          absolute top-4 left-4
          h-7 w-24 rounded-full
          bg-white/75 dark:bg-white/10
        " />

        {/* Favorite Button */}
        <div className="
          absolute top-4 right-4
          h-10 w-10 rounded-full
          bg-white/75 dark:bg-white/10
        " />

        {/* Image Decoration */}
        <div className="
          absolute bottom-4 left-4
          h-2 w-20 rounded-full
          bg-white/50 dark:bg-white/10
        " />
      </div>

      {/* Content Skeleton */}
      <div className="p-5">

        {/* Category & Rating */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="
            h-3 w-24 rounded-full
            bg-[#EDC7B9] dark:bg-[#694639]
          " />

          <div className="
            h-3 w-16 rounded-full
            bg-[#ECE0CD] dark:bg-[#71685B]
          " />
        </div>

        {/* Recipe Title */}
        <div className="
          mb-2 h-6 w-full rounded-lg
          bg-[#F0E2DD] dark:bg-[#694639]
        " />

        <div className="
          mb-5 h-6 w-2/3 rounded-lg
          bg-[#F0E2DD] dark:bg-[#694639]
        " />

        {/* Description */}
        <div className="
          mb-2 h-3 w-full rounded-full
          bg-[#F7EEEA] dark:bg-[#5B392C]
        " />

        <div className="
          h-3 w-4/5 rounded-full
          bg-[#F7EEEA] dark:bg-[#5B392C]
        " />

        {/* Divider */}
        <div className="
          my-5 border-t
          border-[#F0E2DD] dark:border-white/10
        " />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-2">
            <div className="
              h-9 w-9 rounded-full
              bg-[#EDC7B9] dark:bg-[#694639]
            " />

            <div className="
              h-3 w-20 rounded-full
              bg-[#F0E2DD] dark:bg-[#694639]
            " />
          </div>

          <div className="
            h-3 w-16 rounded-full
            bg-[#EADFC8] dark:bg-[#6B4E43]
          " />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
