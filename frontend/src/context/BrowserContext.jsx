import React, { createContext, useState, useEffect } from 'react';

export const BrowserContext = createContext();

/**
 * BrowserProvider manages the core browsing states:
 * tabs list, active workspace, active tab, bookmarks, history log,
 * incognito status, and split-screen configurations, all saved locally.
 */
export const BrowserProvider = ({ children }) => {
  // --- TABS & WORKSPACE STATE ---
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [splitTabId, setSplitTabId] = useState(null); // Tab ID for secondary screen in split mode
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState('General');
  const [workspaces, setWorkspaces] = useState(() => {
    const saved = localStorage.getItem('ys_workspaces');
    return saved ? JSON.parse(saved) : ['General', 'Work', 'Personal', 'Social'];
  });
  const [incognito, setIncognito] = useState(false);
  const [verticalTabs, setVerticalTabs] = useState(() => {
    return localStorage.getItem('ys_vertical_tabs') === 'true';
  });

  // --- SIDEBAR & UTILITIES STATE ---
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('notes'); // 'notes', 'todo', 'bookmarks', 'history', 'passwords'

  // --- LOCALSTORAGE SYNCED STATES ---
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('ys_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ys_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state modifications to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ys_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('ys_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('ys_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  // Initialize with a default new tab if empty
  useEffect(() => {
    if (tabs.length === 0) {
      createTab('about:newtab');
    }
  }, [tabs]);

  // ==========================================
  // SYNC FUNCTIONS
  // ==========================================

  const addBookmark = (title, url, favicon = '') => {
    const newBookmark = { 
      _id: Date.now().toString(), 
      title, 
      url, 
      favicon, 
      createdAt: new Date().toISOString() 
    };
    setBookmarks(prev => [newBookmark, ...prev]);
  };

  const removeBookmark = (id) => {
    setBookmarks(prev => prev.filter(b => b._id !== id));
  };

  const addHistory = (title, url, favicon = '') => {
    // If in incognito, NEVER log pages in history!
    if (incognito) return;
    
    const newHistoryEntry = { 
      _id: Date.now().toString(), 
      title: title || 'Untitled Page', 
      url, 
      favicon, 
      visitedAt: new Date().toISOString() 
    };
    // Cap history list at 200 items to conserve localStorage memory
    setHistory(prev => [newHistoryEntry, ...prev.slice(0, 199)]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeHistoryItem = (id) => {
    setHistory(prev => prev.filter(h => h._id !== id));
  };

  // ==========================================
  // TAB LIFECYCLE MANAGEMENT
  // ==========================================

  /**
   * Opens a new tab with a specific URL in the current workspace.
   */
  const createTab = (url = 'about:newtab', workspace = activeWorkspace) => {
    const newId = Date.now().toString();
    const newTab = {
      id: newId,
      url: url,
      title: url === 'about:newtab' ? 'New Tab' : 'Loading...',
      favicon: '',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      pinned: false,
      workspace: workspace
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
    return newId;
  };

  /**
   * Closes a tab by ID. Selects another tab if closing the active one.
   */
  const closeTab = (tabId) => {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    // Remove split-tab reference if it's closed
    if (splitTabId === tabId) {
      setSplitTabId(null);
      setIsSplitScreen(false);
    }

    const filteredTabs = tabs.filter(t => t.id !== tabId);
    setTabs(filteredTabs);

    // If we closed the active tab, we need to activate another tab
    if (activeTabId === tabId) {
      // Look for a tab in the same workspace first
      const sameWorkspaceTabs = filteredTabs.filter(t => t.workspace === activeWorkspace || t.pinned);
      if (sameWorkspaceTabs.length > 0) {
        // Activate the nearest tab
        const nextActiveIndex = Math.min(tabIndex, sameWorkspaceTabs.length - 1);
        setActiveTabId(sameWorkspaceTabs[nextActiveIndex].id);
      } else if (filteredTabs.length > 0) {
        setActiveTabId(filteredTabs[0].id);
      } else {
        setActiveTabId(null);
      }
    }
  };

  /**
   * Updates specific properties (like url, title, isLoading) of a tab.
   */
  const updateTab = (tabId, updates) => {
    setTabs(prev =>
      prev.map(t => (t.id === tabId ? { ...t, ...updates } : t))
    );
  };

  /**
   * Toggle pinned status of a tab. Pinned tabs remain visible across workspaces.
   */
  const togglePinTab = (tabId) => {
    setTabs(prev =>
      prev.map(t => (t.id === tabId ? { ...t, pinned: !t.pinned } : t))
    );
  };

  /**
   * Switches the active workspace group
   */
  const switchWorkspace = (workspaceName) => {
    setActiveWorkspace(workspaceName);
    // Find the first tab in the new workspace, or create one
    const workspaceTabs = tabs.filter(t => t.workspace === workspaceName || t.pinned);
    if (workspaceTabs.length > 0) {
      setActiveTabId(workspaceTabs[0].id);
    } else {
      createTab('about:newtab', workspaceName);
    }
  };

  // ==========================================
  // SPLIT SCREEN CONFIGURATION
  // ==========================================

  const toggleSplitScreen = () => {
    if (isSplitScreen) {
      setIsSplitScreen(false);
      setSplitTabId(null);
    } else {
      // Find a suitable second tab in the current workspace
      const currentWorkspaceTabs = tabs.filter(t => (t.workspace === activeWorkspace || t.pinned) && t.id !== activeTabId);
      if (currentWorkspaceTabs.length > 0) {
        setSplitTabId(currentWorkspaceTabs[0].id);
        setIsSplitScreen(true);
      } else {
        // Create a new tab to split-screen with
        const newTabId = createTab('about:newtab');
        setSplitTabId(newTabId);
        setIsSplitScreen(true);
      }
    }
  };

  const toggleIncognito = () => {
    setIncognito(prev => !prev);
    // When switching to incognito, create a new fresh tab
    createTab('about:newtab');
  };

  const toggleVerticalTabs = () => {
    const newVal = !verticalTabs;
    setVerticalTabs(newVal);
    localStorage.setItem('ys_vertical_tabs', String(newVal));
  };

  return (
    <BrowserContext.Provider value={{
      tabs,
      activeTabId,
      splitTabId,
      isSplitScreen,
      activeWorkspace,
      workspaces,
      incognito,
      sidebarOpen,
      sidebarTab,
      bookmarks,
      history,
      verticalTabs,
      setActiveTabId,
      setSplitTabId,
      setIsSplitScreen,
      setSidebarOpen,
      setSidebarTab,
      createTab,
      closeTab,
      updateTab,
      togglePinTab,
      switchWorkspace,
      toggleSplitScreen,
      toggleIncognito,
      toggleVerticalTabs,
      addBookmark,
      removeBookmark,
      addHistory,
      clearHistory,
      removeHistoryItem
    }}>
      {children}
    </BrowserContext.Provider>
  );
};
