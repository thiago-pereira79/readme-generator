import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  X, 
  Sparkles, 
  PenTool, 
  Eye, 
  Trash2, 
  Plus, 
  LayoutGrid,
  Code2,
  Folder,
  History,
  Settings,
  XOctagon,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useReadmeState } from './hooks/useReadmeState';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { AppHeader } from './components/AppHeader';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ReadmeEditor } from './components/ReadmeEditor';
import { TemplatesView } from './components/TemplatesView';
import { ProjectsView } from './components/ProjectsView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { ReadmeProject, AppLocale } from './types';
import { initialProject, ReadmeTemplate } from './data/templatesData';
import { 
  validateProject, 
  savePreviewSnapshot, 
  readPreviewSnapshot, 
  PREVIEW_CHANNEL_NAME, 
  ReadmePreviewSnapshot 
} from './utils/previewBridge';
import { generateReadmeMarkdown } from './utils/readmeUtils';

const PreviewPage = React.lazy(() =>
  import('./components/PreviewPage').then(module => ({ default: module.PreviewPage }))
);

export default function App() {
  const { t, i18n } = useTranslation();
  const {
    projects,
    activeProject,
    setActiveProject,
    preferences,
    updatePreferences,
    historyLogs,
    clearHistory,
    saveProject,
    deleteProject,
    duplicateProject,
    createNewProject,
    loadTemplate,
    clearActiveProject,
    clearAllLocalData,
    importBackupData,
    isLoading,
    persistentStorageStatus,
    requestPersistence,
  } = useReadmeState();

  // --- DETECT EXCLUSIVE PREVIEW ROUTE ---
  const isPreviewRoute = typeof window !== 'undefined' && (
    window.location.pathname === '/preview' || 
    window.location.pathname === '/preview/' ||
    window.location.hash === '#/preview' ||
    window.location.hash === '#/preview/' ||
    window.location.search.includes('view=preview')
  );

  // --- WORKSPACE NAVIGATION STATE ---
  const [currentTab, setCurrentTab] = useState<string>('generator');
  const [mobileActiveSubTab, setMobileActiveSubTab] = useState<'edit' | 'preview'>('edit');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const previousMainTabRef = useRef<string | null>(null);

  // --- CONFIRM DIALOG STATE ---
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {},
  });

  // --- CUSTOM TOAST/NOTIFICATION STATE ---
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'info' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ isOpen: true, message, type });
  };

  // Auto hide toast
  useEffect(() => {
    if (toast.isOpen) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, isOpen: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.isOpen]);

  // Handle locking background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen]);

  // Reset document scroll only when the main app view changes.
  useEffect(() => {
    if (isPreviewRoute) return;

    if (previousMainTabRef.current === null) {
      previousMainTabRef.current = currentTab;
      return;
    }

    if (previousMainTabRef.current === currentTab) return;

    previousMainTabRef.current = currentTab;

    const scrollContainer = document.scrollingElement || document.documentElement;
    scrollContainer.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });

    if (window.scrollY !== 0 || window.scrollX !== 0) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
    }
  }, [currentTab, isPreviewRoute]);

  // --- PREVIEW WINDOW AND SNAPSHOT REFS ---
  const previewWindowRef = useRef<Window | null>(null);
  const latestPreviewSnapshotRef = useRef<ReadmePreviewSnapshot | null>(null);

  // Always keep latestPreviewSnapshotRef.current up-to-date with activeProject
  useEffect(() => {
    const validation = validateProject(activeProject);
    if (validation.valid) {
      const markdown = generateReadmeMarkdown(
        activeProject,
        preferences.showTechnologyBadges,
        i18n.language as AppLocale
      );
      latestPreviewSnapshotRef.current = {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        projectId: activeProject.id,
        projectName: activeProject.name,
        locale: i18n.language as AppLocale,
        project: typeof structuredClone !== 'undefined' ? structuredClone(activeProject) : JSON.parse(JSON.stringify(activeProject)),
        markdown,
      };
    } else {
      latestPreviewSnapshotRef.current = null;
    }
  }, [activeProject, preferences.showTechnologyBadges, i18n.language]);

  // Return focus/navigation from the independent preview tab to the editor.
  useEffect(() => {
    const handleReturnToEditor = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type !== 'RETURN_TO_README_EDITOR') {
        return;
      }

      setCurrentTab('generator');
      setMobileActiveSubTab('edit');
      setIsMobileDrawerOpen(false);

      window.focus();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
    };

    window.addEventListener('message', handleReturnToEditor);
    return () => {
      window.removeEventListener('message', handleReturnToEditor);
    };
  }, []);

  // Handle direct postMessage messages (e.g. PREVIEW_READY) from the opened preview tab
  useEffect(() => {
    const handlePreviewMessage = (event: MessageEvent) => {
      // Security check: only accept messages from our own origin
      if (event.origin !== window.location.origin) {
        return;
      }

      if (previewWindowRef.current && event.source !== previewWindowRef.current) {
        return;
      }

      // Check if it's the preview ready signal
      if (event.data?.type === 'PREVIEW_READY') {
        // Target only our opened preview window reference if possible, otherwise use event.source as safe fallback
        const targetWindow = (previewWindowRef.current || event.source) as Window;
        const snapshot = latestPreviewSnapshotRef.current;

        if (snapshot) {
          targetWindow.postMessage(
            {
              type: 'PREVIEW_SNAPSHOT',
              payload: snapshot,
            },
            window.location.origin
          );
        } else {
          console.warn('[README Preview] PREVIEW_READY received but no latest snapshot is set in ref.');
        }
      }
    };

    window.addEventListener('message', handlePreviewMessage);
    return () => {
      window.removeEventListener('message', handlePreviewMessage);
    };
  }, []);

  // BroadcastChannel handshake fallback: listen for PREVIEW_READY and reply with PREVIEW_SNAPSHOT
  useEffect(() => {
    const channel = new BroadcastChannel(PREVIEW_CHANNEL_NAME);
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PREVIEW_READY') {
        const snapshot = latestPreviewSnapshotRef.current;
        if (snapshot) {
          channel.postMessage({
            type: 'PREVIEW_SNAPSHOT',
            payload: snapshot,
          });
        }
      }
    };
    channel.addEventListener('message', handleMessage);
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, []);

  // Live sync of editor changes to the preview tab (debounced 400ms) using postMessage & fallback methods
  useEffect(() => {
    const timer = setTimeout(() => {
      const snapshot = latestPreviewSnapshotRef.current;
      if (!snapshot) return;

      // 1. Send via direct postMessage if preview window reference is alive and open
      if (previewWindowRef.current && !previewWindowRef.current.closed) {
        try {
          previewWindowRef.current.postMessage(
            {
              type: 'PREVIEW_SNAPSHOT',
              payload: snapshot,
            },
            window.location.origin
          );
        } catch (e) {
          console.warn('[README Preview] Error real-time syncing via postMessage:', e);
        }
      }

      // 2. LocalStorage persistence (partitioned/fallback)
      savePreviewSnapshot(snapshot);

      // 3. BroadcastChannel (fallback)
      try {
        const channel = new BroadcastChannel(PREVIEW_CHANNEL_NAME);
        channel.postMessage({
          type: 'PREVIEW_SNAPSHOT',
          payload: snapshot,
        });
        channel.close();
      } catch (e) {
        // Safe to ignore in highly partitioned iframe environments
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [activeProject, preferences.showTechnologyBadges, i18n.language]);

  if (isPreviewRoute) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-background text-text-primary flex items-center justify-center">Carregando preview...</div>}>
        <PreviewPage
          showBadges={preferences.showTechnologyBadges}
        />
      </React.Suspense>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-text-primary">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-text-secondary">Carregando dados locais...</p>
        </div>
      </div>
    );
  }

  // --- BUSINESS LOGIC AND DIALOGS TRIPPERS ---

  // Detect unsaved workspace changes compared to saved database
  const hasUnsavedChanges = (): boolean => {
    // If it's a completely empty project, it's safe to overwrite
    if (!activeProject.name.trim() && !activeProject.description.trim()) {
      return false;
    }
    // Check if the current state differs from the saved version in localStorage
    const saved = projects.find(p => p.id === activeProject.id);
    if (!saved) return true; // not saved yet

    const keysToCompare: (keyof ReadmeProject)[] = [
      'name', 'description', 'installation', 'usage', 'license', 
      'customLicense', 'repositoryUrl', 'deployUrl', 'websiteUrl', 
      'authorName', 'authorEmail', 'linkedinUrl'
    ];

    const stringDiff = keysToCompare.some(k => (activeProject[k] || '') !== (saved[k] || ''));
    const techDiff = JSON.stringify(activeProject.technologies) !== JSON.stringify(saved.technologies);
    const featureDiff = JSON.stringify(activeProject.features) !== JSON.stringify(saved.features);
    const screenshotsDiff = JSON.stringify(activeProject.screenshots) !== JSON.stringify(saved.screenshots);
    const optionalsDiff = JSON.stringify(activeProject.optionalSections) !== JSON.stringify(saved.optionalSections);

    return stringDiff || techDiff || featureDiff || screenshotsDiff || optionalsDiff;
  };

  // "Novo Projeto" Trigger
  const handleNewProjectTrigger = () => {
    setIsMobileDrawerOpen(false);
    
    const startNew = () => {
      const blank = createNewProject();
      setCurrentTab('generator');
      setMobileActiveSubTab('edit');
      showToast('Novo rascunho de projeto iniciado.', 'success');
    };

    if (hasUnsavedChanges()) {
      setConfirmDialog({
        isOpen: true,
        title: 'Descartar alterações?',
        message: 'Você possui alterações não salvas no rascunho atual. Deseja realmente iniciar um novo projeto e descartar o rascunho?',
        type: 'warning',
        onConfirm: () => {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          startNew();
        },
      });
    } else {
      startNew();
    }
  };

  // "Limpar Tudo" Trigger
  const handleClearTrigger = () => {
    setConfirmDialog({
      isOpen: true,
      title: t('confirm_dialog.clear_editor_title'),
      message: t('confirm_dialog.clear_editor_message'),
      type: 'danger',
      onConfirm: () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        clearActiveProject();
        showToast('Campos do editor limpos.', 'info');
      },
    });
  };

  // "Salvar Rascunho" action
  const handleSaveDraft = () => {
    if (!activeProject.name.trim()) {
      showToast('Por favor, informe o nome do projeto para poder salvar.', 'error');
      return;
    }
    saveProject(activeProject);
    showToast('Rascunho salvo no navegador com sucesso!', 'success');
  };

  // "Gerar README" final action
  const handleGenerateReadme = () => {
    // 1. Validate current project before opening a new tab.
    const currentProject = activeProject;
    const validation = validateProject(currentProject);
    if (!validation.valid) {
      showToast(validation.errors[0], 'error');
      return;
    }

    // 2. Generate Markdown and snapshot synchronously from the current click.
    const markdown = generateReadmeMarkdown(
      currentProject,
      preferences.showTechnologyBadges,
      i18n.language as AppLocale
    );

    // 3. Create preview snapshot.
    const snapshot: ReadmePreviewSnapshot = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      projectId: currentProject.id,
      projectName: currentProject.name,
      locale: i18n.language as AppLocale,
      project: typeof structuredClone !== 'undefined' ? structuredClone(currentProject) : JSON.parse(JSON.stringify(currentProject)),
      markdown,
    };

    latestPreviewSnapshotRef.current = snapshot;

    // 4. Save snapshot to localStorage.
    const saved = savePreviewSnapshot(snapshot);

    // 5. Verify write.
    const verification = readPreviewSnapshot();
    if (!saved || !verification) {
      showToast(
        i18n.language === 'en-US'
          ? 'Failed to prepare preview. Data was not saved.'
          : i18n.language === 'es-419'
          ? 'No se pudo preparar la vista previa. Los datos no se guardaron.'
          : 'Não foi possível preparar o preview. Os dados não foram salvos.',
        'error'
      );
      return;
    }

    // 6. Open the preview synchronously during the user gesture.
    const previewUrl = new URL('/?view=preview', window.location.origin).toString();
    const previewWindow = window.open(previewUrl, 'readme-preview');
    if (!previewWindow) {
      showToast(
        i18n.language === 'en-US'
          ? 'The browser blocked the preview tab. Allow popups for this site and try again.'
          : i18n.language === 'es-419'
          ? 'El navegador bloqueó la pestaña de vista previa. Permite ventanas emergentes para este sitio e inténtalo de nuevo.'
          : 'O navegador bloqueou a nova guia do preview. Permita pop-ups para este site e tente novamente.',
        'error'
      );
      return;
    }

    previewWindowRef.current = previewWindow;

    // 7. Save project to history/drafts without delaying the window.open call.
    saveProject(currentProject);

    // 8. Broadcast updated project to open tabs/windows.
    try {
      const channel = new BroadcastChannel(PREVIEW_CHANNEL_NAME);
      channel.postMessage({ type: 'PREVIEW_SNAPSHOT', payload: snapshot });
      channel.close();
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }

    try {
      previewWindow.focus();
    } catch (e) {
      console.warn('Could not focus preview window:', e);
    }

    // 10. Show success toast
    showToast('README gerado com sucesso!', 'success');
  };

  // Selecting a template
  const handleSelectTemplateTrigger = (template: ReadmeTemplate) => {
    const apply = () => {
      if (template.id === 'tpl-scratch') {
        createNewProject();
        setCurrentTab('generator');
        setMobileActiveSubTab('edit');
        showToast(
          i18n.language === 'en-US' 
            ? 'New blank project started.' 
            : i18n.language === 'es-419' 
            ? 'Nuevo proyecto en blanco iniciado.' 
            : 'Novo projeto em branco iniciado.', 
          'success'
        );
      } else {
        loadTemplate(template.project, template.name);
        setCurrentTab('generator');
        setMobileActiveSubTab('edit');
        showToast(
          i18n.language === 'en-US' 
            ? `Template "${template.name}" loaded.` 
            : i18n.language === 'es-419' 
            ? `Plantilla "${template.name}" cargada.` 
            : `Template "${template.name}" carregado.`, 
          'success'
        );
      }
    };

    if (hasUnsavedChanges()) {
      setConfirmDialog({
        isOpen: true,
        title: i18n.language === 'en-US' 
          ? 'Discard changes?' 
          : i18n.language === 'es-419' 
          ? '¿Descartar cambios?' 
          : 'Descartar alterações?',
        message: i18n.language === 'en-US' 
          ? 'You have unsaved changes in the current draft. Choosing this template will replace the active draft. Do you wish to continue?' 
          : i18n.language === 'es-419' 
          ? 'Tienes cambios sin guardar en el borrador actual. Elegir esta plantilla reemplazará el borrador activo. ¿Deseas continuar?' 
          : 'Você possui alterações não salvas no rascunho atual. Escolher este template substituirá os dados do rascunho ativo. Deseja continuar?',
        type: 'warning',
        onConfirm: () => {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          apply();
        },
      });
    } else {
      apply();
    }
  };

  // Load "Space Impacta" example
  const handleLoadExample = () => {
    const example = initialProject;
    const loaded = {
      ...structuredClone(example),
      id: activeProject.id,
    };
    saveProject(loaded);
    showToast("Exemplo carregado com sucesso.", "success");
  };

  // Deleting a project trigger
  const handleDeleteProjectTrigger = (id: string) => {
    const proj = projects.find(p => p.id === id);
    const projectName = proj?.name || 'sem nome';
    setConfirmDialog({
      isOpen: true,
      title: t('confirm_dialog.delete_saved_draft_title'),
      message: t('confirm_dialog.delete_saved_draft_message', { name: projectName, projectName }),
      type: 'danger',
      onConfirm: () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        deleteProject(id);
        showToast('Projeto excluído com sucesso.', 'info');
      },
    });
  };

  // Duplicate a project trigger
  const handleDuplicateProject = async (id: string) => {
    const dup = await duplicateProject(id);
    if (dup) {
      showToast(`Cópia de "${dup.name}" criada.`, 'success');
    }
  };

  // Edit a saved project (loads into workspace)
  const handleEditProject = (project: ReadmeProject) => {
    setActiveProject(project);
    setCurrentTab('generator');
    setMobileActiveSubTab('edit');
    showToast(`Carregado: ${project.name}`, 'info');
  };

  // Mobile navigation drawer toggle
  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen);
  };

  // Helper to change sidebar tab and close mobile drawer
  const navigateToTab = (tab: string) => {
    setCurrentTab(tab);
    setIsMobileDrawerOpen(false);
  };

  const isDark = preferences.theme === 'dark';

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary transition-colors duration-200">
      {/* 1. Header component */}
      <AppHeader
        preferences={preferences}
        onThemeToggle={() => updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' })}
        onNewProject={handleNewProjectTrigger}
        onLogoClick={() => navigateToTab('generator')}
      />
      
      {/* Mobile Top Sub-Header Bar (Menu Hamburguer & Mobile Drawer toggler) */}
      <div className="lg:hidden h-12 bg-surface-secondary px-4 flex items-center justify-between">
        <button
          onClick={toggleMobileDrawer}
          className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-background transition-colors focus:outline-none cursor-pointer"
          aria-label="Menu de Navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic header title based on active tab */}
        <span className="text-sm font-bold text-text-primary font-sans">
          {currentTab === 'generator' && t('sidebar.tab_generator')}
          {currentTab === 'templates' && t('sidebar.tab_templates')}
          {currentTab === 'projects' && t('sidebar.tab_projects')}
          {currentTab === 'history' && t('sidebar.tab_history')}
          {currentTab === 'settings' && t('sidebar.tab_settings')}
        </span>

        <div className="w-8" /> {/* Balance space spacer */}
      </div>

      {/* --- WORKSPACE BODY CONTAINER --- */}
      <div className="flex-1 flex flex-col lg:flex-row w-full relative">
        
        {/* 2. Desktop Sidebar */}
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* 3. Mobile Navigation Drawer (Collapsible slide-in menu) */}
        <AnimatePresence>
          {isMobileDrawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              {/* Drawer backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileDrawerOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-xs"
              />

              {/* Drawer Panel content */}
              <motion.div
                initial={false}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="relative w-72 bg-surface layout-sidebar-divider h-full flex flex-col justify-between p-5 shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Code2 className="w-5 h-5 text-primary" />
                      <span className="font-bold text-sm tracking-tight">
                        {i18n.language === 'en-US' ? 'Menu README' : i18n.language === 'es-419' ? 'Menú README' : 'Menu README'}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="p-1 text-text-muted hover:text-text-primary rounded-md"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer List items */}
                  <nav className="flex flex-col space-y-1">
                    {[
                      { id: 'generator', label: t('sidebar.tab_generator'), icon: PenTool },
                      { id: 'projects', label: t('sidebar.tab_projects'), icon: Folder },
                      { id: 'history', label: t('sidebar.tab_history'), icon: History },
                      { id: 'settings', label: t('sidebar.tab_settings'), icon: Settings },
                    ].map(item => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => navigateToTab(item.id)}
                          className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                            isActive
                              ? 'text-primary bg-primary-soft font-bold'
                              : 'text-text-secondary hover:bg-background'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>

                  {/* CTA "Ver templates" para mobile */}
                  {currentTab !== 'templates' && (
                    <div className="mt-5 px-1">
                      <button
                        onClick={() => navigateToTab('templates')}
                        className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>{t('sidebar.quick_tip_btn')}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Drawer bottom info footer */}
                <div className="border-t border-border pt-4">
                  <div className="text-xs font-semibold text-text-primary">README</div>
                  <div className="text-[10px] text-text-muted font-mono leading-tight">
                    {i18n.language === 'en-US' ? 'Version 1.0.0' : i18n.language === 'es-419' ? 'Versión 1.0.0' : 'Versão 1.0.0'}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 4. MAIN CONTENT PANEL AREA */}
        <main className="flex-1 min-w-0 p-6 md:p-8 lg:p-10 transition-colors duration-200">
          
          {/* Main Workspace content selector switch */}
          {currentTab === 'generator' && (
            <div className="max-w-[900px] mx-auto w-full space-y-6">
              {/* Main Greeting Banner Card */}
              <div className="bg-surface border border-border p-5 max-[480px]:py-3 max-[480px]:px-4 md:p-6 rounded-2xl shadow-small flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-[480px]:space-y-0.5">
                  <h2 className="text-2xl md:text-3xl max-[480px]:text-xl font-sans font-black text-text-primary tracking-tight">
                    {t('greeting.title_normal')}<span className="text-primary">{t('greeting.title_highlighted')}</span>
                  </h2>
                  <p className="text-sm md:text-sm max-[480px]:text-xs text-text-secondary max-w-2xl leading-relaxed max-[480px]:leading-snug">
                    {t('greeting.subtitle')}
                  </p>
                </div>
              </div>

              {/* Centered and comfortable maximum width for the form */}
              <div className="w-full">
                <ReadmeEditor
                  project={activeProject}
                  onChange={setActiveProject}
                  onClear={handleClearTrigger}
                  onSave={handleSaveDraft}
                  onGenerate={handleGenerateReadme}
                  onLoadExample={handleLoadExample}
                />
              </div>
            </div>
          )}

          {currentTab === 'templates' && (
            <div className="max-w-[900px] mx-auto w-full">
              <TemplatesView onSelectTemplate={handleSelectTemplateTrigger} />
            </div>
          )}

          {currentTab === 'projects' && (
            <div className="max-w-[900px] mx-auto w-full">
              <ProjectsView
                projects={projects}
                onEditProject={handleEditProject}
                onCreateProject={handleNewProjectTrigger}
                onDuplicateProject={handleDuplicateProject}
                onDeleteProject={handleDeleteProjectTrigger}
                showToast={showToast}
              />
            </div>
          )}

          {currentTab === 'history' && (
            <div className="max-w-[900px] mx-auto w-full">
              <HistoryView logs={historyLogs} onClearHistory={clearHistory} />
            </div>
          )}

          {currentTab === 'settings' && (
            <div className="max-w-[900px] mx-auto w-full">
              <SettingsView
                preferences={preferences}
                onUpdatePreferences={updatePreferences}
                projects={projects}
                activeProject={activeProject}
                historyLogs={historyLogs}
                onClearAllData={clearAllLocalData}
                onImportBackup={importBackupData}
                showToast={showToast}
                persistentStorageStatus={persistentStorageStatus}
                onRequestPersistence={requestPersistence}
              />
            </div>
          )}

        </main>
      </div>

      {/* Footer is placed here - full-width, perfectly below the workspace container */}
      <Footer />

      {/* --- SYSTEM-WIDE GLOBAL PORTAL COMPONENTS --- */}

      {/* Confirmation Backdrop Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Floating alert micro-toast message */}
      <AnimatePresence>
        {toast.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div
              className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl border shadow-card text-xs font-semibold ${
                toast.type === 'success'
                  ? 'bg-green-500/10 text-green-600 border-green-500/20'
                  : toast.type === 'info'
                  ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                  : 'bg-red-500/10 text-red-600 border-red-500/20'
              }`}
              role="alert"
              aria-live="polite"
            >
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />}
              {toast.type === 'info' && <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
