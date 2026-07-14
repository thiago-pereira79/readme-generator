import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Sun, Moon, Plus } from 'lucide-react';
import { ReadmePreferences } from '../types';

interface AppHeaderProps {
  preferences: ReadmePreferences;
  onThemeToggle: () => void;
  onNewProject: () => void;
  onLogoClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  preferences,
  onThemeToggle,
  onNewProject,
  onLogoClick,
}) => {
  const { t } = useTranslation();
  const isDark = preferences.theme === 'dark';

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-surface layout-header-divider px-4 md:px-8 flex items-center justify-between transition-colors duration-200">
      {/* Left: Logo and title */}
      <button
        type="button"
        onClick={onLogoClick}
        aria-label={t('header.logo_aria')}
        className="flex items-center space-x-3 cursor-pointer rounded-xl bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform">
          <FileText className="w-5.5 h-5.5" />
        </div>
        <div className="hidden sm:block">
          <h1 className="font-sans font-bold text-lg text-text-primary tracking-tight">README</h1>
          <p className="text-xs text-text-secondary leading-none">{t('header.logo_subtitle')}</p>
        </div>
      </button>

      {/* Right: Theme, Nav, Action */}
      <div className="flex items-center space-x-3 md:space-x-6">
        {/* Theme Toggle slider */}
        <div className="flex items-center space-x-2">
          <Sun className={`w-4 h-4 ${isDark ? 'text-text-muted' : 'text-amber-500'}`} />
          <button
            onClick={onThemeToggle}
            className="relative w-11 h-6 bg-border-strong rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Alternar tema"
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                isDark ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <Moon className={`w-4 h-4 ${isDark ? 'text-primary' : 'text-text-muted'}`} />
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onNewProject}
          className="flex items-center space-x-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md transition-all duration-200 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t('header.btn_new_project')}</span>
        </button>
      </div>
    </header>
  );
};
