import { Link } from 'react-router-dom';
import './NotFound.css';
import {
  ChefHat,
  Home,
  Search,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
  Leaf,
  MoveUpRight,
  CookingPot,
} from 'lucide-react';

function NotFound() {
  return (
    <main className="not-found-page">

      {/* Background */}
      <div className="nf-bg-circle nf-bg-circle-one" />
      <div className="nf-bg-circle nf-bg-circle-two" />
      <div className="nf-background-dots" />

      <div className="nf-container">

        {/* Top label */}
        <div className="nf-top-label">
          <span className="nf-label-icon">
            <Sparkles size={15} />
          </span>
          <span> A LITTLE DETOUR </span>
          <span className="nf-label-line" />
          <span className="nf-label-number">404</span>
        </div>

        {/* Main content */}
        <div className="nf-main">

          {/* Left content */}
          <div className="nf-content">

            <span className="nf-eyebrow">
              <span />
              WELL, THIS IS UNEXPECTED
            </span>

            <h1>
              Lost in the
              <br />
              <em>recipe book?</em>
            </h1>

            <p className="nf-description">
              It seems this page has gone missing from our kitchen.
              But don't worry, there's always something delicious
              waiting to be discovered.
            </p>

            <div className="nf-error-code">
              <span>ERROR CODE</span>
              <strong>PAGE_NOT_FOUND</strong>
            </div>

            {/* Actions */}
            <div className="nf-actions">

              <Link to="/" className="nf-home-button">
                <Home size={18} />
                <span>Back to Home</span>
                <span className="nf-button-arrow">
                  <ArrowRight size={17} />
                </span>
              </Link>

              <Link to="/search" className="nf-search-button">
                <Search size={18} />
                Explore Recipes
                <MoveUpRight size={15} />
              </Link>

            </div>

            <div className="nf-reassurance">
              <div className="nf-reassurance-icon">
                <ChefHat size={17} />
              </div>
              <span>
                Your next favorite recipe is just one click away.
              </span>
            </div>

          </div>

          {/* Right illustration */}
          <div className="nf-illustration">

            <div className="nf-illustration-glow" />

            {/* Decorative circles */}
            <div className="nf-orbit nf-orbit-one" />
            <div className="nf-orbit nf-orbit-two" />

            {/* Floating decorative elements */}
            <div className="nf-floating-icon nf-float-leaf">
              <Leaf size={25} />
            </div>

            <div className="nf-floating-icon nf-float-chef">
              <ChefHat size={24} />
            </div>

            <div className="nf-floating-number">
              <span>404</span>
              <small>OH NO!</small>
            </div>

            {/* Main plate */}
            <div className="nf-plate-wrapper">

              <div className="nf-plate-shadow" />

              <div className="nf-plate">
                <div className="nf-plate-inner">

                  <div className="nf-plate-food">
                    <div className="nf-food-leaf nf-food-leaf-one" />
                    <div className="nf-food-leaf nf-food-leaf-two" />
                    <div className="nf-food-leaf nf-food-leaf-three" />

                    <div className="nf-food-tomato nf-tomato-one" />
                    <div className="nf-food-tomato nf-tomato-two" />

                    <div className="nf-food-center">
                      <CookingPot size={49} strokeWidth={1.25} />
                      <span>Oops!</span>
                    </div>
                  </div>

                </div>
              </div>

              <div className="nf-plate-decoration">
                <UtensilsCrossed size={22} />
              </div>

            </div>

            {/* Floating mini card */}
            <div className="nf-mini-card">
              <div className="nf-mini-card-icon">
                <Sparkles size={17} />
              </div>

              <div>
                <strong>Still hungry?</strong>
                <span>Let's find something tasty.</span>
              </div>
            </div>

            {/* Small decorations */}
            <span className="nf-decoration-dot nf-dot-one" />
            <span className="nf-decoration-dot nf-dot-two" />
            <span className="nf-decoration-star">✳</span>

          </div>

        </div>

        {/* Bottom footer */}
        <div className="nf-bottom">

          <div className="nf-bottom-brand">
            <ChefHat size={18} />
            <span>SAVEURS</span>
          </div>

          <div className="nf-bottom-message">
            <span>GOOD FOOD</span>
            <span className="nf-bottom-dot" />
            <span>GOOD MOOD</span>
            <span className="nf-bottom-dot" />
            <span>GOOD MEMORIES</span>
          </div>

          <span className="nf-bottom-code">404 / 2026</span>

        </div>

      </div>
    </main>
  );
}

export default NotFound;