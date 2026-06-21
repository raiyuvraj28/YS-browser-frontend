import React, { useContext, useState, useEffect } from 'react';
import { BrowserContext } from '../context/BrowserContext.jsx';
import { 
  Notebook, ListTodo, Star, History, KeyRound, 
  Trash2, Plus, Check, Eye, EyeOff, Save, Globe
} from 'lucide-react';

/**
 * Sidebar houses the advanced local utilities: note taker,
 * task manager, saved bookmarks, history links, and credentials vault.
 */
function Sidebar() {
  const {
    sidebarOpen,
    sidebarTab,
    setSidebarTab,
    bookmarks,
    history,
    createTab,
    removeBookmark,
    removeHistoryItem
  } = useContext(BrowserContext);

  // --- 1. NOTES STATE ---
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('ys_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // --- 2. TO-DO STATE ---
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('ys_todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [todoInput, setTodoInput] = useState('');

  // --- 3. PASSWORDS STATE ---
  const [passwords, setPasswords] = useState(() => {
    const saved = localStorage.getItem('ys_passwords');
    return saved ? JSON.parse(saved) : [];
  });
  const [pwdWebsite, setPwdWebsite] = useState('');
  const [pwdUser, setPwdUser] = useState('');
  const [pwdPass, setPwdPass] = useState('');
  const [revealPwdId, setRevealPwdId] = useState(null);

  // Sync state modifications to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ys_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('ys_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('ys_passwords', JSON.stringify(passwords));
  }, [passwords]);

  // Set default note active on startup
  useEffect(() => {
    if (notes.length > 0 && !activeNoteId) {
      selectNote(notes[0]);
    }
  }, [notes, activeNoteId]);

  // ==========================================
  // LOCALSTORAGE CRUD FUNCTIONS
  // ==========================================

  // --- Notes Actions ---
  const selectNote = (note) => {
    setActiveNoteId(note._id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  const handleCreateNote = () => {
    const newNote = {
      _id: Date.now().toString(),
      title: 'New Note',
      content: '',
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
    selectNote(newNote);
  };

  const handleSaveNote = () => {
    if (!activeNoteId) return;
    setNotes(prev =>
      prev.map(n =>
        n._id === activeNoteId
          ? { ...n, title: noteTitle, content: noteContent, updatedAt: new Date().toISOString() }
          : n
      )
    );
    alert('Note saved locally!');
  };

  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(n => n._id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
      setNoteTitle('');
      setNoteContent('');
    }
  };

  // --- To-Do Actions ---
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!todoInput.trim()) return;
    const newTodo = {
      _id: Date.now().toString(),
      text: todoInput,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [...prev, newTodo]);
    setTodoInput('');
  };

  const handleToggleTodo = (id, currentVal) => {
    setTodos(prev =>
      prev.map(t => (t._id === id ? { ...t, completed: !currentVal } : t))
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t._id !== id));
  };

  // --- Password Actions ---
  const handleAddPassword = (e) => {
    e.preventDefault();
    if (!pwdWebsite.trim() || !pwdUser.trim() || !pwdPass.trim()) return;
    const newPwd = {
      _id: Date.now().toString(),
      website: pwdWebsite,
      username: pwdUser,
      password: pwdPass,
      createdAt: new Date().toISOString()
    };
    setPasswords(prev => [newPwd, ...prev]);
    setPwdWebsite('');
    setPwdUser('');
    setPwdPass('');
  };

  const handleDeletePassword = (id) => {
    setPasswords(prev => prev.filter(p => p._id !== id));
  };

  if (!sidebarOpen) return null;

  // ==========================================
  // SUB-RENDER PANELS (Enhanced UI)
  // ==========================================

  // A. Notes Render
  const renderNotes = () => (
    <div className="flex-1 flex overflow-hidden">
      {/* Notes list sidebar */}
      <div className="w-16 border-r border-white/5 flex flex-col items-center py-3.5 gap-3.5 bg-[#0a0c12]/40 shrink-0">
        <button
          onClick={handleCreateNote}
          title="Create Note"
          className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_8px_rgba(6,182,212,0.25)] flex items-center justify-center cursor-pointer transition-all duration-300"
        >
          <Plus size={16} />
        </button>
        <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col gap-2.5 px-2.5">
          {notes.map(note => (
            <button
              key={note._id}
              onClick={() => selectNote(note)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                note._id === activeNoteId
                  ? 'bg-cyan-500/20 text-white border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-black/20 border-white/5 text-gray-500 hover:text-white hover:border-white/15'
              }`}
              title={note.title}
            >
              {note.title.substring(0, 2).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Note Editor */}
      {activeNoteId ? (
        <div className="flex-1 flex flex-col p-4 gap-3.5 overflow-hidden bg-black/10">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-xs text-white placeholder-gray-500 flex-1 uppercase tracking-wider"
              placeholder="Note title"
            />
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSaveNote}
                title="Save Note"
                className="p-2 rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              >
                <Save size={13} />
              </button>
              <button
                onClick={() => handleDeleteNote(activeNoteId)}
                title="Delete Note"
                className="p-2 rounded-lg text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs text-gray-300 placeholder-gray-600 resize-none leading-relaxed no-scrollbar"
            placeholder="Start typing note contents..."
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-xs">
          <span>No note active. Click + to add one.</span>
        </div>
      )}
    </div>
  );

  // B. To-Dos Render
  const renderTodos = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 no-scrollbar">
        {todos.length === 0 ? (
          <div className="text-center text-gray-500 text-[10px] py-10">No pending tasks. Add one below!</div>
        ) : (
          todos.map(todo => (
            <div
              key={todo._id}
              onClick={() => handleToggleTodo(todo._id, todo.completed)}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 hover:bg-white/5 cursor-pointer transition-all duration-300 group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                  todo.completed 
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.25)]' 
                    : 'border-white/20'
                }`}>
                  {todo.completed && <Check size={10} />}
                </div>
                <span className={`text-xs truncate font-medium ${todo.completed ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTodo(todo._id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddTodo} className="p-3 border-t border-white/5 bg-black/20 flex gap-2">
        <input
          type="text"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          placeholder="New task text..."
          className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/50 transition-all"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/30 cursor-pointer"
        >
          <Plus size={13} />
        </button>
      </form>
    </div>
  );

  // C. Passwords Render
  const renderPasswords = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Password addition form */}
      <form onSubmit={handleAddPassword} className="p-3 border-b border-white/5 bg-black/25 flex flex-col gap-2">
        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Save Credentials</span>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Website"
            value={pwdWebsite}
            onChange={(e) => setPwdWebsite(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none focus:border-cyan-500/40"
          />
          <input
            type="text"
            placeholder="Username"
            value={pwdUser}
            onChange={(e) => setPwdUser(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none focus:border-cyan-500/40"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="password"
            placeholder="Password"
            value={pwdPass}
            onChange={(e) => setPwdPass(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none focus:border-cyan-500/40"
          />
          <button
            type="submit"
            className="px-3 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/30 text-xs font-semibold cursor-pointer"
          >
            Add
          </button>
        </div>
      </form>

      {/* Credentials vault list */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 flex flex-col gap-2.5">
        {passwords.length === 0 ? (
          <div className="text-center text-gray-500 text-[10px] py-10">Vault is empty.</div>
        ) : (
          passwords.map(pw => {
            const isRevealed = revealPwdId === pw._id;
            return (
              <div
                key={pw._id}
                className="p-3.5 rounded-xl bg-black/35 border border-white/5 flex flex-col gap-2 hover:border-white/10 group transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white truncate">{pw.website}</span>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setRevealPwdId(isRevealed ? null : pw._id)}
                      className="p-1 rounded text-gray-400 hover:text-white"
                      title={isRevealed ? "Hide Password" : "Reveal Password"}
                    >
                      {isRevealed ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                    <button
                      onClick={() => handleDeletePassword(pw._id)}
                      className="p-1 rounded text-gray-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 text-[10px] text-gray-400">
                  <span>User: <strong className="text-gray-300 font-mono font-medium">{pw.username}</strong></span>
                  <span>Pass: <strong className="text-cyan-400 font-mono font-medium">{isRevealed ? pw.password : '••••••••'}</strong></span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // E. Bookmarks list
  const renderBookmarksList = () => (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-2">
      {bookmarks.length === 0 ? (
        <div className="text-center text-gray-500 text-[10px] py-10">No bookmarks saved yet.</div>
      ) : (
        bookmarks.map(b => (
          <div
            key={b._id}
            onClick={() => createTab(b.url)}
            className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-black/25 border border-white/5 hover:border-white/10 hover:bg-white/5 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              {b.favicon ? (
                <img src={b.favicon} className="w-3.5 h-3.5 object-contain" alt="" />
              ) : (
                <Globe size={13} className="text-gray-500" />
              )}
              <span className="text-xs text-gray-200 truncate font-semibold">{b.title}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeBookmark(b._id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 rounded transition-all cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))
      )}
    </div>
  );

  // F. History list
  const renderHistoryList = () => (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-2">
      {history.length === 0 ? (
        <div className="text-center text-gray-500 text-[10px] py-10">No browsing history logged.</div>
      ) : (
        history.slice(0, 30).map(h => (
          <div
            key={h._id}
            onClick={() => createTab(h.url)}
            className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-black/25 border border-white/5 hover:border-white/10 hover:bg-white/5 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              {h.favicon ? (
                <img src={h.favicon} className="w-3.5 h-3.5 object-contain" alt="" />
              ) : (
                <Globe size={13} className="text-gray-500" />
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-200 truncate font-semibold">{h.title}</span>
                <span className="text-[8px] text-gray-500 truncate mt-0.5">{h.url}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeHistoryItem(h._id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 rounded transition-all cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="w-80 h-full border-l border-white/5 bg-[#0f111a]/85 backdrop-blur-xl flex select-none overflow-hidden animate-fade-in shrink-0">
      
      {/* 1. Left Icon Panel */}
      <div className="w-11 border-r border-white/5 bg-black/20 flex flex-col items-center py-4 gap-4.5 shrink-0">
        <button
          onClick={() => setSidebarTab('notes')}
          title="Quick Notes Notepad"
          className={`p-2 rounded-xl transition-all cursor-pointer duration-300 ${
            sidebarTab === 'notes' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 shadow-[0_0_8px_rgba(6,182,212,0.15)]' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Notebook size={16} />
        </button>
        <button
          onClick={() => setSidebarTab('todo')}
          title="Checklist / To-Dos"
          className={`p-2 rounded-xl transition-all cursor-pointer duration-300 ${
            sidebarTab === 'todo' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 shadow-[0_0_8px_rgba(6,182,212,0.15)]' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <ListTodo size={16} />
        </button>
        <button
          onClick={() => setSidebarTab('bookmarks')}
          title="Quick Bookmarks"
          className={`p-2 rounded-xl transition-all cursor-pointer duration-300 ${
            sidebarTab === 'bookmarks' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 shadow-[0_0_8px_rgba(6,182,212,0.15)]' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Star size={16} />
        </button>
        <button
          onClick={() => setSidebarTab('history')}
          title="Quick History"
          className={`p-2 rounded-xl transition-all cursor-pointer duration-300 ${
            sidebarTab === 'history' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 shadow-[0_0_8px_rgba(6,182,212,0.15)]' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <History size={16} />
        </button>
        <button
          onClick={() => setSidebarTab('passwords')}
          title="Password Vault Manager"
          className={`p-2 rounded-xl transition-all cursor-pointer duration-300 ${
            sidebarTab === 'passwords' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 shadow-[0_0_8px_rgba(6,182,212,0.15)]' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <KeyRound size={16} />
        </button>
      </div>

      {/* 2. Main Content drawer panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Widget Title banner */}
        <div className="p-3 border-b border-white/5 bg-black/15 flex justify-between items-center">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
            {sidebarTab === 'notes' && 'Notes Notepad'}
            {sidebarTab === 'todo' && 'To-Do Checklist'}
            {sidebarTab === 'bookmarks' && 'Bookmarks List'}
            {sidebarTab === 'history' && 'Browsing History'}
            {sidebarTab === 'passwords' && 'Credentials Vault'}
          </span>
        </div>

        {/* Dynamic widget render content */}
        {sidebarTab === 'notes' && renderNotes()}
        {sidebarTab === 'todo' && renderTodos()}
        {sidebarTab === 'bookmarks' && renderBookmarksList()}
        {sidebarTab === 'history' && renderHistoryList()}
        {sidebarTab === 'passwords' && renderPasswords()}
      </div>
    </div>
  );
}

export default Sidebar;
