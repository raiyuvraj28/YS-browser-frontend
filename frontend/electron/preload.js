import { contextBridge, ipcRenderer } from 'electron';

// We expose a secure API to the global 'window.electronAPI' object in the React renderer process.
// This prevents exposing raw Electron or Node modules directly to the web page, which would be a security risk.
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Triggers a screenshot of the browser window.
   * Returns a promise that resolves to a base64 encoded image Data URL (PNG).
   */
  captureScreenshot: () => ipcRenderer.invoke('capture-screenshot')
});
