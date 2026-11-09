import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ChefHat,
  Leaf,
  Heart,
  Star,
} from 'lucide-react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="saveurs-hero">
      <div className="hero-background" />
      <div className="hero-overlay" />

      <div className="hero-decoration hero-decoration-one" />
      <div className="hero-decoration hero-decoration-two" />
      <div className="hero-decoration hero-decoration-three" />

      <div className="hero-content">
        <div className="hero-eyebrow">
          <Sparkles size={15} />
          <span>COOK</span>
          <i />
          <span>EAT</span>
          <i />
          <span>BE HAPPY</span>
        </div>

        <h1>
          Discover the Art
          <br />
          of <em>Delicious</em> Cooking
        </h1>

        <p className="hero-description">
          Explore beautiful recipes, discover new flavors and bring
          happiness to your table with Saveurs.
        </p>

        <div className="hero-actions">
          <Link to="/search" className="hero-primary">
            Explore Recipes
            <ArrowRight size={18} />
          </Link>

          <Link to="/about" className="hero-secondary">
            Discover Saveurs
          </Link>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-icon">
              <ChefHat size={21} />
            </div>
            <div>
              <strong>120+</strong>
              <span>Recipes</span>
            </div>
          </div>

          <div className="hero-stat-divider" />

          <div className="hero-stat">
            <div className="hero-stat-icon hero-stat-icon-pink">
              <Leaf size={20} />
            </div>
            <div>
              <strong>4</strong>
              <span>Seasons</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-floating-card">
        <div className="hero-floating-icon">
          <Heart size={17} fill="currentColor" />
        </div>
        <div>
          <strong>Made with love</strong>
          <span>For every food lover</span>
        </div>
        <Star className="hero-floating-star" size={17} />
      </div>

      <a href="#home-content" className="hero-scroll">
        <span className="hero-scroll-line" />
        <span>Scroll to discover</span>
        <span className="hero-scroll-line" />
      </a>

      <div className="hero-side-label">
        MADE WITH LOVE
      </div>
    </section>
  );
}