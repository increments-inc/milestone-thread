import { Phone, MapPin, User, Heart, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';

export function SkinDonorCard({ donor }) {
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'registered':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'blood_screening':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'eligible':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'donated':
        return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'not_eligible':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'registered':
        return 'নিবন্ধিত';
      case 'blood_screening':
        return 'রক্ত পরীক্ষা';
      case 'eligible':
        return 'যোগ্য';
      case 'donated':
        return 'দান সম্পন্ন';
      case 'not_eligible':
        return 'অযোগ্য';
      default:
        return 'নিবন্ধিত';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'registered':
        return <User className="w-4 h-4" />;
      case 'blood_screening':
        return <Activity className="w-4 h-4" />;
      case 'eligible':
        return <CheckCircle className="w-4 h-4" />;
      case 'donated':
        return <Heart className="w-4 h-4" />;
      case 'not_eligible':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
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

  const getMedicalConditions = () => {
    const conditions = [];
    if (donor.hasDiabetes) conditions.push('ডায়াবেটিস');
    if (donor.hasHypertension) conditions.push('উচ্চ রক্তচাপ');
    if (donor.hasCancer) conditions.push('ক্যান্সার');
    if (donor.hasSevereIllness) conditions.push('গুরুতর অসুস্থতা');
    return conditions;
  };

  const medicalConditions = getMedicalConditions();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg 
                    transition-all duration-200 border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        {/* Status Badge and Date */}
        <div className="flex items-center justify-between mb-3">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donor.donationStatus)}`}>
            {getStatusIcon(donor.donationStatus)}
            {getStatusText(donor.donationStatus)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(donor.createdAt)}
          </div>
        </div>

        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title: Name and Call Button */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {donor.name}
              </h3>
              <a 
                href={`tel:${donor.phoneNumber.replace(/\s/g, '')}`}
                className="flex items-center gap-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors flex-shrink-0 ml-2"
                title={`${donor.phoneNumber} এ কল করুন`}
              >
                <Phone className="w-3 h-3" />
                কল
              </a>
            </div>
            
            {/* Hospital */}
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{donor.nearbyHospital}</span>
            </div>

            {/* Medical Conditions */}
            {medicalConditions.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">চিকিৎসা অবস্থা:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {medicalConditions.map((condition, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs rounded-full"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Medical Notes */}
            {donor.medicalNotes && donor.medicalNotes.trim() && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  অতিরিক্ত তথ্য:
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {donor.medicalNotes}
                </div>
              </div>
            )}

            {/* Age and Consent Verification */}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>১৮+ বছর</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>স্বেচ্ছায় সম্মতি</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}