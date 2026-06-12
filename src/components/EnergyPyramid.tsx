import React, { useState } from "react";
import { Zap, HelpCircle, ArrowDown } from "lucide-react";
import { motion } from "motion/react";

interface TrophicLevel {
  level: number;
  name: string;
  representative: string;
  efficiencyLoss: string;
  originalEnergyPercent: number;
  description: string;
  color: string;
  badgeColor: string;
  icon: string;
}

const levels: TrophicLevel[] = [
  {
    level: 4,
    name: "آكلات اللحوم العليا (مستهلك ثالثي)",
    representative: "الصقور والنسور الذهبية",
    efficiencyLoss: "يصل إليها 10 كيلو جول فقط من أصل 10,000 كيلو جول طاقة مخزنة بالمنتج الأول (بقاء 0.1% فقط).",
    originalEnergyPercent: 0.1,
    description: "تمثل قمة الهرم الغذائي. كائنات لاحمة متفوقة تتغذى على المستهلكات الثانوية. الطاقة المتاحة لها ضئيلة جداً، لذا يقل عدد أفرادها بشدة في أي نظام بيئي مستقر لضمان البقاء.",
    color: "from-rose-500 to-red-600",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    icon: "🦅"
  },
  {
    level: 3,
    name: "آكلات اللحوم (مستهلك ثانوي)",
    representative: "الأفاعي والذئاب والثعالب",
    efficiencyLoss: "يصل إليها 100 كيلو جول فقط (بقاء 1% من الطاقة الكيميائية الكلية المخزنة بالمنتجات الأولية).",
    originalEnergyPercent: 1.0,
    description: "كائنات تتغذى على الكائنات العاشبة (المستهلك الأول). تفقد معظم المأكول الطاقي عبر حرارة التنفس الخلوي والحركة اليومية اللاهثة، مما يترك نسبة قليلة للمستوى التالي.",
    color: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "🦊"
  },
  {
    level: 2,
    name: "آكلات الأعشاب (مستهلك أولي)",
    representative: "الأرانب والجراد والماشية",
    efficiencyLoss: "يصل إليها 1,000 كيلو جول فقط (بقاء 10% من الطاقة الكلية المخزنة بالمنتجات الأولية).",
    originalEnergyPercent: 10.0,
    description: "تمثل الكائنات التي تحصد طاقتها مباشرة بالتهام الأنسجة الخضراء للنباتات. تبذل جهداً كبيراً في هضم السيليلوز وتبدد معظم طاقتها في ميكانيكية الهروب من الضواري السابقة.",
    color: "from-cyan-500 to-blue-600",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    icon: "🐇"
  },
  {
    level: 1,
    name: "ممتصو أشعة الشمس (المنتجون)",
    representative: "النباتات الخضراء والأشجار والطحالب",
    efficiencyLoss: "تحتفظ بـ 10,000 كيلو جول كطاقة كيميائية مخزنة بالكامل بالبناء الضوئي (تعادل 100% من الطاقة المدخلة).",
    originalEnergyPercent: 100.0,
    description: "قاعدة الهرم والنظام البيئي بأكمله. تحول الطاقة الإشعاعية المجانية القادمة من الشمس مباشرة إلى روابط طاقة كيميائية مخزنة في جزيئات سكر الجلوكوز، وهي نقطة بدء سريان الحياة بالمنصة.",
    color: "from-emerald-500 to-green-600",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "🌳"
  }
];

export default function EnergyPyramid() {
  const [selectedLevel, setSelectedLevel] = useState<TrophicLevel>(levels[3]);
  const [initialEnergy, setInitialEnergy] = useState<number>(10000);
  const [activeTab, setActiveTab] = useState<"decline" | "magnification">("decline");

  const calculateEnergy = (percent: number) => {
    return (initialEnergy * (percent / 100)).toFixed(1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 lg:p-8" id="energy-pyramid-section">
      <div className="mb-6">
        <span className="px-3 py-1 text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-full font-sans uppercase tracking-widest border border-cyan-100/50 dark:border-cyan-900/30">
          الوحدة السادسة: علم البيئة ومستويات الطاقة
        </span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
          هرم الطاقة والتناقص البيئى التفاعلي
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          اكتشف مستويات السلسلة الغذائية وقانون الـ 10% لتناقص وتدفق تيار الطاقة عبر الكائنات الحية
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Interactive Pyramid Display (LHS) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          {/* Custom Energy Input */}
          <div className="w-full max-w-sm mb-6 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 block uppercase mb-1 font-sans">
                ⚡ غير طاقة البدء الشمسية للمنتجات (كيلو جول):
              </label>
              <input
                type="number"
                value={initialEnergy}
                onChange={(e) => setInitialEnergy(Math.max(10, parseInt(e.target.value) || 10000))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-700 rounded-lg px-2.5 py-1 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            </div>
            <div className="text-left font-mono">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold">الطاقة الأولية</span>
              <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">{initialEnergy.toLocaleString()} kJ</span>
            </div>
          </div>

          {/* Interactive Stacked Pyramid */}
          <div className="w-full max-w-[420px] aspect-[4/3] flex flex-col justify-between relative mt-4">
            {levels.map((lvl, index) => {
              const isSelected = selectedLevel.level === lvl.level;
              const widthClass = 
                lvl.level === 1 ? "w-full" :
                lvl.level === 2 ? "w-4/5" :
                lvl.level === 3 ? "w-3/5" : "w-2/5";

              return (
                <div key={lvl.level} className="flex justify-center w-full">
                  <motion.div
                    onClick={() => setSelectedLevel(lvl)}
                    className={`${widthClass} h-14 bg-gradient-to-tr ${lvl.color} text-white font-bold rounded-xl flex items-center justify-between px-4 cursor-pointer shadow-md transition-all relative border border-white/10 ${
                      isSelected 
                        ? "ring-4 ring-offset-2 ring-cyan-500 scale-102"
                        : "hover:translate-y-[-2px] hover:shadow-lg"
                    }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{lvl.icon}</span>
                      <span className="text-xs md:text-sm font-sans truncate pr-1">
                        {lvl.name.split(" ")[0]}
                      </span>
                    </div>
                    
                    {/* Energy Output */}
                    <span className="font-mono text-xs bg-black/20 px-2.5 py-1 rounded-lg">
                      {calculateEnergy(lvl.originalEnergyPercent)} kJ
                    </span>

                    {/* Left connection marker */}
                    {isSelected && (
                      <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-500 rounded-full animate-ping" />
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-6 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            تلاحظ تناقص مقدار الطاقة المتدفقة لأعلى بنسبة 90% بين كل مستويين متتالين!
          </p>
        </div>

        {/* Detailed Explanation Panel (RHS) */}
        <div className="lg:col-span-5">
          <motion.div
            key={selectedLevel.level}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 shadow-xs"
          >
            <div className="mb-4">
              <span className={`px-2.5 py-1 text-[10px] font-bold border rounded-full ${selectedLevel.badgeColor} dark:bg-slate-900 dark:text-slate-350 dark:border-slate-700`}>
                مستوى الهرم: {selectedLevel.level}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 flex items-center gap-2">
                <span>{selectedLevel.icon}</span>
                <span>{selectedLevel.name}</span>
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1">
                كائنات نموذجية: {selectedLevel.representative}
              </p>
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-4" />

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">
                  📊 المفقود والمتبقي من تيار الطاقة:
                </h4>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selectedLevel.efficiencyLoss}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">
                  📚 التوضيح العلمي من الكتاب المدرسي:
                </h4>
                <p className="text-slate-705 dark:text-slate-300 text-xs leading-relaxed text-justify">
                  {selectedLevel.description}
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-955/20 text-amber-800 dark:text-amber-400 rounded-xl border border-amber-100 dark:border-amber-900/30 text-[11px] leading-relaxed">
                🧪 **تجربة ذهنية**: إذا بدأت السلسلة بـ {initialEnergy.toLocaleString()} كيلو جول، يتبقى للمستهلك الثالث الأخير فقط {calculateEnergy(selectedLevel.originalEnergyPercent)} كيلو جول! وهذا يفسر استحالة نمو السلاسل الغذائية لأكثر من 5 مستويات، لتلاشي تيار الطاقة تماماً في المستويات المتتالية.
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Textbook Comparison: Decline vs. Biomagnification */}
      <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-805">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              مقارنة منهجية هامة: التناقص البيئي (الطاقة) مقابل التضخم الحيوي (السموم)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
              مبني على أحكام كتاب علم البيئة للمرحلة الثانوية لتوضيح الفروق العلمية الدقيقة
            </p>
          </div>

          <div className="flex justify-center p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl max-w-md mx-auto border border-slate-200 dark:border-slate-850">
            <button
              onClick={() => setActiveTab("decline")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "decline"
                  ? "bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              📉 تناقص الطاقة والكتلة والأعداد
            </button>
            <button
              onClick={() => setActiveTab("magnification")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "magnification"
                  ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-455 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              ⚠️ التضخم الحيوي للمبيدات والسموم
            </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`p-5 rounded-2xl border ${
              activeTab === "decline"
                ? "bg-cyan-50/10 dark:bg-cyan-955/5 border-cyan-250/30 dark:border-cyan-900/40 text-slate-800 dark:text-slate-200"
                : "bg-rose-50/10 dark:bg-rose-955/5 border-rose-250/30 dark:border-rose-900/40 text-slate-800 dark:text-slate-200"
            }`}
          >
            {activeTab === "decline" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                  <span className="text-xl">📉</span>
                  <h4 className="font-bold text-sm">قانون التناقص البيئي المستمر (السريان أحادي الاتجاه)</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed text-justify">
                  تنص القوانين في كتاب علم البيئة على أن <strong>الطاقة، والكتلة الحيوية، وأعداد الكائنات</strong> تتناسب طردياً مع تيار تدفق المغذيات؛ حيث <strong>تتناقص تدريجياً وبشدة</strong> مع كل صعود من مستوى غذائي إلى آخر للأعلى في هرم الطاقة (بمعدل فقد 90% وانتقال 10% فقط).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="bg-white/80 dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-100 block mb-1">⚡ تناقص الطاقة</span>
                    تفقد الطاقة على شكل حرارة نتيجة التنفس الخلوي وبذل الشغل، مما يحد من طول السلسلة الغذائية الباقية.
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-100 block mb-1">⚖️ تناقص الكتلة الحيوية</span>
                    تقل كمية المادة العضوية الكلية عند كل مستوى للأعلى لأن الكائنات تستهلك كميات من الأنسجة لصيانة ذاتها.
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-100 block mb-1">👥 تناقص الأعداد</span>
                    يقل عدد أفراد الجماعات الحيوية تدريجياً كلما ترقينا للأعلى ليتلاءم مع كمية الطاقة المتبقية الضئيلة.
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-rose-650 dark:text-rose-405">
                  <span className="text-xl">⚠️</span>
                  <h4 className="font-bold text-sm">ظاهرة التضخم الحيوي للمبيدات والسموم (Biomagnification)</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed text-justify">
                  على النقيض تماماً من تيار الطاقة المتبدد، فإن <strong>المواد الكيميائية السامة وغير القابلة للتحلل</strong> (مثل المبيد الحشري الشهير <strong>DDT</strong> أو المعادن الثقيلة كالزئبق والرصاص) <strong>تتراكم ويتضاعف تركيزها بيولوجياً بآلاف المرات</strong> كلما صعدنا باتجاه قمة الهرم الغذائي!
                </p>
                <div className="bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-100/40 dark:border-rose-900 text-xs leading-relaxed">
                  📌 <strong>مثال الكتاب المصدر:</strong> مياه البحيرة قد تحتوي على نسبة ضئيلة جداً من السموم، فتمتصها الطحالب (المنتجات)، ثم يتغذى عليها العوالق الحيوانية، ثم الأسماك الصغيرة، ثم الأسماك الكبيرة، وصولاً إلى الطيور الجارحة (مثل الصقر أو النسر) في قمة الهرم. يجمع كل كائن سموم المستويات الأدنى في جسده دون قدرة على التخلص منها، مما يجعل الكائن الأعلى هو الأكثر تسمماً وتضرراً على الإطلاق!
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

    </div>
  );
}
