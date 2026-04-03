import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LibraryProvider } from "@/context/LibraryContext";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/components/Dashboard";
import BooksPage from "@/components/BooksPage";
import MembersPage from "@/components/MembersPage";
import TransactionsPage from "@/components/TransactionsPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <LibraryProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </LibraryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
