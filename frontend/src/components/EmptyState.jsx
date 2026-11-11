
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

function EmptyState({
  icon = '🤍',
  title,
  description,
  actionLabel,
  actionLink,
  onAction
}) {
  const actionClassName =
    "inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#5A3325] text-white rounded-full font-semibold text-sm hover:bg-[#804A36] hover:shadow-lg hover:shadow-[#5A3325]/15 hover:-translate-y-0.5 transition-all duration-300";

  return (
    <div className="relative text-center py-16 sm:py-24 px-5 overflow-hidden animate-fade-in">

      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#EB9D81]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-10 right-[15%] w-20 h-20 bg-[#ECE0CD]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="absolute bottom-10 left-[15%] w-24 h-24 bg-[#E6D6C6]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">

        {/* Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">

          <div className="absolute inset-0 bg-[#EB9D81]/25 rounded-[2.5rem] blur-xl scale-125" />

          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[2.2rem] bg-gradient-to-br from-[#EDC7B9] via-[#FAEEE9] to-[#E6D6C6]/60 dark:from-[#5A3325] dark:via-[#502B1E] dark:to-[#4F463E] border border-[#EB9D81]/50 dark:border-[#744F42] flex items-center justify-center shadow-lg shadow-[#5A3325]/5 rotate-[-5deg]">

            <div className="text-5xl sm:text-6xl rotate-[5deg]">
              {icon}
            </div>

          </div>

          <div className="absolute -top-2 -right-3 w-10 h-10 rounded-2xl bg-[#ECE0CD] dark:bg-[#94856E] flex items-center justify-center shadow-md rotate-12">
            <Sparkles size={17} className="text-[#5A3325] dark:text-white" />
          </div>

          <div className="absolute -bottom-2 -left-3 w-7 h-7 rounded-full bg-[#EADFC8] dark:bg-[#7B5648] border-4 border-white dark:border-[#422318]" />

        </div>

        {/* Title */}
        {title && (
          <h3 className="text-2xl sm:text-3xl font-bold text-[#5A3325] dark:text-white mb-4 leading-tight">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-[#937367] dark:text-[#D0BFB9] text-sm sm:text-base leading-7 max-w-md mx-auto mb-8">
            {description}
          </p>
        )}

        {/* Link Action */}
        {actionLabel && actionLink && (
          <Link
            to={actionLink}
            className={actionClassName}
          >
            {actionLabel}
            <ArrowRight size={17} />
          </Link>
        )}

        {/* Button Action */}
        {actionLabel && onAction && !actionLink && (
          <button
            type="button"
            onClick={onAction}
            className={actionClassName}
          >
            {actionLabel}
            <ArrowRight size={17} />
          </button>
        )}

        {/* Decorative Bottom Detail */}
        <div className="flex items-center justify-center gap-2 mt-10">
          <span className="w-10 h-0.5 rounded-full bg-[#EB9D81]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E6D6C6]" />
          <span className="w-2 h-0.5 rounded-full bg-[#ECE0CD]" />
          <span className="w-10 h-0.5 rounded-full bg-[#EADFC8]" />
        </div>

      </div>
    </div>
  );
}

export default EmptyState;
