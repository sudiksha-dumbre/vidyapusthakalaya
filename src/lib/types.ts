export interface Book {
  id: string;
  isbn: string;
  title: string;
  authorId: string;
  categoryId: string;
  publisher: string;
  year: number;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  addedDate: string;
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
  joinDate: string;
  maxBooks: number;
  active: boolean;
}

export interface Transaction {
  id: string;
  bookId: string;
  memberId: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  fineAmount: number; // in ₹
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
