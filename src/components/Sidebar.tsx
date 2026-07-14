import React from 'react';
import { useTranslation } from 'react-i18next';
import { PenTool, Folder, History, Settings, Sparkles, FileText } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'generator', label: t('sidebar.tab_generator'), icon: PenTool },
    { id: 'projects', label: t('sidebar.tab_projects'), icon: Folder },
    { id: 'history', label: t('sidebar.tab_history'), icon: History },
    { id: 'settings', label: t('sidebar.tab_settings'), icon: Settings },
  ];

  return (
    <aside className="w-[280px] bg-surface layout-sidebar-divider p-6 sticky top-16 self-start hidden lg:flex flex-col justify-between select-none transition-colors duration-200 h-[calc(100vh-64px)] shrink-0">
      <div className="flex flex-col space-y-6">
        {/* Menu Navigation items */}
        <nav className="flex flex-col space-y-1.5">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary-soft dark:bg-primary-soft/10 font-semibold'
                    : 'text-text-secondary hover:bg-background/50 hover:text-text-primary'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Dica Rápida Card */}
      {currentTab !== 'templates' && (
        <div className="flex flex-col pt-5">
          <div className="quick-tip-card p-5 rounded-2xl relative overflow-hidden group">
            <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>{t('sidebar.quick_tip_title')}</span>
            </div>
            <p className="text-xs text-text-secondary mb-3 leading-relaxed">
              {t('sidebar.quick_tip_desc')}
            </p>
            <button
              onClick={() => setCurrentTab('templates')}
              className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer active:scale-[0.98]"
            >
              {t('sidebar.quick_tip_btn')}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
