import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Award, 
  Sparkles, 
  Layers, 
  Grid, 
  Dna, 
  HelpCircle, 
  Flame, 
  GraduationCap, 
  MessageSquare,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  Info,
  Atom,
  Clock,
  Zap,
  Target,
  Moon,
  Sun
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { chaptersData } from "./data/curriculumData";
import { UserStats, Chapter } from "./types";

// Import components
import CellSimulator from "./components/CellSimulator";
import PunnettSimulator from "./components/PunnettSimulator";
import EnergyPyramid from "./components/EnergyPyramid";
import MicroscopeExplorer from "./components/MicroscopeExplorer";
import TutorChat from "./components/TutorChat";
import FinalExam from "./components/FinalExam";
import NotebookStudio from "./components/NotebookStudio";

// Tip of the day array
const dailyTips = [
  "تنص نظرية الخلية على أن جميع الخلايا تنشأ من خلايا سابقة الوجود عن طريق الانقسام.",
  "تفقد السلسلة الغذائية 90% من طاقتها المتاحة عند الانتقال من مستوى إلى المستوى الأعلى.",
  "أول من فحص الخلايا ووصفها تحت المجهر عام 1665 م هو العالم روبرت هوك.",
  "الجدار الخلوي يتواجد حصراً في الخلايا النباتية والطلائعيات والفطريات، ولا يتواجد مطلقاً في الحيوانات.",
  "القوانين التي تحكم انتقال الصفات الوراثية وتوزيع الأمشاج تسمى 'الوراثة المندلية نسباً لمندل'."
];

export default function App() {
  const [activeTab, setActiveTab ] = useState<"home" | "chapters" | "exams" | "tutor" | "notebooklm">("home");
  const [selectedChapter, setSelectedChapter] = useState<Chapter>(chaptersData[0]);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number>(0);
  
  // Daily tip
  const [tipIdx, setTipIdx] = useState(0);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("al_mualm_dark_mode");
      if (saved) return saved === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // User Gamification stats loaded from localStorage
  const [stats, setStats] = useState<UserStats>({
    xp: 150,
    quizzesTaken: 2,
    correctAnswers: 14,
    streak: 3,
    unlockedBadges: ["بطل البداية", "مستكشف المختبر"]
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("al_mualm_dark_mode", String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const saved = localStorage.getItem("al_mualm_stats");
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to load user stats", err);
      }
    }
    // Randomize daily tip on load
    setTipIdx(Math.floor(Math.random() * dailyTips.length));
  }, []);

  const handleUpdateStats = (xpGain: number) => {
    setStats((prev) => {
      const newXp = prev.xp + xpGain;
      const newQuizzes = prev.quizzesTaken + 1;
      const updatedBadges = [...prev.unlockedBadges];
      
      if (newXp >= 300 && !updatedBadges.includes("عالم الخلايا")) {
        updatedBadges.push("عالم الخلايا");
      }
      if (newXp >= 500 && !updatedBadges.includes("خبير الوراثة")) {
        updatedBadges.push("خبير الوراثة");
      }

      const val = {
        ...prev,
        xp: newXp,
        quizzesTaken: newQuizzes,
        unlockedBadges: updatedBadges
      };
      localStorage.setItem("al_mualm_stats", JSON.stringify(val));
      return val;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200" dir="rtl">
      
      {/* Platform Professional Header */}
      <header className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-850 sticky top-0 z-50 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 flex items-center justify-center text-xl text-white shadow-sm font-bold">
              م
            </span>
            <div>
              <h1 className="text-base font-extrabold text-slate-800 dark:text-slate-100 leading-none flex items-center gap-1.5">
                منصة المعلم التعليمي
                <span className="text-[10px] bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-150 dark:border-blue-900/40 font-bold px-2.5 py-0.5 rounded-full">الأحياء</span>
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-sans">الصف الأول الثانوي - المنهج التفاعلي الشامل</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "home" ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/30 dark:border-blue-900/35 font-extrabold" : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => setActiveTab("chapters")}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "chapters" ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/30 dark:border-blue-900/35 font-extrabold" : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-55 dark:hover:bg-slate-800/50"
              }`}
            >
              موسوعة الدروس
            </button>
            <button
              onClick={() => setActiveTab("exams")}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "exams" ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/30 dark:border-blue-900/35 font-extrabold" : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-55 dark:hover:bg-slate-800/50"
              }`}
            >
              بنك الأسئلة والامتحانات
            </button>
            <button
              onClick={() => setActiveTab("notebooklm")}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                activeTab === "notebooklm" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200/30 dark:border-indigo-900/35 font-extrabold" : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-55 dark:hover:bg-slate-800/50"
              }`}
            >
              حقيبة NotebookLM
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            </button>
            <button
              onClick={() => setActiveTab("tutor")}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === "tutor" ? "bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-250/30 dark:border-emerald-900/35 font-extrabold" : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-55 dark:hover:bg-slate-800/50"
              }`}
            >
              المعلم AI
            </button>
          </nav>

          {/* Right Header Panel with Toggler and Gamification */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Moon/Sun Toggler */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              title="تفعيل / إلغاء الوضع الليلي"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
              <span className="text-[11px] font-bold hidden md:inline">الوضع الليلي</span>
            </button>

            {/* Gamification Indicator Panel */}
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2 rounded-2xl">
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono" title="أيام متتالية للدراسة">{stats.streak} أيام</span>
              </div>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-850" />
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 font-mono" title="نقاط الخبرة الكلية">{stats.xp} XP</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container Wrapper */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner with tip of the day */}
        <div className="mb-8 p-4 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 text-lg border border-blue-100/50 dark:border-blue-900/30">💡</span>
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block uppercase">معلومة تفاعلية اليوم:</span>
              <p className="text-gray-700 dark:text-slate-200 text-xs mt-0.5 leading-relaxed font-sans">{dailyTips[tipIdx]}</p>
            </div>
          </div>
        </div>

        {/* Global Navigation Hub (Mobile responsive layout tabs) */}
        <div className="grid grid-cols-5 md:hidden gap-1 mb-6 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <button
            onClick={() => setActiveTab("home")}
            className={`py-2 text-[9px] font-bold rounded-lg text-center cursor-pointer transition-all ${
              activeTab === "home" ? "bg-blue-600 text-white shadow-xs" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab("chapters")}
            className={`py-2 text-[9px] font-bold rounded-lg text-center cursor-pointer transition-all ${
              activeTab === "chapters" ? "bg-blue-600 text-white shadow-xs" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            الدروس
          </button>
          <button
            onClick={() => setActiveTab("exams")}
            className={`py-2 text-[9px] font-bold rounded-lg text-center cursor-pointer transition-all ${
              activeTab === "exams" ? "bg-blue-600 text-white shadow-xs" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            امتحان
          </button>
          <button
            onClick={() => setActiveTab("notebooklm")}
            className={`py-2 text-[9px] font-bold rounded-lg text-center cursor-pointer transition-all ${
              activeTab === "notebooklm" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            حقيبة LM
          </button>
          <button
            onClick={() => setActiveTab("tutor")}
            className={`py-2 text-[9px] font-bold rounded-lg text-center cursor-pointer transition-all ${
              activeTab === "tutor" ? "bg-emerald-650 text-white shadow-xs" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            المعلم AI
          </button>
        </div>

        <AnimatePresence mode="wait">
          
          {/* TAB 1: HOME DASHBOARD */}
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Hero branding banner */}
              <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-950 text-white relative overflow-hidden shadow-md border border-slate-800/10 mb-8">
                <span className="absolute -right-12 -top-12 w-48 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <span className="absolute -left-12 -bottom-12 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                <div className="max-w-2xl relative z-10 space-y-4">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold font-sans">أهلاً بك مجدداً في عيادة علم الأحياء 🧬</span>
                  <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
                    استكشف أسرار الحياة وعلم الخلايا المجهرية مجاناً وبطريقة تفاعلية!
                  </h2>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                    من خلال فصول المنهج المعتمد، بادر بمشاهدة الرسوم التوضيحية ثلاثية الأبعاد، وحل بنوك الأسئلة الوافرة، وتحدث إلى المعلم سمير لمعالجة أي شروح صعبة بتبسيط باهر!
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button 
                      onClick={() => setActiveTab("chapters")}
                      className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-blue-500 transition-all cursor-pointer border border-blue-500/50"
                    >
                      تصفح الأبواب والدروس 📖
                    </button>
                    <button 
                      onClick={() => setActiveTab("notebooklm")}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer border border-indigo-505/50 font-extrabold"
                    >
                      الحقيبة الذكية NotebookLM 📚
                    </button>
                    <button 
                      onClick={() => setActiveTab("tutor")}
                      className="px-5 py-2.5 bg-white/10 text-white border border-white/20 text-xs font-bold rounded-xl hover:bg-white/15 transition-all cursor-pointer"
                    >
                      اسأل المعلم سمير AI 🤖
                    </button>
                  </div>
                </div>
              </div>

              {/* Student progress & Gamified stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                {/* Stats */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 text-xs">مستواك الحالي في الأحياء</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                      المستوى {Math.floor(stats.xp / 150) + 1}
                    </h3>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-2">متبقي {(150 - (stats.xp % 150))} XP للمستوى التالي</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center text-3xl border border-blue-100/50 dark:border-blue-900/30">
                    🎓
                  </div>
                </div>

                {/* Quizzes Taken */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 text-xs">تحديات تم تدريبها</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">{stats.quizzesTaken} تحديات</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">شاملة التدرب المستقل والامتحانات الصعبة</p>
                  </div>
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-3xl border border-indigo-100/50 dark:border-indigo-900/30">
                    ✏️
                  </div>
                </div>

                {/* Badges unlocked */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col justify-between shadow-xs hover:shadow-sm transition-all">
                  <span className="text-slate-400 dark:text-slate-500 text-xs">الأوسمة التي أحرزتها بتفوق</span>
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {stats.unlockedBadges.map((badge, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-1 text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30 rounded-lg flex items-center gap-1 shadow-xs"
                      >
                        🏅 {badge}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Syllabus Overview & Textbook directory */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">أبواب وبنية منهج الأحياء</h3>
                  <button 
                    onClick={() => setActiveTab("chapters")}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    عرض الكل
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  {chaptersData.map((chapter) => (
                    <div 
                      key={chapter.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-md hover:translate-y-[-1px] transition-all duration-300 flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/45 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-sm font-extrabold`}>
                            {chapter.id}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-wide uppercase">
                            Unit {chapter.id}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white leading-snug">{chapter.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mt-2 line-clamp-2">{chapter.description}</p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedChapter(chapter);
                          setSelectedSectionIdx(0);
                          setActiveTab("chapters");
                        }}
                        className="mt-5 w-full py-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-705 dark:text-slate-300 text-xs font-bold rounded-xl transition-all border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        دخول الدرس وقراءة الشرح
                        <ChevronLeft className="w-3.5 h-3.5 rotate-180 text-blue-600 dark:text-blue-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: TEXTBOOK CHAPTERS & INTERACTIVE SIMULATORS */}
          {activeTab === "chapters" && selectedChapter && (
            <motion.div
              key="chapters"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* LHS Sidebar directory */}
              <div className="lg:col-span-3 space-y-4">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold block mb-2 px-1 uppercase tracking-wider">
                  📖 الأبواب والوحدات الدراسية:
                </span>
                
                <div className="space-y-1.5">
                  {chaptersData.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedChapter(c);
                        setSelectedSectionIdx(0);
                      }}
                      className={`w-full text-right p-3.5 rounded-2xl text-xs font-bold transition-all flex justify-between items-center cursor-pointer ${
                        selectedChapter.id === c.id
                          ? "bg-blue-600 text-white shadow-sm border border-blue-700/50 font-extrabold"
                          : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-xs"
                      }`}
                    >
                      <span className="truncate">{c.title}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        selectedChapter.id === c.id ? "bg-white/20 text-white font-bold" : "bg-slate-100 dark:bg-slate-805 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/30"
                      }`}>
                        U{c.id}
                      </span>
                    </button>
                  ))}
                </div>

                <hr className="border-slate-200 dark:border-slate-800/80 my-6" />

                {/* Chapter Practice Card */}
                <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/80 dark:border-indigo-900/30 shadow-xs">
                  <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-350 flex items-center gap-1.5 mb-2">
                    <BookOpenCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                    هل أنهيت الباب؟
                  </h4>
                  <p className="text-[11px] text-indigo-800 dark:text-indigo-400 leading-relaxed font-sans">
                    اختبر وتمرن على أسئلة هذا الباب مباشرة في بنك الأسئلة لمعالجة الأفكار الصعبة وكسب XP تفوقي!
                  </p>
                  <button
                    onClick={() => setActiveTab("exams")}
                    className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 dark:bg-blue-600 dark:hover:bg-blue-700 cursor-pointer text-white font-bold rounded-xl text-xs mt-4 shadow-sm"
                  >
                    الانتقال للامتحانات ✏️
                  </button>
                </div>
              </div>

              {/* RHS Content Panel & Interactive simulators */}
              <div className="lg:col-span-9 space-y-8 animate-fadeIn">
                
                {/* Header Information for selected Chapter */}
                <div className={`p-6 rounded-3xl bg-gradient-to-r ${selectedChapter.bgGradient} text-white shadow-md relative overflow-hidden`}>
                  <div className="relative z-10">
                    <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-[10px] font-mono font-bold tracking-wide uppercase">
                      المنهج التفاعلي: الباب {selectedChapter.id}
                    </span>
                    <h2 className="text-2xl font-bold mt-2">{selectedChapter.title}</h2>
                    <span className="text-xs font-mono text-white/70 block mt-1 tracking-wider uppercase">
                      {selectedChapter.englishTitle}
                    </span>
                    <p className="text-white/80 text-xs mt-3 leading-relaxed max-w-2xl">{selectedChapter.description}</p>
                  </div>
                </div>

                {/* Section tabs switch */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto pb-px">
                  {selectedChapter.sections.map((sec, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSectionIdx(idx)}
                      className={`px-4 py-3 font-bold text-xs truncate border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                        selectedSectionIdx === idx
                          ? "border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-900/30"
                          : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {sec.title}
                    </button>
                  ))}
                </div>

                {/* Active Section Content */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xs">
                  <div className={`grid grid-cols-1 ${selectedChapter.sections[selectedSectionIdx].imageUrl ? "lg:grid-cols-2" : ""} gap-8 items-center`}>
                    
                    {/* Textual Content */}
                    <div className="prose max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                      {/* Convert raw carriage returns of content into structured paragraphs */}
                      {selectedChapter.sections[selectedSectionIdx].content.split("\n\n").map((para, i) => (
                        <p key={i} className="mb-4">{para}</p>
                      ))}
                    </div>

                    {/* Elegant Section Image/Diagram */}
                    {selectedChapter.sections[selectedSectionIdx].imageUrl && (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800/80 bg-slate-55 dark:bg-slate-950 p-2 shadow-xs group">
                        <img 
                          src={selectedChapter.sections[selectedSectionIdx].imageUrl}
                          alt={selectedChapter.sections[selectedSectionIdx].imageAlt || selectedChapter.sections[selectedSectionIdx].title}
                          className="w-full h-auto max-h-[340px] md:max-h-[380px] object-cover rounded-xl transition-all duration-500 group-hover:scale-[1.01]"
                          referrerPolicy="no-referrer"
                        />
                        {selectedChapter.sections[selectedSectionIdx].imageAlt && (
                          <div className="mt-2 text-center">
                            <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400">
                              📊 رسم توضيحي معتمد: {selectedChapter.sections[selectedSectionIdx].imageAlt}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Render respective interactive element based on current lesson */}
                  {selectedChapter.sections[selectedSectionIdx].interactiveElement && (
                    <div className="mt-8 border-t border-slate-150 pt-8">
                      {selectedChapter.sections[selectedSectionIdx].interactiveElement === "cellMap" && (
                        <CellSimulator />
                      )}
                      {selectedChapter.sections[selectedSectionIdx].interactiveElement === "punnett" && (
                        <PunnettSimulator />
                      )}
                      {selectedChapter.sections[selectedSectionIdx].interactiveElement === "energyPyramid" && (
                        <EnergyPyramid />
                      )}
                      {selectedChapter.sections[selectedSectionIdx].interactiveElement === "microscope" && (
                        <MicroscopeExplorer />
                      )}
                    </div>
                  )}
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 3: BENCH EXAMS & TESTS */}
          {activeTab === "exams" && (
            <motion.div
              key="exams"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <FinalExam onUpdateStats={handleUpdateStats} />
            </motion.div>
          )}

          {/* TAB 4: SMART GEMINI AI BIOLOGY TUTOR */}
          {activeTab === "tutor" && (
            <motion.div
              key="tutor"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <TutorChat />
            </motion.div>
          )}

          {/* TAB 5: NOTEBOOKLM STUDY WORKSPACE */}
          {activeTab === "notebooklm" && (
            <motion.div
              key="notebooklm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <NotebookStudio />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Elegant informative Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-20 text-center text-slate-400 rounded-t-3xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs uppercase tracking-widest text-blue-500 block font-black">منصة المعلم التعليمية الموحدة</span>
          <p className="text-[11px] max-w-md mx-auto leading-relaxed text-slate-400 font-sans">
            منصة مخصصة لتبسيط مادة علوم الأحياء للمرحلة الثانوية العامة، مبنية بالكامل على المنهج المعتمد وبناءً على قوانين التنمية والتحول التفاعلي الحديثة.
          </p>
          <div className="text-[10px] text-slate-500 font-mono">
            <span>© 2026 - جميع الحقوق محفوظة لمنصة المعلم التعليمي ALMUALM.COM</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
