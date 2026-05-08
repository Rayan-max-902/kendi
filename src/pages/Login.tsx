import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { GraduationCap, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function Login() {
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
        setError("L'authentification par email n'est pas activée.");
      } else {
        setError("Email ou mot de passe incorrect.");
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
      setError("Erreur lors de la connexion avec Google.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-12 sm:p-16 rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 relative z-10"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-4xl font-display font-black text-slate-900 mb-2 uppercase tracking-tighter">Bienvenue</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Espace Al Kendi Connect</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-tight">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-5 bg-white border-2 border-slate-100 hover:border-primary rounded-2xl font-black flex items-center justify-center gap-4 transition-all uppercase tracking-widest text-[10px]"
          >
            <img src="https://www.gstatic.com/firebase/dashboards/images/google-logo.svg" className="w-5 h-5" alt="Google" />
            Continuer avec Google
          </button>

          <div className="flex items-center gap-4 text-slate-200 py-2">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">ou via email</span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 mt-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                placeholder="Votre mot de passe"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {loading ? "Connexion..." : "Se Connecter"}
            <ArrowRight size={24} />
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-slate-400 font-medium uppercase tracking-tight text-[10px]">
            Pas encore membre ?{" "}
            <Link to="/signup" className="text-primary font-black ml-1 hover:underline underline-offset-4">
              Créer un compte
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
