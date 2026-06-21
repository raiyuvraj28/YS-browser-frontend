import React, { useContext, useState } from 'react';
import { BrowserContext } from '../context/BrowserContext.jsx';
import { Trash2, Search, ExternalLink, Globe } from 'lucide-react';

/**
 * HistoryPage displays a native browser view containing
 * the logged browsing history, supporting searches, deletions, and clears.
 */
function HistoryPage() {
  const { history, removeHistoryItem, clearHistory, createTab } = useContext(BrowserContext);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter history records based on search input
  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group history items by calendar date
  const groupHistoryByDate = (items) => {
    return items.reduce((acc, item) => {
      const date = new Date(item.visitedAt).toLocaleDateString([], { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
  };

  const groupedHistory = groupHistoryByDate(filteredHistory);

  return (
    <div className="w-full h-full flex flex-col bg-[#151923]/60 backdrop-blur-md p-6 select-none overflow-hidden">
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Browsing History</h1>
          <p className="text-xs text-gray-400">All local history synced to MongoDB</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 focus-within:border-cyan-500/50">
            <Search size={14} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search history"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-44"
            />
          </div>

          {/* Clear all */}
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your entire browsing history?")) {
                clearHistory();
              }
            }}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 disabled:opacity-30 disabled:hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* 2. Logs Scroll View */}
      <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Globe size={32} className="mb-2.5 text-gray-600" />
            <p className="text-sm font-medium">No browsing history yet.</p>
            <p className="text-xs mt-1">Websites you visit in standard mode will appear here.</p>
          </div>
        ) : Object.keys(groupedHistory).length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-xs">No records matching your search.</div>
        ) : (
          Object.keys(groupedHistory).map((date) => (
            <div key={date} className="mb-6 animate-fade-in">
              <h3 className="text-xs font-semibold text-cyan-400 tracking-wider mb-3.5 uppercase">{date}</h3>
              
              <div className="flex flex-col gap-2">
                {groupedHistory[date].map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl bg-black/25 border border-white/5 hover:border-white/10 group transition-all"
                  >
                    {/* Page info */}
                    <div 
                      onClick={() => createTab(item.url)}
                      className="flex items-center gap-3 overflow-hidden flex-1 cursor-pointer"
                    >
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(item.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      
                      {item.favicon ? (
                        <img src={item.favicon} className="w-4 h-4 object-contain" alt="" />
                      ) : (
                        <Globe size={14} className="text-gray-500" />
                      )}

                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-gray-500 truncate mt-0.5">
                          {item.url}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                      <button
                        onClick={() => createTab(item.url)}
                        title="Open in New Tab"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
                      >
                        <ExternalLink size={13} />
                      </button>
                      <button
                        onClick={() => removeHistoryItem(item._id)}
                        title="Delete Log"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
