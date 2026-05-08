import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bell, Calendar, ChevronRight } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../lib/AuthContext";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  status?: "En cours" | "Terminé";
  imageUrl?: string;
  videoUrl?: string;
}

export default function Announcements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("date", "desc"));
    return onSnapshot(q, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="py-32 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
              <Bell size={32} />
            </div>
            <h1 className="text-5xl sm:text-6xl font-display font-black text-slate-900 leading-none uppercase tracking-tighter">Journal & <br /> <span className="text-primary italic">Actualités</span></h1>
          </div>
          <p className="text-slate-500 text-xl font-medium uppercase tracking-tight">Vivez les moments forts de l'Association Al Kendi au quotidien.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-12">
            {announcements.map((ann, i) => (
              <motion.div 
                key={ann.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative bg-slate-50 rounded-[3rem] p-10 sm:p-16 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-10">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="px-5 py-2 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                      {ann.category}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <Calendar size={14} className="text-primary" />
                      {new Date(ann.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 group-hover:text-primary transition-colors mb-8 leading-tight uppercase tracking-tight">
                  {ann.title}
                </h2>

                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 text-lg sm:text-xl leading-relaxed font-medium">
                    {ann.content}
                  </p>
                </div>

                <div className="mt-12 pt-10 border-t border-slate-100 flex items-center justify-between">
                   <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Communiqué Officiel Al Kendi</div>
                   <ChevronRight className="text-primary group-hover:translate-x-3 transition-transform" size={24} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
