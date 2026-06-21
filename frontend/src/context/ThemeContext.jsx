import React, { createContext, useState, useEffect } from 'react';

// Create the Context object
export const ThemeContext = createContext();

/**
 * ThemeProvider wraps the application and supplies theme/wallpaper state
 * to any components that need it, persisting data locally in LocalStorage.
 */
export const ThemeProvider = ({ children }) => {
  // Read initial states directly from localStorage (defaulting to dark and neon-cyber)
  const [theme, setTheme] = useState(() => localStorage.getItem('ys_theme') || 'dark');
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('ys_wallpaper') || 'neon-cyber');
  const [loading, setLoading] = useState(false); // No database delay anymore, set loading to false

  // Update HTML class when theme changes to trigger Tailwind's dark selector
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    // Save to localStorage
    localStorage.setItem('ys_theme', theme);
  }, [theme]);

  // Persist wallpaper change
  useEffect(() => {
    localStorage.setItem('ys_wallpaper', wallpaper);
  }, [wallpaper]);

  /**
   * Toggles between light and dark themes.
   */
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  /**
   * Changes the wallpaper theme.
   */
  const changeWallpaper = (newWallpaper) => {
    setWallpaper(newWallpaper);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, wallpaper, changeWallpaper, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};
