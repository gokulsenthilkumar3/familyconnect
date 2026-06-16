import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Plus, LayoutList } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { Button } from '../common/Button';

interface TreeToolbarProps {
  onAddMember: () => void;
  onLayoutToggle: () => void;
}

export const TreeToolbar: React.FC<TreeToolbarProps> = ({ onAddMember, onLayoutToggle }) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white shadow-lg border border-gray-100 rounded-full px-4 py-2 flex items-center space-x-2">
      <Button 
        variant="tertiary" 
        size="icon" 
        onClick={() => zoomOut()} 
        title="Zoom Out"
      >
        <ZoomOut size={18} />
      </Button>
      
      <span className="w-px h-6 bg-gray-200" />
      
      <Button 
        variant="tertiary" 
        size="icon" 
        onClick={() => zoomIn()} 
        title="Zoom In"
      >
        <ZoomIn size={18} />
      </Button>
      
      <span className="w-px h-6 bg-gray-200" />
      
      <Button 
        variant="tertiary" 
        size="icon" 
        onClick={() => fitView({ duration: 800 })} 
        title="Fit View"
      >
        <Maximize size={18} />
      </Button>
      
      <span className="w-px h-6 bg-gray-200" />
      
      <Button 
        variant="tertiary" 
        size="icon" 
        onClick={onLayoutToggle} 
        title="Toggle Layout"
      >
        <LayoutList size={18} />
      </Button>
      
      <div className="pl-4 border-l border-gray-200 ml-2">
        <Button 
          variant="primary" 
          size="sm" 
          leftIcon={<Plus size={16} />}
          onClick={onAddMember}
          className="rounded-full"
        >
          Add Member
        </Button>
      </div>
    </div>
  );
};
