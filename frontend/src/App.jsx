import React, { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext.jsx';
import MainLayout from './layouts/MainLayout.jsx';

/**
 * App component renders the primary container for the browser,
 * setting the appropriate wallpaper style and theme classes.
 */
function App() {
  const { theme, wallpaper } = useContext(ThemeContext);

  // Return the CSS classes for each custom wallpaper setting
  const getWallpaperClass = () => {
    switch (wallpaper) {
      case 'neon-cyber':
        return 'bg-[#0a0b10] bg-cyberpunk-grid relative overflow-hidden';
      case 'aurora-borealis':
        return 'bg-aurora-gradient relative overflow-hidden';
      case 'deep-space':
        return 'bg-space-gradient relative overflow-hidden';
      case 'glass-frost':
        return 'bg-frost-gradient relative overflow-hidden';
      default:
        return 'bg-[#0a0b10]';
    }
  };

  return (
    <div className={`h-screen w-screen flex flex-col ${getWallpaperClass()} ${theme} transition-all duration-500`}>
      
      {/* 
        Futuristic Ambient Light Blobs:
        These are large blurred colored nodes placed behind the glass panels 
        to give the app a beautiful glowing, colorful, three-dimensional depth.
      */}
      {wallpaper === 'neon-cyber' && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-pink-500/15 blur-[150px] pointer-events-none animate-pulse"></div>
        </>
      )}
      
      {wallpaper === 'aurora-borealis' && (
        <>
          <div className="absolute top-[-5%] right-[10%] w-[65%] h-[40%] rounded-full bg-emerald-500/12 blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[55%] rounded-full bg-teal-500/12 blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }}></div>
          <div className="absolute top-[30%] left-[30%] w-[35%] h-[35%] rounded-full bg-purple-500/8 blur-[110px] pointer-events-none"></div>
        </>
      )}
      
      {wallpaper === 'deep-space' && (
        <>
          <div className="absolute top-[-15%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-600/12 blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }}></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/12 blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: '14s' }}></div>
          <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none"></div>
        </>
      )}
      
      {wallpaper === 'glass-frost' && (
        <>
          <div className="absolute top-[10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-orange-400/20 dark:bg-orange-500/8 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '7s' }}></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-400/20 dark:bg-cyan-500/8 blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '9s' }}></div>
        </>
      )}
      
      {/* Load Main Layout */}
      <MainLayout />
    </div>
  );
}

export default App;
