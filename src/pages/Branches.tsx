import { motion, AnimatePresence } from "motion/react";
import { Cpu, Code, PieChart, Layers, Instagram, Users, BookOpen, X, ExternalLink } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { cn } from "../lib/utils";

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

  const handleYearClick = (branchId: string, yearIdx: number) => {
    setSelectedBranch(branchId);
    setSelectedYearIndex(yearIdx);
    setShowDetailModal(true);
  };

  const currentBranch = INITIAL_BRANCHES.find(b => b.id === selectedBranch);

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
            Système de Formation 2 Ans
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-8xl font-display font-black text-slate-900 mb-8 uppercase tracking-tighter leading-none"
          >
            Nos <span className="text-primary italic">Filières</span>
          </motion.h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed uppercase tracking-tight">
            Chaque filière chez Al Kendi propose un cursus d'excellence sur 2 années intensives.
          </p>
        </header>

        <div className="space-y-24">
          {INITIAL_BRANCHES.map((branch, i) => {
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
                            "py-5 border rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2",
                            idx === 0 
                              ? "bg-white border-slate-100 text-slate-900 hover:border-primary hover:shadow-lg" 
                              : "bg-primary text-white border-primary shadow-lg shadow-primary/20 hover:scale-105"
                          )}
                        >
                          <BookOpen size={14} className={idx === 0 ? "text-primary" : "text-white"} />
                          {year.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left relative z-10 flex flex-col justify-center">
                    <div className={cn("inline-block px-6 py-2 rounded-full mb-8 font-black text-[10px] uppercase tracking-[0.3em] border self-center lg:self-start", 
                      branch.id === "ia" ? "bg-primary/10 text-primary border-primary/20" : branch.lightColor + " " + branch.textColor + " border-current/20")}>
                      Domaine {i + 1}
                    </div>
                    <h2 className="text-3xl sm:text-6xl font-display font-black text-slate-900 mb-8 uppercase tracking-tight leading-none">{branch.title}</h2>
                    <p className="text-slate-600 mb-12 text-xl leading-relaxed font-medium">{branch.desc}</p>
                    
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
                        Voir sur Instagram
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

              <div className="flex flex-col md:flex-row gap-16 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-5 py-2 bg-primary text-white rounded-full font-black uppercase tracking-widest text-[10px]">
                      {selectedYearIndex !== null && ACADEMIC_YEARS[selectedYearIndex].label}
                    </span>
                    <h3 className="text-3xl font-display font-black text-slate-900 uppercase tracking-tighter">
                      {currentBranch.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
                    <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                      <div className="flex items-center gap-4 mb-8 text-primary">
                        <BookOpen size={24} />
                        <h4 className="font-black uppercase tracking-widest text-[10px]">Modules Étudiés</h4>
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
                          <h4 className="font-black uppercase tracking-widest text-[10px]">Effectif Scolaire</h4>
                        </div>
                        <div className="text-4xl sm:text-6xl font-display font-black leading-none mb-2">
                          {currentBranch.studentsCount}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Étudiants Actifs</span>
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
                            <h4 className="font-black uppercase tracking-widest text-[10px] mb-1 opacity-80">Réseaux Sociaux</h4>
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
