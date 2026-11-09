
function SkeletonCard() {
  return (
    <div
      className="
        group overflow-hidden rounded-[26px]
        bg-white dark:bg-[#193B43]
        border border-[#DCEFF1] dark:border-white/10
        shadow-[0_8px_28px_rgba(36,81,91,0.06)]
        animate-pulse
      "
      aria-label="Loading recipe"
      role="status"
    >
      {/* Image Skeleton */}
      <div className="
        relative aspect-[4/3] overflow-hidden
        bg-[#DDF5F8] dark:bg-[#214A53]
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
            bg-[#B8E8EE] dark:bg-[#38616A]
          " />

          <div className="
            h-3 w-16 rounded-full
            bg-[#F2C7DB] dark:bg-[#76566A]
          " />
        </div>

        {/* Recipe Title */}
        <div className="
          mb-2 h-6 w-full rounded-lg
          bg-[#DCEFF1] dark:bg-[#38616A]
        " />

        <div className="
          mb-5 h-6 w-2/3 rounded-lg
          bg-[#DCEFF1] dark:bg-[#38616A]
        " />

        {/* Description */}
        <div className="
          mb-2 h-3 w-full rounded-full
          bg-[#EAF6F7] dark:bg-[#2B535C]
        " />

        <div className="
          h-3 w-4/5 rounded-full
          bg-[#EAF6F7] dark:bg-[#2B535C]
        " />

        {/* Divider */}
        <div className="
          my-5 border-t
          border-[#DCEFF1] dark:border-white/10
        " />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-2">
            <div className="
              h-9 w-9 rounded-full
              bg-[#B8E8EE] dark:bg-[#38616A]
            " />

            <div className="
              h-3 w-20 rounded-full
              bg-[#DCEFF1] dark:bg-[#38616A]
            " />
          </div>

          <div className="
            h-3 w-16 rounded-full
            bg-[#BFE8C8] dark:bg-[#426C59]
          " />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
