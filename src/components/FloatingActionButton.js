import { Plus } from 'lucide-react';

export function FloatingActionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
      aria-label="রক্তদাতা হিসেবে নিবন্ধন করুন"
    >
      <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></div>
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        রক্তদাতা হিসেবে নিবন্ধন করুন
      </span>
    </button>
  );
}