/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Announcements from "./pages/Announcements";
import Community from "./pages/Community";
import Branches from "./pages/Branches";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import AIChat from "./components/AIChat";
import { OsmoLoader } from "./components/OsmoLoader";
import { AnimatePresence } from "motion/react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const hasSeenLoader = sessionStorage.getItem("hasSeenAlKendiLoader");
    if (!hasSeenLoader) {
      setShowLoader(true);
      sessionStorage.setItem("hasSeenAlKendiLoader", "true");
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
          <AnimatePresence>
            {showLoader && <OsmoLoader onComplete={() => setShowLoader(false)} />}
          </AnimatePresence>
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<Admin />} />
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <AIChat />
        </div>
      </Router>
    </AuthProvider>
  );
}
