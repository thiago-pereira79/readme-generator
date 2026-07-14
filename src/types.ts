import { AppLocale, AppSettings } from './types/settings';

export type { AppLocale, AppSettings };

export interface ReadmeScreenshot {
  id: string;
  source: string;
  alt: string;
  caption?: string;
}

export interface ReadmeOptionalSections {
  prerequisites: boolean;
  scripts: boolean;
  folderStructure: boolean;
  roadmap: boolean;
  contributing: boolean;
  authors: boolean;
  acknowledgements: boolean;
  contact: boolean;
  tests: boolean;
}

export type Theme = 'light' | 'dark';

export interface ReadmeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  features: string[];
  installation: string;
  usage: string;
  license: string;
  repositoryUrl: string;
  deployUrl: string;
  customLicense?: string;
  websiteUrl?: string;
  authorName: string;
  authorEmail?: string;
  authorUrl?: string;
  linkedinUrl?: string;
  screenshots: ReadmeScreenshot[];
  optionalSections: ReadmeOptionalSections;
  // Optional section contents
  prerequisitesContent?: string;
  scriptsContent?: string;
  folderStructureContent?: string;
  roadmapContent?: string;
  contributingContent?: string;
  authorsContent?: string;
  acknowledgementsContent?: string;
  contactContent?: string;
  testsContent?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectFieldUpdater = <
  Key extends keyof ReadmeProject,
>(
  field: Key,
  value: ReadmeProject[Key],
) => void;

export type ReadmePreferences = AppSettings;

export interface ReadmeHistoryLog {
  id: string;
  action: 'created' | 'updated' | 'exported' | 'duplicated' | 'deleted';
  projectName: string;
  timestamp: string;
}

export interface ReadmeBackup {
  schemaVersion: number;
  exportedAt: string;
  appName: "README";
  activeProject: ReadmeProject | null;
  projects: ReadmeProject[];
  history: ReadmeHistoryLog[];
  preferences: AppSettings;
}

