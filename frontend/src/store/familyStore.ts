import { create } from 'zustand';
import type { FamilyTree, Member, Relationship, FamilyEvent, FamilyDocument } from '../types/family';

interface FamilyState {
  activeTree: FamilyTree | null;
  currentUserRole: 'viewer' | 'editor' | 'admin' | 'family_head' | null;
  members: Member[];
  relationships: Relationship[];
  events: FamilyEvent[];
  documents: FamilyDocument[];
  
  // Actions
  setActiveTree: (tree: FamilyTree | null) => void;
  setCurrentUserRole: (role: 'viewer' | 'editor' | 'admin' | 'family_head' | null) => void;
  setMembers: (members: Member[]) => void;
  setRelationships: (relationships: Relationship[]) => void;
  setEvents: (events: FamilyEvent[]) => void;
  setDocuments: (documents: FamilyDocument[]) => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, data: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addRelationship: (rel: Relationship) => void;
  deleteRelationship: (id: string) => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  activeTree: null,
  currentUserRole: null,
  members: [],
  relationships: [],
  events: [],
  documents: [],

  setActiveTree: (tree) => set({ activeTree: tree }),
  setCurrentUserRole: (role) => set({ currentUserRole: role }),
  setMembers: (members) => set({ members }),
  setRelationships: (relationships) => set({ relationships }),
  setEvents: (events) => set({ events }),
  setDocuments: (documents) => set({ documents }),
  
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
