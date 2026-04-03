import { Book, Author, Category, Member, Transaction } from './types';

export const authors: Author[] = [
  { id: 'a1', name: 'R.K. Narayan', nationality: 'Indian' },
  { id: 'a2', name: 'Chetan Bhagat', nationality: 'Indian' },
  { id: 'a3', name: 'Amrita Pritam', nationality: 'Indian' },
  { id: 'a4', name: 'Rabindranath Tagore', nationality: 'Indian' },
  { id: 'a5', name: 'Premchand', nationality: 'Indian' },
  { id: 'a6', name: 'Vikram Seth', nationality: 'Indian' },
  { id: 'a7', name: 'Abraham Silberschatz', nationality: 'American' },
  { id: 'a8', name: 'Thomas H. Cormen', nationality: 'American' },
];

export const categories: Category[] = [
  { id: 'c1', name: 'Fiction', description: 'Novels and stories' },
  { id: 'c2', name: 'Computer Science', description: 'Programming, algorithms, databases' },
  { id: 'c3', name: 'Poetry', description: 'Poems and verse collections' },
  { id: 'c4', name: 'Philosophy', description: 'Philosophical texts' },
  { id: 'c5', name: 'History', description: 'Historical texts and references' },
];

export const initialBooks: Book[] = [
  { id: 'b1', isbn: '978-81-7167-000-1', title: 'Malgudi Days', authorId: 'a1', categoryId: 'c1', publisher: 'Indian Thought Publications', year: 1943, totalCopies: 5, availableCopies: 3, shelfLocation: 'A-101', addedDate: '2023-06-15' },
  { id: 'b2', isbn: '978-81-291-1382-3', title: 'Five Point Someone', authorId: 'a2', categoryId: 'c1', publisher: 'Rupa Publications', year: 2004, totalCopies: 8, availableCopies: 5, shelfLocation: 'A-102', addedDate: '2023-07-20' },
  { id: 'b3', isbn: '978-0-14-018668-2', title: 'Pinjar', authorId: 'a3', categoryId: 'c1', publisher: 'Tara Press', year: 1950, totalCopies: 3, availableCopies: 2, shelfLocation: 'A-103', addedDate: '2023-08-10' },
  { id: 'b4', isbn: '978-0-14-044116-6', title: 'Gitanjali', authorId: 'a4', categoryId: 'c3', publisher: 'Macmillan', year: 1910, totalCopies: 4, availableCopies: 4, shelfLocation: 'B-201', addedDate: '2023-09-05' },
  { id: 'b5', isbn: '978-81-267-0376-4', title: 'Godan', authorId: 'a5', categoryId: 'c1', publisher: 'Saraswati Press', year: 1936, totalCopies: 6, availableCopies: 1, shelfLocation: 'A-105', addedDate: '2023-10-12' },
  { id: 'b6', isbn: '978-0-14-028383-0', title: 'A Suitable Boy', authorId: 'a6', categoryId: 'c1', publisher: 'Penguin India', year: 1993, totalCopies: 3, availableCopies: 3, shelfLocation: 'A-106', addedDate: '2024-01-10' },
  { id: 'b7', isbn: '978-0-07-352332-3', title: 'Database System Concepts', authorId: 'a7', categoryId: 'c2', publisher: 'McGraw Hill', year: 2019, totalCopies: 10, availableCopies: 6, shelfLocation: 'C-301', addedDate: '2024-02-15' },
  { id: 'b8', isbn: '978-0-262-03384-8', title: 'Introduction to Algorithms', authorId: 'a8', categoryId: 'c2', publisher: 'MIT Press', year: 2009, totalCopies: 7, availableCopies: 4, shelfLocation: 'C-302', addedDate: '2024-03-01' },
];

export const initialMembers: Member[] = [
  { id: 'm1', name: 'Aarav Sharma', email: 'aarav.sharma@univ.ac.in', phone: '9876543210', role: 'student', department: 'Computer Science', joinDate: '2023-07-01', maxBooks: 3, active: true },
  { id: 'm2', name: 'Priya Patel', email: 'priya.patel@univ.ac.in', phone: '9876543211', role: 'student', department: 'Electronics', joinDate: '2023-07-15', maxBooks: 3, active: true },
  { id: 'm3', name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@univ.ac.in', phone: '9876543212', role: 'faculty', department: 'Computer Science', joinDate: '2022-01-10', maxBooks: 5, active: true },
  { id: 'm4', name: 'Sneha Gupta', email: 'sneha.gupta@univ.ac.in', phone: '9876543213', role: 'student', department: 'Mathematics', joinDate: '2023-08-01', maxBooks: 3, active: true },
  { id: 'm5', name: 'Amit Verma', email: 'amit.verma@univ.ac.in', phone: '9876543214', role: 'librarian', department: 'Library', joinDate: '2021-06-01', maxBooks: 10, active: true },
];

export const initialTransactions: Transaction[] = [
  { id: 't1', bookId: 'b1', memberId: 'm1', issueDate: '2026-03-10', dueDate: '2026-03-24', returnDate: '2026-03-22', fineAmount: 0, status: 'returned' },
  { id: 't2', bookId: 'b5', memberId: 'm2', issueDate: '2026-03-15', dueDate: '2026-03-29', returnDate: null, fineAmount: 25, status: 'overdue' },
  { id: 't3', bookId: 'b7', memberId: 'm1', issueDate: '2026-03-20', dueDate: '2026-04-03', returnDate: null, fineAmount: 0, status: 'issued' },
  { id: 't4', bookId: 'b2', memberId: 'm4', issueDate: '2026-03-01', dueDate: '2026-03-15', returnDate: '2026-03-18', fineAmount: 15, status: 'returned' },
  { id: 't5', bookId: 'b8', memberId: 'm3', issueDate: '2026-03-25', dueDate: '2026-04-08', returnDate: null, fineAmount: 0, status: 'issued' },
  { id: 't6', bookId: 'b1', memberId: 'm4', issueDate: '2026-03-18', dueDate: '2026-04-01', returnDate: null, fineAmount: 10, status: 'overdue' },
];
