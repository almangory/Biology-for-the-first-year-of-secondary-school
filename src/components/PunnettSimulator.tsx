import React, { useState } from "react";
import { Sparkles, Dna, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface Trait {
  id: string;
  name: string;
  dominantName: string;
  dominantGene: string;
  recessiveName: string;
  recessiveGene: string;
  color: string;
}

const traits: Trait[] = [
  {
    id: "color",
    name: "لون أزهار البازلاء",
    dominantName: "أرجواني (سائد)",
    dominantGene: "A",
    recessiveName: "أبيض (متنحي)",
    recessiveGene: "a",
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: "height",
    name: "طول ساق البازلاء",
    dominantName: "طويل الساق (سائد)",
    dominantGene: "T",
    recessiveName: "قصير الساق (متنحي)",
    recessiveGene: "t",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: "seed",
    name: "شكل وبنية بذور البازلاء",
    dominantName: "بذور ملساء (سائد)",
    dominantGene: "R",
    recessiveName: "بذور مجعدة (متنحي)",
    recessiveGene: "r",
    color: "from-amber-500 to-yellow-600"
  }
];

export default function PunnettSimulator() {
  const [selectedTrait, setSelectedTrait] = useState<Trait>(traits[0]);
  const [parent1Gene1, setParent1Gene1] = useState<string>("A");
  const [parent1Gene2, setParent1Gene2] = useState<string>("a");
  const [parent2Gene1, setParent2Gene1] = useState<string>("A");
  const [parent2Gene2, setParent2Gene2] = useState<string>("a");

  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Sync genes when trait changes to prevent invalid gene letters
  React.useEffect(() => {
    setParent1Gene1(selectedTrait.dominantGene);
    setParent1Gene2(selectedTrait.recessiveGene);
    setParent2Gene1(selectedTrait.dominantGene);
    setParent2Gene2(selectedTrait.recessiveGene);
    setSimulationResult(null);
  }, [selectedTrait]);

  const handleSimulate = () => {
    // Generate Punnett grid: 2x2
    const cell1 = parent1Gene1 + parent2Gene1;
    const cell2 = parent1Gene1 + parent2Gene2;
    const cell3 = parent1Gene2 + parent2Gene1;
    const cell4 = parent1Gene2 + parent2Gene2;

    const formatGenotype = (g: string) => {
      // Sort capital letter first
      const sorted = g.split("").sort((a, b) => {
        if (a === a.toUpperCase() && b === b.toLowerCase()) return -1;
        if (a === a.toLowerCase() && b === b.toUpperCase()) return 1;
        return 0;
      }).join("");
      return sorted;
    };

    const g1 = formatGenotype(cell1);
    const g2 = formatGenotype(cell2);
    const g3 = formatGenotype(cell3);
    const g4 = formatGenotype(cell4);

    const genotypes = [g1, g2, g3, g4];

    // Calculate genotype rates
    const counts: Record<string, number> = {};
    for (const g of genotypes) {
      counts[g] = (counts[g] || 0) + 1;
    }

    // Determine phenotype
    const getPhenotype = (genotype: string) => {
      if (genotype.includes(selectedTrait.dominantGene)) {
        return selectedTrait.dominantName;
      }
      return selectedTrait.recessiveName;
    };

    const phenotypeCounts: Record<string, number> = {};
    for (const g of genotypes) {
      const p = getPhenotype(g);
      phenotypeCounts[p] = (phenotypeCounts[p] || 0) + 1;
    }

    setSimulationResult({
      grid: [
        [g1, g2],
        [g3, g4]
      ],
      genotypes: Object.entries(counts).map(([genotype, count]) => ({
        genotype,
        percentage: (count / 4) * 100,
        type: genotype === selectedTrait.dominantGene + selectedTrait.dominantGene ? "سائد نقي (Homozygous)" :
              genotype === selectedTrait.recessiveGene + selectedTrait.recessiveGene ? "متنحي نقي (Homozygous)" : "سائد هجين (Heterozygous)"
      })),
      phenotypes: Object.entries(phenotypeCounts).map(([phenotype, count]) => ({
        phenotype,
        percentage: (count / 4) * 100
      }))
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 lg:p-8" id="punnett-simulator-section">
      <div className="mb-6">
        <span className="px-3 py-1 text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-full font-sans uppercase tracking-widest border border-rose-100/50 dark:border-rose-900/30">
          الوحدة الخامسة: وراثة الكائنات الحية
        </span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
          مخطط بانيت والتهجين الوراثي التفاعلي
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-sans">
          قم بتهجين جينات الأبوين لترى كيف ينص قانون مندل الأول (انعزال الصفات) وكيف تتوزع الأمشاج
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Gene Selection Panel (LHS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Select Trait */}
          <div>
            <label className="block text-xs font-bold text-slate-450 dark:text-slate-500 mb-2 uppercase tracking-wide">
              🧪 اختبر صفة من بازلاء مندل:
            </label>
            <div className="flex flex-col gap-2">
              {traits.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrait(t)}
                  className={`px-4 py-3 rounded-xl border text-right transition-all flex justify-between items-center ${
                    selectedTrait.id === t.id
                      ? "border-blue-600 dark:border-blue-500 bg-blue-50/20 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 font-bold"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="text-xs">{t.name}</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full font-mono font-bold border border-slate-200/50 dark:border-slate-800">
                    {t.dominantGene}/{t.recessiveGene}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-850" />

          {/* Parental Genotype Setup */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Parent 1 */}
            <div className="p-4 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/15 border border-indigo-100 dark:border-indigo-900/40 shadow-xs">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block mb-3 text-center">
                🧬 جينات الأب (الأمشاج)
              </span>
              <div className="flex justify-center gap-2">
                <select
                  value={parent1Gene1}
                  onChange={(e) => setParent1Gene1(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl px-2 py-1 text-base font-bold text-indigo-950 dark:text-indigo-200 font-mono shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={selectedTrait.dominantGene}>{selectedTrait.dominantGene}</option>
                  <option value={selectedTrait.recessiveGene}>{selectedTrait.recessiveGene}</option>
                </select>
                <select
                  value={parent1Gene2}
                  onChange={(e) => setParent1Gene2(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl px-2 py-1 text-base font-bold text-indigo-950 dark:text-indigo-200 font-mono shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={selectedTrait.recessiveGene}>{selectedTrait.recessiveGene}</option>
                  <option value={selectedTrait.dominantGene}>{selectedTrait.dominantGene}</option>
                </select>
              </div>
              <p className="text-[10px] text-indigo-700 dark:text-indigo-400 text-center font-bold mt-2 font-mono">
                الطراز: {parent1Gene1}{parent1Gene2}
              </p>
            </div>

            {/* Parent 2 */}
            <div className="p-4 rounded-2xl bg-amber-50/30 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/40 shadow-xs">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mb-3 text-center">
                🧬 جينات الأم (الأمشاج)
              </span>
              <div className="flex justify-center gap-2">
                <select
                  value={parent2Gene1}
                  onChange={(e) => setParent2Gene1(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-xl px-2 py-1 text-base font-bold text-amber-950 dark:text-amber-200 font-mono shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value={selectedTrait.dominantGene}>{selectedTrait.dominantGene}</option>
                  <option value={selectedTrait.recessiveGene}>{selectedTrait.recessiveGene}</option>
                </select>
                <select
                  value={parent2Gene2}
                  onChange={(e) => setParent2Gene2(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-xl px-2 py-1 text-base font-bold text-amber-950 dark:text-amber-200 font-mono shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value={selectedTrait.recessiveGene}>{selectedTrait.recessiveGene}</option>
                  <option value={selectedTrait.dominantGene}>{selectedTrait.dominantGene}</option>
                </select>
              </div>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 text-center font-bold mt-2 font-mono">
                الطراز: {parent2Gene1}{parent2Gene2}
              </p>
            </div>

          </div>

          <button
            onClick={handleSimulate}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-bold rounded-2xl shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            بدء التهجين وتوزيع الأمشاج 🧬
          </button>

        </div>

        {/* Results and Grid Canvas (RHS) */}
        <div className="lg:col-span-7">
          {simulationResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
                <h3 className="text-center font-bold text-slate-800 dark:text-slate-200 mb-6 text-xs">
                  مخطط بانيت الوراثي الناتج (F1 / F2 Punnett Square)
                </h3>

                {/* 3x3 Simulated Grid */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono max-w-[340px] mx-auto">
                  {/* Empty corner */}
                  <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-900 font-bold rounded-xl text-slate-400 dark:text-slate-550 text-xs border border-slate-200/45 dark:border-slate-800">
                    ♂ \ ♀
                  </div>
                  {/* Parent 1 Genes */}
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300 font-bold rounded-xl text-lg border border-indigo-100/50 dark:border-indigo-900/30">
                    {parent1Gene1}
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300 font-bold rounded-xl text-lg border border-indigo-100/50 dark:border-indigo-900/30">
                    {parent1Gene2}
                  </div>

                  {/* Parent 2 Gene Row 1 */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-955/20 text-amber-800 dark:text-amber-300 font-bold rounded-xl text-lg flex items-center justify-center border border-amber-100/50 dark:border-amber-900/30">
                    {parent2Gene1}
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold rounded-xl text-xl shadow-xs flex flex-col items-center justify-center"
                  >
                    <span>{simulationResult.grid[0][0]}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans mt-0.5">
                      {simulationResult.grid[0][0].includes(selectedTrait.dominantGene) ? "سائد" : "متنحي"}
                    </span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold rounded-xl text-xl shadow-xs flex flex-col items-center justify-center"
                  >
                    <span>{simulationResult.grid[0][1]}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans mt-0.5">
                      {simulationResult.grid[0][1].includes(selectedTrait.dominantGene) ? "سائد" : "متنحي"}
                    </span>
                  </motion.div>

                  {/* Parent 2 Gene Row 2 */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-955/20 text-amber-800 dark:text-amber-300 font-bold rounded-xl text-lg flex items-center justify-center border border-amber-100/50 dark:border-amber-900/30">
                    {parent2Gene2}
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold rounded-xl text-xl shadow-xs flex flex-col items-center justify-center"
                  >
                    <span>{simulationResult.grid[1][0]}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans mt-0.5">
                      {simulationResult.grid[1][0].includes(selectedTrait.dominantGene) ? "سائد" : "متنحي"}
                    </span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold rounded-xl text-xl shadow-xs flex flex-col items-center justify-center"
                  >
                    <span>{simulationResult.grid[1][1]}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans mt-0.5">
                      {simulationResult.grid[1][1].includes(selectedTrait.dominantGene) ? "سائد" : "متنحي"}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Analysis of Genotypes & Phenotypes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Genotype Ratios */}
                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                  <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-3 block">
                    📊 الطُرز الجينية المتوقعة (Genotypes):
                  </h4>
                  <div className="space-y-3">
                    {simulationResult.genotypes.map((g: any, idx: number) => (
                      <div key={idx} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono text-base font-bold text-slate-800 dark:text-slate-200">{g.genotype}</span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{g.percentage}%</span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{g.type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phenotype Ratios */}
                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                  <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-3 block">
                    🧬 الطُرز الظاهرية الناتجة (Phenotypes):
                  </h4>
                  <div className="space-y-3">
                    {simulationResult.phenotypes.map((p: any, idx: number) => (
                      <div key={idx} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{p.phenotype}</span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{p.percentage}%</span>
                        </div>
                        {/* Simple Progress Bar */}
                        <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden mt-1.5">
                          <div 
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${p.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Mendelian Laws Info box */}
              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 text-slate-800 dark:text-slate-300 rounded-2xl border border-blue-100 dark:border-blue-900/35 font-sans text-xs leading-relaxed">
                💡 **ملاحظة منهجية**: هل رأيت؟ التوزيع العشوائي للأمشاج يفسر كيف تظهر وتختفي الصفات المتنحية مثل اللون الأبيض للأزهار أو البذور المجعدة. عند تزاوج نباتين أرجوانيين هجينين (Aa * Aa)، ترتفع نسبة ظهور الأرجواني إلى 75% بينما يعود اللون الأبيض للظهور بنسبة 25% (وهي نسبة مندل العبقرية 3:1!).
              </div>

            </motion.div>
          ) : (
            <div className="h-full min-h-[300px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-550">
              <Dna className="w-12 h-12 text-blue-300 dark:text-blue-900/40 mb-3 animate-pulse" />
              <p className="font-bold text-slate-600 dark:text-slate-400 text-sm">بانتظار تهجين الصفة الوراثية</p>
              <p className="text-xs mt-1 max-w-sm">قم بتحديد الطراز الجيني المراد تهجينه للأبوين ثم انقر فوق زر البدء لمشاهدة توزيع الكروماتيدات</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
