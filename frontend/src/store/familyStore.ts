import { create } from 'zustand';
import type { Member, Relationship, FamilyTree } from '../types/family';

interface FamilyState {
  activeTree: FamilyTree | null;
  members: Member[];
  relationships: Relationship[];
  
  // Actions
  setTree: (tree: FamilyTree) => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, data: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addRelationship: (rel: Relationship) => void;
  deleteRelationship: (id: string) => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  activeTree: null,
  members: [],
  relationships: [],

  setTree: (tree) => set({ activeTree: tree }),
  
  addMember: (member) => set((state) => ({ 
    members: [...state.members, member] 
  })),
  
  updateMember: (id, data) => set((state) => ({
    members: state.members.map((m) => m.id === id ? { ...m, ...data } : m)
  })),
  
  deleteMember: (id) => set((state) => ({
    members: state.members.filter((m) => m.id !== id),
    // Also remove relationships involving this member
    relationships: state.relationships.filter(
      (r) => r.member1Id !== id && r.member2Id !== id
    )
  })),

  addRelationship: (rel) => set((state) => ({
    relationships: [...state.relationships, rel]
  })),
  
  deleteRelationship: (id) => set((state) => ({
    relationships: state.relationships.filter((r) => r.id !== id)
  })),
}));
