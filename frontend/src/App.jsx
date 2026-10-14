import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Favorites from './pages/Favorites';        // ← زيدي هاد السطر
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/favorites" element={<Favorites />} />    {/* ← زيدي هاد السطر */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;