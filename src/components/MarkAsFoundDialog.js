'use client';

import { useState } from 'react';
import { X, AlertTriangle, MapPin, Clock, User, Heart, HeartCrack } from 'lucide-react';

export function MarkAsFoundDialog({ isOpen, onClose, onSubmit, person }) {
  const [formData, setFormData] = useState({
    status: 'found_alive',
    location: '',
    foundAt: '',
    condition: '',
    note: '',
    reporterName: '',
    reporterContact: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.location.trim()) {
      alert('অনুগ্রহ করে পাওয়ার স্থান লিখুন');
      return;
    }

    if (!formData.foundAt) {
      alert('অনুগ্রহ করে পাওয়ার তারিখ ও সময় নির্বাচন করুন');
      return;
    }

    if (!hasConfirmed) {
      alert('অনুগ্রহ করে নিশ্চিতকরণ চেকবক্স টিক করুন');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        location: formData.location.trim(),
        condition: formData.condition.trim(),
        note: formData.note.trim(),
        reporterName: formData.reporterName.trim(),
        reporterContact: formData.reporterContact.trim()
      });
      
      // Reset form
      setFormData({
        status: 'found_alive',
        location: '',
        foundAt: '',
        condition: '',
        note: '',
        reporterName: '',
        reporterContact: ''
      });
      setHasConfirmed(false);
      
      onClose();
    } catch (error) {
      console.error('Error submitting found report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current date-time for max attribute
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-60">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-blue-500" />
            পাওয়া গেছে বলে চিহ্নিত করুন
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 m-4 rounded-r-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm">
                গুরুত্বপূর্ণ সতর্কতা
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
                শুধুমাত্র সঠিক ও যাচাইকৃত তথ্য প্রদান করুন। ভুল তথ্য পরিবারের জন্য অত্যন্ত কষ্টদায়ক হতে পারে। 
                নিশ্চিত না হলে স্থানীয় কর্তৃপক্ষের সাথে যোগাযোগ করুন।
              </p>
            </div>
          </div>
        </div>

        {/* Person Info */}
        <div className="px-4 pb-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-3">
              {person.photo ? (
                <img 
                  src={person.photo} 
                  alt={person.fullName}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
              )}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{person.fullName}</h4>
                {person.class && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {person.class} {person.section && `- ${person.section}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              অবস্থা <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                formData.status === 'found_alive' 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                <input
                  type="radio"
                  name="status"
                  value="found_alive"
                  checked={formData.status === 'found_alive'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="sr-only"
                />
                <Heart className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">জীবিত</span>
              </label>
              
              <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                formData.status === 'found_dead' 
                  ? 'border-gray-500 bg-gray-50 dark:bg-gray-900/20' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                <input
                  type="radio"
                  name="status"
                  value="found_dead"
                  checked={formData.status === 'found_dead'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="sr-only"
                />
                <HeartCrack className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">মৃত</span>
              </label>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              পাওয়ার স্থান <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="যেমন: ঢাকা মেডিক্যাল কলেজ হাসপাতাল"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Found Date/Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              পাওয়ার তারিখ ও সময় <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="datetime-local"
                value={formData.foundAt}
                onChange={(e) => handleInputChange('foundAt', e.target.value)}
                max={getCurrentDateTime()}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              অবস্থার বিবরণ
            </label>
            <input
              type="text"
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
              placeholder={formData.status === 'found_alive' ? 'যেমন: সুস্থ, আহত, চিকিৎসাধীন' : 'মৃত্যুর কারণ (যদি জানা থাকে)'}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Additional Note */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              অতিরিক্ত তথ্য
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              placeholder="অন্য কোন গুরুত্বপূর্ণ তথ্য..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Reporter Info */}
          <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">তথ্যদাতার বিবরণ (ঐচ্ছিক)</h4>
            
            <div className="space-y-2">
              <input
                type="text"
                value={formData.reporterName}
                onChange={(e) => handleInputChange('reporterName', e.target.value)}
                placeholder="আপনার নাম"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-2">
              <input
                type="tel"
                value={formData.reporterContact}
                onChange={(e) => handleInputChange('reporterContact', e.target.value)}
                placeholder="আপনার ফোন নম্বর"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Confirmation */}
          <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={hasConfirmed}
                onChange={(e) => setHasConfirmed(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                আমি নিশ্চিত করছি যে উপরের তথ্যগুলি সঠিক এবং আমি এই ব্যক্তিকে নিজে দেখেছি অথবা নির্ভরযোগ্য 
                সূত্র থেকে এই তথ্য পেয়েছি। আমি বুঝতে পারছি যে ভুল তথ্য দেওয়া গুরুতর পরিণতি বয়ে আনতে পারে।
              </span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !hasConfirmed || !formData.location.trim() || !formData.foundAt}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isSubmitting ? 'জমা দিচ্ছি...' : 'তথ্য জমা দিন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}