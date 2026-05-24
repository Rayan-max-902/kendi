import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Instagram, Mail } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useTranslation } from "../../lib/LanguageContext";

export default function Footer() {
  const [appConfig, setAppConfig] = useState<{ logoUrl?: string; associationName?: string }>({
    associationName: "AL KENDI"
  });
  const { t } = useTranslation();

  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, "settings", "app"), (docSnap) => {
      if (docSnap.exists()) {
        setAppConfig(docSnap.data());
      }
    });
    return unsubConfig;
  }, []);

  return (
    <footer className="py-24 sm:py-32 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#0054A6_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest mb-10 text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {t("admissions_open")}
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black mb-12 uppercase tracking-tighter leading-none">
          {t("footer_adventure_title")} <br /> <span className="text-primary italic">{t("footer_adventure_subtitle")}</span>
        </h2>
        <Link to="/signup" className="inline-flex items-center gap-4 px-10 py-5 sm:px-14 sm:py-6 bg-primary hover:bg-primary-hover rounded-xl font-black text-lg sm:text-xl transition-all shadow-2xl shadow-primary/30 uppercase tracking-widest hover:scale-105 active:scale-95">
          {t("become_member")}
          <ArrowRight size={28} />
        </Link>
        
        <div className="mt-20 sm:mt-32 pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-primary overflow-hidden">
              {appConfig.logoUrl ? (
                <img src={appConfig.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <GraduationCap size={28} />
                </div>
              )}
            </div>
            <span className="font-display font-black text-2xl tracking-tight uppercase">{appConfig.associationName || "AL KENDI"}</span>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
              <Link to="/branches" className="hover:text-white transition-colors">{t("nav_branches")}</Link>
              <Link to="/announcements" className="hover:text-white transition-colors">{t("nav_announcements")}</Link>
              <Link to="/community" className="hover:text-white transition-colors">{t("nav_community")}</Link>
            </div>
            <div className="flex gap-6">
              <a href="https://www.instagram.com/ajk.officielle?igsh=MTJ4Y3I2c2RjMW9xbA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <Instagram size={16} className="text-primary" />
                Instagram
              </a>
              <a href="mailto:association.des.jeunes.alkendi@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={16} className="text-primary" />
                Contact
              </a>
            </div>
          </div>
          
          <div className="text-center md:text-right space-y-2">
            <p className="text-slate-500 text-[10px] font-medium uppercase tracking-[0.2em]">© {new Date().getFullYear()} {appConfig.associationName || "Al Kendi"}. {t("all_rights_reserved")}</p>
            <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em]">
              {t("created_by")} <span className="text-primary">Rayan El Moatadide</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
