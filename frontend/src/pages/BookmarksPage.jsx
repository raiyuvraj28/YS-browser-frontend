import React, { useContext, useState } from 'react';
import { BrowserContext } from '../context/BrowserContext.jsx';
import { Trash2, Search, ExternalLink, Globe, Star } from 'lucide-react';

/**
 * BookmarksPage lists all saved bookmarks in a beautiful card grid layout,
 * allowing users to search, launch, or delete items.
 */
function BookmarksPage() {
  const { bookmarks, removeBookmark, createTab } = useContext(BrowserContext);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter bookmarks by search keyword
  const filteredBookmarks = bookmarks.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#151923]/60 backdrop-blur-md p-6 select-none overflow-hidden">
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Star size={20} className="text-yellow-400 fill-yellow-400" />
            <span>Saved Bookmarks</span>
          </h1>
          <p className="text-xs text-gray-400">All bookmarks synced locally via MongoDB</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 focus-within:border-cyan-500/50 w-full sm:w-auto">
          <Search size={14} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search bookmarks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-full sm:w-44"
          />
        </div>
      </div>

      {/* 2. Bookmarks Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Star size={32} className="mb-2.5 text-gray-600" />
            <p className="text-sm font-medium">No bookmarks saved yet.</p>
            <p className="text-xs mt-1">Star pages in the URL bar to bookmark them!</p>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-xs">No bookmarks matching your search.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="flex flex-col justify-between p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-cyan-500/30 hover:bg-white/5 group transition-all duration-300 relative animate-fade-in"
              >
                {/* Info */}
                <div className="flex items-start gap-3 overflow-hidden mb-3">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 shrink-0">
                    {bookmark.favicon ? (
                      <img src={bookmark.favicon} className="w-4 h-4 object-contain" alt="" />
                    ) : (
                      <Globe size={15} />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                      {bookmark.title}
                    </span>
                    <span className="text-[10px] text-gray-500 truncate mt-0.5">
                      {bookmark.url}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-1">
                  <span className="text-[9px] text-gray-500">
                    Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => createTab(bookmark.url)}
                      title="Open in New Tab"
                      className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      <ExternalLink size={12} />
                    </button>
                    <button
                      onClick={() => removeBookmark(bookmark._id)}
                      title="Delete Bookmark"
                      className="p-1 rounded-md text-gray-400 hover:text-red-400 hover:bg-white/5 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookmarksPage;
