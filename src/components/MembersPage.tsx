import { useLibrary } from '@/context/LibraryContext';
import { Users } from 'lucide-react';

export default function MembersPage() {
  const { members } = useLibrary();

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      student: 'bg-info/10 text-info',
      faculty: 'bg-accent/10 text-accent-foreground',
      librarian: 'bg-primary/10 text-primary',
      admin: 'bg-destructive/10 text-destructive',
    };
    return colors[role] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-foreground">Members</h1>
        <p className="text-muted-foreground font-body mt-1">Registered library members</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map(m => (
          <div key={m.id} className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-display font-bold text-lg">
                {m.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold font-body text-foreground truncate">{m.name}</p>
                <p className="text-xs text-muted-foreground truncate">{m.email}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-body">
              <span className={`rounded-full px-2.5 py-0.5 font-medium capitalize ${roleBadge(m.role)}`}>{m.role}</span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground">{m.department}</span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground">Max: {m.maxBooks} books</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>Joined {m.joinDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
