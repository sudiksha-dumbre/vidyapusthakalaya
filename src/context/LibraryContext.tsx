import { Book, Author, Category, Member, Transaction, calculateFine, LOAN_DAYS } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface LibraryContextType {
  books: Book[];
  members: Member[];
  transactions: Transaction[];
  authorsList: Author[];
  categoriesList: Category[];
  loading: boolean;
  getAuthor: (id: string) => Author | undefined;
  getCategory: (id: string) => Category | undefined;
  getBook: (id: string) => Book | undefined;
  getMember: (id: string) => Member | undefined;
  addBook: (book: Omit<Book, 'id'>) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  addMember: (member: Omit<Member, 'id'>) => Promise<void>;
  addAuthor: (author: Omit<Author, 'id'>) => Promise<string>;
  issueBook: (bookId: string, memberId: string) => Promise<string | null>;
  returnBook: (transactionId: string) => Promise<number>;
  refreshData: () => Promise<void>;
  stats: { totalBooks: number; totalMembers: number; activeLoans: number; overdueBooks: number; totalFines: number };
}

const LibraryContext = createContext<LibraryContextType | null>(null);

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be inside LibraryProvider');
  return ctx;
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [authorsList, setAuthors] = useState<Author[]>([]);
  const [categoriesList, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const [booksRes, membersRes, txRes, authorsRes, catsRes] = await Promise.all([
      supabase.from('books').select('*'),
      supabase.from('members').select('*'),
      supabase.from('transactions').select('*'),
      supabase.from('authors').select('*'),
      supabase.from('categories').select('*'),
    ]);
    if (booksRes.data) setBooks(booksRes.data as Book[]);
    if (membersRes.data) setMembers(membersRes.data as Member[]);
    if (txRes.data) setTransactions(txRes.data as Transaction[]);
    if (authorsRes.data) setAuthors(authorsRes.data as Author[]);
    if (catsRes.data) setCategories(catsRes.data as Category[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getAuthor = useCallback((id: string) => authorsList.find(a => a.id === id), [authorsList]);
  const getCategory = useCallback((id: string) => categoriesList.find(c => c.id === id), [categoriesList]);
  const getBook = useCallback((id: string) => books.find(b => b.id === id), [books]);
  const getMember = useCallback((id: string) => members.find(m => m.id === id), [members]);

  const addBook = useCallback(async (book: Omit<Book, 'id'>) => {
    const { error } = await supabase.from('books').insert({
      isbn: book.isbn,
      title: book.title,
      author_id: book.author_id,
      category_id: book.category_id,
      publisher: book.publisher,
      year: book.year,
      total_copies: book.total_copies,
      available_copies: book.available_copies,
      shelf_location: book.shelf_location,
      added_date: book.added_date,
    });
    if (!error) await fetchAll();
  }, [fetchAll]);

  const updateBook = useCallback(async (id: string, updates: Partial<Book>) => {
    const dbUpdates: Record<string, any> = {};
    if (updates.isbn !== undefined) dbUpdates.isbn = updates.isbn;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.author_id !== undefined) dbUpdates.author_id = updates.author_id;
    if (updates.category_id !== undefined) dbUpdates.category_id = updates.category_id;
    if (updates.publisher !== undefined) dbUpdates.publisher = updates.publisher;
    if (updates.year !== undefined) dbUpdates.year = updates.year;
    if (updates.total_copies !== undefined) dbUpdates.total_copies = updates.total_copies;
    if (updates.available_copies !== undefined) dbUpdates.available_copies = updates.available_copies;
    if (updates.shelf_location !== undefined) dbUpdates.shelf_location = updates.shelf_location;
    if (updates.added_date !== undefined) dbUpdates.added_date = updates.added_date;
    const { error } = await supabase.from('books').update(dbUpdates).eq('id', id);
    if (!error) await fetchAll();
  }, [fetchAll]);

  const deleteBook = useCallback(async (id: string) => {
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (!error) await fetchAll();
  }, [fetchAll]);

  const addMember = useCallback(async (member: Omit<Member, 'id'>) => {
    const { error } = await supabase.from('members').insert({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      department: member.department,
      join_date: member.join_date,
      max_books: member.max_books,
      active: member.active,
    });
    if (!error) await fetchAll();
  }, [fetchAll]);

  const addAuthor = useCallback(async (author: Omit<Author, 'id'>): Promise<string> => {
    const { data, error } = await supabase.from('authors').insert({
      name: author.name,
      nationality: author.nationality,
    }).select('id').single();
    if (!error) await fetchAll();
    return data?.id || '';
  }, [fetchAll]);

  const issueBook = useCallback(async (bookId: string, memberId: string): Promise<string | null> => {
    const book = books.find(b => b.id === bookId);
    const member = members.find(m => m.id === memberId);
    if (!book || !member) return 'Book or member not found';
    if (book.available_copies <= 0) return 'No copies available';
    const activeLoans = transactions.filter(t => t.member_id === memberId && t.status !== 'returned').length;
    if (activeLoans >= member.max_books) return `Member has reached max limit of ${member.max_books} books`;

    const today = new Date().toISOString().split('T')[0];
    const due = new Date();
    due.setDate(due.getDate() + LOAN_DAYS);
    const dueDate = due.toISOString().split('T')[0];

    // Update book availability
    await supabase.from('books').update({ available_copies: book.available_copies - 1 }).eq('id', bookId);
    // Insert transaction
    await supabase.from('transactions').insert({
      book_id: bookId,
      member_id: memberId,
      issue_date: today,
      due_date: dueDate,
      fine_amount: 0,
      status: 'issued',
    });
    await fetchAll();
    return null;
  }, [books, members, transactions, fetchAll]);

  const returnBook = useCallback(async (transactionId: string): Promise<number> => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return 0;
    const today = new Date().toISOString().split('T')[0];
    const fine = calculateFine(tx.due_date, today);

    const book = books.find(b => b.id === tx.book_id);
    if (book) {
      await supabase.from('books').update({ available_copies: book.available_copies + 1 }).eq('id', tx.book_id);
    }
    await supabase.from('transactions').update({
      return_date: today,
      fine_amount: fine,
      status: 'returned',
    }).eq('id', transactionId);
    await fetchAll();
    return fine;
  }, [transactions, books, fetchAll]);

  const stats = React.useMemo(() => {
    const activeLoans = transactions.filter(t => t.status === 'issued' || t.status === 'overdue').length;
    const overdueBooks = transactions.filter(t => t.status === 'overdue').length;
    const totalFines = transactions.reduce((sum, t) => sum + Number(t.fine_amount), 0);
    return {
      totalBooks: books.reduce((s, b) => s + b.total_copies, 0),
      totalMembers: members.filter(m => m.active).length,
      activeLoans,
      overdueBooks,
      totalFines,
    };
  }, [books, members, transactions]);

  return (
    <LibraryContext.Provider value={{
      books, members, transactions, authorsList, categoriesList, loading,
      getAuthor, getCategory, getBook, getMember,
      addBook, updateBook, deleteBook, addMember, addAuthor,
      issueBook, returnBook, refreshData: fetchAll, stats,
    }}>
      {children}
    </LibraryContext.Provider>
  );
}
