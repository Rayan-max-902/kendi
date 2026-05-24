import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { UserPlus, Mail, Lock, User, GraduationCap, AlertCircle, CheckCircle2, Phone, ArrowRight } from "lucide-react";
import { auth, db, googleProvider } from "../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { cn, handleFirestoreError, OperationType } from "../lib/utils";
import CustomSelect from "../components/CustomSelect";
import { useTranslation } from "../lib/LanguageContext";

export default function Signup() {
  const { t, language } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "teacher",
    filiere: "Développement de l'IA",
    level: "1ère Année"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const translatedFilieres = [
    { value: "Développement de l'IA", label: language === "ar" ? "تطوير الذكاء الاصطناعي" : language === "en" ? "AI & Neural Tech" : "Développement de l'IA" },
    { value: "Développement AI", label: language === "ar" ? "هندسة تطبيقات الذكاء الاصطناعي" : language === "en" ? "Fullstack AI Systems" : "Développement AI" },
    { value: "Comptabilité et Gestion", label: language === "ar" ? "المحاسبة والتسيير" : language === "en" ? "Accounting & Management" : "Comptabilité et Gestion" },
  ];

  const translatedLevels = [
    { value: "1ère Année", label: language === "ar" ? "السنة أولى تكوين" : language === "en" ? "1st Academic Year" : "1ère Année" },
    { value: "2ème Année", label: language === "ar" ? "السنة ثانية تكوين" : language === "en" ? "2nd Academic Year" : "2ème Année" },
  ];

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(language === "ar" ? "كلمتا المرور غير متطابقتين." : language === "en" ? "Passwords do not match." : "Les mots de passe ne correspondent pas.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.name });
      
      try {
        await sendEmailVerification(user);
      } catch (emailErr) {
        console.warn("Erreur d'envoi d'email de vérification:", emailErr);
      }

      // 2. Save user profile in Firestore
      const userPath = `users/${user.uid}`;
      try {
        await setDoc(doc(db, userPath), {
          uid: user.uid,
          email: user.email,
          displayName: formData.name,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          filiere: formData.filiere,
          level: formData.level,
          createdAt: new Date().toISOString()
        });
      } catch (firestoreErr) {
        handleFirestoreError(firestoreErr, OperationType.WRITE, userPath);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Signup error details:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError(language === "ar" ? "تسجيل الدخول بالبريد الإلكتروني غير مفعّل حالياً." : language === "en" ? "Email sign-in is not enabled currently." : "L'authentification par email n'est pas activée.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError(language === "ar" ? "هذا البريد الإلكتروني مستخدم بالفعل." : language === "en" ? "This email is already registered." : "Cet email est déjà utilisé.");
      } else if (err.code === 'auth/weak-password') {
        setError(language === "ar" ? "كلمة المرور قصيرة جداً (مطلوب 6 رموز على الأقل)." : language === "en" ? "Password is too short (min. 6 chars)." : "Le mot de passe est trop court.");
      } else {
        setError(err.message || (language === "ar" ? "حدث خطأ غير متوقع أثناء التسجيل." : language === "en" ? "An unexpected error occurred during signup." : "Une erreur est survenue lors de l'inscription."));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userPath = `users/${user.uid}`;
      await setDoc(doc(db, userPath), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: "student",
        createdAt: new Date().toISOString()
      }, { merge: true });

      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(language === "ar" ? "فشل إنشاء الحساب عبر Google" : language === "en" ? "Error signing up with Google." : "Erreur lors de l'inscription avec Google.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white p-12 rounded-[4rem] shadow-2xl text-center relative z-10"
        >
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
            <CheckCircle2 size={56} />
          </div>
          <h1 className="text-4xl font-display font-black text-slate-900 mb-4 uppercase tracking-tighter">
            {language === "ar" ? "تأكيد بريدك الإلكتروني" : language === "en" ? "Verify your email" : "Vérifiez vos emails"}
          </h1>
          <p className="text-slate-500 mb-10 leading-relaxed font-medium">
            {language === "ar" 
              ? `تم إرسال رابط تأكيد الحساب إلى البريد الإلكتروني ${formData.email}. يرجى تفعيله لبدء تفاعلاتك في جمعية الكندي.` 
              : language === "en" 
              ? `A confirmation link was successfully sent to ${formData.email}. Activate your account to join Al Kendi.` 
              : `Un lien de confirmation a été envoyé à ${formData.email}. Activez votre compte pour rejoindre Al Kendi.`}
          </p>
          <Link 
            to="/login"
            className="inline-block w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-105"
          >
            {language === "ar" ? "تسجيل الدخول" : language === "en" ? "Sign In to Portal" : "Se Connecter"}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white p-12 sm:p-20 rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 relative z-10"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-4xl font-display font-black text-slate-900 mb-2 uppercase tracking-tighter">
            {language === "ar" ? "الانضمام لعضوية الجمعية" : language === "en" ? "Become a Member" : "Devenir Membre"}
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            {language === "ar" ? "انضم إلى صفوة متعلمي ومبتكري الذكاء الاصطناعي بروح الكندي" : language === "en" ? "Join the Al Kendi network of excellence" : "Rejoignez l'élite Al Kendi"}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-tight">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-10 border-0">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {language === "ar" ? "الاسم الكامل" : language === "en" ? "Full Name" : "Nom complet"}
              </label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300 font-sans"
                  placeholder={language === "ar" ? "مثال: ريان المعتديدي" : "Jean Dupont"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {language === "ar" ? "البريد الإلكتروني" : language === "en" ? "Email Address" : "Email"}
              </label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300 font-sans"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {language === "ar" ? "الهاتف" : language === "en" ? "Phone Number" : "Téléphone"}
              </label>
              <div className="relative group">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="tel" 
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300 font-sans"
                  placeholder="+212 ..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {language === "ar" ? "كلمة المرور" : language === "en" ? "Password" : "Mot de passe"}
              </label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300 font-sans"
                  placeholder={language === "ar" ? "6 رموز كحد أدنى" : language === "en" ? "Min. 6 characters" : "Min. 6 car."}
                  minLength={6}
                />
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {language === "ar" ? "تأكيد كلمة المرور" : language === "en" ? "Confirm Password" : "Confirmer mot de passe"}
              </label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300 font-sans"
                  placeholder={language === "ar" ? "أعد كتابة كلمة المرور" : language === "en" ? "Repeat password" : "Répétez le mot de passe"}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {language === "ar" ? "الشعبة أو التخصص المهتم به" : language === "en" ? "Major Subject Group" : "Filière d'intérêt"}
              </label>
              <CustomSelect
                value={formData.filiere}
                onChange={(val) => setFormData(prev => ({ ...prev, filiere: val }))}
                options={translatedFilieres}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {language === "ar" ? "مستوى التكوين الدراسي" : language === "en" ? "Current Academic Level" : "Niveau d'études"}
              </label>
              <CustomSelect
                value={formData.level}
                onChange={(val) => setFormData(prev => ({ ...prev, level: val }))}
                options={translatedLevels}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-8 font-sans"
          >
            {loading ? (language === "ar" ? "جاري الإنشاء..." : language === "en" ? "Creating..." : "Création...") : (
              <>
                {language === "ar" ? "إتمام وتأكيد الحساب" : language === "en" ? "Complete Registration" : "Finaliser l'Inscription"}
                <ArrowRight size={24} className={language === "ar" ? "rotate-180" : ""} />
              </>
            )}
          </button>
        </form>

        <div className="mt-16 text-center border-t border-slate-50 pt-12">
          <p className="text-slate-400 font-medium uppercase tracking-tight text-[10px]">
            {language === "ar" ? "عضو مسجل مسبقاً في الجمعية؟" : language === "en" ? "Already an association member?" : "Déjà membre de l'association ?"}
            <Link to="/login" className="text-primary font-black ml-2 hover:underline underline-offset-4">
              {language === "ar" ? "تسجيل الدخول" : language === "en" ? "Sign In" : "Se connecter"}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
