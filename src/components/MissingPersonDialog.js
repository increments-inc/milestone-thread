'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Camera, Upload, User } from 'lucide-react';

export function MissingPersonDialog({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    class: '',
    code: '',
    section: '',
    parentContacts: [''],
    photo: null,
    photoPreview: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addParentContact = () => {
    setFormData(prev => ({
      ...prev,
      parentContacts: [...prev.parentContacts, '']
    }));
  };

  const removeParentContact = (index) => {
    setFormData(prev => ({
      ...prev,
      parentContacts: prev.parentContacts.filter((_, i) => i !== index)
    }));
  };

  const updateParentContact = (index, value) => {
    setFormData(prev => ({
      ...prev,
      parentContacts: prev.parentContacts.map((contact, i) => 
        i === index ? value : contact
      )
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('ছবির আকার ৫ MB এর কম হতে হবে');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoPreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null,
      photoPreview: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
      alert('অনুগ্রহ করে পূর্ণ নাম লিখুন');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Filter out empty parent contacts
      const validContacts = formData.parentContacts.filter(contact => contact.trim());
      
      // Create FormData for file upload
      const submitFormData = new FormData();
      submitFormData.append('fullName', formData.fullName.trim());
      submitFormData.append('class', formData.class.trim());
      submitFormData.append('code', formData.code.trim());
      submitFormData.append('section', formData.section.trim());
      submitFormData.append('parentContacts', JSON.stringify(validContacts));
      
      if (formData.photo) {
        submitFormData.append('photo', formData.photo);
      }

      await onSubmit(submitFormData);
      
      // Reset form
      setFormData({
        fullName: '',
        class: '',
        code: '',
        section: '',
        parentContacts: [''],
        photo: null,
        photoPreview: null
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting missing person:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-60">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-blue-500" />
            নিখোঁজ ব্যক্তির তথ্য
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ছবি
            </label>
            <div className="flex items-center justify-center">
              {formData.photoPreview ? (
                <div className="relative">
                  <img 
                    src={formData.photoPreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500 text-center">ছবি আপলোড</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              পূর্ণ নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="নিখোঁজ ব্যক্তির পূর্ণ নাম লিখুন"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Class */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ক্লাস (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={formData.class}
              onChange={(e) => handleInputChange('class', e.target.value)}
              placeholder="যেমন: নবম, দশম, একাদশ"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              রোল/আইডি (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              placeholder="রোল নম্বর বা আইডি"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              শাখা (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={formData.section}
              onChange={(e) => handleInputChange('section', e.target.value)}
              placeholder="যেমন: A, B, C"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Parent Contacts */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              অভিভাবকের ফোন নম্বর (ঐচ্ছিক)
            </label>
            <div className="space-y-2">
              {formData.parentContacts.map((contact, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="tel"
                    value={contact}
                    onChange={(e) => updateParentContact(index, e.target.value)}
                    placeholder="+880 1XXXXXXXXX"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.parentContacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParentContact(index)}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addParentContact}
                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Plus className="w-4 h-4" />
                আরেকটি নম্বর যোগ করুন
              </button>
            </div>
          </div>

          {/* Submit Button */}
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
              disabled={isSubmitting || !formData.fullName.trim()}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isSubmitting ? 'জমা দিচ্ছি...' : 'তথ্য জমা দিন'}
            </button>
          </div>
        </form>

        {/* Note */}
        <div className="px-4 pb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>দ্রষ্টব্য:</strong> সঠিক তথ্য প্রদান করুন যাতে নিখোঁজ ব্যক্তিকে খুঁজে পেতে সুবিধা হয়। ছবি থাকলে অবশ্যই আপলোড করুন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}