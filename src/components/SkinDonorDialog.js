'use client';

import { useState } from 'react';
import { X, Heart, AlertTriangle, Info, CheckCircle, Phone, MapPin, FileText } from 'lucide-react';

export function SkinDonorDialog({ isOpen, onClose, onSubmit, existingDonors = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    nearbyHospital: '',
    isAbove18: false,
    voluntaryConsent: false,
    hasDiabetes: false,
    hasHypertension: false,
    hasCancer: false,
    hasSevereIllness: false,
    medicalNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'নাম আবশ্যক';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'ফোন নম্বর আবশ্যক';
    } else if (!/^[\+]?[0-9\s\-]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'বৈধ ফোন নম্বর প্রয়োজন';
    }

    if (!formData.nearbyHospital.trim()) {
      newErrors.nearbyHospital = 'নিকটবর্তী হাসপাতাল আবশ্যক';
    }

    // Age verification
    if (!formData.isAbove18) {
      newErrors.isAbove18 = 'আপনার বয়স ১৮ বছরের উপরে হতে হবে';
    }

    // Voluntary consent
    if (!formData.voluntaryConsent) {
      newErrors.voluntaryConsent = 'স্বেচ্ছায় সম্মতি প্রয়োজন';
    }

    // Medical eligibility
    if (formData.hasCancer) {
      newErrors.hasCancer = 'ক্যান্সার রোগীরা স্কিন ডোনেশন করতে পারবেন না';
    }

    if (formData.hasSevereIllness) {
      newErrors.hasSevereIllness = 'গুরুতর অসুস্থতা থাকলে স্কিন ডোনেশন করতে পারবেন না';
    }

    // Check if phone number already exists
    const phoneExists = existingDonors.some(donor => 
      donor.phoneNumber === formData.phoneNumber.trim()
    );
    if (phoneExists) {
      newErrors.phoneNumber = 'এই ফোন নম্বর দিয়ে ইতিমধ্যে নিবন্ধন হয়েছে';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        nearbyHospital: formData.nearbyHospital.trim(),
        medicalNotes: formData.medicalNotes.trim()
      });
      
      // Reset form
      setFormData({
        name: '',
        phoneNumber: '',
        nearbyHospital: '',
        isAbove18: false,
        voluntaryConsent: false,
        hasDiabetes: false,
        hasHypertension: false,
        hasCancer: false,
        hasSevereIllness: false,
        medicalNotes: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              স্কিন ডোনার নিবন্ধন
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Medical Information Banner */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-green-800 dark:text-green-200 font-medium mb-1">
                স্কিন ডোনেশন প্রক্রিয়া:
              </p>
              <ul className="text-green-700 dark:text-green-300 text-xs space-y-1">
                <li>• ১ম দিন: শুধু রক্ত পরীক্ষা</li>
                <li>• যোগ্য হলে ২ দিনের মধ্যে ডোনেশন</li>
                <li>• উরু বা নিতম্ব থেকে ত্বক নেওয়া হয়</li>
                <li>• ১৪ দিনে সেরে যায়, সামান্য দাগ থাকে</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              পূর্ণ নাম *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="আপনার পূর্ণ নাম লিখুন"
              className={`w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-green-500 focus:border-transparent
                         ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Phone className="w-4 h-4 inline mr-1" />
              ফোন নম্বর *
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
                placeholder="1XXXXXXXXX"
                maxLength="10"
                className={`w-full pl-14 pr-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-green-500 focus:border-transparent
                           ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Nearby Hospital */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              নিকটস্থ হাসপাতাল <span className="text-red-500">*</span>
            </label>
            <select
              name="nearbyHospital"
              value={formData.nearbyHospital}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-green-500 focus:border-transparent
                         ${errors.nearbyHospital ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              disabled={isSubmitting}
            >
              <option value="">স্থান নির্বাচন করুন</option>
              <option value="ঢাকা মেডিক্যাল বার্ন ইউনিট">ঢাকা মেডিক্যাল বার্ন ইউনিট</option>
              <option value="কুর্মিটোলা জেনারেল হাসপাতাল">কুর্মিটোলা জেনারেল হাসপাতাল</option>
              <option value="উত্তরা আধুনিক মেডিকেল কলেজ">উত্তরা আধুনিক মেডিকেল কলেজ</option>
              <option value="কুয়েত মৈত্রী হাসপাতাল">কুয়েত মৈত্রী হাসপাতাল</option>
              <option value="উত্তরা উইমেন্স মেডিকেল কলেজ">উত্তরা উইমেন্স মেডিকেল কলেজ</option>
              <option value="মনসুরআলী মেডিকেল কলেজ">মনসুরআলী মেডিকেল কলেজ</option>
            </select>
            {errors.nearbyHospital && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nearbyHospital}</p>
            )}
          </div>

          {/* Medical Conditions */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              চিকিৎসা অবস্থা (যদি থাকে)
            </label>
            
            <div className="space-y-2">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="hasDiabetes"
                  checked={formData.hasDiabetes}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  ডায়াবেটিস আছে (নিয়ন্ত্রিত ডায়াবেটিস গ্রহণযোগ্য)
                </span>
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="hasHypertension"
                  checked={formData.hasHypertension}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  উচ্চ রক্তচাপ আছে (নিয়ন্ত্রিত উচ্চ রক্তচাপ গ্রহণযোগ্য)
                </span>
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="hasCancer"
                  checked={formData.hasCancer}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-red-700 dark:text-red-400">
                  ক্যান্সার আছে (ডোনেশনের জন্য অযোগ্য)
                </span>
              </label>
              {errors.hasCancer && (
                <p className="ml-6 text-sm text-red-600 dark:text-red-400">{errors.hasCancer}</p>
              )}

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="hasSevereIllness"
                  checked={formData.hasSevereIllness}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-red-700 dark:text-red-400">
                  গুরুতর অসুস্থতা আছে (ডোনেশনের জন্য অযোগ্য)
                </span>
              </label>
              {errors.hasSevereIllness && (
                <p className="ml-6 text-sm text-red-600 dark:text-red-400">{errors.hasSevereIllness}</p>
              )}
            </div>
          </div>

          {/* Medical Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FileText className="w-4 h-4 inline mr-1" />
              অতিরিক্ত চিকিৎসা তথ্য (ঐচ্ছিক)
            </label>
            <textarea
              name="medicalNotes"
              value={formData.medicalNotes}
              onChange={handleInputChange}
              placeholder="কোনো অতিরিক্ত চিকিৎসা তথ্য বা বিশেষ অবস্থা"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Required Checkboxes */}
          <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
            {/* Age Verification */}
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="isAbove18"
                checked={formData.isAbove18}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500
                           ${errors.isAbove18 ? 'border-red-500' : ''}`}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                আমি নিশ্চিত করছি যে আমার বয়স ১৮ বছরের উপরে *
              </span>
            </label>
            {errors.isAbove18 && (
              <p className="ml-6 text-sm text-red-600 dark:text-red-400">{errors.isAbove18}</p>
            )}

            {/* Voluntary Consent */}
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="voluntaryConsent"
                checked={formData.voluntaryConsent}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500
                           ${errors.voluntaryConsent ? 'border-red-500' : ''}`}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                আমি স্বেচ্ছায় স্কিন ডোনেশনে সম্মত এবং প্রক্রিয়া সম্পর্কে অবগত *
              </span>
            </label>
            {errors.voluntaryConsent && (
              <p className="ml-6 text-sm text-red-600 dark:text-red-400">{errors.voluntaryConsent}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              বাতিল
            </button>
            
            {(formData.hasCancer || formData.hasSevereIllness) ? (
              <div className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                স্কিন ডোনেশনের জন্য অযোগ্য
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !formData.isAbove18 || !formData.voluntaryConsent}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    নিবন্ধন হচ্ছে...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    নিবন্ধন করুন
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}