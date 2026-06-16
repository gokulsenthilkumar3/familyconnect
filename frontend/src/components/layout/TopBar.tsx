import React from 'react';
import { Bell, Search, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const TopBar: React.FC = () => {
  const { currentUser } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-saffron)] transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search family members..." 
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[var(--color-saffron)] focus:border-transparent transition-all sm:text-sm"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="ml-4 flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 relative rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[var(--color-rose)] ring-2 ring-white" />
        </button>
        
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{currentUser?.name || 'Guest User'}</p>
            <p className="text-xs text-gray-500">Family Head</p>
          </div>
          <button className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300 hover:ring-2 hover:ring-[var(--color-saffron)] transition-all">
            {currentUser?.profilePic ? (
              <img src={currentUser.profilePic} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <UserIcon size={18} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
