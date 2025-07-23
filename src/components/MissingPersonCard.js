'use client';

import { useState } from 'react';
import { User, Phone, MapPin, Clock, AlertTriangle, CheckCircle, Heart, HeartCrack } from 'lucide-react';
import { MarkAsFoundDialog } from './MarkAsFoundDialog';

export function MissingPersonCard({ person, onStatusUpdate }) {
  const [showMarkAsFoundDialog, setShowMarkAsFoundDialog] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'missing':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'found_alive':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'found_dead':
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
      case 'verified':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'missing':
        return 'নিখোঁজ';
      case 'found_alive':
        return 'জীবিত পাওয়া গেছে';
      case 'found_dead':
        return 'মৃত অবস্থায় পাওয়া গেছে';
      case 'verified':
        return 'যাচাইকৃত';
      default:
        return 'নিখোঁজ';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'missing':
        return <AlertTriangle className="w-4 h-4" />;
      case 'found_alive':
        return <Heart className="w-4 h-4" />;
      case 'found_dead':
        return <HeartCrack className="w-4 h-4" />;
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleMarkAsFound = async (foundData) => {
    try {
      const response = await fetch(`/api/missing-persons/${person.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foundData),
      });

      if (response.ok) {
        const updatedPerson = await response.json();
        onStatusUpdate(updatedPerson);
        alert('তথ্য সফলভাবে আপডেট হয়েছে');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(`তথ্য আপডেট করতে ব্যর্থ হয়েছে: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'তথ্য নেই';
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
        <div className="p-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(person.status)}`}>
              {getStatusIcon(person.status)}
              {getStatusText(person.status)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(person.createdAt)}
            </div>
          </div>

          <div className="flex items-start gap-4">
            {/* Photo */}
            <div className="flex-shrink-0">
              {person.photo ? (
                <img 
                  src={person.photo} 
                  alt={person.fullName}
                  className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Name */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {person.fullName}
              </h3>
              
              {/* Details */}
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {(person.class || person.code || person.section) && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">শ্রেণি:</span>
                    <span>
                      {[person.class, person.section, person.code].filter(Boolean).join(' - ')}
                    </span>
                  </div>
                )}
                
                {/* Parent Contacts */}
                {person.parentContacts && person.parentContacts.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      {person.parentContacts.slice(0, 2).map((contact, index) => (
                        <div key={index}>
                          <a 
                            href={`tel:${contact.replace(/\s/g, '')}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {contact}
                          </a>
                        </div>
                      ))}
                      {person.parentContacts.length > 2 && (
                        <span className="text-xs">+{person.parentContacts.length - 2} আরো</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Found Details (if applicable) */}
              {person.status !== 'missing' && person.foundDetails && (
                <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    পাওয়া গেছে:
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" />
                      {person.foundDetails.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(person.foundDetails.foundAt)}
                    </div>
                    {person.foundDetails.note && (
                      <div className="mt-1 text-xs">{person.foundDetails.note}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          {person.status === 'missing' && (
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowMarkAsFoundDialog(true)}
                className="flex items-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors flex-shrink-0"
              >
                <CheckCircle className="w-3 h-3" />
                পাওয়া গেছে বলে চিহ্নিত করুন
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mark as Found Dialog */}
      <MarkAsFoundDialog
        isOpen={showMarkAsFoundDialog}
        onClose={() => setShowMarkAsFoundDialog(false)}
        onSubmit={handleMarkAsFound}
        person={person}
      />
    </>
  );
}