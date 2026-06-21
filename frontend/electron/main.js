import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to file paths (required when using ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

/**
 * Creates the main desktop application window.
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "YS Browser",
    // We use standard titlebar/frame here for maximum beginner-friendliness and operating system compatibility,
    // but we will style the browser interface inside to look incredibly futuristic and glassmorphic.
    frame: true,
    webPreferences: {
      // Load the preload.js script to establish a secure communication bridge
      preload: path.join(__dirname, 'preload.js'),
      // Security best practices: disable nodeIntegration and enable contextIsolation
      nodeIntegration: false,
      contextIsolation: true,
      // CRITICAL: Enable the <webview> tag so we can render external websites in our browser tabs
      webviewTag: true,
      // Allow running plugins in webviews
      plugins: true
    },
  });

  // Remove the default Electron menu bar for a cleaner, modern look
  mainWindow.setMenuBarVisibility(false);

  // In development mode, load Vite's local dev server. In production, load the built index.html.
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.webContents.openDevTools();
    
    // Load Vite server. We handle load failures (if Vite is still starting up)
    // by waiting 1 second and retrying, avoiding the ERR_CONNECTION_REFUSED screen!
    const loadURLWithRetry = () => {
      mainWindow.loadURL('http://localhost:5173').catch(() => {
        console.log('Vite server is not ready yet. Retrying connection in 1 second...');
        setTimeout(loadURLWithRetry, 1000);
      });
    };
    
    loadURLWithRetry();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle window closed event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// When Electron has finished initialization, create the window
app.whenReady().then(() => {
  createWindow();

  // On macOS, recreate a window when the dock icon is clicked and no other windows are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS (where apps typically stay active until cmd+Q)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handler: Capture a screenshot of the main browser window
ipcMain.handle('capture-screenshot', async () => {
  if (!mainWindow) return null;
  try {
    // capturePage returns a NativeImage object containing the screenshot
    const image = await mainWindow.capturePage();
    // Return the image as a base64 Data URL (png) so React can easily display or download it
    return image.toDataURL();
  } catch (error) {
    console.error("Failed to capture screenshot:", error);
    return null;
  }
});
