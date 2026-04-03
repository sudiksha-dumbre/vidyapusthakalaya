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
  accounts: (User & { password: string })[];
  login: (email: string, password: string) => string | null;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => string | null;
  isAuthenticated: boolean;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<(User & { password: string })[]>([
    { id: 'm5', name: 'Amit Verma', email: 'admin@library.in', password: 'admin123', role: 'admin' },
    { id: 'm6', name: 'Kavita Singh', email: 'librarian@library.in', password: 'lib123', role: 'librarian' },
    { id: 'm1', name: 'Aarav Sharma', email: 'student@library.in', password: 'stu123', role: 'student' },
  ]);

  const login = useCallback((email: string, password: string): string | null => {
    const found = accounts.find(u => u.email === email && u.password === password);
    if (!found) return 'Invalid email or password';
    const { password: _, ...userData } = found;
    setUser(userData);
    return null;
  }, [accounts]);

  const register = useCallback((name: string, email: string, password: string, role: UserRole): string | null => {
    if (accounts.find(a => a.email === email)) return 'Email already registered';
    if (password.length < 4) return 'Password must be at least 4 characters';
    const newUser = { id: `u${Date.now()}`, name, email, role, password };
    setAccounts(prev => [...prev, newUser]);
    return null;
  }, [accounts]);

  const logout = useCallback(() => setUser(null), []);

  const hasAccess = useCallback((requiredRoles: UserRole[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, accounts, login, logout, register, isAuthenticated: !!user, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}
