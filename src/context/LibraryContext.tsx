import { Book, Author, Category, Member, Transaction, calculateFine, formatRupees, LOAN_DAYS } from '@/lib/types';
import { authors, categories, initialBooks, initialMembers, initialTransactions } from '@/lib/store';
import React, { createContext, useContext, useState, useCallback } from 'react';

interface LibraryContextType {
  books: Book[];
  members: Member[];
  transactions: Transaction[];
  getAuthor: (id: string) => Author | undefined;
  getCategory: (id: string) => Category | undefined;
  getBook: (id: string) => Book | undefined;
  getMember: (id: string) => Member | undefined;
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addMember: (member: Omit<Member, 'id'>) => void;
  issueBook: (bookId: string, memberId: string) => string | null;
  returnBook: (transactionId: string) => number;
  stats: { totalBooks: number; totalMembers: number; activeLoans: number; overdueBooks: number; totalFines: number };
}

const LibraryContext = createContext<LibraryContextType | null>(null);

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be inside LibraryProvider');
  return ctx;
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [members] = useState<Member[]>(initialMembers);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const getAuthor = useCallback((id: string) => authors.find(a => a.id === id), []);
  const getCategory = useCallback((id: string) => categories.find(c => c.id === id), []);
  const getBook = useCallback((id: string) => books.find(b => b.id === id), [books]);
  const getMember = useCallback((id: string) => members.find(m => m.id === id), [members]);

  const addBook = useCallback((book: Omit<Book, 'id'>) => {
    setBooks(prev => [...prev, { ...book, id: `b${Date.now()}` }]);
  }, []);

  const updateBook = useCallback((id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const deleteBook = useCallback((id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  }, []);

  const addMember = useCallback((member: Omit<Member, 'id'>) => {
    // members state is not mutable in this demo but we keep the interface
  }, []);

  const issueBook = useCallback((bookId: string, memberId: string): string | null => {
    const book = books.find(b => b.id === bookId);
    const member = members.find(m => m.id === memberId);
    if (!book || !member) return 'Book or member not found';
    if (book.availableCopies <= 0) return 'No copies available';
    const activeLoans = transactions.filter(t => t.memberId === memberId && t.status !== 'returned').length;
    if (activeLoans >= member.maxBooks) return `Member has reached max limit of ${member.maxBooks} books`;

    const today = new Date().toISOString().split('T')[0];
    const due = new Date();
    due.setDate(due.getDate() + LOAN_DAYS);
    const dueDate = due.toISOString().split('T')[0];

    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    setTransactions(prev => [...prev, {
      id: `t${Date.now()}`,
      bookId, memberId,
      issueDate: today,
      dueDate,
      returnDate: null,
      fineAmount: 0,
      status: 'issued',
    }]);
    return null;
  }, [books, members, transactions]);

  const returnBook = useCallback((transactionId: string): number => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return 0;
    const today = new Date().toISOString().split('T')[0];
    const fine = calculateFine(tx.dueDate, today);

    setBooks(prev => prev.map(b => b.id === tx.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b));
    setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, returnDate: today, fineAmount: fine, status: 'returned' as const } : t));
    return fine;
  }, [transactions]);

  const stats = React.useMemo(() => {
    const activeLoans = transactions.filter(t => t.status === 'issued' || t.status === 'overdue').length;
    const overdueBooks = transactions.filter(t => t.status === 'overdue').length;
    const totalFines = transactions.reduce((sum, t) => sum + t.fineAmount, 0);
    return { totalBooks: books.reduce((s, b) => s + b.totalCopies, 0), totalMembers: members.filter(m => m.active).length, activeLoans, overdueBooks, totalFines };
  }, [books, members, transactions]);

  return (
    <LibraryContext.Provider value={{ books, members, transactions, getAuthor, getCategory, getBook, getMember, addBook, updateBook, deleteBook, addMember, issueBook, returnBook, stats }}>
      {children}
    </LibraryContext.Provider>
  );
}
