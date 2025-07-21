'use client';

import { useState } from 'react';
import { X, AlertCircle, CheckCircle, Plus, Trash2, Facebook, Instagram, Twitter, Linkedin, Youtube, Globe } from 'lucide-react';
import { BloodGroupAvatar } from './BloodGroupAvatar';

export function DonorRegistrationDialog({ isOpen, onClose, onSubmit, existingDonors }) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    bloodGroup: '',
    location: '',
    socialMedia: []
  });
  
  const [errors, setErrors] = useState({});
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [donationIntervalConfirmed, setDonationIntervalConfirmed] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const locations = [
    'ঢাকা মেডিক্যাল বার্ন ইউনিট',
    'কুর্মিটোলা জেনারেল হাসপাতাল',
    'উত্তরা আধুনিক মেডিকেল কলেজ',
    'কুয়েত মৈত্রী হাসপাতাল',
    'উত্তরা উইমেন্স মেডিকেল কলেজ',
    'মনসুরআলী মেডিকেল কলেজ'
  ];

  const socialMediaOptions = [
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'twitter', label: 'Twitter/X', icon: Twitter },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'website', label: 'Website', icon: Globe }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      // Only allow digits for phone number, max 10 digits
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: digits }));
        
        // Check for duplicate phone number
        if (digits.length >= 10) {
          const fullNumber = `+880${digits}`;
          const duplicate = existingDonors.some(donor => 
            donor.phoneNumber.replace(/\s/g, '') === fullNumber.replace(/\s/g, '')
          );
          setIsDuplicate(duplicate);
        } else {
          setIsDuplicate(false);
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const addSocialMediaField = () => {
    setFormData(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: '', url: '' }]
    }));
  };

  const removeSocialMediaField = (index) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index)
    }));
  };

  const updateSocialMediaField = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'নাম প্রয়োজন';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'ফোন নম্বর প্রয়োজন';
    } else if (formData.phoneNumber.length !== 10) {
      newErrors.phoneNumber = 'ফোন নম্বর ১০ সংখ্যার হতে হবে';
    } else if (!formData.phoneNumber.startsWith('1')) {
      newErrors.phoneNumber = 'ফোন নম্বর ১ দিয়ে শুরু হতে হবে';
    } else if (!/^1[3-9]\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'সঠিক ফোন নম্বর দিন (১৩-১৯ দিয়ে শুরু)';
    }
    
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'রক্তের গ্রুপ নির্বাচন করুন';
    }
    
    if (!formData.location) {
      newErrors.location = 'স্থান নির্বাচন করুন';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (isDuplicate) {
      alert('এই ফোন নম্বর দিয়ে ইতিমধ্যে নিবন্ধন করা হয়েছে!');
      return;
    }
    
    // Format phone number with +880 prefix
    const formattedData = {
      ...formData,
      phoneNumber: `+880 ${formData.phoneNumber}`,
      id: Date.now().toString(),
      lastDonation: null,
      available: true
    };
    
    onSubmit(formattedData);
    
    // Show success message
    setShowSuccess(true);
    
    // Reset form after 2 seconds and close
    setTimeout(() => {
      setFormData({ name: '', phoneNumber: '', bloodGroup: '', location: '', socialMedia: [] });
      setShowSuccess(false);
      setIsDuplicate(false);
      setAgeConfirmed(false);
      setDonationIntervalConfirmed(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            রক্তদাতা নিবন্ধন
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Alert for existing donors */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                যদি আপনি ইতিমধ্যে তালিকাভুক্ত থাকেন, তাহলে পুনরায় নিবন্ধন করার প্রয়োজন নেই।
              </p>
            </div>
          </div>

          {/* Safety note for female donors */}
          <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-pink-800 dark:text-pink-300">
                <p className="font-medium mb-1">মহিলা রক্তদাতাদের জন্য বিশেষ নির্দেশনা:</p>
                <p>
                  নিরাপত্তার জন্য অনুগ্রহ করে আপনার নিজস্ব ফোন নম্বরের পরিবর্তে আপনার 
                  বাবা/স্বামী/ভাই অথবা পরিবারের যেকোনো পুরুষ সদস্যের ফোন নম্বর দিন। 
                  এতে অবাঞ্ছিত কল থেকে রক্ষা পাবেন।
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-red-500 focus:border-transparent
                       ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="আপনার পূর্ণ নাম"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ফোন নম্বর <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
                +880
              </div>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full pl-14 pr-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-red-500 focus:border-transparent
                         ${errors.phoneNumber || isDuplicate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="1XXXXXXXXX"
                maxLength="10"
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber}</p>
            )}
            {isDuplicate && (
              <p className="mt-1 text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                এই নম্বর দিয়ে ইতিমধ্যে নিবন্ধন করা হয়েছে
              </p>
            )}
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              রক্তের গ্রুপ <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map(group => (
                <button
                  key={group}
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'bloodGroup', value: group } })}
                  className={`flex items-center justify-center p-3 border rounded-lg transition-all
                           ${formData.bloodGroup === group 
                             ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                             : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}`}
                >
                  <BloodGroupAvatar bloodGroup={group} size="sm" />
                </button>
              ))}
            </div>
            {errors.bloodGroup && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bloodGroup}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              নিকটস্থ হাসপাতাল <span className="text-red-500">*</span>
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-red-500 focus:border-transparent
                       ${errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            >
              <option value="">স্থান নির্বাচন করুন</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
            )}
          </div>

          {/* Social Media Links */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                সোশ্যাল মিডিয়া লিংক (ঐচ্ছিক)
              </label>
              <button
                type="button"
                onClick={addSocialMediaField}
                className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                যোগ করুন
              </button>
            </div>
            
            {formData.socialMedia.length > 0 && (
              <div className="space-y-3">
                {formData.socialMedia.map((social, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      value={social.platform}
                      onChange={(e) => updateSocialMediaField(index, 'platform', e.target.value)}
                      className="w-28 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                               focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">নির্বাচন করুন</option>
                      {socialMediaOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    
                    <input
                      type="url"
                      value={social.url}
                      onChange={(e) => updateSocialMediaField(index, 'url', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                               focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    
                    <button
                      type="button"
                      onClick={() => removeSocialMediaField(index)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              সোশ্যাল মিডিয়া লিংক যোগ করলে আপনার প্রোফাইল অগ্রাধিকার পাবে
            </p>
          </div>

          {/* Verification Checkboxes */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-3">
              রক্তদানের পূর্বশর্ত নিশ্চিতকরণ:
            </h4>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                  আমি নিশ্চিত করছি যে আমার বয়স ১৮ বছর বা তার বেশি
                </span>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={donationIntervalConfirmed}
                  onChange={(e) => setDonationIntervalConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                  আমি নিশ্চিত করছি যে আমার সর্বশেষ রক্তদান কমপক্ষে ৮ সপ্তাহ (৫৬-৬০ দিন) আগে হয়েছে অথবা এটি আমার প্রথম রক্তদান
                </span>
              </label>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-800 dark:text-green-300">
                  সফলভাবে নিবন্ধন সম্পন্ন হয়েছে!
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={showSuccess || !ageConfirmed || !donationIntervalConfirmed}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              নিবন্ধন করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}