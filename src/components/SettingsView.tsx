import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppSettings, ReadmeProject, ReadmeHistoryLog, ReadmeBackup, AppLocale } from '../types';
import { 
  Settings, 
  Moon, 
  Sun, 
  Languages, 
  Save, 
  Award, 
  FileCheck,
  CheckCircle2,
  Shield,
  Download,
  Upload,
  Trash2,
  Lock,
  AlertTriangle,
  Info
} from 'lucide-react';
import { validateBackup, isBackupTooLarge } from '../utils/backupUtils';
import { downloadFile } from '../utils/readmeUtils';

interface SettingsViewProps {
  preferences: AppSettings;
  onUpdatePreferences: (prefs: Partial<AppSettings>) => void;
  projects: ReadmeProject[];
  activeProject: ReadmeProject;
  historyLogs: ReadmeHistoryLog[];
  onClearAllData: () => void;
  onImportBackup: (backup: ReadmeBackup, mode: 'merge' | 'replace') => Promise<boolean>;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  persistentStorageStatus: 'granted' | 'denied' | 'unknown';
  onRequestPersistence: () => Promise<boolean>;
}

// Custom Accessible Modal Component with Focus Trapping and Escape-close
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  descriptionId: string;
  children: React.ReactNode;
  triggerButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  descriptionId,
  children,
  triggerButtonRef
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement;

    // Wait a brief tick for modal rendering
    const timer = setTimeout(() => {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
      }
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;
        const first = focusableElements[0] as HTMLElement;
        const last = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      if (triggerButtonRef && triggerButtonRef.current) {
        triggerButtonRef.current.focus();
      } else if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, [isOpen, onClose, triggerButtonRef]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />
      {/* Modal Box */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={descriptionId}
        className="relative bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-xl z-10 transition-transform scale-100 animate-in fade-in zoom-in-95 duration-150"
      >
        <h3 id="modal-title" className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
};

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  onUpdatePreferences,
  projects,
  activeProject,
  historyLogs,
  onClearAllData,
  onImportBackup,
  showToast,
  persistentStorageStatus,
  onRequestPersistence,
}) => {
  const { t, i18n } = useTranslation();

  // Temporary local draft state for preferences
  const [draftPrefs, setDraftPrefs] = useState<AppSettings>(preferences);
  const [isSaving, setIsSaving] = useState(false);

  // Sync draft state if global preferences change (e.g. on reset or backup import)
  useEffect(() => {
    setDraftPrefs(preferences);
  }, [preferences]);

  // Modal states
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [isReplaceConfirmOpen, setIsReplaceConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isQuotaErrorOpen, setIsQuotaErrorOpen] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<ReadmeBackup | null>(null);

  // Button Trigger Refs for Return Focus
  const exportBtnRef = useRef<HTMLButtonElement>(null);
  const importBtnRef = useRef<HTMLButtonElement>(null);
  const deleteBtnRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasChanges = JSON.stringify(draftPrefs) !== JSON.stringify(preferences);

  // Handle single field change in local draft
  const handleFieldChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setDraftPrefs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Commit and Save draft preferences to the global state
  const handleSaveSettings = () => {
    if (!hasChanges) return;
    setIsSaving(true);
    setTimeout(() => {
      // First update the i18n language
      i18n.changeLanguage(draftPrefs.locale);
      onUpdatePreferences(draftPrefs);
      setIsSaving(false);

      // Set lang attribute on html tag
      if (typeof document !== 'undefined') {
        document.documentElement.lang = draftPrefs.locale;
        document.documentElement.dir = 'ltr';
      }

      // Exact user-requested message for toast
      let successMsg = '';
      if (draftPrefs.locale === 'pt-BR') {
        successMsg = 'Configurações salvas. Idioma alterado para Português do Brasil.';
      } else if (draftPrefs.locale === 'en-US') {
        successMsg = 'Settings saved. Language changed to English.';
      } else if (draftPrefs.locale === 'es-419') {
        successMsg = 'Configuración guardada. Idioma cambiado a Español.';
      }
      showToast(successMsg, 'success');
    }, 600);
  };

  // Export backup to JSON file
  const handleExportBackup = () => {
    try {
      const backup: ReadmeBackup = {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        appName: "README",
        activeProject: activeProject,
        projects: projects,
        history: historyLogs,
        preferences: preferences
      };
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `readme-backup-${dateStr}.json`;
      const content = JSON.stringify(backup, null, 2);
      const downloaded = downloadFile(content, filename, 'application/json');

      showToast(downloaded ? t('toasts.backup_exported_success') : t('toasts.backup_exported_error'), downloaded ? 'success' : 'error');
    } catch (err) {
      showToast(t('toasts.backup_exported_error'), 'error');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      showToast(t('toasts.backup_invalid_file'), 'error');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);

        // Validate structure
        if (!validateBackup(parsed)) {
          showToast(t('toasts.backup_invalid_file'), 'error');
          return;
        }

        // Check size / quota safe check
        const isTooLarge = isBackupTooLarge(
          parsed.projects,
          parsed.activeProject,
          parsed.preferences,
          parsed.history
        );

        if (isTooLarge) {
          setIsQuotaErrorOpen(true);
          return;
        }

        setPendingBackup(parsed);
        setIsChoiceModalOpen(true);
      } catch (err) {
        showToast(t('toasts.backup_invalid_file'), 'error');
      }
    };

    reader.onerror = () => {
      showToast(t('toasts.backup_imported_error'), 'error');
    };

    reader.readAsText(file);
    e.target.value = ''; // Reset
  };

  // Merge execution
  const handleMergeBackup = async () => {
    if (!pendingBackup) return;
    const success = await onImportBackup(pendingBackup, 'merge');
    setIsChoiceModalOpen(false);
    setPendingBackup(null);
    if (success) {
      showToast(t('toasts.backup_merged_success'), 'success');
    } else {
      showToast(t('toasts.backup_merged_error'), 'error');
    }
  };

  // Replace verification open
  const handleOpenReplaceConfirm = () => {
    setIsChoiceModalOpen(false);
    setIsReplaceConfirmOpen(true);
  };

  // Replace execution
  const handleReplaceBackup = async () => {
    if (!pendingBackup) return;
    const success = await onImportBackup(pendingBackup, 'replace');
    setIsReplaceConfirmOpen(false);
    setPendingBackup(null);
    if (success) {
      showToast(t('toasts.backup_imported_success'), 'success');
    } else {
      showToast(t('toasts.backup_imported_error'), 'error');
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleClearAllData = () => {
    onClearAllData();
    setIsDeleteConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-sans font-bold text-text-primary tracking-tight">
            {t('settings.title').split(' ')[0]} <span className="text-primary font-extrabold">{t('settings.title').substring(t('settings.title').indexOf(' ') + 1)}</span>
          </h2>
          <p className="text-sm text-text-secondary">
            {t('settings.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual Settings Card */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-small space-y-6">
          <div className="flex items-center space-x-3 border-b border-border pb-3">
            <div className="p-2 bg-primary-soft text-primary rounded-xl">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary text-sm">{t('settings.theme_title')}</h3>
              <p className="text-[10px] text-text-secondary">{t('settings.theme_desc')}</p>
            </div>
          </div>

          {/* Theme select options */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide">
              {t('settings.theme_title')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['light', 'dark', 'system'] as const).map((tValue) => {
                const isActive = draftPrefs.theme === tValue;
                const labels = {
                  light: t('settings.themes.light'),
                  dark: t('settings.themes.dark'),
                  system: t('settings.themes.system'),
                };
                return (
                  <button
                    key={tValue}
                    type="button"
                    onClick={() => handleFieldChange('theme', tValue)}
                    className={`px-3 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'border-primary bg-primary-soft text-primary font-bold shadow-small'
                        : 'border-border bg-surface-secondary text-text-secondary hover:bg-border/20'
                    }`}
                  >
                    {tValue === 'light' && <Sun className="w-4 h-4" />}
                    {tValue === 'dark' && <Moon className="w-4 h-4" />}
                    {tValue === 'system' && <Settings className="w-4 h-4" />}
                    <span>{labels[tValue]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Badge Display toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="space-y-0.5 pr-2">
              <label className="text-xs font-bold text-text-primary block">
                {t('settings.badge_title')}
              </label>
              <p className="text-xs text-text-secondary">
                {t('settings.badge_desc')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleFieldChange('showTechnologyBadges', !draftPrefs.showTechnologyBadges)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer flex-shrink-0 ${
                draftPrefs.showTechnologyBadges ? 'bg-primary' : 'bg-border-strong'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  draftPrefs.showTechnologyBadges ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Application Defaults Settings Card */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-small space-y-6">
          <div className="flex items-center space-x-3 border-b border-border pb-3">
            <div className="p-2 bg-primary-soft text-primary rounded-xl">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary text-sm">{t('settings.language_title')}</h3>
              <p className="text-[10px] text-text-secondary">{t('settings.language_desc')}</p>
            </div>
          </div>

          {/* Language selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide">
              {t('settings.language_title')}
            </label>
            <div className="relative">
              <select
                value={draftPrefs.locale}
                onChange={(e) => handleFieldChange('locale', e.target.value as AppLocale)}
                className="w-full bg-surface text-text-primary border border-border hover:border-border-strong focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors appearance-none shadow-small cursor-pointer"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English</option>
                <option value="es-419">Español</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-text-muted">
                ▼
              </div>
            </div>
          </div>

          {/* Default License preset */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide">
              {t('settings.license_title')}
            </label>
            <div className="relative">
              <select
                value={draftPrefs.defaultLicense}
                onChange={(e) => handleFieldChange('defaultLicense', e.target.value)}
                className="w-full bg-surface text-text-primary border border-border hover:border-border-strong focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors appearance-none shadow-small cursor-pointer"
              >
                <option value="MIT">MIT</option>
                <option value="Apache 2.0">Apache 2.0</option>
                <option value="GPL 3.0">GPL 3.0</option>
                <option value="BSD 3-Clause">BSD 3-Clause</option>
                <option value="Proprietária">Proprietária</option>
                <option value="Sem licença">Sem licença</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-text-muted">
                ▼
              </div>
            </div>
          </div>

          {/* Auto Save toggle switch */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="space-y-0.5 pr-2">
              <label className="text-xs font-bold text-text-primary block">
                {t('settings.autosave_title')}
              </label>
              <p className="text-xs text-text-secondary">
                {t('settings.autosave_desc')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleFieldChange('autoSaveDrafts', !draftPrefs.autoSaveDrafts)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer flex-shrink-0 ${
                draftPrefs.autoSaveDrafts ? 'bg-primary' : 'bg-border-strong'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  draftPrefs.autoSaveDrafts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Save Settings Button Bar */}
      <div className="flex justify-end pt-1 pb-1 sm:pt-2 sm:pb-2">
        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={!hasChanges || isSaving}
          className={`w-full sm:w-auto flex items-center justify-center space-x-2 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] sm:min-h-[40px] cursor-pointer ${
            !hasChanges 
              ? 'bg-border-strong text-text-muted border-border cursor-not-allowed opacity-60 shadow-none' 
              : 'bg-primary hover:bg-primary-hover active:scale-95'
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? t('settings.saving_btn') : t('settings.save_btn')}</span>
        </button>
      </div>

      {/* ================= PRIVACIDADE E ARMAZENAMENTO ================= */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-small space-y-6">
        <div className="flex items-center space-x-3 border-b border-border pb-3">
          <div className="p-2 bg-primary-soft text-primary rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-sm">{t('settings.backup_title')}</h3>
            <p className="text-[10px] text-text-secondary">{t('settings.backup_desc').split('.')[0]}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-text-primary leading-snug">
              {t('settings.backup_desc')}
            </p>
            <p className="text-xs text-text-muted italic flex items-center gap-1.5 mt-2">
              <Info className="w-3.5 h-3.5 text-primary" />
              <span>{t('settings.backup_warning')}</span>
            </p>
          </div>

          {/* Local Storage & Persistence Information */}
          <div className="border-t border-border pt-4 space-y-4 text-xs">
            <div className="bg-surface-secondary border border-border rounded-xl p-4 space-y-3 leading-relaxed">
              <div className="flex items-start gap-2 text-text-primary">
                <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">{t('settings.local_storage_info')}</span>
                  <span className="text-text-secondary mt-1 block">{t('settings.privacy_notice')}</span>
                </div>
              </div>

              <div className="border-t border-border/60 my-2 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-text-primary block">Armazenamento Persistente</span>
                  <p className="text-text-secondary text-[11px]">
                    {persistentStorageStatus === 'granted' 
                      ? t('settings.persistent_storage_enabled') 
                      : t('settings.persistent_storage_disabled')}
                  </p>
                </div>
                {persistentStorageStatus !== 'granted' && (
                  <button
                    type="button"
                    onClick={onRequestPersistence}
                    className="flex items-center space-x-1 bg-surface hover:bg-border/10 text-text-primary border border-border px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer text-[11px]"
                  >
                    {t('settings.persistent_storage_btn')}
                  </button>
                )}
              </div>

              <div className="border-t border-border/60 pt-2 flex items-start gap-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium leading-relaxed">
                  {t('settings.domain_transition_warning')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
            {/* Export backup button */}
            <button
              ref={exportBtnRef}
              type="button"
              onClick={handleExportBackup}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer min-h-[40px]"
              aria-label={t('settings.export_btn')}
            >
              <Download className="w-4 h-4" />
              <span>{t('settings.export_btn')}</span>
            </button>

            {/* Import backup button */}
            <button
              ref={importBtnRef}
              type="button"
              onClick={handleImportClick}
              className="flex items-center space-x-2 bg-surface-secondary hover:bg-border/20 text-text-primary text-xs font-semibold py-2.5 px-4 rounded-xl border border-border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer min-h-[40px]"
              aria-label={t('settings.import_btn')}
            >
              <Upload className="w-4 h-4" />
              <span>{t('settings.import_btn')}</span>
            </button>

            {/* Hidden Input for File selection */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="sr-only"
              aria-label="Backup JSON file"
            />

            {/* Delete local data button */}
            <button
              ref={deleteBtnRef}
              type="button"
              onClick={handleDeleteClick}
              className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/10 dark:hover:bg-red-950/20 text-xs font-semibold py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-900/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer min-h-[40px] ml-auto sm:ml-0"
              aria-label={t('settings.clear_data_btn')}
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('settings.clear_data_btn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Version Status Summary block (WCAG clean notice, no Status: Online) */}
      <div className="bg-surface-secondary border border-border p-5 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-xs text-text-secondary font-medium">
            {t('settings.status_clean_notice')}
          </span>
        </div>
      </div>

      {/* --- BACKUP DIALOGS & ACCESSIBLE MODALS --- */}

      {/* 1. Choice Modal: Merge vs Replace */}
      <AccessibleModal
        isOpen={isChoiceModalOpen}
        onClose={() => {
          setIsChoiceModalOpen(false);
          setPendingBackup(null);
        }}
        title={t('settings.backup_import_title')}
        descriptionId="choice-modal-desc"
        triggerButtonRef={importBtnRef}
      >
        <div id="choice-modal-desc" className="space-y-4 my-4">
          <p className="text-xs text-text-secondary">
            {t('settings.backup_import_desc')}
          </p>

          <div className="space-y-3">
            {/* Merge Option */}
            <button
              type="button"
              onClick={handleMergeBackup}
              className="w-full text-left p-3.5 border border-border hover:border-primary bg-surface-secondary hover:bg-primary-soft/10 rounded-xl transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <div className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
                {t('settings.backup_merge_title')}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                {t('settings.backup_merge_desc')}
              </div>
            </button>

            {/* Replace Option */}
            <button
              type="button"
              onClick={handleOpenReplaceConfirm}
              className="w-full text-left p-3.5 border border-border hover:border-red-500 bg-surface-secondary hover:bg-red-50/20 dark:hover:bg-red-950/10 rounded-xl transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
            >
              <div className="font-bold text-sm text-text-primary group-hover:text-red-600 transition-colors">
                {t('settings.backup_replace_title')}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                {t('settings.backup_replace_desc')}
              </div>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => {
              setIsChoiceModalOpen(false);
              setPendingBackup(null);
            }}
            className="px-4 py-2 bg-surface-secondary hover:bg-border/20 text-text-secondary text-xs font-semibold rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            {t('confirm_dialog.btn_cancel')}
          </button>
        </div>
      </AccessibleModal>

      {/* 2. Replace Confirmation Modal */}
      <AccessibleModal
        isOpen={isReplaceConfirmOpen}
        onClose={() => {
          setIsReplaceConfirmOpen(false);
          setPendingBackup(null);
        }}
        title={t('settings.backup_replace_confirm_title')}
        descriptionId="replace-confirm-desc"
        triggerButtonRef={importBtnRef}
      >
        <div id="replace-confirm-desc" className="space-y-3 my-4">
          <div className="p-3 bg-red-50 dark:bg-red-950/10 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/30 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed font-medium">
              {t('settings.backup_replace_confirm_warning')}
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {t('settings.backup_replace_confirm_desc')}
          </p>
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              setIsReplaceConfirmOpen(false);
              setPendingBackup(null);
            }}
            className="px-4 py-2 bg-surface-secondary hover:bg-border/20 text-text-secondary text-xs font-semibold rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer animate-none"
          >
            {t('confirm_dialog.btn_cancel')}
          </button>
          <button
            type="button"
            onClick={handleReplaceBackup}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
          >
            {t('settings.backup_replace_confirm_btn')}
          </button>
        </div>
      </AccessibleModal>

      {/* 3. Delete All Confirmation Modal */}
      <AccessibleModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title={t('settings.delete_all_confirm_title')}
        descriptionId="delete-confirm-desc"
        triggerButtonRef={deleteBtnRef}
      >
        <div id="delete-confirm-desc" className="space-y-3 my-4">
          <div className="p-3 bg-red-50 dark:bg-red-950/10 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/30 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed font-medium">
              {t('settings.delete_all_confirm_warning')}
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {t('settings.delete_all_confirm_desc_new')}
          </p>
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => setIsDeleteConfirmOpen(false)}
            className="px-4 py-2 bg-surface-secondary hover:bg-border/20 text-text-secondary text-xs font-semibold rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            {t('confirm_dialog.btn_cancel')}
          </button>
          <button
            type="button"
            onClick={handleClearAllData}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
          >
            {t('settings.delete_all_confirm_btn')}
          </button>
        </div>
      </AccessibleModal>

      {/* 4. Quota Error Modal */}
      <AccessibleModal
        isOpen={isQuotaErrorOpen}
        onClose={() => setIsQuotaErrorOpen(false)}
        title={t('settings.quota_error_title')}
        descriptionId="quota-error-desc"
        triggerButtonRef={importBtnRef}
      >
        <div id="quota-error-desc" className="space-y-3 my-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-900/30 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed font-medium">
              {t('settings.quota_error_warning')}
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {t('settings.quota_error_desc')}
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => setIsQuotaErrorOpen(false)}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            {t('settings.quota_error_btn')}
          </button>
        </div>
      </AccessibleModal>
    </div>
  );
};
