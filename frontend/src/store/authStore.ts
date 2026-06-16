import { create } from 'zustand';
import type { User } from '../types/family';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,

  login: (user) => set({ currentUser: user, isAuthenticated: true }),
  
  logout: () => set({ currentUser: null, isAuthenticated: false }),
}));
