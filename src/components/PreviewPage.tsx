import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Eye, 
  Copy, 
  Check, 
  Download, 
  ArrowLeft, 
  RefreshCw, 
  Sparkles, 
  FileText, 
  Printer,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ReadmeProject, AppLocale } from '../types';
import {
  copyTextToClipboard,
  generateReadmeMarkdown,
  createSlug,
  downloadFile,
  getReadmeDownloadFilename,
  ClipboardCopyStatus
} from '../utils/readmeUtils';
import { exportToPdf, printElement } from '../utils/exportPdf';
import { AnimatePresence, motion } from 'motion/react';
import {
  PREVIEW_CHANNEL_NAME,
  getPreviewStorageKey,
  readPreviewSnapshotForProject,
  validateSnapshot,
  hasPreviewSnapshotKeyForProject,
  ReadmePreviewSnapshot,
  savePreviewSnapshot
} from '../utils/previewBridge';

interface PreviewPageProps {
  showBadges: boolean;
  onGoBack?: () => void;
}

export const PreviewPage: React.FC<PreviewPageProps> = ({ showBadges }) => {
  const { t, i18n } = useTranslation();
  const previewProjectId = new URLSearchParams(window.location.search).get('projectId');
  
  type PreviewLoadState = 'loading' | 'ready' | 'empty' | 'error';

  const isSnapshotForThisPreview = (candidate: ReadmePreviewSnapshot): boolean => {
    return !previewProjectId || candidate.projectId === previewProjectId;
  };

  const readSnapshotForThisPreview = (): ReadmePreviewSnapshot | null => {
    const loaded = readPreviewSnapshotForProject(previewProjectId);
    return loaded && isSnapshotForThisPreview(loaded) ? loaded : null;
  };

  const hasSnapshotKeyForThisPreview = (): boolean => {
    return hasPreviewSnapshotKeyForProject(previewProjectId);
  };

  const saveSnapshotForThisPreview = (candidate: ReadmePreviewSnapshot): boolean => {
    if (!isSnapshotForThisPreview(candidate)) {
      return false;
    }

    return savePreviewSnapshot(candidate);
  };

  // 1. Load state and validation state
  const [snapshot, setSnapshot] = useState<ReadmePreviewSnapshot | null>(() => {
    return readSnapshotForThisPreview();
  });

  const [loadState, setLoadState] = useState<PreviewLoadState>(() => {
    const loaded = readSnapshotForThisPreview();
    if (loaded && loaded.project) {
      return 'ready';
    }
    return 'loading';
  });

  const [isSnapshotCorrupted, setIsSnapshotCorrupted] = useState<boolean>(() => {
    if (hasSnapshotKeyForThisPreview()) {
      return readSnapshotForThisPreview() === null;
    }
    return false;
  });

  const [isCrossOriginMismatch, setIsCrossOriginMismatch] = useState<boolean>(() => {
    if (window.opener) {
      try {
        const openerOrigin = window.opener.origin || window.opener.location.origin;
        if (openerOrigin && openerOrigin !== window.location.origin) {
          console.warn("[README Preview] Origin mismatch detected:", window.location.origin, "vs opener", openerOrigin);
          return true;
        }
      } catch (e) {
        console.warn("[README Preview] Security exception when accessing opener. Different origin!", e);
        return true;
      }
    }
    return false;
  });

  // Derived state: active project and markdown text
  const previewProject = snapshot ? snapshot.project : null;
  const markdownText = snapshot ? snapshot.markdown : '';

  const [previewMode, setPreviewMode] = useState<'visual' | 'markdown'>('visual');
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showPrintFallback, setShowPrintFallback] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'info' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success',
  });

  const pdfExportRef = useRef<HTMLDivElement>(null);
  const retryIntervalRef = useRef<number | null>(null);
  const stopRetryTimeoutRef = useRef<number | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ isOpen: true, message, type });
  };

  const getCopyFailureMessage = (status: Exclude<ClipboardCopyStatus, 'success'>): string => {
    if (status === 'permission-denied') return t('toasts.copy_permission_denied');
    if (status === 'unavailable') return t('toasts.copy_unavailable');
    return t('toasts.copy_error');
  };

  // Toast auto-hide
  useEffect(() => {
    if (toast.isOpen) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, isOpen: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.isOpen]);

  // Load and validate from localStorage
  const loadSnapshot = () => {
    const loaded = readSnapshotForThisPreview();
    if (loaded) {
      setSnapshot(loaded);
      setIsSnapshotCorrupted(false);
      setLoadState('ready');
      return loaded;
    } else if (hasSnapshotKeyForThisPreview()) {
      setIsSnapshotCorrupted(true);
      setLoadState('error');
    }
    return null;
  };

  // Handshake with window.opener and setup 3s loading timeout
  useEffect(() => {
    const initialSnapshot = readSnapshotForThisPreview();
    if (initialSnapshot) {
      setLoadState('ready');
      // Send one PREVIEW_READY ready signal to editor in case they want to handshake
      if (window.opener) {
        try {
          window.opener.postMessage(
            { type: 'PREVIEW_READY', projectId: previewProjectId },
            window.location.origin
          );
        } catch (e) {
          // ignore opener access issues
        }
      }
      return;
    }

    // 3-second timeout to display empty state if no snapshot received
    const timeoutId = window.setTimeout(() => {
      setLoadState(prev => {
        if (prev === 'loading') {
          return 'empty';
        }
        return prev;
      });
    }, 3000);

    const sendReady = () => {
      if (window.opener) {
        try {
          window.opener.postMessage(
            {
              type: 'PREVIEW_READY',
              projectId: previewProjectId,
            },
            window.location.origin
          );
        } catch (e) {
          console.warn('[README Preview] Error sending PREVIEW_READY:', e);
        }
      }
    };

    // Send initial signal
    sendReady();

    // Retry every 500ms
    const retryIntervalId = window.setInterval(sendReady, 500);

    // Stop retrying after 5 seconds
    const stopRetryTimeoutId = window.setTimeout(() => {
      clearInterval(retryIntervalId);
    }, 5000);

    retryIntervalRef.current = retryIntervalId;
    stopRetryTimeoutRef.current = stopRetryTimeoutId;

    return () => {
      clearTimeout(timeoutId);
      clearInterval(retryIntervalId);
      clearTimeout(stopRetryTimeoutId);
      retryIntervalRef.current = null;
      stopRetryTimeoutRef.current = null;
    };
  }, []);

  // Listen for direct postMessage messages (e.g. PREVIEW_SNAPSHOT) from the editor
  useEffect(() => {
    const handleEditorMessage = (event: MessageEvent) => {
      // Security check: only accept messages from our own origin
      if (event.origin !== window.location.origin) {
        return;
      }

      if (window.opener && event.source !== window.opener) {
        return;
      }

      // Handle the snapshot
      if (event.data?.type === 'PREVIEW_SNAPSHOT') {
        const messageProjectId = typeof event.data.projectId === 'string' ? event.data.projectId : null;
        if (previewProjectId && messageProjectId !== previewProjectId) {
          return;
        }

        const payload = event.data.payload;

        if (validateSnapshot(payload) && isSnapshotForThisPreview(payload)) {
          // Clear retries immediately since we successfully received the snapshot!
          if (retryIntervalRef.current !== null) {
            clearInterval(retryIntervalRef.current);
            retryIntervalRef.current = null;
          }
          if (stopRetryTimeoutRef.current !== null) {
            clearTimeout(stopRetryTimeoutRef.current);
            stopRetryTimeoutRef.current = null;
          }

          setSnapshot(payload);
          setIsSnapshotCorrupted(false);
          setLoadState('ready');

          // Save snapshot locally in this tab's partition!
          saveSnapshotForThisPreview(payload);
        } else {
          console.warn('[README Preview] Invalid snapshot received via postMessage.');
          setLoadState('error');
          setIsSnapshotCorrupted(true);
        }
      }
    };

    window.addEventListener('message', handleEditorMessage);
    return () => {
      window.removeEventListener('message', handleEditorMessage);
    };
  }, []);

  // BroadcastChannel Handshake: Signal ready and handle snapshot messages
  useEffect(() => {
    const channel = new BroadcastChannel(PREVIEW_CHANNEL_NAME);
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PREVIEW_SNAPSHOT') {
        const messageProjectId = typeof event.data.projectId === 'string' ? event.data.projectId : null;
        if (previewProjectId && messageProjectId !== previewProjectId) {
          return;
        }

        const payload = event.data.payload;
        if (validateSnapshot(payload) && isSnapshotForThisPreview(payload)) {
          setSnapshot(payload);
          setIsSnapshotCorrupted(false);
          setLoadState('ready');
          saveSnapshotForThisPreview(payload);
        } else {
          setIsSnapshotCorrupted(true);
          setLoadState('error');
        }
      }
    };
    channel.addEventListener('message', handleMessage);

    // Send fallback PREVIEW_READY signal
    try {
      channel.postMessage({ type: 'PREVIEW_READY', projectId: previewProjectId });
    } catch (e) {
      // Ignore broadcast errors in partitioned iframe environment
    }

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, []);

  // Sync fallback using standard 'storage' event listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === getPreviewStorageKey(previewProjectId) && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (validateSnapshot(parsed) && isSnapshotForThisPreview(parsed)) {
            setSnapshot(parsed);
            setIsSnapshotCorrupted(false);
            setLoadState('ready');
            saveSnapshotForThisPreview(parsed);
          } else {
            setIsSnapshotCorrupted(true);
            setLoadState('error');
          }
        } catch (err) {
          console.error('[README Preview] Error parsing storage event snapshot:', err);
          setIsSnapshotCorrupted(true);
          setLoadState('error');
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Dynamic Browser Tab Title updating
  useEffect(() => {
    const defaultSuffix = t('preview.title', 'Preview do README');
    if (previewProject && previewProject.name?.trim()) {
      document.title = `${previewProject.name} — ${defaultSuffix}`;
    } else {
      document.title = defaultSuffix;
    }
  }, [previewProject, t]);

  // Manual fallback update action
  const handleManualUpdate = () => {
    const loaded = loadSnapshot();
    if (loaded) {
      showToast(t('preview.toast_preview_updated', 'Preview atualizado.'), 'success');
    } else {
      if (hasSnapshotKeyForThisPreview()) {
        setIsSnapshotCorrupted(true);
        showToast('Os dados do preview foram encontrados, mas não puderam ser lidos.', 'error');
      } else {
        showToast('Não foi encontrado um README gerado pelo editor.', 'error');
      }
    }
  };

  // Back to editor (focus opener when available, otherwise navigate here).
  const handleBackToEditor = () => {
    const origin = window.location.origin;
    const editorUrl = new URL('/', origin).toString();

    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage(
          {
            type: 'RETURN_TO_README_EDITOR',
          },
          origin
        );

        window.opener.focus();
        window.close();

        window.setTimeout(() => {
          if (!window.closed) {
            window.location.assign(editorUrl);
          }
        }, 200);

        return;
      } catch (e) {
        console.warn('[README Preview] Não foi possível retornar à guia original:', e);
      }
    }

    window.location.assign(editorUrl);
  };

  // Simple redirection to main editor
  const handleGoToGenerator = () => {
    window.location.href = '/';
  };

  // Check if project has no user-filled contents to display
  const isProjectEmpty = !previewProject || (
    !previewProject.name?.trim() && 
    !previewProject.description?.trim() &&
    !previewProject.installation?.trim() &&
    !previewProject.usage?.trim() &&
    !previewProject.license?.trim() &&
    !previewProject.customLicense?.trim() &&
    !previewProject.repositoryUrl?.trim() &&
    !previewProject.deployUrl?.trim() &&
    !previewProject.websiteUrl?.trim() &&
    !previewProject.authorName?.trim() &&
    !previewProject.authorEmail?.trim() &&
    !previewProject.linkedinUrl?.trim() &&
    (!previewProject.technologies || previewProject.technologies.length === 0) &&
    (!previewProject.features || previewProject.features.length === 0) &&
    (!previewProject.screenshots || previewProject.screenshots.length === 0) &&
    !previewProject.prerequisitesContent?.trim() &&
    !previewProject.scriptsContent?.trim() &&
    !previewProject.folderStructureContent?.trim() &&
    !previewProject.roadmapContent?.trim() &&
    !previewProject.contributingContent?.trim() &&
    !previewProject.authorsContent?.trim() &&
    !previewProject.acknowledgementsContent?.trim() &&
    !previewProject.contactContent?.trim() &&
    !previewProject.testsContent?.trim()
  );

  // Cross-origin mismatch screen
  if (isCrossOriginMismatch) {
    return (
      <div id="preview-cross-origin-root" className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-6 text-center select-none" role="main">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-xs">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-xl md:text-2xl font-sans font-black text-text-primary tracking-tight mb-3">
          Origens diferentes detectadas
        </h1>
        <p className="text-sm text-text-secondary max-w-md leading-relaxed mb-8">
          O editor e o preview foram abertos em origens diferentes. O armazenamento local não pode ser compartilhado entre esses endereços.
        </p>
        <button
          onClick={handleGoToGenerator}
          className="bg-primary hover:bg-primary-hover text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('preview.btn_go_to_generator', 'Ir para o gerador')}</span>
        </button>
      </div>
    );
  }

  // Corrupted / invalid snapshot state screen
  if (isSnapshotCorrupted) {
    return (
      <div id="preview-corrupted-root" className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-6 text-center select-none" role="main">
        <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-full flex items-center justify-center mb-6 shadow-xs">
          <AlertCircle className="w-10 h-10 text-amber-600" />
        </div>
        <h1 className="text-xl md:text-2xl font-sans font-black text-text-primary tracking-tight mb-3">
          Dados corrompidos ou inválidos
        </h1>
        <p className="text-sm text-text-secondary max-w-md leading-relaxed mb-8">
          Os dados do preview foram encontrados, mas não puderam ser lidos. Certifique-se de que o preenchimento no gerador está correto e tente gerar novamente.
        </p>
        <button
          onClick={handleGoToGenerator}
          className="bg-primary hover:bg-primary-hover text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('preview.btn_go_to_generator', 'Ir para o gerador')}</span>
        </button>
      </div>
    );
  }

  // Clipboard copying handler
  const handleCopy = async () => {
    if (isProjectEmpty || !markdownText) return;
    const copyStatus = await copyTextToClipboard(markdownText);

    if (copyStatus === 'success') {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      showToast(t('toasts.copy_success'), 'success');
      return;
    }

    showToast(getCopyFailureMessage(copyStatus), 'error');
  };

  // Download project as .md file
  const handleDownloadMd = () => {
    if (isProjectEmpty || !markdownText || !previewProject) return;
    const filename = getReadmeDownloadFilename(previewProject.name);
    const downloaded = downloadFile(markdownText, filename, 'text/markdown');
    showToast(downloaded ? t('toasts.download_success') : t('toasts.download_error'), downloaded ? 'success' : 'error');
  };

  // Export Markdown render as high-fidelity PDF
  const handleDownloadPdf = async () => {
    if (isProjectEmpty || !previewProject) return;
    setIsExportingPdf(true);
    const slug = createSlug(previewProject.name || 'projeto');
    const filename = `${slug}-README`;
    
    if (pdfExportRef.current) {
      const result = await exportToPdf(pdfExportRef.current, filename);
      if (result.success) {
        showToast(t('toasts.pdf_success'), 'success');
      } else {
        if (result.blockedByIframe) {
          setShowPrintFallback(true);
          showToast(t('toasts.pdf_blocked'), 'error');
        } else {
          showToast(t('toasts.pdf_error', { error: result.error || 'Console' }), 'error');
        }
      }
      
      if (result.corsErrors && result.corsErrors.length > 0) {
        console.warn('Algumas imagens não puderam ser incluídas no PDF devido a restrições de CORS:', result.corsErrors);
        showToast(t('toasts.cors_warning'), 'info');
      }
    } else {
      showToast(t('toasts.pdf_error', { error: 'Element' }), 'error');
    }
    setIsExportingPdf(false);
  };

  const handlePrintFallback = () => {
    if (pdfExportRef.current) {
      printElement(pdfExportRef.current);
    }
  };

  // --- RENDERING VIEWS ---

  // Loading State View
  if (loadState === 'loading') {
    return (
      <div id="preview-loading-root" className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-6 text-center select-none" role="status">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
        <h1 className="text-xl md:text-2xl font-sans font-black text-text-primary tracking-tight mb-2">
          Carregando preview...
        </h1>
        <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
          Aguardando dados de README do editor...
        </p>
      </div>
    );
  }

  // Empty State View
  if (loadState === 'empty' || isProjectEmpty) {
    return (
      <div id="preview-empty-root" className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-6 text-center select-none" role="main">
        <div className="w-20 h-20 bg-surface-secondary border border-border text-text-muted rounded-full flex items-center justify-center mb-6 shadow-xs">
          <FileText className="w-10 h-10 text-primary/60" />
        </div>
        <h1 className="text-xl md:text-2xl font-sans font-black text-text-primary tracking-tight mb-3">
          {t('preview.empty_preview_title', 'Nenhum README foi gerado ainda.')}
        </h1>
        <p className="text-sm text-text-secondary max-w-md leading-relaxed mb-8">
          {t('preview.empty_preview_desc', 'Volte ao gerador, preencha as informações do projeto e clique em Gerar README.')}
        </p>
        <button
          onClick={handleGoToGenerator}
          className="bg-primary hover:bg-primary-hover text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('preview.btn_go_to_generator', 'Ir para o gerador')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col transition-colors duration-200">
      
      {/* Off-screen surface for high-fidelity PDF export */}
      <div
        ref={pdfExportRef}
        className="absolute bg-white text-gray-900 p-8"
        style={{
          position: 'fixed',
          left: '-10000px',
          top: '0',
          width: '794px', // Standard width for crisp A4 capture
          height: 'auto',
          overflow: 'visible',
          backgroundColor: '#ffffff',
          color: '#24292f',
          zIndex: -9999,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <div className="markdown-body">
          {previewProject.id === 'space-impacta-initial' && (
            <div className="mb-4 text-primary bg-primary-soft/40 dark:bg-primary-soft/10 p-3.5 rounded-2xl inline-flex items-center justify-center shadow-xs">
              <svg className="w-11 h-11" fill="currentColor" viewBox="0 0 12 12">
                <path d="M4 1h4v1H4zM3 2h6v1H3zM2 3h8v1H2zM1 4h10v1H1zM1 5h1v1H1zm9 0h1v1h-1zM1 6h2v1H1zm8 0h2v1H9zm-7 1h8v1H2zm1 1h6v1H3zm1 1h4v1H4zm-1 1h1v1H3zm5 0h1v1H8z" />
              </svg>
            </div>
          )}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: (props) => (
                <div style={{ overflowX: 'auto', maxWidth: '100%', display: 'block' }}>
                  <table {...props} />
                </div>
              ),
              img: (props) => {
                const { node, ...rest } = props;
                const isBadge = typeof rest.src === 'string' && (
                  rest.src.includes('img.shields.io') ||
                  rest.src.includes('/actions/workflows/') ||
                  rest.src.includes('badge.svg') ||
                  rest.src.includes('badge.png')
                );
                return (
                  <img
                    className={isBadge ? "readme-badge" : "readme-content-image"}
                    {...rest}
                  />
                );
              }
            }}
          >
            {markdownText}
          </ReactMarkdown>
        </div>
      </div>

      {/* Sticky Toolbar */}
      <header className="preview-toolbar sticky top-0 z-20 bg-surface border-b border-border shadow-xs px-4 py-3 md:py-4 transition-colors duration-200" role="banner">
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Left part: Actions and Title */}
          <div className="flex items-center justify-between md:justify-start gap-4">
            <button
              type="button"
              onClick={handleBackToEditor}
              className="flex items-center space-x-1.5 text-text-secondary hover:text-text-primary border border-border px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer bg-surface hover:bg-background"
              aria-label={t('preview.btn_back_to_editor', 'Voltar ao editor')}
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>{t('preview.btn_back_to_editor', 'Voltar ao editor')}</span>
            </button>
            
            <div className="min-w-0 flex items-center space-x-3">
              <div className="hidden sm:flex w-8 h-8 bg-primary-soft dark:bg-primary-soft/10 text-primary rounded-lg items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs md:text-sm font-bold text-text-primary tracking-tight truncate">
                  {t('preview.title', 'Preview do README')}
                </h1>
                {previewProject.name && (
                  <p className="text-[10px] text-text-secondary leading-none truncate mt-0.5 max-w-[120px] sm:max-w-[200px]">
                    {previewProject.name}
                  </p>
                )}
              </div>
            </div>

            {/* Sync trigger button */}
            <button
              onClick={handleManualUpdate}
              className="p-1.5 text-text-secondary hover:text-primary rounded-lg hover:bg-background transition-colors focus:outline-none cursor-pointer flex items-center justify-center flex-shrink-0"
              title={t('preview.btn_update_preview', 'Atualizar preview')}
              aria-label={t('preview.btn_update_preview', 'Atualizar preview')}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Right part: Selector and Outputs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Segment Selector tabs */}
            <div className="flex p-1 bg-background dark:bg-surface border border-border rounded-xl w-full sm:w-[240px] shadow-inner" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={previewMode === 'visual'}
                aria-controls="panel-visual"
                id="tab-visual"
                onClick={() => setPreviewMode('visual')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer focus:outline-none ${
                  previewMode === 'visual'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t('preview.visual_tab')}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={previewMode === 'markdown'}
                aria-controls="panel-markdown"
                id="tab-markdown"
                onClick={() => setPreviewMode('markdown')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer focus:outline-none ${
                  previewMode === 'markdown'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <span>{t('preview.markdown_tab')}</span>
              </button>
            </div>

            {/* Downloader / Exporter actions */}
            <div className="grid grid-cols-3 sm:flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center justify-center space-x-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer focus:outline-none ${
                  copied 
                    ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                    : 'bg-surface hover:bg-background text-text-primary border-border hover:border-border-strong'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
                <span className="hidden xl:inline">{copied ? t('preview.copied') : t('preview.copy_md')}</span>
                <span className="xl:hidden">{copied ? 'OK' : 'Copiar'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadMd}
                className="flex items-center justify-center space-x-1.5 bg-surface hover:bg-background text-text-primary border border-border hover:border-border-strong px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer focus:outline-none"
              >
                <Download className="w-3.5 h-3.5 text-text-muted" />
                <span className="hidden xl:inline">{t('preview.download_md')}</span>
                <span className="xl:hidden">.md</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="flex items-center justify-center space-x-1.5 bg-surface hover:bg-background text-text-primary border border-border hover:border-border-strong px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer focus:outline-none disabled:opacity-65"
              >
                <svg className="w-3.5 h-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span className="hidden xl:inline">{isExportingPdf ? '...' : t('preview.download_pdf')}</span>
                <span className="xl:hidden">PDF</span>
              </button>

              {showPrintFallback && (
                <button
                  type="button"
                  onClick={handlePrintFallback}
                  className="col-span-3 sm:col-span-1 flex items-center justify-center space-x-1.5 bg-primary-soft hover:bg-primary-soft/80 text-primary border border-primary/20 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer focus:outline-none"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('preview.print_pdf')}</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Render area */}
      <main className="preview-page flex-1 max-w-[1100px] mx-auto w-full px-4 py-6 md:py-8 transition-colors duration-200" role="main">
        
        {/* Render document with infinite growth height */}
        <div className="preview-document bg-surface border border-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs overflow-visible">
          
          {previewMode === 'visual' ? (
            <div 
              id="panel-visual" 
              role="tabpanel" 
              aria-labelledby="tab-visual" 
              tabIndex={0}
              className="focus:outline-none"
            >
              <div id="readme-preview-content" className="markdown-body transition-colors duration-200">
                {previewProject.id === 'space-impacta-initial' && (
                  <div className="mb-4 text-primary bg-primary-soft/40 dark:bg-primary-soft/10 p-3.5 rounded-2xl inline-flex items-center justify-center shadow-xs">
                    <svg className="w-11 h-11" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M4 1h4v1H4zM3 2h6v1H3zM2 3h8v1H2zM1 4h10v1H1zM1 5h1v1H1zm9 0h1v1h-1zM1 6h2v1H1zm8 0h2v1H9zm-7 1h8v1H2zm1 1h6v1H3zm1 1h4v1H4zm-1 1h1v1H3zm5 0h1v1H8z" />
                    </svg>
                  </div>
                )}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: (props) => (
                      <div style={{ overflowX: 'auto', maxWidth: '100%', display: 'block' }}>
                        <table {...props} />
                      </div>
                    ),
                    img: (props) => {
                      const { node, ...rest } = props;
                      const isBadge = typeof rest.src === 'string' && (
                        rest.src.includes('img.shields.io') ||
                        rest.src.includes('/actions/workflows/') ||
                        rest.src.includes('badge.svg') ||
                        rest.src.includes('badge.png')
                      );
                      return (
                        <img
                          className={isBadge ? "readme-badge" : "readme-content-image"}
                          {...rest}
                        />
                      );
                    }
                  }}
                >
                  {markdownText}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div 
              id="panel-markdown" 
              role="tabpanel" 
              aria-labelledby="tab-markdown" 
              tabIndex={0}
              className="focus:outline-none flex flex-col space-y-4"
            >
              <div className="bg-surface-secondary border border-border p-3.5 rounded-xl text-[10px] text-text-secondary leading-relaxed flex items-center space-x-2 flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{t('preview.helper_copy')}</span>
              </div>
              <pre className="p-4 bg-background dark:bg-surface border border-border rounded-xl text-xs font-mono text-text-primary whitespace-pre overflow-x-auto select-text">
                <code>{markdownText}</code>
              </pre>
            </div>
          )}

        </div>
      </main>

      {/* Discreet footer warning inside the regular document flow */}
      <footer className="border-t border-border mt-8 py-6 px-4 text-center bg-surface-secondary" role="contentinfo">
        <div className="max-w-[1100px] mx-auto flex items-center justify-center space-x-2.5 text-[10px] text-text-secondary leading-relaxed">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
          <span>
            {t('preview.helper_preview')}
          </span>
        </div>
      </footer>

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
};
