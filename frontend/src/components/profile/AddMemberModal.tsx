import React from 'react';
import { Modal } from '../common/Modal';
import { MemberForm } from './MemberForm';
import { useFamilyStore } from '../../store/familyStore';
import { useUIStore } from '../../store/uiStore';
import type { Member } from '../../types/family';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose }) => {
  const { addMember, activeTree } = useFamilyStore();
  const { addToast } = useUIStore();

  const handleSubmit = (data: any) => {
    // Convert form data to Member object
    const newMember: Member = {
      id: `mem-${Date.now()}`,
      treeId: activeTree?.id || 'tree-1',
      name: data.name,
      gender: data.gender,
      birthDate: data.birthDate,
      birthLocation: data.birthLocation,
      isAlive: data.isAlive,
      deathDate: data.deathDate,
      bio: data.bio,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addMember(newMember);
    
    // Note: If relationshipToRoot is selected, we would also create a Relationship entry here
    
    addToast({
      type: 'success',
      message: `${data.name} was added to the family tree.`
    });
    
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Family Member"
      maxWidth="lg"
    >
      <MemberForm onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
};
