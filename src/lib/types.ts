export interface Book {
  id: string;
  isbn: string;
  title: string;
  author_id: string;
  category_id: string;
  publisher: string;
  year: number;
  total_copies: number;
  available_copies: number;
  shelf_location: string;
  added_date: string;
}

export interface Author {
  id: string;
  name: string;
  nationality: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'faculty' | 'admin' | 'librarian';
  department: string;
  join_date: string;
  max_books: number;
  active: boolean;
}

export interface Transaction {
  id: string;
  book_id: string;
  member_id: string;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  fine_amount: number; // in ₹
  status: 'issued' | 'returned' | 'overdue';
}

export const FINE_PER_DAY = 5; // ₹5 per day
export const LOAN_DAYS = 14;

export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function calculateFine(dueDate: string, returnDate: string | null): number {
  const due = new Date(dueDate);
  const ret = returnDate ? new Date(returnDate) : new Date();
  const diffDays = Math.floor((ret.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays * FINE_PER_DAY : 0;
}
