import { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { useAuth } from '@/context/AuthContext';
import { authors, categories } from '@/lib/store';
import { Book } from '@/lib/types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function BooksPage() {
  const { books, getAuthor, getCategory, addBook, updateBook, deleteBook } = useLibrary();
  const { hasAccess } = useAuth();
  const canManage = hasAccess(['admin', 'librarian']);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const emptyForm: Omit<Book, 'id'> = { isbn: '', title: '', authorId: 'a1', categoryId: 'c1', publisher: '', year: 2024, totalCopies: 1, availableCopies: 1, shelfLocation: '', addedDate: new Date().toISOString().split('T')[0] };
  const [form, setForm] = useState(emptyForm);

  const filtered = books.filter(b => {
    const q = search.toLowerCase();
    const author = getAuthor(b.authorId);
    const cat = getCategory(b.categoryId);
    return b.title.toLowerCase().includes(q) || author?.name.toLowerCase().includes(q) || cat?.name.toLowerCase().includes(q) || b.isbn.includes(q);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateBook(editId, form);
      toast.success('Book updated successfully');
    } else {
      addBook(form);
      toast.success('Book added successfully');
    }
    setForm(emptyForm);
    setShowForm(false);
    setEditId(null);
  };

  const handleEdit = (book: Book) => {
    setForm({ isbn: book.isbn, title: book.title, authorId: book.authorId, categoryId: book.categoryId, publisher: book.publisher, year: book.year, totalCopies: book.totalCopies, availableCopies: book.availableCopies, shelfLocation: book.shelfLocation, addedDate: book.addedDate });
    setEditId(book.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Books</h1>
          <p className="text-muted-foreground font-body mt-1">Manage the library catalogue</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Book'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input placeholder="ISBN" value={form.isbn} onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} required />
          <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm font-body" value={form.authorId} onChange={e => setForm(f => ({ ...f, authorId: e.target.value }))}>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm font-body" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Input placeholder="Publisher" value={form.publisher} onChange={e => setForm(f => ({ ...f, publisher: e.target.value }))} required />
          <Input type="number" placeholder="Year" value={form.year} onChange={e => setForm(f => ({ ...f, year: +e.target.value }))} required />
          <Input type="number" placeholder="Total Copies" value={form.totalCopies} onChange={e => setForm(f => ({ ...f, totalCopies: +e.target.value, availableCopies: +e.target.value }))} required min={1} />
          <Input placeholder="Shelf Location" value={form.shelfLocation} onChange={e => setForm(f => ({ ...f, shelfLocation: e.target.value }))} required />
          <Button type="submit" className="sm:col-span-2 lg:col-span-1 bg-primary text-primary-foreground hover:bg-primary/90">{editId ? 'Update' : 'Add'} Book</Button>
        </form>
      )}

      <Input placeholder="Search by title, author, category, or ISBN..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-md" />

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Author</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground hidden lg:table-cell">ISBN</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">Available</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground hidden lg:table-cell">Shelf</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(book => (
              <tr key={book.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{book.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{getAuthor(book.authorId)?.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{getCategory(book.categoryId)?.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell font-mono text-xs">{book.isbn}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${book.availableCopies > 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    {book.availableCopies}/{book.totalCopies}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{book.shelfLocation}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => handleEdit(book)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => { deleteBook(book.id); toast.success('Book deleted'); }} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8 font-body">No books found</p>}
      </div>
    </div>
  );
}
