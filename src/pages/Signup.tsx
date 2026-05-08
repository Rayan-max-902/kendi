import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { UserPlus, Mail, Lock, User, GraduationCap, AlertCircle, CheckCircle2, Phone, ArrowRight } from "lucide-react";
import { auth, db, googleProvider } from "../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { cn, handleFirestoreError, OperationType } from "../lib/utils";

const FILIERES = ["Développement de l'IA", "Développement AI", "Comptabilité et Gestion"];

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "teacher",
    filiere: "Développement App"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.name });
      
      try {
        await sendEmailVerification(user);
      } catch (emailErr) {
        console.warn("Erreur d'envoi d'email de vérification:", emailErr);
      }

      // Save user profile in Firestore
      const userPath = `users/${user.uid}`;
      try {
        await setDoc(doc(db, userPath), {
          uid: user.uid,
          email: user.email,
          displayName: formData.name,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          filiere: formData.filiere,
          createdAt: new Date().toISOString()
        });
      } catch (firestoreErr) {
        handleFirestoreError(firestoreErr, OperationType.WRITE, userPath);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Signup error details:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("L'authentification par email n'est pas activée.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Cet email est déjà utilisé.");
      } else if (err.code === 'auth/weak-password') {
        setError("Le mot de passe est trop court.");
      } else {
        setError(err.message || "Une erreur est survenue lors de l'inscription.");
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
      setError("Erreur lors de l'inscription avec Google.");
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
          <h1 className="text-4xl font-display font-black text-slate-900 mb-4 uppercase tracking-tighter">Vérifiez vos emails</h1>
          <p className="text-slate-500 mb-10 leading-relaxed font-medium">
            Un lien de confirmation a été envoyé à <strong>{formData.email}</strong>. Activez votre compte pour rejoindre Al Kendi.
          </p>
          <Link 
            to="/login"
            className="inline-block w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-105"
          >
            Se Connecter
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white p-12 sm:p-20 rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 relative z-10"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-4xl font-display font-black text-slate-900 mb-2 uppercase tracking-tighter">Devenir Membre</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Rejoignez l'élite Al Kendi</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-tight">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom complet</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
              <div className="relative group">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="tel" 
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="+212 ..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="Min. 6 car."
                  minLength={6}
                />
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="Répétez le mot de passe"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 text-center block">Votre Filière d'intérêt</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {FILIERES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, filiere: f }))}
                  className={cn(
                    "px-4 py-5 rounded-2xl font-black text-[10px] uppercase tracking-tighter transition-all border-2",
                    formData.filiere === f 
                      ? "bg-primary text-white border-primary shadow-2xl shadow-primary/20 scale-105" 
                      : "bg-slate-50 text-slate-500 border-transparent hover:border-primary/20"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-8"
          >
            {loading ? "Création..." : (
              <>
                Finaliser l'Inscription
                <ArrowRight size={24} />
              </>
            )}
          </button>
        </form>

        <div className="mt-16 text-center border-t border-slate-50 pt-12">
          <p className="text-slate-400 font-medium uppercase tracking-tight text-[10px]">
            Déjà membre de l'association ?{" "}
            <Link to="/login" className="text-primary font-black ml-1 hover:underline underline-offset-4">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
