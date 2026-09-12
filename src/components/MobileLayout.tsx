import React, { useState, useRef, useEffect } from 'react';
import { CategorySection } from './CategorySection';
import { Category } from '../types';
import { ChevronLeft, Star } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskCard } from './TaskCard';
import { AuthHeader } from './AuthHeader';

export const MobileLayout: React.FC = () => {
  const [view, setView] = useState<'home' | 'category' | 'starred'>('home');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const { tasks } = useTaskStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const starredTasks = tasks
    .filter(t => t.starred)
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return a.dueDate - b.dueDate;
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return a.createdAt - b.createdAt;
    });
  
  const categories: { id: Category; title: string }[] = [
    { id: 'important-urgent', title: 'Important & Urgent' },
    { id: 'important-not-urgent', title: 'Important & Not Urgent' },
    { id: 'not-important-urgent', title: 'Not Important & Urgent' },
    { id: 'not-important-not-urgent', title: 'Not Important & Not Urgent' },
  ];

  // Scroll to section when activeCategory changes
  useEffect(() => {
    if (view === 'category' && activeCategory && containerRef.current) {
      const el = document.getElementById(`category-${activeCategory}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [view, activeCategory]);

  return (
    <div className="flex flex-col h-[100dvh] md:hidden z-10 relative">
      <header className="p-5 flex items-center justify-between sticky top-0 bg-black/20 backdrop-blur-lg z-20 border-b border-white/5">
        {view !== 'home' ? (
          <button 
            onClick={() => setView('home')}
            className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
        ) : (
          <h1 className="text-xl font-bold text-white tracking-tight">To Do</h1>
        )}
        <AuthHeader />
      </header>

      <main className="flex-1 overflow-y-auto" ref={containerRef}>
        {view === 'home' && (
          <div className="p-4 space-y-4">
            <button
              onClick={() => setView('starred')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Starred Tasks</h3>
                  <p className="text-xs text-gray-400">{starredTasks.length} tasks</p>
                </div>
              </div>
            </button>

            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => {
                const count = tasks.filter(t => t.category === cat.id && !t.completed).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setView('category');
                    }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left active:scale-[0.98] transition-transform aspect-square flex flex-col justify-center gap-2"
                  >
                    <h3 className="font-semibold text-white text-sm line-clamp-2 leading-tight">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-gray-400">{count} tasks</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {view === 'starred' && (
          <div className="p-4 space-y-3 pb-10">
            <h2 className="text-lg font-bold text-white mb-4 px-1">Starred Tasks</h2>
            {starredTasks.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">
                Belum ada task yang dibintangi.
              </div>
            ) : (
              starredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        )}

        {view === 'category' && (
          <div className="p-4 space-y-4 pb-10">
            {categories.map((cat) => (
              <div key={cat.id} id={`category-${cat.id}`} className="scroll-mt-20 min-h-[300px]">
                <CategorySection category={cat.id} title={cat.title} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
