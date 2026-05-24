import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Search, Plus, Filter, Book, Download, Send, X, GraduationCap, User, AlertCircle, ArrowRight, FileText, Trash2 } from "lucide-react";
import { db, auth } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../lib/AuthContext";
import { cn } from "../lib/utils";
import CustomSelect from "../components/CustomSelect";

interface Course {
  id: string;
  title: string;
  content: string;
  filiere: string;
  level: string;
  author: string;
  authorId: string;
  createdAt: any;
}

interface CommunityDoc {
  id: string;
  title: string;
  fileData: string;
  fileName: string;
  fileType: string;
  authorId: string;
  authorName: string;
  createdAt: any;
}

export default function Community() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [communityDocs, setCommunityDocs] = useState<CommunityDoc[]>([]);
  const [activeTab, setActiveTab] = useState<"courses" | "documents">("courses");
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  
  const [newCourse, setNewCourse] = useState({
    title: "",
    content: "",
    filiere: "Développement de l'IA",
    level: "1ère Année"
  });

  const [newDoc, setNewDoc] = useState({
    title: "",
    fileData: "",
    fileName: "",
    fileType: ""
  });

  useEffect(() => {
    const qCourses = query(collection(db, "courses"), orderBy("createdAt", "desc"));
    const unsubscribeCourses = onSnapshot(qCourses, (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
    }, (err) => {
      console.error(err);
      setError("Erreur de chargement des ressources.");
    });

    const qDocs = query(collection(db, "community_documents"), orderBy("createdAt", "desc"));
    const unsubscribeDocs = onSnapshot(qDocs, (snapshot) => {
      setCommunityDocs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityDoc)));
    }, (err) => {
      console.error(err);
    });

    return () => {
      unsubscribeCourses();
      unsubscribeDocs();
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("Fichier trop lourd (max 1.5Mo)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDoc(prev => ({ 
          ...prev, 
          fileData: reader.result as string,
          fileName: file.name,
          fileType: file.type
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPosting(true);
    setError(null);
    try {
      if (activeTab === "courses") {
        await addDoc(collection(db, "courses"), {
          ...newCourse,
          author: user.displayName || user.email?.split('@')[0] || "Membre Kendi",
          authorId: user.uid,
          createdAt: serverTimestamp()
        });
        setNewCourse({ title: "", content: "", filiere: "Développement de l'IA", level: "1ère Année" });
      } else {
        if (!newDoc.fileData) throw new Error("Fichier requis");
        await addDoc(collection(db, "community_documents"), {
          ...newDoc,
          authorId: user.uid,
          authorName: user.displayName || user.email?.split('@')[0] || "Membre Kendi",
          createdAt: serverTimestamp()
        });
        setNewDoc({ title: "", fileData: "", fileName: "", fileType: "" });
      }
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la publication.");
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    alert("🔒 Les documents partagés au sein de la communauté sont configurés comme étant permanents et insupprimables pour préserver le savoir collectif.");
  };

  const downloadFile = (fileData: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileData;
    link.download = fileName;
    link.click();
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.content.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || c.filiere === filter;
    return matchesSearch && matchesFilter;
  });

  const filteredDocs = communityDocs.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    d.fileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <Users size={32} />
              </div>
              <h1 className="text-3xl sm:text-6xl font-display font-black text-slate-900 leading-none uppercase tracking-tighter">
                Espace <br /><span className="text-primary italic">Communautaire</span>
              </h1>
            </div>
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setActiveTab("courses")}
                className={cn(
                  "px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all",
                  activeTab === "courses" ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-white text-slate-400 hover:text-slate-600 border border-slate-100"
                )}
              >
                Cours & Notes
              </button>
              <button 
                onClick={() => setActiveTab("documents")}
                className={cn(
                  "px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all",
                  activeTab === "documents" ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-white text-slate-400 hover:text-slate-600 border border-slate-100"
                )}
              >
                Documents & PDF
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-3 px-10 py-5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={20} />
            Partager {activeTab === "courses" ? "une ressource" : "un document"}
          </button>
        </div>

        {error && (
          <div className="mb-12 p-6 bg-red-50 text-red-600 rounded-3xl flex items-center gap-4 text-sm font-bold uppercase border border-red-100">
            <AlertCircle size={24} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="md:col-span-2 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={24} />
            <input 
              type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white rounded-[2rem] border-2 border-transparent focus:border-primary outline-none shadow-sm font-bold text-slate-900 transition-all"
            />
          </div>
          {activeTab === "courses" && (
            <CustomSelect
              value={filter}
              onChange={(val) => setFilter(val)}
              options={[
                { value: "all", label: "Toutes les filières" },
                { value: "Développement de l'IA", label: "Développement de l'IA" },
                { value: "Développement AI", label: "Développement AI" },
                { value: "Comptabilité et Gestion", label: "Comptabilité et Gestion" },
              ]}
              className="md:col-span-1"
            />
          )}
        </div>

        {activeTab === "courses" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  key={course.id}
                  className="bg-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border border-slate-100 hover:border-primary/20 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 group"
                >
                  <div className="flex items-center justify-between mb-8">
                    <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                      {course.filiere}
                    </span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      Niveau {course.level}
                    </span>
                  </div>

                  <h3 className="text-2xl font-display font-black text-slate-900 mb-6 group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-500 font-medium leading-relaxed mb-10 line-clamp-3">
                    {course.content}
                  </p>

                  <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-inner">
                        <User size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 leading-none mb-1 uppercase tracking-tighter">{course.author}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Membre vérifié</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                <Book size={80} className="mx-auto text-slate-100 mb-8" />
                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">Aucune ressource trouvée</h3>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((docItem, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  key={docItem.id}
                  className="bg-white p-6 rounded-3xl border border-slate-100 group relative overflow-hidden flex flex-col hover:shadow-xl transition-all"
                >
                  <div className="w-full aspect-[4/3] bg-slate-50 rounded-2xl mb-4 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    <FileText size={48} className="text-slate-200 group-hover:text-primary/40 transition-colors" />
                  </div>
                  <h3 className="font-display font-black uppercase text-sm text-slate-900 mb-1 truncate">{docItem.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate mb-4">{docItem.fileName}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[9px] font-black p-2 bg-slate-50 rounded-lg text-slate-500 uppercase">{docItem.authorName}</span>
                    <div className="flex gap-2">
                       {user?.uid === docItem.authorId && (
                         <button onClick={() => handleDeleteDoc(docItem.id)} className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                           <Trash2 size={16} />
                         </button>
                       )}
                       <button onClick={() => downloadFile(docItem.fileData, docItem.fileName)} className="p-2 bg-primary text-white rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-110 active:scale-90">
                         <Download size={16} />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                <FileText size={80} className="mx-auto text-slate-100 mb-8" />
                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">Aucun document partagé</h3>
              </div>
            )}
          </div>
        )}

        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-2xl bg-white rounded-[2.5rem] sm:rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-8 sm:p-12 overflow-y-auto max-h-[90vh]"
              >
                <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 p-2 text-slate-300 hover:text-slate-900 transition-colors z-20">
                  <X size={28} className="sm:size-8" />
                </button>

                <div className="text-center mb-8">
                   <h2 className="text-2xl sm:text-4xl font-display font-black text-slate-900 uppercase tracking-tighter">Partager {activeTab === "courses" ? "une ressource" : "un document"}</h2>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Diffusion de savoir académique</p>
                </div>

                <form onSubmit={handlePost} className="space-y-8">
                  {activeTab === "courses" ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filière concernée</label>
                          <CustomSelect
                            value={newCourse.filiere}
                            onChange={(val) => setNewCourse(prev => ({ ...prev, filiere: val }))}
                            options={[
                              { value: "Développement de l'IA", label: "Développement de l'IA" },
                              { value: "Développement AI", label: "Développement AI" },
                              { value: "Comptabilité et Gestion", label: "Comptabilité et Gestion" },
                            ]}
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Niveau d'études</label>
                          <CustomSelect
                            value={newCourse.level}
                            onChange={(val) => setNewCourse(prev => ({ ...prev, level: val }))}
                            options={[
                              { value: "1ère Année", label: "1ère Année" },
                              { value: "2ème Année", label: "2ème Année" },
                            ]}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre de la ressource</label>
                        <input 
                          type="text" required value={newCourse.title} onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Ex: Fondamentaux de Python"
                          className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl outline-none font-black text-slate-900 tracking-tight"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea 
                          required rows={6} value={newCourse.content} onChange={(e) => setNewCourse(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Décrivez votre ressource..."
                          className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl outline-none font-medium text-slate-600 resize-none leading-relaxed"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre du Document</label>
                        <input 
                          type="text" required value={newDoc.title} onChange={(e) => setNewDoc(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Ex: TD Algèbre Linéaire"
                          className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl outline-none font-black text-slate-900 tracking-tight"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fichier (PDF, Image...)</label>
                        <div className="relative group/doc">
                          <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <div className={cn(
                            "w-full h-40 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all",
                            newDoc.fileData ? 'border-primary bg-primary/5' : 'border-slate-100 bg-slate-50 group-hover/doc:border-primary group-hover/doc:bg-white'
                          )}>
                            <div className="p-4 bg-white rounded-2xl shadow-sm">
                              <FileText className={cn(newDoc.fileData ? 'text-primary' : 'text-slate-300')} size={32} />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {newDoc.fileName || "Cliquez pour sélectionner un fichier"}
                            </span>
                            {newDoc.fileName && <span className="text-[8px] text-primary font-bold">Fichier prêt !</span>}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <button type="submit" disabled={posting} className="w-full py-6 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
                    {posting ? "Patientez..." : (
                      <>Publier Maintenant <ArrowRight size={24} /></>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
