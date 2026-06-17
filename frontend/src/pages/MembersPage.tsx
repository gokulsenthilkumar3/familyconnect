import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFamilyStore } from '../store/familyStore';
import { MemberCard } from '../components/profile/MemberCard';
import { AddMemberModal } from '../components/profile/AddMemberModal';
import { Button } from '../components/common/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 25 } }
} as const;

export const MembersPage: React.FC = () => {
  const { members } = useFamilyStore();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'living' | 'deceased'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'other'>('all');

  const filteredMembers = members.filter(m => {
    // Text search (name, location, occupation)
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      m.name.toLowerCase().includes(term) ||
      m.birthLocation?.toLowerCase().includes(term) ||
      m.occupation?.toLowerCase().includes(term);

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'living') matchesStatus = m.isAlive === true;
    if (statusFilter === 'deceased') matchesStatus = m.isAlive === false;

    // Gender filter
    let matchesGender = true;
    if (genderFilter !== 'all') matchesGender = m.gender === genderFilter;

    return matchesSearch && matchesStatus && matchesGender;
  });

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
              placeholder="Search by name, location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-saffron)] focus:border-transparent transition-all sm:text-sm"
            />
          </div>
          <Button 
            variant={showFilters ? "primary" : "secondary"} 
            size="icon" 
            title="Filters"
            onClick={() => setShowFilters(!showFilters)}
          >
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

      {/* Filter Bar */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl flex flex-wrap gap-4 items-center animate-fade-in">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
            <select 
              className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-[var(--color-saffron)] focus:border-[var(--color-saffron)]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Statuses</option>
              <option value="living">Living</option>
              <option value="deceased">Deceased</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gender</label>
            <select 
              className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-[var(--color-saffron)] focus:border-[var(--color-saffron)]"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="ml-auto mt-auto">
            <Button 
              variant="tertiary" 
              size="sm"
              onClick={() => {
                setStatusFilter('all');
                setGenderFilter('all');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-6">
        {filteredMembers.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredMembers.map(member => (
              <motion.div variants={itemVariants} key={member.id}>
                <MemberCard 
                  member={member} 
                  onClick={() => navigate(`/profile/${member.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
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
