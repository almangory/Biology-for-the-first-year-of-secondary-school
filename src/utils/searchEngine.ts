import { chaptersData, questionsData } from "../data/curriculumData";
import { Chapter, Section, Question } from "../types";

// Text normalization helper for Arabic NLP matching
function normalizeArabic(text: string): string {
  if (!text) return "";
  let norm = text.toLowerCase();
  
  // Normalizing forms of Alef, Heh, Yeh
  norm = norm.replace(/[أإآ]/g, "ا");
  norm = norm.replace(/ة/g, "ه");
  norm = norm.replace(/ى/g, "ي");
  
  // Remove common Arabic diacritics (harakat)
  norm = norm.replace(/[\u064B-\u0652]/g, "");
  
  // Replace punctuation and special chars with space
  norm = norm.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'?<>،؛؟]/g, " ");
  
  return norm.trim();
}

// Tokenize the input, filtering out stop-words and stripping common prefixes
export function getSearchTerms(query: string): string[] {
  const normQuery = normalizeArabic(query);
  const words = normQuery.split(/\s+/);
  
  const stopWords = new Set([
    "ما", "ماذا", "هو", "هي", "بين", "الفرق", "كيف", "لماذا", "من", "في", "على", "إلى", 
    "البحث", "عن", "اشرح", "شرح", "وضح", "توضيح", "ماالفرق", "معنى", "تعريف", "أين", 
    "هل", "يكون", "كان", "تمتلك", "تمثل", "توجد", "يحدث", "فيها", "التي", "الذي", 
    "الذين", "هذا", "هذه", "ذلك", "يا", "بني", "معلم", "معلمي", "الاستفسار", "المعلومة",
    "سؤال", "اسئلة", "مادة", "ادوات", "محتويات", "الموقع", "الموقع"
  ]);

  const terms: string[] = [];
  for (const w of words) {
    if (w.length < 2) continue; // Skip very short tokens
    if (stopWords.has(w)) continue;
    
    // Strip common prefixes: ال، بال، لل، وال، فال
    let stripped = w;
    if (stripped.startsWith("وال")) stripped = stripped.substring(3);
    else if (stripped.startsWith("بال")) stripped = stripped.substring(3);
    else if (stripped.startsWith("فال")) stripped = stripped.substring(3);
    else if (stripped.startsWith("لل")) stripped = stripped.substring(2);
    else if (stripped.startsWith("ال")) stripped = stripped.substring(2);
    else if (stripped.startsWith("ب") && stripped.length > 3) stripped = stripped.substring(1);
    else if (stripped.startsWith("و") && stripped.length > 3) stripped = stripped.substring(1);
    
    if (stripped.length >= 2 && !stopWords.has(stripped)) {
      terms.push(stripped);
    } else {
      terms.push(w);
    }
  }
  return terms;
}

interface MatchResult {
  role: "assistant";
  content: string;
}

export function searchCurriculum(query: string): MatchResult {
  const terms = getSearchTerms(query);
  
  if (terms.length === 0) {
    return {
      role: "assistant",
      content: getGeneralIndexResponse()
    };
  }

  // Scoring records
  const sectionScores: Array<{
    chapter: Chapter;
    section: Section;
    score: number;
  }> = [];

  const questionScores: Array<{
    question: Question;
    score: number;
  }> = [];

  // 1. Score curriculum sections
  for (const ch of chaptersData) {
    for (const sec of ch.sections) {
      let score = 0;
      const normTitle = normalizeArabic(sec.title);
      const normContent = normalizeArabic(sec.content);

      for (const term of terms) {
        // Title match receives high weighting
        if (normTitle.includes(term)) {
          score += 30;
        }
        
        // Exact content match occurrences
        const termRegex = new RegExp(term, "gi");
        const titleOccurrences = (normTitle.match(termRegex) || []).length;
        const contentOccurrences = (normContent.match(termRegex) || []).length;

        score += titleOccurrences * 15;
        score += contentOccurrences * 4;
      }

      if (score > 0) {
        sectionScores.push({ chapter: ch, section: sec, score });
      }
    }
  }

  // 2. Score questions
  for (const q of questionsData) {
    let score = 0;
    const normText = normalizeArabic(q.text);
    const normExplanation = normalizeArabic(q.explanation);

    for (const term of terms) {
      if (normText.includes(term)) {
        score += 20;
      }
      const termRegex = new RegExp(term, "gi");
      const textOccurrences = (normText.match(termRegex) || []).length;
      const explanationOccurrences = (normExplanation.match(termRegex) || []).length;

      score += textOccurrences * 10;
      score += explanationOccurrences * 5;
    }

    if (score > 0) {
      questionScores.push({ question: q, score });
    }
  }

  // Sort scores descending
  sectionScores.sort((a, b) => b.score - a.score);
  questionScores.sort((a, b) => b.score - a.score);

  const topSection = sectionScores.length > 0 ? sectionScores[0] : null;
  const topQuestions = questionScores.slice(0, 2);

  // If we have a very weak match (score < 5), fallback gracefully
  if ((!topSection || topSection.score < 5) && topQuestions.length === 0) {
    return {
      role: "assistant",
      content: getGracefulNoMatchResponse(query)
    };
  }

  // Build the responder text
  let finalResponse = `أهلاً بك يا بطل الأحياء المتميز! 🧬 لقد قمت بالبحث الفوري والدقيق في أوراق ومحتويات المنهج المعتمد بالموقع، وإليك الشرح العلمي الأوفى لقضيتك المعرفية:\n\n`;

  if (topSection) {
    finalResponse += `### 📖 الباب: ${topSection.chapter.title}  \n`;
    finalResponse += `**عنوان الدرس**: ${topSection.section.title}  \n\n`;
    
    // Replace double linebreaks for neat markdown presentation
    const formattedContent = topSection.section.content
      .replace(/\n\n/g, "\n\n")
      .trim();
    
    finalResponse += `${formattedContent}\n\n`;
  }

  // Include supplementary related question if relevant
  if (topQuestions.length > 0) {
    finalResponse += `---\n🧠 **أسئلة منهجية وتوضيحات علمية داعمة لتثبيت فهمك:**\n\n`;
    topQuestions.forEach((match, idx) => {
      const q = match.question;
      const ch = chaptersData.find(c => c.id === q.chapterId);
      finalResponse += `**س${idx + 1}: ${q.text}**  \n`;
      
      let answerText = "";
      if (q.type === "boolean") {
        answerText = q.answer === "true" ? "صحيح" : "خطأ";
      } else if (q.type === "multiple-choice" && q.options) {
        answerText = q.options[parseInt(q.answer)];
      } else {
        answerText = q.answer;
      }

      finalResponse += `• **الجواب المعتمد**: ${answerText}  \n`;
      finalResponse += `• **الشرح العلمي بالكتاب**: ${q.explanation}  \n\n`;
    });
  }

  finalResponse += `أتمنى لك فهماً عميقاً ودرجات عليا يا بني! إذا كان لديك أي سؤال آخر حول الخلايا أو الوراثيات أو هرم الطاقة والتناقص البيئي، تواصل معي في أي وقت!`;

  return {
    role: "assistant",
    content: finalResponse
  };
}

function getGeneralIndexResponse(): string {
  return `مرحباً بك يا بني! 💡 أنا مساعدك الأكاديمي، المعلم سمير. يبدو أنك قمت بإدخال استفسار عام.\n\nلمساعدتك بأفضل طريقة ممكنة دون الحاجة لذكاء خارجي، يمكنك كتابة كلمة دلالية للبحث عنها في الموضوعات الجوهرية التالية:\n\n` +
    `١. **الخلية**: بدائية، حقيقية، الميتوكوندريا، غشاء بلازمي، جهاز جولجي، انقسام فتيلي أو اختزالي العبور الجيني.\n` +
    `٢. **الوراثة**: قوانين مندل، السيادة، النسبة 3:1، مربع بانيت، الأليلات، الكروموسومات.\n` +
    `٣. **الدعامة**: الدعامة الهيدروستاتيكية، الدعامة العبورية الاسموزية، النسيج الكولنشيمي، النسيج الاسكلرنشيمي، اللجنين والسيليولوز.\n` +
    `٤. **علم البيئة وهرم الطاقة**: هرم الطاقة، التناقص البيئي، السلسلة الغذائية، المنتجون، قاعدة الـ 10%، التضخم الحيوي، DDT.\n` +
    `٥. **التصنيف**: التسمية الثنائية، كارل لينيوس، الأركي، الفيروسات، الكبسولة البروتينية.\n\n` +
    `اكتب سؤالك بوضوح (مثال: "ما هو التضخم الحيوي؟" أو "الفرق بين النسيج الكولنشيمي والاسكلرنشيمي") وسأدلك على الشرح فوراً!`;
}

function getGracefulNoMatchResponse(query: string): string {
  return `أهلاً بك يا بني العزيز! لقد قمت بفحص كامل أوراق المنهج والامتحانات بحثاً عن لغظ يعادل "${query}"، لكنني لم أجد تفسيراً لغوياً متطابقاً تماماً مع هذا المصطلح بدقة.\n\n` +
    `ولكن لا تقلق! كبديل فوري وبدون الاعتماد على الذكاء الخارجي المزعج، يمكنك أن تسألني عن أي من المفاهيم المنهجية التي يعج بها كوكبنا التعليمي:\n\n` +
    `• **بدراسات الخلايا**: اسألني عن "الميتوكوندريا"، "الخلية حقيقية النواة"، "الطور الاستوائي"، "الانقسام الفتيلي المتساوي" أو "الاختزالي المنصف" و"العبور الجيني".\n` +
    `• **بدراسات الوراثة**: اسألني عن "قانون مندل"، "السيادة المتنحية"، "الأليلات"، "مربع بانيت".\n` +
    `• **بدراسات الدعامة**: اسألني عن "ضغط الامتلاء الخلوي"، "الاسموزية النباتية"، "الدعامة الهيدروستاتيكية" أو "الأنسجة الكولنشيمية والإسكلرنشيمية المغلظة باللجنين والسيليلوز".\n` +
    `• **بدراسات البيئة والطاقة**: اسألني عن "هرم الطاقة وحساب الفقد"، "التناقص البيئي"، "التضخم الحيوي للسموم والمبيد DDT".\n` +
    `• **بدراسات التصنيف**: اسألني عن "كارل لينيوس والتسمية العلمية الثنائية"، "الفيروسات وبنيتها"، "الأركي بكتيريا الينابيع الحرارية".\n\n` +
    `قم بإعادة صياغة استفسارك مستخدماً كلمات دلالية من الأعلى وسأجيبك فوراً بشرح معتمد بنسبة 100%!`;
}
