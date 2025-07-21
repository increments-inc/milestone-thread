export function BloodGroupAvatar({ bloodGroup, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg'
  };

  const bloodGroupColors = {
    'A+': 'bg-red-500',
    'A-': 'bg-red-600',
    'B+': 'bg-blue-500',
    'B-': 'bg-blue-600',
    'AB+': 'bg-purple-500',
    'AB-': 'bg-purple-600',
    'O+': 'bg-green-500',
    'O-': 'bg-green-600'
  };

  return (
    <div className={`
      ${sizeClasses[size]}
      ${bloodGroupColors[bloodGroup] || 'bg-gray-500'}
      rounded-full flex items-center justify-center text-white font-bold shadow-lg
    `}>
      {bloodGroup}
    </div>
  );
}