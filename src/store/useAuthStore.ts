import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  initialize: () => void;
  signOut: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true,
  isAuthModalOpen: false,
  initialize: async () => {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user || null, isLoading: false });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user || null });
    });
  },
  signOut: async () => {
    await supabase.auth.signOut();
  },
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
