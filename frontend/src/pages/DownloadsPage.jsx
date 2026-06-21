import React, { useState } from 'react';
import { Download, Search, FileText, CheckCircle, FolderOpen, Play, Pause, Trash2 } from 'lucide-react';

/**
 * DownloadsPage displays active and completed files downloaded during the session.
 * It demonstrates how to handle file progression and native system directory openings.
 */
function DownloadsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample static download list to showcase the premium UI and progression bars.
  // In a production Electron app, these would be fed dynamically from the main process 
  // via ipcRenderer listening to the `will-download` session event.
  const [downloads, setDownloads] = useState([
    {
      id: '1',
      name: 'ys-browser-setup.exe',
      size: '64.2 MB',
      progress: 100,
      status: 'completed',
      date: '2026-06-21',
      url: 'https://github.com/ys-browser/releases/setup.exe'
    },
    {
      id: '2',
      name: 'cyberpunk_wallpaper.jpg',
      size: '4.8 MB',
      progress: 65,
      status: 'downloading',
      speed: '1.2 MB/s',
      date: '2026-06-21',
      url: 'https://images.unsplash.com/cyberpunk.jpg'
    },
    {
      id: '3',
      name: 'notes-archive.zip',
      size: '12.5 MB',
      progress: 100,
      status: 'completed',
      date: '2026-06-20',
      url: 'http://localhost:5000/api/notes/export'
    }
  ]);

  const handleToggleState = (id) => {
    setDownloads(prev =>
      prev.map(dl => {
        if (dl.id === id) {
          const isDownloading = dl.status === 'downloading';
          return {
            ...dl,
            status: isDownloading ? 'paused' : 'downloading',
            speed: isDownloading ? '0 KB/s' : '850 KB/s'
          };
        }
        return dl;
      })
    );
  };

  const handleDelete = (id) => {
    setDownloads(prev => prev.filter(dl => dl.id !== id));
  };

  const filteredDownloads = downloads.filter(dl =>
    dl.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#151923]/60 backdrop-blur-md p-6 select-none overflow-hidden animate-fade-in">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Download size={20} className="text-cyan-400" />
            <span>Downloads Tracker</span>
          </h1>
          <p className="text-xs text-gray-400">View file downloads and transfer progress</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 focus-within:border-cyan-500/50">
          <Search size={14} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search downloads"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-44"
          />
        </div>
      </div>

      {/* 2. Download Items List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pr-2 flex flex-col gap-3">
        {filteredDownloads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Download size={32} className="mb-2.5 text-gray-600 animate-bounce" />
            <p className="text-sm font-medium">No downloads found.</p>
            <p className="text-xs mt-1">Files you download will appear here.</p>
          </div>
        ) : (
          filteredDownloads.map(dl => (
            <div
              key={dl.id}
              className="p-4 rounded-2xl bg-black/35 border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* File Icon & Info */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  dl.status === 'completed' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}>
                  {dl.status === 'completed' ? <CheckCircle size={18} /> : <FileText size={18} />}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-white truncate">{dl.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-gray-400 mt-1">
                    <span className="truncate max-w-[200px]">{dl.url}</span>
                    <span className="font-semibold text-gray-500">•</span>
                    <span>{dl.size}</span>
                    {dl.status === 'downloading' && (
                      <>
                        <span className="font-semibold text-gray-500">•</span>
                        <span className="text-cyan-400 font-medium">{dl.speed}</span>
                      </>
                    )}
                  </div>

                  {/* Progress Bar (Visible if downloading or paused) */}
                  {dl.status !== 'completed' && (
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div 
                        className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${dl.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress percentage and controls */}
              <div className="flex items-center gap-3 justify-between sm:justify-start shrink-0">
                {dl.status !== 'completed' && (
                  <span className="text-xs font-mono text-cyan-400">{dl.progress}%</span>
                )}
                
                <div className="flex items-center gap-1.5">
                  {dl.status !== 'completed' ? (
                    <button
                      onClick={() => handleToggleState(dl.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
                      title={dl.status === 'downloading' ? 'Pause' : 'Resume'}
                    >
                      {dl.status === 'downloading' ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  ) : (
                    <button
                      onClick={() => alert("Mock action: Opening local directory")}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-1 cursor-pointer text-xs"
                      title="Show in Folder"
                    >
                      <FolderOpen size={14} />
                      <span className="hidden md:inline">Show in Folder</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(dl.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 cursor-pointer"
                    title="Remove record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Note for learners */}
      <div className="mt-4 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-[10px] text-cyan-400/80 leading-relaxed font-medium">
        💡 <strong>Developer Note:</strong> Electron captures network file requests automatically in the main process using `session.defaultSession.on('will-download')`. In this beginner MERN browser template, we implement the visual tracker logic on the frontend to showcase progress bars and state variables.
      </div>
    </div>
  );
}

export default DownloadsPage;
