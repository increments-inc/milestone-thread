'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, User, Heart, AlertTriangle } from 'lucide-react';
import { SkinDonorCard } from './SkinDonorCard';
import { SkinDonorFAB } from './SkinDonorFAB';
import { SkinDonorDialog } from './SkinDonorDialog';

export function SkinDonors() {
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [skinDonors, setSkinDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedHospital, setSelectedHospital] = useState('all');
  const [error, setError] = useState(null);

  // Get unique hospitals and statuses
  const hospitals = [...new Set(skinDonors.map(donor => donor.nearbyHospital))].sort();
  const statuses = [...new Set(skinDonors.map(donor => donor.donationStatus))].sort();

  // Filter donors based on search and filters
  const filteredDonors = useMemo(() => {
    const filtered = skinDonors.filter(donor => {
      // Skip search filtering if search term is empty
      if (!searchTerm.trim()) {
        const matchesStatus = selectedStatus === 'all' || donor.donationStatus === selectedStatus;
        const matchesHospital = selectedHospital === 'all' || donor.nearbyHospital === selectedHospital;
        return matchesStatus && matchesHospital;
      }

      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        // Search in name (case insensitive)
        donor.name.toLowerCase().includes(searchLower) ||
        // Search in phone number (remove spaces and special characters)
        donor.phoneNumber.replace(/[\s\-\+]/g, '').includes(searchTerm.replace(/[\s\-\+]/g, '')) ||
        // Search in hospital (case insensitive)
        donor.nearbyHospital.toLowerCase().includes(searchLower);
      
      const matchesStatus = selectedStatus === 'all' || donor.donationStatus === selectedStatus;
      const matchesHospital = selectedHospital === 'all' || donor.nearbyHospital === selectedHospital;

      return matchesSearch && matchesStatus && matchesHospital;
    });

    // Sort alphabetically by name
    return filtered.sort((a, b) => {
      return a.name.localeCompare(b.name, 'bn');
    });
  }, [searchTerm, selectedStatus, selectedHospital, skinDonors]);

  // Fetch skin donors from API
  const fetchSkinDonors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/skin-donors');
      if (response.ok) {
        const donors = await response.json();
        setSkinDonors(donors);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch skin donors:', response.status, errorText);
        setError(`API Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching skin donors:', error);
      setError(`Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSkinDonors();
  }, []);

  // Handle skin donor registration
  const handleSkinDonorRegistration = async (donorData) => {
    try {
      const response = await fetch('/api/skin-donors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donorData),
      });

      if (response.ok) {
        const newDonor = await response.json();
        await fetchSkinDonors(); // Refresh the list
        alert('স্কিন ডোনার সফলভাবে নিবন্ধিত হয়েছে');
        console.log('New skin donor registered:', newDonor);
      } else {
        let errorMessage = 'Unknown error occurred';
        try {
          const error = await response.json();
          errorMessage = error.error || `Server error: ${response.status}`;
        } catch (parseError) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error registering skin donor:', error);
      alert(`নিবন্ধন ব্যর্থ হয়েছে: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  স্কিন ডোনার তালিকা
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Powered by <a href="https://incrementsinc.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">Increments Inc.</a>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-500">
                {searchTerm ? filteredDonors.length : skinDonors.length}
              </p>
              {searchTerm && filteredDonors.length !== skinDonors.length && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  মোট {skinDonors.length} জনের মধ্যে
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="নাম, ফোন নম্বর বা হাসপাতাল দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter Options */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1 flex-1">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                         focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">সকল স্ট্যাটাস</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'registered' && 'নিবন্ধিত'}
                    {status === 'blood_screening' && 'রক্ত পরীক্ষা'}
                    {status === 'eligible' && 'যোগ্য'}
                    {status === 'donated' && 'দান সম্পন্ন'}
                    {status === 'not_eligible' && 'অযোগ্য'}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                       focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">সকল হাসপাতাল</option>
              {hospitals.map(hospital => (
                <option key={hospital} value={hospital}>{hospital}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              তথ্য লোড করতে সমস্যা হয়েছে
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {error}
            </p>
            <button
              onClick={() => fetchSkinDonors()}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              স্কিন ডোনারদের তালিকা লোড হচ্ছে...
            </p>
          </div>
        ) : filteredDonors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              {skinDonors.length === 0 ? (
                <Heart className="w-12 h-12 text-green-500" />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {skinDonors.length === 0 
                ? 'এখনো কোন স্কিন ডোনার নিবন্ধিত হননি' 
                : 'কোন ফলাফল পাওয়া যায়নি'
              }
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              {skinDonors.length === 0 
                ? 'মাইলস্টোন স্কুল দুর্ঘটনার জন্য স্কিন ডোনার নিবন্ধনের জন্য প্রস্তুত।'
                : 'অনুগ্রহ করে অন্য শব্দ ব্যবহার করে খুঁজুন।'
              }
            </p>
            
            {skinDonors.length === 0 && (
              /* Emergency Contact Info */
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900 dark:text-green-100">জরুরি তথ্য</h3>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                  স্কিন ডোনেশনের জন্য যোগাযোগ করুন:
                </p>
                <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                  স্কিন ব্যাংক, বার্ন ইউনিট, NIBPS (রুম নং: ৩৪৫)
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDonors.map(donor => (
              <SkinDonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <SkinDonorFAB onClick={() => setShowRegistrationDialog(true)} />

      {/* Skin Donor Registration Dialog */}
      <SkinDonorDialog
        isOpen={showRegistrationDialog}
        onClose={() => setShowRegistrationDialog(false)}
        onSubmit={handleSkinDonorRegistration}
        existingDonors={skinDonors}
      />
    </div>
  );
}