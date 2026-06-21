import React, { useContext } from 'react';
import { BrowserContext } from '../context/BrowserContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { Plus, X, Pin, Globe, Folder, Shield, Briefcase, User, Share2 } from 'lucide-react';

/**
 * TabBar displays tabs and workspace controls. It dynamically switches
 * its layout from horizontal (top row) to vertical (left column) based on the settings,
 * using vibrant colorful theme accents.
 */
function TabBar() {
  const {
    tabs,
    activeTabId,
    createTab,
    closeTab,
    setActiveTabId,
    togglePinTab,
    activeWorkspace,
    workspaces,
    switchWorkspace,
    incognito,
    verticalTabs
  } = useContext(BrowserContext);

  const { theme } = useContext(ThemeContext);

  // Helper to render workspace icons
  const getWorkspaceIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'general': return <Globe size={14} />;
      case 'work': return <Briefcase size={14} />;
      case 'personal': return <User size={14} />;
      case 'social': return <Share2 size={14} />;
      default: return <Folder size={14} />;
    }
  };

  // 1. Helper to color-code the workspace pills based on their active status
  const getWorkspaceStyle = (name, isActive) => {
    if (!isActive) return 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent';
    switch (name.toLowerCase()) {
      case 'general':
        return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/35 shadow-[0_0_12px_rgba(6,182,212,0.25)]';
      case 'work':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-[0_0_12px_rgba(16,185,129,0.25)]';
      case 'personal':
        return 'bg-orange-500/20 text-orange-300 border border-orange-500/35 shadow-[0_0_12px_rgba(249,115,22,0.25)]';
      case 'social':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/35 shadow-[0_0_12px_rgba(168,85,247,0.25)]';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
    }
  };

  // 2. Helper to set custom active style for tabs based on workspace
  const getHorizontalTabStyle = (tabId) => {
    const isActive = tabId === activeTabId;
    if (!isActive) return 'text-gray-400 hover:text-white border-transparent hover:bg-white/5 border-t border-t-transparent';
    
    switch (activeWorkspace.toLowerCase()) {
      case 'general':
        return 'bg-[#151923] text-white border-x-white/10 border-t-2 border-t-cyan-400 shadow-[0_-4px_12px_rgba(6,182,212,0.18)] font-semibold';
      case 'work':
        return 'bg-[#151923] text-white border-x-white/10 border-t-2 border-t-emerald-400 shadow-[0_-4px_12px_rgba(16,185,129,0.18)] font-semibold';
      case 'personal':
        return 'bg-[#151923] text-white border-x-white/10 border-t-2 border-t-orange-400 shadow-[0_-4px_12px_rgba(249,115,22,0.18)] font-semibold';
      case 'social':
        return 'bg-[#151923] text-white border-x-white/10 border-t-2 border-t-purple-400 shadow-[0_-4px_12px_rgba(168,85,247,0.18)] font-semibold';
      default:
        return 'bg-[#151923] text-white border-x-white/10 border-t-2 border-t-cyan-400 font-semibold';
    }
  };

  const getVerticalTabStyle = (tabId) => {
    const isActive = tabId === activeTabId;
    if (!isActive) return 'text-gray-400 hover:text-white border-transparent hover:bg-white/5 border-l border-l-transparent';

    switch (activeWorkspace.toLowerCase()) {
      case 'general':
        return 'bg-cyan-500/10 text-white border-white/10 border-l-2 border-l-cyan-400 shadow-[2px_0_10px_rgba(6,182,212,0.15)] font-semibold';
      case 'work':
        return 'bg-emerald-500/10 text-white border-white/10 border-l-2 border-l-emerald-400 shadow-[2px_0_10px_rgba(16,185,129,0.15)] font-semibold';
      case 'personal':
        return 'bg-orange-500/10 text-white border-white/10 border-l-2 border-l-orange-400 shadow-[2px_0_10px_rgba(249,115,22,0.15)] font-semibold';
      case 'social':
        return 'bg-purple-500/10 text-white border-white/10 border-l-2 border-l-purple-400 shadow-[2px_0_10px_rgba(168,85,247,0.15)] font-semibold';
      default:
        return 'bg-cyan-500/10 text-white border-white/10 border-l-2 border-l-cyan-400 font-semibold';
    }
  };

  const getGlobeIconColor = (isActive) => {
    if (!isActive) return 'text-gray-500';
    switch (activeWorkspace.toLowerCase()) {
      case 'general': return 'text-cyan-400';
      case 'work': return 'text-emerald-400';
      case 'personal': return 'text-orange-400';
      case 'social': return 'text-purple-400';
      default: return 'text-cyan-400';
    }
  };

  // Filter tabs for display
  const pinnedTabs = tabs.filter(t => t.pinned);
  const standardTabs = tabs.filter(t => !t.pinned && t.workspace === activeWorkspace);

  // --- HORIZONTAL TABS LAYOUT ---
  if (!verticalTabs) {
    return (
      <div className="flex items-center justify-between px-2 sm:px-3 h-11 border-b border-white/5 select-none bg-black/30">
        
        {/* Left Side: Workspace Selector Pills */}
        <div className="flex items-center gap-1 mr-2 overflow-x-auto no-scrollbar max-w-[80px] xs:max-w-none shrink-0">
          {workspaces.map(ws => {
            const isActive = ws === activeWorkspace;
            return (
              <button
                key={ws}
                onClick={() => switchWorkspace(ws)}
                title={`${ws} Workspace`}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${getWorkspaceStyle(ws, isActive)}`}
              >
                {getWorkspaceIcon(ws)}
                <span className="hidden sm:inline">{ws}</span>
              </button>
            );
          })}
        </div>

        {/* Center/Left: Tabs Scroll Area */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
          
          {/* A. Pinned Tabs (Compact, icon-only) */}
          {pinnedTabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center justify-center w-9 h-8 rounded-lg cursor-pointer transition-all duration-200 shrink-0 relative group ${
                tab.id === activeTabId
                  ? 'bg-white/10 text-cyan-400 border border-white/10 shadow-[0_0_8px_rgba(255,255,255,0.05)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              title={tab.title}
            >
              {tab.favicon ? (
                <img src={tab.favicon} className="w-4 h-4 object-contain" alt="" />
              ) : (
                <Globe size={14} className={tab.id === activeTabId ? "text-cyan-400" : "text-gray-500"} />
              )}
              {/* Unpin Action Icon on Hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePinTab(tab.id);
                }}
                className="absolute -top-1 -right-1 hidden group-hover:flex items-center justify-center w-3.5 h-3.5 bg-black/80 rounded-full text-red-400 hover:text-red-300"
              >
                <Pin size={8} className="rotate-45" />
              </button>
            </div>
          ))}

          {/* Divider between pinned and standard tabs */}
          {pinnedTabs.length > 0 && <div className="h-5 w-[1px] bg-white/10 mx-1 shrink-0"></div>}

          {/* B. Standard Workspace Tabs */}
          {standardTabs.map(tab => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center justify-between gap-1.5 pl-2.5 pr-1.5 h-8 w-24 sm:w-36 md:w-44 rounded-t-lg cursor-pointer transition-all duration-200 border-x shrink-0 group ${getHorizontalTabStyle(tab.id)}`}
              >
                <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                  {tab.favicon ? (
                    <img 
                      src={tab.favicon} 
                      className="w-3.5 h-3.5 object-contain" 
                      onError={(e) => e.target.src = ''} 
                      alt="" 
                    />
                  ) : (
                    <Globe size={13} className={getGlobeIconColor(isActive)} />
                  )}
                  <span className="text-xs truncate font-medium">{tab.title}</span>
                </div>

                {/* Right Tab Utilities: Pin & Close */}
                <div className="hidden sm:flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinTab(tab.id);
                    }}
                    title="Pin Tab"
                    className="p-0.5 rounded text-gray-500 hover:text-cyan-400 hover:bg-white/5"
                  >
                    <Pin size={10} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    title="Close Tab"
                    className="p-0.5 rounded text-gray-500 hover:text-red-400 hover:bg-white/5"
                  >
                    <X size={10} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Plus Button to Open New Tab */}
          <button
            onClick={() => createTab('about:newtab')}
            title="New Tab"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all cursor-pointer shrink-0 ml-1"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Right Side: Incognito Indicator */}
        {incognito && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 shrink-0 ml-2 sm:ml-4 animate-pulse">
            <Shield size={12} />
            <span className="hidden sm:inline">Incognito</span>
          </div>
        )}
      </div>
    );
  }

  // --- VERTICAL TABS LAYOUT (Sidebar style) ---
  return (
    <div className="w-14 sm:w-52 h-full border-r border-white/5 bg-[#0f111a]/80 backdrop-blur-xl flex flex-col shrink-0 select-none transition-all duration-300">
      
      {/* 1. Workspaces Stack */}
      <div className="p-2 sm:p-3 border-b border-white/5 flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1 hidden sm:block">Workspaces</span>
        {workspaces.map(ws => {
          const isActive = ws === activeWorkspace;
          return (
            <button
              key={ws}
              onClick={() => switchWorkspace(ws)}
              className={`flex items-center justify-center sm:justify-start gap-2.5 w-full px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${getWorkspaceStyle(ws, isActive)}`}
              title={`${ws} Workspace`}
            >
              {getWorkspaceIcon(ws)}
              <span className="hidden sm:inline">{ws}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Pinned Tabs (Grid Layout) */}
      {pinnedTabs.length > 0 && (
        <div className="p-2 sm:p-3 border-b border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold hidden sm:block mb-2">Pinned</span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-1.5">
            {pinnedTabs.map(tab => (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center justify-center h-8 rounded-lg cursor-pointer transition-all duration-200 relative group border ${
                  tab.id === activeTabId
                    ? 'bg-white/10 text-cyan-400 border-white/10'
                    : 'text-gray-400 hover:bg-white/5 border-transparent'
                }`}
                title={tab.title}
              >
                {tab.favicon ? (
                  <img src={tab.favicon} className="w-3.5 h-3.5 object-contain" alt="" />
                ) : (
                  <Globe size={13} className={tab.id === activeTabId ? "text-cyan-400" : "text-gray-500"} />
                )}
                
                {/* Unpin Action */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePinTab(tab.id);
                  }}
                  className="absolute -top-1 -right-1 hidden group-hover:flex items-center justify-center w-3.5 h-3.5 bg-black/80 rounded-full text-red-400"
                >
                  <Pin size={8} className="rotate-45" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Standard Tabs List (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 flex flex-col gap-1 no-scrollbar">
        <div className="flex items-center justify-between mb-1.5 pr-1">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold hidden sm:block">Active Tabs</span>
          <button
            onClick={() => createTab('about:newtab')}
            className="text-gray-400 hover:text-white p-0.5 rounded hover:bg-white/5 cursor-pointer mx-auto sm:mx-0"
            title="New Tab"
          >
            <Plus size={12} />
          </button>
        </div>

        {standardTabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center justify-center sm:justify-between gap-2 px-2 sm:px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200 border group ${getVerticalTabStyle(tab.id)}`}
              title={tab.title}
            >
              <div className="flex items-center justify-center sm:justify-start gap-2 overflow-hidden flex-1">
                {tab.favicon ? (
                  <img 
                    src={tab.favicon} 
                    className="w-3.5 h-3.5 object-contain" 
                    onError={(e) => e.target.src = ''} 
                    alt="" 
                  />
                ) : (
                  <Globe size={13} className={getGlobeIconColor(isActive)} />
                )}
                <span className="text-xs truncate hidden sm:inline">{tab.title}</span>
              </div>

              {/* Utility actions */}
              <div className="hidden sm:flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePinTab(tab.id);
                  }}
                  title="Pin Tab"
                  className="p-0.5 rounded text-gray-500 hover:text-cyan-400"
                >
                  <Pin size={10} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  title="Close Tab"
                  className="p-0.5 rounded text-gray-500 hover:text-red-400"
                >
                  <X size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Footer Panel */}
      <div className="p-2 sm:p-3 border-t border-white/5 flex flex-col gap-1.5 bg-black/10">
        {incognito && (
          <div className="flex items-center justify-center gap-1.5 py-1 rounded-md text-[10px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20" title="Incognito Active">
            <Shield size={10} />
            <span className="hidden sm:inline">Incognito Active</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TabBar;
