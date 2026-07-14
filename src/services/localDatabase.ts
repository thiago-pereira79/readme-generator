import { ReadmeProject, AppSettings, ReadmeHistoryLog } from '../types';

const DB_NAME = 'ReadmeLocalDB';
const DB_VERSION = 1;

export function initializeDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('drafts')) {
        db.createObjectStore('drafts', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('history')) {
        db.createObjectStore('history', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<{ db: IDBDatabase, store: IDBObjectStore, transaction: IDBTransaction }> {
  return initializeDatabase().then(db => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    return { db, store, transaction };
  });
}

export function saveProject(project: ReadmeProject): Promise<void> {
  return getStore('projects', 'readwrite').then(({ store }) => {
    return new Promise<void>((resolve, reject) => {
      const request = store.put(project);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

export function getProject(id: string): Promise<ReadmeProject | null> {
  return getStore('projects', 'readonly').then(({ store }) => {
    return new Promise<ReadmeProject | null>((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  });
}

export function getAllProjects(): Promise<ReadmeProject[]> {
  return getStore('projects', 'readonly').then(({ store }) => {
    return new Promise<ReadmeProject[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const results = (request.result || []) as ReadmeProject[];
        results.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  });
}

export function deleteProject(id: string): Promise<void> {
  return getStore('projects', 'readwrite').then(({ store }) => {
    return new Promise<void>((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

export function saveActiveDraft(project: ReadmeProject): Promise<void> {
  return getStore('drafts', 'readwrite').then(({ store }) => {
    return new Promise<void>((resolve, reject) => {
      // Store under static ID 'active' to keep single draft
      const draftWithId = { ...project, id: 'active' };
      const request = store.put(draftWithId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

export function getActiveDraft(): Promise<ReadmeProject | null> {
  return getStore('drafts', 'readonly').then(({ store }) => {
    return new Promise<ReadmeProject | null>((resolve, reject) => {
      const request = store.get('active');
      request.onsuccess = () => resolve((request.result || null) as ReadmeProject | null);
      request.onerror = () => reject(request.error);
    });
  });
}

export function addHistoryEntry(log: ReadmeHistoryLog): Promise<void> {
  return getStore('history', 'readwrite').then(({ store }) => {
    return new Promise<void>((resolve, reject) => {
      const request = store.put(log);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

export function getHistory(): Promise<ReadmeHistoryLog[]> {
  return getStore('history', 'readonly').then(({ store }) => {
    return new Promise<ReadmeHistoryLog[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const results = (request.result || []) as ReadmeHistoryLog[];
        results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  });
}

export function clearHistory(): Promise<void> {
  return getStore('history', 'readwrite').then(({ store }) => {
    return new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

interface StoredSettings extends AppSettings {
  id: string;
}

export function saveSettings(settings: AppSettings): Promise<void> {
  return getStore('settings', 'readwrite').then(({ store }) => {
    return new Promise<void>((resolve, reject) => {
      const settingsWithId: StoredSettings = { ...settings, id: 'preferences' };
      const request = store.put(settingsWithId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

export function getSettings(): Promise<AppSettings | null> {
  return getStore('settings', 'readonly').then(({ store }) => {
    return new Promise<AppSettings | null>((resolve, reject) => {
      const request = store.get('preferences');
      request.onsuccess = () => {
        if (!request.result) {
          resolve(null);
        } else {
          const { id, ...settings } = request.result as StoredSettings;
          resolve(settings);
        }
      };
      request.onerror = () => reject(request.error);
    });
  });
}

export function clearAllApplicationData(): Promise<void> {
  return initializeDatabase().then(db => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(['projects', 'drafts', 'history', 'settings'], 'readwrite');
      const pStore = transaction.objectStore('projects');
      const dStore = transaction.objectStore('drafts');
      const hStore = transaction.objectStore('history');
      const sStore = transaction.objectStore('settings');
      
      pStore.clear();
      dStore.clear();
      hStore.clear();
      sStore.clear();
      
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  });
}
