import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReadmeProject, AppLocale } from '../types';
import { 
  FileText, 
  Calendar, 
  Edit3, 
  Copy, 
  Trash2, 
  Download, 
  Folder,
  ShieldCheck
} from 'lucide-react';
import { generateReadmeMarkdown, downloadFile, getReadmeDownloadFilename } from '../utils/readmeUtils';

interface ProjectsViewProps {
  projects: ReadmeProject[];
  onEditProject: (project: ReadmeProject) => void;
  onCreateProject: () => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onEditProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
  showToast,
}) => {
  const { t, i18n } = useTranslation();

  // Format standard ISO dates beautifully
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat(i18n.language, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return i18n.language === 'en-US' ? 'Date unavailable' : i18n.language === 'es-419' ? 'Fecha no disponible' : 'Data indisponível';
    }
  };

  // Compile and download project MD file
  const handleExportMarkdown = (project: ReadmeProject) => {
    const markdownContent = generateReadmeMarkdown(project, true, i18n.language as AppLocale);
    const filename = getReadmeDownloadFilename(project.name);
    const downloaded = downloadFile(markdownContent, filename, 'text/markdown');
    showToast(downloaded ? t('toasts.download_success') : t('toasts.download_error'), downloaded ? 'success' : 'error');
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-sans font-bold text-text-primary tracking-tight">
            {t('projects_view.title')}
          </h2>
          <p className="text-sm text-text-secondary">
            {t('projects_view.subtitle')}
          </p>
        </div>
        <div className="text-xs bg-primary-soft text-primary font-semibold py-1.5 px-3.5 rounded-xl border border-primary/10 self-start md:self-auto shadow-sm">
          {projects.length === 1 
            ? t('projects_view.registered_one') 
            : t('projects_view.registered_many', { count: projects.length })}
        </div>
      </div>

      {/* Local Storage Info Notice */}
      <div className="bg-primary-soft/10 dark:bg-primary-soft/5 border border-primary/10 rounded-2xl p-4 flex items-start space-x-3 shadow-xs select-none">
        <div className="p-2 bg-primary/10 text-primary rounded-xl flex-shrink-0">
          <ShieldCheck className="w-5 h-5 animate-none" />
        </div>
        <div>
          <h4 className="font-bold text-text-primary text-xs flex items-center gap-1.5 leading-snug">
            {t('projects_view.local_storage_title')}
          </h4>
          <p className="text-xs text-text-secondary leading-normal mt-0.5">
            {t('projects_view.local_storage_desc')}
          </p>
        </div>
      </div>

      {/* Projects List Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-surface border border-border hover:border-border-strong hover:shadow-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
            >
              {/* Top content */}
              <div>
                <div className="flex items-start justify-between mb-3.5">
                  <div className="w-10 h-10 bg-primary-soft dark:bg-primary-soft/10 text-primary rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex items-center text-[10px] text-text-muted font-medium bg-background dark:bg-surface-secondary px-2.5 py-1 rounded-md border border-border">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    <span>{i18n.language === 'en-US' ? 'Updated:' : i18n.language === 'es-419' ? 'Act:' : 'Alt:'} {formatDate(project.updatedAt)}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-text-primary mb-1.5 line-clamp-1 tracking-tight">
                  {project.name || (i18n.language === 'en-US' ? 'Untitled' : i18n.language === 'es-419' ? 'Sin nombre' : 'Sem nome')}
                </h3>
                
                <p className="text-xs text-text-secondary mb-4 leading-relaxed line-clamp-2 min-h-[2rem]">
                  {project.description || (i18n.language === 'en-US' ? 'No short description provided.' : i18n.language === 'es-419' ? 'No se proporcionó una descripción corta.' : 'Nenhuma descrição curta fornecida.')}
                </p>

                {/* Technologies Preview Chips */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.slice(0, 4).map(tech => (
                      <span
                        key={tech}
                        className="text-[9px] font-semibold text-text-secondary bg-surface-secondary border border-border px-2 py-0.5 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[9px] font-bold text-text-muted px-1.5">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Controls buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-border pt-4">
                {/* Edit */}
                <button
                  onClick={() => onEditProject(project)}
                  className="flex items-center justify-center space-x-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                  title={i18n.language === 'en-US' ? "Continue Editing in Generator" : i18n.language === 'es-419' ? "Continuar editando en el generador" : "Continuar Editando no Gerador"}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t('projects_view.edit_btn')}</span>
                </button>

                {/* Duplicate */}
                <button
                  onClick={() => onDuplicateProject(project.id)}
                  className="flex items-center justify-center space-x-1.5 bg-surface-secondary hover:bg-background text-text-primary text-xs font-medium py-2 px-3 rounded-xl border border-border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                  title={i18n.language === 'en-US' ? "Duplicate Draft" : i18n.language === 'es-419' ? "Duplicar borrador" : "Duplicar Rascunho"}
                >
                  <Copy className="w-3.5 h-3.5 text-text-muted" />
                  <span>{t('projects_view.duplicate_btn')}</span>
                </button>

                {/* Export .md */}
                <button
                  onClick={() => handleExportMarkdown(project)}
                  className="flex items-center justify-center space-x-1.5 bg-surface-secondary hover:bg-background text-text-primary text-xs font-medium py-2 px-3 rounded-xl border border-border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                  title={i18n.language === 'en-US' ? "Download README.md" : i18n.language === 'es-419' ? "Descargar README.md" : "Download README.md"}
                >
                  <Download className="w-3.5 h-3.5 text-text-muted" />
                  <span>{t('projects_view.export_btn')}</span>
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDeleteProject(project.id)}
                  className="flex items-center justify-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium py-2 px-3 rounded-xl border border-red-100 dark:border-red-950/20 dark:bg-red-950/10 dark:hover:bg-red-950/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
                  title={i18n.language === 'en-US' ? "Delete Draft" : i18n.language === 'es-419' ? "Eliminar borrador" : "Excluir Rascunho"}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('projects_view.delete_btn')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center max-w-md mx-auto shadow-small">
          <div className="w-16 h-16 bg-primary-soft text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-text-primary text-lg mb-1">{t('projects_view.empty_title')}</h3>
          <p className="text-xs text-text-secondary mb-6">
            {t('projects_view.empty_desc')}
          </p>
          <button
            onClick={onCreateProject}
            className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-2.5 px-5 rounded-xl transition-colors shadow-md"
          >
            {t('header.btn_new_project')}
          </button>
        </div>
      )}
    </div>
  );
};
