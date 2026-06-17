import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useFamilyStore } from '../store/familyStore';
import { useAuthStore } from '../store/authStore';
import type { FamilyTree, Member, Relationship } from '../types/family';

export const useFamilyData = () => {
  const { isAuthenticated } = useAuthStore();
  const { setTree, members, relationships } = useFamilyStore();

  const { data: trees, isLoading: isLoadingTrees } = useQuery({
    queryKey: ['trees'],
    queryFn: async () => {
      const response = await apiClient.get('/trees');
      return response.data as FamilyTree[];
    },
    enabled: isAuthenticated,
  });

  const activeTreeId = trees?.[0]?.id;

  const { data: treeDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['tree', activeTreeId],
    queryFn: async () => {
      if (!activeTreeId) return null;
      const response = await apiClient.get(`/trees/${activeTreeId}`);
      return response.data as FamilyTree & { members: Member[], relationships: Relationship[] };
    },
    enabled: !!activeTreeId && isAuthenticated,
  });

  useEffect(() => {
    if (treeDetails) {
      setTree(treeDetails);
      // Synchronize the Zustand store with the fetched arrays.
      // Zustand actions addMember/deleteMember will temporarily update UI 
      // while React Query re-fetches in background (optimistic updates).
      useFamilyStore.setState({ 
        members: treeDetails.members, 
        relationships: treeDetails.relationships 
      });
    }
  }, [treeDetails, setTree]);

  return {
    isLoading: isLoadingTrees || isLoadingDetails,
    trees,
    activeTree: treeDetails
  };
};
