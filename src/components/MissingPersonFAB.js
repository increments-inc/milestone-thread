'use client';

import { UserPlus } from 'lucide-react';

export function MissingPersonFAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 group"
      title="নিখোঁজ ব্যক্তির তথ্য যোগ করুন"
    >
      <UserPlus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        নিখোঁজ ব্যক্তির তথ্য যোগ করুন
      </span>
    </button>
  );
}