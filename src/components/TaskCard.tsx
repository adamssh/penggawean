import React, { useState } from 'react';
import { Task } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { Star, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { TaskForm } from './TaskForm';

interface Props {
  task: Task;
  dragHandleProps?: Record<string, any>;
}

export const TaskCard: React.FC<Props> = ({ task, dragHandleProps }) => {
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

          <div className="flex items-center gap-0.5">
            {dragHandleProps && (
              <div 
                {...dragHandleProps}
                className="p-1.5 rounded-md text-white/20 hover:text-white/40 cursor-grab active:cursor-grabbing touch-none transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center"
              >
                <GripVertical className="w-4 h-4" />
              </div>
            )}

            <div className={clsx(
              "transition-opacity",
              task.starred ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
            )}>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleStar(task.id); }}
                className="p-1.5 rounded-md hover:bg-white/10 text-white/20 md:text-gray-400 hover:text-yellow-400 md:hover:text-yellow-400 transition-colors"
              >
                <Star className={clsx("w-4 h-4", task.starred && "fill-yellow-400 text-yellow-400")} />
              </button>
            </div>
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
