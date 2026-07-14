import { ReadmeProject, AppLocale } from '../types';
import i18n from '../i18n';

/**
 * Helper to turn technology into shield.io badge URL
 */
function getTechBadge(tech: string): string {
  const label = tech.trim();
  const cleanLabel = label
    .replace(/_/g, '__')
    .replace(/-/g, '--')
    .replace(/\s+/g, '_');
  const encodedLabel = encodeURIComponent(cleanLabel);
  
  const lowerTech = tech.toLowerCase();
  let color = '6437e8'; // default purple
  let logo = '';
  let logoColor = '';

  if (lowerTech.includes('react')) {
    color = '20232A';
    logo = 'react';
    logoColor = '61DAFB';
  } else if (lowerTech.includes('typescript') || lowerTech.includes('ts')) {
    color = '3178C6';
    logo = 'typescript';
    logoColor = 'white';
  } else if (lowerTech.includes('node')) {
    color = '339933';
    logo = 'nodedotjs';
    logoColor = 'white';
  } else if (lowerTech.includes('vite')) {
    color = '646CFF';
    logo = 'vite';
    logoColor = 'FFD62E';
  } else if (lowerTech.includes('tailwind')) {
    color = '06B6D4';
    logo = 'tailwindcss';
    logoColor = 'white';
  } else if (lowerTech.includes('canvas')) {
    color = 'E44D26';
    logo = 'html5';
    logoColor = 'white';
  } else if (lowerTech.includes('html5') || lowerTech.includes('html')) {
    color = 'E34F26';
    logo = 'html5';
    logoColor = 'white';
  } else if (lowerTech.includes('css3') || lowerTech.includes('css')) {
    color = '1572B6';
    logo = 'css3';
    logoColor = 'white';
  } else if (lowerTech.includes('javascript') || lowerTech.includes('js')) {
    color = 'F7DF1E';
    logo = 'javascript';
    logoColor = 'black';
  } else if (lowerTech.includes('express')) {
    color = '000000';
    logo = 'express';
    logoColor = 'white';
  } else if (lowerTech.includes('docker')) {
    color = '2496ED';
    logo = 'docker';
    logoColor = 'white';
  } else if (lowerTech.includes('postgres') || lowerTech.includes('sql')) {
    color = '4169E1';
    logo = 'postgresql';
    logoColor = 'white';
  } else if (lowerTech.includes('prisma')) {
    color = '2D3748';
    logo = 'prisma';
    logoColor = 'white';
  } else if (lowerTech.includes('redis')) {
    color = 'DC382D';
    logo = 'redis';
    logoColor = 'white';
  } else if (lowerTech.includes('expo')) {
    color = '000020';
    logo = 'expo';
    logoColor = 'white';
  } else if (lowerTech.includes('python')) {
    color = '3776AB';
    logo = 'python';
    logoColor = 'white';
  }

  const params: string[] = ['style=flat'];
  if (logo) {
    params.push(`logo=${encodeURIComponent(logo)}`);
  }
  if (logoColor) {
    params.push(`logoColor=${encodeURIComponent(logoColor)}`);
  }

  return `https://img.shields.io/badge/${encodedLabel}-${color}?${params.join('&')}`;
}

/**
 * Helper to get license badge URL
 */
function getLicenseBadge(license: string): string {
  const cleanLabel = license.trim()
    .replace(/_/g, '__')
    .replace(/-/g, '--')
    .replace(/\s+/g, '_');
  const normalized = encodeURIComponent(cleanLabel);
  
  let color = 'blue';
  if (license === 'MIT') color = 'green';
  else if (license === 'GPL 3.0') color = 'red';
  else if (license === 'Apache 2.0') color = 'orange';
  else if (license === 'BSD 3-Clause') color = 'yellow';
  else if (license === 'Proprietária') color = 'lightgrey';
  else if (license === 'Sem licença') color = 'grey';
  
  return `https://img.shields.io/badge/License-${normalized}-${color}?style=flat`;
}

/**
 * Validates a user-provided external URL.
 * Common link fields intentionally accept only HTTP(S) protocols.
 */
export function isValidHttpUrl(url?: string): boolean {
  const normalizedUrl = url?.trim();
  if (!normalizedUrl) return false;
  try {
    const parsed = new URL(normalizedUrl);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export const validateUrl = isValidHttpUrl;

/**
 * Gets a valid profile link for the author (LinkedIn, Portfolio/Website, or Github extracted from repo)
 */
export function getAuthorLink(project: ReadmeProject): string | null {
  if (project.authorUrl && project.authorUrl.trim() && isValidHttpUrl(project.authorUrl)) {
    return project.authorUrl.trim();
  }
  if (project.linkedinUrl && project.linkedinUrl.trim() && isValidHttpUrl(project.linkedinUrl)) {
    return project.linkedinUrl.trim();
  }
  if (project.websiteUrl && project.websiteUrl.trim() && isValidHttpUrl(project.websiteUrl)) {
    return project.websiteUrl.trim();
  }
  if (project.repositoryUrl && project.repositoryUrl.trim() && isValidHttpUrl(project.repositoryUrl)) {
    const repo = project.repositoryUrl.trim();
    const githubMatch = repo.match(/^(https?:\/\/(?:www\.)?(?:github|gitlab)\.com\/[^/]+)/i);
    if (githubMatch) {
      return githubMatch[1];
    }
    return repo;
  }
  return null;
}

/**
 * Creates a URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

/**
 * Generates a full markdown string based on a ReadmeProject model
 */
export function generateReadmeMarkdown(project: ReadmeProject, showBadges = true, language: AppLocale = 'pt-BR'): string {
  const t = i18n.getFixedT(language);

  let md = '';

  // Title
  md += `# ${project.name || t('readme.untitled_project')}\n\n`;

  // Badges
  if (showBadges) {
    let badges = '';
    
    // Tech badges
    if (project.technologies && project.technologies.length > 0) {
      project.technologies.forEach(tech => {
        badges += `![${tech}](${getTechBadge(tech)}) `;
      });
    }

    // License badge
    if (project.license && project.license !== 'Sem licença') {
      badges += `![License](${getLicenseBadge(project.license === 'Personalizada' ? (project.customLicense || 'Custom') : project.license)})`;
    }

    if (badges.trim()) {
      md += `${badges.trim()}\n\n`;
    }
  }

  // Description
  if (project.description) {
    md += `${project.description}\n\n`;
  }

  // Links (Deploy, Website, Repo)
  let linksStr = '';
  if (project.deployUrl && project.deployUrl.trim() && isValidHttpUrl(project.deployUrl)) {
    linksStr += `- **${t('readme.deploy')}** [${t('readme.deploy_btn')}](${project.deployUrl})\n`;
  }
  if (project.websiteUrl && project.websiteUrl.trim() && isValidHttpUrl(project.websiteUrl)) {
    linksStr += `- **${t('readme.website')}** [${t('readme.website_btn')}](${project.websiteUrl})\n`;
  }
  if (project.repositoryUrl && project.repositoryUrl.trim() && isValidHttpUrl(project.repositoryUrl)) {
    linksStr += `- **${t('readme.repo')}** [${t('readme.repo_btn')}](${project.repositoryUrl})\n`;
  }
  if (linksStr) {
    md += `## ${t('readme.links')}\n\n${linksStr}\n`;
  }

  // Features
  if (project.features && project.features.length > 0) {
    md += `## ${t('readme.features')}\n\n`;
    project.features.forEach(feature => {
      md += `- ${feature}\n`;
    });
    md += `\n`;
  }

  // Technologies
  if (project.technologies && project.technologies.length > 0) {
    md += `## ${t('readme.techs')}\n\n`;
    project.technologies.forEach(tech => {
      md += `- ${tech}\n`;
    });
    md += `\n`;
  }

  // Prerequisites (Optional)
  if (project.optionalSections?.prerequisites && project.prerequisitesContent) {
    md += `## ${t('readme.prerequisites')}\n\n${project.prerequisitesContent}\n\n`;
  }

  // Installation
  if (project.installation) {
    md += `## ${t('readme.installation')}\n\n\`\`\`bash\n${project.installation}\n\`\`\`\n\n`;
  }

  // Usage
  if (project.usage) {
    md += `## ${t('readme.usage')}\n\n\`\`\`bash\n${project.usage}\n\`\`\`\n\n`;
  }

  // Scripts (Optional)
  if (project.optionalSections?.scripts && project.scriptsContent) {
    md += `## ${t('readme.scripts')}\n\n${project.scriptsContent}\n\n`;
  }

  // Folder Structure (Optional)
  if (project.optionalSections?.folderStructure && project.folderStructureContent) {
    md += `## ${t('readme.folder_structure')}\n\n${project.folderStructureContent}\n\n`;
  }

  // Tests (Optional)
  if (project.optionalSections?.tests && project.testsContent) {
    md += `## ${t('readme.tests')}\n\n${project.testsContent}\n\n`;
  }

  // Screenshots
  if (project.screenshots && project.screenshots.length > 0) {
    md += `## ${t('readme.screenshots')}\n\n`;
    project.screenshots
      .filter(sc => sc.source?.startsWith('data:image/') || isValidHttpUrl(sc.source))
      .forEach(sc => {
      md += `### ${sc.alt || 'Screenshot'}\n`;
      md += `![${sc.alt || 'Screenshot'}](${sc.source})\n`;
      if (sc.caption) {
        md += `*${sc.caption}*\n`;
      }
      md += `\n`;
    });
  }

  // Roadmap (Optional)
  if (project.optionalSections?.roadmap && project.roadmapContent) {
    md += `## ${t('readme.roadmap')}\n\n${project.roadmapContent}\n\n`;
  }

  // Contributing (Optional)
  if (project.optionalSections?.contributing && project.contributingContent) {
    md += `## ${t('readme.contributing')}\n\n${project.contributingContent}\n\n`;
  }

  // Acknowledgements (Optional)
  if (project.optionalSections?.acknowledgements && project.acknowledgementsContent) {
    md += `## ${t('readme.acknowledgements')}\n\n${project.acknowledgementsContent}\n\n`;
  }

  // Contact (Optional)
  if (project.optionalSections?.contact && project.contactContent) {
    md += `## ${t('readme.contact')}\n\n${project.contactContent}\n\n`;
  } else if (project.optionalSections?.contact && (project.authorName || project.authorEmail || project.linkedinUrl)) {
    md += `## ${t('readme.contact')}\n\n`;
    if (project.authorName) md += `- **${t('readme.author')}** ${project.authorName}\n`;
    if (project.authorEmail) md += `- **${t('readme.email')}** [${project.authorEmail}](mailto:${project.authorEmail})\n`;
    if (project.linkedinUrl && project.linkedinUrl.trim() && isValidHttpUrl(project.linkedinUrl)) {
      md += `- **${t('readme.linkedin')}** [${t('readme.linkedin_btn')}](${project.linkedinUrl})\n`;
    }
    md += `\n`;
  }

  // License
  if (project.license && project.license !== 'Sem licença') {
    const licName = project.license === 'Personalizada' ? (project.customLicense || t('readme.custom_license')) : project.license;
    md += `## ${t('readme.license')}\n\n`;
    md += `${t('readme.license_text').replace('{license}', licName)}\n`;
  }

  // Authors / Signature (last element of the README)
  if (project.optionalSections?.authors && project.authorName?.trim()) {
    const authorName = project.authorName.trim();
    const link = getAuthorLink(project);
    const displayName = link ? `[${authorName}](${link})` : authorName;
    
    let signatureText = '';
    if (language === 'en-US') {
      signatureText = `💻 Developed by **${displayName}**`;
    } else if (language === 'es-419') {
      signatureText = `💻 Desarrollado por **${displayName}**`;
    } else {
      signatureText = `💻 Desenvolvido por **${displayName}**`;
    }
    
    md = md.trim() + `\n\n---\n\n${signatureText}\n`;
  }

  return md.trim() + '\n';
}

/**
 * Triggers a download in the browser
 */
export function downloadFile(content: string, filename: string, mimeType: string): boolean {
  try {
    const type = mimeType.includes('charset=') ? mimeType : `${mimeType};charset=utf-8`;
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.style.position = 'fixed';
    link.style.left = '-9999px';
    link.style.top = '0';
    link.setAttribute('aria-hidden', 'true');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    return true;
  } catch {
    return false;
  }
}

export function getReadmeDownloadFilename(projectName?: string): string {
  const slug = createSlug(projectName || 'projeto') || 'projeto';
  return `${slug}-README.md`;
}

export type ClipboardCopyStatus = 'success' | 'permission-denied' | 'unavailable' | 'failed';

export async function copyTextToClipboard(text: string): Promise<ClipboardCopyStatus> {
  if (!text) return 'failed';

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return 'success';
    } catch (error) {
      const name = error instanceof DOMException ? error.name : '';
      const fallbackResult = fallbackCopyText(text);
      if (fallbackResult) return 'success';
      return name === 'NotAllowedError' || name === 'SecurityError' ? 'permission-denied' : 'failed';
    }
  }

  return fallbackCopyText(text) ? 'success' : 'unavailable';
}

function fallbackCopyText(text: string): boolean {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', 'true');
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '0';
  textArea.style.opacity = '0';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, textArea.value.length);

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(textArea);
  }
}
