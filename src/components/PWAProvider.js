'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/serviceWorker';
import { OfflineIndicator } from './OfflineIndicator';
import { PWAInstallPrompt } from './PWAInstallPrompt';

export function PWAProvider({ children }) {
  useEffect(() => {
    // Register service worker
    registerServiceWorker();
  }, []);

  return (
    <>
      {children}
      <OfflineIndicator />
      <PWAInstallPrompt />
    </>
  );
}