'use client';

import { useState, useEffect, useCallback } from 'react';
import { offlineStorage } from '@/lib/serviceWorker';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, synced, error
  const [pendingSyncs, setPendingSyncs] = useState(0);

  // Update online status
  useEffect(() => {
    const updateStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      // Trigger sync when coming back online
      if (online && syncStatus === 'idle') {
        syncPendingData();
      }
    };
    
    updateStatus();
    
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, [syncStatus]);

  // Check for pending syncs
  const checkPendingSyncs = useCallback(async () => {
    try {
      const pending = await offlineStorage.getPendingSyncs();
      setPendingSyncs(Array.isArray(pending) ? pending.length : 0);
    } catch (error) {
      console.error('Error checking pending syncs:', error);
      setPendingSyncs(0);
    }
  }, []);

  // Sync pending data
  const syncPendingData = useCallback(async () => {
    if (!navigator.onLine || syncStatus === 'syncing') return;
    
    setSyncStatus('syncing');
    
    try {
      const pending = await offlineStorage.getPendingSyncs();
      const pendingArray = Array.isArray(pending) ? pending : [];
      
      if (pendingArray.length === 0) {
        setSyncStatus('synced');
        return;
      }
      
      // Process each pending item
      for (const item of pendingArray) {
        try {
          const response = await fetch(item.url, {
            method: item.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data)
          });
          
          if (response.ok) {
            // Remove from sync queue
            const db = await offlineStorage.initDB();
            const tx = db.transaction(['syncQueue'], 'readwrite');
            await tx.objectStore('syncQueue').delete(item.id);
          }
        } catch (error) {
          console.error('Failed to sync item:', item, error);
        }
      }
      
      await checkPendingSyncs();
      setSyncStatus('synced');
      
      // Reset status after a delay
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  }, [syncStatus, checkPendingSyncs]);

  // Queue data for offline sync
  const queueForSync = useCallback(async (url, method, data) => {
    try {
      await offlineStorage.queueSync({ url, method, data });
      await checkPendingSyncs();
      
      // Try to sync immediately if online
      if (navigator.onLine) {
        syncPendingData();
      }
    } catch (error) {
      console.error('Error queuing for sync:', error);
    }
  }, [checkPendingSyncs, syncPendingData]);

  // Initial check for pending syncs
  useEffect(() => {
    checkPendingSyncs();
  }, [checkPendingSyncs]);

  return {
    isOnline,
    syncStatus,
    pendingSyncs,
    syncPendingData,
    queueForSync,
    checkPendingSyncs
  };
}