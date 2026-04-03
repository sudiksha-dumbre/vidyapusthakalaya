import { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Library, LogIn, Eye, EyeOff } from 'lucide-react';

const DEMO_CREDS: { role: string; email: string; password: string; access: string }[] = [
  { role: 'Admin', email: 'admin@library.in', password: 'admin123', access: 'Full system access' },
  { role: 'Librarian', email: 'librarian@library.in', password: 'lib123', access: 'Manage books & transactions' },
  { role: 'Student', email: 'student@library.in', password: 'stu123', access: 'Browse catalogue & view loans' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const err = login(email.trim(), password);
    if (err) setError(err);
  };

  const quickLogin = (cred: typeof DEMO_CREDS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
    const err = login(cred.email, cred.password);
    if (err) setError(err);
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold font-display text-foreground">Sign In</h2>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-2.5 text-sm text-destructive font-body">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground font-body">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <LogIn className="h-4 w-4" /> Sign In
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold font-display text-foreground">Demo Accounts</h3>
          <p className="text-xs text-muted-foreground font-body">Click to auto-login with a role:</p>
          <div className="space-y-2">
            {DEMO_CREDS.map(cred => (
              <button
                key={cred.role}
                onClick={() => quickLogin(cred)}
                className="w-full flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3 text-left hover:bg-muted/60 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium font-body text-foreground group-hover:text-primary transition-colors">{cred.role}</p>
                  <p className="text-xs text-muted-foreground">{cred.access}</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{cred.email}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground font-body">DBMS Project · University Submission · 2026</p>
      </div>
    </div>
  );
}
