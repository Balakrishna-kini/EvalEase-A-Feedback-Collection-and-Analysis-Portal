
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
import LandingPage from "./pages/LandingPage";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ThemeProvider } from './context/ThemeContext';

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("employeeId");
    localStorage.removeItem("userType");
    localStorage.removeItem("employeeName");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/signup" element={<Signup setUser={setUser} />} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute user={user} allowedRole="admin">
                    <AdminDashboard user={user} onLogout={handleLogout} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/forms" 
                element={
                  <ProtectedRoute user={user} allowedRole="admin">
                    <FormBuilder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute user={user} allowedRole="admin">
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/analytics/:formId" 
                element={
                  <ProtectedRoute user={user} allowedRole="admin">
                    <SessionAnalytics />
                  </ProtectedRoute>
                } 
              />

              {/* Employee Routes */}
              <Route 
                path="/employee/dashboard" 
                element={
                  <ProtectedRoute user={user} allowedRole="employee">
                    <EmployeeDashboard user={user} onLogout={handleLogout} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/employee/feedback/:id" 
                element={
                  <ProtectedRoute user={user} allowedRole="employee">
                    <FeedbackFormViewer />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
