
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import AdminDashboard from "./components/admin/AdminDashboard";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import FormBuilder from "./components/admin/FormBuilder";
import FeedbackFormViewer from "./components/employee/FeedbackFormViewer";
import Analytics from "./components/admin/analytics/Analytics";
import SessionAnalytics from "./components/admin/analytics/SessionAnalytics";
import NotFound from "./pages/NotFound";
import { useState } from 'react';

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Login setUser={setUser} />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/signup" element={<Signup setUser={setUser} />} />
              <Route path="/admin/dashboard" element={<AdminDashboard user={user} />} />
              <Route path="/admin/forms" element={<FormBuilder />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/employee/dashboard" element={<EmployeeDashboard user={user} />} />
              <Route path="/admin/analytics/:formId" element={<SessionAnalytics />} />
              <Route path="/employee/feedback/:id" element={<FeedbackFormViewer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
