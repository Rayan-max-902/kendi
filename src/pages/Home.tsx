import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, UserCheck, ShieldCheck, Cpu, Code, PieChart, Bell, Calendar, Video, Star, Quote, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import { collection, query, orderBy, limit, onSnapshot, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const HERO_IMG = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop";

interface RecentAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  imageUrl?: string;
  videoUrl?: string;
  status?: string;
}

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export default function Home() {
  const [recentAnnouncements, setRecentAnnouncements] = useState<RecentAnnouncement[]>([]);
  const [heroSettings, setHeroSettings] = useState<{ videoUrl?: string; imageUrl?: string }>({});
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newOpinion, setNewOpinion] = useState({ name: "", rating: 5, comment: "" });
  const [submittingOpinion, setSubmittingOpinion] = useState(false);

  useEffect(() => {
    // Announcements
    const q = query(collection(db, "announcements"), orderBy("date", "desc"), limit(3));
    const unsubAnn = onSnapshot(q, (snapshot) => {
      setRecentAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RecentAnnouncement)));
    }, (error) => {
      console.error("Error fetching announcements:", error);
    });

    // Hero Settings
    const unsubHero = onSnapshot(doc(db, "settings", "hero"), (docSnap) => {
      if (docSnap.exists()) {
        setHeroSettings(docSnap.data());
      }
    }, (error) => {
      console.error("Error fetching hero settings:", error);
    });

    // Testimonials
    const qt = query(collection(db, "testimonials"), orderBy("createdAt", "desc"), limit(6));
    const unsubTest = onSnapshot(qt, (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
    }, (error) => {
      console.error("Error fetching testimonials:", error);
    });

    return () => {
      unsubAnn();
      unsubHero();
      unsubTest();
    };
  }, []);

  const handleAddOpinion = async (e: FormEvent) => {
    e.preventDefault();
    if (!newOpinion.name.trim() || !newOpinion.comment.trim()) return;

    setSubmittingOpinion(true);
    try {
      await addDoc(collection(db, "testimonials"), {
        name: newOpinion.name.trim(),
        rating: newOpinion.rating,
        comment: newOpinion.comment.trim(),
        createdAt: serverTimestamp()
      });
      setNewOpinion({ name: "", rating: 5, comment: "" });
      alert("Merci pour votre avis !");
    } catch (err) {
      console.error("Error adding opinion:", err);
      alert("Une erreur est survenue lors de l'envoi.");
    } finally {
      setSubmittingOpinion(false);
    }
  };

  return (
    <div className="flex flex-col">
        {/* Hero Section */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center pt-20 overflow-hidden px-[5%] sm:px-0">
        <div className="absolute inset-0 z-0">
          {heroSettings.videoUrl ? (
            <div className="absolute inset-0 bg-slate-900">
              {(() => {
                const isYouTube = heroSettings.videoUrl.includes('youtube.com') || heroSettings.videoUrl.includes('youtu.be');
                const ytMatch = isYouTube ? heroSettings.videoUrl.match(/(?:v=|\/|embed\/)([0-9A-Za-z_-]{11})/) : null;
                
                if (ytMatch) {
                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytMatch[1]}&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3`}
                      className="w-full h-full object-cover scale-[1.5] pointer-events-none"
                      allow="autoplay; encrypted-media"
                    />
                  );
                }
                return (
                  <video 
                    key={heroSettings.videoUrl}
                    src={heroSettings.videoUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover opacity-90"
                  />
                );
              })()}
            </div>
          ) : (
            <img 
              src={heroSettings.imageUrl || HERO_IMG}
              alt="Students"
              className="w-full h-full object-cover opacity-40"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/20 to-transparent backdrop-blur-[1px]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-[0.2em] backdrop-blur-md border border-primary/20">
              <Rocket size={16} className="animate-pulse" />
              L'avenir commence ici
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-[100px] font-display font-black text-slate-900 leading-[0.95] mb-8 drop-shadow-2xl tracking-tighter uppercase whitespace-pre-line">
              <StretchedText text="Association des" /> <br /> 
              <StretchedText text="Jeunes" /> <span className="text-primary italic inline-block"><StretchedText text="Al Kendi" /></span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-800 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              Rejoignez une communauté dynamique d'étudiants passionnés par le développement, l'informatique et la gestion. 
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6">
              <Link 
                to="/signup"
                className="px-12 py-5 bg-primary hover:bg-primary-hover text-white rounded-xl font-black shadow-2xl shadow-primary/30 transition-all hover:scale-105 flex items-center justify-center gap-3 uppercase tracking-wider text-lg"
              >
                Rejoindre la Communauté
                <ArrowRight size={24} />
              </Link>
              <Link 
                to="/branches"
                className="px-10 py-5 bg-white/40 backdrop-blur-xl border-2 border-slate-900 text-slate-900 rounded-xl font-black transition-all hover:bg-slate-900 hover:text-white text-center flex items-center justify-center uppercase tracking-wider text-lg"
              >
                Voir nos Filières
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Wave - Hero to Stats */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-1">
          <svg className="relative block w-[calc(130%+1.3px)] h-[80px] animate-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2.04,1200,0Z" fill="#f8fafc"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section - New Style */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
            {[
              { label: "Membres Actifs", val: "+500" },
              { label: "Cours Partagés", val: "+1200" },
              { label: "Ateliers Organisés", val: "+45" },
              { label: "Partenaires", val: "+12" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter">{stat.val}</div>
                <div className="text-xs font-bold text-primary uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Collage style */}
      <section className="py-32 bg-white overflow-hidden relative">
        {/* Top Wave for transition */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
          <svg className="relative block w-[calc(130%+1.3px)] h-[60px] animate-wave-slow" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f8fafc"></path>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <motion.div 
                    whileHover={{ scale: 0.98 }}
                    className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
                  >
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 0.98 }}
                    className="aspect-square rounded-3xl overflow-hidden shadow-xl"
                  >
                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
                  </motion.div>
                </div>
                <div className="pt-12 space-y-4">
                  <motion.div 
                    whileHover={{ scale: 0.98 }}
                    className="aspect-square rounded-3xl overflow-hidden shadow-xl"
                  >
                    <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 0.98 }}
                    className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
                  >
                    <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
                  </motion.div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            </div>
            
            <div className="space-y-10">
              <div>
                <div className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4">À Propos de Nous</div>
                <h2 className="text-5xl font-display font-black text-slate-900 leading-none uppercase tracking-tighter mb-8">
                  Une Vision <br /> Pour L'Avenir <br /> <span className="text-primary italic">Informatique</span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  L'Association des Jeunes Al Kendi n'est pas seulement un club étudiant. C'est un véritable écosystème d'innovation où se rencontrent les futurs leaders de la technologie au Maroc.
                </p>
                <div className="grid sm:grid-cols-2 gap-8 py-8 border-y border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Qualité & Excellence</h4>
                    <p className="text-sm text-slate-500">Un standard élevé pour toutes nos formations et événements.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Innovation Continue</h4>
                    <p className="text-sm text-slate-500">Toujours à l'affût des dernières technologies et tendances du marché.</p>
                  </div>
                </div>
              </div>
              <Link 
                to="/branches"
                className="inline-flex items-center gap-4 text-primary font-black uppercase tracking-widest group"
              >
                En savoir plus sur nos missions
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
                  <ArrowRight size={20} />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Wave to dark section */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-[calc(134%+1.3px)] h-[80px] animate-wave-reverse" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.83C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#0f172a"></path>
          </svg>
        </div>
      </section>

      {/* Filieres / Services - Bold Dark Style */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 text-left">
            <div className="max-w-2xl">
              <div className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 text-left">Nos Domaines</div>
              <h2 className="text-5xl font-display font-black leading-none uppercase tracking-tighter">
                L'Expertise au Service <br /> de votre <span className="text-primary italic">Ambition</span>
              </h2>
            </div>
            <Link 
              to="/branches"
              className="px-8 py-3 border border-white/20 hover:border-primary hover:bg-primary rounded-xl font-bold transition-all uppercase tracking-widest text-sm"
            >
              Voir tout <ArrowRight size={16} className="inline ml-2" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <PerspectiveCard className="group p-10 bg-slate-800/50 rounded-[2.5rem] border border-white/10 hover:border-primary/50 transition-all">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-primary transition-colors">
                <Cpu size={36} />
              </div>
              <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-4 leading-none">Développement <br /> de l'IA</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">Conception d'algorithmes intelligents et intégration de modèles de Machine Learning.</p>
              <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500" />
            </PerspectiveCard>

            <PerspectiveCard className="group p-10 bg-primary rounded-[2.5rem] shadow-2xl shadow-primary/20 transition-all">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-8">
                <Code size={36} />
              </div>
              <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-4 leading-none">Développement <br /> AI</h3>
              <p className="text-white/80 mb-8 leading-relaxed">Cycle complet de développement d'applications innovantes utilisant les APIs d'IA modernes.</p>
            </PerspectiveCard>

            <PerspectiveCard className="group p-10 bg-slate-800/50 rounded-[2.5rem] border border-white/10 hover:border-primary/50 transition-all">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-primary transition-colors">
                <PieChart size={36} />
              </div>
              <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-4 leading-none">Comptabilité <br /> et Gestion</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">Expertise en gestion financière, audit et administration stratégique des entreprises.</p>
              <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500" />
            </PerspectiveCard>
          </div>
        </div>

        {/* Bottom Wave to testimonials */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-[calc(134%+1.3px)] h-[80px] animate-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2.04,1200,0Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* Testimonials section - Glass Design */}
      <section className="py-32 bg-white relative">
        {/* Top Wave transition from dark Filieres */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 opacity-10 pointer-events-none">
          <svg className="relative block w-[calc(134%+1.3px)] h-[60px] animate-wave-slow" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.83C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#0f172a"></path>
          </svg>
        </div>

        {/* Partners Section */}
        <PartnersSection />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4">Témoignages</div>
            <h2 className="text-5xl font-display font-black text-slate-900 leading-none uppercase tracking-tighter">
              Ce que nos membres <br /> <span className="text-primary italic">disent de nous</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
            {testimonials.length > 0 ? (
              testimonials.map((t, i) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 relative group flex flex-col justify-between"
                >
                  <Quote className="absolute top-8 right-10 text-slate-200 group-hover:text-primary/20 transition-all" size={50} />
                  <div>
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, index) => (
                        <Star 
                          key={index} 
                          size={18} 
                          className={index < t.rating ? "fill-primary text-primary" : "text-slate-200"} 
                        />
                      ))}
                    </div>
                    <p className="text-slate-700 text-lg italic mb-8 relative z-10 leading-relaxed">"{t.comment}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black uppercase text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div className="font-black text-slate-900 uppercase tracking-wider text-sm">{t.name}</div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400 italic font-medium">
                Aucun avis pour le moment. Soyez le premier !
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900 rounded-[3rem] p-10 sm:p-16 border border-white/5 shadow-2xl relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="text-3xl font-display font-black mb-10 text-center uppercase tracking-tight">Prêt à Partager votre Expérience ?</h3>
                <form onSubmit={handleAddOpinion} className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom Complet</label>
                      <input 
                        type="text" 
                        required
                        value={newOpinion.name}
                        onChange={(e) => setNewOpinion(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-6 py-5 bg-white/5 rounded-2xl border-2 border-white/10 focus:border-primary outline-none transition-all placeholder:text-slate-600 font-bold text-white shadow-inner"
                        placeholder="Votre nom..."
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Note Globale</label>
                      <div className="flex items-center justify-center gap-3 h-[68px]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewOpinion(prev => ({ ...prev, rating: star }))}
                            className="transition-all hover:scale-125"
                          >
                            <Star 
                              size={32} 
                              className={star <= newOpinion.rating ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(236,28,36,0.3)]" : "text-white/10"} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Votre Message</label>
                    <textarea 
                      required
                      value={newOpinion.comment}
                      onChange={(e) => setNewOpinion(prev => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                      className="w-full px-6 py-5 bg-white/5 rounded-2xl border-2 border-white/10 focus:border-primary outline-none transition-all placeholder:text-slate-600 font-bold text-white shadow-inner resize-none"
                      placeholder="Comment l'association vous a-t-elle aidé ?"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={submittingOpinion}
                    className="w-full py-5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/40 transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-50"
                  >
                    {submittingOpinion ? "Envoi..." : "Envoyer mon témoignage"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter">
              Questions Fréquemment Posées
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "Quels services propose l'Association Al Kendi ?",
                answer: "En tant qu'association spécialisée dans l'accompagnement étudiant, nous proposons des cours de soutien, des ateliers techniques en IA et développement, ainsi que des séminaires de gestion et comptabilité pour préparer nos membres au marché du travail."
              },
              {
                question: "Comment rejoindre l'association ?",
                answer: "L'inscription se fait directement via notre plateforme. Cliquez sur 'Rejoindre la Communauté', remplissez vos informations et notre équipe examinera votre demande sous 48h."
              },
              {
                question: "L'association est-elle ouverte aux débutants ?",
                answer: "Absolument. Nous accueillons tous les niveaux. Nos programmes sont conçus pour faire monter en compétence aussi bien les débutants que les profils plus expérimentés."
              },
              {
                question: "Y a-t-il des frais d'adhésion ?",
                answer: "L'adhésion à Al Kendi est gratuite pour les étudiants. Seuls certains événements spéciaux ou certifications externes peuvent nécessiter une participation aux frais."
              }
            ].map((item, idx) => (
              <FaqItem key={idx} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Wave to Footer */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-[calc(134%+1.3px)] h-[80px] animate-wave-reverse" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.83C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#0f172a"></path>
          </svg>
        </div>
      </section>

      {/* Footer / CTA banner */}
      <footer className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ec1c24_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest mb-10 text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Adhésions Ouvertes
          </div>
          <h2 className="text-6xl sm:text-8xl font-display font-black mb-12 uppercase tracking-tighter leading-none">
            L'Aventure <br /> Commence <span className="text-primary italic">Maintenant</span>
          </h2>
          <Link to="/signup" className="inline-flex items-center gap-4 px-14 py-6 bg-primary hover:bg-primary-hover rounded-xl font-black text-xl transition-all shadow-2xl shadow-primary/30 uppercase tracking-widest hover:scale-105 active:scale-95">
            Devenir Membre
            <ArrowRight size={28} />
          </Link>
          
          <div className="mt-32 pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                <GraduationCap size={24} />
              </div>
              <span className="font-display font-black text-xl tracking-tight">AL KENDI</span>
            </div>
            <div className="flex gap-10 text-xs font-bold uppercase tracking-widest text-slate-500">
              <Link to="/branches" className="hover:text-white transition-colors">Filières</Link>
              <Link to="/announcements" className="hover:text-white transition-colors">Actualités</Link>
              <Link to="/community" className="hover:text-white transition-colors">Communauté</Link>
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.2em]">© 2024 Al Kendi. Design Premium.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Rocket({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/>
      <path d="M12 15v5c0 1.45 3 2 5 2 2.2 1.62 3 5 3 5"/>
    </svg>
  );
}

function PerspectiveCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div 
        style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
        className="h-full"
      >
        {children}
      </div>
    </motion.div>
  );
}

function StretchedText({ text }: { text: string }) {
  return (
    <span className="inline-flex">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block hover:text-primary transition-colors cursor-default"
          whileHover={{ 
            scaleY: 1.5, 
            scaleX: 0.8,
            translateY: -10,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

function PartnersSection() {
  const [partners, setPartners] = useState<{ id: string; name: string; logoUrl: string }[]>([]);

  useEffect(() => {
    const q = query(collection(db, "partners"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPartners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
    }, (error) => {
      console.error("Error fetching partners:", error);
    });
    return unsubscribe;
  }, []);

  if (partners.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 uppercase tracking-tight mb-4">
          Des partenaires exigeants, <span className="text-primary italic">une vision commune.</span>
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
      </div>

      <div className="flex relative overflow-hidden group">
        <div className="flex animate-marquee whitespace-nowrap py-10 items-center">
          {[...partners, ...partners, ...partners].map((partner, idx) => (
            <div 
              key={`${partner.id}-${idx}`} 
              className="mx-12 sm:mx-20 flex flex-col items-center gap-4 group/partner"
            >
              <div className="w-32 h-32 sm:w-48 sm:h-48 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center p-8 transition-all hover:shadow-xl hover:scale-105 group-hover:blur-[2px] hover:!blur-0 active:scale-95 grayscale hover:grayscale-0">
                <img 
                  src={partner.logoUrl} 
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-hover/partner:opacity-100 transition-opacity">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string; key?: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all duration-300 group ${
          isOpen 
            ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.01]" 
            : "bg-slate-950 text-white hover:bg-slate-900 shadow-lg"
        }`}
      >
        <span className="text-lg font-black uppercase tracking-tight text-left leading-tight">
          {question}
        </span>
        <div className={`transition-transform duration-500 flex-shrink-0 ml-4 ${isOpen ? "rotate-180" : "rotate-0"}`}>
          <ChevronDown size={24} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="p-8 sm:p-10 text-slate-600 font-medium leading-relaxed bg-slate-50 rounded-b-[2rem] -mt-6 pt-14 border-x border-b border-slate-100 shadow-inner">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
