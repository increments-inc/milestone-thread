export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker is ready
            if (window.confirm('New version available! Refresh to update?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });

      // Request background sync permission
      if ('sync' in registration) {
        try {
          await registration.sync.register('milestone-sync');
        } catch (error) {
          console.log('Background sync registration failed:', error);
        }
      }

      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
  }
};

// Utility functions for offline data management
export const offlineStorage = {
  // Check if we're online
  isOnline: () => navigator.onLine,

  // Initialize IndexedDB
  initDB: async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MilestoneThreadDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('milestones')) {
          const milestoneStore = db.createObjectStore('milestones', { keyPath: 'id' });
          milestoneStore.createIndex('createdAt', 'createdAt', { unique: false });
          milestoneStore.createIndex('status', 'status', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('rewards')) {
          const rewardStore = db.createObjectStore('rewards', { keyPath: 'id' });
          rewardStore.createIndex('milestoneId', 'milestoneId', { unique: false });
          rewardStore.createIndex('claimed', 'claimed', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  },

  // Save milestone for offline access
  saveMilestone: async (milestone) => {
    try {
      const db = await offlineStorage.initDB();
      const tx = db.transaction(['milestones'], 'readwrite');
      const store = tx.objectStore('milestones');
      
      return new Promise((resolve, reject) => {
        const request = store.put(milestone);
        request.onsuccess = () => {
          resolve(request.result);
          
          // Notify service worker to cache
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'CACHE_MILESTONE_DATA',
              milestone
            });
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error saving milestone:', error);
      throw error;
    }
  },

  // Get all milestones from IndexedDB
  getMilestones: async () => {
    try {
      const db = await offlineStorage.initDB();
      const tx = db.transaction(['milestones'], 'readonly');
      const store = tx.objectStore('milestones');
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting milestones:', error);
      return [];
    }
  },

  // Queue an action for sync
  queueSync: async (action) => {
    try {
      const db = await offlineStorage.initDB();
      const tx = db.transaction(['syncQueue'], 'readwrite');
      const store = tx.objectStore('syncQueue');
      
      return new Promise((resolve, reject) => {
        const request = store.add({
          ...action,
          timestamp: Date.now()
        });
        
        request.onsuccess = () => {
          resolve(request.result);
          
          // Trigger background sync if available
          if ('serviceWorker' in navigator && navigator.serviceWorker && navigator.serviceWorker.ready) {
            navigator.serviceWorker.ready.then(registration => {
              if ('sync' in registration) {
                registration.sync.register('milestone-sync').catch(error => {
                  console.log('Failed to register sync:', error);
                });
              }
            });
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error queuing sync:', error);
      throw error;
    }
  },

  // Clear sync queue
  clearSyncQueue: async () => {
    try {
      const db = await offlineStorage.initDB();
      const tx = db.transaction(['syncQueue'], 'readwrite');
      const store = tx.objectStore('syncQueue');
      
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error clearing sync queue:', error);
      throw error;
    }
  },

  // Get pending sync items
  getPendingSyncs: async () => {
    try {
      const db = await offlineStorage.initDB();
      const tx = db.transaction(['syncQueue'], 'readonly');
      const store = tx.objectStore('syncQueue');
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting pending syncs:', error);
      return [];
    }
  }
};

