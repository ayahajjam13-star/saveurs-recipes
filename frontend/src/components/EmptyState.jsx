
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
    "inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#E88FA5] text-white rounded-full font-semibold text-sm hover:bg-[#d87991] hover:shadow-lg hover:shadow-[#E88FA5]/20 hover:-translate-y-0.5 transition-all duration-300";

  return (
    <div className="relative text-center py-16 sm:py-24 px-5 overflow-hidden animate-fade-in">

      {/* Decorative Background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#E88FA5]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">

        {/* Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-[#E88FA5]/15 rounded-full blur-xl scale-125" />

          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] bg-[#FAF7F0] border border-[#E88FA5]/20 flex items-center justify-center shadow-sm rotate-[-5deg]">
            <div className="text-5xl sm:text-6xl rotate-[5deg]">
              {icon}
            </div>
          </div>

          <div className="absolute -top-2 -right-3 w-9 h-9 rounded-full bg-[#718B68] flex items-center justify-center shadow-md">
            <Sparkles size={16} className="text-white" />
          </div>
        </div>

        {/* Title */}
        {title && (
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1512] mb-4 leading-tight">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-[#8B8179] text-sm sm:text-base leading-7 max-w-md mx-auto mb-8">
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
          <span className="w-8 h-px bg-[#E88FA5]/40" />
          <span className="w-2 h-2 rounded-full bg-[#E88FA5]" />
          <span className="w-8 h-px bg-[#718B68]/40" />
        </div>

      </div>
    </div>
  );
}

export default EmptyState;
