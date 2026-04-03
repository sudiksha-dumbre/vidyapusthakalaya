import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'admin' | 'librarian' | 'student';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  isAuthenticated: boolean;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

// Demo credentials for academic submission
const DEMO_USERS: (User & { password: string })[] = [
  { id: 'm5', name: 'Amit Verma', email: 'admin@library.in', password: 'admin123', role: 'admin' },
  { id: 'm6', name: 'Kavita Singh', email: 'librarian@library.in', password: 'lib123', role: 'librarian' },
  { id: 'm1', name: 'Aarav Sharma', email: 'student@library.in', password: 'stu123', role: 'student' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, password: string): string | null => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!found) return 'Invalid email or password';
    const { password: _, ...userData } = found;
    setUser(userData);
    return null;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const hasAccess = useCallback((requiredRoles: UserRole[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}
