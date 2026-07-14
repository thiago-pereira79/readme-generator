import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
import { 
  Copy, 
  Check, 
  Download, 
  Eye,
  Sparkles,
  FileText,
  Printer
} from 'lucide-react';

type PreviewMode = 'visual' | 'markdown';

interface ReadmePreviewProps {
  project: ReadmeProject;
  showBadges: boolean;
  showToast?: (message: string, type: 'success' | 'info' | 'error') => void;
}

export const ReadmePreview: React.FC<ReadmePreviewProps> = ({ project, showBadges, showToast }) => {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('visual');
  const [showPrintFallback, setShowPrintFallback] = useState(false);

  const pdfExportRef = useRef<HTMLDivElement>(null);

  const getCopyFailureMessage = (status: Exclude<ClipboardCopyStatus, 'success'>): string => {
    if (status === 'permission-denied') return t('toasts.copy_permission_denied');
    if (status === 'unavailable') return t('toasts.copy_unavailable');
    return t('toasts.copy_error');
  };

  // Compile project data into a clean Markdown string
  const markdownText = generateReadmeMarkdown(project, showBadges, i18n.language as AppLocale);

  // Check if project has no user-filled contents to display
  const isProjectEmpty = 
    !project.name?.trim() && 
    !project.description?.trim() &&
    !project.installation?.trim() &&
    !project.usage?.trim() &&
    !project.license?.trim() &&
    !project.customLicense?.trim() &&
    !project.repositoryUrl?.trim() &&
    !project.deployUrl?.trim() &&
    !project.websiteUrl?.trim() &&
    !project.authorName?.trim() &&
    !project.authorEmail?.trim() &&
    !project.linkedinUrl?.trim() &&
    (!project.technologies || project.technologies.length === 0) &&
    (!project.features || project.features.length === 0) &&
    (!project.screenshots || project.screenshots.length === 0) &&
    !project.prerequisitesContent?.trim() &&
    !project.scriptsContent?.trim() &&
    !project.folderStructureContent?.trim() &&
    !project.roadmapContent?.trim() &&
    !project.contributingContent?.trim() &&
    !project.authorsContent?.trim() &&
    !project.acknowledgementsContent?.trim() &&
    !project.contactContent?.trim() &&
    !project.testsContent?.trim();

  // Clipboard copying handler
  const handleCopy = async () => {
    if (isProjectEmpty) return;
    const copyStatus = await copyTextToClipboard(markdownText);

    if (copyStatus === 'success') {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);

      if (showToast) {
        showToast(t('toasts.copy_success'), "success");
      }
      return;
    }

    if (showToast) {
      showToast(getCopyFailureMessage(copyStatus), "error");
    }
  };

  // Download project as .md file
  const handleDownloadMd = () => {
    if (isProjectEmpty) return;
    const filename = getReadmeDownloadFilename(project.name);
    const downloaded = downloadFile(markdownText, filename, 'text/markdown');
    if (showToast) {
      showToast(downloaded ? t('toasts.download_success') : t('toasts.download_error'), downloaded ? "success" : "error");
    }
  };

  // Export Markdown render as high-fidelity PDF
  const handleDownloadPdf = async () => {
    if (isProjectEmpty) return;
    setIsExportingPdf(true);
    const slug = createSlug(project.name || 'projeto');
    const filename = `${slug}-README`;
    
    if (pdfExportRef.current) {
      const result = await exportToPdf(pdfExportRef.current, filename);
      if (result.success) {
        if (showToast) {
          showToast(t('toasts.pdf_success'), "success");
        }
      } else {
        if (result.blockedByIframe) {
          setShowPrintFallback(true);
          if (showToast) {
            showToast(t('toasts.pdf_blocked'), "error");
          }
        } else {
          if (showToast) {
            showToast(t('toasts.pdf_error', { error: result.error || 'Console' }), "error");
          }
        }
      }
      
      // Log any image load warnings
      if (result.corsErrors && result.corsErrors.length > 0) {
        console.warn("Algumas imagens não puderam ser incluídas no PDF devido a restrições de CORS:", result.corsErrors);
        if (showToast) {
          showToast(t('toasts.cors_warning'), "info");
        }
      }
    } else {
      if (showToast) {
        showToast(t('toasts.pdf_error', { error: 'Element' }), "error");
      }
    }
    setIsExportingPdf(false);
  };

  const handlePrintFallback = () => {
    if (pdfExportRef.current) {
      printElement(pdfExportRef.current);
    }
  };

  return (
    <div className="preview-panel bg-surface border border-border rounded-2xl shadow-small p-5 md:p-6 flex flex-col select-none select-text">
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
          {project.id === 'space-impacta-initial' && (
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

      {/* Header section (fixed in desktop) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border pb-4 flex-shrink-0">
        <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
          <div className="w-10 h-10 bg-primary-soft dark:bg-primary-soft/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-text-primary tracking-tight truncate">
              {t('preview.title')}
            </h2>
            <p className="text-xs text-text-secondary leading-none truncate">{t('preview.subtitle')}</p>
          </div>
        </div>

        {/* Quick Actions buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto xl:justify-end">
          {/* Copy */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={isProjectEmpty}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer focus:outline-none ${
              copied 
                ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                : isProjectEmpty
                  ? 'opacity-65 cursor-not-allowed bg-surface-secondary text-text-secondary border-border'
                  : 'bg-surface hover:bg-background text-text-primary border-border hover:border-border-strong'
            }`}
            title={isProjectEmpty ? (i18n.language === 'en-US' ? "Fill in the project to enable actions" : i18n.language === 'es-419' ? "Completa el proyecto para habilitar acciones" : "Preencha o projeto para habilitar ações") : t('preview.copy_md')}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
            <span>{copied ? t('preview.copied') : t('preview.copy_md')}</span>
          </button>

          {/* Download MD */}
          <button
            type="button"
            onClick={handleDownloadMd}
            disabled={isProjectEmpty}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 bg-surface hover:bg-background text-text-primary border border-border hover:border-border-strong px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer focus:outline-none ${
              isProjectEmpty ? 'opacity-65 cursor-not-allowed bg-surface-secondary text-text-secondary hover:bg-surface-secondary border-border' : ''
            }`}
            title={isProjectEmpty ? (i18n.language === 'en-US' ? "Fill in the project to enable actions" : i18n.language === 'es-419' ? "Completa el proyecto para habilitar acciones" : "Preencha o projeto para habilitar ações") : t('preview.download_md')}
          >
            <Download className="w-3.5 h-3.5 text-text-muted" />
            <span>{t('preview.download_md')}</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf || isProjectEmpty}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 bg-surface hover:bg-background text-text-primary border border-border hover:border-border-strong px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer focus:outline-none disabled:opacity-65 ${
              isProjectEmpty ? 'opacity-65 cursor-not-allowed bg-surface-secondary text-text-secondary hover:bg-surface-secondary border-border' : ''
            }`}
            title={isProjectEmpty ? (i18n.language === 'en-US' ? "Fill in the project to enable actions" : i18n.language === 'es-419' ? "Completa el proyecto para habilitar acciones" : "Preencha o projeto para habilitar ações") : t('preview.download_pdf')}
          >
            <svg className="w-3.5 h-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>{isExportingPdf ? (i18n.language === 'en-US' ? 'Generating PDF...' : i18n.language === 'es-419' ? 'Generando PDF...' : 'Gerando PDF...') : t('preview.download_pdf')}</span>
          </button>

          {/* Sandbox Fallback Print Button */}
          {showPrintFallback && !isProjectEmpty && (
            <button
              type="button"
              onClick={handlePrintFallback}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 bg-primary-soft hover:bg-primary-soft/80 text-primary border border-primary/20 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer focus:outline-none animate-fade-in"
              title={i18n.language === 'en-US' ? "Save as PDF via browser print dialog" : i18n.language === 'es-419' ? "Guardar como PDF mediante el diálogo de impresión del navegador" : "Salvar como PDF via caixa de diálogo do navegador"}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('preview.print_pdf')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Segment Selector Visual / Markdown (fixed in desktop) */}
      <div className="pb-4 flex-shrink-0">
        <div className="flex p-1 bg-background dark:bg-surface border border-border rounded-xl w-full max-w-[240px] shadow-inner">
          <button
            type="button"
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
            onClick={() => setPreviewMode('markdown')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer focus:outline-none ${
              previewMode === 'markdown'
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span>{t('preview.markdown_tab')}</span>
          </button>
        </div>
      </div>

      {/* Content wrapper with internal scrollbar (.preview-scroll-area) */}
      <div 
        tabIndex={0}
        className="preview-scroll-area border border-border rounded-2xl p-4 md:p-5 flex-1 min-h-0 shadow-xs bg-surface focus:outline-none focus:ring-1 focus:ring-primary/20"
      >
        {isProjectEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in my-auto h-full min-h-[320px]">
            <div className="w-16 h-16 bg-surface-secondary border border-border text-text-muted rounded-full flex items-center justify-center mb-5 shadow-xs">
              <FileText className="w-7 h-7 text-primary/60" />
            </div>
            <h3 className="text-base font-bold text-text-primary tracking-tight mb-2">
              {t('preview.empty_title')}
            </h3>
            <p className="text-xs text-text-secondary max-w-sm leading-relaxed">
              {t('preview.empty_desc')}
            </p>
          </div>
        ) : previewMode === 'visual' ? (
          /* Rendered visual mode */
          <div id="readme-preview-content" className="markdown-body transition-colors duration-200">
            {project.id === 'space-impacta-initial' && (
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
        ) : (
          /* Raw markdown code mode */
          <div className="flex flex-col space-y-3 h-full min-h-0">
            <div className="bg-surface-secondary border border-border p-3.5 rounded-xl text-[10px] text-text-secondary leading-relaxed flex items-center space-x-2 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{t('preview.helper_copy')}</span>
            </div>
            <pre className="markdown-source p-4 bg-background dark:bg-surface border border-border rounded-xl overflow-auto text-xs font-mono text-text-primary whitespace-pre select-text h-full min-h-0">
              <code>{markdownText}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Floating help tooltip footer (fixed in desktop) */}
      <div className="mt-4 flex-shrink-0 flex items-center space-x-2.5 bg-surface-secondary border border-border p-3.5 rounded-xl text-[10px] text-text-secondary leading-relaxed">
        <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
        <span>
          {t('preview.helper_preview')}
        </span>
      </div>
    </div>
  );
};
