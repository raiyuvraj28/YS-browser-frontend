import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { BrowserProvider } from './context/BrowserContext.jsx';
import './styles/index.css'; // Import the Tailwind and glassmorphic styles

// Mount the React Application on the #root element in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserProvider>
        <App />
      </BrowserProvider>
    </ThemeProvider>
  </React.StrictMode>
);
