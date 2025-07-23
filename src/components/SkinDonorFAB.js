'use client';

import { Plus, Heart } from 'lucide-react';

export function SkinDonorFAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-20 group"
      title="স্কিন ডোনার হিসেবে নিবন্ধন করুন"
    >
      <div className="relative">
        <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <Heart className="w-3 h-3 absolute -top-1 -right-1 text-white opacity-75" />
      </div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
    </button>
  );
}