import { Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, Globe } from 'lucide-react';
import { BloodGroupAvatar } from './BloodGroupAvatar';

export function DonorCard({ donor }) {
  
  const socialMediaIcons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
    website: Globe
  };

  const validSocialMedia = (donor.socialMedia || []).filter(sm => sm.platform && sm.url);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg 
                    transition-all duration-200 border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <BloodGroupAvatar bloodGroup={donor.bloodGroup} size="md" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title: Blood Group and Call Button */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {donor.bloodGroup}
              </h3>
              <a 
                href={`tel:${donor.phoneNumber.replace(/\s/g, '')}`}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                title={`${donor.phoneNumber} এ কল করুন`}
              >
                <Phone className="w-4 h-4" />
                কল করুন
              </a>
            </div>
            
            {/* Subtitle: Name */}
            <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
              {donor.name}
            </p>
            
            {/* Location */}
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{donor.location}</span>
            </div>
            

            {/* Social Media Links */}
            {validSocialMedia.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 dark:text-gray-400">যোগাযোগ:</span>
                  {validSocialMedia.map((social, index) => {
                    const IconComponent = socialMediaIcons[social.platform] || Globe;
                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title={`${social.platform} এ দেখুন`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </a>
                    );
                  })}
                  {validSocialMedia.length > 3 && (
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      +{validSocialMedia.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}