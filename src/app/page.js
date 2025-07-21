'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { DonorCard } from '@/components/DonorCard';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { DonorRegistrationDialog } from '@/components/DonorRegistrationDialog';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [bloodDonors, setBloodDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch donors from API
  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/donors');
      if (response.ok) {
        const donors = await response.json();
        setBloodDonors(donors);
      } else {
        console.error('Failed to fetch donors');
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDonors();
  }, []);

  // Get unique blood groups and locations
  const bloodGroups = [...new Set(bloodDonors.map(donor => donor.bloodGroup))].sort();
  const locations = [...new Set(bloodDonors.map(donor => donor.location))].sort();

  // Filter and sort donors based on search and filters
  const filteredDonors = useMemo(() => {
    const filtered = bloodDonors.filter(donor => {
      // Skip search filtering if search term is empty
      if (!searchTerm.trim()) {
        const matchesBloodGroup = selectedBloodGroup === 'all' || donor.bloodGroup === selectedBloodGroup;
        const matchesLocation = selectedLocation === 'all' || donor.location === selectedLocation;
        return matchesBloodGroup && matchesLocation;
      }

      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        // Search in name (case insensitive)
        donor.name.toLowerCase().includes(searchLower) ||
        // Search in phone number (remove spaces and special characters)
        donor.phoneNumber.replace(/[\s\-\+]/g, '').includes(searchTerm.replace(/[\s\-\+]/g, '')) ||
        // Search in location (case insensitive)
        donor.location.toLowerCase().includes(searchLower);
      
      const matchesBloodGroup = selectedBloodGroup === 'all' || donor.bloodGroup === selectedBloodGroup;
      const matchesLocation = selectedLocation === 'all' || donor.location === selectedLocation;

      return matchesSearch && matchesBloodGroup && matchesLocation;
    });

    // Sort by social media count (more social handles first), then alphabetically
    return filtered.sort((a, b) => {
      const aSocialCount = (a.socialMedia || []).filter(sm => sm.platform && sm.url).length;
      const bSocialCount = (b.socialMedia || []).filter(sm => sm.platform && sm.url).length;
      
      // First sort by social media count (descending)
      if (bSocialCount !== aSocialCount) {
        return bSocialCount - aSocialCount;
      }
      
      // Then sort alphabetically by name
      return a.name.localeCompare(b.name, 'bn');
    });
  }, [searchTerm, selectedBloodGroup, selectedLocation, bloodDonors]);

  // Handle new donor registration
  const handleDonorRegistration = async (newDonor) => {
    try {
      const response = await fetch('/api/donors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDonor),
      });

      if (response.ok) {
        const createdDonor = await response.json();
        // Refresh the donor list
        await fetchDonors();
        console.log('New donor registered:', createdDonor);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register donor');
      }
    } catch (error) {
      console.error('Error registering donor:', error);
      alert(`রেজিস্ট্রেশন ব্যর্থ হয়েছে: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  রক্তদাতা তালিকা
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  জরুরি রক্তের প্রয়োজনে যোগাযোগ করুন
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-500">{filteredDonors.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">দাতা পাওয়া গেছে</p>
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
              placeholder="নাম, ফোন নম্বর বা স্থান দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filter Options */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1 flex-1">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                         focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">সকল গ্রুপ</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                       focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">সকল স্থান</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Donor List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              রক্তদাতা লোড হচ্ছে...
            </p>
          </div>
        ) : filteredDonors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              কোন রক্তদাতা পাওয়া যায়নি
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              অনুগ্রহ করে অন্য ফিল্টার ব্যবহার করে খুঁজুন
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDonors.map(donor => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setShowRegistrationDialog(true)} />

      {/* Donor Registration Dialog */}
      <DonorRegistrationDialog
        isOpen={showRegistrationDialog}
        onClose={() => setShowRegistrationDialog(false)}
        onSubmit={handleDonorRegistration}
        existingDonors={bloodDonors}
      />
    </div>
  );
}