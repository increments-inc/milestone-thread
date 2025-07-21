'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        // Redirect to home when back online
        window.location.href = '/';
      }
    };

    // Check initial status
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    
    try {
      // Try to fetch the home page
      const response = await fetch('/', { method: 'HEAD' });
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.log('Still offline');
    } finally {
      setTimeout(() => setRetrying(false), 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <WifiOff className="w-16 h-16 text-gray-400 dark:text-gray-600" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">!</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          You're Offline
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          It looks like you've lost your internet connection. Don't worry, your milestones are safe and will sync when you're back online.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${retrying ? 'animate-spin' : ''}`} />
            {retrying ? 'Checking...' : 'Try Again'}
          </button>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>What you can do offline:</p>
            <ul className="mt-2 space-y-1">
              <li>• View cached milestones</li>
              <li>• Create new milestones (will sync later)</li>
              <li>• Browse your achievement history</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-xs text-gray-400 dark:text-gray-600">
          Your data is stored locally and will automatically sync when you reconnect
        </div>
      </div>
    </div>
  );
}