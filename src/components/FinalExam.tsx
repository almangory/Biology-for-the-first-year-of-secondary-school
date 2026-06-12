import React, { useState, useEffect } from "react";
import { Award, Timer, CheckCircle, XCircle, ChevronLeft, Volume2, Trophy, ArrowRight, Printer } from "lucide-react";
import { motion } from "motion/react";
import { Question } from "../types";
import { questionsData, chaptersData } from "../data/curriculumData";

interface FinalExamProps {
  onUpdateStats: (xpGain: number) => void;
}

export default function FinalExam({ onUpdateStats }: FinalExamProps) {
  const [testMode, setTestMode] = useState<"choose" | "practice" | "exam">("choose");
  const [selectedPracticeChapter, setSelectedTraitPractice] = useState<number>(1);

  // Active state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Exam stats & timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [examPassed, setExamPassed] = useState(false);
  const [examScore, setExamScore] = useState(0);

  // Practice instant feedback
  const [practiceAnswerChecked, setPracticeAnswerChecked] = useState(false);
  const [practiceStatus, setPracticeStatus] = useState<"correct" | "incorrect" | null>(null);

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (testMode === "exam" && !submitted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleCompleteExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testMode, timeLeft, submitted]);

  const handleStartPractice = (chapterId: number) => {
    const list = questionsData.filter((q) => q.chapterId === chapterId);
    if (list.length === 0) return;
    setActiveQuestions(list);
    setCurrentIdx(0);
    setAnswers({});
    setSubmitted(false);
    setPracticeAnswerChecked(false);
    setPracticeStatus(null);
    setTestMode("practice");
  };

  const handleStartExam = () => {
    // Pick 12 random questions from our pool
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 12);
    setActiveQuestions(selected);
    setCurrentIdx(0);
    setAnswers({});
    setSubmitted(false);
    setTimeLeft(12 * 60); // 12 minutes total
    setTestMode("exam");
  };

  const handleSelectOption = (questionId: number, val: string) => {
    if (submitted) return;
    if (testMode === "practice" && practiceAnswerChecked) return;

    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  // Practice mode: check answer instantly
  const handleCheckPracticeAnswer = () => {
    const q = activeQuestions[currentIdx];
    const ans = answers[q.id];
    if (ans === undefined) return;

    const isCorrect = ans === q.answer;
    setPracticeStatus(isCorrect ? "correct" : "incorrect");
    setPracticeAnswerChecked(true);

    if (isCorrect) {
      onUpdateStats(10); // Gain 10 XP
    }
  };

  const handlePracticeNext = () => {
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setPracticeAnswerChecked(false);
      setPracticeStatus(null);
    } else {
      // Completed practice
      setSubmitted(true);
    }
  };

  const handleCompleteExam = () => {
    setSubmitted(true);
    let correct = 0;
    activeQuestions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        correct++;
      }
    });

    const scorePercentage = (correct / activeQuestions.length) * 100;
    setExamScore(scorePercentage);
    const passed = scorePercentage >= 70;
    setExamPassed(passed);

    // XP calculation: 15 XP for every correct answers, 100 bonus XP for passing!
    const xpGain = correct * 15 + (passed ? 100 : 0);
    onUpdateStats(xpGain);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 lg:p-8" id="exams-section">
      
      {/* Intro choose panel */}
      {testMode === "choose" && (
        <div className="space-y-8 animate-fadeIn">
          <div className="text-center max-w-xl mx-auto">
            <span className="px-3 py-1 text-xs font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-full font-sans uppercase tracking-widest border border-violet-100/55 dark:border-violet-900/30">
              بنك الأسئلة والامتحانات التفاعلية
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              تحديات المعلم التعليمي التفاعلية
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-sans">
              اختر وضع التدريب لدراسة أبواب المنهج بشكل منفصل والحصول على إجابات مشروحة فوراً، أو خض غمار الامتحان الشامل لكسب الشهادة الوزارية المعنوية!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Practice mode */}
            <div className="p-6 rounded-2xl bg-slate-50/55 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs hover:border-slate-350 dark:hover:border-slate-700 transition-all">
              <div>
                <span className="text-3xl mb-3 block">📖</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  وضع التدريب الحر لكل باب
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed font-sans">
                  تمرن على أسئلة كل باب دراسي على حدة. تحصل على ميزة التحقق الفوري من الإجابة مع مراجعة الشرح العلمي المعتمد والمنهجي لكل سؤال فوراً لكسب 10 XP لكل إجابة صحيحة.
                </p>

                {/* Chapter selector */}
                <div className="mt-4 space-y-2">
                  <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mb-1">اختر الباب للبدء بالتدريب:</label>
                  <select 
                    value={selectedPracticeChapter}
                    onChange={(e) => setSelectedTraitPractice(parseInt(e.target.value))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-xs font-sans"
                  >
                    {chaptersData.map((c) => (
                      <option key={c.id} value={c.id} className="dark:bg-slate-900">{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => handleStartPractice(selectedPracticeChapter)}
                className="mt-6 w-full py-3 bg-blue-655 hover:bg-blue-700 cursor-pointer text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1"
              >
                بدء تدريب الباب المحدد
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>

            {/* Exam mode */}
            <div className="p-6 rounded-2xl bg-amber-50/15 dark:bg-amber-955/5 border border-amber-200/60 dark:border-amber-900/40 flex flex-col justify-between shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-all">
              <div>
                <span className="text-3xl mb-3 block">🏆</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  الامتحان الوزاري الشامل
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed font-sans">
                  اختبار شامل ومؤقت يحاكي الامتحانات الحقيقية للمرحلة الثانوية. يتكون المخطط من 12 سؤالاً عشوائياً من كافة وحدات المنهج. لتنجح وتحوز شهادة التميز يجب أن تحقق 70% أو أكثر!
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-semibold bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-xl border border-amber-100 dark:border-amber-900/30">
                  <Timer className="w-4 h-4 shrink-0" />
                  <span>الوقت الكلي المتاح: 12 دقيقة</span>
                </div>
              </div>

              <button
                onClick={handleStartExam}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1"
              >
                بدء الامتحان التجريبي الشامل
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Practice mode display */}
      {testMode === "practice" && activeQuestions.length > 0 && (
        <div className="animate-fadeIn max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={() => setTestMode("choose")}
              className="text-xs text-gray-500 hover:text-gray-900 font-semibold flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4" />
              الخروج للرئيسية
            </button>
            <span className="text-xs font-bold text-gray-400">
              سؤال {currentIdx + 1} من {activeQuestions.length}
            </span>
          </div>

          {/* Question Box */}
          <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              activeQuestions[currentIdx].difficulty === "سهل" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-450 border border-emerald-150 dark:border-emerald-900/40" :
              activeQuestions[currentIdx].difficulty === "متوسط" ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-450 border border-amber-150 dark:border-amber-900/40" :
              "bg-rose-50 dark:bg-rose-950/30 text-rose-705 dark:text-rose-450 border border-rose-150 dark:border-rose-900/40"
            }`}>
              صعوبة السؤال: {activeQuestions[currentIdx].difficulty}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3.5 leading-snug">
              {activeQuestions[currentIdx].text}
            </h3>

            {/* Answers rendering */}
            <div className="mt-6 space-y-2">
              {activeQuestions[currentIdx].type === "multiple-choice" ? (
                /* Multiple choice options */
                activeQuestions[currentIdx].options?.map((opt, idx) => {
                  const isSelected = answers[activeQuestions[currentIdx].id] === String(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(activeQuestions[currentIdx].id, String(idx))}
                      disabled={practiceAnswerChecked}
                      className={`w-full text-right p-3.5 rounded-xl border text-xs transition-all focus:outline-none flex justify-between items-center ${
                        isSelected 
                          ? "border-blue-600 bg-blue-50/20 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 font-bold"
                          : "border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-xs"
                      }`}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })
              ) : (
                /* Boolean options */
                ["true", "false"].map((val) => {
                  const isSelected = answers[activeQuestions[currentIdx].id] === val;
                  return (
                    <button
                      key={val}
                      onClick={() => handleSelectOption(activeQuestions[currentIdx].id, val)}
                      disabled={practiceAnswerChecked}
                      className={`w-full text-right p-3.5 rounded-xl border text-xs transition-all focus:outline-none flex justify-between items-center ${
                        isSelected 
                          ? "border-blue-600 bg-blue-50/20 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 font-bold"
                          : "border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-xs"
                      }`}
                    >
                      <span>{val === "true" ? "صحيح" : "خطأ"}</span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Practice actions */}
            {!submitted && (
              <div className="mt-6 flex justify-end gap-2">
                {!practiceAnswerChecked ? (
                  <button
                    onClick={handleCheckPracticeAnswer}
                    disabled={answers[activeQuestions[currentIdx].id] === undefined}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition-colors font-sans"
                  >
                    تحقق من الإجابة المعطاة
                  </button>
                ) : (
                  <button
                    onClick={handlePracticeNext}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center gap-1 font-sans cursor-pointer"
                  >
                    <span>{currentIdx + 1 === activeQuestions.length ? "مشاهدة التقرير النهائي" : "السؤال التالي"}</span>
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Practice Feedback Box */}
          {practiceAnswerChecked && practiceStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border ${
                practiceStatus === "correct" 
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200" 
                  : "bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/40 text-red-950 dark:text-red-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {practiceStatus === "correct" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <h4 className="font-bold text-sm">
                  {practiceStatus === "correct" ? "أحسنت يا بطل! إجابة صحيحة وكسبت +10 XP" : "للأسف الشديد إجابتك غير دقيقة!"}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans mt-1">
                **الشرح العلمي المعتمد**: {activeQuestions[currentIdx].explanation}
              </p>
            </motion.div>
          )}

          {/* Submitted Practiced Stats */}
          {submitted && (
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center max-w-md mx-auto space-y-4 shadow-xs">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">أنهيت التدريب بنجاح!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans mt-1">
                لقد أكملت التدريب على أسئلة هذا الباب. مراجعة الأسئلة وتكرارها يضمن لك الحصول على أعلى المراتب في الامتحانات المدرسية المعنوية.
              </p>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex justify-around">
                <div>
                  <span className="text-xs text-slate-400 block pb-1">معدل الإجابات</span>
                  <span className="text-lg font-bold text-slate-800 dark:text-white">
                    {Object.values(answers).filter((a, idx) => a === activeQuestions[idx]?.answer).length} / {activeQuestions.length}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block pb-1">نقاط XP المكتسبة</span>
                  <span className="text-lg font-bold text-blue-650">
                    +{Object.values(answers).filter((a, idx) => a === activeQuestions[idx]?.answer).length * 10} XP
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setTestMode("choose")}
                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                العودة لبوابة الامتحانات
              </button>
            </div>
          )}
        </div>
      )}

      {/* Exam mode display */}
      {testMode === "exam" && activeQuestions.length > 0 && (
        <div className="animate-fadeIn max-w-3xl mx-auto space-y-6">
          {/* Header Status & Countdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">لقد بدأ وقت الامتحان الرسمي</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-500 font-mono flex items-center gap-1.5 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 px-3 py-1.5 rounded-full border border-rose-100 dark:border-rose-900/30">
                <Timer className="w-4 h-4 shrink-0 animate-pulse" />
                المتبقي: {formatTime(timeLeft)}
              </span>
              <span className="text-xs font-bold text-slate-400">
                السؤال {currentIdx + 1} من {activeQuestions.length}
              </span>
            </div>
          </div>

          {/* Test Questions Loop */}
          {!submitted && (
            <div className="p-6 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {activeQuestions[currentIdx].text}
              </h3>

              {/* Answers */}
              <div className="grid grid-cols-1 gap-2.5">
                {activeQuestions[currentIdx].type === "multiple-choice" ? (
                  activeQuestions[currentIdx].options?.map((opt, idx) => {
                    const isSelected = answers[activeQuestions[currentIdx].id] === String(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(activeQuestions[currentIdx].id, String(idx))}
                        className={`text-right p-4 rounded-xl border text-xs transition-all focus:outline-none flex justify-between items-center cursor-pointer ${
                          isSelected 
                            ? "border-blue-600 bg-blue-50/20 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 font-bold"
                            : "border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-xs"
                        }`}
                      >
                        <span>{opt}</span>
                      </button>
                    );
                  })
                ) : (
                  ["true", "false"].map((val) => {
                    const isSelected = answers[activeQuestions[currentIdx].id] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => handleSelectOption(activeQuestions[currentIdx].id, val)}
                        className={`text-right p-4 rounded-xl border text-xs transition-all focus:outline-none flex justify-between items-center cursor-pointer ${
                          isSelected 
                            ? "border-blue-600 bg-blue-50/20 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 font-bold"
                            : "border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-xs"
                        }`}
                      >
                        <span>{val === "true" ? "صحيح" : "خطأ"}</span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Navigation controls during exam */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <button
                  onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-850 hover:bg-slate-350 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300"
                >
                  السابق
                </button>

                {currentIdx + 1 < activeQuestions.length ? (
                  <button
                    onClick={() => setCurrentIdx((p) => p + 1)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 cursor-pointer text-white text-xs font-bold rounded-lg"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteExam}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 cursor-pointer text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/10"
                  >
                    إنهاء الامتحان وتسليم الإجابات
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Exam Results Dashboard & Explanations */}
          {submitted && (
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 p-6 md:p-8 text-center max-w-xl mx-auto space-y-4 rounded-3xl">
                {examPassed ? (
                  <Award className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                ) : (
                  <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
                )}

                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  {examPassed ? "تهانينا الحارة يا مميز، لقد نجحت في الامتحان!" : "للأسف لم تتخطَّ درجة النجاح المطلوبة"}
                </h3>

                <p className="text-xs text-gray-500 dark:text-slate-400 max-w-md mx-auto">
                  {examPassed 
                    ? "لقد أثبتّ جدارتك وحصلت على معدل متميز يؤهلك لاستلام شهادة منصة المعلم التعليمي للأحياء الثانوية بنجاح." 
                    : "لكل جواد كبوة يا بني؛ معدل النجاح المعتمد هو 70%. نوصيك بمراجعة فصول المنهج والشروح المصورة وإعادة الاختبار لتجاوزه بتفوق!"}
                </p>

                <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-4 rounded-2xl max-w-sm mx-auto">
                  <div>
                    <span className="text-xs text-slate-400 block font-sans">معدل علامتك</span>
                    <span className={`text-xl font-bold ${examPassed ? "text-emerald-600" : "text-rose-600"}`}>
                      {examScore.toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-sans">صحيح / الإجمالي</span>
                    <span className="text-xl font-bold text-slate-800 dark:text-white font-sans">
                      {Object.values(answers).filter((a, idx) => a === activeQuestions[idx]?.answer).length} / {activeQuestions.length}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <button 
                    onClick={() => setTestMode("choose")}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    العودة للامتحانات
                  </button>
                  {!examPassed && (
                    <button 
                      onClick={handleStartExam}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                    >
                      إعادة الامتحان مجدداً
                    </button>
                  )}
                </div>
              </div>

              {/* Comprehensive Certificate Generation (Only if Passed > 70%) */}
              {examPassed && (
                <div className="relative border-4 border-double border-amber-500 bg-amber-50/10 p-6 md:p-10 rounded-3xl text-center max-w-3xl mx-auto space-y-4 shadow-xl select-none" id="printable-certificate">
                  {/* Decorative background vectors */}
                  <span className="absolute left-4 top-4 text-3xl opacity-20">★</span>
                  <span className="absolute right-4 top-4 text-3xl opacity-20">★</span>
                  <span className="absolute left-4 bottom-4 text-3xl opacity-20">★</span>
                  <span className="absolute right-4 bottom-4 text-3xl opacity-20">★</span>

                  <h3 className="font-serif text-amber-600 text-2xl font-black max-w-xl mx-auto border-b-2 border-amber-400/30 pb-4">
                    شهادة تميز في مادة الأحياء الثانوية
                  </h3>

                  <p className="text-xs text-gray-500 pt-2 font-mono">
                    تمنح منصة **المعـلم التعليمي للأحيـاء** هذه الشهادة الفخرية إلى البطل المتميز
                  </p>

                  <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-200 underline decoration-amber-500 decoration-wavy py-2 font-sans">
                    طالب متميز في علم الأحياء الخلوية
                  </h4>

                  <p className="text-sm text-slate-600 dark:text-slate-350 max-w-md mx-auto leading-relaxed">
                    تقديراً لاجتيازه الاختبار الشامل النهائي للوزارة وتفوقه بمعدل استثنائي مقداره ({examScore.toFixed(0)}%) حاصداً المراتب العليا في المعارف الخلوية، الوراثية، والبيئية.
                  </p>

                  <div className="flex justify-between items-end pt-8 max-w-md mx-auto text-xs text-slate-400">
                    <div>
                      <span className="block border-t border-slate-300 pt-1">المعلم سمير (معلم الأحياء)</span>
                      <span className="text-[10px] text-gray-400 italic">منصة المعلم التعليمي</span>
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      <span>تاريخ الإصدار: 2026-06-12</span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg cursor-pointer shadow-sm transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    طباعة / حفظ الشهادة PDF
                  </button>
                </div>
              )}

              {/* Explanations database of all exam questions */}
              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
                  📝 تقرير ومراجعة إجاباتك بالتفصيل:
                </h4>
                <div className="space-y-4">
                  {activeQuestions.map((q, idx) => {
                    const ans = answers[q.id];
                    const isCorrect = ans === q.answer;
                    return (
                      <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                            {idx + 1}. {q.text}
                          </h5>
                          {isCorrect ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 shrink-0">
                              <CheckCircle className="w-3.5 h-3.5" /> صحيح
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 font-bold text-xs flex items-center gap-1 shrink-0">
                              <XCircle className="w-3.5 h-3.5" /> خاطئ
                            </span>
                          )}
                        </div>

                        <div className="text-xs space-y-1">
                          <p className="text-slate-500 dark:text-slate-400">
                             إجابتك: <span className="font-bold text-slate-800 dark:text-slate-200">
                              {q.type === "multiple-choice" 
                                ? (ans !== undefined ? q.options?.[parseInt(ans)] : "لم تجب")
                                : (ans !== undefined ? (ans === "true" ? "صحيح" : "خطأ") : "لم تجب")}
                            </span>
                          </p>
                          <p className="text-slate-500 dark:text-slate-400">
                             الإجابة النموذجية: <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {q.type === "multiple-choice" 
                                ? q.options?.[parseInt(q.answer)] 
                                : (q.answer === "true" ? "صحيح" : "خطأ")}
                            </span>
                          </p>
                          <p className="text-slate-600 dark:text-slate-400 italic bg-slate-50/80 dark:bg-slate-950/50 p-2.5 rounded-xl mt-2 border border-slate-100 dark:border-slate-850">
                            **التوضيح العلمي**: {q.explanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
