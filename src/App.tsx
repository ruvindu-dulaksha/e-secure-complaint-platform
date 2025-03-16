import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { Layout } from "./components/layout/Layout";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ContactUs from "./pages/Contact";
import FAQs from "./pages/FAQs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import Profile from "./pages/Profile";
import { OTPEntenter } from "./pages/OTPEntenter"; // Import OTP page

import { ProtectedRoute } from "./components/ProtectedRoute"; 

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <Layout>
            <TooltipProvider>
              <Toaster />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/enter-otp" element={<OTPEntenter />} /> {/* Add OTP page route */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["user", "manager", "admin"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager"
                  element={
                    <ProtectedRoute allowedRoles={["manager", "admin"]}>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={["user", "manager", "admin"]}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </TooltipProvider>
          </Layout>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
