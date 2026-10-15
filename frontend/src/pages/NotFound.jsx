import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-cream dark:bg-dark-bg transition-colors">
      <div className="text-center max-w-lg">
        <p className="text-9xl mb-4">🍽️</p>
        <h1 className="font-serif text-6xl md:text-8xl font-bold text-orange-accent mb-4">
          404
        </h1>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-warm-brown dark:text-dark-text mb-4">
          Page Not Found
        </h2>
        <p className="text-warm-brown/60 dark:text-dark-text/60 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-orange-accent text-white rounded-xl font-medium hover:bg-orange-accent/90 transition-colors"
          >
            🏠 Back Home
          </Link>
          <Link
            to="/search"
            className="px-6 py-3 bg-white dark:bg-dark-card text-warm-brown dark:text-dark-text border border-warm-brown/10 dark:border-dark-text/10 rounded-xl font-medium hover:bg-cream dark:hover:bg-dark-bg transition-colors"
          >
            🔍 Search Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;