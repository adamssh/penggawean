import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Task, Category } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import clsx from 'clsx';
import { GlassDatePicker } from './GlassDatePicker';

interface Props {
  taskToEdit: Task;
  onClose: () => void;
}

export const TaskForm: React.FC<Props> = ({ taskToEdit, onClose }) => {
  const { updateTask } = useTaskStore();
  
  const [title, setTitle] = useState(taskToEdit.title);
  const [description, setDescription] = useState(taskToEdit.description || '');
  const [category, setCategory] = useState<Category>(taskToEdit.category);
  
  const initialDate = taskToEdit.dueDate 
    ? new Date(taskToEdit.dueDate).toISOString().split('T')[0]
    : '';
  const [dueDate, setDueDate] = useState(initialDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedDate = dueDate ? new Date(dueDate).getTime() : undefined;
    updateTask(taskToEdit.id, { title, description, category, dueDate: parsedDate });
    onClose();
  };

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#111111] border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in-0 duration-200">
        <div className="p-4 border-b border-white/10 text-center">
          <h2 className="text-base font-semibold text-white">
            Detail Task
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Judul Task</label>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-white/30"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Deskripsi</label>
            <textarea
              placeholder="Tambahkan deskripsi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-white/30 resize-none h-20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Kategori</label>
            <div className="grid grid-cols-2 gap-2">
              {(
                ['important-urgent', 'important-not-urgent', 'not-important-urgent', 'not-important-not-urgent'] as Category[]
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={clsx(
                    "px-2 py-1.5 text-[10px] sm:text-xs rounded-lg border text-center transition-colors",
                    category === cat 
                      ? "bg-white/10 border-white/30 text-white" 
                      : "bg-transparent border-white/10 text-gray-400 hover:bg-white/5"
                  )}
                >
                  {cat.split('-').join(' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Tenggat Waktu</label>
            <GlassDatePicker value={dueDate} onChange={setDueDate} />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg px-4 py-2.5 transition-colors border border-white/10 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 bg-white text-black font-semibold rounded-lg px-4 py-2.5 disabled:opacity-50 hover:bg-gray-200 transition-colors text-sm"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};
