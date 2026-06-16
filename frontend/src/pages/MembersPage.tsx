import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useFamilyStore } from '../store/familyStore';
import { MemberCard } from '../components/profile/MemberCard';
import { AddMemberModal } from '../components/profile/AddMemberModal';
import { Button } from '../components/common/Button';

export const MembersPage: React.FC = () => {
  const { members } = useFamilyStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Directory</h1>
          <p className="text-gray-500 text-sm mt-1">{members.length} total family members</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search directory..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-saffron)] focus:border-transparent transition-all sm:text-sm"
            />
          </div>
          <Button variant="secondary" size="icon" title="Filters">
            <Filter size={18} />
          </Button>
          <Button 
            variant="primary" 
            leftIcon={<Plus size={18} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Member
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-6">
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map(member => (
              <MemberCard 
                key={member.id} 
                member={member} 
                onClick={() => console.log('Navigate to profile', member.id)}
              />
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No members found</h3>
            <p className="text-gray-500 mt-1 max-w-sm">
              We couldn't find anyone matching "{searchTerm}". Try adjusting your search or add a new member.
            </p>
          </div>
        )}
      </div>

      <AddMemberModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};
