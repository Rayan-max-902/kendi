import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Rocket, Bell, Users, GraduationCap, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { cn } from "../../lib/utils";

const ADMIN_EMAILS = ["moatadidrayan7@gmail.com", "elmoatadiderayan@gmail.com"];
const ADMIN_UIDS = ["448tPJFMzCX1Tiz6mWo1h4Y3ImZ2"];

const navItems = [
  { name: "Accueil", path: "/", icon: <Rocket size={20} /> },
  { name: "Annonces", path: "/announcements", icon: <Bell size={20} /> },
  { name: "Filières", path: "/branches", icon: <GraduationCap size={20} /> },
  { name: "Communauté", path: "/community", icon: <Users size={20} /> },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isAdmin = user && (ADMIN_UIDS.includes(user.uid) || (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())));

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <GraduationCap size={26} />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl leading-none text-slate-900 tracking-tight">AL KENDI</span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-bold">Association</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "text-sm font-bold transition-all hover:text-primary relative group py-2",
                  location.pathname === item.path ? "text-primary" : "text-slate-600"
                )}
              >
                {item.name}
                <span className={cn(
                  "absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full",
                  location.pathname === item.path ? "w-full" : ""
                )} />
              </Link>
            ))}
            {isAdmin && (
              <Link 
                to="/admin"
                className={cn(
                  "text-sm font-bold transition-all hover:text-primary relative group py-2 flex items-center gap-2",
                  location.pathname === "/admin" ? "text-primary" : "text-primary/70"
                )}
              >
                <ShieldCheck size={16} />
                Admin
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <button 
                onClick={() => signOut(auth)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-100 transition-all hover:border-primary/20"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-sm font-bold text-slate-600 hover:text-primary transition-colors"
                >
                  Connexion
                </Link>
                <Link 
                  to="/signup"
                  className="px-7 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-primary/20 overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className="flex items-center gap-4 text-slate-800 font-bold text-lg"
                >
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <Link 
                  to="/admin"
                  className="flex items-center gap-4 text-primary font-bold text-lg"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShieldCheck size={20} />
                  </div>
                  Admin
                </Link>
              )}
              <hr className="border-slate-100" />
              {user ? (
                <button 
                  onClick={() => signOut(auth)}
                  className="flex items-center gap-4 text-primary font-bold text-lg"
                >
                  <div className="p-2 bg-primary/5 rounded-lg">
                    <LogOut size={20} />
                  </div>
                  Déconnexion
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link 
                    to="/login"
                    className="flex items-center gap-4 text-slate-800 font-bold text-lg"
                  >
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <LogIn size={20} />
                    </div>
                    Connexion
                  </Link>
                  <Link 
                    to="/signup"
                    className="w-full py-4 bg-primary text-white text-center rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
