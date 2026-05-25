import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, UserCheck, ShieldCheck, Cpu, Code, PieChart, Bell, Calendar, Video, Star, Quote, ChevronDown, ChevronUp, Bot, Image as ImageIcon, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { collection, query, orderBy, limit, onSnapshot, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { cn } from "../lib/utils";
import { useTranslation } from "../lib/LanguageContext";

const HERO_IMG = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop";

interface RecentAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  images?: string[];
  videos?: string[];
  status?: string;
}

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: any;
}

interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  titleAr?: string;
  titleEn?: string;
  description: string;
  descriptionAr?: string;
  descriptionEn?: string;
  createdAt?: any;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: "default-1",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    title: "Visite Professionnelle",
    titleAr: "زيارة مهنية",
    titleEn: "Professional Visit",
    description: "Rencontre avec des professionnels et networking dans un cadre corporate",
    descriptionAr: "لقاءات مع مهنيين وبناء شبكات تواصل في بيئة مؤسساتية",
    descriptionEn: "Meet professionals and network in a corporate environment"
  },
  {
    id: "default-2",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
    title: "Hackathon & Pitch",
    titleAr: "هاكاثون وعروض المشاريع",
    titleEn: "Hackathon & Pitch",
    description: "Pitcher vos idées innovantes devant un jury d'experts du domaine technologique",
    descriptionAr: "عرض أفكاركم الابتكارية أمام لجنة تحكيم من خبراء التكنولوجيا",
    descriptionEn: "Pitch your innovative ideas before a jury of expert judges in tech"
  },
  {
    id: "default-3",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
    title: "Ateliers Pratiques",
    titleAr: "ورشات عمل تطبيقية",
    titleEn: "Hands-on Workshops",
    description: "Formations intensives guidées par des professionnels chevronnés de l'informatique",
    descriptionAr: "حصص تدريبية مكثفة بإشراف مهنيين متمرسين في تكنولوجيا المعلومات",
    descriptionEn: "Intensive sessions guided by seasoned information technology experts"
  }
];

export default function Home() {
  const [recentAnnouncements, setRecentAnnouncements] = useState<RecentAnnouncement[]>([]);
  const [heroSettings, setHeroSettings] = useState<{ videoUrl?: string; imageUrl?: string }>({});
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [currentGalleryIdx, setCurrentGalleryIdx] = useState(0);
  const [galleryDirection, setGalleryDirection] = useState(0);
  const [newOpinion, setNewOpinion] = useState({ name: "", rating: 5, comment: "" });
  const [submittingOpinion, setSubmittingOpinion] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { t, language } = useTranslation();

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

    // Gallery Slider Images
    const qg = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsubGallery = onSnapshot(qg, (snapshot) => {
      setGalleryItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem)));
    }, (error) => {
      console.error("Error fetching gallery:", error);
    });

    return () => {
      unsubAnn();
      unsubHero();
      unsubTest();
      unsubGallery();
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
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 select-none">
          {heroSettings.videoUrl ? (
            <div className="absolute inset-0 bg-slate-900 overflow-hidden w-full h-full">
              {(() => {
                const isYouTube = heroSettings.videoUrl.includes('youtube.com') || heroSettings.videoUrl.includes('youtu.be');
                const ytMatch = isYouTube ? heroSettings.videoUrl.match(/(?:v=|\/|embed\/)([0-9A-Za-z_-]{11})/) : null;
                
                if (ytMatch) {
                  return (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden w-full h-full bg-slate-950">
                      <iframe
                        src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytMatch[1]}&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] min-w-full min-h-full pointer-events-none"
                        allow="autoplay; encrypted-media"
                      />
                    </div>
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
                    className="absolute inset-0 w-full h-full object-cover opacity-90 select-none"
                  />
                );
              })()}
            </div>
          ) : (
            <img 
              src={heroSettings.imageUrl || HERO_IMG}
              alt="Students"
              className="w-full h-full object-cover opacity-40 select-none"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-white/60 sm:bg-white/40 backdrop-blur-[2px] sm:backdrop-blur-[1px]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-[0.2em] backdrop-blur-md border border-primary/20">
              <Rocket size={16} className="animate-pulse" />
              {t("hero_badge")}
            </div>
            <h1 className="text-4xl sm:text-7xl lg:text-[100px] font-display font-black text-slate-900 leading-[1.1] sm:leading-[0.95] mb-6 sm:mb-8 drop-shadow-2xl tracking-tighter uppercase whitespace-pre-line">
              <StretchedText text={t("hero_title_1")} /> <br /> 
              <StretchedText text={t("hero_title_2")} /> <span className="text-primary italic inline-block"><StretchedText text={t("hero_title_3")} /></span>
            </h1>
            <p className="text-lg sm:text-2xl text-slate-800 font-medium mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              {language === "ar" 
                ? "انضموا إلى مجتمع طلابي حيوي وشغوف بالبرمجة والتطوير، تكنولوجيا المعلومات، والتسيير الإداري والمالي." 
                : language === "en" 
                ? "Join a dynamic community of students passionate about development, computer science, and management." 
                : "Rejoignez une communauté dynamique d'étudiants passionnés par le développement, l'informatique et la gestion."}
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 max-w-lg sm:max-w-none mx-auto w-full px-2 sm:px-0">
              <Link 
                to="/signup"
                className="w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-4 sm:py-5 bg-primary hover:bg-primary-hover text-white rounded-xl font-black shadow-lg sm:shadow-2xl shadow-primary/30 transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 sm:gap-3 uppercase tracking-wider text-sm sm:text-base lg:text-lg"
              >
                {t("community_btn")}
                <ArrowRight size={20} className={language === "ar" ? "rotate-180" : ""} />
              </Link>
              <button 
                onClick={() => {
                  const event = new CustomEvent('open-ai-chat');
                  window.dispatchEvent(event);
                }}
                className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black shadow-lg transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 sm:gap-3 uppercase tracking-wider text-sm sm:text-base lg:text-lg border-2 border-transparent"
              >
                <Bot size={20} className="text-primary" />
                {t("interrogate_ai")}
              </button>
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-black shadow-lg sm:shadow-2xl shadow-red-600/20 transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 sm:gap-3 uppercase tracking-wider text-sm sm:text-base lg:text-lg"
              >
                <Play size={20} className="fill-current text-white animate-pulse" />
                {language === "ar" 
                  ? "عرض فيديو الكندي التعريفى" 
                  : language === "en" 
                  ? "Al Kendi Video Presentation" 
                  : "Présentation Vidéo Al Kendi"}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Wave - Hero to Stats */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-1 rotate-180">
          <svg className="relative block w-[calc(130%+1.3px)] h-[80px] animate-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2.04,1200,0Z" fill="#f8fafc"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section - New Style */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 text-center lg:text-left">
            {[
              { label: t("stats_members"), val: "+500" },
              { label: t("stats_courses"), val: "+1200" },
              { label: language === "ar" ? "ورشات عمل منظمة" : language === "en" ? "Workshops Organized" : "Ateliers Organisés", val: "+45" },
              { label: language === "ar" ? "شركاء رسميون" : language === "en" ? "Official Partners" : "Partenaires", val: "+12" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter">{stat.val}</div>
                <div className="text-xs font-bold text-primary uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Announcements Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 text-left">
            <div className="max-w-2xl">
              <div className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 text-left">{t("news_tag")}</div>
              <h2 className="text-3xl sm:text-5xl font-display font-black leading-tight sm:leading-none uppercase tracking-tighter text-slate-900">
                {t("news_title_1")} <br /> <span className="text-primary italic">{t("news_title_2")}</span>
              </h2>
            </div>
            <Link 
              to="/announcements"
              className="px-8 py-3 border border-slate-200 hover:border-primary hover:bg-primary hover:text-white rounded-xl font-bold transition-all uppercase tracking-widest text-sm text-slate-600"
            >
              {language === "ar" ? "عرض السجلات كاملة" : language === "en" ? "View all announcements" : "Voir tout le journal"} <ArrowRight size={16} className={cn("inline ml-2", language === "ar" ? "rotate-180" : "")} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((ann, i) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex flex-col h-full bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden hover:bg-white hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {ann.images && ann.images.length > 0 ? (
                      <img 
                        src={ann.images[0]} 
                        alt={ann.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/30">
                        <ImageIcon size={64} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-primary text-white text-[8px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                        {ann.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                      <Calendar size={12} className="text-primary" />
                      {new Date(ann.date).toLocaleDateString(language === "ar" ? "ar-EG" : language === "en" ? "en-US" : "fr-FR")}
                    </div>
                    <h3 className="text-xl font-display font-black text-slate-900 uppercase tracking-tight mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                      {ann.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-3 leading-relaxed">
                      {ann.content}
                    </p>
                    <Link 
                      to="/announcements" 
                      className="mt-auto inline-flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest hover:gap-4 transition-all"
                    >
                      {language === "ar" ? "اقرأ المزيد" : language === "en" ? "Read more" : "Lire la suite"} <ArrowRight size={14} className={language === "ar" ? "rotate-180" : ""} />
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                <Bell className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="font-bold text-slate-400">
                  {language === "ar" ? "لا توجد أي إعانات أو مستجدات حالياً" : language === "en" ? "No recent announcements" : "Aucune annonce récente"}
                </p>
              </div>
            )}
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
              {/* Sliding Gallery replaces the collage */}
              <div className="relative group overflow-hidden w-full h-[450px] sm:h-[500px] rounded-[2.5rem] shadow-2xl border border-slate-100 bg-slate-900">
                {(() => {
                  const items = galleryItems.length > 0 ? galleryItems : DEFAULT_GALLERY;
                  
                  const handlePrev = (e: React.MouseEvent) => {
                    e.preventDefault();
                    setGalleryDirection(-1);
                    setCurrentGalleryIdx((prev) => (prev - 1 + items.length) % items.length);
                  };

                  const handleNext = (e: React.MouseEvent) => {
                    e.preventDefault();
                    setGalleryDirection(1);
                    setCurrentGalleryIdx((prev) => (prev + 1) % items.length);
                  };

                  if (items.length === 0) return null;
                  
                  // Double check index bounds
                  const index = currentGalleryIdx >= items.length ? 0 : currentGalleryIdx;
                  const currentItem = items[index];

                  const title = language === "ar" 
                    ? (currentItem.titleAr || currentItem.title) 
                    : (language === "en" ? (currentItem.titleEn || currentItem.title) : currentItem.title);
                  
                  const description = language === "ar" 
                    ? (currentItem.descriptionAr || currentItem.description) 
                    : (language === "en" ? (currentItem.descriptionEn || currentItem.description) : currentItem.description);

                  return (
                    <div className="absolute inset-0 w-full h-full">
                      <AnimatePresence initial={false} mode="popLayout">
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: galleryDirection * 200 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -galleryDirection * 200 }}
                          transition={{ type: "spring", stiffness: 300, damping: 28 }}
                          className="absolute inset-0 w-full h-full"
                        >
                          <img 
                            src={currentItem.imageUrl} 
                            alt={title} 
                            className="w-full h-full object-cover select-none"
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                      </AnimatePresence>

                      {/* Cover/Gradient overlay for high-contrast reading */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

                      {/* Text content */}
                      <div className="absolute bottom-10 left-8 right-8 text-white z-10 text-left">
                        <h3 className="text-xl sm:text-2xl font-display font-black flex items-center gap-3 drop-shadow-md tracking-tight">
                          {title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-200 mt-2 font-medium drop-shadow-md leading-relaxed">
                          {description}
                        </p>
                      </div>

                      {/* Navigation arrows */}
                      <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-950 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft size={20} className={language === "ar" ? "rotate-180" : ""} />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-950 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer"
                        aria-label="Next slide"
                      >
                        <ChevronRight size={20} className={language === "ar" ? "rotate-180" : ""} />
                      </button>

                      {/* Pagination dots */}
                      <div className={`absolute bottom-4 ${language === "ar" ? "left-8" : "right-8"} flex gap-1.5 z-20`}>
                        {items.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setGalleryDirection(idx > index ? 1 : -1);
                              setCurrentGalleryIdx(idx);
                            }}
                            className={`h-1.5 rounded-full transition-all ${idx === index ? 'w-6 bg-primary' : 'w-1.5 bg-white/50 hover:bg-white'}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            </div>
            
            <div className="space-y-10">
              <div>
                <div className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4">{t("about_tag")}</div>
                <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-900 leading-tight sm:leading-none uppercase tracking-tighter mb-6 sm:mb-8">
                  {t("about_title_1")} <br /> {t("about_title_2")} <br /> <span className="text-primary italic">{t("about_title_3")}</span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  {language === "ar" 
                    ? "جمعية شباب الكندي ليست مجرد نادٍ طلابي عابر؛ بل هي بيئة ريادية متكاملة للإبداع والابتكار حيث يلتقي قادة التكنولوجيا ومحترفو الإدارة والتسيير المالي للغد." 
                    : language === "en" 
                    ? "The Al Kendi Youth Association is not just a student club. It is a genuine innovation ecosystem where future leaders of technology and finance assemble." 
                    : "L'Association des Jeunes Al Kendi n'est pas seulement un club étudiant. C'est un véritable écosystème d'innovation où se rencontrent les futurs leaders de la technologie."}
                </p>
                <div className="grid sm:grid-cols-2 gap-8 py-8 border-y border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">
                      {language === "ar" ? "الجودة والتميز" : language === "en" ? "Quality & Excellence" : "Qualité & Excellence"}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {language === "ar" ? "نسعى لتقديم أعلى مستوى ممكن في ورشاتنا الأكاديمية والعملية." : language === "en" ? "High standard for all of our specialized workshops." : "Un standard élevé pour toutes nos formations et événements."}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">
                      {language === "ar" ? "الابتكار الرقمي" : language === "en" ? "Continuous Innovation" : "Innovation Continue"}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {language === "ar" ? "مواكبة سريعة ومستمرة لأحدث الأدوات التكنولوجية والذكية." : language === "en" ? "Constantly tracking the latest emerging tech and tools." : "Toujours à l'affût des dernières technologies et tendances du marché."}
                    </p>
                  </div>
                </div>
              </div>
              <Link 
                to="/branches"
                className="inline-flex items-center gap-4 text-primary font-black uppercase tracking-widest group"
              >
                {language === "ar" ? "اكتشف تخصصاتنا ومهمتنا" : language === "en" ? "Learn more about our branches" : "En savoir plus sur nos missions"}
                <div className={cn("w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center transition-transform", language === "ar" ? "group-hover:-translate-x-2" : "group-hover:translate-x-2")}>
                  <ArrowRight size={20} className={language === "ar" ? "rotate-180" : ""} />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Board Members Section */}
        <BoardMembersSection />

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
              <div className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 text-left">{t("expert_tag")}</div>
              <h2 className="text-3xl sm:text-5xl font-display font-black leading-tight sm:leading-none uppercase tracking-tighter">
                {t("expert_title_1")} <br /> {t("expert_title_2")} <span className="text-primary italic">{t("expert_title_3")}</span>
              </h2>
            </div>
            <Link 
              to="/branches"
              className="px-8 py-3 border border-white/20 hover:border-primary hover:bg-primary rounded-xl font-bold transition-all uppercase tracking-widest text-sm"
            >
              {language === "ar" ? "عرض التفاصيل" : language === "en" ? "View all" : "Voir tout"} <ArrowRight size={16} className={cn("inline ml-2", language === "ar" ? "rotate-180" : "")} />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <PerspectiveCard className="group p-10 bg-slate-800/50 rounded-[2.5rem] border border-white/10 hover:border-primary/50 transition-all">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-primary transition-colors">
                <Cpu size={36} />
              </div>
              <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-4 leading-none">
                {language === "ar" ? "تطوير برمجيات" : language === "en" ? "AI & Coding" : "Développement"} <br /> {language === "ar" ? "الذكاء الاصطناعي" : language === "en" ? "Academy" : "de l'IA"}
              </h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                {language === "ar" ? "تصميم وتجريب خوارزميات الذكاء الاصطناعي وتعلم الآلة عملياً." : language === "en" ? "Designing intelligent algorithms and hands-on Neural Network coding." : "Conception d'algorithmes intelligents et intégration de modèles de Machine Learning."}
              </p>
              <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500" />
            </PerspectiveCard>

            <PerspectiveCard className="group p-10 bg-secondary rounded-[2.5rem] shadow-2xl shadow-secondary/20 transition-all">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-8">
                <Code size={36} />
              </div>
              <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-4 leading-none">
                {language === "ar" ? "تطوير تطبيقات Web" : language === "en" ? "Fullstack AI" : "Développement AI"} <br /> {language === "ar" ? "باستخدام الذكاء" : language === "en" ? "Engineering" : "Applications"}
              </h3>
              <p className="text-white/80 mb-8 leading-relaxed">
                {language === "ar" ? "تطوير وبناء تطبيقات مبتكرة ومتكاملة لربط تكنولوجيا المعلومات بسوق العمل." : language === "en" ? "Complete cycle development matching web apps with models using state of the art APIs." : "Cycle complet de développement d'applications innovantes utilisant les APIs d'IA modernes."}
              </p>
            </PerspectiveCard>

            <PerspectiveCard className="group p-10 bg-slate-800/50 rounded-[2.5rem] border border-white/10 hover:border-primary/50 transition-all">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-primary transition-colors">
                <PieChart size={36} />
              </div>
              <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-4 leading-none">
                {language === "ar" ? "المحاسبة المالية" : language === "en" ? "Finance &" : "Comptabilité"} <br /> {language === "ar" ? "والتدبير الاستراتيجي" : language === "en" ? "Management" : "et Gestion"}
              </h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                {language === "ar" ? "التحكم الميداني في تدبير الميزانيات، المحاسبة التحليلية، والمراقبة المالية الشاملة." : language === "en" ? "Corporate finance, analytical accounting and strategic business administration." : "Expertise en gestion financière, audit et administration stratégique des entreprises."}
              </p>
              <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500" />
            </PerspectiveCard>
          </div>
        </div>

        {/* Bottom Wave to testimonials */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
          <svg className="relative block w-[calc(134%+1.3px)] h-[80px] animate-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2.04,1200,0Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* Testimonials section - Glass Design */}
      <section className="py-32 bg-white relative">
        {/* Top Wave transition from dark Filieres */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] opacity-10 pointer-events-none rotate-180">
          <svg className="relative block w-[calc(134%+1.3px)] h-[60px] animate-wave-slow" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.83C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#0f172a"></path>
          </svg>
        </div>

        {/* Partners Section */}
        <PartnersSection />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4">{t("test_tag")}</div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-900 leading-tight sm:leading-none uppercase tracking-tighter">
              {t("test_title_1")} <br /> <span className="text-primary italic">{t("test_title_2")}</span>
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
                {language === "ar" ? "لا توجد أي تقييمات حالياً. كن أول من يكتب رأيه!" : language === "en" ? "No feedback yet. Be the first to leave one!" : "Aucun avis pour le moment. Soyez le premier !"}
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900 rounded-[3rem] p-10 sm:p-16 border border-white/5 shadow-2xl relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="text-3xl font-display font-black mb-10 text-center uppercase tracking-tight">
                  {language === "ar" ? "جاهز لمشاركة تجربتك معنا؟" : language === "en" ? "Ready to Share Your Experience?" : "Prêt à Partager votre Expérience ?"}
                </h3>
                <form onSubmit={handleAddOpinion} className="space-y-8 text-left">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t("auth_fullname")}</label>
                      <input 
                        type="text" 
                        required
                        value={newOpinion.name}
                        onChange={(e) => setNewOpinion(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-6 py-5 bg-white/5 rounded-2xl border-2 border-white/10 focus:border-primary outline-none transition-all placeholder:text-slate-600 font-bold text-white shadow-inner"
                        placeholder={language === "ar" ? "اكتب اسمك ..." : language === "en" ? "Your name..." : "Votre nom..."}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">
                        {language === "ar" ? "التقييم العام" : language === "en" ? "Overall Note" : "Note Globale"}
                      </label>
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      {language === "ar" ? "رسالتكم" : language === "en" ? "Your Message" : "Votre Message"}
                    </label>
                    <textarea 
                      required
                      value={newOpinion.comment}
                      onChange={(e) => setNewOpinion(prev => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                      className="w-full px-6 py-5 bg-white/5 rounded-2xl border-2 border-white/10 focus:border-primary outline-none transition-all placeholder:text-slate-600 font-bold text-white shadow-inner resize-none"
                      placeholder={language === "ar" ? "ما الفائدة التي لمستها من خدماتنا؟" : language === "en" ? "How did the association help you?" : "Comment l'association vous a-t-elle aidé ?"}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={submittingOpinion}
                    className="w-full py-5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/40 transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-50"
                  >
                    {submittingOpinion 
                      ? (language === "ar" ? "جاري الإرسال ..." : language === "en" ? "Sending..." : "Envoi...") 
                      : (language === "ar" ? "إرسال تعليقي الآن" : language === "en" ? "Submit Feedback" : "Envoyer mon témoignage")}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 border-b border-slate-100 pb-8">
            <h2 className="text-2xl sm:text-5xl font-display font-black text-slate-900 uppercase tracking-tighter">
              {t("faq_title")}
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: language === "ar" 
                  ? "ما هي الخدمات التي تقدمها جمعية الكندي؟" 
                  : language === "en" 
                  ? "What services does Al Kendi Association propose?" 
                  : "Quels services propose l'Association Al Kendi ?",
                answer: language === "ar" 
                  ? "بصفتنا جمعية طلابية متخصصة ومسؤولة، نقدم دروس دعم وتوجيه وأكاديميات تكوين في الذكاء الاصطناعي والبرمجة والمحاسبة المالية وتدبير المقاولات." 
                  : language === "en" 
                  ? "As a specialized student organization, we offer academic tutoring, coding & AI hands-on workshops, and management/accounting seminars." 
                  : "En tant qu'association spécialisée dans l'accompagnement d'excellence, nous proposons des cours de soutien, des ateliers en IA et codage, ainsi que des séminaires de gestion."
              },
              {
                question: language === "ar" 
                  ? "كيف يمكنني الانضمام إلى الجمعية ومجموعاتنا؟" 
                  : language === "en" 
                  ? "How do I register or join the association?" 
                  : "Comment rejoindre l'association ?",
                answer: language === "ar" 
                  ? "التسجيل سهل ومباشر عبر البوابة الرسمية! اضغط على زر 'الانضمام للمجتمع' واملأ استمارة البيانات الخاصة بك لتتم مراجعتها." 
                  : language === "en" 
                  ? "Registration is done directly on our site. Click 'Join Community' in the header to submit your student registration form." 
                  : "L'inscription se fait directement via notre plateforme. Cliquez sur 'Rejoindre la Communauté', remplissez le formulaire d'adhésion."
              },
              {
                question: language === "ar" 
                  ? "هل تقبل الجمعية المبتدئين تماماً؟" 
                  : language === "en" 
                  ? "Is the association friendly to absolute beginners?" 
                  : "L'association est-elle ouverte aux débutants ?",
                answer: language === "ar" 
                  ? "بالتأكيد! نرحب بجميع المستويات والمسارات. برامجنا التكوينية مصممة خطوة بخطوة لمواكبة المبتدئين والمطورين المتمرسين على حد سواء." 
                  : language === "en" 
                  ? "Absolutely. We welcome all skills and career levels. Our programs are engineered to step-by-step advance beginners." 
                  : "Absolument. Nous accueillons tous les niveaux. Nos programmes sont conçus pour faire monter en compétence aussi bien les débutants."
              },
              {
                question: language === "ar" 
                  ? "هل هناك أي رسوم مادية للتسجيل والاشتراك؟" 
                  : language === "en" 
                  ? "Are there any membership fees?" 
                  : "Y a-t-il des frais d'adhésion ?",
                answer: language === "ar" 
                  ? "الاشتراك والعضوية الأساسية في جمعية الكندي مجانية تماماً للطلبة. ورشاتنا العامة ودوراتنا مفتوحة ومجانية طوال العام الدراسي." 
                  : language === "en" 
                  ? "Membership in Al Kendi is completely free for college students. Most events, bootcamps and certifications are free as well." 
                  : "L'adhésion à Al Kendi est gratuite pour les étudiants. Seuls certains événements d'accréditation externes peuvent nécessiter des frais."
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

      {/* YouTube Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] p-4 sm:p-6 shadow-3xl overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-6 right-6 p-3 bg-slate-900/10 hover:bg-slate-900/20 text-slate-800 rounded-full transition-all hover:scale-115 active:scale-90 z-20 shadow-md"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6 pt-2">
                <h3 className="text-2xl font-display font-black text-slate-900 uppercase tracking-tight">
                  {language === "ar" 
                    ? "فيديو الكندي التعريفي" 
                    : language === "en" 
                    ? "Al Kendi Video Presentation" 
                    : "Présentation Vidéo Al Kendi"}
                </h3>
                <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mt-1">
                  {language === "ar" ? "أبواب التميز والفرص المستقبلية" : "Engineering of Youth Success"}
                </p>
              </div>

              {/* Responsive Iframe Container */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-black">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/lAnQukafWL0?si=A0lC3Pp55Tm94BBW&autoplay=1" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
  const isArabic = /[\u0600-\u06FF]/.test(text);

  if (isArabic) {
    const words = text.split(" ");
    return (
      <span className="inline-flex flex-wrap justify-center gap-x-[0.25em]">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block hover:text-primary transition-colors cursor-default"
            whileHover={{ 
              scale: 1.08,
              translateY: -5,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    );
  }

  const words = text.split(" ");
  return (
    <span className="inline-flex flex-wrap justify-center gap-x-[0.25em] gap-y-[0.1em]">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block hover:text-primary transition-colors cursor-default"
              whileHover={{ 
                scaleY: 1.5, 
                scaleX: 0.8,
                translateY: -10,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}

function BoardMembersSection() {
  const { t, language } = useTranslation();
  const members = [
    { role: "Président(e) de l'association", name: "Dr. Lamia ELJADIRI", icon: <ShieldCheck size={28} />, color: "bg-red-500" },
    { role: "Vice-président(e)", name: "Pr. Amal EL ALAMA", icon: <UserCheck size={28} />, color: "bg-slate-900" },
    { role: "Trésorier(ère)", name: "Pr. Assia FADIL", icon: <PieChart size={28} />, color: "bg-slate-900" },
    { role: "Trésorier(ère) adjoint(e)", name: "Dr. Mohamed HOUSNI", icon: <PieChart size={28} />, color: "bg-slate-900" },
    { role: "Secrétaire général(e)", name: "Pr. Rachida ZATTI", icon: <BookOpen size={28} />, color: "bg-slate-900" },
  ];

  const getRole = (role: string) => {
    if (role === "Président(e) de l'association") {
      return language === "ar" ? "رئيسة الجمعية" : language === "en" ? "President of the association" : "Président(e) de l'association";
    }
    if (role === "Vice-président(e)") {
      return language === "ar" ? "نائبة الرئيس" : language === "en" ? "Vice President" : "Vice-président(e)";
    }
    if (role === "Trésorier(ère)") {
      return language === "ar" ? "أمينة المال" : language === "en" ? "Treasurer" : "Trésorier(ère)";
    }
    if (role === "Trésorier(ère) adjoint(e)") {
      return language === "ar" ? "نائب أمينة المال" : language === "en" ? "Deputy Treasurer" : "Trésorier(ère) adjoint(e)";
    }
    if (role === "Secrétaire général(e)") {
      return language === "ar" ? "الكاتبة العامة" : language === "en" ? "General Secretary" : "Secrétaire général(e)";
    }
    return role;
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest mb-4 border border-primary/10"
          >
            {language === "ar" ? "المكتب التنفيذي والمسير" : language === "en" ? "The Core Board" : "Le Bureau"}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter"
          >
            {language === "ar" ? "أعضاء مكتب" : language === "en" ? "Active members of" : "Les membres de"} <span className="text-primary italic">{language === "ar" ? "الجمعية المسيرون" : language === "en" ? "the association" : "l'association"}</span>
          </motion.h2>
        </div>
      </div>

      <div className="flex relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-10 items-center">
          {[...members, ...members, ...members].map((member, i) => (
            <div
              key={`${member.name}-${i}`}
              className="mx-6 sm:mx-10 flex-shrink-0"
            >
              <div
                className="relative group p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden w-[300px] sm:w-[350px]"
              >
                <div className={`w-20 h-20 ${member.color} rounded-3xl flex items-center justify-center text-white mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-slate-200`}>
                  {member.icon}
                </div>
                <div className="space-y-2 relative z-10 whitespace-normal">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{getRole(member.role)}</div>
                  <h3 className="text-2xl font-display font-black text-slate-900 uppercase tracking-tight">{member.name}</h3>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                <div className="absolute top-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </div>
            </div>
          ))}
          
          {/* Join cards for variety in the marquee */}
          {[1, 2, 3].map((_, i) => (
            <div key={`join-${i}`} className="mx-6 sm:mx-10 flex-shrink-0">
              <Link
                to="/signup"
                className="relative group p-8 bg-primary rounded-[2.5rem] flex flex-col items-center justify-center text-center hover:shadow-[0_20px_50px_rgba(236,28,36,0.3)] transition-all duration-500 cursor-pointer w-[300px] sm:w-[350px] h-[280px] sm:h-[300px]"
              >
                <div className="text-white space-y-4">
                  <h3 className="text-3xl font-display font-black uppercase tracking-tighter leading-none mb-4">
                    {language === "ar" ? <>انضم إلينا <br /> في المكتب</> : language === "en" ? <>Join <br /> the board</> : <>Rejoignez <br /> le bureau</>}
                  </h3>
                  <p className="text-white/80 text-sm font-medium whitespace-normal">
                    {language === "ar" ? "شارك بفعالية وتطوع في مختلف أنشطتنا وقدراتنا." : language === "en" ? "Take active part in the engineering of youth success." : "Participez activement à la vie de l'association."}
                  </p>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white text-primary rounded-full group-hover:scale-110 transition-transform">
                    <ArrowRight size={24} className={language === "ar" ? "rotate-180" : ""} />
                  </div>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  const [partners, setPartners] = useState<{ id: string; name: string; logoUrl: string; websiteUrl?: string }[]>([]);
  const { t, language } = useTranslation();

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
          {language === "ar" 
            ? <>شركاء متميزون، <span className="text-primary italic">ورؤية مشتركة لبناء الغد.</span></> 
            : language === "en" 
            ? <>Demanding partners, <span className="text-primary italic">a common vision.</span></> 
            : <>Des partenaires exigeants, <span className="text-primary italic">une vision commune.</span></>}
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
      </div>

      <div className="flex relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-10 items-center">
          {[...partners, ...partners, ...partners].map((partner, idx) => (
            <div 
              key={`${partner.id}-${idx}`} 
              className="mx-12 sm:mx-20 flex flex-col items-center gap-4 group/partner"
            >
              <a 
                href={partner.websiteUrl || "#"} 
                target={partner.websiteUrl ? "_blank" : undefined}
                rel={partner.websiteUrl ? "noopener noreferrer" : undefined}
                className={`w-32 h-32 sm:w-48 sm:h-48 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center p-8 transition-all hover:shadow-xl hover:scale-105 active:scale-95 grayscale hover:grayscale-0 ${!partner.websiteUrl && "cursor-default"}`}
              >
                <img 
                  src={partner.logoUrl} 
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                />
              </a>
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
