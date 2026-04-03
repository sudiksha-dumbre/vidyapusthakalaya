import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, BookOpen, Users, ArrowRightLeft, Menu, Library, LogOut, Shield } from 'lucide-react';

const allLinks = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'librarian', 'student'] as const },
  { to: '/books', icon: BookOpen, label: 'Books', roles: ['admin', 'librarian', 'student'] as const },
  { to: '/members', icon: Users, label: 'Members', roles: ['admin', 'librarian'] as const },
  { to: '/transactions', icon: ArrowRightLeft, label: 'Transactions', roles: ['admin', 'librarian', 'student'] as const },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, hasAccess } = useAuth();

  const visibleLinks = allLinks.filter(l => hasAccess([...l.roles]));

  const roleBadgeColor: Record<string, string> = {
    admin: 'bg-destructive/10 text-destructive',
    librarian: 'bg-primary/10 text-primary',
    student: 'bg-info/10 text-info',
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-sidebar border-r border-sidebar-border transition-transform duration-200 lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
          <Library className="h-7 w-7 text-sidebar-primary" />
          <div>
            <h2 className="text-base font-bold font-display text-sidebar-foreground leading-tight">Vidya Pusthakalaya</h2>
            <p className="text-[10px] text-sidebar-foreground/60 font-body">Library Management System</p>
          </div>
        </div>
        <nav className="mt-4 px-3 space-y-1">
          {visibleLinks.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-body transition-colors ${
                  isActive ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* User info & logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border space-y-3">
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground font-display font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
                <span className={`inline-block mt-0.5 rounded-full px-1.5 py-0 text-[10px] font-medium capitalize ${roleBadgeColor[user.role] || ''}`}>{user.role}</span>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium font-body text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && <div className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-sm px-4 lg:px-8">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden rounded-md p-2 text-muted-foreground hover:bg-muted">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          {user && (
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-body capitalize">{user.role} · {user.name}</span>
            </div>
          )}
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
