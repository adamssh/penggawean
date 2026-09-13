import React, { useState, useRef, useEffect } from 'react';
import { Category } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { TaskCard } from './TaskCard';
import { CategoryIcon } from './CategoryIcon';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  category: Category;
  title: string;
}

export const CategorySection: React.FC<Props> = ({ category, title }) => {
  const { tasks, addTask, clearCompleted } = useTaskStore();
  const [isAdding, setIsAdding] = useState(false);
  const [inlineTitle, setInlineTitle] = useState('');
  const [isDoneOpen, setIsDoneOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const categoryTasks = tasks
    .filter((t) => t.category === category)
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return a.dueDate - b.dueDate;
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return a.createdAt - b.createdAt;
    });
    
  const activeTasks = categoryTasks.filter(t => !t.completed);
  const doneTasks = categoryTasks.filter(t => t.completed);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleSaveTask = (keepOpen: boolean) => {
    if (inlineTitle.trim()) {
      addTask({ 
        title: inlineTitle.trim(), 
        description: '', 
        category 
      });
    }
    setInlineTitle('');
    if (!keepOpen) {
      setIsAdding(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inlineTitle.trim()) {
      handleSaveTask(true);
      // Force refocus to keep keyboard open on mobile
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    } else {
      setIsAdding(false);
    }
  };

  const handleBlur = () => {
    // Delay blur slightly so submit event can run and refocus if needed
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        handleSaveTask(false);
      }
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setInlineTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/5 border border-white/10 md:backdrop-blur-xl md:shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden flex-1 min-h-[300px] relative">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-white/[0.02] backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg border border-white/5">
            <CategoryIcon category={category} className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            <p className="text-xs text-gray-500">{activeTasks.length} active tasks</p>
          </div>
        </div>
        {!isDoneOpen && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!isDoneOpen ? (
          <>
            {isAdding && (
              <form 
                onSubmit={handleFormSubmit}
                className="p-3 rounded-xl bg-white/10 border border-white/20 mb-3 transition-all"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inlineTitle}
                  onChange={(e) => setInlineTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  placeholder="Ketik nama task lalu tekan enter..."
                  className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-400"
                  enterKeyHint="done"
                />
                <button type="submit" className="hidden" tabIndex={-1}>Submit</button>
              </form>
            )}
            {activeTasks.length === 0 && !isAdding ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-500">
                No active tasks
              </div>
            ) : (
              activeTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </>
        ) : (
          <div className="space-y-3 pb-6">
            {doneTasks.length === 0 ? (
              <div className="py-10 flex items-center justify-center text-sm text-gray-500">
                No completed tasks
              </div>
            ) : (
              <>
                {doneTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                <button
                  onClick={() => clearCompleted(category)}
                  className="w-full py-2.5 mt-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Done Dropdown Toggle */}
      <div className="border-t border-white/5 mt-auto">
        <button
          onClick={() => {
            setIsDoneOpen(!isDoneOpen);
            setIsAdding(false); // Cancel any inline adding when opening done list
          }}
          className="w-full p-3 flex items-center justify-between text-sm text-gray-400 hover:text-white transition-colors hover:bg-white/5"
        >
          <span className="font-medium">Done ({doneTasks.length})</span>
          {isDoneOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
