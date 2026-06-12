export interface Chapter {
  id: number;
  title: string;
  englishTitle: string;
  icon: string;
  description: string;
  color: string;
  bgGradient: string;
  sections: Section[];
}

export interface Section {
  title: string;
  content: string;
  imageAlt?: string;
  imageUrl?: string;
  interactiveElement?: string; // 'cellMap' | 'punnett' | 'energyPyramid' | 'classification' | 'support' | 'microscope'
}

export interface Question {
  id: number;
  chapterId: number;
  text: string;
  type: 'multiple-choice' | 'boolean' | 'fill-gap';
  options?: string[]; // for multiple-choice
  answer: string; // index of option for multiple choice (e.g. '0'), 'true'/'false' for boolean, or word for fill-gap
  explanation: string;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
}

export interface UserStats {
  xp: number;
  quizzesTaken: number;
  correctAnswers: number;
  streak: number;
  unlockedBadges: string[];
}
