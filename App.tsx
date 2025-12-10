import React, { useState, useEffect } from 'react';
import BrainModel from './components/BrainModel';
import InfoPanel from './components/InfoPanel';
import { INITIAL_BRAIN_REGIONS } from './constants';
import { BrainRegionData, Language } from './types';
import { Sun, Moon, Languages, Info, Box, Layers, Eye } from 'lucide-react';

const STORAGE_KEY = 'neurovis_data_v2'; // Bumped version for new data structure

const App: React.FC = () => {
  const [regions, setRegions] = useState<BrainRegionData[]>(INITIAL_BRAIN_REGIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('zh');
  const [darkMode, setDarkMode] = useState(true);
  const [isTranslucentMode, setIsTranslucentMode] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
           // Basic validation or migration could go here
           setRegions(parsed);
        }
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  // Save to local storage whenever regions change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(regions));
  }, [regions]);

  // Handlers
  const handleRegionUpdate = (updatedRegion: BrainRegionData) => {
    setRegions(prev => prev.map(r => r.id === updatedRegion.id ? updatedRegion : r));
  };

  const toggleLanguage = () => setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  const toggleTheme = () => setDarkMode(prev => !prev);
  const toggleTranslucent = () => setIsTranslucentMode(prev => !prev);

  const selectedRegionData = regions.find(r => r.id === selectedId);

  // Apply dark mode class to root for Tailwind
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`w-full h-screen relative flex overflow-hidden ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-slate-900`}>
      
      {/* Main 3D Canvas Area - Resizes when panel opens */}
      <main className={`relative h-full transition-all duration-500 ease-in-out ${selectedRegionData ? 'w-1/2' : 'w-full'}`}>
        <BrainModel
          regions={regions}
          selectedId={selectedId}
          onSelect={setSelectedId}
          language={language}
          darkMode={darkMode}
          isTranslucentMode={isTranslucentMode}
        />
        
        {/* Floating UI Controls (attached to the 3D view) */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-3 pointer-events-none">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 drop-shadow-md pointer-events-auto">
                <Box className="text-blue-500" />
                NeuroVis 3D
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] pointer-events-auto">
                {language === 'zh' ? '交互式三维大脑解剖模型' : 'Interactive 3D Brain Anatomy Model'}
            </p>
        </div>

        <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
                onClick={toggleTranslucent}
                className={`p-2 rounded-full shadow-lg hover:scale-105 transition border border-gray-200 dark:border-slate-700 backdrop-blur ${
                  isTranslucentMode 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-200'
                }`}
                title={language === 'zh' ? '切换透视模式' : 'Toggle Translucent Mode'}
            >
                {isTranslucentMode ? <Eye size={20} /> : <Layers size={20} />}
            </button>
            <button
                onClick={toggleLanguage}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur p-2 rounded-full shadow-lg hover:scale-105 transition border border-gray-200 dark:border-slate-700"
                title="Switch Language"
            >
                <Languages size={20} className="text-gray-700 dark:text-gray-200" />
            </button>
            <button
                onClick={toggleTheme}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur p-2 rounded-full shadow-lg hover:scale-105 transition border border-gray-200 dark:border-slate-700"
                title="Toggle Theme"
            >
                {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}
            </button>
        </div>

        {/* Instructions Hint */}
        {!selectedId && !isTranslucentMode && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <div className="bg-black/50 backdrop-blur text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
                    <Info size={16} />
                    {language === 'zh' ? '点击大脑区域查看详情 • 拖动旋转 • 滚轮缩放' : 'Click regions for details • Drag to rotate • Scroll to zoom'}
                </div>
            </div>
        )}
         {isTranslucentMode && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <div className="bg-purple-600/80 backdrop-blur text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
                    <Eye size={16} />
                    {language === 'zh' ? '透视模式：海马体高亮显示' : 'Translucent Mode: Hippocampus Highlighted'}
                </div>
            </div>
        )}
      </main>

      {/* Slide-in Info Panel Container (Right Side) */}
      <aside 
        className={`h-full bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-700 shadow-2xl z-30 overflow-hidden transition-all duration-500 ease-in-out flex flex-col ${
            selectedRegionData ? 'w-1/2 translate-x-0 opacity-100' : 'w-0 translate-x-full opacity-0'
        }`}
      >
          {selectedRegionData && (
            <InfoPanel
              data={selectedRegionData}
              onClose={() => setSelectedId(null)}
              onUpdate={handleRegionUpdate}
              language={language}
            />
          )}
      </aside>
    </div>
  );
};

export default App;