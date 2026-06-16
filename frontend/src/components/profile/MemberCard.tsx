import React from 'react';
import { Card, CardBody } from '../common/Card';
import { Avatar } from '../common/Avatar';
import type { Member } from '../../types/family';
import { MapPin, Briefcase } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onClick?: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onClick }) => {
  return (
    <Card interactive onClick={onClick} padding="sm">
      <CardBody className="flex items-center space-x-4">
        <Avatar 
          name={member.name} 
          src={member.photoUrl} 
          size="lg" 
          isAlive={member.isAlive}
          showStatus
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">{member.name}</h3>
          
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-500">
              {member.birthDate ? new Date(member.birthDate).getFullYear() : '?'} - 
              {!member.isAlive && member.deathDate ? new Date(member.deathDate).getFullYear() : 'Present'}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="text-sm text-gray-500 capitalize">{member.gender}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {member.occupation && (
              <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                <Briefcase size={12} className="mr-1" />
                {member.occupation}
              </span>
            )}
            {member.birthLocation && (
              <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                <MapPin size={12} className="mr-1" />
                {member.birthLocation}
              </span>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
