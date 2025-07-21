'use client';

import { useOfflineSync } from '@/hooks/useOfflineSync';
import { WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function OfflineIndicator() {
  const { isOnline, syncStatus, pendingSyncs, syncPendingData } = useOfflineSync();
  const [show, setShow] = useState(false);
  const [showSyncedToast, setShowSyncedToast] = useState(false);

  useEffect(() => {
    // Show indicator when offline, when there are pending syncs, or when syncing/error
    const shouldShow = !isOnline || pendingSyncs > 0 || syncStatus === 'syncing' || syncStatus === 'error';
    setShow(shouldShow);
    
    // Handle synced status as a toast
    if (syncStatus === 'synced') {
      setShowSyncedToast(true);
      // Auto-hide the synced toast after 2 seconds
      const timer = setTimeout(() => {
        setShowSyncedToast(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setShowSyncedToast(false);
    }
  }, [isOnline, pendingSyncs, syncStatus]);

  return (
    <>
      {/* Persistent Offline/Error/Syncing Indicator */}
      {show && (
        <div className="fixed bottom-20 right-4 z-50">
          <div className={`
            flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
            ${!isOnline 
              ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800' 
              : syncStatus === 'syncing' 
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                : syncStatus === 'error'
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
            }
          `}>
            {!isOnline ? (
              <>
                <WifiOff className="w-5 h-5" />
                <div className="flex flex-col">
                  <span className="font-medium">You're offline</span>
                  {pendingSyncs > 0 && (
                    <span className="text-sm opacity-80">
                      {pendingSyncs} changes pending
                    </span>
                  )}
                </div>
              </>
            ) : syncStatus === 'syncing' ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Syncing changes...</span>
              </>
            ) : syncStatus === 'error' ? (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>Sync failed</span>
                <button
                  onClick={syncPendingData}
                  className="ml-2 text-sm underline hover:no-underline"
                >
                  Retry
                </button>
              </>
            ) : pendingSyncs > 0 ? (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>{pendingSyncs} changes to sync</span>
                <button
                  onClick={syncPendingData}
                  className="ml-2 text-sm underline hover:no-underline"
                >
                  Sync now
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Temporary Success Toast */}
      {showSyncedToast && (
        <div className="fixed bottom-20 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800">
            <CheckCircle className="w-5 h-5" />
            <span>All changes synced</span>
          </div>
        </div>
      )}
    </>
  );
}