function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm border border-warm-brown/5 dark:border-dark-text/5 animate-pulse">
      <div className="aspect-[4/3] bg-cream dark:bg-dark-bg"></div>
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-3 bg-cream dark:bg-dark-bg rounded w-1/3"></div>
          <div className="h-3 bg-cream dark:bg-dark-bg rounded w-1/4"></div>
        </div>
        <div className="h-5 bg-cream dark:bg-dark-bg rounded w-full"></div>
        <div className="h-5 bg-cream dark:bg-dark-bg rounded w-2/3"></div>
        <div className="pt-4 border-t border-warm-brown/10 dark:border-dark-text/10 flex justify-between">
          <div className="h-3 bg-cream dark:bg-dark-bg rounded w-1/4"></div>
          <div className="h-3 bg-cream dark:bg-dark-bg rounded w-1/6"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;