import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Category } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';
import { generateUUID } from '../utils/uuid';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  clearTasks: () => void;
  fetchTasks: () => Promise<void>;
  handleRealtimeEvent: (payload: any) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'starred'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;
  moveTask: (id: string, category: Category) => Promise<void>;
  clearCompleted: (category: Category) => Promise<void>;
}

const mapToTask = (row: any): Task => ({
  id: row.id,
  title: row.title,
  description: row.description || undefined,
  category: row.category as Category,
  completed: row.completed,
  starred: row.starred,
  createdAt: new Date(row.created_at).getTime(),
  updatedAt: new Date(row.updated_at).getTime(),
  dueDate: row.due_date ? new Date(row.due_date).getTime() : undefined,
});

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,

      clearTasks: () => set({ tasks: [] }),

      handleRealtimeEvent: (payload) => {
        set((state) => {
          if (payload.eventType === 'INSERT') {
            const exists = state.tasks.some(t => t.id === payload.new.id);
            if (exists) {
              return { tasks: state.tasks.map(t => t.id === payload.new.id ? mapToTask(payload.new) : t) };
            }
            return { tasks: [...state.tasks, mapToTask(payload.new)] };
          }
          if (payload.eventType === 'UPDATE') {
            return { tasks: state.tasks.map(t => t.id === payload.new.id ? mapToTask(payload.new) : t) };
          }
          if (payload.eventType === 'DELETE') {
            return { tasks: state.tasks.filter(t => t.id !== payload.old.id) };
          }
          return state;
        });
      },

      fetchTasks: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set({ isLoading: true });
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          set({ tasks: data.map(mapToTask), isLoading: false });
        } else {
          set({ isLoading: false });
          console.error('Error fetching tasks:', error);
        }
      },

      addTask: async (taskData) => {
        const user = useAuthStore.getState().user;
        const now = Date.now();
        const taskId = generateUUID();

        const newTask: Task = {
          ...taskData,
          id: taskId,
          completed: false,
          starred: false,
          createdAt: now,
          updatedAt: now,
        };

        // Optimistic update
        set((state) => ({ tasks: [...state.tasks, newTask] }));

        if (user) {
          const { error } = await supabase
            .from('tasks')
            .insert([{
              id: taskId,
              user_id: user.id,
              title: taskData.title,
              description: taskData.description || null,
              category: taskData.category,
              due_date: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
            }]);

          if (error) {
            console.error('Error adding task:', error);
            // Revert on error
            set((state) => ({ tasks: state.tasks.filter(t => t.id !== taskId) }));
            get().fetchTasks();
          }
        }
      },

      updateTask: async (id, updates) => {
        const user = useAuthStore.getState().user;
        
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
          ),
        }));

        if (user) {
          const updateData: any = { updated_at: new Date().toISOString() };
          if (updates.title !== undefined) updateData.title = updates.title;
          if (updates.description !== undefined) updateData.description = updates.description;
          if (updates.category !== undefined) updateData.category = updates.category;
          if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate ? new Date(updates.dueDate).toISOString() : null;

          const { error } = await supabase.from('tasks').update(updateData).eq('id', id);
          if (error) get().fetchTasks();
        }
      },

      deleteTask: async (id) => {
        const user = useAuthStore.getState().user;
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
        
        if (user) {
          const { error } = await supabase.from('tasks').delete().eq('id', id);
          if (error) get().fetchTasks();
        }
      },

      toggleComplete: async (id) => {
        const user = useAuthStore.getState().user;
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;
        
        const newStatus = !task.completed;
        set((state) => ({
          tasks: state.tasks.map((t) => 
            t.id === id ? { ...t, completed: newStatus, updatedAt: Date.now() } : t
          ),
        }));

        if (user) {
          const { error } = await supabase.from('tasks').update({ completed: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
          if (error) get().fetchTasks();
        }
      },

      toggleStar: async (id) => {
        const user = useAuthStore.getState().user;
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;
        
        const newStatus = !task.starred;
        set((state) => ({
          tasks: state.tasks.map((t) => 
            t.id === id ? { ...t, starred: newStatus, updatedAt: Date.now() } : t
          ),
        }));

        if (user) {
          const { error } = await supabase.from('tasks').update({ starred: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
          if (error) get().fetchTasks();
        }
      },

      moveTask: async (id, category) => {
        const user = useAuthStore.getState().user;
        set((state) => ({
          tasks: state.tasks.map((t) => 
            t.id === id ? { ...t, category, updatedAt: Date.now() } : t
          ),
        }));

        if (user) {
          const { error } = await supabase.from('tasks').update({ category, updated_at: new Date().toISOString() }).eq('id', id);
          if (error) get().fetchTasks();
        }
      },

      clearCompleted: async (category) => {
        const user = useAuthStore.getState().user;
        const completedTasks = get().tasks.filter((t) => t.category === category && t.completed);
        const idsToDelete = completedTasks.map(t => t.id);
        
        if (idsToDelete.length === 0) return;

        set((state) => ({
          tasks: state.tasks.filter((t) => !(t.category === category && t.completed)),
        }));

        if (user) {
          const { error } = await supabase.from('tasks').delete().in('id', idsToDelete);
          if (error) get().fetchTasks();
        }
      },
    }),
    {
      name: 'eisenhower-tasks',
    }
  )
);
