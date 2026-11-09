import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AIChef.css';
import {
  Send,
  ArrowLeft,
  ChefHat,
  Sparkles,
  Leaf,
  Clock3,
  Salad,
  RotateCcw,
  MessageCircle,
  CookingPot,
  Utensils,
  Plus,
  Heart,
  WandSparkles,
} from 'lucide-react';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const suggestions = [
  {
    icon: Leaf,
    title: 'Cook with my ingredients',
    description: 'Discover recipes using what you have.',
    text: 'I have tomatoes, eggs and cheese. What can I cook?',
    color: 'mint',
  },
  {
    icon: Clock3,
    title: 'Quick meals',
    description: 'Delicious ideas in just 15 minutes.',
    text: 'Give me a delicious 15-minute recipe.',
    color: 'aqua',
  },
  {
    icon: Salad,
    title: 'Healthy inspiration',
    description: 'Fresh and balanced meal ideas.',
    text: 'Suggest a healthy and delicious dinner.',
    color: 'pink',
  }
];

function AIChef() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hello! Welcome to your personal kitchen assistant.\n\nTell me what ingredients you have, what you feel like eating, or how much time you have. I'll help you find something delicious."
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  }, [messages, loading]);

  const handleSend = async (e, customMessage) => {
    e?.preventDefault();

    const userMsg = (customMessage || input).trim();

    if (!userMsg || loading) return;

    setMessages(prev => [
      ...prev,
      { role: 'user', text: userMsg }
    ]);

    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMsg
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: data.reply || data.error || "Sorry, I couldn't prepare an answer."
        }
      ]);
    } catch (err) {
      console.error('AI Chef error:', err);

      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: 'I am having trouble connecting to the kitchen right now. Please check your connection and try again.'
        }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    if (loading) return;

    setMessages([
      {
        role: 'ai',
        text: "Welcome back! What would you like to cook today? Tell me your ingredients and let's create something delicious."
      }
    ]);

    setInput('');
    inputRef.current?.focus();
  };

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <div className="ai-chef-page">

      {/* Header */}
      <header className="ai-header">
        <div className="ai-header-inner">

          <div className="ai-brand">
            <Link
              to="/"
              aria-label="Back to home"
              className="ai-back-button"
            >
              <ArrowLeft size={19} />
            </Link>

            <div className="ai-brand-icon">
              <ChefHat size={23} />
            </div>

            <div className="ai-brand-info">
              <h1>
                Saveurs <span>AI</span>
              </h1>

              <div className="ai-brand-status">
                <span className="ai-status-dot" />
                YOUR PERSONAL COOKING ASSISTANT
              </div>
            </div>
          </div>

          <button
            onClick={clearChat}
            disabled={loading}
            title="Start a new conversation"
            className="ai-new-chat"
          >
            <RotateCcw size={15} />
            <span className="ai-new-chat-desktop">New conversation</span>
            <span className="ai-new-chat-mobile">New</span>
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="ai-main">

        {/* Hero */}
        <section className="ai-hero">

          <div className="ai-hero-decoration ai-decoration-one" />
          <div className="ai-hero-decoration ai-decoration-two" />
          <div className="ai-hero-decoration ai-decoration-three" />

          <div className="ai-hero-content">

            <div className="ai-hero-eyebrow">
              <Sparkles size={14} />
              YOUR CREATIVE KITCHEN
            </div>

            <h2>
              Meet your new
              <br />
              <span>favorite chef.</span>
            </h2>

            <p>
              From the ingredients in your fridge to your next favorite meal,
              let's make cooking simple, creative and delicious.
            </p>

            <div className="ai-hero-features">
              <span>
                <Leaf size={15} />
                Personalized ideas
              </span>

              <span>
                <Clock3 size={15} />
                Quick recipes
              </span>
            </div>

          </div>

          <div className="ai-hero-illustration">

            <div className="ai-illustration-ring ai-ring-one" />
            <div className="ai-illustration-ring ai-ring-two" />

            <div className="ai-pot-container">
              <CookingPot size={65} strokeWidth={1.3} />
            </div>

            <div className="ai-floating-sparkle">
              <Sparkles size={20} />
            </div>

            <div className="ai-floating-utensils">
              <Utensils size={19} />
            </div>

            <div className="ai-floating-heart">
              <Heart size={17} fill="currentColor" />
            </div>

          </div>

          <div className="ai-hero-bottom">
            <WandSparkles size={15} />
            A LITTLE CREATIVITY, A LOT OF FLAVOR
          </div>

        </section>

        {/* Introduction */}
        <section className="ai-intro">

          <span className="ai-section-label">
            LET'S GET CREATIVE
          </span>

          <h3>What are we cooking today?</h3>

          <p>
            Ask anything about cooking, share your ingredients or discover a new recipe.
          </p>

        </section>

        {/* Suggestions */}
        {showSuggestions && (
          <div className="ai-suggestions">

            {suggestions.map(({ icon: Icon, title, description, text, color }) => (
              <button
                key={title}
                type="button"
                onClick={() => handleSend(null, text)}
                className={`ai-suggestion-card suggestion-${color}`}
              >
                <div className="ai-suggestion-icon">
                  <Icon size={21} strokeWidth={1.8} />
                </div>

                <div className="ai-suggestion-content">
                  <h4>{title}</h4>
                  <p>{description}</p>
                </div>

                <div className="ai-suggestion-arrow">
                  <Plus size={17} />
                </div>
              </button>
            ))}

          </div>
        )}

        {/* Chat */}
        <section className="ai-chat">

          {/* Chat heading */}
          <div className="ai-chat-header">

            <div className="ai-chat-heading-left">

              <div className="ai-chat-heading-icon">
                <MessageCircle size={20} />
              </div>

              <div>
                <h4>Your kitchen conversation</h4>
                <p>Ask, explore and get inspired</p>
              </div>

            </div>

            <span className="ai-chat-badge">
              <Sparkles size={12} />
              AI ASSISTANT
            </span>

          </div>

          {/* Messages */}
          <div className="ai-messages">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`ai-message-row ${
                  msg.role === 'user' ? 'user-message-row' : 'assistant-message-row'
                }`}
              >

                {msg.role === 'ai' && (
                  <div className="ai-message-avatar">
                    <ChefHat size={19} />
                  </div>
                )}

                <div
                  className={`ai-message-bubble ${
                    msg.role === 'user' ? 'user-bubble' : 'assistant-bubble'
                  }`}
                >

                  {msg.role === 'ai' && (
                    <div className="ai-message-label">
                      <Sparkles size={12} />
                      SAVEURS CHEF
                    </div>
                  )}

                  <p>{msg.text}</p>

                </div>

              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="ai-message-row assistant-message-row">

                <div className="ai-message-avatar">
                  <ChefHat size={19} />
                </div>

                <div className="ai-message-bubble assistant-bubble ai-loading-bubble">

                  <span>Preparing something delicious</span>

                  <div className="ai-loading-dots">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>

                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Input */}
          <div className="ai-input-area">

            <form
              onSubmit={handleSend}
              className="ai-input-form"
            >

              <div className="ai-input-plus">
                <Plus size={20} />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Tell me what ingredients you have..."
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="ai-send-button"
              >
                <Send size={18} />
              </button>

            </form>

            <p className="ai-input-footer">
              <Heart size={11} />
              Saveurs AI · Made to inspire your everyday cooking
            </p>

          </div>

        </section>

      </main>
    </div>
  );
}

export default AIChef;