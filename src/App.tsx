import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LibraryProvider } from "@/context/LibraryContext";
import { AuthProvider, useAuth, UserRole } from "@/context/AuthContext";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/components/Dashboard";
import BooksPage from "@/components/BooksPage";
import MembersPage from "@/components/MembersPage";
import TransactionsPage from "@/components/TransactionsPage";
import LoginPage from "@/components/LoginPage";
import NotFound from "./pages/NotFound.tsx";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles: UserRole[] }) {
  const { isAuthenticated, hasAccess } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasAccess(roles)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <LibraryProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/members" element={<ProtectedRoute roles={['admin', 'librarian']}><MembersPage /></ProtectedRoute>} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </LibraryProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
