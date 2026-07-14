import { useState, useEffect, useCallback } from 'react';
import { ReadmeProject, AppSettings, ReadmeHistoryLog, ReadmeBackup, AppLocale } from '../types';
import { emptyInitialProject } from '../data/templatesData';
import { sanitizeProject } from '../utils/backupUtils';
import * as DB from '../services/localDatabase';

function getBrowserLanguage(): 'pt-BR' | 'en-US' | 'es-419' {
  if (typeof navigator === 'undefined') return 'pt-BR';
  const legacyNavigator = navigator as Navigator & { userLanguage?: string };
  const navLang = (navigator.language || legacyNavigator.userLanguage || '').toLowerCase();
  if (navLang.startsWith('pt')) return 'pt-BR';
  if (navLang.startsWith('en')) return 'en-US';
  if (navLang.startsWith('es')) return 'es-419';
  return 'pt-BR';
}

function normalizeLocale(value: unknown): AppLocale {
  return value === 'en-US' || value === 'es-419' || value === 'pt-BR' ? value : 'pt-BR';
}

const PROJECTS_KEY = 'tp-lab-readme-projects';
const PREFERENCES_KEY = 'tp-lab-readme-preferences';
const HISTORY_KEY = 'tp-lab-readme-history';
const ACTIVE_PROJECT_KEY = 'tp-lab-readme-active';
const MIGRATION_VERSION_KEY = 'readme-db-migration-version';

const defaultPreferences: AppSettings = {
  locale: 'pt-BR',
  theme: 'light',
  showTechnologyBadges: true,
  defaultLicense: '',
  autoSaveDrafts: true,
};

function createEmptyReadmeProject(defaultLicense = ''): ReadmeProject {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
    name: '',
    description: '',
    technologies: [],
    features: [],
    installation: '',
    usage: '',
    license: defaultLicense,
    repositoryUrl: '',
    deployUrl: '',
    customLicense: '',
    websiteUrl: '',
    authorName: '',
    authorEmail: '',
    authorUrl: '',
    linkedinUrl: '',
    screenshots: [],
    optionalSections: {
      prerequisites: false,
      scripts: false,
      folderStructure: false,
      roadmap: false,
      contributing: false,
      authors: false,
      acknowledgements: false,
      contact: false,
      tests: false
    },
    prerequisitesContent: '',
    scriptsContent: '',
    folderStructureContent: '',
    roadmapContent: '',
    contributingContent: '',
    authorsContent: '',
    acknowledgementsContent: '',
    contactContent: '',
    testsContent: '',
    createdAt: now,
    updatedAt: now,
  };
}

export function useReadmeState() {
  // --- STATE DECLARATIONS ---
  const [projects, setProjects] = useState<ReadmeProject[]>([]);
  const [activeProject, setActiveProject] = useState<ReadmeProject>(emptyInitialProject);
  const [preferences, setPreferencesState] = useState<AppSettings>(defaultPreferences);
  const [historyLogs, setHistoryLogs] = useState<ReadmeHistoryLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [persistentStorageStatus, setPersistentStorageStatus] = useState<'granted' | 'denied' | 'unknown'>('unknown');

  // --- SAFE LOCALSTORAGE ACCESS WITH FALLBACKS ---
  const safeGetItem = useCallback((key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`LocalStorage reading is blocked or unavailable for key "${key}":`, e);
      return null;
    }
  }, []);

  const safeSetItem = useCallback((key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn(`LocalStorage writing is blocked or unavailable for key "${key}":`, e);
      return false;
    }
  }, []);

  // Check persistent storage permission status
  const checkPersistenceStatus = useCallback(async () => {
    try {
      if (navigator.storage && navigator.storage.persisted) {
        const persisted = await navigator.storage.persisted();
        setPersistentStorageStatus(persisted ? 'granted' : 'denied');
      }
    } catch (err) {
      console.warn('Error checking storage persistence status:', err);
    }
  }, []);

  // Request storage persistence
  const requestPersistence = useCallback(async () => {
    try {
      if (navigator.storage && navigator.storage.persist) {
        const granted = await navigator.storage.persist();
        setPersistentStorageStatus(granted ? 'granted' : 'denied');
        return granted;
      }
    } catch (err) {
      console.warn('Error requesting storage persistence:', err);
    }
    return false;
  }, []);

  // --- INITIAL DATA LOADING & MIGRATION ---
  useEffect(() => {
    async function loadData() {
      try {
        await DB.initializeDatabase();
        await checkPersistenceStatus();

        // 1. Detect and migrate old data from localStorage if exists and not yet completed
        const migrationVersion = safeGetItem(MIGRATION_VERSION_KEY);
        const storedProjects = safeGetItem(PROJECTS_KEY);
        const storedActive = safeGetItem(ACTIVE_PROJECT_KEY);
        const storedHistory = safeGetItem(HISTORY_KEY);
        const storedPrefs = safeGetItem(PREFERENCES_KEY);

        if (!migrationVersion && (storedProjects || storedActive || storedHistory || storedPrefs)) {
          if (storedProjects) {
            try {
              const parsed = JSON.parse(storedProjects);
              if (Array.isArray(parsed)) {
                for (const proj of parsed) {
                  const updated = { ...proj };
                  if ((!updated.authorName || !updated.authorName.trim()) && updated.author) {
                    updated.authorName = updated.author;
                  }
                  if (updated.authorName === undefined) updated.authorName = '';
                  delete updated.author;

                  if ((!updated.screenshots || updated.screenshots.length === 0) && updated.screenshotUrls && updated.screenshotUrls.length > 0) {
                    updated.screenshots = updated.screenshotUrls.map((url: string, index: number) => ({
                      id: Math.random().toString(36).substring(2, 9) + index,
                      source: url,
                      alt: `Screenshot ${index + 1}`,
                      caption: ''
                    }));
                  }
                  if (!updated.screenshots) updated.screenshots = [];
                  delete updated.screenshotUrls;

                  await DB.saveProject(updated);
                }
              }
            } catch (err) {
              console.error('Failed migrating projects from localStorage:', err);
            }
          }

          if (storedActive) {
            try {
              const parsed = JSON.parse(storedActive);
              if (parsed && parsed.id && parsed.id !== 'space-impacta-initial') {
                await DB.saveActiveDraft(parsed);
              }
            } catch (err) {
              console.error('Failed migrating active draft from localStorage:', err);
            }
          }

          if (storedHistory) {
            try {
              const parsed = JSON.parse(storedHistory);
              if (Array.isArray(parsed)) {
                for (const log of parsed) {
                  await DB.addHistoryEntry(log);
                }
              }
            } catch (err) {
              console.error('Failed migrating history from localStorage:', err);
            }
          }

          if (storedPrefs) {
            try {
              const parsed = JSON.parse(storedPrefs);
              if (parsed) {
                await DB.saveSettings(parsed);
              }
            } catch (err) {
              console.error('Failed migrating preferences from localStorage:', err);
            }
          }

          safeSetItem(MIGRATION_VERSION_KEY, '1');
          try {
            localStorage.removeItem(PROJECTS_KEY);
            localStorage.removeItem(ACTIVE_PROJECT_KEY);
            localStorage.removeItem(HISTORY_KEY);
          } catch {}
        }

        // 2. Load preferences
        let loadedPrefs = await DB.getSettings();
        if (!loadedPrefs) {
          const storedLocalPrefs = safeGetItem(PREFERENCES_KEY);
          if (storedLocalPrefs) {
            try {
              const parsed = JSON.parse(storedLocalPrefs);
              loadedPrefs = {
                locale: parsed.locale || parsed.language || getBrowserLanguage(),
                theme: parsed.theme || 'light',
                showTechnologyBadges: parsed.showTechnologyBadges !== undefined 
                  ? parsed.showTechnologyBadges 
                  : (parsed.showBadges !== undefined ? parsed.showBadges : true),
                defaultLicense: parsed.defaultLicense || '',
                autoSaveDrafts: parsed.autoSaveDrafts !== undefined 
                  ? parsed.autoSaveDrafts 
                  : (parsed.autoSave !== undefined ? parsed.autoSave : true),
              };
            } catch {
              loadedPrefs = { ...defaultPreferences, locale: getBrowserLanguage() };
            }
          } else {
            loadedPrefs = { ...defaultPreferences, locale: getBrowserLanguage() };
          }
          await DB.saveSettings(loadedPrefs);
        }

        // Keep small configs synchronized in localStorage
        safeSetItem('theme', loadedPrefs.theme);
        safeSetItem('i18nextLng', loadedPrefs.locale);
        safeSetItem('autosave', String(loadedPrefs.autoSaveDrafts));
        setPreferencesState(loadedPrefs);

        // 3. Load projects from IndexedDB
        const loadedProjects = await DB.getAllProjects();
        const filteredProjects = loadedProjects.filter(p => p.id !== 'space-impacta-initial');
        setProjects(filteredProjects);

        // 4. Load active draft
        const loadedActive = await DB.getActiveDraft();
        if (loadedActive && loadedActive.id === 'active') {
          setActiveProject(loadedActive);
        } else if (filteredProjects.length > 0) {
          setActiveProject(filteredProjects[0]);
        } else {
          setActiveProject(emptyInitialProject);
        }

        // 5. Load history logs
        const loadedHistory = await DB.getHistory();
        setHistoryLogs(loadedHistory);

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading data from IndexedDB:', err);
        // Fallback gracefully
        setIsLoading(false);
      }
    }

    loadData();
  }, [safeGetItem, safeSetItem, checkPersistenceStatus]);

  // Debounced auto-save to projects list (saved drafts) if autoSaveDrafts is enabled
  useEffect(() => {
    if (isLoading) return;
    if (!preferences.autoSaveDrafts) return;
    if (!activeProject) return;

    // Save activeDraft to active store
    DB.saveActiveDraft(activeProject).catch(err => {
      console.error('Error auto-saving active draft:', err);
    });

    if (!activeProject.name || !activeProject.name.trim()) return;

    const saved = projects.find(p => p.id === activeProject.id);
    if (saved) {
      const keysToCompare: (keyof ReadmeProject)[] = [
        'name', 'description', 'installation', 'usage', 'license', 
        'customLicense', 'repositoryUrl', 'deployUrl', 'websiteUrl', 
        'authorName', 'authorEmail', 'authorUrl', 'linkedinUrl', 'prerequisitesContent',
        'scriptsContent', 'folderStructureContent', 'roadmapContent',
        'contributingContent', 'authorsContent', 'acknowledgementsContent',
        'contactContent', 'testsContent'
      ];
      const hasDiff = keysToCompare.some(k => (activeProject[k] || '') !== (saved[k] || '')) ||
        JSON.stringify(activeProject.technologies) !== JSON.stringify(saved.technologies) ||
        JSON.stringify(activeProject.features) !== JSON.stringify(saved.features) ||
        JSON.stringify(activeProject.screenshots) !== JSON.stringify(saved.screenshots) ||
        JSON.stringify(activeProject.optionalSections) !== JSON.stringify(saved.optionalSections);

      if (!hasDiff) return;
    }

    const timer = setTimeout(async () => {
      const now = new Date().toISOString();
      const isNew = !projects.some(p => p.id === activeProject.id);
      
      const updatedProject = {
        ...activeProject,
        updatedAt: now,
        createdAt: isNew ? now : activeProject.createdAt
      };

      try {
        await DB.saveProject(updatedProject);
        let nextProjects: ReadmeProject[];
        if (isNew) {
          nextProjects = [updatedProject, ...projects];
        } else {
          nextProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
        }
        setProjects(nextProjects);
      } catch (e) {
        console.error('QuotaExceededError or other write error:', e);
        if (e.name === 'QuotaExceededError') {
          alert('⚠️ Limite de Armazenamento Excedido! Por favor, reduza o tamanho das imagens Base64 ou limpe projetos antigos.');
        }
      }
    }, 1000); // 1s debounce

    return () => clearTimeout(timer);
  }, [activeProject, preferences.autoSaveDrafts, projects, isLoading]);

  // --- MUTATION FUNCTIONS ---

  // Update preferences
  const updatePreferences = useCallback(async (newPrefs: Partial<AppSettings>) => {
    setPreferencesState(prev => {
      const updated = { ...prev, ...newPrefs };
      
      DB.saveSettings(updated).catch(err => {
        console.error('Failed to save settings:', err);
      });

      // Keep small configs synchronized in localStorage
      safeSetItem('theme', updated.theme);
      safeSetItem('i18nextLng', updated.locale);
      safeSetItem('autosave', String(updated.autoSaveDrafts));

      // Dynamic theme class application
      if (updated.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else if (updated.theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        // System preference
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isSystemDark) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
      return updated;
    });
  }, [safeSetItem]);

  // Apply theme on system listener
  useEffect(() => {
    if (preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      // Run initial check
      if (mediaQuery.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (preferences.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [preferences.theme]);

  // Add history log (Max 100 entries)
  const addHistoryLog = useCallback(async (action: ReadmeHistoryLog['action'], projectName: string) => {
    const newLog: ReadmeHistoryLog = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      action,
      projectName,
      timestamp: new Date().toISOString(),
    };

    try {
      await DB.addHistoryEntry(newLog);
      const updatedHistory = await DB.getHistory();
      setHistoryLogs(updatedHistory.slice(0, 100));
    } catch (err) {
      console.error('Failed to add history entry:', err);
    }
  }, []);

  // Clear history
  const clearHistory = useCallback(async () => {
    try {
      await DB.clearHistory();
      setHistoryLogs([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  }, []);

  // Save/Update Project
  const saveProject = useCallback(async (projectToSave: ReadmeProject) => {
    const now = new Date().toISOString();
    const isNew = !projects.some(p => p.id === projectToSave.id);
    
    const updatedProject = {
      ...projectToSave,
      updatedAt: now,
      createdAt: isNew ? now : projectToSave.createdAt
    };

    try {
      await DB.saveProject(updatedProject);
      let nextProjects: ReadmeProject[];
      if (isNew) {
        nextProjects = [updatedProject, ...projects];
      } else {
        nextProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
      }
      setProjects(nextProjects);
      setActiveProject(updatedProject);
      addHistoryLog(isNew ? 'created' : 'updated', updatedProject.name);
    } catch (e) {
      console.error('Failed to save project:', e);
      if (e.name === 'QuotaExceededError') {
        alert('⚠️ Limite de Armazenamento Excedido! Por favor, reduza o tamanho das imagens Base64 ou limpe projetos antigos.');
      }
    }
  }, [projects, addHistoryLog]);

  // Duplicate Project
  const duplicateProject = useCallback(async (id: string) => {
    const projectToDuplicate = projects.find(p => p.id === id);
    if (!projectToDuplicate) return;

    const duplicated: ReadmeProject = {
      ...projectToDuplicate,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      name: `${projectToDuplicate.name} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await DB.saveProject(duplicated);
      const nextProjects = [duplicated, ...projects];
      setProjects(nextProjects);
      addHistoryLog('duplicated', projectToDuplicate.name);
      return duplicated;
    } catch (e) {
      console.error('Failed to duplicate project:', e);
    }
    return undefined;
  }, [projects, addHistoryLog]);

  // Delete Project
  const deleteProject = useCallback(async (id: string) => {
    const projectToDelete = projects.find(p => p.id === id);
    if (!projectToDelete) return;

    try {
      await DB.deleteProject(id);
      const nextProjects = projects.filter(p => p.id !== id);
      setProjects(nextProjects);
      
      // If the deleted project was the active one, fallback to first remaining or initial
      if (activeProject.id === id) {
        if (nextProjects.length > 0) {
          setActiveProject(nextProjects[0]);
        } else {
          setActiveProject(emptyInitialProject);
        }
      }
      addHistoryLog('deleted', projectToDelete.name);
    } catch (e) {
      console.error('Failed to delete project:', e);
    }
  }, [projects, activeProject, addHistoryLog]);

  // Create new blank project
  const createNewProject = useCallback(() => {
    const newProj = createEmptyReadmeProject(preferences.defaultLicense);
    setActiveProject(newProj);
    return newProj;
  }, [preferences.defaultLicense]);

  // Load a template (prefills active project with template data, but keeps its own unique ID)
  const loadTemplate = useCallback((templateProject: Partial<ReadmeProject>, templateName: string) => {
    const templateRecord = templateProject as Partial<ReadmeProject> & { author?: unknown };
    const merged: ReadmeProject = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      name: templateProject.name || 'Projeto sem Nome',
      description: templateProject.description || '',
      technologies: templateProject.technologies || [],
      features: templateProject.features || [],
      installation: templateProject.installation || '',
      usage: templateProject.usage || '',
      license: templateProject.license || 'MIT',
      repositoryUrl: templateProject.repositoryUrl || '',
      deployUrl: templateProject.deployUrl || '',
      customLicense: templateProject.customLicense || '',
      websiteUrl: templateProject.websiteUrl || '',
      authorName: templateProject.authorName || (typeof templateRecord.author === 'string' ? templateRecord.author : ''),
      authorEmail: templateProject.authorEmail || '',
      authorUrl: templateProject.authorUrl || '',
      linkedinUrl: templateProject.linkedinUrl || '',
      screenshots: templateProject.screenshots || [],
      optionalSections: templateProject.optionalSections || {
        prerequisites: false,
        scripts: false,
        folderStructure: false,
        roadmap: false,
        contributing: false,
        authors: false,
        acknowledgements: false,
        contact: false,
        tests: false
      },
      prerequisitesContent: templateProject.prerequisitesContent || '',
      scriptsContent: templateProject.scriptsContent || '',
      folderStructureContent: templateProject.folderStructureContent || '',
      roadmapContent: templateProject.roadmapContent || '',
      contributingContent: templateProject.contributingContent || '',
      authorsContent: templateProject.authorsContent || '',
      acknowledgementsContent: templateProject.acknowledgementsContent || '',
      contactContent: templateProject.contactContent || '',
      testsContent: templateProject.testsContent || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setActiveProject(merged);
    addHistoryLog('created', `${merged.name} (via Template: ${templateName})`);
  }, [addHistoryLog]);

  // Clear active project fields
  const clearActiveProject = useCallback(() => {
    setActiveProject(prev => ({
      ...prev,
      name: '',
      description: '',
      technologies: [],
      features: [],
      installation: '',
      usage: '',
      license: '',
      repositoryUrl: '',
      deployUrl: '',
      customLicense: '',
      websiteUrl: '',
      authorName: '',
      authorEmail: '',
      authorUrl: '',
      linkedinUrl: '',
      screenshots: [],
      optionalSections: {
        prerequisites: false,
        scripts: false,
        folderStructure: false,
        roadmap: false,
        contributing: false,
        authors: false,
        acknowledgements: false,
        contact: false,
        tests: false
      },
      prerequisitesContent: '',
      scriptsContent: '',
      folderStructureContent: '',
      roadmapContent: '',
      contributingContent: '',
      authorsContent: '',
      acknowledgementsContent: '',
      contactContent: '',
      testsContent: '',
      updatedAt: new Date().toISOString()
    }));
  }, []);

  // Clear all local data safely
  const clearAllLocalData = useCallback(async () => {
    try {
      await DB.clearAllApplicationData();
      try {
        localStorage.removeItem(PROJECTS_KEY);
        localStorage.removeItem(PREFERENCES_KEY);
        localStorage.removeItem(HISTORY_KEY);
        localStorage.removeItem(ACTIVE_PROJECT_KEY);
        localStorage.removeItem(MIGRATION_VERSION_KEY);
        localStorage.removeItem('theme');
        localStorage.removeItem('i18nextLng');
        localStorage.removeItem('autosave');
      } catch (e) {
        console.error("Failed to delete localStorage keys", e);
      }
      setProjects([]);
      setActiveProject(emptyInitialProject);
      setPreferencesState(defaultPreferences);
      setHistoryLogs([]);
    } catch (e) {
      console.error("Failed to clear local database data:", e);
    }
  }, []);

  // Import backup data with merge or replace mode
  const importBackupData = useCallback(async (backup: ReadmeBackup, mode: 'merge' | 'replace'): Promise<boolean> => {
    try {
      if (mode === 'replace') {
        const sanitizedProjects = backup.projects.map(sanitizeProject);
        const sanitizedActive = backup.activeProject ? sanitizeProject(backup.activeProject) : emptyInitialProject;
        const backupPrefs = (backup.preferences || {}) as Partial<AppSettings> & {
          language?: unknown;
          autoSave?: unknown;
          showBadges?: unknown;
        };
        
        const cleanPrefs: AppSettings = {
          theme: backupPrefs?.theme || 'light',
          locale: normalizeLocale(backupPrefs?.locale || backupPrefs?.language),
          autoSaveDrafts: backupPrefs?.autoSaveDrafts !== undefined 
            ? !!backupPrefs.autoSaveDrafts 
            : (backupPrefs?.autoSave !== undefined ? !!backupPrefs.autoSave : true),
          showTechnologyBadges: backupPrefs?.showTechnologyBadges !== undefined 
            ? !!backupPrefs.showTechnologyBadges 
            : (backupPrefs?.showBadges !== undefined ? !!backupPrefs.showBadges : true),
          defaultLicense: backupPrefs?.defaultLicense || '',
        };
        
        const cleanHistory = Array.isArray(backup.history) ? backup.history.map(log => ({
          id: typeof log.id === 'string' ? log.id : Math.random().toString(36).substring(2, 9),
          action: log.action || 'created',
          projectName: typeof log.projectName === 'string' ? log.projectName : 'Projeto',
          timestamp: typeof log.timestamp === 'string' ? log.timestamp : new Date().toISOString()
        })) : [];

        // Save atomically to IndexedDB first
        await DB.clearAllApplicationData();
        
        for (const proj of sanitizedProjects) {
          await DB.saveProject(proj);
        }
        await DB.saveActiveDraft(sanitizedActive);
        await DB.saveSettings(cleanPrefs);
        for (const log of cleanHistory) {
          await DB.addHistoryEntry(log);
        }

        // Keep small configs synchronized in localStorage
        safeSetItem('theme', cleanPrefs.theme);
        safeSetItem('i18nextLng', cleanPrefs.locale);
        safeSetItem('autosave', String(cleanPrefs.autoSaveDrafts));

        setProjects(sanitizedProjects);
        setActiveProject(sanitizedActive);
        setPreferencesState(cleanPrefs);
        setHistoryLogs(cleanHistory);
        return true;
      } else {
        // mode === 'merge'
        const incomingProjects = backup.projects.map(sanitizeProject);
        const updatedProjectsList = [...projects];

        for (const incProj of incomingProjects) {
          const existingIdx = updatedProjectsList.findIndex(p => p.id === incProj.id);
          if (existingIdx !== -1) {
            const existingProj = updatedProjectsList[existingIdx];
            
            const isIdentical = 
              existingProj.name === incProj.name &&
              existingProj.description === incProj.description &&
              JSON.stringify(existingProj.technologies) === JSON.stringify(incProj.technologies) &&
              JSON.stringify(existingProj.features) === JSON.stringify(incProj.features) &&
              existingProj.installation === incProj.installation &&
              existingProj.usage === incProj.usage;
              
            if (isIdentical) {
              continue;
            } else {
              const newId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
              const renamedProj = {
                ...incProj,
                id: newId,
                name: `${incProj.name} (Importado)`
              };
              await DB.saveProject(renamedProj);
              updatedProjectsList.unshift(renamedProj);
            }
          } else {
            await DB.saveProject(incProj);
            updatedProjectsList.unshift(incProj);
          }
        }

        setProjects(updatedProjectsList);
        return true;
      }
    } catch (err) {
      console.error('Failed to import backup data safely into IndexedDB:', err);
      return false;
    }
  }, [projects, safeSetItem]);

  return {
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
    addHistoryLog,
    createNewProject,
    loadTemplate,
    clearActiveProject,
    clearAllLocalData,
    importBackupData,
    isLoading,
    persistentStorageStatus,
    requestPersistence,
  };
}
