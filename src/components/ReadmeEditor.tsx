import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadmeProject, ReadmeScreenshot } from '../types';
import { initialProject } from '../data/templatesData';
import { getAuthorLink, isValidHttpUrl } from '../utils/readmeUtils';
import { 
  Trash2, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  HelpCircle,
  Code2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Info,
  Check,
  AlertCircle,
  List,
  Download,
  Play,
  Shield,
  GripVertical,
  ClipboardList,
  SquareTerminal,
  FolderTree,
  Map,
  GitPullRequest,
  UserRound,
  Heart,
  FlaskConical,
  Mail
} from 'lucide-react';

const isOptionalHttpUrl = (url?: string): boolean => !url?.trim() || isValidHttpUrl(url);
type OptionalContentField = Extract<
  keyof ReadmeProject,
  | 'prerequisitesContent'
  | 'scriptsContent'
  | 'folderStructureContent'
  | 'roadmapContent'
  | 'contributingContent'
  | 'authorsContent'
  | 'acknowledgementsContent'
  | 'contactContent'
  | 'testsContent'
>;

interface ReadmeEditorProps {
  project: ReadmeProject;
  onChange: (project: ReadmeProject) => void;
  onClear: () => void;
  onSave: () => void;
  onGenerate: () => void;
  onLoadExample: () => void;
}

export const ReadmeEditor: React.FC<ReadmeEditorProps> = ({
  project,
  onChange,
  onClear,
  onSave,
  onGenerate,
  onLoadExample,
}) => {
  const { t, i18n } = useTranslation();

  // --- ACCORDION EXPANSION STATE ---
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: false,
    features: false,
    installation: false,
    execution: false,
    license: false,
    links: false,
    screenshots: false,
    optionals: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // --- COMPONENT LEVEL STATE ---
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [expandedOptionalSections, setExpandedOptionalSections] = useState<Record<string, boolean>>({});
  const [authorNameTouched, setAuthorNameTouched] = useState(false);
  
  // Track blob URLs created to revoke them later and prevent memory leaks
  const [createdBlobUrls, setCreatedBlobUrls] = useState<string[]>([]);

  // Refs for focusing invalid inputs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const repositoryUrlRef = useRef<HTMLInputElement>(null);
  const deployUrlRef = useRef<HTMLInputElement>(null);
  const websiteUrlRef = useRef<HTMLInputElement>(null);
  const linkedinUrlRef = useRef<HTMLInputElement>(null);
  const authorNameRef = useRef<HTMLInputElement>(null);
  const authorUrlRef = useRef<HTMLInputElement>(null);

  // Revoke all blob URLs when editor unmounts
  useEffect(() => {
    return () => {
      createdBlobUrls.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      });
    };
  }, [createdBlobUrls]);

  // --- ACTIONS ---

  // Handle standard field edits
  const handleFieldChange = <K extends keyof ReadmeProject>(key: K, value: ReadmeProject[K]) => {
    onChange({
      ...project,
      [key]: value,
      updatedAt: new Date().toISOString(),
    });

    // Clear validation errors dynamically when they become valid or empty
    setValidationErrors(prev => {
      const next = { ...prev };
      if (key === 'name' && typeof value === 'string' && value.trim()) {
        delete next.name;
      } else if (key === 'authorName' && typeof value === 'string' && value.trim()) {
        delete next.authorName;
      } else if (['repositoryUrl', 'deployUrl', 'websiteUrl', 'linkedinUrl', 'authorUrl'].includes(key as string)) {
        if (typeof value === 'string' && isOptionalHttpUrl(value)) {
          delete next[key as string];
        }
      }
      return next;
    });
  };

  // Toggle optional sections active states
  const handleOptionalSectionToggle = (key: keyof ReadmeProject['optionalSections']) => {
    const nextActive = !project.optionalSections[key];
    onChange({
      ...project,
      optionalSections: {
        ...project.optionalSections,
        [key]: nextActive,
      },
      updatedAt: new Date().toISOString(),
    });

    if (nextActive) {
      setExpandedOptionalSections(prev => ({ ...prev, [key]: true }));
      if (key === 'authors') {
        setAuthorNameTouched(false);
        setTimeout(() => {
          authorNameRef.current?.focus();
        }, 100);
      }
    } else {
      setExpandedOptionalSections(prev => ({ ...prev, [key]: false }));
      if (key === 'authors') {
        setAuthorNameTouched(false);
        setValidationErrors(prev => {
          const updated = { ...prev };
          delete updated.authorName;
          return updated;
        });
      }
    }
  };

  // Toggle optional sections expanded state
  const toggleOptionalExpansion = (key: string) => {
    if (!project.optionalSections[key as keyof ReadmeProject['optionalSections']]) return;
    setExpandedOptionalSections(prev => {
      const isCurrentlyExpanded = prev[key] === true;
      return {
        ...prev,
        [key]: !isCurrentlyExpanded
      };
    });
  };

  // Handle optional section content text area edits
  const handleOptionalContentChange = (key: string, value: string) => {
    onChange({
      ...project,
      [key]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  const getOptionalContentValue = (field: string): string => {
    const value = project[field as OptionalContentField];
    return typeof value === 'string' ? value : '';
  };

  // 1. Technologies management
  const handleAddTech = () => {
    const cleaned = techInput.trim();
    if (!cleaned) return;
    if (project.technologies.some(t => t.toLowerCase() === cleaned.toLowerCase())) {
      setTechInput('');
      return;
    }
    const updatedTechs = [...project.technologies, cleaned];
    handleFieldChange('technologies', updatedTechs);
    setTechInput('');
  };

  const handleRemoveTech = (index: number) => {
    const updatedTechs = project.technologies.filter((_, i) => i !== index);
    handleFieldChange('technologies', updatedTechs);
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTech();
    }
  };

  // 2. Features list management
  const handleAddFeature = () => {
    const cleaned = featureInput.trim();
    if (!cleaned) return;
    const updatedFeatures = [...project.features, cleaned];
    handleFieldChange('features', updatedFeatures);
    setFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = project.features.filter((_, i) => i !== index);
    handleFieldChange('features', updatedFeatures);
  };

  const handleFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  // Move a feature item up or down in the array list
  const handleMoveFeature = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= project.features.length) return;

    const list = [...project.features];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    handleFieldChange('features', list);
  };

  // 3. Screenshots management
  const [screenshotSourceType, setScreenshotSourceType] = useState<'url' | 'file'>('url');
  const [scUrl, setScUrl] = useState('');
  const [scAlt, setScAlt] = useState('');
  const [scCaption, setScCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddScreenshot = () => {
    const altText = scAlt.trim() || 'Screenshot do projeto';
    const captionText = scCaption.trim();

    if (screenshotSourceType === 'url') {
      const urlText = scUrl.trim();
      if (!urlText) return;
      if (!isValidHttpUrl(urlText)) {
        setValidationErrors(prev => ({
          ...prev,
          screenshotUrl: i18n.language === 'en-US'
            ? 'Invalid image URL. Use http:// or https://.'
            : i18n.language === 'es-419'
            ? 'URL de imagen inválida. Usa http:// o https://.'
            : 'URL de imagem inválida. Use http:// ou https://.',
        }));
        return;
      }
      const newSc: ReadmeScreenshot = {
        id: Math.random().toString(36).substring(2, 9),
        source: urlText,
        alt: altText,
        caption: captionText || undefined,
      };
      handleFieldChange('screenshots', [...project.screenshots, newSc]);
      setScUrl('');
      setScAlt('');
      setScCaption('');
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next.screenshotUrl;
        return next;
      });
    }
  };

  // File uploading handling (local Base64 conversion with safe quota checks)
  const handleScreenshotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    // Check file size (limit to 1MB to prevent localstorage quota errors)
    if (file.size > 1024 * 1024) {
      alert('Imagens com mais de 1MB podem comprometer o armazenamento. Por favor, utilize uma imagem menor ou um link externo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Calculate size of the new image in Base64 (Base64 is ~1.4 times larger than raw bytes)
    const newImageEstimatedSize = file.size * 1.4;

    // Calculate total size of existing local images in the current active project
    const currentProjectImagesSize = project.screenshots.reduce((acc, sc) => {
      if (sc.source && sc.source.startsWith('data:')) {
        return acc + sc.source.length;
      }
      return acc;
    }, 0);

    const totalProjectImagesSizeAfterUpload = currentProjectImagesSize + newImageEstimatedSize;

    // Define safe quotas in characters/bytes
    const PROJECT_SAFE_QUOTA = 1.5 * 1024 * 1024; // 1.5 MB
    const ALL_PROJECTS_SAFE_QUOTA = 3.0 * 1024 * 1024; // 3.0 MB

    // Validate per-project quota
    if (totalProjectImagesSizeAfterUpload > PROJECT_SAFE_QUOTA) {
      alert(
        `Atenção: cota de armazenamento de imagem do projeto excedida!\n\n` +
        `O tamanho total das imagens locais neste projeto seria de ${(totalProjectImagesSizeAfterUpload / (1024 * 1024)).toFixed(2)} MB, ` +
        `o que ultrapassa o limite seguro recomendado de ${(PROJECT_SAFE_QUOTA / (1024 * 1024)).toFixed(1)} MB por projeto.\n\n` +
        `Recomendações:\n` +
        `- Reduza o tamanho ou resolução da imagem antes de enviá-la.\n` +
        `- Utilize URLs de imagens hospedadas na web (ex: GitHub, Imgur).`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Calculate total size of local images in other projects in localStorage
    let otherProjectsImagesSize = 0;
    try {
      const stored = localStorage.getItem('tp-lab-readme-projects');
      if (stored) {
        const allSaved = JSON.parse(stored);
        if (Array.isArray(allSaved)) {
          allSaved.forEach((savedProject: unknown) => {
            if (!savedProject || typeof savedProject !== 'object') return;
            const projectRecord = savedProject as { id?: unknown; screenshots?: unknown };

            // Only count other projects to avoid double-counting the current active project
            if (projectRecord.id !== project.id && Array.isArray(projectRecord.screenshots)) {
              projectRecord.screenshots.forEach((screenshot: unknown) => {
                if (!screenshot || typeof screenshot !== 'object') return;
                const screenshotRecord = screenshot as { source?: unknown };
                if (typeof screenshotRecord.source === 'string' && screenshotRecord.source.startsWith('data:')) {
                  otherProjectsImagesSize += screenshotRecord.source.length;
                }
              });
            }
          });
        }
      }
    } catch (err) {
      console.warn('Error checking other projects screenshots size:', err);
    }

    const totalAllProjectsImagesSizeAfterUpload = otherProjectsImagesSize + totalProjectImagesSizeAfterUpload;

    // Validate total across all projects quota
    if (totalAllProjectsImagesSizeAfterUpload > ALL_PROJECTS_SAFE_QUOTA) {
      alert(
        `Atenção: limite de armazenamento global de imagens em risco!\n\n` +
        `O tamanho total das imagens locais em todos os seus projetos seria de ${(totalAllProjectsImagesSizeAfterUpload / (1024 * 1024)).toFixed(2)} MB, ` +
        `o que ultrapassa o limite seguro global de ${(ALL_PROJECTS_SAFE_QUOTA / (1024 * 1024)).toFixed(1)} MB.\n\n` +
        `Para proteger os dados e evitar falhas de cota no navegador, por favor:\n` +
        `- Remova imagens locais de outros projetos na aba 'Meus Projetos'.\n` +
        `- Utilize links para imagens hospedadas externamente.`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        const newSc: ReadmeScreenshot = {
          id: Math.random().toString(36).substring(2, 9),
          source: base64Data,
          alt: scAlt.trim() || file.name,
          caption: scCaption.trim() || undefined,
        };

        handleFieldChange('screenshots', [...project.screenshots, newSc]);
        setScAlt('');
        setScCaption('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.onerror = () => {
        console.error('Error reading file as data URL');
        alert('Erro ao ler o arquivo de imagem.');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to process image file:', err);
    }
  };

  const handleRemoveScreenshot = (id: string, source: string) => {
    const filtered = project.screenshots.filter(sc => sc.id !== id);
    handleFieldChange('screenshots', filtered);

    // If source was a local Blob, revoke it immediately to free memory
    if (source.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(source);
        setCreatedBlobUrls(prev => prev.filter(url => url !== source));
      } catch {}
    }
  };

  // Move screenshots left or right/reorder
  const handleMoveScreenshot = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= project.screenshots.length) return;

    const list = [...project.screenshots];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    handleFieldChange('screenshots', list);
  };

  // --- SUBMIT GENERATE VALIDATION ---
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!project.name.trim()) {
      errors.name = i18n.language === 'en-US' ? 'Project name is required.' : i18n.language === 'es-419' ? 'El nombre del proyecto es obligatorio.' : 'O nome do projeto é obrigatório.';
    }
    if (!project.description.trim()) {
      errors.description = i18n.language === 'en-US' ? 'Project description is required.' : i18n.language === 'es-419' ? 'La descripción del proyecto es obligatoria.' : 'A descrição do projeto é obrigatória.';
    }

    // Validate URLs if they are entered
    const invalidUrlMsg = i18n.language === 'en-US' 
      ? 'Invalid URL. Make sure to include the protocol (e.g. https://...)' 
      : i18n.language === 'es-419' 
        ? 'URL inválida. Asegúrate de incluir el protocolo (ej. https://...)' 
        : 'URL inválida. Certifique-se de incluir o protocolo (ex: https://...)';

    if (project.repositoryUrl && !isValidHttpUrl(project.repositoryUrl)) {
      errors.repositoryUrl = invalidUrlMsg;
    }
    if (project.deployUrl && !isValidHttpUrl(project.deployUrl)) {
      errors.deployUrl = invalidUrlMsg;
    }
    if (project.websiteUrl && !isValidHttpUrl(project.websiteUrl)) {
      errors.websiteUrl = invalidUrlMsg;
    }
    if (project.linkedinUrl && !isValidHttpUrl(project.linkedinUrl)) {
      errors.linkedinUrl = invalidUrlMsg;
    }
    if (project.optionalSections?.authors && project.authorUrl && !isValidHttpUrl(project.authorUrl)) {
      errors.authorUrl = invalidUrlMsg;
    }

    if (project.optionalSections?.authors && !project.authorName?.trim()) {
      errors.authorName = i18n.language === 'en-US' 
        ? "Enter the author’s name to add the signature."
        : i18n.language === 'es-419'
          ? "Introduce el nombre del autor para añadir la firma."
          : "Informe o nome do autor para adicionar a assinatura.";
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (errors.name) {
        setTimeout(() => {
          nameInputRef.current?.focus();
        }, 100);
      } else if (errors.description) {
        setTimeout(() => {
          descriptionInputRef.current?.focus();
        }, 100);
      } else if (errors.authorName || errors.authorUrl) {
        setAuthorNameTouched(true);
        setExpandedSections(prev => ({ ...prev, optionals: true }));
        setExpandedOptionalSections(prev => ({ ...prev, authors: true }));
        setTimeout(() => {
          if (errors.authorName) authorNameRef.current?.focus();
          else authorUrlRef.current?.focus();
        }, 100);
      } else {
        const hasLinkError = errors.repositoryUrl || errors.deployUrl || errors.websiteUrl || errors.linkedinUrl;
        if (hasLinkError) {
          setTimeout(() => {
            if (errors.repositoryUrl) repositoryUrlRef.current?.focus();
            else if (errors.deployUrl) deployUrlRef.current?.focus();
            else if (errors.websiteUrl) websiteUrlRef.current?.focus();
            else if (errors.linkedinUrl) linkedinUrlRef.current?.focus();
          }, 100);
        }
      }
      return false;
    }
    return true;
  };

  const handleValidateAndGenerate = () => {
    if (validateForm()) {
      onGenerate();
    }
  };

  const handleValidateAndSave = () => {
    if (validateForm()) {
      onSave();
    }
  };

  const isBasicInfoComplete = project.name.trim() !== '' && project.description.trim() !== '';

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-small p-5 md:p-6 space-y-6 select-none select-text">
      {/* Title block */}
      <div className="flex items-center space-x-3 border-b border-border pb-4">
        <div className="w-10 h-10 bg-primary-soft dark:bg-primary-soft/10 text-primary rounded-xl flex items-center justify-center">
          <Code2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-text-primary tracking-tight">
            {t('editor.title_info')}
          </h2>
          <p className="text-xs text-text-secondary leading-none">{t('editor.desc_info')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* ================= SECTION 1: BASIC INFORMATION ================= */}
        <div className="border border-border rounded-xl overflow-hidden bg-surface-secondary">
          <button
            id="accordion-header-basic-info"
            aria-expanded={expandedSections.basicInfo}
            aria-controls="accordion-content-basic-info"
            onClick={() => toggleSection('basicInfo')}
            className="w-full flex items-center justify-between p-4 font-bold text-sm text-text-primary focus:outline-none hover:bg-border/10 cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-left flex-1 mr-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-soft dark:bg-primary-soft/10 text-primary flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 text-primary" />
              </div>
              <div className="flex min-w-0 max-w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="font-bold text-sm text-text-primary">{t('editor.sections.basicInfo')}</span>
                <div className="flex min-w-0 max-w-full flex-wrap gap-1.5">
                  <span className={`text-[10px] border px-2 py-0.5 rounded-full font-semibold max-w-full whitespace-nowrap ${
                  isBasicInfoComplete 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}>
                  {isBasicInfoComplete ? t('editor.status.completed') : t('editor.status.pending')}
                </span>
                <span className="text-[10px] bg-background dark:bg-surface border border-border text-text-secondary px-2 py-0.5 rounded-full font-medium max-w-full whitespace-nowrap">
                  {project.technologies?.length === 0 
                    ? (i18n.language === 'en-US' ? 'Technologies: None' : i18n.language === 'es-419' ? 'Tecnologías: Ninguna' : 'Tecnologias: Nenhuma') 
                    : i18n.language === 'en-US' 
                      ? `Technologies: ${project.technologies.length} ${project.technologies.length === 1 ? 'item' : 'items'}` 
                      : i18n.language === 'es-419' 
                        ? `Tecnologías: ${project.technologies.length} ${project.technologies.length === 1 ? 'artículo' : 'artículos'}` 
                        : `Tecnologias: ${project.technologies.length} ${project.technologies.length === 1 ? 'item' : 'itens'}`}
                </span>
              </div>
            </div>
          </div>
          {expandedSections.basicInfo ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />}
          </button>

            <div
              hidden={!expandedSections.basicInfo}
              id="accordion-content-basic-info"
              role="region"
              aria-labelledby="accordion-header-basic-info"
              className="p-4 pt-0 border-t border-border bg-surface space-y-4"
            >
              {/* Action: Load Example */}
              <div className="flex flex-col min-[600px]:flex-row min-[600px]:items-center justify-between gap-4 p-3.5 bg-primary-soft/30 dark:bg-primary-soft/10 rounded-xl border border-primary/10 mt-4">
                <div className="flex items-start space-x-2.5">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-text-primary block">
                      {i18n.language === 'en-US' ? 'Want to see how it works?' : i18n.language === 'es-419' ? '¿Quieres ver cómo funciona?' : 'Quer ver como funciona?'}
                    </span>
                    <span className="text-[10px] text-text-secondary leading-relaxed block">
                      {i18n.language === 'en-US' ? 'Fill in the fields instantly with the Space Impacta demo project.' : i18n.language === 'es-419' ? 'Completa los campos instantáneamente con el proyecto demo Space Impacta.' : 'Preencha os campos instantaneamente com o projeto de demonstração Space Impacta.'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onLoadExample}
                  className="text-[10px] bg-primary hover:bg-primary-hover text-white font-bold px-3 py-2.5 rounded-lg transition-colors cursor-pointer w-full min-[600px]:w-auto flex-shrink-0 text-center"
                >
                  {t('editor.buttons.load_example')}
                </button>
              </div>

              {/* Nome do projeto */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary">
                  {t('editor.fields.project_name')}
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  placeholder={t('editor.fields.project_name_placeholder')}
                  value={project.name}
                  onChange={e => handleFieldChange('name', e.target.value)}
                  aria-invalid={!!validationErrors.name}
                  aria-describedby={validationErrors.name ? "name-error" : undefined}
                  className={`w-full bg-surface text-text-primary border ${
                    validationErrors.name ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                  } rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs`}
                />
                {validationErrors.name && (
                  <p id="name-error" className="text-[10px] text-red-500 flex items-center font-medium gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{validationErrors.name}</span>
                  </p>
                )}
              </div>

              {/* Descrição curta */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-secondary">
                    {t('editor.fields.short_desc')}
                  </label>
                  <span className="text-[10px] font-semibold text-text-muted">
                    {project.description.length} / 300
                  </span>
                </div>
                <textarea
                  ref={descriptionInputRef}
                  placeholder={t('editor.fields.short_desc_placeholder')}
                  rows={3}
                  maxLength={300}
                  value={project.description}
                  onChange={e => handleFieldChange('description', e.target.value)}
                  aria-invalid={!!validationErrors.description}
                  aria-describedby={validationErrors.description ? "description-error" : undefined}
                  className={`w-full bg-surface text-text-primary border ${
                    validationErrors.description ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                  } rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs resize-none`}
                />
                {validationErrors.description && (
                  <p id="description-error" className="text-[10px] text-red-500 flex items-center font-medium gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{validationErrors.description}</span>
                  </p>
                )}
              </div>

              {/* Tecnologias utilizadas */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary">
                  {i18n.language === 'en-US' ? 'Technologies used' : i18n.language === 'es-419' ? 'Tecnologías utilizadas' : 'Tecnologias utilizadas'}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder={t('editor.techs_placeholder')}
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={handleTechKeyDown}
                    className="flex-1 bg-surface text-text-primary border border-border hover:border-border-strong focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="p-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Tags lists */}
                {project.technologies.length > 0 ? (
                  <div className="flex min-w-0 max-w-full flex-wrap gap-1.5 p-3.5 bg-surface-secondary border border-border rounded-xl">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={tech + idx}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary bg-primary-soft border border-primary/10 px-3 py-1 rounded-full shadow-xs"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(idx)}
                          className="hover:bg-primary/20 text-primary rounded-full p-0.5 focus:outline-none cursor-pointer"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-text-muted italic">
                    {i18n.language === 'en-US' ? 'No technologies added yet.' : i18n.language === 'es-419' ? 'Ninguna tecnología agregada todavía.' : 'Nenhuma tecnologia adicionada ainda.'}
                  </p>
                )}
              </div>
            </div>
        </div>

        {/* ================= SECTION 2: FEATURES ================= */}
        <div className="border border-border rounded-xl overflow-hidden bg-surface-secondary">
          <button
            id="accordion-header-features"
            aria-expanded={expandedSections.features}
            aria-controls="accordion-content-features"
            onClick={() => toggleSection('features')}
            className="w-full flex items-center justify-between p-4 font-bold text-sm text-text-primary focus:outline-none hover:bg-border/10 cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-left flex-1 mr-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-soft dark:bg-primary-soft/10 text-primary flex items-center justify-center shrink-0">
                <List className="w-4 h-4 text-primary" />
              </div>
              <div className="flex min-w-0 max-w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="font-bold text-sm text-text-primary">{t('editor.sections.features')}</span>
                <div className="flex min-w-0 max-w-full flex-wrap gap-1.5">
                  <span className={`text-[10px] border px-2 py-0.5 rounded-full font-medium max-w-full whitespace-nowrap ${
                  project.features?.length > 0
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-background dark:bg-surface border border-border text-text-secondary'
                }`}>
                  {project.features?.length > 0 ? t('editor.status.items', { count: project.features.length }) : t('editor.status.empty')}
                </span>
              </div>
            </div>
          </div>
          {expandedSections.features ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />}
          </button>

            <div
              hidden={!expandedSections.features}
              id="accordion-content-features"
              role="region"
              aria-labelledby="accordion-header-features"
              className="p-4 pt-0 border-t border-border bg-surface space-y-4"
            >
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder={t('editor.features_placeholder')}
                  value={featureInput}
                  onChange={e => setFeatureInput(e.target.value)}
                  onKeyDown={handleFeatureKeyDown}
                  className="flex-1 bg-surface text-text-primary border border-border hover:border-border-strong focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="p-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* List of features with Reorder Handles */}
              {project.features.length > 0 ? (
                <div className="space-y-1.5">
                  {project.features.map((feature, idx) => (
                    <div
                      key={feature + idx}
                      className="flex items-center justify-between p-3 bg-surface-secondary border border-border rounded-xl shadow-xs group"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* Visual grab handle */}
                        <div className="text-text-muted flex items-center space-x-0.5">
                          <GripVertical className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <span className="text-xs font-medium text-text-primary truncate">{feature}</span>
                      </div>

                      <div className="flex items-center space-x-1 flex-shrink-0 ml-3">
                        {/* Keyboard navigation up/down buttons */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveFeature(idx, 'up')}
                          className="p-1 text-text-muted hover:text-primary hover:bg-background rounded-md disabled:opacity-35 cursor-pointer"
                          title={i18n.language === 'en-US' ? 'Move up' : i18n.language === 'es-419' ? 'Mover hacia arriba' : 'Mover para cima'}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === project.features.length - 1}
                          onClick={() => handleMoveFeature(idx, 'down')}
                          className="p-1 text-text-muted hover:text-primary hover:bg-background rounded-md disabled:opacity-35 cursor-pointer"
                          title={i18n.language === 'en-US' ? 'Move down' : i18n.language === 'es-419' ? 'Mover hacia abajo' : 'Mover para baixo'}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-md cursor-pointer"
                          title={i18n.language === 'en-US' ? 'Delete' : i18n.language === 'es-419' ? 'Eliminar' : 'Excluir'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-text-muted italic">
                  {i18n.language === 'en-US' ? 'No features registered.' : i18n.language === 'es-419' ? 'Ninguna funcionalidad registrada.' : 'Nenhuma funcionalidade cadastrada.'}
                </p>
              )}
            </div>
        </div>

        {/* ================= SECTION 3: INSTALLATION ================= */}
        <div className="border border-border rounded-xl overflow-hidden bg-surface-secondary">
          <button
            id="accordion-header-installation"
            aria-expanded={expandedSections.installation}
            aria-controls="accordion-content-installation"
            onClick={() => toggleSection('installation')}
            className="w-full flex items-center justify-between p-4 font-bold text-sm text-text-primary focus:outline-none hover:bg-border/10 cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-left flex-1 mr-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-soft dark:bg-primary-soft/10 text-primary flex items-center justify-center shrink-0">
                <Download className="w-4 h-4 text-primary" />
              </div>
              <div className="flex min-w-0 max-w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="font-bold text-sm text-text-primary">{t('editor.sections.installation')}</span>
                <div className="flex min-w-0 max-w-full flex-wrap gap-1.5">
                  <span className={`text-[10px] border px-2 py-0.5 rounded-full font-medium max-w-full whitespace-nowrap ${
                  project.installation?.trim()
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-background dark:bg-surface border border-border text-text-secondary'
                }`}>
                  {project.installation?.trim() ? t('editor.status.completed') : t('editor.status.empty')}
                </span>
              </div>
            </div>
          </div>
          {expandedSections.installation ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />}
          </button>

            <div
              hidden={!expandedSections.installation}
              id="accordion-content-installation"
              role="region"
              aria-labelledby="accordion-header-installation"
              className="p-4 pt-0 border-t border-border bg-surface space-y-2"
            >
              <label className="text-xs font-bold text-text-secondary block">
                {t('editor.fields.installation')}
              </label>
              <textarea
                placeholder={t('editor.fields.installation_placeholder')}
                rows={4}
                value={project.installation}
                onChange={e => handleFieldChange('installation', e.target.value)}
                className="w-full bg-surface text-text-primary border border-border hover:border-border-strong focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none transition-colors shadow-xs"
              />
            </div>
        </div>

        {/* ================= SECTION 4: HOW TO RUN ================= */}
        <div className="border border-border rounded-xl overflow-hidden bg-surface-secondary">
          <button
            id="accordion-header-execution"
            aria-expanded={expandedSections.execution}
            aria-controls="accordion-content-execution"
            onClick={() => toggleSection('execution')}
            className="w-full flex items-center justify-between p-4 font-bold text-sm text-text-primary focus:outline-none hover:bg-border/10 cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-left flex-1 mr-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-soft dark:bg-primary-soft/10 text-primary flex items-center justify-center shrink-0">
                <Play className="w-4 h-4 fill-primary text-primary" />
              </div>
              <div className="flex min-w-0 max-w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="font-bold text-sm text-text-primary">{t('editor.sections.execution')}</span>
                <div className="flex min-w-0 max-w-full flex-wrap gap-1.5">
                  <span className={`text-[10px] border px-2 py-0.5 rounded-full font-medium max-w-full whitespace-nowrap ${
                  project.usage?.trim()
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-background dark:bg-surface border border-border text-text-secondary'
                }`}>
                  {project.usage?.trim() ? t('editor.status.completed') : t('editor.status.empty')}
                </span>
              </div>
            </div>
          </div>
          {expandedSections.execution ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />}
          </button>

            <div
              hidden={!expandedSections.execution}
              id="accordion-content-execution"
              role="region"
              aria-labelledby="accordion-header-execution"
              className="p-4 pt-0 border-t border-border bg-surface space-y-2"
            >
              <label className="text-xs font-bold text-text-secondary block">
                {t('editor.fields.usage')}
              </label>
              <textarea
                placeholder={t('editor.fields.usage_placeholder')}
                rows={2}
                value={project.usage}
                onChange={e => handleFieldChange('usage', e.target.value)}
                className="w-full bg-surface text-text-primary border border-border hover:border-border-strong focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none transition-colors shadow-xs"
              />
            </div>
        </div>

        {/* ================= SECTION 5: LICENSE ================= */}
        <div className="border border-border rounded-xl overflow-hidden bg-surface-secondary">
          <button
            id="accordion-header-license"
            aria-expanded={expandedSections.license}
            aria-controls="accordion-content-license"
            onClick={() => toggleSection('license')}
            className="w-full flex items-center justify-between p-4 font-bold text-sm text-text-primary focus:outline-none hover:bg-border/10 cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-left flex-1 mr-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-soft dark:bg-primary-soft/10 text-primary flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="flex min-w-0 max-w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="font-bold text-sm text-text-primary">{t('editor.sections.license')}</span>
                <div className="flex min-w-0 max-w-full flex-wrap gap-1.5">
                  <span className={`text-[10px] border px-2 py-0.5 rounded-full font-medium max-w-full whitespace-nowrap max-w-[120px] truncate ${
                  project.license
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-background dark:bg-surface border border-border text-text-secondary'
                }`}>
                  {project.license ? (project.license === 'Personalizada' ? (project.customLicense || (i18n.language === 'en-US' ? 'Custom' : i18n.language === 'es-419' ? 'Personalizada' : 'Personalizada')) : project.license) : t('editor.status.empty')}
                </span>
              </div>
            </div>
          </div>
          {expandedSections.license ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />}
          </button>

            <div
              hidden={!expandedSections.license}
              id="accordion-content-license"
              role="region"
              aria-labelledby="accordion-header-license"
              className="p-4 pt-0 border-t border-border bg-surface space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary">
                  {t('editor.fields.select_license')}
                </label>
                <div className="relative">
                  <select
                    value={project.license}
                    onChange={e => handleFieldChange('license', e.target.value)}
                    className="w-full bg-surface text-text-primary border border-border hover:border-border-strong focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors appearance-none shadow-xs"
                  >
                    <option value="">{t('editor.fields.select_license')}</option>
                    <option value="MIT">MIT</option>
                    <option value="Apache 2.0">Apache 2.0</option>
                    <option value="GPL 3.0">GPL 3.0</option>
                    <option value="BSD 3-Clause">BSD 3-Clause</option>
                    <option value="Proprietária">{i18n.language === 'en-US' ? 'Proprietary' : i18n.language === 'es-419' ? 'Propietaria' : 'Proprietária'}</option>
                    <option value="Sem licença">{i18n.language === 'en-US' ? 'No license' : i18n.language === 'es-419' ? 'Sin licencia' : 'Sem licença'}</option>
                    <option value="Personalizada">{i18n.language === 'en-US' ? 'Custom' : i18n.language === 'es-419' ? 'Personalizada' : 'Personalizada'}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-muted">
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Conditional custom license */}
              {project.license === 'Personalizada' && (
                <div className="space-y-1 animate-fade-in">
                  <label className="text-xs font-bold text-text-secondary block">
                    {t('editor.fields.custom_license')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('editor.fields.custom_license_placeholder')}
                    value={project.customLicense || ''}
                    onChange={e => handleFieldChange('customLicense', e.target.value)}
                    className="w-full bg-surface text-text-primary border border-border hover:border-border-strong focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs"
                  />
                </div>
              )}
            </div>
        </div>

        {/* ================= SECTION 6: LINKS & SOCIALS ================= */}
        <div className="border border-border rounded-xl overflow-hidden bg-surface-secondary">
          <button
            id="accordion-header-links"
            aria-expanded={expandedSections.links}
            aria-controls="accordion-content-links"
            onClick={() => toggleSection('links')}
            className="w-full flex items-center justify-between p-4 font-bold text-sm text-text-primary focus:outline-none hover:bg-border/10 cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-left flex-1 mr-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-soft dark:bg-primary-soft/10 text-primary flex items-center justify-center shrink-0">
                <LinkIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex min-w-0 max-w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="font-bold text-sm text-text-primary">{t('editor.sections.links')}</span>
                <div className="flex min-w-0 max-w-full flex-wrap gap-1.5">
                {(() => {
                  const linkCount = [project.repositoryUrl, project.deployUrl, project.websiteUrl, project.linkedinUrl].filter(url => url?.trim() && isValidHttpUrl(url)).length;
                  return (
                    <span className={`text-[10px] border px-2 py-0.5 rounded-full font-medium max-w-full whitespace-nowrap ${
                      linkCount > 0
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-background dark:bg-surface border border-border text-text-secondary'
                    }`}>
                      {linkCount > 0 ? t('editor.status.items', { count: linkCount }) : t('editor.status.empty')}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
          {expandedSections.links ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />}
          </button>

            <div
              hidden={!expandedSections.links}
              id="accordion-content-links"
              role="region"
              aria-labelledby="accordion-header-links"
              className="p-4 pt-0 border-t border-border bg-surface space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Repositorio */}
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <label className="text-xs font-bold text-text-secondary block">
                  {t('editor.fields.rep_url')}
                </label>
                <input
                  type="url"
                  ref={repositoryUrlRef}
                  placeholder={t('editor.fields.rep_url_placeholder')}
                  value={project.repositoryUrl || ''}
                  onChange={e => handleFieldChange('repositoryUrl', e.target.value)}
                  aria-invalid={!!validationErrors.repositoryUrl}
                  aria-describedby={validationErrors.repositoryUrl ? "repositoryUrl-error" : undefined}
                  className={`w-full bg-surface text-text-primary border ${
                    validationErrors.repositoryUrl ? 'border-red-500 focus:border-red-500' : 'border-border hover:border-border-strong focus:border-primary'
                  } rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs`}
                />
                {validationErrors.repositoryUrl && (
                  <p id="repositoryUrl-error" className="text-[10px] text-red-500 flex items-center font-medium gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{validationErrors.repositoryUrl}</span>
                  </p>
                )}
              </div>

              {/* Deploy */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary block">
                  {t('editor.fields.dep_url')}
                </label>
                <input
                  type="url"
                  ref={deployUrlRef}
                  placeholder={t('editor.fields.dep_url_placeholder')}
                  value={project.deployUrl || ''}
                  onChange={e => handleFieldChange('deployUrl', e.target.value)}
                  aria-invalid={!!validationErrors.deployUrl}
                  aria-describedby={validationErrors.deployUrl ? "deployUrl-error" : undefined}
                  className={`w-full bg-surface text-text-primary border ${
                    validationErrors.deployUrl ? 'border-red-500 focus:border-red-500' : 'border-border hover:border-border-strong focus:border-primary'
                  } rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs`}
                />
                {validationErrors.deployUrl && (
                  <p id="deployUrl-error" className="text-[10px] text-red-500 flex items-center font-medium gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{validationErrors.deployUrl}</span>
                  </p>
                )}
              </div>

              {/* Website */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary block">
                  {t('editor.fields.web_url')}
                </label>
                <input
                  type="url"
                  ref={websiteUrlRef}
                  placeholder={t('editor.fields.web_url_placeholder')}
                  value={project.websiteUrl || ''}
                  onChange={e => handleFieldChange('websiteUrl', e.target.value)}
                  aria-invalid={!!validationErrors.websiteUrl}
                  aria-describedby={validationErrors.websiteUrl ? "websiteUrl-error" : undefined}
                  className={`w-full bg-surface text-text-primary border ${
                    validationErrors.websiteUrl ? 'border-red-500 focus:border-red-500' : 'border-border hover:border-border-strong focus:border-primary'
                  } rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs`}
                />
                {validationErrors.websiteUrl && (
                  <p id="websiteUrl-error" className="text-[10px] text-red-500 flex items-center font-medium gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{validationErrors.websiteUrl}</span>
                  </p>
                )}
              </div>

              {/* LinkedIn */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary block">
                  {t('editor.fields.linkedin')}
                </label>
                <input
                  type="url"
                  ref={linkedinUrlRef}
                  placeholder={t('editor.fields.linkedin_placeholder')}
                  value={project.linkedinUrl || ''}
                  onChange={e => handleFieldChange('linkedinUrl', e.target.value)}
                  aria-invalid={!!validationErrors.linkedinUrl}
                  aria-describedby={validationErrors.linkedinUrl ? "linkedinUrl-error" : undefined}
                  className={`w-full bg-surface text-text-primary border ${
                    validationErrors.linkedinUrl ? 'border-red-500 focus:border-red-500' : 'border-border hover:border-border-strong focus:border-primary'
                  } rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs`}
                />
                {validationErrors.linkedinUrl && (
                  <p id="linkedinUrl-error" className="text-[10px] text-red-500 flex items-center font-medium gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{validationErrors.linkedinUrl}</span>
                  </p>
                )}
              </div>

              {/* E-mail do autor */}
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <label className="text-xs font-bold text-text-secondary block">
                  {t('editor.fields.author_email')}
                </label>
                <input
                  type="email"
                  placeholder={t('editor.fields.author_email_placeholder')}
                  value={project.authorEmail || ''}
                  onChange={e => handleFieldChange('authorEmail', e.target.value)}
                  className="w-full bg-surface text-text-primary border border-border hover:border-border-strong focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs"
                />
              </div>
            </div>
        </div>

        {/* ================= SECTION 7: SCREENSHOTS ================= */}
        <div className="border border-border rounded-xl overflow-hidden bg-surface-secondary">
          <button
            id="accordion-header-screenshots"
            aria-expanded={expandedSections.screenshots}
            aria-controls="accordion-content-screenshots"
            onClick={() => toggleSection('screenshots')}
            className="w-full flex items-center justify-between p-4 font-bold text-sm text-text-primary focus:outline-none hover:bg-border/10 cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-left flex-1 mr-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-soft dark:bg-primary-soft/10 text-primary flex items-center justify-center shrink-0">
                <ImageIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex min-w-0 max-w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="font-bold text-sm text-text-primary">{t('editor.sections.screenshots')}</span>
                <div className="flex min-w-0 max-w-full flex-wrap gap-1.5">
                  <span className={`text-[10px] border px-2 py-0.5 rounded-full font-medium max-w-full whitespace-nowrap ${
                  project.screenshots?.length > 0
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-background dark:bg-surface border border-border text-text-secondary'
                }`}>
                  {project.screenshots?.length > 0 ? t('editor.status.items', { count: project.screenshots.length }) : t('editor.status.empty')}
                </span>
              </div>
            </div>
          </div>
          {expandedSections.screenshots ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />}
          </button>

            <div
              hidden={!expandedSections.screenshots}
              id="accordion-content-screenshots"
              role="region"
              aria-labelledby="accordion-header-screenshots"
              className="p-4 pt-0 border-t border-border bg-surface space-y-4"
            >
              {/* Type toggle URL or local file */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-surface-secondary border border-border rounded-xl">
                <button
                  type="button"
                  onClick={() => setScreenshotSourceType('url')}
                  className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 cursor-pointer ${
                    screenshotSourceType === 'url' ? 'bg-white dark:bg-surface text-primary shadow-xs font-bold' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{i18n.language === 'en-US' ? 'External link' : i18n.language === 'es-419' ? 'Enlace externo' : 'Link externo'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScreenshotSourceType('file')}
                  className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 cursor-pointer ${
                    screenshotSourceType === 'file' ? 'bg-white dark:bg-surface text-primary shadow-xs font-bold' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{i18n.language === 'en-US' ? 'Local file' : i18n.language === 'es-419' ? 'Archivo local' : 'Arquivo local'}</span>
                </button>
              </div>

              {/* Source Inputs */}
              {screenshotSourceType === 'url' ? (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-xs font-bold text-text-secondary block">
                    {i18n.language === 'en-US' ? 'Image URL' : i18n.language === 'es-419' ? 'URL de la imagen' : 'URL da imagem'}
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={scUrl}
                    onChange={e => {
                      const value = e.target.value;
                      setScUrl(value);
                      if (!value.trim() || isValidHttpUrl(value)) {
                        setValidationErrors(prev => {
                          const next = { ...prev };
                          delete next.screenshotUrl;
                          return next;
                        });
                      }
                    }}
                    aria-invalid={!!validationErrors.screenshotUrl}
                    aria-describedby={validationErrors.screenshotUrl ? "screenshotUrl-error" : undefined}
                    className={`w-full bg-surface text-text-primary border ${
                      validationErrors.screenshotUrl ? 'border-red-500 focus:border-red-500' : 'border-border hover:border-border-strong focus:border-primary'
                    } rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs`}
                  />
                  {validationErrors.screenshotUrl && (
                    <p id="screenshotUrl-error" className="text-[10px] text-red-500 flex items-center font-medium gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{validationErrors.screenshotUrl}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2 animate-fade-in border border-dashed border-border-strong rounded-xl p-4 text-center hover:bg-background/20 transition-colors relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    title={i18n.language === 'en-US' ? 'Select a local image file' : i18n.language === 'es-419' ? 'Selecciona un archivo de imagen local' : 'Selecione um arquivo de imagem local'}
                  />
                  <ImageIcon className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-xs font-bold text-text-primary">
                    {i18n.language === 'en-US' ? 'Click to select image' : i18n.language === 'es-419' ? 'Haz clic para seleccionar una imagen' : 'Clique para selecionar imagem'}
                  </p>
                  <p className="text-[10px] text-text-secondary mt-1">
                    {i18n.language === 'en-US' ? 'JPEG, PNG or GIF (Max 1MB)' : i18n.language === 'es-419' ? 'JPEG, PNG o GIF (Máx. 1MB)' : 'JPEG, PNG ou GIF (Máx. 1MB)'}
                  </p>
                  <div className="mt-3 text-[10px] text-text-secondary leading-relaxed bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 text-left">
                    <p className="text-amber-500 font-bold mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {i18n.language === 'en-US' ? 'Notice regarding Local Images:' : i18n.language === 'es-419' ? 'Atención sobre las Imágenes Locales:' : 'Atenção sobre Imagens Locais:'}
                    </p>
                    <ul className="list-disc pl-3.5 space-y-1">
                      {i18n.language === 'en-US' ? (
                        <>
                          <li>This image will be converted to Base64 and saved <strong>only in this browser's cache</strong>.</li>
                          <li>It <strong>will not be uploaded to your GitHub repository</strong> automatically.</li>
                          <li>For the image to work in your official published README, you will need to host it on the web or add it directly to your repository.</li>
                        </>
                      ) : i18n.language === 'es-419' ? (
                        <>
                          <li>Esta imagen se convertirá a Base64 y se guardará <strong>solo en la caché de este navegador</strong>.</li>
                          <li><strong>No se subirá a tu repositorio de GitHub</strong> automáticamente.</li>
                          <li>Para que la imagen funcione en tu README publicado oficial, deberás alojarla en la web o agregarla directamente a tu repositorio.</li>
                        </>
                      ) : (
                        <>
                          <li>Esta imagem será convertida para Base64 e salva <strong>apenas no cache deste navegador</strong>.</li>
                          <li>Ela <strong>não será enviada ao seu repositório do GitHub</strong> automaticamente.</li>
                          <li>Para que a imagem funcione no seu README publicado oficial, você precisará hospedá-la na web ou adicioná-la diretamente ao seu repositório.</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-border">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary block">
                    {t('editor.fields.sc_alt')}
                  </label>
                  <input
                    type="text"
                    placeholder={i18n.language === 'en-US' ? 'e.g. App dashboard screenshot' : i18n.language === 'es-419' ? 'Ej. Captura de pantalla de la app' : 'Ex: Gameplay do Knight'}
                    value={scAlt}
                    onChange={e => setScAlt(e.target.value)}
                    className="w-full bg-surface text-text-primary border border-border hover:border-border-strong focus:border-primary rounded-xl px-3.5 py-1.5 text-xs font-medium focus:outline-none transition-colors shadow-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary block">
                    {t('editor.fields.sc_caption')}
                  </label>
                  <input
                    type="text"
                    placeholder={i18n.language === 'en-US' ? 'e.g. Light mode interface view' : i18n.language === 'es-419' ? 'Ej. Vista de interfaz en modo claro' : 'Ex: Fase final com o chefe'}
                    value={scCaption}
                    onChange={e => setScCaption(e.target.value)}
                    className="w-full bg-surface text-text-primary border border-border hover:border-border-strong focus:border-primary rounded-xl px-3.5 py-1.5 text-xs font-medium focus:outline-none transition-colors shadow-xs"
                  />
                </div>
                {screenshotSourceType === 'url' && (
                  <button
                    type="button"
                    onClick={handleAddScreenshot}
                    className="sm:col-span-2 flex items-center justify-center space-x-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-2 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{i18n.language === 'en-US' ? 'Add external image' : i18n.language === 'es-419' ? 'Agregar imagen externa' : 'Adicionar imagem externa'}</span>
                  </button>
                )}
              </div>

              {/* Screenshots List gallery */}
              {project.screenshots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.screenshots.map((sc, idx) => (
                    <div
                      key={sc.id}
                      className="border border-border rounded-xl overflow-hidden bg-surface-secondary relative group flex flex-col justify-between"
                    >
                      <div className="relative aspect-video w-full bg-background flex items-center justify-center overflow-hidden">
                        <img
                          src={sc.source}
                          alt={sc.alt}
                          className="object-cover w-full h-full max-h-[140px]"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(sc.id, sc.source)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-lg shadow-md hover:scale-105 transition-all focus:outline-none cursor-pointer"
                          title="Remover Screenshot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[10px] font-bold text-text-primary truncate max-w-[120px]" title={sc.alt}>
                            {sc.alt}
                          </p>
                          <div className="flex space-x-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveScreenshot(idx, 'up')}
                              className="p-1 text-text-muted hover:text-primary disabled:opacity-35 cursor-pointer"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === project.screenshots.length - 1}
                              onClick={() => handleMoveScreenshot(idx, 'down')}
                              className="p-1 text-text-muted hover:text-primary disabled:opacity-35 cursor-pointer"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        {sc.caption && (
                          <p className="text-[10px] text-text-secondary italic truncate">
                            &ldquo;{sc.caption}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-text-muted italic">
                  {i18n.language === 'en-US' ? 'No images registered at the moment.' : i18n.language === 'es-419' ? 'Ninguna imagen registrada por el momento.' : 'Nenhuma imagem cadastrada no momento.'}
                </p>
              )}
            </div>
        </div>

        {/* ================= SECTION 8: OPTIONAL SECTIONS ================= */}
        <div className="border border-border rounded-xl overflow-hidden bg-surface-secondary">
          <button
            id="accordion-header-optionals"
            aria-expanded={expandedSections.optionals}
            aria-controls="accordion-content-optionals"
            onClick={() => toggleSection('optionals')}
            className="w-full flex items-center justify-between p-4 font-bold text-sm text-text-primary focus:outline-none hover:bg-border/10 cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-left flex-1 mr-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-soft dark:bg-primary-soft/10 text-primary flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4 text-primary" />
              </div>
              <div className="flex min-w-0 max-w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="font-bold text-sm text-text-primary">{t('editor.sections.optionals')}</span>
                <div className="flex min-w-0 max-w-full flex-wrap gap-1.5">
                <span className="text-[10px] bg-background dark:bg-surface border border-border text-text-secondary px-2 py-0.5 rounded-full font-medium max-w-full whitespace-nowrap">
                  {i18n.language === 'en-US' ? 'Optional' : i18n.language === 'es-419' ? 'Opcional' : 'Opcional'}
                </span>
                {(() => {
                  const activeOptionalsCount = project.optionalSections ? Object.values(project.optionalSections).filter(Boolean).length : 0;
                  return activeOptionalsCount > 0 ? (
                    <span className="text-[10px] border px-2 py-0.5 rounded-full font-medium max-w-full whitespace-nowrap bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      {activeOptionalsCount} {activeOptionalsCount === 1 ? (i18n.language === 'en-US' ? 'active' : i18n.language === 'es-419' ? 'activo' : 'ativo') : (i18n.language === 'en-US' ? 'active' : i18n.language === 'es-419' ? 'activos' : 'ativos')}
                    </span>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
          {expandedSections.optionals ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />}
          </button>

            <div
              hidden={!expandedSections.optionals}
              id="accordion-content-optionals"
              role="region"
              aria-labelledby="accordion-header-optionals"
              className="p-4 pt-0 border-t border-border bg-surface space-y-4"
            >
              <p className="text-xs text-text-secondary leading-normal">
                {i18n.language === 'en-US' ? 'Enable the desired additional sections by clicking the controls and fill in the corresponding information.' : i18n.language === 'es-419' ? 'Active las secciones adicionales deseadas haciendo clic en los controles y complete la información correspondiente.' : 'Ative as seções adicionais desejadas clicando nos controles e preencha as informações correspondentes.'}
              </p>

              {/* Accordions inside accordions */}
              <div className="space-y-3.5">
                {[
                  {
                    key: 'prerequisites',
                    label: i18n.language === 'en-US' ? 'Prerequisites' : i18n.language === 'es-419' ? 'Prerrequisitos' : 'Pré-requisitos',
                    icon: ClipboardList,
                    field: 'prerequisitesContent',
                    placeholder: i18n.language === 'en-US' ? '- Node.js v18+\n- MySQL installed' : i18n.language === 'es-419' ? '- Node.js v18+\n- MySQL instalado' : '- Node.js v18+\n- MySQL instalado'
                  },
                  {
                    key: 'scripts',
                    label: i18n.language === 'en-US' ? 'Available Scripts' : i18n.language === 'es-419' ? 'Scripts disponibles' : 'Scripts disponíveis',
                    icon: SquareTerminal,
                    field: 'scriptsContent',
                    placeholder: i18n.language === 'en-US' ? '- `npm test`: Runs the tests' : i18n.language === 'es-419' ? '- `npm test`: Ejecuta las pruebas' : '- `npm test`: Executa os testes'
                  },
                  {
                    key: 'folderStructure',
                    label: i18n.language === 'en-US' ? 'Folder Structure' : i18n.language === 'es-419' ? 'Estructura de carpetas' : 'Estrutura de pastas',
                    icon: FolderTree,
                    field: 'folderStructureContent',
                    placeholder: '```text\nsrc/\n  ├── components/\n```'
                  },
                  {
                    key: 'roadmap',
                    label: 'Roadmap',
                    icon: Map,
                    field: 'roadmapContent',
                    placeholder: i18n.language === 'en-US' ? '- [x] Integrate API\n- [ ] Deploy' : i18n.language === 'es-419' ? '- [x] Integrar API\n- [ ] Deploy' : '- [x] Integrar API\n- [ ] Deploy'
                  },
                  {
                    key: 'contributing',
                    label: i18n.language === 'en-US' ? 'Contributing' : i18n.language === 'es-419' ? 'Contribución' : 'Contribuição',
                    icon: GitPullRequest,
                    field: 'contributingContent',
                    placeholder: i18n.language === 'en-US' ? 'Instructions for Pull Requests' : i18n.language === 'es-419' ? 'Instrucciones para Pull Requests' : 'Instruções para Pull Requests'
                  },
                  {
                    key: 'authors',
                    label: i18n.language === 'en-US' ? 'Developed by' : i18n.language === 'es-419' ? 'Desarrollado por' : 'Desenvolvido por',
                    icon: UserRound,
                    field: 'authorsContent',
                    placeholder: i18n.language === 'en-US' ? 'Enter the author’s name to add the signature.' : i18n.language === 'es-419' ? 'Introduce el nombre del autor para añadir la firma.' : 'Informe o nome do autor para adicionar a assinatura.'
                  },
                  {
                    key: 'acknowledgements',
                    label: i18n.language === 'en-US' ? 'Acknowledgements' : i18n.language === 'es-419' ? 'Agradecimientos' : 'Agradecimentos',
                    icon: Heart,
                    field: 'acknowledgementsContent',
                    placeholder: i18n.language === 'en-US' ? 'Special thanks to...' : i18n.language === 'es-419' ? 'Agradecimiento especial para...' : 'Agradecimento especial para...'
                  },
                  {
                    key: 'tests',
                    label: i18n.language === 'en-US' ? 'Tests' : i18n.language === 'es-419' ? 'Pruebas' : 'Testes',
                    icon: FlaskConical,
                    field: 'testsContent',
                    placeholder: i18n.language === 'en-US' ? 'Run the test suite with:\n`npm run test`' : i18n.language === 'es-419' ? 'Ejecuta la suite de pruebas con:\n`npm run test`' : 'Rode a suíte de testes com:\n`npm run test`'
                  },
                  {
                    key: 'contact',
                    label: i18n.language === 'en-US' ? 'Contact / Additional Networks' : i18n.language === 'es-419' ? 'Contacto / Redes adicionales' : 'Contato / Redes adicionais',
                    icon: Mail,
                    field: 'contactContent',
                    placeholder: i18n.language === 'en-US' ? 'Questions? Send an email to...' : i18n.language === 'es-419' ? '¿Preguntas? Envía un correo electrónico a...' : 'Dúvidas? Mande um e-mail para...'
                  }
                ].map(item => {
                  const isActive = project.optionalSections[item.key as keyof ReadmeProject['optionalSections']];
                  const isExpanded = isActive && (expandedOptionalSections[item.key] === true);
                  const Icon = item.icon;
                  return (
                    <div key={item.key} className="border border-border rounded-xl overflow-hidden shadow-xs">
                      {/* Sub-header checkbox wrapper */}
                      <div
                        onClick={() => isActive && toggleOptionalExpansion(item.key)}
                        className={`flex items-center justify-between p-3 bg-surface-secondary ${isActive ? 'cursor-pointer hover:bg-border/5' : ''} ${isExpanded ? 'border-b border-border' : ''}`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOptionalSectionToggle(item.key as keyof ReadmeProject['optionalSections']);
                            }}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                              isActive ? 'bg-primary' : 'bg-border-strong'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                isActive ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <Icon className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                          <span className="text-xs font-bold text-text-primary">{item.label}</span>
                        </div>
                        {isActive && (
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] bg-primary-soft text-primary font-semibold px-2 py-0.5 rounded-full">
                              {i18n.language === 'en-US' ? 'Active' : i18n.language === 'es-419' ? 'Activa' : 'Ativa'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-text-muted shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content block */}
                      {isExpanded && (
                        <div className="p-3 bg-surface">
                          {item.key === 'authors' ? (
                            <div className="space-y-4">
                              {/* Nome do autor */}
                              <div className="space-y-1">
                                <label htmlFor="author-name-input" className="text-xs font-bold text-text-secondary block">
                                  {i18n.language === 'en-US' ? 'Author Name' : i18n.language === 'es-419' ? 'Nombre del autor' : 'Nome do autor'}
                                  <span className="text-red-500 ml-0.5">*</span>
                                </label>
                                <input
                                  id="author-name-input"
                                  type="text"
                                  ref={authorNameRef}
                                  placeholder={i18n.language === 'en-US' ? 'E.g.: Thiago Pereira' : i18n.language === 'es-419' ? 'Ej.: Thiago Pereira' : 'Ex.: Thiago Pereira'}
                                  value={project.authorName || ''}
                                  onChange={e => {
                                    handleFieldChange('authorName', e.target.value);
                                  }}
                                  onBlur={() => {
                                    setAuthorNameTouched(true);
                                    if (!project.authorName?.trim()) {
                                      setValidationErrors(prev => ({
                                        ...prev,
                                        authorName: i18n.language === 'en-US'
                                          ? "Enter the author’s name to add the signature."
                                          : i18n.language === 'es-419'
                                            ? "Introduce el nombre del autor para añadir la firma."
                                            : "Informe o nome do autor para adicionar a assinatura."
                                      }));
                                    }
                                  }}
                                  aria-invalid={!!validationErrors.authorName}
                                  aria-describedby="authorName-description"
                                  className={`w-full bg-surface text-text-primary border ${
                                    validationErrors.authorName ? 'border-red-500 focus:border-red-500' : 'border-border hover:border-border-strong focus:border-primary'
                                  } rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs`}
                                />
                                
                                {validationErrors.authorName ? (
                                  <p id="authorName-description" className="text-[10px] text-red-500 flex items-center font-medium gap-1 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{validationErrors.authorName}</span>
                                  </p>
                                ) : (
                                  <p id="authorName-description" className="text-[10px] text-text-muted mt-1 leading-normal">
                                    {i18n.language === 'en-US'
                                      ? "Enter how your name should appear at the end of the README."
                                      : i18n.language === 'es-419'
                                        ? "Informe cómo debe aparecer su nombre al final del README."
                                        : "Informe como seu nome deve aparecer no final do README."}
                                  </p>
                                )}
                              </div>

                              {/* Link do autor */}
                              <div className="space-y-1">
                                <label htmlFor="author-link-input" className="text-xs font-bold text-text-secondary block">
                                  {i18n.language === 'en-US' ? 'Author Link' : i18n.language === 'es-419' ? 'Enlace del autor' : 'Link do autor'}
                                </label>
                                <input
                                  id="author-link-input"
                                  type="url"
                                  ref={authorUrlRef}
                                  placeholder="https://github.com/seu-usuario"
                                  value={project.authorUrl || ''}
                                  onChange={e => handleFieldChange('authorUrl', e.target.value)}
                                  aria-invalid={!!validationErrors.authorUrl}
                                  aria-describedby={validationErrors.authorUrl ? "authorUrl-error" : "authorUrl-description"}
                                  className={`w-full bg-surface text-text-primary border ${
                                    validationErrors.authorUrl ? 'border-red-500 focus:border-red-500' : 'border-border hover:border-border-strong focus:border-primary'
                                  } rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs`}
                                />
                                {validationErrors.authorUrl && (
                                  <p id="authorUrl-error" className="text-[10px] text-red-500 flex items-center font-medium gap-1 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{validationErrors.authorUrl}</span>
                                  </p>
                                )}
                                <p id="authorUrl-description" className="text-[10px] text-text-muted mt-1 leading-normal">
                                  {i18n.language === 'en-US'
                                    ? "Add a link to GitHub, LinkedIn, portfolio or personal website."
                                    : i18n.language === 'es-419'
                                      ? "Añada un enlace a GitHub, LinkedIn, portafolio o sitio web personal."
                                      : "Adicione um link para GitHub, LinkedIn, portfólio ou site pessoal."}
                                </p>
                              </div>

                              {/* Signature Preview */}
                              {project.authorName?.trim() && (
                                <div className="space-y-1.5 pt-1">
                                  <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold">
                                    {i18n.language === 'en-US' ? 'Signature Preview' : i18n.language === 'es-419' ? 'Vista previa de la firma' : 'Pré-visualização da assinatura'}
                                  </p>
                                  <div className="p-2.5 bg-background border border-border rounded-xl font-mono text-xs text-text-secondary">
                                    ---<br/><br/>
                                    💻 {i18n.language === 'en-US' ? 'Developed by' : i18n.language === 'es-419' ? 'Desarrollado por' : 'Desenvolvido por'}{' '}
                                    <strong>
                                      {getAuthorLink(project) ? (
                                        <a href={getAuthorLink(project)!} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                          {project.authorName}
                                        </a>
                                      ) : (
                                        project.authorName
                                      )}
                                    </strong>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <textarea
                              placeholder={item.placeholder}
                              rows={3}
                              value={getOptionalContentValue(item.field)}
                              onChange={e => handleOptionalContentChange(item.field, e.target.value)}
                              className="w-full bg-surface text-text-primary border border-border hover:border-border-strong focus:border-primary rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-colors shadow-xs"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
        </div>
      </div>

      {/* ================= ACTION BAR BUTTONS ================= */}
      <div className="border-t border-border pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-2">
          {/* Limpar tudo */}
          <button
            type="button"
            onClick={onClear}
            className="flex-1 sm:flex-initial text-text-primary hover:bg-background border border-border px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            {t('editor.buttons.clear_all')}
          </button>

          {/* Salvar rascunho */}
          <button
            type="button"
            onClick={handleValidateAndSave}
            className="flex-1 sm:flex-initial text-text-primary hover:bg-background border border-border px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            {t('editor.buttons.save_draft')}
          </button>
        </div>

        {/* Gerar README */}
        <button
          type="button"
          onClick={handleValidateAndGenerate}
          className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all duration-200 active:scale-98 cursor-pointer flex items-center justify-center space-x-1.5"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>{t('editor.buttons.generate_readme')}</span>
        </button>
      </div>
    </div>
  );
};
