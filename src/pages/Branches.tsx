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
    icon: <Cpu size={40} />,
    color: "bg-sky-500",
    lightColor: "bg-sky-50",
    textColor: "text-sky-600",
    desc: "Cette branche est dédiée à la recherche fondamentale et technique, préparant les experts à concevoir les modèles d'intelligence artificielle de demain.",
    topics: ["Machine Learning", "Vision par Ordinateur", "NLP"],
    instagram: "https://instagram.com/alkendi_ia",
    modulesYear1: ["Algèbre Linéaire", "Python Base", "Statistiques"],
    modulesYear2: ["Deep Learning", "TensorFlow", "Projet Fin d'Étude"],
    studentsCount: 120
  },
  {
    id: "ai",
    title: "Développement AI",
    icon: <Code size={40} />,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    desc: "Focalisée sur l'aspect pratique et applicatif, cette branche forme au développement de solutions logicielles intégrant l'IA.",
    topics: ["APIs IA", "Fullstack", "MLOps"],
    instagram: "https://instagram.com/alkendi_ai",
    modulesYear1: ["Web Fondamentaux", "JavaScript Expert", "UX Design"],
    modulesYear2: ["NextJS & AI", "Cloud Deployment", "Microservices"],
    studentsCount: 150
  },
  {
    id: "cg",
    title: "Comptabilité et Gestion",
    icon: <PieChart size={40} />,
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-600",
    desc: "De la finance d'entreprise à l'audit, cette filière forme les gestionnaires capables d'évoluer dans un environnement technologique complexe.",
    topics: ["Audit", "Droit des Affaires", "Finance"],
    instagram: "https://instagram.com/alkendi_cg",
    modulesYear1: ["Économie", "Comptabilité 1", "Droit Civil"],
    modulesYear2: ["Audit Financiers", "Management", "Contrôle Gestion"],
    studentsCount: 95
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
                      branch.id === "ia" ? "bg-primary text-white" : branch.color + " text-white"
                    )}>
                      <div className="scale-150">{branch.icon}</div>
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
                        <div className="text-4xl sm:text-6xl font-display font-black leading-none mb-2">
                          {currentBranch.studentsCount}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                          {language === "ar" ? "طالب نشط مسجل" : language === "en" ? "Active Students" : "Étudiants Actifs"}
                        </span>
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
