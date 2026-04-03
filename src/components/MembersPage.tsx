import { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { useAuth } from '@/context/AuthContext';
import { Member } from '@/lib/types';
import { Users, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function MembersPage() {
  const { members, addMember } = useLibrary();
  const { hasAccess } = useAuth();
  const canManage = hasAccess(['admin']);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'student' as Member['role'], department: '', maxBooks: 3 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMember({ ...form, joinDate: new Date().toISOString().split('T')[0], active: true, id: '' } as any);
    toast.success('Member added');
    setForm({ name: '', email: '', phone: '', role: 'student', department: '', maxBooks: 3 });
    setShowForm(false);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Members</h1>
          <p className="text-muted-foreground font-body mt-1">Registered library members</p>
        </div>
        {canManage && (
          <Button onClick={() => setShowForm(!showForm)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'Add Member'}
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <Input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm font-body" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Member['role'] }))}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="librarian">Librarian</option>
            <option value="admin">Admin</option>
          </select>
          <Input placeholder="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required />
          <Input type="number" placeholder="Max Books" value={form.maxBooks} onChange={e => setForm(f => ({ ...f, maxBooks: +e.target.value }))} min={1} max={10} required />
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Add Member</Button>
        </form>
      )}

      {members.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-body">No members yet. Add your first member above.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
