import { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Library, LogIn, Eye, EyeOff, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegister) {
      const err = register(name.trim(), email.trim(), password, role);
      if (err) { setError(err); return; }
      setSuccess('Account created! You can now sign in.');
      setIsRegister(false);
      setName('');
      setPassword('');
    } else {
      const err = login(email.trim(), password);
      if (err) setError(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Library className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground">Vidya Pusthakalaya</h1>
          <p className="text-muted-foreground font-body mt-1">Library Management System — DBMS Project</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold font-display text-foreground">
            {isRegister ? 'Create Account' : 'Sign In'}
          </h2>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-2.5 text-sm text-destructive font-body">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-success/10 border border-success/20 px-4 py-2.5 text-sm text-success font-body">
              {success}
            </div>
          )}

          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground font-body">Full Name</label>
              <Input placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground font-body">Email</label>
            <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground font-body">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground font-body">Role</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body" value={role} onChange={e => setRole(e.target.value as UserRole)}>
                <option value="student">Student</option>
                <option value="librarian">Librarian</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <Button type="submit" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            {isRegister ? <><UserPlus className="h-4 w-4" /> Create Account</> : <><LogIn className="h-4 w-4" /> Sign In</>}
          </Button>

          <p className="text-center text-sm text-muted-foreground font-body">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }} className="text-primary font-medium hover:underline">
              {isRegister ? 'Sign In' : 'Create one'}
            </button>
          </p>
        </form>

        <p className="text-center text-[10px] text-muted-foreground font-body">DBMS Project · University Submission · 2026</p>
      </div>
    </div>
  );
}
