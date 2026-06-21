import React, { useContext } from 'react';
import { BrowserContext } from '../context/BrowserContext.jsx';
import TabBar from '../components/TabBar.jsx';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import WebviewContainer from '../components/WebviewContainer.jsx';
import CustomNewTab from '../components/CustomNewTab.jsx';

// Native React pages for internal browser endpoints
import HistoryPage from '../pages/HistoryPage.jsx';
import BookmarksPage from '../pages/BookmarksPage.jsx';
import DownloadsPage from '../pages/DownloadsPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';

/**
 * MainLayout manages the overall grid of the browser, displaying the top bar,
 * rendering the active webviews/views (including split screen), and toggling the sidebar.
 */
function MainLayout() {
  const {
    tabs,
    activeTabId,
    splitTabId,
    isSplitScreen,
    sidebarOpen,
    activeWorkspace,
    verticalTabs
  } = useContext(BrowserContext);

  // Get the active tab details
  const activeTab = tabs.find(t => t.id === activeTabId);
  // Get the split screen tab details if active
  const splitTab = isSplitScreen ? tabs.find(t => t.id === splitTabId) : null;

  /**
   * Helper to render the appropriate page contents for a given tab.
   * If the URL is a native browser page (like about:newtab), we load a React view.
   * Otherwise, we load the Electron webview.
   */
  const renderTabContent = (tab) => {
    if (!tab) return null;

    switch (tab.url) {
      case 'about:newtab':
        return <CustomNewTab tabId={tab.id} />;
      case 'about:history':
        return <HistoryPage />;
      case 'about:bookmarks':
        return <BookmarksPage />;
      case 'about:downloads':
        return <DownloadsPage />;
      case 'about:settings':
        return <SettingsPage />;
      default:
        // Render webview container. It is vital to render all webviews in the DOM 
        // but toggle 'hidden' so pages don't lose state/reload when switching tabs!
        return <WebviewContainer tab={tab} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 1. Header Area: Tab Bar (if horizontal) & Omnibox Navbar */}
      <header className="glass-panel border-b border-white/5 select-none z-10">
        {!verticalTabs && <TabBar />}
        <Navbar />
      </header>

      {/* 2. Main Work Area (Browser Webviews + TabBar if vertical + Sidebar) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side Vertical Tabs Bar */}
        {verticalTabs && <TabBar />}

        {/* Active Browser Views (supports Split Screen) */}
        <main className="flex-1 p-2 flex gap-2 overflow-hidden bg-black/20">
          
          {/* Main Active Tab Screen */}
          <div className="flex-1 h-full rounded-xl overflow-hidden relative glass-panel">
            {/* If it's a webview page, we keep it in DOM to preserve state, toggling visibility. */}
            {tabs.map(tab => {
              const isNativePage = ['about:newtab', 'about:history', 'about:bookmarks', 'about:downloads', 'about:settings'].includes(tab.url);
              
              if (isNativePage) {
                // Render native pages only when they are active
                return tab.id === activeTabId ? (
                  <div key={tab.id} className="w-full h-full animate-fade-in">
                    {renderTabContent(tab)}
                  </div>
                ) : null;
              }

              // Webview tag page: toggle 'hidden' to avoid losing active page state
              return (
                <div
                  key={tab.id}
                  className={`w-full h-full ${tab.id === activeTabId ? 'block' : 'hidden'}`}
                >
                  {renderTabContent(tab)}
                </div>
              );
            })}
          </div>

          {/* Split Screen Secondary View */}
          {isSplitScreen && splitTab && (
            <div className="flex-1 h-full rounded-xl overflow-hidden relative glass-panel animate-fade-in border-l border-white/5">
              {tabs.map(tab => {
                const isNativePage = ['about:newtab', 'about:history', 'about:bookmarks', 'about:downloads', 'about:settings'].includes(tab.url);
                
                if (isNativePage) {
                  return tab.id === splitTabId ? (
                    <div key={tab.id} className="w-full h-full animate-fade-in">
                      {renderTabContent(tab)}
                    </div>
                  ) : null;
                }

                return (
                  <div
                    key={tab.id}
                    className={`w-full h-full ${tab.id === splitTabId ? 'block' : 'hidden'}`}
                  >
                    {renderTabContent(tab)}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
