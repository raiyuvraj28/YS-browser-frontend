import React, { useContext, useState, useEffect, useRef } from 'react';
import { BrowserContext } from '../context/BrowserContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { 
  ArrowLeft, ArrowRight, RotateCw, Home, Search, Mic, MicOff, Star, 
  Columns, Shield, Sidebar, Settings, ShieldAlert, Sparkles 
} from 'lucide-react';

/**
 * Navbar renders the browser control panel: omnibox, back/forward keys,
 * settings triggers, split screen togglers, and voice inputs.
 */
function Navbar() {
  const {
    tabs,
    activeTabId,
    createTab,
    updateTab,
    toggleSplitScreen,
    isSplitScreen,
    toggleIncognito,
    incognito,
    sidebarOpen,
    setSidebarOpen,
    bookmarks,
    history,
    addBookmark,
    removeBookmark
  } = useContext(BrowserContext);

  const { theme } = useContext(ThemeContext);

  // Active tab state
  const activeTab = tabs.find(t => t.id === activeTabId);

  // Omnibox input state
  const [inputValue, setInputValue] = useState('');
  // Voice search active state
  const [isListening, setIsListening] = useState(false);
  // Live autocomplete search suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestionsRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync omnibox value when active tab changes
  useEffect(() => {
    if (activeTab) {
      // Don't show about:newtab as URL, keep it clean/blank
      setInputValue(activeTab.url === 'about:newtab' ? '' : activeTab.url);
    }
  }, [activeTabId, activeTab?.url]);

  // Handle clicking outside suggestions to close the suggestions dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Generate local autocomplete suggestions based on history, bookmarks, and popular sites
  useEffect(() => {
    if (!inputValue || inputValue.startsWith('about:') || inputValue.startsWith('http://') || inputValue.startsWith('https://')) {
      setSuggestions([]);
      return;
    }

    const popularKeywords = [
      'google', 'youtube', 'github', 'reddit', 'wikipedia', 'chatgpt', 'facebook',
      'twitter', 'instagram', 'gmail', 'google translate', 'google maps', 'weather today',
      'netflix', 'amazon', 'yahoo', 'linkedin', 'spotify'
    ];

    const query = inputValue.toLowerCase().trim();

    // 1. Gather matching history titles & URLs
    const historyMatches = history
      .filter(h => h.title.toLowerCase().includes(query) || h.url.toLowerCase().includes(query))
      .map(h => h.title);

    // 2. Gather matching bookmark titles
    const bookmarkMatches = bookmarks
      .filter(b => b.title.toLowerCase().includes(query) || b.url.toLowerCase().includes(query))
      .map(b => b.title);

    // 3. Gather matching popular website keywords
    const keywordMatches = popularKeywords.filter(k => k.startsWith(query));

    // Merge everything, remove duplicates, and limit to top 5 suggestions
    const combinedSuggestions = Array.from(
      new Set([...keywordMatches, ...historyMatches, ...bookmarkMatches])
    ).slice(0, 5);

    setSuggestions(combinedSuggestions);
  }, [inputValue, history, bookmarks]);

  // Check if current active page is bookmarked
  const isBookmarked = activeTab ? bookmarks.some(b => b.url === activeTab.url) : false;

  // Toggle bookmark for current page
  const handleBookmarkToggle = () => {
    if (!activeTab || activeTab.url === 'about:newtab') return;

    if (isBookmarked) {
      const bookmarkItem = bookmarks.find(b => b.url === activeTab.url);
      if (bookmarkItem) removeBookmark(bookmarkItem._id);
    } else {
      addBookmark(activeTab.title || 'Untitled Page', activeTab.url, activeTab.favicon);
    }
  };

  // Navigate to URL or search Google
  const handleNavigate = (query) => {
    if (!query || !activeTab) return;
    setShowSuggestions(false);

    let targetUrl = query.trim();

    // Check if input is a local browser link
    if (targetUrl.startsWith('about:')) {
      updateTab(activeTabId, { url: targetUrl, title: targetUrl });
      return;
    }

    // Check if it looks like a URL (contains dots, starts with localhost, etc.)
    const isUrlPattern = /^(https?:\/\/)?(localhost|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(\/[^\s]*)?$/i;

    if (isUrlPattern.test(targetUrl)) {
      // Ensure HTTP protocol is prepended if absent
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'http://' + targetUrl;
      }
    } else {
      // Use default search engine prefix from settings or Google
      const savedEngine = localStorage.getItem('ys_search_engine') || 'https://www.google.com/search?q=';
      targetUrl = `${savedEngine}${encodeURIComponent(targetUrl)}`;
    }

    // Find the active <webview> in the DOM and navigate
    const webview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
    if (webview) {
      webview.src = targetUrl;
    } else {
      // Fallback for native tab updates
      updateTab(activeTabId, { url: targetUrl });
    }
  };

  // Nav actions wrapper
  const triggerWebviewMethod = (method) => {
    const webview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
    if (webview && typeof webview[method] === 'function') {
      webview[method]();
    }
  };

  // Voice Search Speech Recognition setup
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this environment. Make sure microphone permissions are granted.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInputValue(speechToText);
      handleNavigate(speechToText);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-3 py-2 bg-[#151923]/60 backdrop-blur-md border-t border-white/5 relative select-none">
      
      {/* 1. Navigation Controls */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        <button
          onClick={() => triggerWebviewMethod('goBack')}
          disabled={!activeTab?.canGoBack}
          title="Back"
          className="hidden sm:flex p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={() => triggerWebviewMethod('goForward')}
          disabled={!activeTab?.canGoForward}
          title="Forward"
          className="hidden sm:flex p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
        >
          <ArrowRight size={16} />
        </button>
        <button
          onClick={() => triggerWebviewMethod('reload')}
          disabled={activeTab?.url === 'about:newtab'}
          title="Reload"
          className="hidden sm:flex p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
        >
          <RotateCw size={16} />
        </button>
        <button
          onClick={() => handleNavigate('about:newtab')}
          title="Home"
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <Home size={16} />
        </button>
      </div>

      {/* 2. Omnibox (URL Bar + Suggestions) */}
      <div ref={suggestionsRef} className="flex-1 relative min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all">
          
          {/* Lock / Security Icon */}
          {activeTab?.url.startsWith('https') ? (
            <Shield size={14} className="text-emerald-400 shrink-0" title="Secure connection" />
          ) : activeTab?.url === 'about:newtab' ? (
            <Sparkles size={14} className="text-cyan-400 shrink-0" />
          ) : (
            <ShieldAlert size={14} className="text-yellow-500 shrink-0" title="Connection not secure" />
          )}

          {/* URL / Search Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleNavigate(inputValue);
              }
            }}
            placeholder="Search Google or type URL"
            className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 min-w-0"
          />

          {/* Voice Search Button */}
          <button
            onClick={startVoiceSearch}
            title="Search with Voice"
            className={`p-1 rounded hover:bg-white/5 cursor-pointer shrink-0 transition-all ${
              isListening ? 'text-red-400 bg-red-500/10 border border-red-500/25 animate-pulse' : 'text-gray-400 hover:text-white'
            }`}
          >
            {isListening ? <MicOff size={13} /> : <Mic size={13} />}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            disabled={!activeTab || activeTab.url === 'about:newtab'}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Page'}
            className={`p-1 rounded hover:bg-white/5 cursor-pointer shrink-0 disabled:opacity-20 ${
              isBookmarked ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400 hover:text-yellow-400'
            }`}
          >
            <Star size={13} />
          </button>
        </div>

        {/* Live Autocomplete suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-11 left-0 right-0 glass-panel bg-[#151923] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-fade-in">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => {
                  setInputValue(suggestion);
                  handleNavigate(suggestion);
                }}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
              >
                <Search size={12} className="text-gray-500" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Utility action toggles */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        
        {/* Split Screen Button */}
        <button
          onClick={toggleSplitScreen}
          title={isSplitScreen ? "Exit Split Screen" : "Split Screen Browsing"}
          className={`hidden sm:flex p-2 rounded-lg transition-all cursor-pointer ${
            isSplitScreen 
              ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' 
              : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Columns size={15} />
        </button>

        {/* Incognito mode toggle */}
        <button
          onClick={toggleIncognito}
          title={incognito ? "Incognito Mode Active" : "Incognito Mode"}
          className={`p-2 rounded-lg transition-all cursor-pointer ${
            incognito 
              ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.15)]' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield size={15} />
        </button>

        {/* Settings button */}
        <button
          onClick={() => createTab('about:settings')}
          title="Browser Settings"
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <Settings size={15} />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
