import React from 'react';
import { Menu, Bell, Search, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getNextTheme = () => {
    switch (theme) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      default:
        return 'light';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default:
        return 'Auto';
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-muted-foreground" />
          </button>
          
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Welcome to your SBC token panel</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(getNextTheme())}
            className="p-2 hover:bg-muted rounded-lg transition-colors group relative"
            title={`Theme: ${getThemeLabel()} (Click to change)`}
          >
            {getThemeIcon()}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-popover text-popover-foreground px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {getThemeLabel()}
            </span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
            <Bell className="w-6 h-6 text-muted-foreground" />
            <div className="absolute top-1 right-1 w-3 h-3 bg-destructive rounded-full"></div>
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-medium text-sm">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
