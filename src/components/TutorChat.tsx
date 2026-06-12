import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageCircle, AlertCircle, RefreshCw, Search, Cpu } from "lucide-react";
import { motion } from "motion/react";

interface Message {
  role: "user" | "assistant";
  content: string;
  isLocalSearch?: boolean;
}

const suggestedQuestions = [
  "ما الفرق بين الانقسام الفتيلي والاختزالي؟",
  "اشرح لي قانون مندل لسيادة الصفات بمثال",
  "ما هي الخصائص الستة التي تميز الكائن الحي؟",
  "لماذا تتناقص طاقة السلسلة الغذائية في هرم الطاقة؟",
  "ما هو دور الميتوكوندريا في توليد الطاقة بالخلية؟"
];

const loadingTexts = [
  "يقوم المعلم الذكي الآن بقراءة منشورات الكتاب المدرسي...",
  "يتم فحص ميكانيكية الكروموسومات لربط الإجابة...",
  "صياغة شرح تفاعلي مدعم بالأمثلة التعليمية...",
  "المعلم سمير يراجع الشفرة الوراثية لصياغة رد نموذجي..."
];

export default function TutorChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "أهلاً بك يا بني في عيادة الأحياء التفاعلية! 🧬 أنا معلمك الذكي لمادة الأحياء للمرحلة الثانوية. اسألني عن أي مفهوم طبيعي أو فقرة في خلايا الكائنات، وراثة مندل، الدعامة، أو النظم البيئية وسأشرحها لك ببساطة تامة!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLocalOnly, setIsLocalOnly] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Loading text cycler
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingTextIdx((prev) => (prev + 1) % loadingTexts.length);
      }, 3000);
    } else {
      setLoadingTextIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    setErrorMsg(null);
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text
        })
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setMessages((prev) => [
          ...prev, 
          { 
            role: "assistant", 
            content: data.reply,
            isLocalSearch: true
          }
        ]);
      } else {
        setErrorMsg(data.error || "عذراً يا بني، واجهتني مشكلة أثناء البحث في المنهج الدراسي.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والبدء مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "مرحباً بك مجدداً يا بطل الأحياء! اسألني وسنبسط العلوم معاً 🧬"
      }
    ]);
    setErrorMsg(null);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 lg:p-8 text-white shadow-2xl relative overflow-hidden" id="tutor-chat-section">
      {/* Background visual effects */}
      <span className="absolute -right-20 -top-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <span className="absolute -left-20 -bottom-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-blue-500/25 flex items-center justify-center text-2xl border border-blue-500/30">
            🤖
          </span>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-1.5">
              مساعد الأحياء المنهجي (المعلم سمير)
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </h2>
            <p className="text-blue-200/60 text-xs">بحث وربط ذكي فوري لجميع فضل وأبواب كتاب الأحياء المعتمد</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={handleClearChat}
            className="p-2 cursor-pointer bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-all text-xs flex items-center gap-1.5 border border-white/5"
            title="مسح المحادثة وبدء حوار جديد"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            البدء من جديد
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Suggested Questions Panel (LHS) */}
        <div className="lg:col-span-4 flex flex-col justify-start gap-3">
          <span className="text-xs text-white/50 font-bold block mb-1">💡 أسئلة منهجية مقترحة:</span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="p-3 text-right bg-white/5 hover:bg-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-white/5 rounded-2xl text-xs text-blue-100 leading-snug transition-all active:scale-98"
            >
              • {q}
            </button>
          ))}
        </div>

        {/* Chat Window Panel (RHS) */}
        <div className="lg:col-span-8 flex flex-col h-[460px] bg-slate-950/75 border border-white/10 rounded-2xl overflow-hidden shadow-inner">
          
          {/* Local Search Mode Info Bar */}
          <div className="p-3 border-b border-white/10 bg-slate-900/90 flex items-center justify-between gap-2 px-4">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-emerald-400 animate-pulse" />
              محرك البحث المنهجي الذكي: نشط وتلقائي بالكامل
            </span>
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 select-none">
              <Search className="w-3 h-3 text-emerald-400" />
              شرح معتمد ومباشر من غير مفتاح تشغيل
            </span>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div 
                  key={index}
                  className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    isAssistant 
                      ? "bg-slate-900 border border-slate-800 text-blue-50"
                      : "bg-blue-600 text-white shadow-md border border-blue-500/30"
                  }`}>
                    {/* Render message content with markdown-friendly styling */}
                    <div className="whitespace-pre-wrap text-justify text-xs md:text-sm">{msg.content}</div>
                    
                    {/* Local search badge indicator */}
                    {isAssistant && index > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        🔍 بحث منهجي فوري: تم مراجعة واستخلاص الجواب بنسبة 100% من فصول واسئلة المنهج المعتمد بالموقع.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-955/35 border border-red-500/20 text-red-200 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center gap-3 text-xs text-blue-200/60 p-2">
                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="italic animate-pulse">{loadingTexts[loadingTextIdx]}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-900/95 border-t border-white/10 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ابحث بكلمات أو اسأل مثل: تناقص بيئي، ميتوكوندريا، دعامة نباتية، مندل..."
              className="flex-1 bg-slate-950 text-white placeholder-white/30 text-xs md:text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 border border-white/5"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer rounded-xl text-white transition-all flex items-center justify-center shrink-0"
              title="إرسال السؤال"
            >
              <Send className="w-4 h-4 -rotate-90" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
