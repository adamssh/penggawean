import { useEffect } from 'react';
import { Background } from './components/Background';
import { DesktopDashboard } from './components/DesktopDashboard';
import { MobileLayout } from './components/MobileLayout';
import { AuthModal } from './components/AuthModal';
import { useAuthStore } from './store/useAuthStore';
import { useTaskStore } from './store/useTaskStore';
import { supabase } from './lib/supabase';

function App() {
  const { session, isLoading, initialize } = useAuthStore();
  const { fetchTasks, handleRealtimeEvent } = useTaskStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (session) {
      // Fetch initial tasks when user logs in
      fetchTasks();

      // Setup Realtime Subscription
      const channel = supabase
        .channel('tasks-all-channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tasks' },
          (payload) => {
            handleRealtimeEvent(payload);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session, fetchTasks, handleRealtimeEvent]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-white/20">
      <Background />
      <DesktopDashboard />
      <MobileLayout />
      <AuthModal />
    </div>
  );
}

export default App;
