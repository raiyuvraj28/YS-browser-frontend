import React, { useContext, useState, useEffect } from 'react';
import { BrowserContext } from '../context/BrowserContext.jsx';
import { Search, Globe, Clock, ArrowRight, Sparkles } from 'lucide-react';

/**
 * CustomNewTab serves as the browser's homepage dashboard.
 * It renders a futuristic clock, greeting, search, speed dials, and database summaries.
 */
function CustomNewTab({ tabId }) {
  const { updateTab } = useContext(BrowserContext);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local widget states
  const [time, setTime] = useState(new Date());
  const [noteCount, setNoteCount] = useState(0);
  const [todoCount, setTodoCount] = useState(0);

  // Sync date & time
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch summaries of user data (notes, tasks) directly from localStorage
  useEffect(() => {
    const loadWidgetSummaries = () => {
      try {
        const savedNotes = localStorage.getItem('ys_notes');
        const notesArr = savedNotes ? JSON.parse(savedNotes) : [];
        setNoteCount(notesArr.length);

        const savedTodos = localStorage.getItem('ys_todos');
        const todosArr = savedTodos ? JSON.parse(savedTodos) : [];
        const pendingCount = todosArr.filter(t => !t.completed).length;
        setTodoCount(pendingCount);
      } catch (err) {
        console.warn('Failed to load widget summaries from local storage.');
      }
    };

    loadWidgetSummaries();

    // Check for updates periodically when landing page remains open
    const interval = setInterval(loadWidgetSummaries, 2000);
    return () => clearInterval(interval);
  }, []);

  // Time-based futuristic greeting
  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'WELCOME BACK, EXPLORER';
    if (hour < 18) return 'SYSTEM STATUS: ACTIVE';
    return 'COSMIC SYSTEM ENGAGED';
  };

  // Speed Dial items with brand color overrides
  const speedDials = [
    { 
      name: 'Google', 
      url: 'https://www.google.com', 
      color: 'hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.25)] hover:bg-blue-500/5',
      iconColor: 'text-blue-400' 
    },
    { 
      name: 'YouTube', 
      url: 'https://www.youtube.com', 
      color: 'hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:bg-red-500/5',
      iconColor: 'text-red-400' 
    },
    { 
      name: 'GitHub', 
      url: 'https://github.com', 
      color: 'hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:bg-purple-500/5',
      iconColor: 'text-purple-400' 
    },
    { 
      name: 'Reddit', 
      url: 'https://www.reddit.com', 
      color: 'hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.25)] hover:bg-orange-500/5',
      iconColor: 'text-orange-400' 
    },
    { 
      name: 'Wikipedia', 
      url: 'https://www.wikipedia.org', 
      color: 'hover:border-gray-400/50 hover:shadow-[0_0_15px_rgba(156,163,175,0.25)] hover:bg-gray-500/5',
      iconColor: 'text-gray-400' 
    },
    { 
      name: 'ChatGPT', 
      url: 'https://chatgpt.com', 
      color: 'hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:bg-emerald-500/5',
      iconColor: 'text-emerald-400' 
    }
  ];

  // Perform search / URL navigation
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    let targetUrl = searchQuery.trim();
    const isUrlPattern = /^(https?:\/\/)?(localhost|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(\/[^\s]*)?$/i;

    if (isUrlPattern.test(targetUrl)) {
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'http://' + targetUrl;
      }
    } else {
      const savedEngine = localStorage.getItem('ys_search_engine') || 'https://www.google.com/search?q=';
      targetUrl = `${savedEngine}${encodeURIComponent(targetUrl)}`;
    }

    // Direct tab to navigate
    updateTab(tabId, { url: targetUrl });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 select-none overflow-y-auto no-scrollbar relative font-sans">
      
      {/* Decorative neon ambient overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none"></div>

      {/* 1. Time & Greeting Panel */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs tracking-[0.3em] uppercase font-bold mb-3">
          <Sparkles size={12} className="text-cyan-400 animate-pulse" />
          <span>{getGreeting()}</span>
        </div>
        
        {/* Beautiful multi-colored gradient clock */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extralight tracking-wider bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(6,182,212,0.2)]">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
        </h1>
        <p className="text-gray-400 text-xs mt-2 tracking-wide font-medium">
          {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* 2. Glassmorphic Central Search Box */}
      <form 
        onSubmit={handleSearchSubmit} 
        className="w-full max-w-xl mb-10 relative z-10 animate-fade-in"
      >
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/40 focus-within:border-cyan-500/60 focus-within:shadow-[0_0_22px_rgba(6,182,212,0.22)] transition-all duration-300">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Explore the web or search anything..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500"
          />
          <button
            type="submit"
            className="p-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:text-white transition-all cursor-pointer"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </form>

      {/* 3. Speed Dial Shortcuts */}
      <div className="w-full max-w-2xl grid grid-cols-3 sm:grid-cols-6 gap-3.5 mb-10 z-10 animate-fade-in">
        {speedDials.map((item, idx) => (
          <button
            key={idx}
            onClick={() => updateTab(tabId, { url: item.url })}
            className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-black/30 border border-white/5 hover:scale-105 transition-all duration-300 group cursor-pointer ${item.color}`}
          >
            <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all ${item.iconColor}`}>
              <Globe size={18} />
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-white font-semibold tracking-wide">{item.name}</span>
          </button>
        ))}
      </div>

      {/* 4. Database Summaries Widgets (Notes & To-dos status) */}
      <div className="w-full max-w-xl grid grid-cols-2 gap-4 z-10 animate-fade-in">
        
        {/* Notes summary widget */}
        <div 
          onClick={() => updateTab(tabId, { url: 'about:newtab' })}
          className="p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:bg-white/5 transition-all duration-300 cursor-pointer"
        >
          <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block mb-1">Local Notepad</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{noteCount}</span>
            <span className="text-xs text-gray-400">saved notes</span>
          </div>
        </div>

        {/* Task list summary widget */}
        <div 
          onClick={() => updateTab(tabId, { url: 'about:newtab' })}
          className="p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:bg-white/5 transition-all duration-300 cursor-pointer"
        >
          <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold block mb-1">Tasks Board</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{todoCount}</span>
            <span className="text-xs text-gray-400">pending tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomNewTab;
