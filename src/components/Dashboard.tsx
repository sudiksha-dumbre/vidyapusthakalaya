import { useLibrary } from '@/context/LibraryContext';
import { formatRupees } from '@/lib/types';
import { BookOpen, Users, ArrowRightLeft, AlertTriangle, IndianRupee } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
  <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground font-body">{label}</p>
        <p className="text-2xl font-bold font-display text-foreground">{value}</p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { stats, transactions, getBook, getMember } = useLibrary();

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime()).slice(0, 5);

  const overdueList = transactions.filter(t => t.status === 'overdue');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="text-muted-foreground font-body mt-1">Overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={BookOpen} label="Total Books" value={stats.totalBooks} color="bg-primary/10 text-primary" />
        <StatCard icon={Users} label="Active Members" value={stats.totalMembers} color="bg-info/10 text-info" />
        <StatCard icon={ArrowRightLeft} label="Active Loans" value={stats.activeLoans} color="bg-accent/10 text-accent-foreground" />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdueBooks} color="bg-destructive/10 text-destructive" />
        <StatCard icon={IndianRupee} label="Total Fines" value={formatRupees(stats.totalFines)} color="bg-warning/10 text-warning" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold font-display text-foreground mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {recentTransactions.length === 0 && <p className="text-muted-foreground font-body text-sm">No transactions yet</p>}
            {recentTransactions.map(tx => {
              const book = getBook(tx.book_id);
              const member = getMember(tx.member_id);
              return (
                <div key={tx.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <div>
                    <p className="font-medium font-body text-foreground text-sm">{book?.title}</p>
                    <p className="text-xs text-muted-foreground">{member?.name} · {tx.issue_date}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    tx.status === 'returned' ? 'bg-success/10 text-success' :
                    tx.status === 'overdue' ? 'bg-destructive/10 text-destructive' :
                    'bg-info/10 text-info'
                  }`}>{tx.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold font-display text-foreground mb-4">Overdue Books</h2>
          {overdueList.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm">No overdue books 🎉</p>
          ) : (
            <div className="space-y-3">
              {overdueList.map(tx => {
                const book = getBook(tx.book_id);
                const member = getMember(tx.member_id);
                return (
                  <div key={tx.id} className="flex items-center justify-between rounded-lg bg-destructive/5 border border-destructive/10 px-4 py-3">
                    <div>
                      <p className="font-medium font-body text-foreground text-sm">{book?.title}</p>
                      <p className="text-xs text-muted-foreground">{member?.name} · Due: {tx.due_date}</p>
                    </div>
                    <span className="text-sm font-semibold text-destructive">{formatRupees(Number(tx.fine_amount))}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
