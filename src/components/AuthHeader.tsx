import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useTaskStore } from '../store/useTaskStore';
import { LogOut, User } from 'lucide-react';

export const AuthHeader: React.FC = () => {
  const { user, signOut, openAuthModal } = useAuthStore();
  const { clearTasks } = useTaskStore();

  const handleLogout = async () => {
    await signOut();
    clearTasks(); // Clear local tasks when logging out so they start fresh
  };

  if (!user) {
    return (
      <button 
        onClick={openAuthModal}
        className="bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-full px-4 py-2 transition-colors border border-white/10"
      >
        Login / Register
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
        <User className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs font-medium text-gray-300 truncate max-w-[150px]">
          {user.email}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
};
