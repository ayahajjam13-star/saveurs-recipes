import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowLeft, ChefHat } from 'lucide-react';

function AIChef() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I am your AI Chef. What ingredients do you have today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
      
      // نستعملو الـ Endpoint الجديد /ai/chat
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      
      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: data.error || "Sorry, I'm having trouble right now." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting to the kitchen right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      
      {/* Header */}
      <div className="bg-white border-b border-[#2C1E16]/10 p-4 flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-[#2C1E16]" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-accent rounded-full flex items-center justify-center text-white">
            <ChefHat size={20} />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#2C1E16] leading-none">AI Chef ✨</h1>
            <p className="text-xs text-[#2C1E16]/60 mt-1">Your personal cooking assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 overflow-y-auto flex flex-col gap-6 py-8">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-10 h-10 bg-orange-accent rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <ChefHat size={20} />
              </div>
            )}
            <div className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-line ${
              msg.role === 'user' 
                ? 'bg-[#2C1E16] text-white rounded-tr-sm shadow-md' 
                : 'bg-white text-[#2C1E16] rounded-tl-sm shadow-sm border border-[#2C1E16]/5'
            }`}>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-10 h-10 bg-orange-accent rounded-full flex items-center justify-center text-white shadow-md">
              <ChefHat size={20} />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-[#2C1E16]/5 flex gap-1 items-center">
              <span className="w-2 h-2 bg-[#2C1E16]/30 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-[#2C1E16]/30 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-2 h-2 bg-[#2C1E16]/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-[#2C1E16]/10 p-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a recipe or tell me what ingredients you have..."
            className="w-full p-4 pr-16 rounded-full border border-[#2C1E16]/10 bg-[#FAF7F0] focus:outline-none focus:ring-2 focus:ring-orange-accent/50 focus:border-orange-accent text-[#2C1E16] transition-all"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 p-2.5 bg-orange-accent text-white rounded-full hover:bg-[#2C1E16] transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

    </div>
  );
}

export default AIChef;