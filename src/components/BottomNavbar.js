'use client';

import { useState } from 'react';
import { Heart, Users, Search, User } from 'lucide-react';

export function BottomNavbar({ activeTab, onTabChange }) {
  const navItems = [
    {
      id: 'blood',
      label: 'Blood',
      labelBn: 'রক্ত',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      id: 'missing',
      label: 'Missing', 
      labelBn: 'নিখোঁজ',
      icon: Search,
      color: 'text-blue-500'
    },
    {
      id: 'skin',
      label: 'Skin',
      labelBn: 'ত্বক',
      icon: User,
      color: 'text-green-500'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-30">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 relative transition-all duration-200 ${
                  isActive 
                    ? 'text-current' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full ${
                    item.id === 'blood' ? 'bg-red-500' : item.id === 'missing' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                )}
                
                {/* Icon */}
                <div className={`p-1 rounded-lg transition-colors ${
                  isActive 
                    ? item.id === 'blood' 
                      ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400' 
                      : item.id === 'missing'
                        ? 'bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-green-50 text-green-500 dark:bg-green-900/20 dark:text-green-400'
                    : ''
                }`}>
                  <IconComponent 
                    className={`w-6 h-6 ${
                      isActive ? item.color : ''
                    }`} 
                  />
                </div>
                
                {/* Label */}
                <span className={`text-xs font-medium mt-1 transition-colors ${
                  isActive 
                    ? item.color
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {item.labelBn}
                </span>
                
                {/* Badge for emergency items (optional) */}
                {item.id === 'blood' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Safe area for devices with home indicators */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}