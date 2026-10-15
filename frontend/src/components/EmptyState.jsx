import { Link } from 'react-router-dom';

function EmptyState({ 
  icon = '🤍', 
  title, 
  description, 
  actionLabel, 
  actionLink,
  onAction
}) {
  return (
    <div className="text-center py-20 px-4 animate-fade-in">
      <div className="inline-block mb-6">
        <div className="w-24 h-24 bg-orange-accent/10 rounded-full flex items-center justify-center text-5xl mx-auto">
          {icon}
        </div>
      </div>
      <h3 className="font-serif text-3xl text-warm-brown dark:text-dark-text mb-4">
        {title}
      </h3>
      <p className="text-warm-brown/60 dark:text-dark-text/60 mb-8 text-lg max-w-md mx-auto">
        {description}
      </p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="inline-block px-8 py-4 bg-orange-accent text-white rounded-2xl font-semibold hover:bg-orange-accent/90 transition-all hover:scale-105"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="inline-block px-8 py-4 bg-orange-accent text-white rounded-2xl font-semibold hover:bg-orange-accent/90 transition-all hover:scale-105"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;