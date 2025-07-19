import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage for saved theme preference
    const saved = localStorage.getItem('sbc-theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    // Default to system
    return 'system';
  });

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        // Use system preference
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(systemDark ? 'dark' : 'light');
      } else {
        root.classList.add(theme);
      }
    };

    applyTheme();
    
    // Save to localStorage
    localStorage.setItem('sbc-theme', theme);

    // Listen for system theme changes when theme is 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      
      return () => {
        mediaQuery.removeEventListener('change', applyTheme);
      };
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => {
      switch (prev) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'system';
        default:
          return 'light';
      }
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
