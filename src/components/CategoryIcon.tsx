import React from 'react';
import { AlertCircle, Clock, ArrowRight, Minus } from 'lucide-react';
import { Category } from '../types';
import clsx from 'clsx';

interface Props {
  category: Category;
  className?: string;
}

export const CategoryIcon: React.FC<Props> = ({ category, className }) => {
  switch (category) {
    case 'important-urgent':
      return <AlertCircle className={clsx('text-importantUrgent', className)} />;
    case 'important-not-urgent':
      return <Clock className={clsx('text-importantNotUrgent', className)} />;
    case 'not-important-urgent':
      return <ArrowRight className={clsx('text-notImportantUrgent', className)} />;
    case 'not-important-not-urgent':
      return <Minus className={clsx('text-notImportantNotUrgent', className)} />;
  }
};
