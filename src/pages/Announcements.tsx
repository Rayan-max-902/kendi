import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Calendar, ChevronRight, Trash2 } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../lib/AuthContext";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  status?: "En cours" | "Terminé";
  images?: string[];
  videos?: string[];
  author?: string;
}

export default function Announcements() {
  const { user } = useAuth();
  const isAdmin = user && (user.uid === "448tPJFMzCX1Tiz6mWo1h4Y3ImZ2" || (user.email && ["moatadidrayan7@gmail.com", "elmoatadiderayan@gmail.com"].includes(user.email.toLowerCase())));
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
      try {
        await deleteDoc(doc(db, "announcements", id));
        alert("Annonce supprimée.");
      } catch (err) {
        console.error("Error deleting announcement:", err);
        alert("Erreur lors de la suppression.");
      }
    }
  };

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
                key={ann.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="group relative bg-slate-50 rounded-[3rem] p-8 sm:p-14 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden"
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
                  <div className="flex items-center gap-4">
                    {ann.author && (
                      <div className="text-[10px] font-black text-primary uppercase tracking-widest border-b-2 border-primary/20 pb-1">
                        Réalisé par : {ann.author}
                      </div>
                    )}
                    {isAdmin && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ann.id);
                        }}
                        className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-md active:scale-90 border-2 border-red-100 flex items-center justify-center group/del"
                        title="Supprimer Définitivement (Admin)"
                      >
                        <Trash2 size={20} className="group-hover/del:animate-bounce" />
                      </button>
                    )}
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

                <AnimatePresence>
                  {expandedId === ann.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-12 space-y-12">
                        {ann.images && ann.images.length > 0 && (
                          <div className={`grid gap-4 ${ann.images.length === 1 ? 'grid-cols-1' : ann.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
                            {ann.images.map((img, idx) => (
                              <div key={idx} className="rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-slate-100 aspect-[4/3]">
                                <img src={img} alt={`${ann.title} ${idx}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {ann.videos && ann.videos.length > 0 && (
                          <div className="grid gap-8">
                            {ann.videos.map((vid, idx) => (
                              <div key={idx} className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-black aspect-video max-w-3xl mx-auto w-full">
                                {vid.includes('youtube.com') || vid.includes('youtu.be') ? (
                                  <iframe 
                                    src={`https://www.youtube.com/embed/${vid.match(/(?:v=|\/|embed\/)([0-9A-Za-z_-]{11})/)?.[1]}`}
                                    className="w-full h-full"
                                    allowFullScreen
                                  />
                                ) : (
                                  <video src={vid} controls className="w-full h-full object-contain" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  onClick={() => setExpandedId(expandedId === ann.id ? null : ann.id)}
                  className="w-full mt-12 pt-10 border-t border-slate-100 flex items-center justify-between group/btn"
                >
                   <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] group-hover/btn:text-primary transition-colors">
                     {expandedId === ann.id ? "Réduire les détails" : "Communiqué Officiel Al Kendi"}
                   </div>
                   <ChevronRight className={`text-primary transition-transform duration-300 ${expandedId === ann.id ? "rotate-90" : "group-hover/btn:translate-x-3"}`} size={24} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
