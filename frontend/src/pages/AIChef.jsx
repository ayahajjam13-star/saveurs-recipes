
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Plus
} from 'lucide-react';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const suggestions = [
  {
    icon: Leaf,
    title: 'Cook with my ingredients',
    description: 'Discover recipes using what you have.',
    text: 'I have tomatoes, eggs and cheese. What can I cook?'
  },
  {
    icon: Clock3,
    title: 'Quick meals',
    description: 'Delicious ideas in just 15 minutes.',
    text: 'Give me a delicious 15-minute recipe.'
  },
  {
    icon: Salad,
    title: 'Healthy inspiration',
    description: 'Fresh and balanced meal ideas.',
    text: 'Suggest a healthy and delicious dinner.'
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
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#28221E]">

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#EEE7DF] bg-[#FFFEFC]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">
            <Link
              to="/"
              aria-label="Back to home"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EEE7DF] bg-white text-[#51453D] transition-all hover:border-[#E88FA5] hover:bg-[#E88FA5]/10 hover:text-[#D77F96]"
            >
              <ArrowLeft size={19} />
            </Link>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#718B68] text-white shadow-sm">
              <ChefHat size={23} strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-[#28221E] sm:text-2xl">
                Saveurs <span className="font-normal text-[#E88FA5]">AI</span>
              </h1>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#718B68]" />
                <span className="text-[11px] font-medium tracking-wide text-[#8B8179]">
                  YOUR PERSONAL COOKING ASSISTANT
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={clearChat}
            disabled={loading}
            title="Start a new conversation"
            className="flex items-center gap-2 rounded-full border border-[#EEE7DF] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#51453D] transition-all hover:border-[#E88FA5] hover:text-[#D77F96] disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:inline">New conversation</span>
            <span className="sm:hidden">New</span>
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-7 sm:px-6 sm:py-10 lg:px-8">

        {/* Hero */}
        <section className="relative mb-8 overflow-hidden rounded-[28px] bg-[#718B68] px-6 py-8 text-white shadow-[0_15px_45px_rgba(113,139,104,0.15)] sm:px-10 sm:py-10">

          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-5 -top-12 h-52 w-52 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

          <div className="relative flex items-center justify-between gap-6">

            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[10px] font-bold tracking-[0.2em] text-white/90 sm:text-xs">
                <Sparkles size={14} />
                YOUR CREATIVE KITCHEN
              </div>

              <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Meet your new
                <br />
                <span className="italic text-[#F5D8C8]">favorite chef.</span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
                From the ingredients in your fridge to your next favorite meal,
                let's make cooking simple, creative and delicious.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-white/80">
                <span className="flex items-center gap-2">
                  <Leaf size={15} />
                  Personalized ideas
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 size={15} />
                  Quick recipes
                </span>
              </div>
            </div>

            {/* Decorative cooking illustration made with icons */}
            <div className="relative hidden h-40 w-40 shrink-0 items-center justify-center sm:flex lg:h-48 lg:w-48">
              <div className="absolute inset-0 rounded-full border border-white/20" />
              <div className="absolute inset-4 rounded-full border border-white/20" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-[32px] bg-[#FFFEFC] text-[#718B68] shadow-2xl shadow-black/10 lg:h-32 lg:w-32">
                <CookingPot size={62} strokeWidth={1.3} />
              </div>

              <div className="absolute right-0 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E88FA5] text-white shadow-lg">
                <Sparkles size={20} />
              </div>

              <div className="absolute bottom-2 left-0 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5D8C8] text-[#718B68] shadow-lg">
                <Utensils size={18} />
              </div>
            </div>

          </div>
        </section>

        {/* Section heading */}
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-2 text-[10px] font-bold tracking-[0.25em] text-[#E88FA5]">
            LET'S GET CREATIVE
          </span>

          <h3 className="font-serif text-2xl font-bold text-[#28221E] sm:text-3xl">
            What are we cooking today?
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-[#8B8179]">
            Ask anything about cooking, share your ingredients or discover a new recipe.
          </p>
        </div>

        {/* Suggestions */}
        {showSuggestions && (
          <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">

            {suggestions.map(({ icon: Icon, title, description, text }) => (
              <button
                key={title}
                type="button"
                onClick={() => handleSend(null, text)}
                className="group flex items-start gap-4 rounded-2xl border border-[#EEE7DF] bg-[#FFFEFC] p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#E88FA5]/60 hover:shadow-[0_12px_30px_rgba(40,34,30,0.06)] sm:p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5D8C8]/50 text-[#718B68] transition-colors group-hover:bg-[#E88FA5]/15 group-hover:text-[#D77F96]">
                  <Icon size={21} strokeWidth={1.7} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#28221E]">
                    {title}
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-[#8B8179]">
                    {description}
                  </p>
                </div>
              </button>
            ))}

          </div>
        )}

        {/* Chat container */}
        <section className="flex min-h-[360px] flex-1 flex-col overflow-hidden rounded-[26px] border border-[#EEE7DF] bg-[#FFFEFC] shadow-[0_8px_35px_rgba(40,34,30,0.04)]">

          {/* Chat heading */}
          <div className="flex items-center justify-between border-b border-[#EEE7DF] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#718B68]/10 text-[#718B68]">
                <MessageCircle size={19} />
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#28221E]">
                  Your kitchen conversation
                </h4>
                <p className="mt-0.5 text-[11px] text-[#8B8179]">
                  Ask, explore and get inspired
                </p>
              </div>
            </div>

            <span className="hidden rounded-full bg-[#718B68]/10 px-3 py-1.5 text-[10px] font-bold tracking-wide text-[#718B68] sm:inline-flex">
              AI ASSISTANT
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-3 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >

                {msg.role === 'ai' && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#718B68] text-white shadow-sm">
                    <ChefHat size={18} />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-4 sm:max-w-[75%] sm:px-5 ${
                    msg.role === 'user'
                      ? 'rounded-br-md bg-[#718B68] text-white'
                      : 'rounded-bl-md border border-[#EEE7DF] bg-[#FAF7F0] text-[#28221E]'
                  }`}
                >
                  {msg.role === 'ai' && (
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-[#718B68]">
                      <Sparkles size={12} />
                      SAVEURS CHEF
                    </div>
                  )}

                  <p className="whitespace-pre-line text-sm leading-7 sm:text-[15px]">
                    {msg.text}
                  </p>
                </div>

              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-end gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#718B68] text-white">
                  <ChefHat size={18} />
                </div>

                <div className="rounded-2xl rounded-bl-md border border-[#EEE7DF] bg-[#FAF7F0] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-[#8B8179]">
                      Preparing something delicious
                    </span>

                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#E88FA5]"
                          style={{
                            animationDelay: `${i * 0.15}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Chat input */}
          <div className="border-t border-[#EEE7DF] bg-[#FFFEFC] p-4 sm:p-5">

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 rounded-2xl border border-[#EEE7DF] bg-[#FAF7F0] p-2 transition-all focus-within:border-[#E88FA5] focus-within:ring-4 focus-within:ring-[#E88FA5]/10"
            >
              <div className="hidden h-10 w-10 items-center justify-center text-[#A49A91] sm:flex">
                <Plus size={20} />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Tell me what ingredients you have..."
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-[#28221E] outline-none placeholder:text-[#A49A91] disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E88FA5] text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#D77F96] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                <Send size={18} />
              </button>
            </form>

            <p className="mt-3 text-center text-[10px] tracking-wide text-[#A49A91]">
              Saveurs AI · Made to inspire your everyday cooking
            </p>

          </div>
        </section>

      </main>
    </div>
  );
}

export default AIChef;
