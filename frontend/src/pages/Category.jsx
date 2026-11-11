
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChefHat } from 'lucide-react';

import { getByCategory } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SEO from '../components/SEO';

function Category() {
  const { category } = useParams();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchRecipes = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getByCategory(category);

        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
            ? response.data.data
            : [];

        if (!cancelled) {
          setRecipes(data);
        }
      } catch (err) {
        console.error('Error loading category recipes:', err);

        if (!cancelled) {
          setError('Unable to load recipes. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRecipes();

    return () => {
      cancelled = true;
    };
  }, [category]);

  const categoryName = category?.replace(/%26/g, '&');

  return (
    <>
      <SEO title={`${categoryName} Recipes | Saveurs`} />

      <main className="min-h-screen bg-[#FAF7F0] dark:bg-[#1A1512] px-4 sm:px-8 py-12">

        <div className="max-w-7xl mx-auto">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#398C98] hover:text-[#24515B] font-semibold mb-10 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B8E8EE]/50 text-[#398C98] mb-5">
              <ChefHat size={30} />
            </div>

            <p className="text-[#398C98] uppercase tracking-[3px] text-xs font-bold mb-3">
              Explore our collection
            </p>

            <h1 className="text-4xl sm:text-5xl font-bold text-[#24515B] dark:text-white mb-4">
              {categoryName} Recipes
            </h1>

            <p className="text-[#7A9292] dark:text-gray-400 max-w-xl mx-auto">
              Discover delicious recipes selected especially for you.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-[#B8E8EE] border-t-[#398C98] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#398C98] font-semibold">
                Loading recipes...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-5">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-full bg-[#B8E8EE] text-[#24515B] font-bold"
              >
                Try Again
              </button>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-5">🍽️</p>
              <h2 className="text-2xl font-bold text-[#24515B] dark:text-white mb-3">
                No recipes found
              </h2>
              <p className="text-[#7A9292] mb-6">
                There are no recipes in this category yet.
              </p>
              <Link
                to="/search"
                className="inline-flex px-6 py-3 rounded-full bg-[#B8E8EE] text-[#24515B] font-bold"
              >
                View all recipes
              </Link>
            </div>
          ) : (
            <>
              <p className="text-[#7A9292] dark:text-gray-400 mb-7 font-medium">
                {recipes.length} recipes found
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </>
          )}

        </div>
      </main>
    </>
  );
}

export default Category;
