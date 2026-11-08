import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  return (
    <section className="saveurs-hero">
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <span className="hero-eyebrow">
          COOK <i /> EAT <i /> BE HAPPY
        </span>
        
        <h1>
          Delicious Recipes
          <br />
          for <em>Every</em> Season
        </h1>
        
        <p className="hero-description">
          Discover, cook and share amazing recipes from around the world with Saveurs Recipes.
        </p>
        
        <div className="hero-actions">
          <Link to="/search" className="hero-primary">
            Explore Recipes <span>→</span>
          </Link>
        </div>
        
        <div className="hero-stats">
          <div>
            <strong>120+</strong>
            <span>Recipes</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <span></span>
        Scroll to discover
        <span></span>
      </div>
    </section>
  );
}