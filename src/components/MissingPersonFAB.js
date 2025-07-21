'use client';

import { UserPlus } from 'lucide-react';

export function MissingPersonFAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 group"
      title="নিখোঁজ ব্যক্তির তথ্য যোগ করুন"
    >
      <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
    </button>
  );
}