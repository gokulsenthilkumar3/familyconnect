import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import { Avatar } from '../common/Avatar';
import type { Member } from '../../types/family';

export type MemberNodeType = Node<Member & Record<string, unknown>, 'member'>;

export const MemberNode: React.FC<NodeProps<MemberNodeType>> = ({ data, selected }) => {
  return (
    <div className={`relative px-4 py-3 shadow-md rounded-xl bg-white border-2 transition-colors ${
      selected ? 'border-[var(--color-saffron)]' : 'border-gray-100 hover:border-gray-300'
    }`}>
      {/* Input Handle (Top) */}
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-400" />
      
      <div className="flex items-center space-x-3 w-48">
        <Avatar 
          name={data.name} 
          src={data.photoUrl} 
          size="md" 
          isAlive={data.isAlive}
          showStatus
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">
            {data.name}
          </p>
          <div className="flex items-center space-x-1 mt-0.5">
            <span className="text-xs text-gray-500">
              {data.birthDate ? new Date(data.birthDate).getFullYear() : '?'} - 
              {!data.isAlive && data.deathDate ? new Date(data.deathDate).getFullYear() : 'Present'}
            </span>
          </div>
        </div>
      </div>

      {/* Output Handle (Bottom) */}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-400" />
    </div>
  );
};
