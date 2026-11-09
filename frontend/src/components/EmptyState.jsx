
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
    "inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#24515B] text-white rounded-full font-semibold text-sm hover:bg-[#347382] hover:shadow-lg hover:shadow-[#24515B]/15 hover:-translate-y-0.5 transition-all duration-300";

  return (
    <div className="relative text-center py-16 sm:py-24 px-5 overflow-hidden animate-fade-in">

      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#7ADDF2]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-10 right-[15%] w-20 h-20 bg-[#F2C7DB]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="absolute bottom-10 left-[15%] w-24 h-24 bg-[#CBB7F5]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">

        {/* Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">

          <div className="absolute inset-0 bg-[#7ADDF2]/25 rounded-[2.5rem] blur-xl scale-125" />

          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[2.2rem] bg-gradient-to-br from-[#B8E8EE] via-[#E9F9FA] to-[#CBB7F5]/60 dark:from-[#24515B] dark:via-[#1D4851] dark:to-[#413657] border border-[#7ADDF2]/50 dark:border-[#416C75] flex items-center justify-center shadow-lg shadow-[#24515B]/5 rotate-[-5deg]">

            <div className="text-5xl sm:text-6xl rotate-[5deg]">
              {icon}
            </div>

          </div>

          <div className="absolute -top-2 -right-3 w-10 h-10 rounded-2xl bg-[#F2C7DB] dark:bg-[#9C6684] flex items-center justify-center shadow-md rotate-12">
            <Sparkles size={17} className="text-[#24515B] dark:text-white" />
          </div>

          <div className="absolute -bottom-2 -left-3 w-7 h-7 rounded-full bg-[#BFE8C8] dark:bg-[#477C62] border-4 border-white dark:border-[#173B43]" />

        </div>

        {/* Title */}
        {title && (
          <h3 className="text-2xl sm:text-3xl font-bold text-[#24515B] dark:text-white mb-4 leading-tight">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-[#668C94] dark:text-[#B8CDD1] text-sm sm:text-base leading-7 max-w-md mx-auto mb-8">
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
          <span className="w-10 h-0.5 rounded-full bg-[#7ADDF2]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#CBB7F5]" />
          <span className="w-2 h-0.5 rounded-full bg-[#F2C7DB]" />
          <span className="w-10 h-0.5 rounded-full bg-[#BFE8C8]" />
        </div>

      </div>
    </div>
  );
}

export default EmptyState;
