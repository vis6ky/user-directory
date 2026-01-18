
import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center space-x-4 animate-pulse">
      {/* Avatar Skeleton */}
      <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0" />
      
      {/* Content Skeleton */}
      <div className="flex-1 space-y-2.5 min-w-0">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-4 bg-gray-50 rounded w-16" />
          <div className="h-4 bg-gray-50 rounded w-16" />
          <div className="h-4 bg-indigo-50 rounded w-8" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
