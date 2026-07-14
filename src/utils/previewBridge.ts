import { ReadmeProject, AppLocale } from '../types';

export const PREVIEW_STORAGE_KEY = 'readme:preview:v1';
export const PREVIEW_CHANNEL_NAME = 'readme-preview-sync';

export interface ReadmePreviewSnapshot {
  schemaVersion: 1;
  generatedAt: string;
  projectId: string;
  projectName: string;
  locale: AppLocale;
  project: ReadmeProject;
  markdown: string;
}

/**
 * Validate that an object conforms to the ReadmePreviewSnapshot type
 */
export function validateSnapshot(snapshot: unknown): snapshot is ReadmePreviewSnapshot {
  if (!snapshot || typeof snapshot !== 'object') {
    console.warn('[README Preview] Validation failed: snapshot is not an object', snapshot);
    return false;
  }

  const candidate = snapshot as Partial<ReadmePreviewSnapshot>;

  if (candidate.schemaVersion !== 1) {
    console.warn('[README Preview] Validation failed: schemaVersion mismatch (expected 1)', candidate.schemaVersion);
    return false;
  }

  if (typeof candidate.markdown !== 'string') {
    console.warn('[README Preview] Validation failed: markdown is not a string');
    return false;
  }

  if (!candidate.project || typeof candidate.project !== 'object') {
    console.warn('[README Preview] Validation failed: project is not a valid object');
    return false;
  }

  if (!candidate.projectId && !candidate.project.id) {
    console.warn('[README Preview] Validation failed: missing projectId');
    return false;
  }

  const validLocales: AppLocale[] = ['pt-BR', 'en-US', 'es-419'];
  if (candidate.locale && !validLocales.includes(candidate.locale)) {
    console.warn('[README Preview] Validation failed: unsupported locale', candidate.locale);
    return false;
  }

  return true;
}

/**
 * Validate active project before generation
 */
export function validateProject(project: ReadmeProject): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!project) {
    errors.push('Projeto inválido.');
  } else if (!project.name || !project.name.trim()) {
    errors.push('Por favor, informe o nome do projeto.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Save preview snapshot to localStorage
 */
export function savePreviewSnapshot(snapshot: ReadmePreviewSnapshot): boolean {
  try {
    const serialized = JSON.stringify(snapshot);
    localStorage.setItem(PREVIEW_STORAGE_KEY, serialized);
    
    // Confirm write synchronously
    const saved = localStorage.getItem(PREVIEW_STORAGE_KEY);
    if (saved === serialized) {
      return true;
    } else {
      console.error('[README Preview] Verification failed: saved content does not match');
      return false;
    }
  } catch (err) {
    console.error('[README Preview] Error saving preview snapshot to localStorage:', err);
    return false;
  }
}

/**
 * Read preview snapshot from localStorage and validate it
 */
export function readPreviewSnapshot(): ReadmePreviewSnapshot | null {
  try {
    const serialized = localStorage.getItem(PREVIEW_STORAGE_KEY);
    if (!serialized) {
      return null;
    }

    const parsed = JSON.parse(serialized);
    if (validateSnapshot(parsed)) {
      return parsed;
    } else {
      console.warn('[README Preview] Existing snapshot in localStorage is invalid.');
      return null;
    }
  } catch (err) {
    console.error('[README Preview] Error reading or parsing snapshot from localStorage:', err);
    return null;
  }
}

/**
 * Check if the localStorage key exists at all (even if invalid)
 */
export function hasPreviewSnapshotKey(): boolean {
  try {
    return localStorage.getItem(PREVIEW_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Read the raw, unvalidated localStorage content for diagnostics
 */
export function readRawSnapshot(): string | null {
  try {
    return localStorage.getItem(PREVIEW_STORAGE_KEY);
  } catch {
    return null;
  }
}
