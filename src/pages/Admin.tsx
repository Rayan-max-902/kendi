import React, { useState, useEffect } from "react";
import { db, auth } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { useAuth } from "../lib/AuthContext";
import { Navigate } from "react-router-dom";
import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon, Building2, Megaphone, MessageSquare, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Admin UIDs and emails (same as firestore.rules)
const ADMIN_EMAILS = ["moatadidrayan7@gmail.com", "elmoatadiderayan@gmail.com"];
const ADMIN_UIDS = ["448tPJFMzCX1Tiz6mWo1h4Y3ImZ2"];

export default function Admin() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"announcements" | "partners" | "testimonials" | "community" | "config">("announcements");
  
  const [partners, setPartners] = useState<any[]>([]);
  const [newPartner, setNewPartner] = useState({ name: "", logoUrl: "", websiteUrl: "" });
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ 
    title: "", 
    content: "", 
    category: "Nouveauté", 
    images: [] as string[], 
    videos: [] as string[], 
    author: "",
    manualDate: "" 
  });
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [communityDocs, setCommunityDocs] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState({ videoUrl: "", imageUrl: "" });
  const [appConfig, setAppConfig] = useState({ logoUrl: "", associationName: "Al Kendi" });
  const [updatingConfig, setUpdatingConfig] = useState(false);

  const isAdmin = user && (ADMIN_UIDS.includes(user.uid) || (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())));

  useEffect(() => {
    if (!isAdmin) return;

    const qPartners = query(collection(db, "partners"), orderBy("createdAt", "desc"));
    const unsubscribePartners = onSnapshot(qPartners, (snapshot) => {
      setPartners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qAnnouncements = query(collection(db, "announcements"), orderBy("date", "desc"));
    const unsubscribeAnnouncements = onSnapshot(qAnnouncements, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qTestimonials = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
    const unsubscribeTestimonials = onSnapshot(qTestimonials, (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qCourses = query(collection(db, "courses"), orderBy("createdAt", "desc"));
    const unsubscribeCourses = onSnapshot(qCourses, (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qDocs = query(collection(db, "community_documents"), orderBy("createdAt", "desc"));
    const unsubscribeDocs = onSnapshot(qDocs, (snapshot) => {
      setCommunityDocs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubHero = onSnapshot(doc(db, "settings", "hero"), (docSnap) => {
      if (docSnap.exists()) {
        setHeroSettings(docSnap.data() as any);
      }
    });

    const unsubConfig = onSnapshot(doc(db, "settings", "app"), (docSnap) => {
      if (docSnap.exists()) {
        setAppConfig(docSnap.data() as any);
      }
    });

    return () => {
      unsubscribePartners();
      unsubscribeAnnouncements();
      unsubscribeTestimonials();
      unsubscribeCourses();
      unsubscribeDocs();
      unsubHero();
      unsubConfig();
    };
  }, [isAdmin]);

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/" />;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'partner' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("L'image est trop lourde (max 1Mo)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'partner') {
          setNewPartner(prev => ({ ...prev, logoUrl: reader.result as string }));
        } else {
          setAppConfig(prev => ({ ...prev, logoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.logoUrl) {
      alert("Veuillez sélectionner un logo");
      return;
    }
    try {
      await addDoc(collection(db, "partners"), {
        ...newPartner,
        createdAt: serverTimestamp()
      });
      setNewPartner({ name: "", logoUrl: "", websiteUrl: "" });
    } catch (error) {
      console.error("Error adding partner:", error);
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (window.confirm("Supprimer ce partenaire ?")) {
      await deleteDoc(doc(db, "partners", id));
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "announcements"), {
        ...newAnnouncement,
        date: newAnnouncement.manualDate || new Date().toISOString(),
        createdAt: serverTimestamp()
      });
      setNewAnnouncement({ 
        title: "", 
        content: "", 
        category: "Nouveauté", 
        images: [], 
        videos: [], 
        author: "",
        manualDate: "" 
      });
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingConfig(true);
    try {
      const { setDoc } = await import("firebase/firestore");
      
      // Update Hero
      await setDoc(doc(db, "settings", "hero"), {
        ...heroSettings,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Update App General Config
      await setDoc(doc(db, "settings", "app"), {
        ...appConfig,
        updatedAt: serverTimestamp()
      }, { merge: true });

      alert("Paramètres mis à jour !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour.");
    } finally {
      setUpdatingConfig(false);
    }
  };

  const handleAnnouncementFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert("Le fichier est trop lourd (max 2Mo)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setNewAnnouncement(prev => ({ 
        ...prev, 
        [type === 'image' ? 'images' : 'videos']: [...(type === 'image' ? prev.images : prev.videos), result]
      }));
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = "";
  };

  const removeMedia = (index: number, type: 'image' | 'video') => {
    setNewAnnouncement(prev => ({
      ...prev,
      [type === 'image' ? 'images' : 'videos']: (type === 'image' ? prev.images : prev.videos).filter((_, i) => i !== index)
    }));
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!id) return;
    if (window.confirm("Supprimer cette annonce ?")) {
      try {
        await deleteDoc(doc(db, "announcements", id));
        alert("Annonce supprimée !");
      } catch (err) {
        console.error("Error deleting announcement:", err);
        alert("Erreur lors de la suppression : " + (err instanceof Error ? err.message : String(err)));
      }
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm("Supprimer ce témoignage ?")) {
      await deleteDoc(doc(db, "testimonials", id));
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (window.confirm("Supprimer cette ressource ?")) {
      await deleteDoc(doc(db, "courses", id));
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (window.confirm("Supprimer ce document ?")) {
      await deleteDoc(doc(db, "community_documents", id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter uppercase">Panneau Admin</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Gestion de l'Association Al Kendi</p>
          </div>
          <div className="flex flex-wrap bg-white p-1 rounded-2xl shadow-sm border border-slate-200 gap-1">
            <button 
              onClick={() => setActiveTab("announcements")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "announcements" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Megaphone size={14} />
              Annonces
            </button>
            <button 
              onClick={() => setActiveTab("partners")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "partners" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Building2 size={14} />
              Partenaires
            </button>
            <button 
              onClick={() => setActiveTab("testimonials")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "testimonials" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
            >
              <MessageSquare size={14} />
              Témoignages
            </button>
            <button 
              onClick={() => setActiveTab("community")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "community" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
            >
              <GraduationCap size={14} />
              Communauté
            </button>
            <button 
              onClick={() => setActiveTab("config")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "config" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
            >
              <ImageIcon size={14} />
              Configuration
            </button>
          </div>
        </header>

        <main>
          {(() => {
            switch (activeTab) {
              case "partners":
                return (
                  <div className="grid lg:grid-cols-[400px_1fr] gap-10">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 h-fit">
                      <h2 className="text-xl font-display font-black mb-8 uppercase tracking-tight flex items-center gap-3">
                        <Plus className="text-primary" />
                        Nouveau Partenaire
                      </h2>
                      <form onSubmit={handleAddPartner} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom du Partenaire</label>
                          <input 
                            type="text" 
                            required
                            value={newPartner.name}
                            onChange={(e) => setNewPartner(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold"
                            placeholder="Ex: Al Kendi Corp"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logo du Partenaire</label>
                          <div className="relative group/upload">
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'partner')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <div className={`w-full h-32 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${newPartner.logoUrl ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50 group-hover/upload:border-primary group-hover/upload:bg-white'}`}>
                              {newPartner.logoUrl ? (
                                <img src={newPartner.logoUrl} alt="Preview" className="h-20 object-contain" />
                              ) : (
                                <>
                                  <ImageIcon className="text-slate-300 group-hover/upload:text-primary transition-colors" size={32} />
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Choisir une image</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lien Site Web (Optionnel)</label>
                          <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                              type="url" 
                              value={newPartner.websiteUrl}
                              onChange={(e) => setNewPartner(prev => ({ ...prev, websiteUrl: e.target.value }))}
                              className="w-full pl-12 pr-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                        <button 
                          type="submit" 
                          className="w-full py-5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20"
                        >
                          Ajouter Partenaire
                        </button>
                      </form>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <AnimatePresence mode="popLayout">
                        {partners.map((partner) => (
                          <motion.div 
                            key={partner.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group overflow-hidden"
                          >
                            <button 
                              onClick={() => handleDeletePartner(partner.id)}
                              className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 size={16} />
                            </button>
                            <div className="w-full h-32 flex items-center justify-center p-4 bg-slate-50 rounded-2xl mb-4">
                              <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <h3 className="font-display font-black uppercase tracking-tight text-slate-900">{partner.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">{partner.websiteUrl || "Aucun lien"}</p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {partners.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
                          <Building2 className="mx-auto text-slate-200 mb-4" size={48} />
                          <p className="font-bold text-slate-400">Aucun partenaire pour le moment</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              case "announcements":
                return (
                  <div className="grid lg:grid-cols-[400px_1fr] gap-10">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 h-fit">
                      <h2 className="text-xl font-display font-black mb-8 uppercase tracking-tight flex items-center gap-3">
                        <Plus className="text-primary" />
                        Nouvelle Annonce
                      </h2>
                      <form onSubmit={handleAddAnnouncement} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre de l'Annonce</label>
                          <input 
                            type="text" 
                            required
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold"
                            placeholder="Titre accrocheur..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Catégorie</label>
                          <select 
                            value={newAnnouncement.category}
                            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold appearance-none cursor-pointer"
                          >
                            {["Événement", "Forum", "Compétition", "Nouveauté", "Admin", "Urgent"].map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                          <textarea 
                            required
                            rows={4}
                            value={newAnnouncement.content}
                            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold resize-none"
                            placeholder="Contenu de votre annonce..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date de l'Annonce</label>
                          <input 
                            type="datetime-local" 
                            value={newAnnouncement.manualDate}
                            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, manualDate: e.target.value }))}
                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Illustrations (Plusieurs possibles)</label>
                          <div className="grid grid-cols-2 gap-4">
                            <input type="file" accept="image/*" onChange={(e) => handleAnnouncementFile(e, 'image')} className="hidden" id="ann-img" />
                            <label htmlFor="ann-img" className="px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 text-center cursor-pointer hover:border-primary transition-all">
                              + Ajouter Image
                            </label>
                            <input type="file" accept="video/*" onChange={(e) => handleAnnouncementFile(e, 'video')} className="hidden" id="ann-vid" />
                            <label htmlFor="ann-vid" className="px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 text-center cursor-pointer hover:border-primary transition-all">
                              + Ajouter Vidéo
                            </label>
                          </div>
                          
                          {/* Previews */}
                          {(newAnnouncement.images.length > 0 || newAnnouncement.videos.length > 0) && (
                            <div className="grid grid-cols-3 gap-2 mt-4">
                              {newAnnouncement.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group/item">
                                  <img src={img} className="w-full h-full object-cover" alt="Preview" />
                                  <button 
                                    type="button"
                                    onClick={() => removeMedia(idx, 'image')}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover/item:opacity-100 transition-opacity"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                              {newAnnouncement.videos.map((vid, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group/item bg-slate-900 flex items-center justify-center">
                                  <LinkIcon className="text-white/20" size={24} />
                                  <button 
                                    type="button"
                                    onClick={() => removeMedia(idx, 'video')}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover/item:opacity-100 transition-opacity"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Auteur / Réalisé par</label>
                          <input 
                            type="text" 
                            value={newAnnouncement.author || ''}
                            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, author: e.target.value }))}
                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold"
                            placeholder="Nom du réalisateur..."
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="w-full py-5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20"
                        >
                          Publier l'Annonce
                        </button>
                      </form>
                    </div>

                    <div className="space-y-6">
                      <AnimatePresence mode="popLayout">
                        {announcements.map((item) => (
                          <motion.div 
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.category === 'Urgent' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                                <Megaphone size={24} />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                    {item.category}
                                  </span>
                                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                    {new Date(item.date).toLocaleDateString('fr-FR')}
                                  </span>
                                </div>
                                <h3 className="font-display font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                                  {item.title}
                                  {((item.images && item.images.length > 0) || (item.videos && item.videos.length > 0)) && (
                                    <span className="flex gap-1">
                                      {item.images && item.images.length > 0 && <ImageIcon size={12} className="text-primary" />}
                                      {item.videos && item.videos.length > 0 && <LinkIcon size={12} className="text-primary" />}
                                    </span>
                                  )}
                                </h3>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                console.log("Deleting announcement with ID:", item.id);
                                handleDeleteAnnouncement(item.id);
                              }}
                              className="p-4 bg-red-50 text-red-600 rounded-2xl transition-all hover:bg-red-600 hover:text-white shadow-md active:scale-90 border-2 border-red-100 flex items-center justify-center group/del"
                              title="Supprimer Définitivement"
                            >
                              <Trash2 size={20} className="group-hover/del:animate-bounce" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {announcements.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
                          <Megaphone className="mx-auto text-slate-200 mb-4" size={48} />
                          <p className="font-bold text-slate-400">Aucune annonce publiée</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              case "testimonials":
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {testimonials.map((t) => (
                        <motion.div 
                          key={t.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative group"
                        >
                          <button 
                            onClick={() => handleDeleteTestimonial(t.id)}
                            className="absolute top-6 right-6 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 size={16} />
                          </button>
                          <p className="text-slate-600 font-medium italic mb-6">"{t.comment}"</p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                              <ImageIcon size={20} />
                            </div>
                            <div>
                              <h4 className="font-display font-black uppercase text-xs text-slate-900">{t.name}</h4>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t.role || "Membre"}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {testimonials.length === 0 && (
                      <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
                        <MessageSquare className="mx-auto text-slate-200 mb-4" size={48} />
                        <p className="font-bold text-slate-400">Aucun témoignage à modérer</p>
                      </div>
                    )}
                  </div>
                );
              case "community":
                return (
                  <div className="space-y-12">
                    <section>
                      <h2 className="text-xl font-display font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-3">
                        <GraduationCap className="text-primary" />
                        Ressources Partagées
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                          {courses.map((course) => (
                            <motion.div 
                              key={course.id}
                              layout
                              className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group"
                            >
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-900 text-white rounded-full">{course.filiere}</span>
                                  <span className="text-[8px] font-bold text-slate-400 uppercase">L{course.level}</span>
                                </div>
                                <h3 className="font-display font-black uppercase text-sm text-slate-900">{course.title}</h3>
                                <p className="text-[10px] text-slate-500 mt-1 italic">Par {course.author}</p>
                              </div>
                              <button 
                                onClick={() => handleDeleteCourse(course.id)}
                                className="p-3 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                              >
                                <Trash2 size={16} />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {courses.length === 0 && (
                          <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Aucune ressource partagée</p>
                          </div>
                        )}
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl font-display font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-3">
                        <LinkIcon className="text-primary" />
                        Documents & Files
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <AnimatePresence mode="popLayout">
                          {communityDocs.map((docItem) => (
                            <motion.div 
                              key={docItem.id}
                              layout
                              className="bg-white p-4 rounded-2xl border border-slate-100 text-center group relative h-fit"
                            >
                              <button 
                                onClick={() => handleDeleteDoc(docItem.id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10"
                              >
                                <Trash2 size={12} />
                              </button>
                              <div className="w-12 h-12 bg-slate-50 rounded-xl mx-auto mb-3 flex items-center justify-center text-slate-300">
                                <LinkIcon size={20} />
                              </div>
                              <h4 className="font-bold text-[10px] text-slate-900 uppercase truncate px-2">{docItem.title}</h4>
                              <p className="text-[8px] text-slate-400 mt-0.5 truncate">{docItem.fileName}</p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {communityDocs.length === 0 && (
                          <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl font-bold text-slate-400 text-[10px] uppercase tracking-widest">
                            Aucun document partagé
                          </div>
                        )}
                      </div>
                    </section>
                  </div>
                );
              case "config":
                return (
                  <div className="max-w-2xl mx-auto space-y-10">
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-display font-black uppercase tracking-tight">Paramètres Généraux</h3>
                        {appConfig.logoUrl && (
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 p-2 flex items-center justify-center border border-slate-100 shadow-inner">
                            <img src={appConfig.logoUrl} alt="Logo actuel" className="max-w-full max-h-full object-contain" />
                          </div>
                        )}
                      </div>
                      
                      <form onSubmit={handleUpdateConfig} className="space-y-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom de l'Association</label>
                          <input 
                            type="text" 
                            value={appConfig.associationName}
                            onChange={(e) => setAppConfig(prev => ({ ...prev, associationName: e.target.value }))}
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold text-sm"
                            placeholder="Nom affiché..."
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logo de l'Association</label>
                          <div className="relative group/logo">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'logo')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`w-full py-10 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${appConfig.logoUrl ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50 group-hover/logo:border-primary group-hover/logo:bg-white'}`}>
                              {appConfig.logoUrl ? (
                                <img src={appConfig.logoUrl} alt="Logo" className="h-20 object-contain" />
                              ) : (
                                <>
                                  <ImageIcon className="text-slate-300 group-hover/logo:text-primary transition-colors" size={40} />
                                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Cliquer pour changer le logo</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-10 border-t border-slate-100">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vidéo de fond Hero (Lien)</label>
                          <input 
                            type="text" 
                            value={heroSettings.videoUrl}
                            onChange={(e) => setHeroSettings(prev => ({ ...prev, videoUrl: e.target.value }))}
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold text-sm"
                            placeholder="Lien YouTube ou URL vidéo..."
                          />
                          <p className="text-[9px] text-slate-400 font-medium px-2 italic">Laissez vide pour utiliser une image à la place.</p>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image de fond Hero (Fallback)</label>
                          <input 
                            type="text" 
                            value={heroSettings.imageUrl}
                            onChange={(e) => setHeroSettings(prev => ({ ...prev, imageUrl: e.target.value }))}
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold text-sm"
                            placeholder="URL de l'image..."
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={updatingConfig}
                          className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
                        >
                          {updatingConfig ? "Mise à jour..." : "Enregistrer tous les paramètres"}
                        </button>
                      </form>
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })()}
        </main>
      </div>
    </div>
  );
}
