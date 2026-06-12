import React, { useState } from "react";
import { ZoomIn, Info } from "lucide-react";
import { motion } from "motion/react";

interface MicroscopePart {
  id: string;
  name: string;
  englishName: string;
  description: string;
  howToUse: string;
  color: string;
  icon: string;
}

const microscopeParts: Record<string, MicroscopePart> = {
  eyepiece: {
    id: "eyepiece",
    name: "العدسة العينية",
    englishName: "Eyepiece Lens",
    description: "العدسة التي ينظر من خلالها الفاحص مباشرة، وتقع في الجزء العلوي من أنبوب المجهر. تبلغ قوتها التكبيرية غالباً 10x أضعاف حجم العينة الفعلي.",
    howToUse: "أبق عينك قريبة مستقيمة منها؛ ولا تحرك رأسك بسرعة لتفادي ضبابية وتشوش مجسم العينة الخلوية.",
    color: "from-blue-500 to-indigo-600",
    icon: "👁️"
  },
  objective: {
    id: "objective",
    name: "العدسات الشيئية التكبيرية",
    englishName: "Objective Lenses",
    description: "مجموعة من 3 أو 4 عدسات مثبتة على القرص الدوار، تكون قريبة جداً من العينة المزروعة على الشريحة. تختلف قوتها التكبيرية (مثال: 4x, 10x, 40x, 100x).",
    howToUse: "ابدأ دائماً بالفحص مستخدماً أصغر عدسة (القوة الصغرى) لتأطير العينة وتوسيع الرؤية، ثم أدر القرص بلطف للتكبير الأقوى.",
    color: "from-emerald-500 to-teal-600",
    icon: "🔍"
  },
  stage: {
    id: "stage",
    name: "المنضدة (المسرح المعملي)",
    englishName: "Stage",
    description: "المسطح المعدني الأفقي الذي توضع وتثبت وتتحرك فوقه الشريحة الزجاجية الحاملة للعينة الخلوية المراد فحصها وتحليلها.",
    howToUse: "ضع شريحتك بدقة في المنتصف بحيث يمر ثقب الضوء من خلفها تماماً، وثبتها مستخدماً الملقط الطولي الميكانيكي الحامي.",
    color: "from-amber-500 to-orange-600",
    icon: "🎛️"
  },
  coarse_focus: {
    id: "coarse_focus",
    name: "الضابط الكبير لتقريب الرؤية",
    englishName: "Coarse Focus",
    description: "مقبض دوار كبير الحجم يقع على جانبي ذراع المجهر. يساعد في رفع أو خفض المنضدة بمسافات ملحوظة لتقريب العينة من العدسة الشيئية.",
    howToUse: "استخدمه فقط في البداية مع العدسة ذات القوة التكبيرية الصغرى، لمشاهدة الملامح الكلية والحدود العامة للعينة بدقة وسرعة.",
    color: "from-rose-500 to-purple-600",
    icon: "⚙️"
  },
  fine_focus: {
    id: "fine_focus",
    name: "الضابط الدقيق للتفاصيل",
    englishName: "Fine Focus",
    description: "مقبض دوار صغير الحجم مدمج أو بجوار المقبض الكبير. يحرك المنضدة بمسافات ميكرومترية دقيقة غير ملحوظة بالعين لتوضيح التفاصيل ومكامن الكروموسومات والكروماتين.",
    howToUse: "استخدمه عقب تبيين العينة بالضابط الكبير، لفحص وتبيين العضيات الدقيقة مع العدسات ذات القوة العالية جداً كالأغشية والميتوكوندريا.",
    color: "from-cyan-500 to-sky-600",
    icon: "🔮"
  },
  light_source: {
    id: "light_source",
    name: "مصدر الإضاءة السفلي",
    englishName: "Light Source",
    description: "مصباح كهربائي مثبت بقوة في قاعدة المجهر يرسل حزمة ضوئية مركزة ومكثفة تصعد للأعلى مخترقة ثقب المنضدة لإنارة وتوضيح الشريحة الشفافة.",
    howToUse: "تأكد من تشغيل زر المصباح الجانبي وضبط القرص الدوار السفلي (المكثف) للسماح بمرور كمية كافية من الضوء للتلوين البصري.",
    color: "from-yellow-400 to-amber-500",
    icon: "💡"
  },
  arm: {
    id: "arm",
    name: "الذراع المجهري الحامل",
    englishName: "Microscope Arm",
    description: "الهيكل المعدني المتين والمنحني الذي يربط بين الأنبوب العلوي للعدسات وبين القاعدة السفلية للمجهر. يحمل أيضاً مقابض الفحص الكبرى والدقيقة.",
    howToUse: "عند حمل المجهر ونقله، اقبض دائماً بيدك اليمنى بإحكام حول الذراع، وأسند القاعدة بيدك اليسرى لتفادي انزلاقه وسقوطه.",
    color: "from-slate-500 to-slate-700",
    icon: "💪"
  }
};

export default function MicroscopeExplorer() {
  const [selectedPart, setSelectedPart] = useState<MicroscopePart>(microscopeParts.eyepiece);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 lg:p-8" id="microscope-explorer-section">
      <div className="mb-6">
        <span className="px-3 py-1 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full font-sans uppercase tracking-widest border border-indigo-100/50 dark:border-indigo-900/30">
          الوحدة الأولى: مدخل لعلم الأحياء والمختبر
        </span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
          مستكشف المجهر الضوئي المركب التفاعلي
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-sans">
          انقر فوق أجزاء المجهر الضوئي للتعرف على وظيفة كل جزء ميكانيكي وبصري وكيفية استخدامه في التجارب العلمية
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Interactive Microscope Graphic Map (LHS) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full aspect-[4/5] max-w-[360px] bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850 p-4 flex flex-col justify-between items-center shadow-xs">
            
            {/* Custom Interactive Parts aligned in vertical skeleton */}
            <div className="w-full h-full flex flex-col justify-between relative py-4">
              
              {/* Eyepiece button */}
              <button 
                onClick={() => setSelectedPart(microscopeParts.eyepiece)}
                className={`w-3/5 mx-auto py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedPart.id === "eyepiece" 
                    ? "bg-gradient-to-tr from-blue-550 to-indigo-600 text-white border-blue-500 shadow-xs scale-102"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span>👁️</span> العدسة العينية (الأعلى)
              </button>

              {/* Arm & Objective button row */}
              <div className="grid grid-cols-2 gap-4 px-2">
                <button 
                  onClick={() => setSelectedPart(microscopeParts.arm)}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedPart.id === "arm" 
                      ? "bg-gradient-to-tr from-slate-500 to-slate-700 text-white border-slate-600 shadow-xs scale-102"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span>💪</span> الذراع الحامل
                </button>

                <button 
                  onClick={() => setSelectedPart(microscopeParts.objective)}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedPart.id === "objective" 
                      ? "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white border-indigo-500 shadow-xs scale-102"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span>🔍</span> العدسات الشيئية
                </button>
              </div>

              {/* Stage button */}
              <button 
                onClick={() => setSelectedPart(microscopeParts.stage)}
                className={`w-4/5 mx-auto py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedPart.id === "stage" 
                    ? "bg-gradient-to-tr from-amber-500 to-orange-600 text-white border-orange-500 shadow-xs scale-102"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span>🎛️</span> المنضدة والمسرح الزجاجي
              </button>

              {/* Knobs Row */}
              <div className="grid grid-cols-2 gap-4 px-2">
                <button 
                  onClick={() => setSelectedPart(microscopeParts.coarse_focus)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedPart.id === "coarse_focus" 
                      ? "bg-gradient-to-tr from-rose-500 to-purple-600 text-white border-purple-500 shadow-xs scale-102"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span>⚙️</span> الضابط الكبير
                </button>

                <button 
                  onClick={() => setSelectedPart(microscopeParts.fine_focus)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedPart.id === "fine_focus" 
                      ? "bg-gradient-to-tr from-cyan-500 to-sky-600 text-white border-sky-500 shadow-xs scale-102"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span>🔮</span> الضابط الدقيق
                </button>
              </div>

              {/* Light Source button */}
              <button 
                onClick={() => setSelectedPart(microscopeParts.light_source)}
                className={`w-3/5 mx-auto py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedPart.id === "light_source" 
                    ? "bg-gradient-to-tr from-yellow-400 to-amber-500 text-white border-amber-500 shadow-xs scale-102"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span>💡</span> مصباح الإضاءة والكهرباء
              </button>

            </div>

          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-4 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            انقر فوق أي قسم ميكانيكي أو بصري في المجهر لفتح لوحة الشرح والتوجيهات
          </p>
        </div>

        {/* Detailed Explanation Panel (RHS) */}
        <div className="lg:col-span-6">
          <motion.div
            key={selectedPart.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 shadow-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedPart.color} flex items-center justify-center text-2xl text-white shadow-sm`}>
                {selectedPart.icon}
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedPart.name}</h3>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block tracking-wider uppercase font-bold">
                  {selectedPart.englishName}
                </span>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-4" />

            <div className="space-y-4">
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  🔬 الوصف والوظيفة العلمية:
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed text-justify">
                  {selectedPart.description}
                </p>
              </div>

              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                <h4 className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1">
                  🛠️ كيف تستخدمه في تجاربك بنجاح؟
                </h4>
                <p className="text-slate-800 dark:text-slate-200 text-xs font-bold leading-relaxed">
                  {selectedPart.howToUse}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
