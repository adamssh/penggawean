export type Category = 
  | 'important-urgent'
  | 'important-not-urgent'
  | 'not-important-urgent'
  | 'not-important-not-urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  completed: boolean;
  starred: boolean;
  position: number;
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
}
