import React from 'react';
import { CategorySection } from './CategorySection';
import { AuthHeader } from './AuthHeader';

export const DesktopDashboard: React.FC = () => {
  return (
    <div className="hidden md:flex flex-col h-screen p-6 z-10 relative max-w-[1600px] mx-auto w-full">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">To Do</h1>
        </div>
        <AuthHeader />
      </header>
      
      <div className="grid grid-cols-2 grid-rows-2 gap-6 flex-1 min-h-0">
        <CategorySection category="important-urgent" title="Important & Urgent" />
        <CategorySection category="important-not-urgent" title="Important & Not Urgent" />
        <CategorySection category="not-important-urgent" title="Not Important & Urgent" />
        <CategorySection category="not-important-not-urgent" title="Not Important & Not Urgent" />
      </div>
    </div>
  );
};
