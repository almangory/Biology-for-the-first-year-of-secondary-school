import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Files, 
  Sliders, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  Search, 
  Volume2, 
  Play, 
  Pause, 
  RefreshCw, 
  ArrowLeft, 
  Check, 
  Info,
  Radio, 
  Maximize2
} from "lucide-react";
import { chaptersData } from "../data/curriculumData";
import { searchCurriculum } from "../utils/searchEngine";

// Interfaces
interface SourceBook {
  id: number;
  title: string;
  checked: boolean;
}

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface PodcastSegment {
  speaker: "sameer" | "mona";
  text: string;
}

export default function NotebookStudio() {
  const [sources, setSources] = useState<SourceBook[]>(() => 
    chaptersData.map(c => ({ id: c.id, title: c.title, checked: c.id === 1 || c.id === 2 }))
  );
  
  const [activeSubTab, setActiveSubTab] = useState<"guide" | "audio" | "flashcards" | "grounded-search">("guide");
  
  // Audio overview podcast simulator state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [podcastSpeed, setPodcastSpeed] = useState<number>(1);
  const [totalTime] = useState(190); // 3:10 simulated duration
  const [activeSpeechIndex, setActiveSpeechIndex] = useState(0);

  // Flashcards state
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Grounded search state
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "notebooklm", text: string, citation?: string }>>([
    {
      role: "notebooklm",
      text: "مرحباً بك في وحدة البحث الذكي لـ NotebookLM. حدد المصادر المرفوعة على اليمين، ثم اطرح أي سؤال لاستخلاص إجابات فورية موثقة بالاقتباسات الدقيقة من كتاب الوزارة المعتمد.",
    }
  ]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Toggle active source document
  const toggleSource = (id: number) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  const activeSourcesCount = sources.filter(s => s.checked).length;
  const activeSourceIds = sources.filter(s => s.checked).map(s => s.id);

  // Generate dynamic study notes based on active source documents chosen
  const getStudyGuideNotes = () => {
    const selected = chaptersData.filter(c => activeSourceIds.includes(c.id));
    if (selected.length === 0) return null;
    return selected;
  };

  // Simulated Flashcards populated from active source files
  const getFlashcards = (): Flashcard[] => {
    const cards: Flashcard[] = [];
    if (activeSourceIds.includes(1)) {
      cards.push(
        { id: 101, question: "ما هي الكيمياء الحيوية (Biochemistry)؟", answer: "علم يدرس الكائنات الحية كيميائياً ويبحث تفاعلات جزيئات الدهون والسكريات وبناء الخلايا المعقدة.", category: "مدخل الأحياء" },
        { id: 102, question: "اذكر اثنتين من خصائص الحياة الجوهرية الستة.", answer: "البنية الخلوية المستقلة، والقدرة على الاستجابة للمؤثرات ونموها وانقسامها الكروموسومي.", category: "خصائص الحياة" }
      );
    }
    if (activeSourceIds.includes(2)) {
      cards.push(
        { id: 201, question: "ما وجه الاختلاف في وراثة المادة لخلية بدائية النواة؟", answer: "مادتها الوراثية (DNA) تسبح حرة طليقة في السيتوبلازم دون غلاف نووي مزدوج مخصص كالبكتيريا.", category: "بيولوجية الخلية" },
        { id: 202, question: "كم عدد الخلايا الناتجة عن الانقسام الفتيلي المتساوي؟", answer: "خليتان جسديتان متطابقتان تماماً مع الخلية الأم في عدد الكروموسومات والجينات (2n).", category: "الانقسام الخلوي" }
      );
    }
    if (activeSourceIds.includes(3)) {
      cards.push(
        { id: 301, question: "ما معنى التسمية الثنائية لينيوس اللاتينية؟", answer: "كتابة اسم الكائن من كلمتين؛ الأولى تمثل 'الجنس' وتبدأ بحرف كبير، والثانية تمثل 'النوع' بالحروف الصغيرة.", category: "تصنيف الكائنات" }
      );
    }
    if (activeSourceIds.includes(4)) {
      cards.push(
        { id: 401, question: "فرق بين دور النسيج الكولنشيمي والإسكلرنشيمي.", answer: "الكولنشيمي يمنح مرونة ونداوة بألياف السيليلوز، بينما الإسكلرنشيمي نسيج ميت صلب مغلظ باللجنين كالقشور.", category: "الدعامة النباتية" }
      );
    }
    if (activeSourceIds.includes(5)) {
      cards.push(
        { id: 501, question: "ما هو الأليل الوراثي (Allele)؟", answer: "هو أحد الأشكال التنافسية المتقابلة للجين الواحد (مثلاً طويل الساق T أو قصير الساق t).", category: "قوانين مندل" }
      );
    }
    if (activeSourceIds.includes(6)) {
      cards.push(
        { id: 601, question: "ما هي قاعدة الـ 10% في نقل طاقة النظام البيئي؟", answer: "قانون يفترض تفشي وضياع 90% من طاقة الكائن كحرارة وتنافس حيوي، بينما ينتقل 10% كغذاء ومخزون خلوي.", category: "علم البيئة" }
      );
    }

    if (cards.length === 0) {
      return [
        { id: 0, question: "الرجاء تحديد مصدر واحد على الأقل!", answer: "قم بتفعيل المربعات الجانبية للمستندات لإنتاج بطاقات المذاكرة الملائمة تلقائياً.", category: "ملاحظة" }
      ];
    }
    return cards;
  };

  const currentCards = getFlashcards();

  // Reset card state when index changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentCardIdx]);

  // Simulated double-teacher podcast dialog transcript matching NotebookLM Audio Overviews
  const generatePodcastTranscript = (): PodcastSegment[] => {
    // Determine active chapters and tailor conversation
    const ids = activeSourceIds;
    if (ids.length === 0) {
      return [{ speaker: "sameer", text: "أهلاً بك يا بني. يرجى تفعيل مصدر واحد على الأقل من اللوحة الجانبية، لكي نقوم أنا والمعلمة منى بإنشاء حوار شرح ممتع ومخصص لك!" }];
    }

    const firstActive = ids[0];
    if (firstActive === 1) {
      return [
        { speaker: "sameer", text: "أهلاً بكِ في حلقة اليوم يا منى! اليوم نحن نناقش الباب الأول الممتع جداً: مدخل في الأحياء وخصائص الكائنات العجيبة." },
        { speaker: "mona", text: "مرحباً يا أستاذ سمير! أتعلم، أكثر ما يسحرني هو كيف أن الأشياء مثل البنية الخلوية والاستجابة ليست مجرد كلمات، بل هي طابعات لإثبات وجود الحياة وعظمتها." },
        { speaker: "sameer", text: "بالتأكيد! البنية الخلوية تعني أن أصغر نملة على الأرض تحتوي على آلاف الماكينات الصغيرة المتخصصة. وبالمناسبة، تداخل الأحياء مع العلوم الأخرى كالكيمياء الحيوية يساعدنا على فهم كيف نهضم تلك السكريات ونتنفس بالخلايا دقيقة بدقيقة!" },
        { speaker: "mona", text: "رائع جداً! والدراسات الفيزيائية الحيوية تبين كيف يعمل القلب كأنبوب ميكانيكي هيدروليكي يضخ تيار الحياة! إنه تكامل مذهل وممتع للطلبة المبتدئين." }
      ];
    }
    if (firstActive === 2) {
      return [
        { speaker: "sameer", text: "أهلاً منى، اليوم موضوعنا غاية في الدقة والجمال المجهري: الخلية الحية وعجائب الانقسامات!" },
        { speaker: "mona", text: "أهلاً بك أستاذ سمير. الخلايا حقيقية النواة تبهرني بتنظيمها الداخلي العالي. نواة حقيقية مغلفة بغشاء يحمي المادة الوراثية، بجانب ميتوكوندريا تعمل كالمولد الكهربائي طوال اليوم!" },
        { speaker: "sameer", text: "صحيح! وفي المقابل نرى الخلايا بدائية النواة كالبكتيريا بسيطة للغاية ومتمردة، تسبح مادتها الوراثية طافية بحرية في السيتوبلازم دون غلاف نووي!" },
        { speaker: "mona", text: "وماذا عن الفرق الأكبر؟ الانقسام الفتيلي لتعويض جروح الجلد التالف والنمو، بينما الاختزالي هدفه بقاء السلالة البشرية بإنتاج الأمشاج وتسهيل التنوع الوراثي العبور جينياً!" }
      ];
    }
    if (firstActive === 4) {
      return [
        { speaker: "sameer", text: "مرحباً منى، لنتكلم كأطباء نبات فيزيائيين اليوم عن: الدعامة الرخوة والصلبة النباتية!" },
        { speaker: "mona", text: "رائع! هل فكرت يوماً كيف لسيقان الكرفس أو الأوراق الفتية أن تنتصب بقوة رغم غياب العظام؟ السر كله في ضغط الاسموزية والانتفاخ الخلوي!" },
        { speaker: "sameer", text: "تماماً مثل البالونات المملوءة بالماء! وحين يجف النبات تنكمش الفجوة العصاروية ويرتخي الغشاء مسبباً ذبول النبات. لكن النباتات الخشبية الكبيرة لديها خط دفاع قاسي ميت مدعم باللجنين!" },
        { speaker: "mona", text: "نعم، وهي الأنسجة الإسكلرنشيمية الميتة الصلبة. تمنح القوام الدائم كقشر الجوز الميكانيكي المستمر." }
      ];
    }
    
    // Fallback dialogue summarizing selected chapters
    return [
      { speaker: "sameer", text: "أهلاً بكم في حوارنا الأكاديمي السريع للباب المختار. سنقوم بتبسيط المادة سوية." },
      { speaker: "mona", text: "سنقوم بجمع المعلومات المنهجية وتدقيق الخصائص المهمة لنعطيكم النظرة الشاملة الساحرة للأحياء." },
      { speaker: "sameer", text: "البحث في كتاب الأحياء يوضح ترابط النسيج والدعامة الكونية الحية، ويجعل الدراسة أيسر بكثير!" }
    ];
  };

  const podcastScript = generatePodcastTranscript();

  // Control podcast simulated timer loop
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalTime) {
            setIsPlaying(false);
            return 0;
          }
          // Increment index proportionally
          const nextIndex = Math.min(
            Math.floor((prev / totalTime) * podcastScript.length),
            podcastScript.length - 1
          );
          setActiveSpeechIndex(nextIndex);
          return prev + 1;
        });
      }, 1000 / podcastSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, podcastSpeed, podcastScript.length]);

  // Handle grounded search grounded with sources chosen
  const handleGroundedSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setQuery("");
    setChatHistory(prev => [...prev, { role: "user", text: userText }]);
    setSearchLoading(true);

    // Simulate search logic
    setTimeout(() => {
      try {
        const searchResult = searchCurriculum(userText);
        
        // Find which checked source actually matches
        let citationSource = "كتاب الأحياء المعتمد";
        for (const src of sources) {
          if (src.checked && searchResult.content.includes(src.title.substring(0, 5))) {
            citationSource = `الباب: ${src.title}`;
            break;
          }
        }

        setChatHistory(prev => [
          ...prev, 
          { 
            role: "notebooklm", 
            text: searchResult.content,
            citation: citationSource
          }
        ]);
      } catch (err) {
        setChatHistory(prev => [
          ...prev, 
          { 
            role: "notebooklm", 
            text: "عذراً يا بني، حدث خطأ أثناء فحص وتدقيق محرك السجلات المنهجية الموثوقة." 
          }
        ]);
      } finally {
        setSearchLoading(false);
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header resembling NotebookLM Workspace */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800/80 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-indigo-900/30 shadow-md">
            LM
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black flex items-center gap-1.5 leading-none">
              حقيبة دراسة NotebookLM المنهجية
              <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
            </h2>
            <p className="text-slate-400 text-[11px] md:text-xs mt-1.5 font-sans">
              واجهة مخصصة لتحليل وتلقين مصادر كتاب الأحياء، توليد ملخصات تفاعلية، بطاقات فلاشية، وحلقات نقاش صوتية ذكية!
            </p>
          </div>
        </div>
        <div className="text-[10px] bg-indigo-950 text-indigo-350 border border-indigo-900/70 py-1.5 px-3 rounded-full font-bold flex items-center gap-1 shrink-0 self-start md:self-center">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          مستند لمحتويات الموقع ولا تطلب مفتاح تشغيل
        </div>
      </div>

      {/* Main Grid: LHS Sources | RHS Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Sources center (3 columns) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-5 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-850 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
              <Files className="w-4 h-4 text-indigo-650 dark:text-indigo-400" />
              المصادر المضمّنة: ({activeSourcesCount})
            </h3>
            <span className="text-[9px] text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-2 py-0.5 rounded-full">
              تلقائية الفحص
            </span>
          </div>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            حدد الأبواب ومصادر الدراسة بالأسفل لكي تقوم المنصة تلقائياً بإنشاء دليل المذاكرة الشامل والبطاقات والحوار الصوتي المزدوج المخصص:
          </p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-0.5">
            {sources.map(src => (
              <label 
                key={src.id}
                className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                  src.checked 
                    ? "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40 text-indigo-950 dark:text-slate-100" 
                    : "bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 text-slate-600 dark:text-slate-400"
                }`}
              >
                <input 
                  type="checkbox"
                  checked={src.checked}
                  onChange={() => toggleSource(src.id)}
                  className="w-4 h-4 rounded border-gray-600 focus:ring-indigo-500 text-indigo-650 cursor-pointer mt-0.5 accent-indigo-600"
                />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold block leading-snug">{src.title}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-sans block">
                    {src.checked ? "📂 مستند قيد الدراسة والتحليل" : "💤 مستند غير نشط"}
                  </span>
                </div>
              </label>
            ))}
          </div>

          {activeSourcesCount === 0 && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-150 dark:border-rose-900/30 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400">⚠️ تنبيه: يرجى تحديد مصدر دراسي واحد لملء البيانات.</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold block">
              💡 معلومة: دقة NotebookLM محكومة 100% بنصوص المنهج المعتمد بالموقع.
            </span>
          </div>
        </div>

        {/* Right Side: Tab Workspaces (8 columns) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Workspace Subtabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-850 gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveSubTab("guide")}
              className={`px-4 py-2 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "guide" 
                  ? "bg-indigo-600 text-white shadow-xs font-extrabold" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              دليل الدراسة والملخصات
            </button>
            <button
              onClick={() => {
                setActiveSubTab("audio");
                // Auto reset time index or script position
                setCurrentTime(0);
                setActiveSpeechIndex(0);
              }}
              className={`px-4 py-2 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "audio" 
                  ? "bg-indigo-600 text-white shadow-xs font-extrabold" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              الحوار الصوتي المزدوج (البودكاست)
            </button>
            <button
              onClick={() => setActiveSubTab("flashcards")}
              className={`px-4 py-2 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "flashcards" 
                  ? "bg-indigo-600 text-white shadow-xs font-extrabold" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              بطاقات فلاش ذكية
            </button>
            <button
              onClick={() => setActiveSubTab("grounded-search")}
              className={`px-4 py-2 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "grounded-search" 
                  ? "bg-indigo-600 text-white shadow-xs font-extrabold" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              بحث مستند للمصادر
            </button>
          </div>

          {/* Active SubTab Display Container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 min-h-[460px] shadow-xs flex flex-col justify-between">
            
            {/* SUB-TAB 1: GUIDE SUMMARY */}
            {activeSubTab === "guide" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-850 dark:text-white flex items-center gap-1.5">
                    📚 ملخص المنهج ومسرد المصطلحات المعمقة
                  </h3>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans">تحديث فوري بناء على المصادر</span>
                </div>

                {getStudyGuideNotes() ? (
                  <div className="space-y-6">
                    {getStudyGuideNotes()?.map((chap, idx) => (
                      <div 
                        key={chap.id}
                        className="p-5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-205 dark:border-slate-850 space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/70 pb-2">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                            الباب {chap.id} — {chap.englishTitle}
                          </span>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">
                            {chap.title}
                          </h4>
                        </div>

                        {/* Inline Graphic Simulation specific to the chapter to make explanations highly compatible */}
                        {chap.id === 1 && (
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-3 rounded-xl flex flex-col md:flex-row items-center gap-4">
                            {/* Microscope line chart vector */}
                            <svg className="w-16 h-16 text-indigo-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M6 18c0-1.5 1-3 3-3h6c2 0 3 1.5 3 3M12 3v12M9 5h6M6 21h12M12 15a3 3 0 100-6 3 3 0 000 6z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="text-[11px] leading-relaxed">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">🔬 مخطط: المجهر الضوئي المركب</span>
                              <p className="text-slate-500 dark:text-slate-400">يبين مسار الضوء من المصدر السفلي نحو المكثف، ثم الشريحة للحصول على صورة حيوية مكبرة تفصيلية للخلية.</p>
                            </div>
                          </div>
                        )}

                        {chap.id === 2 && (
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-3 rounded-xl flex flex-col md:flex-row items-center gap-4">
                            {/* Cell structure line-art map */}
                            <svg className="w-16 h-16 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <circle cx="12" cy="12" r="9" />
                              <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.1" />
                              <path d="M12 9a3 3 0 1 1-3 3" />
                              <ellipse cx="16" cy="12" rx="1" ry="2" />
                            </svg>
                            <div className="text-[11px] leading-relaxed">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">🦠 مخطط: تنظيم خلية حقيقية النواة</span>
                              <p className="text-slate-500 dark:text-slate-400">يوضح النواة في المركز محاطة بالمادة الوراثية المحمية، يحيط بها السيتوبلازم بمكوناته الكروية والميتوكوندريا.</p>
                            </div>
                          </div>
                        )}

                        {chap.id === 3 && (
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-3 rounded-xl flex flex-col md:flex-row items-center gap-4">
                            {/* Cladogram branch */}
                            <svg className="w-16 h-16 text-purple-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M3 21h18M5 21v-8m0 0l6-6m-6 6h14M11 13v-5m0 0l4-4m-4 4h8" strokeLinecap="round" />
                            </svg>
                            <div className="text-[11px] leading-relaxed">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">🌳 شجرة النطاقات الثلاثة لكارل ووس</span>
                              <p className="text-slate-500 dark:text-slate-400">تفرع شجرة الحياة إلى نطاقات: البكتيريا الحقيقية، الأركي القديمة (التي تتحمل الحموضة والملوحة الساحقة)، وحقيقيات النوى.</p>
                            </div>
                          </div>
                        )}

                        {chap.id === 4 && (
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-3 rounded-xl flex flex-col md:flex-row items-center gap-4">
                            {/* Plant cell turgidity */}
                            <svg className="w-16 h-16 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                              <rect width="10" height="10" x="7" y="7" rx="4" fill="currentColor" fillOpacity="0.1" />
                              <path d="M12 5v14M5 12h14" strokeDasharray="2 2" />
                            </svg>
                            <div className="text-[11px] leading-relaxed">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">💧 مخطط الاسموزية وضغط الامتلاء</span>
                              <p className="text-slate-500 dark:text-slate-400">تغلغل جزيئات الماء لملء الفجوة العصاروية، مما ينتج عنه ضغطا يدفع البلازما للخارج ويحكم الدعامة الهيدروستاتيكية كالمسمار المائي.</p>
                            </div>
                          </div>
                        )}

                        {chap.id === 5 && (
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-3 rounded-xl flex flex-col md:flex-row items-center gap-4">
                            {/* Punnett grid */}
                            <svg className="w-16 h-16 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M3 3h18v18H3V3zM3 12h18M12 3v18" />
                              <circle cx="7.5" cy="7.5" r="1" fill="currentColor" />
                              <circle cx="16.5" cy="16.5" r="1" fill="currentColor" />
                            </svg>
                            <div className="text-[11px] leading-relaxed">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">🧬 مخطط: توارث الصفة السائدة</span>
                              <p className="text-slate-500 dark:text-slate-400">انقسام الأليلات بالتكافؤ في مربع بانيت لتوقع احتمالات الجيل الأول الناتجة بنسبة السيادة التامة الشهيرة (3:1).</p>
                            </div>
                          </div>
                        )}

                        {chap.id === 6 && (
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-3 rounded-xl flex flex-col md:flex-row items-center gap-4">
                            {/* Energy pyramid steps */}
                            <svg className="w-16 h-16 text-cyan-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M12 3L2 21h20L12 3zM6 14h12M9 9h6" />
                            </svg>
                            <div className="text-[11px] leading-relaxed">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">🔺 مخطط: تدفق طاقة هرم الغذاء</span>
                              <p className="text-slate-500 dark:text-slate-400">يبين قاعدة الهرم الكبرى (المنتجات) وضياع 90% من طاقة أشعة الشمس المكتسبة عند الصعود لقمة هرم المستهلكين الأشرار.</p>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2 text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-sans">
                          {chap.sections.map((sect, sIdx) => (
                            <div key={sIdx} className="pl-4 border-r border-slate-200 dark:border-slate-800 pr-3.5 py-1">
                              <h5 className="font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1 mb-1.5">
                                <span className="w-1 h-1 rounded-full bg-indigo-500" />
                                {sect.title}
                              </h5>
                              <p className="text-slate-600 dark:text-slate-400 text-[11px] font-sans line-clamp-3">{sect.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-4">
                    <span className="text-5xl">📄</span>
                    <h4 className="font-bold text-sm text-slate-700 dark:text-slate-350">لا يوجد مصادر مفعلة</h4>
                    <p className="text-xs text-slate-400 max-w-xs font-sans">الرجاء تفعيل المستندات التي ترغب بمراجعتها ملخصاتها من اللوحة الجانبية.</p>
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 2: PODCAST SIMULATOR */}
            {activeSubTab === "audio" && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                
                {/* Audio Player Card Header */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-900/50 rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 select-none">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
                      البودكاست الصوتي التعليمي (Teacher Overview)
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">تم بواسطة معلمي المنهج سمير ومنى</span>
                  </div>
                  
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    محاكاة تامة لميزة NotebookLM الشهيرة! حوار ثنائي ترفيهي تبسيطي باللغة العربية لشرح كواليس الباب المختار وكأنك تستمع لإذاعة حية بين المعلمين.
                  </p>
                </div>

                {/* Central Media Player Controls and Waves */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white space-y-6 my-6 shadow-md relative overflow-hidden">
                  <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none bg-gradient-to-tr from-indigo-950/20 to-slate-900" />
                  
                  <div className="flex items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-650 rounded-xl flex items-center justify-center text-xl text-white shadow-md font-bold">
                        📻
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-none">موجز الشرح وال analogies الطريفة</h4>
                        <p className="text-[10px] text-indigo-300 font-sans mt-1.5">البقية المحددة من مستندات الدراسة</p>
                      </div>
                    </div>

                    {/* Podcast Speed button */}
                    <button 
                      onClick={() => setPodcastSpeed(prev => prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1)}
                      className="px-2.5 py-1 bg-white/10 border border-white/10 hover:bg-white/15 transition-all text-[10px] font-bold rounded-lg cursor-pointer shrink-0"
                    >
                      {podcastSpeed}x سرعة الحوار
                    </button>
                  </div>

                  {/* Simulated Wave Animation */}
                  <div className="flex items-end justify-center gap-1 h-12 py-2">
                    {[3, 8, 4, 1, 9, 6, 2, 7, 5, 8, 4, 9, 5, 4, 7, 3, 2, 8, 4, 1, 6, 4].map((v, i) => (
                      <span 
                        key={i} 
                        className="w-1 bg-indigo-500/80 rounded-full transition-all duration-300"
                        style={{ 
                          height: isPlaying ? `${Math.sin(currentTime + i) * 16 + 24}px` : "6px",
                        }}
                      />
                    ))}
                  </div>

                  {/* Timeline bar */}
                  <div className="space-y-1.5 relative z-10 font-sans">
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const percent = clickX / rect.width;
                      setCurrentTime(Math.floor(percent * totalTime));
                    }}>
                      <div 
                        className="bg-indigo-500 h-full transition-all duration-300" 
                        style={{ width: `${(currentTime / totalTime) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, "0")}</span>
                      <span>{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, "0")}</span>
                    </div>
                  </div>

                  {/* Control Play Pause */}
                  <div className="flex justify-center items-center gap-4 relative z-10">
                    <button 
                      onClick={() => setCurrentTime(0)}
                      className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 text-slate-350 hover:text-white transition-all cursor-pointer"
                      title="إعادة تشغيل"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-4 sm:p-5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer inline-flex items-center justify-center transition-all"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                    </button>
                    <span className="text-[9px] text-slate-500 px-3 bg-white/5 py-1 rounded-full animate-pulse">
                      {isPlaying ? "🎙️ جاري تلاوة الحكاية..." : "💤 انقر للاستماع"}
                    </span>
                  </div>

                </div>

                {/* Subtitle Dialogue block */}
                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl min-h-[140px] flex flex-col justify-start space-y-2">
                  <span className="text-[10px] font-bold text-indigo-650 dark:text-indigo-400 block mb-1">
                    📖 نص المحادثة التفاعلي المترابط:
                  </span>

                  {podcastScript.slice(0, activeSpeechIndex + 1).map((speech, index) => {
                    const isMona = speech.speaker === "mona";
                    return (
                      <div 
                        key={index} 
                        className={`flex gap-3 leading-relaxed items-start ${index === activeSpeechIndex ? "animate-fadeIn font-semibold" : "opacity-50"}`}
                      >
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 mt-0.5 ${
                          isMona ? "bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-400" : "bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-400"
                        }`}>
                          {isMona ? "أ. منى 👩‍🏫" : "أ. سمير 👨‍🏫"}
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 text-xs md:text-sm font-sans flex-1">
                          {speech.text}
                        </p>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* SUB-TAB 3: SMART FLASHCARDS */}
            {activeSubTab === "flashcards" && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-slate-850 dark:text-white flex items-center gap-1.5">
                    🗂️ بطاقات فلاشية ذكية لتدقيق التعاريف المنهجية
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                    انقر على البطاقة بالأسفل لطلب قلبها ومشاهدة التعريف النموذجي والجواب المعتمد من المنهج.
                  </p>
                </div>

                {/* Flashcard Component containing Flip State and 3D Perspective */}
                <div className="w-full flex justify-center py-6">
                  <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="w-full max-w-sm h-52 cursor-pointer select-none perspective-1000 group"
                  >
                    <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${
                      isFlipped ? "rotate-y-180" : ""
                    }`}>
                      
                      {/* Front: Question Side */}
                      <div className="absolute w-full h-full backface-hidden bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <span className="font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                            💡 {currentCards[currentCardIdx]?.category || "مفتوح"}
                          </span>
                          <span>البطاقة {currentCardIdx + 1} من {currentCards.length}</span>
                        </div>

                        <div className="py-4">
                          <h4 className="text-sm md:text-base font-extrabold text-slate-850 dark:text-white leading-snug">
                            {currentCards[currentCardIdx]?.question}
                          </h4>
                        </div>

                        <span className="text-[10px] font-bold text-indigo-500 block animate-pulse">
                          👆 انقر فورا لقلب البطاقة ومعاينة الإجابة
                        </span>
                      </div>

                      {/* Back: Answer Side */}
                      <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-50/20 dark:bg-indigo-950/20 border-2 border-indigo-500 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                            🎯 التعريف والجواب النموذجي
                          </span>
                          <span className="text-indigo-400 font-bold">NotebookLM</span>
                        </div>

                        <div className="py-4 px-2">
                          <p className="text-sm text-slate-800 dark:text-slate-100 font-bold font-sans leading-relaxed">
                            {currentCards[currentCardIdx]?.answer}
                          </p>
                        </div>

                        <span className="text-[10px] text-slate-400 block">
                          🔄 انقر للرجوع لوجه السؤال
                        </span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Footer buttons control indices */}
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850">
                  <button
                    disabled={currentCardIdx === 0}
                    onClick={() => setCurrentCardIdx(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800/80 hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-40 transition-all text-slate-700 dark:text-slate-300"
                  >
                    السابق ➡️
                  </button>
                  <span className="text-xs text-slate-500 font-sans">أظهرت {currentCardIdx + 1} من {currentCards.length} تعريف بطاقة</span>
                  <button
                    disabled={currentCardIdx === currentCards.length - 1}
                    onClick={() => setCurrentCardIdx(prev => Math.min(currentCards.length - 1, prev + 1))}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800/80 hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-40 transition-all text-slate-700 dark:text-slate-300"
                  >
                    ⬅️ التالي
                  </button>
                </div>

              </div>
            )}

            {/* SUB-TAB 4: GROUNDED SOURCE SEARCH */}
            {activeSubTab === "grounded-search" && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                
                <div className="space-y-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <h3 className="text-sm font-black text-slate-850 dark:text-white flex items-center gap-1.5">
                    🔍 محرك بحث اللجينات والمصادر المدعمة
                  </h3>
                  <p className="text-[11px] text-slate-550 dark:text-slate-450 font-sans leading-relaxed">
                    يعمل كـ NotebookLM البحثي تماماً. يتقيد محرك البحث المنهجي بمستنداتك النشطة لإنتاج مرجعيات من الأبواب مع ذكر دلالة الاقتباس الحرة بمأمن من مفتاح التشغيل.
                  </p>
                </div>

                {/* Conversation Box */}
                <div className="flex-1 min-h-[250px] max-h-[300px] overflow-y-auto space-y-4 py-2 pr-0.5">
                  {chatHistory.map((item, idx) => {
                    const isNotebook = item.role === "notebooklm";
                    return (
                      <div 
                        key={idx}
                        className={`flex flex-col max-w-[85%] ${
                          isNotebook ? "bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-200" : "bg-indigo-600 text-white mr-auto rounded-3xl"
                        } p-4 rounded-3xl space-y-2`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold block">
                            {isNotebook ? "🤖 مستخلص معتمد من المصدر — NotebookLM" : "👨‍🎓 الطالب المراجع"}
                          </span>
                          {isNotebook && (
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                          )}
                        </div>

                        <p className="text-xs md:text-sm font-sans text-justify whitespace-pre-wrap leading-relaxed">
                          {item.text}
                        </p>

                        {/* Grounded reference citation card */}
                        {item.citation && (
                          <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-1.5 text-[9px] text-indigo-600 dark:text-indigo-400 font-bold font-sans">
                            📝 المصدر المنهجي المقتبس: 
                            <span className="bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 border border-indigo-150/50 rounded-lg">
                              {item.citation}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {searchLoading && (
                    <div className="flex items-center gap-2 p-4 max-w-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 font-sans">
                        تحري المصادر النشطة واستخلاص الاقتباس الدراسي...
                      </span>
                    </div>
                  )}
                </div>

                {/* Submitting Interface form */}
                <form onSubmit={handleGroundedSearch} className="flex gap-2.5 pt-2">
                  <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="اسأل المصدر: ما هي أطوار الانقسام الفتيلي الميتوس؟ أو اذكر الكيتين..."
                    className="flex-1 bg-slate-50 dark:bg-slate-950/80 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-indigo-600 border border-slate-200/90 dark:border-slate-850"
                  />
                  <button 
                    type="submit"
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 cursor-pointer transition-all"
                  >
                    اسأل المصادر 🚀
                  </button>
                </form>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
