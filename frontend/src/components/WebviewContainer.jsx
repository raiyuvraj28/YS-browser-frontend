import React, { useEffect, useRef, useContext } from 'react';
import { BrowserContext } from '../context/BrowserContext.jsx';

/**
 * WebviewContainer houses the Electron <webview> tag.
 * It hooks into Electron native events to update tab settings and history logs.
 */
function WebviewContainer({ tab }) {
  const { updateTab, addHistory } = useContext(BrowserContext);
  const webviewRef = useRef(null);

  useEffect(() => {
    const isElectron = window.navigator.userAgent.toLowerCase().includes('electron');
    const webview = webviewRef.current;
    if (!webview || !isElectron) return;

    // 1. Event: Start Loading
    const handleStartLoading = () => {
      updateTab(tab.id, { isLoading: true });
    };

    // 2. Event: Stop Loading
    const handleStopLoading = () => {
      updateTab(tab.id, { isLoading: false });
    };

    // 3. Event: Title Updated
    const handleTitleUpdated = (e) => {
      updateTab(tab.id, { title: e.title });
    };

    // 4. Event: Favicon Updated
    const handleFaviconUpdated = (e) => {
      if (e.favicons && e.favicons.length > 0) {
        updateTab(tab.id, { favicon: e.favicons[0] });
      }
    };

    // 5. Event: Navigation Completed (loads URL and updates page controls)
    const handleNavigate = () => {
      const currentUrl = webview.getURL();
      const currentTitle = webview.getTitle();
      
      updateTab(tab.id, {
        url: currentUrl,
        canGoBack: webview.canGoBack(),
        canGoForward: webview.canGoForward()
      });

      // Log to browsing history
      addHistory(currentTitle || 'Untitled Page', currentUrl, tab.favicon);
    };

    // 6. Event: DOM is Ready (we inject CSS for ad blocking here)
    const handleDomReady = async () => {
      // Check if adblocker is active inside localStorage (defaults to true)
      const adBlockerEnabled = localStorage.getItem('ys_adblock_enabled') !== 'false';

      if (adBlockerEnabled) {
        try {
          // Inject CSS rules to hide typical advertisements, banners, and Google Ad iframes
          await webview.insertCSS(`
            iframe[src*="doubleclick.net"],
            iframe[src*="adsystem"],
            iframe[src*="googleads"],
            div[class*="ad-banner"],
            div[id*="google_ads"],
            .ad, .ads, .advertisement,
            [class*="sponsored-post"],
            aside[class*="ad"],
            amp-ad {
              display: none !important;
              visibility: hidden !important;
              height: 0 !important;
              width: 0 !important;
            }
          `);
        } catch (err) {
          console.warn('Failed to inject AdBlocker styles:', err.message);
        }
      }
    };

    // Attach event listeners to webview node
    webview.addEventListener('did-start-loading', handleStartLoading);
    webview.addEventListener('did-stop-loading', handleStopLoading);
    webview.addEventListener('page-title-updated', handleTitleUpdated);
    webview.addEventListener('page-favicon-updated', handleFaviconUpdated);
    webview.addEventListener('did-navigate', handleNavigate);
    webview.addEventListener('did-navigate-in-page', handleNavigate);
    webview.addEventListener('dom-ready', handleDomReady);

    // Clean up event listeners on unmount
    return () => {
      webview.removeEventListener('did-start-loading', handleStartLoading);
      webview.removeEventListener('did-stop-loading', handleStopLoading);
      webview.removeEventListener('page-title-updated', handleTitleUpdated);
      webview.removeEventListener('page-favicon-updated', handleFaviconUpdated);
      webview.removeEventListener('did-navigate', handleNavigate);
      webview.removeEventListener('did-navigate-in-page', handleNavigate);
      webview.removeEventListener('dom-ready', handleDomReady);
    };
  }, [tab.id, tab.favicon]);

  const isElectron = typeof window !== 'undefined' && window.navigator.userAgent.toLowerCase().includes('electron');

  return (
    <div className="w-full h-full relative bg-[#0b0c10]">
      {/* Loading Overlay spinner */}
      {tab.isLoading && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse z-40"></div>
      )}
      
      {isElectron ? (
        <webview
          ref={webviewRef}
          src={tab.url}
          data-tab-id={tab.id}
          allowpopups="true"
          className="w-full h-full border-none rounded-xl"
          style={{ background: '#ffffff' }}
        />
      ) : (
        <iframe
          src={tab.url}
          className="w-full h-full border-none rounded-xl bg-white"
          title={tab.title}
        />
      )}
    </div>
  );
}

export default WebviewContainer;
