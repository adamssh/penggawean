import React, { useState } from 'react';
import { Task } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { TaskForm } from './TaskForm';

interface Props {
  task: Task;
}

export const TaskCard: React.FC<Props> = ({ task }) => {
  const { toggleComplete, toggleStar } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className={clsx(
        "group relative p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all",
        task.completed && "opacity-60"
      )}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toggleComplete(task.id)}
            className={clsx(
              "w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors",
              task.completed ? "bg-white/20 border-transparent" : "border-white/30 hover:border-white/60"
            )}
          >
            {task.completed && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
          </button>
          
          <div 
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <h4 className={clsx(
              "text-sm font-medium text-white truncate transition-all",
              task.completed && "line-through text-gray-400"
            )}>
              {task.title}
            </h4>
            
            {task.description && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            
            {task.dueDate && (
              <p className="text-[10px] text-gray-500 mt-1 font-medium">
                Due: {format(task.dueDate, 'MMM d, yyyy')}
              </p>
            )}
          </div>

          <div className={clsx(
            "flex items-center gap-1 transition-opacity",
            task.starred ? "opacity-100" : "opacity-100 md:opacity-0 group-hover:opacity-100"
          )}>
            <button 
              onClick={(e) => { e.stopPropagation(); toggleStar(task.id); }}
              className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <Star className={clsx("w-4 h-4", task.starred && "fill-yellow-400 text-yellow-400")} />
            </button>
          </div>
        </div>
      </div>
      
      {isEditing && (
        <TaskForm 
          taskToEdit={task} 
          onClose={() => setIsEditing(false)} 
        />
      )}
    </>
  );
};
