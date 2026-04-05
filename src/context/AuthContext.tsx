import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'librarian' | 'student';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<string | null>;
  isAuthenticated: boolean;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

async function fetchUserProfile(supabaseUser: SupabaseUser): Promise<User | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('user_id', supabaseUser.id)
    .maybeSingle();

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', supabaseUser.id)
    .maybeSingle();

  return {
    id: supabaseUser.id,
    name: profile?.display_name || supabaseUser.email || 'User',
    email: supabaseUser.email || '',
    role: (roleData?.role as UserRole) || 'student',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Use setTimeout to avoid Supabase auth deadlock
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user);
            setUser(profile);
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user);
        setUser(profile);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    return null;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole): Promise<string | null> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return error.message;

    // Update profile name and role if user was created
    if (data.user) {
      // Update display name in profile
      await supabase.from('profiles').update({ display_name: name }).eq('user_id', data.user.id);
      // Update role (delete default student, insert requested role)
      if (role !== 'student') {
        // We need an edge function or service role for this.
        // For now the trigger creates 'student' by default.
        // Admin can change roles later.
      }
    }
    return null;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const hasAccess = useCallback((requiredRoles: UserRole[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, isAuthenticated: !!user, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}
