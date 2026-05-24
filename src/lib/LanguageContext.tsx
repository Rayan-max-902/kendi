import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "fr" | "en" | "ar";

const translations = {
  fr: {
    // Navbar
    nav_home: "Accueil",
    nav_announcements: "Annonces",
    nav_branches: "Filières",
    nav_community: "Communauté",
    nav_admin: "Admin",
    nav_login: "Connexion",
    nav_register: "S'inscrire",
    nav_logout: "Déconnexion",
    association: "Association",

    // Common/Actions
    close: "Fermer",
    submit: "Valider",
    cancel: "Annuler",
    loading: "Chargement...",
    save: "Enregistrer",
    add: "Ajouter",
    all_rights_reserved: "Tous droits réservés.",
    created_by: "Site créé par",

    // Footer
    admissions_open: "Adhésions Ouvertes",
    footer_adventure_title: "L'Aventure Commence",
    footer_adventure_subtitle: "Maintenant",
    become_member: "Devenir Membre",

    // Home Page
    hero_badge: "L'avenir commence ici",
    hero_title_1: "Association des",
    hero_title_2: "Jeunes",
    hero_title_3: "Al Kendi",
    interrogate_ai: "Interroger l'IA",
    community_btn: "Rejoindre la Communauté",
    
    // Home Stats
    stats_members: "Membres Actifs",
    stats_courses: "Cours Partagés",
    stats_events: "Événements",
    stats_success: "Taux de Réussite",

    // Home Announcements
    news_tag: "Actualités",
    news_title_1: "Nos Dernières",
    news_title_2: "Annonces",
    news_view_details: "Voir les détails",
    news_date: "Date de publication",

    // Home About
    about_tag: "À Propos de Nous",
    about_title_1: "Une Vision",
    about_title_2: "Pour L'Avenir",
    about_title_3: "Informatique",
    about_text_1: "L'Association des Jeunes Al Kendi repousse les limites de l'éducation en informatique, IA et gestion.",
    about_text_2: "Nous formons une communauté d'apprenants, d'auditeurs et d'experts passionnés.",
    about_card_title_1: "Synergie Unique",
    about_card_desc_1: "Fusion pratique entre la finance comptable et les technologies d'intelligence artificielle.",
    about_card_title_2: "Support Continu",
    about_card_desc_2: "Programmes de mentorat et tutorat d'excellence.",

    // Home Expertise
    expert_tag: "Nos Domaines",
    expert_title_1: "L'Expertise au Service",
    expert_title_2: "de votre",
    expert_title_3: "Ambition",
    expert_desc: "Découvrez des programmes rigoureux conçus pour propulser votre carrière académique et professionnelle.",
    expert_ia_title: "Académie IA & Dev",
    expert_ia_desc: "Cours de programmation de pointe : Deep Learning, Architecture Web et algorithmes de pointe.",
    expert_cg_title: "Compta, Gestion & Audit",
    expert_cg_desc: "Maîtrisez les processus comptables modernes, le contrôle de gestion et la finance analytique.",

    // Home Testimonials
    test_tag: "Témoignages",
    test_title_1: "Ce que nos membres",
    test_title_2: "disent de nous",
    test_add_rating: "Laisser un avis",
    test_name_ph: "Votre nom",
    test_comment_ph: "Votre commentaire...",
    test_submit: "Soumettre mon avis",
    test_success_msg: "Merci pour votre précieux avis !",

    // Home FAQ
    faq_title: "Questions Fréquemment Posées",
    faq_q1: "Comment s'inscrire ?",
    faq_a1: "Cliquez sur 'S'inscrire' en haut du site et remplissez le questionnaire d'informations.",
    faq_q2: "Puis-je suivre les cours d'IA et de Compta en même temps ?",
    faq_a2: "Absolument ! La complémentarité est l'un des piliers technologiques majeurs favorisés par Al Kendi.",
    faq_q3: "Les certifications sont-elles gratuites ?",
    faq_a3: "Toutes nos formations internes et notre accompagnement sont entièrement gratuits pour nos membres actifs.",

    // Branches Page
    branches_title_1: "Nos",
    branches_title_2: "Filières",
    branches_subtitle: "Découvrez nos parcours d'excellence académique conçus pour l'avenir numérique.",
    branches_domain: "Domaine",
    branches_explore_course: "Explorer le programme",
    branches_students: "Étudiants Actifs",
    branches_semesters: "Semestres",
    branches_modules: "Modules",
    branches_hours: "Heures",
    branches_career: "Débouchés professionnels",
    branches_program_details: "Détails du Programme",

    // Announcements Page
    announcements_log: "Journal & ",
    announcements_title_2: "Actualités",
    announcements_desc: "Vivez les moments forts de l'Association Al Kendi au quotidien.",
    announcements_add_btn: "Publier une annonce",
    announcements_add_title: "Nouvelle Annonce",
    announcements_form_title: "Titre de l'annonce",
    announcements_form_content: "Contenu de l'annonce",
    announcements_form_category: "Catégorie",
    announcements_form_tag: "Tag",

    // Community Page
    community_title_1: "Espace",
    community_title_2: "Communauté",
    community_subtitle: "Accédez à une immense bibliothèque de partage et de ressources éducatives d'excellence.",
    community_login_required: "Veuillez vous connecter pour voir et partager les ressources de la communauté.",
    community_tab_courses: "Cours & Tutoriels",
    community_tab_docs: "Documents PDF",
    community_share_btn: "Partager",
    community_add_course_title: "Partager une ressource",
    community_add_doc_title: "Partager un document PDF",
    community_course_title: "Titre du cours",
    community_course_desc: "Description courte",
    community_course_url: "Lien de la ressource (YouTube, Drive)",
    community_course_author: "Auteur / Formateur",
    community_course_level: "Niveau",
    community_doc_title: "Nom du document",
    community_doc_subject: "Sujet / Matière",
    community_doc_file: "Contenu / Lien du PDF",
    community_download: "Télécharger",

    // Login & Signup Pages
    auth_welcome_back: "Bon retour !",
    auth_login_desc: "Connectez-vous à votre espace membre Al Kendi.",
    auth_create_account: "Créer un compte",
    auth_signup_desc: "Rejoignez le réseau d'apprentissage d'élite d'Al Kendi.",
    auth_email: "Adresse e-mail",
    auth_password: "Mot de passe",
    auth_fullname: "Nom complet",
    auth_already_account: "Vous avez déjà un compte ? Se connecter",
    auth_no_account: "Nouveau membre ? Créer un compte"
  },
  en: {
    // Navbar
    nav_home: "Home",
    nav_announcements: "News",
    nav_branches: "Branches",
    nav_community: "Community",
    nav_admin: "Admin",
    nav_login: "Login",
    nav_register: "Register",
    nav_logout: "Logout",
    association: "Association",

    // Common/Actions
    close: "Close",
    submit: "Validate",
    cancel: "Cancel",
    loading: "Loading...",
    save: "Save",
    add: "Add",
    all_rights_reserved: "All rights reserved.",
    created_by: "Website created by",

    // Footer
    admissions_open: "Admissions Open",
    footer_adventure_title: "The Adventure Starts",
    footer_adventure_subtitle: "Now",
    become_member: "Become a Member",

    // Home Page
    hero_badge: "The future begins here",
    hero_title_1: "Association of",
    hero_title_2: "Youth",
    hero_title_3: "Al Kendi",
    interrogate_ai: "Ask AI",
    community_btn: "Join Community",

    // Home Stats
    stats_members: "Active Members",
    stats_courses: "Shared Courses",
    stats_events: "Events",
    stats_success: "Success Rate",

    // Home Announcements
    news_tag: "News",
    news_title_1: "Our Latest",
    news_title_2: "Announcements",
    news_view_details: "View details",
    news_date: "Publish date",

    // Home About
    about_tag: "About Us",
    about_title_1: "A Vision",
    about_title_2: "For The Future of",
    about_title_3: "Computing",
    about_text_1: "Al Kendi Youth Association pushes the boundaries of education in computing, AI, and management.",
    about_text_2: "We form a community of enthusiastic learners, auditors, and experts.",
    about_card_title_1: "Unique Synergy",
    about_card_desc_1: "A practical fusion between accounting finance and artificial intelligence technologies.",
    about_card_title_2: "Continuous Support",
    about_card_desc_2: "Mentorship and high-quality tutoring programs.",

    // Home Expertise
    expert_tag: "Our Scope",
    expert_title_1: "Expertise Supporting",
    expert_title_2: "your",
    expert_title_3: "Ambition",
    expert_desc: "Discover rigorous programs designed to propel your academic and professional career.",
    expert_ia_title: "AI & Dev Academy",
    expert_ia_desc: "Advanced programming courses: Deep Learning, Web Architecture, and cutting-edge algorithms.",
    expert_cg_title: "Accounting & Management",
    expert_cg_desc: "Master modern accounting processes, management control, and analytic finance.",

    // Home Testimonials
    test_tag: "Testimonials",
    test_title_1: "What our members",
    test_title_2: "say about us",
    test_add_rating: "Leave a review",
    test_name_ph: "Your name",
    test_comment_ph: "Your comment...",
    test_submit: "Submit review",
    test_success_msg: "Thank you for your valuable feedback!",

    // Home FAQ
    faq_title: "Frequently Asked Questions",
    faq_q1: "How to register?",
    faq_a1: "Click 'Register' at the top of the page and fill out the general signup form.",
    faq_q2: "Can I follow both AI and Accounting courses?",
    faq_a2: "Absolutely! Interdisciplinary cohesion is a core technological pillar we encourage at Al Kendi.",
    faq_q3: "Are the certifications free?",
    faq_a3: "All of our internal workshops and individual instruction are completely free for active members.",

    // Branches Page
    branches_title_1: "Our",
    branches_title_2: "Branches",
    branches_subtitle: "Discover our academic excellence programs designed for the digital future.",
    branches_domain: "Path",
    branches_explore_course: "Explore details",
    branches_students: "Active Students",
    branches_semesters: "Semesters",
    branches_modules: "Modules",
    branches_hours: "Hours",
    branches_career: "Career opportunities",
    branches_program_details: "Program Details",

    // Announcements Page
    announcements_log: "Journal & ",
    announcements_title_2: "News",
    announcements_desc: "Live the daily activities and highlights of the Al Kendi Association.",
    announcements_add_btn: "Publish announcement",
    announcements_add_title: "New Announcement",
    announcements_form_title: "Announcement title",
    announcements_form_content: "Content",
    announcements_form_category: "Category",
    announcements_form_tag: "Tag",

    // Community Page
    community_title_1: "Community",
    community_title_2: "Space",
    community_subtitle: "Access a grand shared library of premium educational files and tutorial resources.",
    community_login_required: "Please log in to browse and share community documents and tutorial links.",
    community_tab_courses: "Workshops & Tutorials",
    community_tab_docs: "PDF Documents",
    community_share_btn: "Share",
    community_add_course_title: "Share a resource",
    community_add_doc_title: "Share a PDF document",
    community_course_title: "Course title",
    community_course_desc: "Short description",
    community_course_url: "Resource link (YouTube, Drive)",
    community_course_author: "Author / Educator",
    community_course_level: "Skill Level",
    community_doc_title: "Document name",
    community_doc_subject: "Subject / Stream",
    community_doc_file: "Base64 Content / link to PDF",
    community_download: "Download",

    // Login & Signup Pages
    auth_welcome_back: "Welcome Back!",
    auth_login_desc: "Connect to your official Al Kendi student space.",
    auth_create_account: "Create Account",
    auth_signup_desc: "Join the elite digital learning ecosystem of Al Kendi.",
    auth_email: "Email address",
    auth_password: "Password",
    auth_fullname: "Full name",
    auth_already_account: "Already have an account? Log in",
    auth_no_account: "New member? Sign up today"
  },
  ar: {
    // Navbar
    nav_home: "الرئيسية",
    nav_announcements: "الإعلانات",
    nav_branches: "الشعب والتخصصات",
    nav_community: "المجمع والمنتدى",
    nav_admin: "لوحة التحكم",
    nav_login: "تسجيل الدخول",
    nav_register: "إنشاء حساب",
    nav_logout: "تسجيل الخروج",
    association: "جمعية",

    // Common/Actions
    close: "إغلاق",
    submit: "تأكيد",
    cancel: "إلغاء",
    loading: "جاري التحميل...",
    save: "حفظ",
    add: "إضافة",
    all_rights_reserved: "جميع الحقوق محفوظة.",
    created_by: "تم تصميم البرمجة بواسطة",

    // Footer
    admissions_open: "باب التسجيل مفتوح",
    footer_adventure_title: "المغامرة التعليمية تبدأ",
    footer_adventure_subtitle: "الآن",
    become_member: "انضم إلينا كعضو",

    // Home Page
    hero_badge: "المستقبل الرقمي يبدأ من هنا",
    hero_title_1: "جمعية",
    hero_title_2: "شباب",
    hero_title_3: "الكندي",
    interrogate_ai: "اسأل الذكاء الاصطناعي",
    community_btn: "انضم إلى المنتدى المشترك",

    // Home Stats
    stats_members: "أعضاء نشطون",
    stats_courses: "دروس مشتركة",
    stats_events: "الفعاليات الحضورية",
    stats_success: "معدل النجاح الدراسي",

    // Home Announcements
    news_tag: "المستجدات والأخبار",
    news_title_1: "آخر إعلاناتنا",
    news_title_2: "الحصرية",
    news_view_details: "عرض التفاصيل الكاملة",
    news_date: "تاريخ النشر",

    // Home About
    about_tag: "من نحن",
    about_title_1: "رؤية طموحة",
    about_title_2: "نحو ريادة تامة في",
    about_title_3: "عالم تكنولوجيا المعلومات",
    about_text_1: "تعمل جمعية شباب الكندي للتكنولوجيا على كشف آفاق جديدة في مجالات الذكاء الاصطناعي، والبرمجيات وإدارة الأعمال والتسيير المالي والمحاسبتي.",
    about_text_2: "نحن نبني مجتمعاً ريادياً من الطلاب والخبراء الشغوفين بنقل المعارف الأكاديمية وصقل المهارات.",
    about_card_title_1: "اندماج وتكامل متطور",
    about_card_desc_1: "دمج تطبيقي حديث ورائع بين إدارة المحاسبة والمالية وأدوات وتقنيات تكنولوجيا الذكاء الاصطناعي الحديث.",
    about_card_title_2: "دعم مستمر وأكاديمي",
    about_card_desc_2: "برامج توجيهية وتعليمية مكثفة بإشراف كوكبة من خيرة الأساتذة والمشرفين.",

    // Home Expertise
    expert_tag: "مجالات تخصصنا",
    expert_title_1: "الخبرة الرائدة في",
    expert_title_2: "خدمة طموحاتكم",
    expert_title_3: "الأكاديمية والمهنية",
    expert_desc: "اكتشفوا مساراتنا وعروضنا الحصرية التي تم تصميمها بدقة لتمكينكم وإطلاق عنان قدراتكم المهنية والتقنية.",
    expert_ia_title: "أكاديمية الذكاء الاصطناعي",
    expert_ia_desc: "دروس تعليمية حديثة ومتقدمة: التعلم العميق، هندسة البرمجيات المعاصرة، وبناء تطبيقات ويب متكاملة.",
    expert_cg_title: "المحاسبة، التسيير والتدقيق الرياضي",
    expert_cg_desc: "تمكن من إتقان كافة المفاهيم المحاسبتية المعاصرة، والتحكم المطلق في التسيير المالي والتدبير التنظيمي.",

    // Home Testimonials
    test_tag: "آراء طلابنا",
    test_title_1: "ماذا يقول الأعضاء",
    test_title_2: "عن طاقم وخدمات الجمعية",
    test_add_rating: "شاركنا رأيك الثمين",
    test_name_ph: "اسمكم الكريم",
    test_comment_ph: "اكتبوا تعليقكم المفصل هنا...",
    test_submit: "إرسال تعليقي الآن",
    test_success_msg: "شكراً جزيلاً على مشاركة رأيكم القيم معنا وسعيكم للتطوير المستمر!",

    // Home FAQ
    faq_title: "الأسئلة الأكثر شيوعاً ورداً",
    faq_q1: "كيف يمكنني الانضمام والتسجيل الفعلي بالجمعية؟",
    faq_a1: "الأمر في غاية البساطة! توجهوا لزر 'إنشاء حساب' أعلى الصفحة وسجلوا بياناتكم الأساسية.",
    faq_q2: "هل يتاح لي دراسة مسار المحاسبة ومسار الذكاء الاصطناعي معاً؟",
    faq_a2: "نعم وبكل تأكيد! فلسفتنا تعتمد بالكامل على التكامل المعرفي والتكنولوجي ومزج التخصصات لتوسيع الآفاق.",
    faq_q3: "هل كافة الشهادات التدريبية المقدمة من طرفكم مجانية؟",
    faq_a3: "نعم بالكامل! جميع الورشات التعليمية، الدعم الأكاديمي، والمواكبة مجانية بالكامل لكافة أعضائنا النشطين والملتزمين.",

    // Branches Page
    branches_title_1: "مساراتنا",
    branches_title_2: "الدراسية",
    branches_subtitle: "اكتشفوا برامجنا التعليمية الفاخرة التي تم تأليفها وتصميمها لخلق فرسان الغد الرقميين.",
    branches_domain: "المجال والتخصص",
    branches_explore_course: "استكشاف تفاصيل البرنامج",
    branches_students: "طالب نشط ومسجل",
    branches_semesters: "الفصول الدراسية",
    branches_modules: "المصوغات والوحدات",
    branches_hours: "الساعات المعتمدة",
    branches_career: "الآفاق والوجهات المهنية",
    branches_program_details: "تفاصيل وحيثيات التخصص",

    // Announcements Page
    announcements_log: "السجلات والجريدة & ",
    announcements_title_2: "المستجدات",
    announcements_desc: "واكبوا كافة الفعاليات، الأنشطة الميدانية واللحظات الكبرى لجمعية الكندي للتكنولوجيا يومياً.",
    announcements_add_btn: "كتابة ونشر مستجد جديد",
    announcements_add_title: "إدراج مستجد جديد",
    announcements_form_title: "عنوان الإعلان أو المستجد",
    announcements_form_content: "محتوى الإعلان بالتفصيل",
    announcements_form_category: "التصنيف",
    announcements_form_tag: "الوسم التوضيحي",

    // Community Page
    community_title_1: "مساحة",
    community_title_2: "المشاركات الجامعية",
    community_subtitle: "تصفحوا وشاركوا في خلق وتحديث أضخم مكتبة مرجعية عربية للدروس والملفات الأكاديمية.",
    community_login_required: "يرجى تسجيل الدخول لتتمكنوا من عرض ومشاركة ورفع الملفات والدروس الخاصة بكم مع باقي زملائكم بالدورة.",
    community_tab_courses: "شروحات ودروس الويب",
    community_tab_docs: "مراجع وملفات بصيغة PDF",
    community_share_btn: "مشاركة مواردي العلمية",
    community_add_course_title: "مشاركة درس أو شرح برابط خارجي",
    community_add_doc_title: "مشاركة ملف تعليمي PDF ومراجعي",
    community_course_title: "عنوان الدرس أو المادة والشرح",
    community_course_desc: "وصف موجز ومركز للمحتوى",
    community_course_url: "رابط الدرس الخارجي (يوتيوب، جوجل درايف إلخ)",
    community_course_author: "اسم الأستاذ المبرمج أو المصدر",
    community_course_level: "المستوى الصعوبي المستهدف",
    community_doc_title: "اسم المرجع والملخص بوضوح",
    community_doc_subject: "اسم المادة أو المودول المدرج",
    community_doc_file: "محتوى المستند أو رابط ملف الـ PDF المرجعي",
    community_download: "تنزيل وقراءة",

    // Login & Signup Pages
    auth_welcome_back: "مرحباً بعودتكم من جديد!",
    auth_login_desc: "سجلوا دخولكم الآمن للمساحة والمنصة الطلابية الخاصة بالجمعية الوطنية شباب الكندي.",
    auth_create_account: "إنشاء حساب طالب جديد",
    auth_signup_desc: "انضم الآن لكوكبة النخبة الرقمية واستفد من مواكبة وتدرج علمي حصري بالجمعية.",
    auth_email: "البريد الإلكتروني المعتمد",
    auth_password: "كلمة المرور الخاصة بكم",
    auth_fullname: "الاسم الكامل والواضح",
    auth_already_account: "هل لديكم حساب طلابي بالفعل؟ تسجيل الدخول",
    auth_no_account: "عضو جديد بالجمعية؟ سجلوا حسابكم الآن مجاناً"
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.fr) => string;
  isRtl: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app_lang");
    return (saved as Language) || "fr";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_lang", lang);
  };

  const isRtl = language === "ar";

  useEffect(() => {
    // Update Document attributes
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    
    // Arabic-specific font pairings or layout directions can be hooked here if needed
    if (isRtl) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [language, isRtl]);

  const t = (key: keyof typeof translations.fr): string => {
    return translations[language][key] || translations["fr"][key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
