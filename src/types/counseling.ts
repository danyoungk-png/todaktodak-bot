export type CounselingCategory =
  | '학업/시험'
  | '진로/취업'
  | '인간관계/친구'
  | '연애/이별'
  | '번아웃/무기력'
  | '자취/생활';

export interface MicroAction {
  title: string;
  description: string;
}

export interface CounselResult {
  empathySummary: string;
  deepComfort: string;
  psychologicalReframing: string;
  microActions: MicroAction[];
  pocketCheer: string;
  recommendedQuote: string;
}

export interface WorryComment {
  id: string;
  nickname: string;
  text: string;
  createdAt: string;
}

export interface WorryPost {
  id: string;
  category: CounselingCategory;
  nickname: string;
  avatarColor: string;
  emotion: string;
  content: string;
  intensity: number; // 1 to 5
  createdAt: string;
  likes: {
    hug: number; // 토닥토닥
    warmth: number; // 따뜻한 온기
    youCanDoIt: number; // 넌 할 수 있어
  };
  comments: WorryComment[];
  aiResponse?: CounselResult;
  isPrivate?: boolean;
}

export interface CheerCard {
  id: string;
  title: string;
  message: string;
  tag: string;
  quote: string;
  theme: string;
}
