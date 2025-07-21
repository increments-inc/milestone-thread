'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Clock, AlertTriangle, Users } from 'lucide-react';
import { MissingPersonFAB } from './MissingPersonFAB';
import { MissingPersonDialog } from './MissingPersonDialog';
import { MissingPersonCard } from './MissingPersonCard';

export function MissingPersons() {
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [missingPersons, setMissingPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Filter missing persons based on search
  const filteredPersons = missingPersons.filter(person => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return (
      person.fullName.toLowerCase().includes(searchLower) ||
      (person.class && person.class.toLowerCase().includes(searchLower)) ||
      (person.code && person.code.toLowerCase().includes(searchLower)) ||
      (person.section && person.section.toLowerCase().includes(searchLower))
    );
  });

  // Handle status update
  const handleStatusUpdate = (updatedPerson) => {
    setMissingPersons(prevPersons => 
      prevPersons.map(person => 
        person.id === updatedPerson.id ? updatedPerson : person
      )
    );
  };

  // Fetch missing persons from API
  const fetchMissingPersons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/missing-persons');
      if (response.ok) {
        const persons = await response.json();
        setMissingPersons(persons);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch missing persons:', response.status, errorText);
        setError(`API Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching missing persons:', error);
      setError(`Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMissingPersons();
  }, []);

  // Handle missing person registration
  const handleMissingPersonRegistration = async (formData) => {
    try {
      const response = await fetch('/api/missing-persons', {
        method: 'POST',
        body: formData, // FormData object with photo
      });

      if (response.ok) {
        const newPerson = await response.json();
        await fetchMissingPersons(); // Refresh the list
        alert('নিখোঁজ ব্যক্তির তথ্য সফলভাবে জমা হয়েছে');
        console.log('New missing person registered:', newPerson);
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
      console.error('Error registering missing person:', error);
      alert(`তথ্য জমা দিতে ব্যর্থ হয়েছে: ${error.message}`);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  নিখোঁজ ব্যক্তি
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Powered by <a href="https://incrementsinc.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">Increments Inc.</a>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-500">
                {searchTerm ? filteredPersons.length : missingPersons.length}
              </p>
              {searchTerm && filteredPersons.length !== missingPersons.length && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  মোট {missingPersons.length} জনের মধ্যে
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="নাম, স্থান বা বিবরণ দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              onClick={() => fetchMissingPersons()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              নিখোঁজ ব্যক্তির তালিকা লোড হচ্ছে...
            </p>
          </div>
        ) : filteredPersons.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              {missingPersons.length === 0 ? (
                <AlertTriangle className="w-12 h-12 text-blue-500" />
              ) : (
                <Users className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {missingPersons.length === 0 
                ? 'এখনো কোন নিখোঁজ ব্যক্তির রিপোর্ট নেই' 
                : 'কোন ফলাফল পাওয়া যায়নি'
              }
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              {missingPersons.length === 0 
                ? 'মাইলস্টোন কলেজ দুর্ঘটনার সাথে সম্পর্কিত নিখোঁজ ব্যক্তির তথ্য এখানে প্রদর্শিত হবে।'
                : 'অনুগ্রহ করে অন্য শব্দ ব্যবহার করে খুঁজুন।'
              }
            </p>
            
            {missingPersons.length === 0 && (
              /* Emergency Contact Info */
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">জরুরি তথ্য</h3>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  নিখোঁজ ব্যক্তির তথ্য জানাতে বা খোঁজ পেতে স্থানীয় কর্তৃপক্ষের সাথে যোগাযোগ করুন।
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersons.map(person => (
              <MissingPersonCard 
                key={person.id} 
                person={person} 
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <MissingPersonFAB onClick={() => setShowRegistrationDialog(true)} />

      {/* Missing Person Registration Dialog */}
      <MissingPersonDialog
        isOpen={showRegistrationDialog}
        onClose={() => setShowRegistrationDialog(false)}
        onSubmit={handleMissingPersonRegistration}
      />
    </div>
  );
}