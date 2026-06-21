import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { BrowserContext } from '../context/BrowserContext.jsx';
import { Eye, Shield, Globe, Star, Layout, Database, KeyRound, Lock, Info } from 'lucide-react';

/**
 * SettingsPage renders controls to modify themes, wallpapers, search engines,
 * ad blockers, and vertical/horizontal tab options, saving them directly to localStorage.
 */
function SettingsPage() {
  const { theme, toggleTheme, wallpaper, changeWallpaper } = useContext(ThemeContext);
  const { 
    verticalTabs, 
    toggleVerticalTabs,
    bookmarks,
    history
  } = useContext(BrowserContext);

  // Local settings loaded from localStorage
  const [adBlockerEnabled, setAdBlockerEnabled] = useState(() => {
    return localStorage.getItem('ys_adblock_enabled') !== 'false';
  });
  
  const [searchEngine, setSearchEngine] = useState(() => {
    return localStorage.getItem('ys_search_engine') || 'https://www.google.com/search?q=';
  });


  // Local stats totals
  const [localStats, setLocalStats] = useState({
    bookmarks: 0,
    history: 0,
    passwords: 0
  });

  // Calculate statistics from local storage
  useEffect(() => {
    const savedPasswords = localStorage.getItem('ys_passwords');
    const pwdCount = savedPasswords ? JSON.parse(savedPasswords).length : 0;

    setLocalStats({
      bookmarks: bookmarks.length,
      history: history.length,
      passwords: pwdCount
    });
  }, [bookmarks, history]);

  // Handle setting updates
  const handleToggleAdBlock = () => {
    const newVal = !adBlockerEnabled;
    setAdBlockerEnabled(newVal);
    localStorage.setItem('ys_adblock_enabled', String(newVal));
  };

  const handleSearchEngineChange = (e) => {
    const val = e.target.value;
    setSearchEngine(val);
    localStorage.setItem('ys_search_engine', val);
  };


  const wallpapers = [
    { id: 'neon-cyber', name: 'Cyberpunk Grid', desc: 'Dark theme with cyan neon grid lines' },
    { id: 'aurora-borealis', name: 'Aurora Borealis', desc: 'Soft gradient waves of green & blue' },
    { id: 'deep-space', name: 'Deep Space', desc: 'Mysterious nebula with stellar gradients' },
    { id: 'glass-frost', name: 'Glass Frost', desc: 'Soft pastel background' }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#151923]/60 backdrop-blur-md p-6 select-none overflow-y-auto no-scrollbar animate-fade-in font-sans">
      
      {/* 1. Page Header */}
      <div className="border-b border-white/5 pb-4 mb-6">
        <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
          <span>Browser Settings</span>
        </h1>
        <p className="text-xs text-gray-400">Configure search tools, wallpapers, local storage parameters, and layouts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Browser Settings Inputs */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          
          {/* Card: Layout & Display */}
          <div className="p-5 rounded-2xl bg-black/30 border border-white/5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layout size={16} className="text-cyan-400" />
              <span>Layout & Customization</span>
            </h2>

            {/* Toggle Theme */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-white/5 pb-3">
              <div>
                <p className="font-semibold text-gray-200">Light / Dark Theme</p>
                <p className="text-gray-500 text-[10px] mt-0.5">Toggle browser window brightness mode</p>
              </div>
              <button
                onClick={toggleTheme}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/25 cursor-pointer transition-all uppercase"
              >
                {theme} Mode
              </button>
            </div>

            {/* Toggle Tabs Position */}
            <div className="flex items-center justify-between text-xs py-1">
              <div>
                <p className="font-semibold text-gray-200">Tabs View Layout</p>
                <p className="text-gray-500 text-[10px] mt-0.5">Show tabs bar horizontally on top or vertically on the left</p>
              </div>
              <button
                onClick={toggleVerticalTabs}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/25 cursor-pointer transition-all"
              >
                {verticalTabs ? 'Vertical Tabs' : 'Horizontal Tabs'}
              </button>
            </div>
          </div>

          {/* Card: Privacy & Search */}
          <div className="p-5 rounded-2xl bg-black/30 border border-white/5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield size={16} className="text-cyan-400" />
              <span>Privacy & Search Engine</span>
            </h2>

            {/* Toggle AdBlocker */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-white/5 pb-3">
              <div>
                <p className="font-semibold text-gray-200">Built-in Ad Blocker</p>
                <p className="text-gray-500 text-[10px] mt-0.5">Automatically blocks standard display ads and banners on websites</p>
              </div>
              <button
                onClick={handleToggleAdBlock}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  adBlockerEnabled 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                }`}
              >
                {adBlockerEnabled ? 'Active' : 'Disabled'}
              </button>
            </div>

            {/* Default Search Engine */}
            <div className="flex items-center justify-between text-xs py-1">
              <div>
                <p className="font-semibold text-gray-200">Default Search Engine</p>
                <p className="text-gray-500 text-[10px] mt-0.5">Search provider query string prefix</p>
              </div>
              <select
                value={searchEngine}
                onChange={handleSearchEngineChange}
                className="bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none cursor-pointer"
              >
                <option value="https://www.google.com/search?q=">Google Search</option>
                <option value="https://www.bing.com/search?q=">Bing Search</option>
                <option value="https://duckduckgo.com/?q=">DuckDuckGo</option>
              </select>
            </div>
          </div>


          {/* Card: Wallpaper Customizer */}
          <div className="p-5 rounded-2xl bg-black/30 border border-white/5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Eye size={16} className="text-cyan-400" />
              <span>Wallpapers & Visual Backgrounds</span>
            </h2>
            <div className="grid grid-cols-2 gap-3.5">
              {wallpapers.map((wp) => {
                const isActive = wallpaper === wp.id;
                return (
                  <div
                    key={wp.id}
                    onClick={() => changeWallpaper(wp.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${
                      isActive
                        ? 'bg-cyan-500/15 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)] text-white'
                        : 'bg-black/20 border-white/5 hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    <p className="text-xs font-bold">{wp.name}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{wp.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Columns: Sync status & Systems overview */}
        <div className="flex flex-col gap-5">
          
          {/* Local storage stats */}
          <div className="p-5 rounded-2xl bg-black/30 border border-white/5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Database size={16} className="text-cyan-400" />
              <span>LocalStorage Stats</span>
            </h2>
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Total Bookmarks</span>
                <span className="font-bold text-white">{localStats.bookmarks} items</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">History Log count</span>
                <span className="font-bold text-white">{localStats.history} visits</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-gray-400">Credentials Stored</span>
                <span className="font-bold text-white">{localStats.passwords} passwords</span>
              </div>
            </div>
          </div>

          {/* Education Box: Stack overview */}
          <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/15 flex flex-col gap-4 leading-relaxed text-xs text-cyan-400/90 font-medium">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Info size={16} className="text-cyan-400" />
              <span>Frontend-Only Architecture</span>
            </h2>
            <p>
              🌟 <strong>YS Browser</strong> is currently running in **Frontend-Only** mode!
            </p>
            <ul className="list-disc pl-4 flex flex-col gap-1.5 text-[10px]">
              <li><strong>Zero Dependencies</strong>: You do not need to run an Express server or have MongoDB installed.</li>
              <li><strong>Local Storage</strong>: All configurations, notes, bookmarks, passwords, and browser history are saved directly to your desktop browser's local sandbox memory.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
