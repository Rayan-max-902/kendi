import { motion, AnimatePresence } from "motion/react";
import { Cpu, Code, PieChart, Layers, Instagram, Users, BookOpen, X, ExternalLink } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { cn } from "../lib/utils";
import { useTranslation } from "../lib/LanguageContext";

const INITIAL_BRANCHES = [
  {
    id: "ia",
    title: "Développement de l'IA",
    icon: (
      <svg viewBox="0 0 500 400" className="w-full h-full p-4" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left 'BTS' serif text */}
        <text x="40" y="225" fontFamily="Georgia, 'Times New Roman', serif" fontSize="96" fontWeight="900" fill="#0f172a" letterSpacing="2">BTS</text>
        
        {/* Right 'DIA' serif text */}
        <text x="330" y="225" fontFamily="Georgia, 'Times New Roman', serif" fontSize="96" fontWeight="900" fill="#0f172a" letterSpacing="2">DIA</text>
        
        {/* Robot / Shield Emblem in Center */}
        <g transform="translate(195, 110)">
          {/* Hexagon icon shield outer sleeve */}
          <rect width="110" height="110" rx="28" fill="#1e293b" />
          
          {/* Cyber robot silhouette */}
          {/* Body/Shoulders */}
          <path d="M25 90 C25 72, 35 64, 55 64 C75 64, 85 72, 85 90 L85 110 L25 110 Z" fill="#94a3b8" />
          <path d="M40 70 L48 85 H62 L70 70" stroke="#f1f5f9" strokeWidth="1.5" fill="none" opacity="0.6" />
          
          {/* Neck */}
          <rect x="50" y="52" width="10" height="14" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
          
          {/* Cyborg Head */}
          <rect x="42" y="24" width="26" height="32" rx="12" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
          
          {/* Robot eyes (glowing light blue) */}
          <circle cx="50" cy="36" r="2.5" fill="#38bdf8" />
          <circle cx="60" cy="36" r="2.5" fill="#38bdf8" />
          {/* Robot forehead lines */}
          <path d="M47 30 Q55 28 63 30" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
          {/* Ears / Side receivers */}
          <rect x="38" y="32" width="4" height="14" rx="2" fill="#94a3b8" />
          <rect x="68" y="32" width="4" height="14" rx="2" fill="#94a3b8" />

          {/* Hands holding Glowing brain */}
          {/* Red glowing brain lobes */}
          <path d="M48 94 C44 91, 44 85, 49 82 Q55 83 61 82 C66 85, 66 91, 62 94 Z" fill="#f43f5e" opacity="0.85" />
          <path d="M49 82 C49 76, 52 74, 55 77 C58 74, 61 76, 61 82 Z" fill="#fb7185" opacity="0.9" />
          {/* Brain sulcus lines glowing white */}
          <path d="M51 86 Q55 89 59 86" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.9" />
          <path d="M52 81 H58" stroke="#fff" strokeWidth="1" fill="none" opacity="0.9" />

          {/* Metallic cyber hands cupping brain */}
          <path d="M34 100 Q40 88 47 90" stroke="#475569" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M76 100 Q70 88 63 90" stroke="#475569" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
        
        {/* Subtitle text */}
        <text x="250" y="275" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="15" fontWeight="900" fill="#475569" letterSpacing="0.5">ARTIFICIAL INTELLIGENCE DEVELOPMENT TEAM</text>
      </svg>
    ),
    color: "bg-sky-500",
    lightColor: "bg-sky-50",
    textColor: "text-sky-600",
    desc: "Cette branche est dédiée à la recherche fondamentale et technique, préparant les experts à concevoir les modèles d'intelligence artificielle de demain.",
    topics: ["Machine Learning", "Vision par Ordinateur", "NLP"],
    instagram: "https://www.instagram.com/bts__dia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    modulesYear1: ["Algèbre Linéaire", "Python Base", "Statistiques"],
    modulesYear2: ["Deep Learning", "TensorFlow", "Projet Fin d'Étude"],
    studentsYear1: 28,
    studentsYear2: 18,
    studentsCount: 46
  },
  {
    id: "ai",
    title: "Développement AI",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 4L56 18V46L32 60L8 46V18L32 4Z" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M22 24L14 32L22 40" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 24L50 32L42 40" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M36 20L28 44" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
      </svg>
    ),
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    desc: "Focalisée sur l'aspect pratique et applicatif, cette branche forme au développement de solutions logicielles intégrant l'IA.",
    topics: ["APIs IA", "Fullstack", "MLOps"],
    instagram: "https://instagram.com/alkendi_ai",
    modulesYear1: ["Web Fondamentaux", "JavaScript Expert", "UX Design"],
    modulesYear2: ["NextJS & AI", "Cloud Deployment", "Microservices"],
    studentsYear1: 55,
    studentsYear2: 47,
    studentsCount: 102
  },
  {
    id: "cg",
    title: "Comptabilité et Gestion",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 4L56 18V46L32 60L8 46V18L32 4Z" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M20 40V34" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M28 40V28" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M36 40V22" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M44 40V16" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M16 44H48" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M18 36L26 26L34 30L46 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        <circle cx="46" cy="16" r="2" fill="currentColor" />
      </svg>
    ),
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-600",
    desc: "De la finance d'entreprise à l'audit, cette filière forme les gestionnaires capables d'évoluer dans un environnement technologique complexe.",
    topics: ["Audit", "Droit des Affaires", "Finance"],
    instagram: "https://instagram.com/alkendi_cg",
    modulesYear1: ["Économie", "Comptabilité 1", "Droit Civil"],
    modulesYear2: ["Audit Financiers", "Management", "Contrôle Gestion"],
    studentsYear1: 58,
    studentsYear2: 50,
    studentsCount: 108
  }
];

const ACADEMIC_YEARS = [
  { id: "1", label: "1ère Année", key: "modulesYear1" },
  { id: "2", label: "2ème Année", key: "modulesYear2" },
];

export default function Branches() {
  const { user } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedYearIndex, setSelectedYearIndex] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { t, language } = useTranslation();

  const getTranslatedBranch = (branch: typeof INITIAL_BRANCHES[0], lang: string) => {
    if (branch.id === "ia") {
      return {
        ...branch,
        title: lang === "ar" ? "تطوير الذكاء الاصطناعي" : lang === "en" ? "AI & Neural Tech Development" : "Développement de l'IA",
        desc: lang === "ar" 
          ? "هذا المسار مخصص للأبحاث الأساسية والتطبيقية، لتمكين الخبراء والطلاب من ابتكار وتصميم نماذج الغد الذكية." 
          : lang === "en" 
          ? "This branch is dedicated to fundamental and technical research, training experts to build tomorrow's intelligent models." 
          : "Cette branche est dédiée à la recherche fondamentale et technique, préparant les experts à concevoir les modèles d'intelligence artificielle de demain.",
        topics: lang === "ar" ? ["تعلم الآلة - ML", "رؤية الحاسوب", "معالجة اللغة - NLP"] : lang === "en" ? ["Machine Learning", "Computer Vision", "NLP Engineering"] : ["Machine Learning", "Vision par Ordinateur", "NLP"],
        modulesYear1: lang === "ar" ? ["الجبر الخطي", "أساسيات بايثون", "الإحصاء والاحتمالات"] : lang === "en" ? ["Linear Algebra", "Python Foundation", "Probabilities & Stats"] : ["Algèbre Linéaire", "Python Base", "Statistiques"],
        modulesYear2: lang === "ar" ? ["التعلم العميق", "مكتبة TensorFlow", "مشروع نهاية التخرج"] : lang === "en" ? ["Deep Learning", "TensorFlow AI", "Final Graduation Project"] : ["Deep Learning", "TensorFlow", "Projet Fin d'Étude"],
      };
    }
    if (branch.id === "ai") {
      return {
        ...branch,
        title: lang === "ar" ? "هندسة برمجيات الذكاء الاصطناعي" : lang === "en" ? "Fullstack AI Development" : "Développement AI",
        desc: lang === "ar" 
          ? "نهدف عبر هذا المسلك التطبيقي لتخريج مبرمجين متمكنين من برمجيات الويب الحديثة وحلول الـ Cloud والسحاب." 
          : lang === "en" 
          ? "Focused on practical software design, this branch nurtures talents to build fullscale web applications integrating advanced AI models." 
          : "Focalisée sur l'aspect pratique et applicatif, cette branche forme au développement de solutions logicielles intégrant l'IA.",
        topics: lang === "ar" ? ["واجهات APIs الذكية", "الويب المتكامل Javascript", "عمليات تعلم الآلة MLOps"] : lang === "en" ? ["Cognitive AI APIs", "Fullstack Development", "MLOps Cloud"] : ["APIs IA", "Fullstack", "MLOps"],
        modulesYear1: lang === "ar" ? ["أساسيات الويب", "احتراف Javascript", "تجربة المستخدم UX"] : lang === "en" ? ["Web Core Foundations", "JavaScript Advanced", "UX/UI Design"] : ["Web Fondamentaux", "JavaScript Expert", "UX Design"],
        modulesYear2: lang === "ar" ? ["أطر عمل NextJS", "البنى السحابية Cloud", "بنية الخدمات المصغرة Microservices"] : lang === "en" ? ["Next.js & AI Apps", "Cloud Services Deployment", "Microservices Architecture"] : ["NextJS & AI", "Cloud Deployment", "Microservices"],
      };
    }
    // cg
    return {
      ...branch,
      title: lang === "ar" ? "المحاسبة الإدارية والمالية" : lang === "en" ? "Accounting & Management" : "Comptabilité et Gestion",
      desc: lang === "ar" 
        ? "من المحاسبة التحليلية وتسيير ميزانيات الشركات، نوائم المهارات الحسابية والتقييمية مع متطلبات عالم الأعمال الحديث." 
        : lang === "en" 
        ? "From corporate finance to analytics auditing, this curriculum trains modern administrators to operate in challenging environments." 
        : "De la finance d'entreprise à l'audit, cette filière forme les gestionnaires cadres capables d'évoluer dans un environnement moderne.",
      topics: lang === "ar" ? ["التدقيق والمراقبة", "قانون الأعمال والشركات", "المالية والتسيير العام"] : lang === "en" ? ["Financial Auditing", "Business Corporate Law", "Corporate Finance"] : ["Audit", "Droit des Affaires", "Finance"],
      modulesYear1: lang === "ar" ? ["الاقتصاد الوطني والمالي", "قوانين المحاسبة العامة 1", "القانون التجاري والمدني"] : lang === "en" ? ["Macro-Economics", "Principles of Accounting 1", "Civil Business Law"] : ["Économie", "Comptabilité 1", "Droit Civil"],
      modulesYear2: lang === "ar" ? ["التدقيق والتقييم المالي", "المنهج العملي للإدارة", "مراقبة التسيير الإداري"] : lang === "en" ? ["Financial Audits", "Strategic Management", "Audits & Control"] : ["Audit Financiers", "Management", "Contrôle Gestion"],
    };
  };

  const currentRawBranch = INITIAL_BRANCHES.find(b => b.id === selectedBranch);
  const currentBranch = currentRawBranch ? getTranslatedBranch(currentRawBranch, language) : null;

  const handleYearClick = (branchId: string, yearIdx: number) => {
    setSelectedBranch(branchId);
    setSelectedYearIndex(yearIdx);
    setShowDetailModal(true);
  };

  const getYearLabel = (id: string) => {
    if (id === "1") return language === "ar" ? "السنة الأولى" : language === "en" ? "1st Year" : "1ère Année";
    return language === "ar" ? "السنة الثانية" : language === "en" ? "2nd Year" : "2ème Année";
  };

  return (
    <div className="py-32 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-8"
          >
            <Layers size={14} />
            {language === "ar" ? "سلك التكوين المهني والأكاديمي (عامان)" : language === "en" ? "2-Year Academic Training Program" : "Système de Formation 2 Ans"}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-8xl font-display font-black text-slate-900 mb-8 uppercase tracking-tighter leading-none"
          >
            {language === "ar" ? "مسالكنا" : language === "en" ? "Our" : "Nos"} <span className="text-primary italic">{language === "ar" ? "والشعب الدراسية" : language === "en" ? "Branches" : "Filières"}</span>
          </motion.h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed uppercase tracking-tight">
            {language === "ar" 
              ? "يقدم كل مسلك تكوين في جمعية الكندي منهجاً متميزاً ومكثفاً على مدار سنتين من التحصيل والمواكبة." 
              : language === "en" 
              ? "Each stream at Al Kendi offers an excellence curriculum over 2 intensive years." 
              : "Chaque filière chez Al Kendi propose un cursus d'excellence sur 2 années intensives."}
          </p>
        </header>

        <div className="space-y-24">
          {INITIAL_BRANCHES.map((rawBranch, i) => {
            const branch = getTranslatedBranch(rawBranch, language);
            return (
              <motion.div 
                key={branch.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-slate-50 rounded-[3.5rem] p-8 sm:p-16 border border-slate-100 flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                  
                  <div className="lg:w-1/3 flex flex-col gap-6">
                    <div className={cn(
                      "w-full aspect-square rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 overflow-hidden",
                      branch.id === "ia" ? "bg-white border-2 border-slate-100" : branch.color + " text-white"
                    )}>
                      <div className={branch.id === "ia" ? "w-full h-full flex items-center justify-center p-0" : "scale-150"}>
                        {branch.icon}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {ACADEMIC_YEARS.map((year, idx) => (
                        <button 
                          key={year.id}
                          onClick={() => handleYearClick(branch.id, idx)}
                          className={cn(
                            "py-4 border rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2",
                            idx === 0 
                              ? "bg-white border-slate-100 text-slate-900 hover:border-primary hover:shadow-lg" 
                              : "bg-primary text-white border-primary shadow-lg shadow-primary/20 hover:scale-105"
                          )}
                        >
                          <BookOpen size={14} className={idx === 0 ? "text-primary" : "text-white"} />
                          {getYearLabel(year.id)}
                        </button>
                      ))}
                    </div>

                    {/* Student headcount details card */}
                    <div className="bg-white/80 border border-slate-200/60 rounded-3xl p-5 flex flex-col gap-3 text-xs tracking-wider">
                      <div className="flex items-center gap-2 text-slate-700 font-bold uppercase tracking-widest text-[9px]">
                        <Users size={14} className="text-primary animate-pulse" />
                        <span>{language === "ar" ? "إحصائيات المجموعات" : language === "en" ? "Student Breakdown" : "Effectifs Etudiants"}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/80 flex flex-col">
                          <span className="text-slate-400 text-[8px] font-bold uppercase tracking-widest mb-0.5">{language === "ar" ? "السنة 1" : "1ère Année"}</span>
                          <span className="text-sm font-display font-black text-slate-900">{branch.studentsYear1}</span>
                        </div>
                        <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/80 flex flex-col">
                          <span className="text-slate-400 text-[8px] font-bold uppercase tracking-widest mb-0.5">{language === "ar" ? "السنة 2" : "2ème Année"}</span>
                          <span className="text-sm font-display font-black text-slate-900">{branch.studentsYear2}</span>
                        </div>
                      </div>
                      <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Total:</span>
                        <span className="text-primary font-display font-black text-xs">{branch.studentsCount} {language === "ar" ? "طالب" : "élèves"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left relative z-10 flex flex-col justify-center">
                    <div className={cn("inline-block px-6 py-2 rounded-full mb-8 font-black text-[10px] uppercase tracking-[0.3em] border self-center lg:self-start", 
                      branch.id === "ia" ? "bg-primary/10 text-primary border-primary/20" : branch.lightColor + " " + branch.textColor + " border-current/20")}>
                      {language === "ar" ? `التخصص الدراسـي ${i + 1}` : language === "en" ? `Domain ${i + 1}` : `Domaine ${i + 1}`}
                    </div>
                    <h2 className="text-3xl sm:text-6xl font-display font-black text-slate-900 mb-8 uppercase tracking-tight leading-none text-left">{branch.title}</h2>
                    <p className="text-slate-600 mb-12 text-xl leading-relaxed font-medium text-left">{branch.desc}</p>
                    
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                      {branch.topics.map((topic, j) => (
                        <div key={j} className="flex items-center gap-3 text-slate-400 bg-white px-5 py-3 rounded-xl border border-slate-100 font-bold uppercase tracking-widest text-[10px]">
                          <div className={cn("w-2 h-2 rounded-full", branch.id === "ia" ? "bg-primary" : branch.color)} />
                          {topic}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center lg:justify-start mb-12">
                      <a 
                        href={branch.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-500/20 transition-all hover:scale-105"
                      >
                        <Instagram size={20} />
                        {language === "ar" ? "تصفح عبر إنستغرام" : language === "en" ? "View on Instagram" : "Voir sur Instagram"}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && currentBranch && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-20 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
            >
              <button 
                onClick={() => setShowDetailModal(false)}
                className="absolute top-6 right-6 sm:top-10 sm:right-10 p-3 text-slate-300 hover:text-slate-900 transition-colors z-20"
              >
                <X size={28} className="sm:size-8" />
              </button>

              <div className="flex flex-col md:flex-row gap-16 items-start text-left">
                <div className="flex-1 w-full animate-fade-in">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="px-5 py-2 bg-primary text-white rounded-full font-black uppercase tracking-widest text-[10px]">
                      {selectedYearIndex !== null && getYearLabel(ACADEMIC_YEARS[selectedYearIndex].id)}
                    </span>
                    <h3 className="text-3xl font-display font-black text-slate-900 uppercase tracking-tighter">
                      {currentBranch.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 w-full">
                    <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                      <div className="flex items-center gap-4 mb-8 text-primary">
                        <BookOpen size={24} />
                        <h4 className="font-black uppercase tracking-widest text-[10px]">
                          {language === "ar" ? "المقررات والوحدات المدرسية" : language === "en" ? "Studied Modules" : "Modules Étudiés"}
                        </h4>
                      </div>
                      <div className="space-y-4">
                        {selectedYearIndex !== null && (currentBranch[ACADEMIC_YEARS[selectedYearIndex].key as keyof typeof currentBranch] as string[]).map(m => (
                          <div key={m} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 text-sm font-bold text-slate-700">
                             <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                             {m}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl shadow-slate-900/20">
                        <div className="flex items-center gap-4 mb-6 opacity-60">
                          <Users size={24} />
                          <h4 className="font-black uppercase tracking-widest text-[10px]">
                            {language === "ar" ? "الطلاب النشطون" : language === "en" ? "Registered Students" : "Effectif Scolaire"}
                          </h4>
                        </div>
                        <div className="text-4xl sm:text-6xl font-display font-black leading-none mb-2 text-primary">
                          {selectedYearIndex === 0 ? currentBranch.studentsYear1 : (selectedYearIndex === 1 ? currentBranch.studentsYear2 : currentBranch.studentsCount)}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-6">
                          {selectedYearIndex !== null 
                            ? (language === "ar" ? `مسجل في ${getYearLabel(ACADEMIC_YEARS[selectedYearIndex].id)}` : language === "en" ? `Active in ${getYearLabel(ACADEMIC_YEARS[selectedYearIndex].id)}` : `Membres inscrits en ${getYearLabel(ACADEMIC_YEARS[selectedYearIndex].id)}`)
                            : (language === "ar" ? "طالب نشط مسجل" : language === "en" ? "Active Students" : "Étudiants Actifs")}
                        </span>

                        {/* Breakdown list inside the modal card */}
                        <div className="border-t border-slate-800/80 pt-6 mt-6 grid grid-cols-2 gap-4 text-xs font-bold text-slate-400">
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-1">
                              {language === "ar" ? "السنة الأولى" : language === "en" ? "1st Year" : "1ère Année"}
                            </div>
                            <div className="text-lg text-white font-display font-black">
                              {currentBranch.studentsYear1} <span className="text-xs font-sans font-medium text-slate-500">{language === "ar" ? "طالب" : "élèves"}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-1">
                              {language === "ar" ? "السنة الثانية" : language === "en" ? "2nd Year" : "2ème Année"}
                            </div>
                            <div className="text-lg text-white font-display font-black">
                              {currentBranch.studentsYear2} <span className="text-xs font-sans font-medium text-slate-500">{language === "ar" ? "طالب" : "élèves"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-6 pt-6 border-t border-slate-800/80 flex justify-between">
                          <span>Total:</span>
                          <span className="text-primary font-display font-black text-sm">{currentBranch.studentsCount} {language === "ar" ? "طالب نشط" : language === "en" ? "Active students" : "Inscrits au total"}</span>
                        </div>
                      </div>

                      <a 
                        href={currentBranch.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-10 bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-[2.5rem] group hover:scale-[1.02] transition-all shadow-2xl shadow-rose-500/20"
                      >
                        <div className="flex items-center gap-6">
                          <Instagram size={48} />
                          <div>
                            <h4 className="font-black uppercase tracking-widest text-[10px] mb-1 opacity-80">
                              {language === "ar" ? "منصات التواصل الاجتماعي" : language === "en" ? "Social Networks" : "Réseaux Sociaux"}
                            </h4>
                            <div className="text-2xl font-display font-black uppercase tracking-tighter">Instagram</div>
                          </div>
                        </div>
                        <ExternalLink size={24} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
