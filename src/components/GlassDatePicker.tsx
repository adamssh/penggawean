import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, isToday } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const GlassDatePicker: React.FC<Props> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());

  const selectedDate = value ? new Date(value) : undefined;

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const handleSelect = (day: Date) => {
    // Correctly format to local YYYY-MM-DD
    const localDateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    onChange(localDateStr);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-left text-sm focus:outline-none focus:border-white/30 flex items-center justify-between hover:bg-white/10 transition-colors group"
      >
        <span className={clsx(!selectedDate && "text-gray-500", selectedDate && "text-white")}>
          {selectedDate ? format(selectedDate, 'd MMMM yyyy') : 'Pilih tanggal...'}
        </span>
        <CalendarIcon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 p-3 w-[260px] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <button 
                type="button" 
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
              >
                <ChevronLeft className="w-4 h-4 text-gray-300" />
              </button>
              <span className="text-sm font-semibold text-white">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button 
                type="button" 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
              >
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                <div key={day} className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => {
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isDayToday = isToday(day);
                
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(day)}
                    className={clsx(
                      "h-8 w-full rounded-lg flex items-center justify-center text-xs transition-all",
                      !isCurrentMonth && "text-gray-600 hover:text-gray-400",
                      isCurrentMonth && !isSelected && "text-gray-300 hover:bg-white/10 hover:text-white",
                      isSelected && "bg-white text-black font-bold shadow-[0_0_10px_rgba(255,255,255,0.5)]",
                      isDayToday && !isSelected && "border border-white/20 text-white bg-white/5"
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                )
              })}
            </div>
            
            {value && (
              <button
                type="button"
                onClick={() => { onChange(''); setIsOpen(false); }}
                className="w-full mt-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
              >
                Hapus Tanggal
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
