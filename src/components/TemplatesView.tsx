import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedTemplates, ReadmeTemplate } from '../data/templatesData';
import { 
  Layout, 
  Gamepad2, 
  Server, 
  Smartphone, 
  Code2, 
  User, 
  FileCode2, 
  Sparkles,
  ArrowRight,
  Search,
  GraduationCap,
  FilePlus2
} from 'lucide-react';

interface TemplatesViewProps {
  onSelectTemplate: (template: ReadmeTemplate) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onSelectTemplate }) => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const templates = getLocalizedTemplates(i18n.language);

  // Map icon strings to Lucide components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout': return Layout;
      case 'Gamepad2': return Gamepad2;
      case 'Server': return Server;
      case 'Smartphone': return Smartphone;
      case 'Code2': return Code2;
      case 'User': return User;
      case 'GraduationCap': return GraduationCap;
      case 'FilePlus2': return FilePlus2;
      default: return FileCode2;
    }
  };

  // Get unique categories
  const categories = ['Todos', ...Array.from(new Set(templates.map(t => t.category)))];

  // Scratch template definition
  const scratchTemplate: ReadmeTemplate = {
    id: 'tpl-scratch',
    name: t('templates.scratch.title'),
    category: t('templates.scratch.category'),
    description: t('templates.scratch.description'),
    icon: 'FilePlus2',
    project: {}
  };

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const nameMatches = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatches = template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatches || descMatches;
    
    const matchesCategory = selectedCategory === 'Todos' || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Inject "Começar do zero" as the first element if selected category is "Todos"
  let displayedTemplates = [...filteredTemplates];
  if (selectedCategory === 'Todos') {
    const scratchTitle = t('templates.scratch.title');
    const scratchDesc = t('templates.scratch.description');
    const matchesSearch = !searchQuery || 
      scratchTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scratchDesc.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (matchesSearch) {
      displayedTemplates.unshift(scratchTemplate);
    }
  }

  const getTemplateName = (template: ReadmeTemplate) => {
    if (template.id === 'tpl-scratch') return t('templates.scratch.title');
    if (template.id === 'tpl-space-impacta') return t('templates.space_impacta.title');
    return template.name;
  };

  const getTemplateDescription = (template: ReadmeTemplate) => {
    if (template.id === 'tpl-scratch') return t('templates.scratch.description');
    if (template.id === 'tpl-space-impacta') return t('templates.space_impacta.description');
    return template.description;
  };

  const getTemplateCategory = (template: ReadmeTemplate) => {
    if (template.id === 'tpl-scratch') return t('templates.scratch.category');
    if (template.id === 'tpl-space-impacta') return t('templates.space_impacta.tag');
    return template.category;
  };

  const getButtonText = (templateId: string) => {
    if (templateId === 'tpl-scratch') {
      return t('templates.scratch.button');
    }
    if (templateId === 'tpl-space-impacta') {
      return t('templates.space_impacta.button');
    }
    return t('templates.use_template');
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-sans font-bold text-text-primary tracking-tight">
            {t('templates.title')}
          </h2>
          <p className="text-sm text-text-secondary">
            {t('templates.subtitle')}
          </p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Category Pill selectors */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-small'
                  : 'bg-surface hover:bg-border/30 text-text-secondary border border-border'
              }`}
            >
              {cat === 'Todos' ? t('templates.categories.all') : cat}
            </button>
          ))}
        </div>

        {/* Search Input bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('templates.search_placeholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-surface text-text-primary border border-border hover:border-border-strong focus:border-primary rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none transition-colors shadow-small"
          />
        </div>
      </div>

      {/* Templates Grid */}
      {displayedTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedTemplates.map(template => {
            const IconComponent = getIcon(template.icon);
            const isSpaceImpacta = template.id === 'tpl-space-impacta';
            const isScratch = template.id === 'tpl-scratch';

            const badgeClass = isSpaceImpacta
              ? "text-[10px] uppercase font-bold text-primary bg-primary-soft/10 px-2.5 py-1 rounded-full border border-primary/20 whitespace-nowrap"
              : isScratch
              ? "text-[10px] uppercase font-bold text-text-muted bg-background dark:bg-surface-secondary px-2.5 py-1 rounded-full border border-dashed border-border whitespace-nowrap"
              : "text-[10px] uppercase font-bold text-text-muted bg-background dark:bg-surface-secondary px-2.5 py-1 rounded-full border border-border whitespace-nowrap";

            return (
              <div
                key={template.id}
                className="bg-surface border border-border hover:border-primary-soft hover:shadow-card p-6 rounded-2xl flex flex-col h-full transition-all duration-300 group"
              >
                {/* Upper row: Icon + category/badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-soft dark:bg-primary-soft/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className={badgeClass}>
                    {getTemplateCategory(template)}
                  </span>
                </div>

                {/* Content body containing Title, Description, and Tech */}
                <div className="flex flex-col flex-grow">
                  <h3 className="text-base font-bold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {getTemplateName(template)}
                  </h3>
                  
                  <div className="h-14 mb-4">
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                      {getTemplateDescription(template)}
                    </p>
                  </div>

                  {/* Aligned technologies area */}
                  <div className="mt-auto mb-6">
                    <div className="flex flex-wrap gap-1.5 h-6 items-center">
                      {template.project.technologies && template.project.technologies.length > 0 && (
                        <>
                          {template.project.technologies.slice(0, 4).map(tech => (
                            <span
                              key={tech}
                              className="text-[10px] font-medium text-text-secondary bg-surface-secondary border border-border px-2 py-0.5 rounded-md whitespace-nowrap"
                            >
                              {tech}
                            </span>
                          ))}
                          {template.project.technologies.length > 4 && (
                            <span className="text-[10px] font-bold text-text-muted px-2 py-0.5 whitespace-nowrap">
                              +{template.project.technologies.length - 4}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Always-bottom-aligned button */}
                <div className="mt-auto pt-2">
                  <button
                    onClick={() => onSelectTemplate(template)}
                    className="w-full flex items-center justify-center space-x-2 bg-surface-secondary hover:bg-primary hover:text-white border border-border hover:border-primary text-text-primary text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-primary group-hover:text-white transition-colors flex-shrink-0" />
                    <span>{getButtonText(template.id)}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="text-text-muted mb-4 text-4xl">🔍</div>
          <h3 className="font-bold text-text-primary text-lg mb-1">{t('templates.empty_title')}</h3>
          <p className="text-xs text-text-secondary">
            {t('templates.empty_desc')}
          </p>
        </div>
      )}
    </div>
  );
};
