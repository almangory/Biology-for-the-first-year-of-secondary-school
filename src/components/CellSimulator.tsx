import React, { useState } from "react";
import { Info, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface Organelle {
  name: string;
  arabicName: string;
  description: string;
  role: string;
  analogy: string;
  color: string;
  icon: string;
}

const organelles: Record<string, Organelle> = {
  nucleus: {
    name: "Nucleus",
    arabicName: "النواة الخلوية",
    description: "أكبر وأهم غلاف حيوي داخل الخلايا حقيقية النواة. تمثل مركز التحكم الشامل بالخلية والمسؤولة عن تخزين المادة الوراثية الحاملة لتعليمات البناء.",
    role: "المكتبة الوراثية وتخزين حمض DNA وتوريث الصفات.",
    analogy: "مركز القيادة والإدارة أو غرفة التحكم المركزية للمصنع.",
    color: "from-indigo-500 to-purple-600",
    icon: "👑"
  },
  mitochondria: {
    name: "Mitochondria",
    arabicName: "الميتوكوندريا",
    description: "عضيات غشائية بيضاوية توصف بأنها العقل الطاقي للخلية. هي المسؤولة عن تحرير الطاقة الحيوية عبر هدم الغذاء وعمليات التنفس الخلوي.",
    role: "تحرير وتخزين مادة ATP التي تمد الخلية بالجرعات الحركية الحيوية.",
    analogy: "محطة توليد الكهرباء والوقود للخلية.",
    color: "from-rose-500 to-red-600",
    icon: "⚡"
  },
  chloroplast: {
    name: "Chloroplast",
    arabicName: "البلاستيدات الخضراء",
    description: "توجد في الخلايا النباتية فقط وتحتوي على صبغة الكلوروفيل (اليخضور) الخضراء. تمتص طاقة أشعة الشمس والضوء لصنع تيار الغذاء العضوي.",
    role: "التمثيل الضوئي (البناء الضوئي) وصنع سكر الجلوكوز العضوي من CO2 والماء.",
    analogy: "الألواح الشمسية ومطابخ صنع الغذاء في النبات.",
    color: "from-emerald-500 to-green-600",
    icon: "🌱"
  },
  cell_wall: {
    name: "Cell Wall",
    arabicName: "الجدار الخلوي",
    description: "جدار خارجي صلب ومتين يغلف فناء الغشاء البلازمي للخلايا النباتية والفطريات فقط. مبني من مادة السيليلوز الشفافة القوية ميكانيكياً.",
    role: "دعم الخلية ومنحها شكلاً ثابتاً وحمايتها من الانفجار وضغوط البيئة الخارجية.",
    analogy: "السور الخارجي الصلب والقلاع الحامية لأسوار المدينة.",
    color: "from-amber-600 to-orange-700",
    icon: "🧱"
  },
  vacuole: {
    name: "Vacuole",
    arabicName: "الفجوة العصارية",
    description: "مستودعات غشائية ممتلئة بسوائل حيوية غنية بالأملاح والسكريات والأحماض. في النباتات تكون عملاقة وحيدة وفي الحيوانات صغيرة ومبعثرة.",
    role: "حفظ التوازن المائي والغازي، وتوليد ضغط الامتلاء الاسموزي لإبقاء قوام النبات مشدوداً.",
    analogy: "خزانات المياه الكبرى أو مخازن حفظ المؤن والمخلفات.",
    color: "from-cyan-400 to-blue-500",
    icon: "💧"
  },
  ribosomes: {
    name: "Ribosomes",
    arabicName: "الرايبوسومات دقيقة الصنع",
    description: "أصغر كتل تركيبية حيوية خلوية مبعثرة في السيتوبلازم أو ملتصقة بالشبكة الإندوبلازمية الخشنة. لا تحاط بغلاف غشائي.",
    role: "مصانع الخلية المسؤولة عن ترجمة الشفرات الوراثية وتصنيع البروتينات الحيوية للبقاء والنمو.",
    analogy: "عامل البناء ومصنع إنتاج المواد والآلات الثقيلة.",
    color: "from-teal-400 to-emerald-500",
    icon: "🔧"
  },
  golgi: {
    name: "Golgi Bodies",
    arabicName: "أجسام جولجي",
    description: "مجموعة من الأكياس الغشائية المفلطحة المتوازية وحويصلاتها الإفرازية. اكتشفها العالم الإيطالي كاميلو جولجي.",
    role: "استقبال البروتينات والدهون من الشبكة، تعديلها، تغليفها، وتوزيعها لمواقع الاستخدام خارج وداخل الخلية.",
    analogy: "مكتب البريد ومجمع شحن وتغليف الطرود للخلية.",
    color: "from-pink-500 to-rose-600",
    icon: "📦"
  }
};

export default function CellSimulator() {
  const [selectedCell, setSelectedCell] = useState<"plant" | "animal">("plant");
  const [selectedOrganelle, setSelectedOrganelle] = useState<Organelle>(organelles.nucleus);

  const getOrganelleStyle = (id: string) => {
    return selectedOrganelle.name.toLowerCase().replace(" ", "_") === id
      ? "ring-4 ring-offset-2 ring-blue-500 scale-105 shadow-md"
      : "hover:scale-102 hover:shadow-xs cursor-pointer";
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 lg:p-8" id="cell-simulator-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="px-3 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full font-sans uppercase tracking-widest border border-blue-100/50 dark:border-blue-900/30">
            الوحدة الثانية: بيولوجيا الخلية
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            محاكي الخلية التفاعلي اليدوي
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-sans">
            قارن بين الخلية النباتية والحيوانية، واكتشف وظائف العضيات الخلوية بالتفصيل
          </p>
        </div>

        {/* Toggle cell type */}
        <div className="inline-flex p-1.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 self-start shadow-xs">
          <button
            onClick={() => {
              setSelectedCell("plant");
              setSelectedOrganelle(organelles.chloroplast);
            }}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              selectedCell === "plant"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            الخلية النباتية
          </button>
          <button
            onClick={() => {
              setSelectedCell("animal");
              setSelectedOrganelle(organelles.nucleus);
            }}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              selectedCell === "animal"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            الخلية الحيوانية
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Visual Canvas (LHS) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[450px] bg-slate-50/50 dark:bg-slate-950/40 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-center overflow-hidden shadow-xs">
            
            {/* Plant Cell Representation */}
            {selectedCell === "plant" ? (
              <div className="relative w-full h-full flex items-center justify-center p-2">
                {/* Cell Wall */}
                <div 
                  onClick={() => setSelectedOrganelle(organelles.cell_wall)}
                  className={`absolute inset-0 bg-amber-50 border-8 border-amber-600 rounded-3xl ${getOrganelleStyle("cell_wall")}`}
                  title="الجدار الخلوي"
                />
                {/* Plasma Membrane */}
                <div className="absolute inset-4 bg-emerald-50/40 border-4 border-emerald-400 rounded-2xl flex items-center justify-center">
                  
                  {/* Big Vacuole */}
                  <motion.div 
                    onClick={() => setSelectedOrganelle(organelles.vacuole)}
                    className={`absolute right-6 top-10 w-24 h-40 bg-cyan-200/80 border-2 border-cyan-400 rounded-full flex flex-col items-center justify-center ${getOrganelleStyle("vacuole")}`}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <span className="text-xl">💧</span>
                    <span className="text-[10px] font-bold text-cyan-800">فجوة عصارية</span>
                  </motion.div>

                  {/* Nucleus */}
                  <div 
                    onClick={() => setSelectedOrganelle(organelles.nucleus)}
                    className={`absolute left-8 bottom-12 w-28 h-28 bg-indigo-100 border-4 border-indigo-500 rounded-full flex flex-col items-center justify-center ${getOrganelleStyle("nucleus")}`}
                  >
                    <div className="w-10 h-10 bg-indigo-300 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-xs font-bold text-indigo-900">DNA</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-900 mt-1">النواة</span>
                  </div>

                  {/* Chloroplasts */}
                  <div 
                    onClick={() => setSelectedOrganelle(organelles.chloroplast)}
                    className={`absolute left-10 top-10 w-16 h-10 bg-green-500 border-2 border-green-700 rounded-full flex items-center justify-center text-white ${getOrganelleStyle("chloroplast")}`}
                  >
                    <span className="text-xs">🌱</span>
                  </div>
                  <div 
                    onClick={() => setSelectedOrganelle(organelles.chloroplast)}
                    className={`absolute right-32 bottom-8 w-16 h-10 bg-green-500 border-2 border-green-700 rounded-full flex items-center justify-center text-white ${getOrganelleStyle("chloroplast")}`}
                  >
                    <span className="text-xs">🌱</span>
                  </div>

                  {/* Mitochondria */}
                  <div 
                    onClick={() => setSelectedOrganelle(organelles.mitochondria)}
                    className={`absolute right-12 bottom-20 w-14 h-8 bg-red-400 border border-red-600 rounded-full flex items-center justify-center text-white rotate-45 ${getOrganelleStyle("mitochondria")}`}
                  >
                    <span className="text-[10px] font-bold font-mono">ATP</span>
                  </div>

                  {/* Ribosomes */}
                  <div 
                    onClick={() => setSelectedOrganelle(organelles.ribosomes)}
                    className="absolute left-24 top-24 flex gap-1 cursor-pointer"
                  >
                    <span className="w-2 h-2 bg-slate-800 rounded-full" />
                    <span className="w-2 h-2 bg-slate-800 rounded-full" />
                    <span className="w-2 h-2 bg-slate-800 rounded-full" />
                  </div>
                </div>
              </div>
            ) : (
              /* Animal Cell Representation */
              <div className="relative w-full h-full flex items-center justify-center p-2">
                {/* Plasma Membrane Only */}
                <div className="absolute inset-4 bg-blue-50/50 border-4 border-blue-400 rounded-full flex items-center justify-center">
                  
                  {/* Centered Nucleus */}
                  <div 
                    onClick={() => setSelectedOrganelle(organelles.nucleus)}
                    className={`w-32 h-32 bg-indigo-100 border-4 border-indigo-500 rounded-full flex flex-col items-center justify-center ${getOrganelleStyle("nucleus")}`}
                  >
                    <div className="w-12 h-12 bg-indigo-300 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-sm font-bold text-indigo-900">DNA</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-900 mt-1">النواة الخلوية</span>
                  </div>

                  {/* Mitochondria */}
                  <div 
                    onClick={() => setSelectedOrganelle(organelles.mitochondria)}
                    className={`absolute left-8 top-16 w-16 h-10 bg-red-400 border-2 border-red-600 rounded-full flex items-center justify-center text-white -rotate-12 ${getOrganelleStyle("mitochondria")}`}
                  >
                    <span className="text-xs font-bold font-mono">ATP</span>
                  </div>
                  <div 
                    onClick={() => setSelectedOrganelle(organelles.mitochondria)}
                    className={`absolute right-12 bottom-12 w-16 h-10 bg-red-400 border-2 border-red-600 rounded-full flex items-center justify-center text-white rotate-45 ${getOrganelleStyle("mitochondria")}`}
                  >
                    <span className="text-xs">⚡</span>
                  </div>

                  {/* Golgi Bodies */}
                  <div 
                    onClick={() => setSelectedOrganelle(organelles.golgi)}
                    className={`absolute right-8 top-16 w-20 h-10 flex flex-col gap-0.5 justify-center ${getOrganelleStyle("golgi")}`}
                  >
                    <span className="h-1.5 w-full bg-pink-400 rounded-full" />
                    <span className="h-1.5 w-4/5 bg-pink-400 rounded-full" />
                    <span className="h-1.5 w-2/3 bg-pink-400 rounded-full" />
                  </div>

                  {/* Ribosomes */}
                  <div 
                    onClick={() => setSelectedOrganelle(organelles.ribosomes)}
                    className="absolute left-16 bottom-20 flex gap-1 cursor-pointer"
                  >
                    <span className="w-2.5 h-24 bg-teal-100/50 rounded-full border border-teal-200 p-0.5 flex flex-col justify-between items-center" title="الرايبوسومات">
                      <span className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                      <span className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                      <span className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            أنقر على الأقسام الملونة داخل مجسم الخلية لقراءة شرح المنهج الوزاري
          </p>
        </div>

        {/* Detailed Explanation Panel (RHS) */}
        <div className="lg:col-span-5">
          <motion.div
            key={selectedOrganelle.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 shadow-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${selectedOrganelle.color} flex items-center justify-center text-2xl text-white shadow-sm`}>
                {selectedOrganelle.icon}
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedOrganelle.arabicName}</h3>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block tracking-wider uppercase font-bold">
                  {selectedOrganelle.name}
                </span>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-4" />

            <div className="space-y-4">
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  💡 الشرح المنهجي الوافي:
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                  {selectedOrganelle.description}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  🎯 الوظيفة الحيوية الأساسية:
                </h4>
                <p className="text-slate-800 dark:text-slate-200 text-xs font-bold">
                  {selectedOrganelle.role}
                </p>
              </div>

              <div className="p-3 bg-blue-50/55 dark:bg-blue-950/20 rounded-xl border border-blue-100/50 dark:border-blue-900/30">
                <h4 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                  🧠 تشبيه لتبسيط الفهم:
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs italic">
                  &ldquo;{selectedOrganelle.analogy}&rdquo;
                </p>
              </div>
            </div>

            {/* Custom Syllabus warning if selected cell style conflicts */}
            {selectedCell === "animal" && selectedOrganelle.name === "Cell Wall" && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-xl border border-red-100/50 dark:border-red-900/40 text-xs font-bold shadow-xs">
                ⚠️ ينص الكتاب المدرسي أن **الجدار الخلوي** لا يتواجد مطلقاً في خلايا الحيوانات بل ينفرد في خلايا النباتات والطلائعيات والفطريات لتوفير الدعامة.
              </div>
            )}
            {selectedCell === "animal" && selectedOrganelle.name === "Chloroplast" && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-xl border border-red-100/50 dark:border-red-900/40 text-xs font-bold shadow-xs">
                ⚠️ انتبه! **البلاستيدات الخضراء** لا تتواجد في الخلية الحيوانية لأن الحيوان غير ذاتي التغذية (Heterotroph)، بل هي حكر على النباتات والطحالب فقط لصنع عملية التمثيل الضوئي.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
