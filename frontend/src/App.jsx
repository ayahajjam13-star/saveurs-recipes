import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Profile from './pages/Profile';
import MealPlanner from './pages/MealPlanner';
import ShoppingList from './pages/ShoppingList';
import Stats from './pages/Stats';
import AuthCallback from './pages/AuthCallback';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import AIChatbot from './components/AIChatbot';
import VerifyEmailBanner from './components/VerifyEmailBanner';
import PublicProfile from './pages/PublicProfile';
import AIChef from './pages/AIChef';

function App() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register', '/ai-chef'].includes(location.pathname) || location.pathname.startsWith('/recipe/');

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Navbar (كيبان فـ كل الصفحات ماعدا Login/Register/AIChef) */}
      {!hideNavbar && <Navbar />}
      
      {/* Verify Banner */}
      {!hideNavbar && <VerifyEmailBanner />}
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/recipe/:id" element={<PageTransition><RecipeDetail /></PageTransition>} />
            <Route path="/search" element={<PageTransition><Search /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/favorites" element={<PageTransition><Favorites /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/meal-planner" element={<PageTransition><MealPlanner /></PageTransition>} />
            <Route path="/shopping-list" element={<PageTransition><ShoppingList /></PageTransition>} />
            <Route path="/stats" element={<PageTransition><Stats /></PageTransition>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/verify-email" element={<PageTransition><VerifyEmail /></PageTransition>} />
            <Route path="/user/:id" element={<PublicProfile />} />
            <Route path="/ai-chef" element={<AIChef />} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      
      {/* Footer (كيبان فـ كل الصفحات ماعدا Login/Register/AIChef) */}
      {!hideNavbar && <Footer />}
      
      {/* AI Chatbot (كيبان فـ كل الصفحات ماعدا AIChef) */}
      {location.pathname !== '/ai-chef' && <AIChatbot />}
    </div>
  );
}

export default App;