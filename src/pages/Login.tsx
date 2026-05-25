import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { GraduationCap, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, OAuthProvider } from "firebase/auth";
import { useTranslation } from "../lib/LanguageContext";

export default function Login() {
  const { t, language } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError(language === "ar" ? "تسجيل الدخول بالبريد الإلكتروني غير مفعّل حالياً." : language === "en" ? "Email sign-in is not enabled currently." : "L'authentification par email n'est pas activée.");
      } else {
        setError(language === "ar" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : language === "en" ? "Incorrect email or password." : "Email ou mot de passe incorrect.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(language === "ar" ? "حدث خطأ أثناء الاتصال بحساب Google." : language === "en" ? "Error connecting with Google." : "Erreur lors de la connexion avec Google.");
    }
  };

  const handleAppleLogin = async () => {
    try {
      const appleProvider = new OAuthProvider("apple.com");
      await signInWithPopup(auth, appleProvider);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(language === "ar" ? "حدث خطأ أثناء الاتصال بحساب Apple." : language === "en" ? "Error connecting with Apple." : "Erreur lors de la connexion avec Apple.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-12 sm:p-16 rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 text-left"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-4xl font-display font-black text-slate-900 mb-2 uppercase tracking-tighter">
            {language === "ar" ? "مرحباً بك" : language === "en" ? "Welcome Back" : "Bienvenue"}
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            {language === "ar" ? "بوابة شباب الكندي للأعضاء" : language === "en" ? "Al Kendi Member Portal" : "Espace Al Kendi Connect"}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-tight">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white border-2 border-slate-100 hover:border-primary rounded-2xl font-black flex items-center justify-center gap-4 transition-all uppercase tracking-widest text-[11px]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            {language === "ar" ? "المتابعة باستخدام Google" : language === "en" ? "Continue with Google" : "Continuer avec Google"}
          </button>

          <button 
            type="button"
            onClick={handleAppleLogin}
            className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-4 transition-all uppercase tracking-widest text-[11px]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
            </svg>
            {language === "ar" ? "المتابعة باستخدام Apple" : language === "en" ? "Continue with Apple" : "Continuer avec Apple"}
          </button>

          <div className="flex items-center gap-4 text-slate-200 py-2">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
              {language === "ar" ? "أو بواسطة البريد" : language === "en" ? "or via email" : "ou via email"}
            </span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 mt-6 border-0">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              {language === "ar" ? "البريد الإلكتروني" : language === "en" ? "Email Address" : "Email"}
            </label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300 font-sans"
                placeholder="votre@email.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300 font-sans"
                placeholder={language === "ar" ? "أدخل كلمة المرور" : language === "en" ? "Enter your password" : "Votre mot de passe"}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {loading 
              ? (language === "ar" ? "جاري الدخول..." : language === "en" ? "Signing in..." : "Connexion...") 
              : (language === "ar" ? "تسجيل الدخول" : language === "en" ? "Sign In" : "Se Connecter")}
            <ArrowRight size={24} className={language === "ar" ? "rotate-180" : ""} />
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-slate-400 font-medium uppercase tracking-tight text-[10px]">
            {language === "ar" ? "ليس لديك حساب بعد؟" : language === "en" ? "Not a member yet?" : "Pas encore membre ?"}
            <Link to="/signup" className="text-primary font-black ml-2 hover:underline underline-offset-4">
              {language === "ar" ? "إنشاء حساب جديد" : language === "en" ? "Create an account" : "Créer un compte"}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
