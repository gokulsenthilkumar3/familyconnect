import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useFamilyStore } from '../../store/familyStore';
import { useUIStore } from '../../store/uiStore';
import apiClient from '../../api/client';
import type { EventType } from '../../types/family';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose }) => {
  const { activeTree } = useFamilyStore();
  const { addToast } = useUIStore();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'achievement' as EventType,
    date: '',
    location: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post('/events', {
        treeId: activeTree?.id,
        ...formData,
      });

      if (activeTree?.id) {
        queryClient.invalidateQueries({ queryKey: ['events', activeTree.id] });
      }

      addToast({
        type: 'success',
        message: 'Event added to timeline!',
      });
      onClose();
    } catch (error) {
      console.error('Failed to create event:', error);
      addToast({
        type: 'error',
        message: 'Failed to add event',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Timeline Milestone" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[var(--color-saffron)] focus:border-[var(--color-saffron)]"
            placeholder="e.g. Moved to Canada"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
            >
              <option value="migration">Migration</option>
              <option value="marriage">Marriage</option>
              <option value="achievement">Achievement</option>
              <option value="gathering">Gathering</option>
              <option value="death">Passing</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
            placeholder="e.g. Toronto, ON"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
            placeholder="Details about this milestone..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Milestone'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
