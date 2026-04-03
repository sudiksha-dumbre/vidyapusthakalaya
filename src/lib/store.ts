import { Book, Author, Category, Member, Transaction } from './types';

export const authors: Author[] = [];

export const categories: Category[] = [
  { id: 'c1', name: 'Fiction', description: 'Novels and stories' },
  { id: 'c2', name: 'Computer Science', description: 'Programming, algorithms, databases' },
  { id: 'c3', name: 'Poetry', description: 'Poems and verse collections' },
  { id: 'c4', name: 'Philosophy', description: 'Philosophical texts' },
  { id: 'c5', name: 'History', description: 'Historical texts and references' },
];

export const initialBooks: Book[] = [];

export const initialMembers: Member[] = [];

export const initialTransactions: Transaction[] = [];
