import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { UserPlus, Mail, Lock, User, GraduationCap, AlertCircle, CheckCircle2, Phone, ArrowRight } from "lucide-react";
import { auth, db, googleProvider } from "../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithPopup, OAuthProvider } from "firebase/auth";
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

  const handleAppleSignup = async () => {
    try {
      const appleProvider = new OAuthProvider("apple.com");
      const result = await signInWithPopup(auth, appleProvider);
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
      setError(language === "ar" ? "فشل إنشاء الحساب عبر Apple" : language === "en" ? "Error signing up with Apple." : "Erreur lors de l'inscription avec Apple.");
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

        <div className="space-y-4 mb-8">
          <button 
            type="button"
            onClick={handleGoogleSignup}
            className="w-full py-4 bg-white border-2 border-slate-100 hover:border-primary rounded-2xl font-black flex items-center justify-center gap-4 transition-all uppercase tracking-widest text-[11px]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            {language === "ar" ? "التسجيل باستخدام Google" : language === "en" ? "Register with Google" : "S'inscrire avec Google"}
          </button>

          <button 
            type="button"
            onClick={handleAppleSignup}
            className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-4 transition-all uppercase tracking-widest text-[11px]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
            </svg>
            {language === "ar" ? "التسجيل باستخدام Apple" : language === "en" ? "Register with Apple" : "S'inscrire avec Apple"}
          </button>

          <div className="flex items-center gap-4 text-slate-200 py-2">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
              {language === "ar" ? "أو بواسطة البريد" : language === "en" ? "or via email" : "ou via email"}
            </span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>
        </div>

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
