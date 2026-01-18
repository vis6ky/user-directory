
import React from 'react';
import { User } from '../types';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const displayedHobbies = user.hobbies.slice(0, 2);
  const remainingCount = user.hobbies.length - 2;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
      <div className="p-4 flex items-center space-x-4">
        {/* Avatar Section - Left */}
        <div className="shrink-0">
          <img 
            src={user.avatar} 
            alt={`${user.first_name} ${user.last_name}`}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-50 shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Info Section - Right Column */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            {/* Row 1: Name */}
            <h3 className="text-base font-bold text-gray-900 truncate tracking-tight">
              {user.first_name} {user.last_name}
            </h3>
            
            {/* Row 2: Nationality & Age */}
            <div className="flex items-center text-xs text-gray-500 font-medium mt-0.5">
              <span className="truncate">{user.nationality}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="shrink-0">{user.age} years</span>
            </div>

            {/* Row 3: Hobbies */}
            <div className="mt-3 flex items-center gap-1.5 overflow-hidden">
              {displayedHobbies.length > 0 ? (
                <>
                  {displayedHobbies.map((hobby, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-gray-200 truncate max-w-[85px]"
                    >
                      {hobby}
                    </span>
                  ))}
                  {remainingCount > 0 && (
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100 shrink-0">
                      +{remainingCount}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-gray-400 italic">No hobbies listed</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
