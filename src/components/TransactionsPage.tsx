import { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { formatRupees } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowRightLeft, RotateCcw } from 'lucide-react';

export default function TransactionsPage() {
  const { transactions, books, members, getBook, getMember, issueBook, returnBook } = useLibrary();
  const [showIssue, setShowIssue] = useState(false);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');

  const handleIssue = async () => {
    if (!selectedBook || !selectedMember) { toast.error('Select book and member'); return; }
    const err = await issueBook(selectedBook, selectedMember);
    if (err) { toast.error(err); return; }
    toast.success('Book issued successfully');
    setShowIssue(false);
    setSelectedBook('');
    setSelectedMember('');
  };

  const handleReturn = async (txId: string) => {
    const fine = await returnBook(txId);
    if (fine > 0) toast.info(`Book returned. Fine: ${formatRupees(fine)}`);
    else toast.success('Book returned. No fine.');
  };

  const sorted = [...transactions].sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Transactions</h1>
          <p className="text-muted-foreground font-body mt-1">Issue & return books, track fines in ₹</p>
        </div>
        <Button onClick={() => setShowIssue(!showIssue)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <ArrowRightLeft className="h-4 w-4" /> {showIssue ? 'Cancel' : 'Issue Book'}
        </Button>
      </div>

      {showIssue && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-medium text-muted-foreground font-body mb-1 block">Book</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body" value={selectedBook} onChange={e => setSelectedBook(e.target.value)}>
              <option value="">Select a book</option>
              {books.filter(b => b.available_copies > 0).map(b => <option key={b.id} value={b.id}>{b.title} ({b.available_copies} avail.)</option>)}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs font-medium text-muted-foreground font-body mb-1 block">Member</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body" value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
              <option value="">Select a member</option>
              {members.filter(m => m.active).map(m => <option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
            </select>
          </div>
          <Button onClick={handleIssue} className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">Confirm Issue</Button>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Book</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Member</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">Issued</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">Due</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground hidden lg:table-cell">Returned</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Fine</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(tx => (
              <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{getBook(tx.book_id)?.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{getMember(tx.member_id)?.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{tx.issue_date}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{tx.due_date}</td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{tx.return_date || '—'}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">{Number(tx.fine_amount) > 0 ? formatRupees(Number(tx.fine_amount)) : '—'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    tx.status === 'returned' ? 'bg-success/10 text-success' :
                    tx.status === 'overdue' ? 'bg-destructive/10 text-destructive' :
                    'bg-info/10 text-info'
                  }`}>{tx.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {tx.status !== 'returned' && (
                    <button onClick={() => handleReturn(tx.id)} className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                      <RotateCcw className="h-3 w-3" /> Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
