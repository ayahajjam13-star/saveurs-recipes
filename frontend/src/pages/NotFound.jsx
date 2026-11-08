
import { Link } from 'react-router-dom';
import {
  ChefHat,
  Home,
  Search,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';

function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#FAF7F0] px-4 py-20 transition-colors dark:bg-[#1A1512]">

      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#E88FA5]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#718B68]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-2xl text-center">

        {/* Small label */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E88FA5]/20 bg-[#E88FA5]/10 px-5 py-2 text-sm font-medium text-[#E88FA5]">
          <Sparkles size={16} />
          Oops! Something went wrong
        </div>

        {/* Illustration */}
        <div className="relative mx-auto mb-8 flex h-52 w-52 items-center justify-center sm:h-64 sm:w-64">

          <div className="absolute inset-0 rounded-full bg-[#E88FA5]/10" />
          <div className="absolute inset-5 rounded-full border border-dashed border-[#718B68]/30" />

          <div className="relative flex h-36 w-36 items-center justify-center rounded-[2.5rem] bg-[#F5D8C8] shadow-xl shadow-[#E88FA5]/10 sm:h-44 sm:w-44">
            <ChefHat
              size={90}
              strokeWidth={1.3}
              className="text-[#1A1512] sm:hidden"
            />
            <ChefHat
              size={110}
              strokeWidth={1.3}
              className="hidden text-[#1A1512] sm:block"
            />

            <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#FAF7F0] bg-[#E88FA5] text-white dark:border-[#1A1512]">
              <UtensilsCrossed size={21} />
            </div>
          </div>

          <span className="absolute -left-1 top-8 rotate-[-15deg] text-3xl">
            🍓
          </span>
          <span className="absolute -right-2 bottom-8 rotate-12 text-3xl">
            🥑
          </span>
        </div>

        {/* 404 */}
        <h1 className="mb-2 font-serif text-7xl font-bold tracking-tight text-[#E88FA5] sm:text-9xl">
          404
        </h1>

        <h2 className="mb-4 font-serif text-2xl font-bold text-[#1A1512] dark:text-[#FAF7F0] sm:text-3xl">
          Oops! Page Not Found
        </h2>

        <p className="mx-auto mb-9 max-w-md text-base leading-7 text-[#1A1512]/60 dark:text-[#FAF7F0]/60 sm:text-lg">
          Looks like this recipe is missing! The page you're looking for
          doesn't exist or may have been moved.
        </p>

        {/* Buttons */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E88FA5] px-7 py-4 font-semibold text-white shadow-lg shadow-[#E88FA5]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#dc7e95]"
          >
            <Home size={19} />
            Back to Home
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/search"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#718B68]/25 bg-white px-7 py-4 font-semibold text-[#718B68] transition-all duration-300 hover:-translate-y-1 hover:bg-[#718B68] hover:text-white dark:bg-[#28221E] dark:text-[#F5D8C8] dark:hover:bg-[#718B68]"
          >
            <Search size={19} />
            Search Recipes
          </Link>
        </div>

        {/* Bottom message */}
        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-[#718B68]/70">
          <ChefHat size={17} />
          <span>Don't worry, delicious recipes are waiting for you!</span>
        </div>

      </div>
    </div>
  );
}

export default NotFound;
