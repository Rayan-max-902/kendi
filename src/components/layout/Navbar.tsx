import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Rocket, Bell, Users, GraduationCap, LogIn, LogOut, ShieldCheck, Globe } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import { useTranslation, Language } from "../../lib/LanguageContext";
import { auth, db } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { cn } from "../../lib/utils";

const ADMIN_EMAILS = ["moatadidrayan7@gmail.com", "elmoatadiderayan@gmail.com"];
const ADMIN_UIDS = ["448tPJFMzCX1Tiz6mWo1h4Y3ImZ2"];

interface NavItem {
  key: "nav_home" | "nav_announcements" | "nav_branches" | "nav_community";
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { key: "nav_home", path: "/", icon: <Rocket size={20} /> },
  { key: "nav_announcements", path: "/announcements", icon: <Bell size={20} /> },
  { key: "nav_branches", path: "/branches", icon: <GraduationCap size={20} /> },
  { key: "nav_community", path: "/community", icon: <Users size={20} /> },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [appConfig, setAppConfig] = useState<{ logoUrl?: string; associationName?: string }>({});
  const { user } = useAuth();
  const location = useLocation();
  const { t, language, setLanguage, isRtl } = useTranslation();

  const isAdmin = user && (ADMIN_UIDS.includes(user.uid) || (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())));

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, "settings", "app"), (docSnap) => {
      if (docSnap.exists()) {
        setAppConfig(docSnap.data());
      }
    });
    return () => unsubConfig();
  }, []);

  const languageOptions: { code: Language; label: string; flag: string }[] = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "ar", label: "العربية", flag: "🇲🇦" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-transform overflow-hidden">
              {appConfig.logoUrl ? (
                <img src={appConfig.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                  <GraduationCap size={26} />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl leading-none text-slate-900 tracking-tight uppercase">
                {appConfig.associationName || "AL KENDI"}
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-bold">{t("association")}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "text-sm font-bold transition-all hover:text-primary relative group py-2",
                  location.pathname === item.path ? "text-primary" : "text-slate-600"
                )}
              >
                {t(item.key)}
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
                {t("nav_admin")}
              </Link>
            )}
          </div>

          {/* Language Switcher & Auth Buttons */}
          <div className="hidden md:flex items-center gap-6">
            {/* Language Switch pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              {languageOptions.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => setLanguage(opt.code)}
                  className={cn(
                    "text-[11px] font-black px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1",
                    language === opt.code
                      ? "bg-slate-900 text-white shadow"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                  )}
                >
                  <span className="text-[14px]">{opt.flag}</span>
                  <span>{opt.label.substring(0, 3).toUpperCase()}</span>
                </button>
              ))}
            </div>

            {user ? (
              <button 
                onClick={() => signOut(auth)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-100 transition-all hover:border-primary/20"
              >
                <LogOut size={18} />
                <span>{t("nav_logout")}</span>
              </button>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-sm font-bold text-slate-600 hover:text-primary transition-colors animate-fade-in"
                >
                  {t("nav_login")}
                </Link>
                <Link 
                  to="/signup"
                  className="px-7 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
                >
                  {t("nav_register")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle & Select */}
          <div className="md:hidden flex items-center gap-4">
            {/* Tiny language switcher for topbar on mobile */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-xs font-bold border border-slate-200 rounded-lg p-1.5 pr-2 bg-slate-50 text-slate-800 outline-none"
            >
              <option value="fr">🇫🇷 FR</option>
              <option value="en">🇺🇸 EN</option>
              <option value="ar">🇲🇦 AR</option>
            </select>

            <button 
              className="text-slate-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
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
                  {t(item.key)}
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
                  {t("nav_admin")}
                </Link>
              )}
              <hr className="border-slate-100" />
              {user ? (
                <button 
                  onClick={() => signOut(auth)}
                  className="flex items-center gap-4 text-primary font-bold text-lg w-full text-left"
                >
                  <div className="p-2 bg-primary/5 rounded-lg">
                    <LogOut size={20} />
                  </div>
                  {t("nav_logout")}
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
                    {t("nav_login")}
                  </Link>
                  <Link 
                    to="/signup"
                    className="w-full py-4 bg-primary text-white text-center rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    {t("nav_register")}
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
