import React, { useState } from 'react';
import {
  Sparkles,
  Dices,
  Send,
  Heart,
  Volume2,
  VolumeX,
  Copy,
  Check,
  MessageSquare,
  ShieldAlert,
  Share2,
  BookmarkCheck,
  RotateCcw,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { CounselingCategory, CounselResult, WorryPost } from '../types/counseling';
import { CAMPUS_NICKNAMES } from '../data/seedWorries';

interface CounselingTabProps {
  onAddWorryToSquare: (worry: WorryPost) => void;
  onOpenGoogleChatModal: (messageText: string) => void;
}

const CATEGORIES: CounselingCategory[] = [
  '학업/시험',
  '진로/취업',
  '인간관계/친구',
  '연애/이별',
  '번아웃/무기력',
  '자취/생활',
];

const EMOTION_TAGS = [
  '막막하고 불안함',
  '자책감과 자괴감',
  '지치고 무기력함',
  '나만 뒤처진 기분',
  '외롭고 쓸쓸함',
  '억울하고 답답함',
  '포기하고 싶은 마음',
  '미래가 두려움',
];

const INTENSITY_LABELS: Record<number, string> = {
  1: '살짝 답답하고 털어놓고 싶어요',
  2: '마음이 무겁고 신경 쓰여요',
  3: '일상생활과 공부에 지장이 와요',
  4: '너무 버겁고 눈물이 날 것 같아요',
  5: '숨이 턱 막히고 한계에 도달했어요',
};

export const CounselingTab: React.FC<CounselingTabProps> = ({
  onAddWorryToSquare,
  onOpenGoogleChatModal,
}) => {
  const [nickname, setNickname] = useState(() => {
    return CAMPUS_NICKNAMES[Math.floor(Math.random() * CAMPUS_NICKNAMES.length)];
  });
  const [category, setCategory] = useState<CounselingCategory>('학업/시험');
  const [emotion, setEmotion] = useState('막막하고 불안함');
  const [intensity, setIntensity] = useState<number>(3);
  const [story, setStory] = useState('');
  const [shareToSquare, setShareToSquare] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [counselResult, setCounselResult] = useState<CounselResult | null>(null);
  const [completedActions, setCompletedActions] = useState<number[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleRollDice = () => {
    const random = CAMPUS_NICKNAMES[Math.floor(Math.random() * CAMPUS_NICKNAMES.length)];
    setNickname(random);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story.trim()) return;

    setIsLoading(true);
    setCounselResult(null);

    try {
      const response = await fetch('/api/counsel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          category,
          emotion,
          intensity,
          story,
        }),
      });

      if (!response.ok) {
        throw new Error('상담 생성에 실패했습니다.');
      }

      const result: CounselResult = await response.json();
      setCounselResult(result);

      if (shareToSquare) {
        const newPost: WorryPost = {
          id: `worry-${Date.now()}`,
          category,
          nickname,
          avatarColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          emotion,
          content: story,
          intensity,
          createdAt: '방금 전',
          likes: { hug: 1, warmth: 1, youCanDoIt: 1 },
          comments: [],
          aiResponse: result,
          isPrivate: false,
        };
        onAddWorryToSquare(newPost);
      }
    } catch (err: any) {
      console.error(err);
      // Friendly fallback
      setCounselResult({
        empathySummary: '홀로 감당하기에 벅찬 무게였을 텐데, 용기 내어 털어놓아 주셔서 고마워요.',
        deepComfort:
          '모두가 각자의 속도로 걸어가는 대학 생활에서, 때로는 나만 멈춰 서 있는 것 같아 조급하고 외로울 수 있습니다. 하지만 지금 느끼는 고민과 방황은 당신이 성장을 갈망하고 있기 때문이에요. 당신의 지금까지의 땀방울은 절대 헛되지 않습니다.',
        psychologicalReframing:
          '결과로 나를 판단하지 말고, 오늘 하루도 성실하게 버텨낸 나 자신에게 먼저 따뜻한 온기를 선물해주세요.',
        microActions: [
          { title: '좋아하는 음악 들으며 10분 산책', description: '바깥 공기를 마시며 굳은 몸을 부드럽게 풀어주세요.' },
          { title: '따뜻한 차 한 잔으로 몸 데우기', description: '심리적 온기를 몸의 온도로 채워보세요.' },
          { title: '오늘 가장 잘한 작은 일 칭찬', description: '작은 것 하나라도 나에게 "수고했어"라고 말해주세요.' },
        ],
        pocketCheer: '어둠이 깊을수록 별은 더욱 빛납니다. 당신의 계절은 곧 시작됩니다.',
        recommendedQuote: '넘어지는 것은 부끄러운 일이 아니다. 일어서지 않는 것이 부끄러운 일이다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyQuote = () => {
    if (!counselResult) return;
    const textToCopy = `[토닥토닥 대학생 응원 처방전]\n"${counselResult.pocketCheer}"\n- 토닥이 드림`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggleAction = (index: number) => {
    if (completedActions.includes(index)) {
      setCompletedActions(completedActions.filter((i) => i !== index));
    } else {
      setCompletedActions([...completedActions, index]);
    }
  };

  const handleSpeakComfort = () => {
    if (!counselResult || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `${counselResult.empathySummary}. ${counselResult.deepComfort}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9; // Gently slower
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleResetForm = () => {
    setCounselResult(null);
    setStory('');
    setCompletedActions([]);
    if (isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 sm:py-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50/40 rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 border border-emerald-200 rounded-full text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI 맞춤 청년 심리 상담사 토닥이</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
            대학생 여러분, 오늘 어떤 마음의 짐을 안고 있나요?
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed max-w-xl">
            학점, 시험, 취업 불합격, 조별과제 갈등, 인간관계, 자취의 외로움까지... 아무에게도 말하지 못한 속마음을 익명으로 털어놓아 보세요. 훈계 없는 온전한 공감과 맞춤 처방을 드립니다.
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-8xl opacity-10 pointer-events-none select-none">
          🧸
        </div>
      </div>

      {!counselResult ? (
        /* Counseling Submission Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          {/* Nickname & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nickname */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                익명 닉네임 (100% 비밀 보장)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={20}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={handleRollDice}
                  title="랜덤 대학생 닉네임 생성"
                  className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors flex-shrink-0 cursor-pointer"
                >
                  <Dices className="w-5 h-5 text-emerald-700" />
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                고민 분야
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CounselingCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Emotion Tags */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-2">
              지금 가장 지배적인 감정은 무엇인가요?
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTION_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setEmotion(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    emotion === tag
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-600">
                지금 마음의 무게 (1 ~ 5단계)
              </label>
              <span className="text-xs font-bold text-emerald-800">
                {intensity}단계 : {INTENSITY_LABELS[intensity]}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>1 (가벼운 한숨)</span>
              <span>3 (버거운 일상)</span>
              <span>5 (극심한 번아웃/한계)</span>
            </div>
          </div>

          {/* Story Textarea */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-2">
              마음속 이야기 (필터링이나 검열 없이 솔직하게 적어주세요)
            </label>
            <textarea
              rows={5}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="예: 이번 학기 21학점을 들으며 인턴 준비 중인데, 서류가 연달아 탈락하고 중간고사도 망친 것 같아요. 동기들은 다 멋지게 자리 잡아가는데 저만 홀로 멈춰 서 있는 것 같아 매일 밤 잠이 안 오고 눈물만 납니다..."
              className="w-full p-4 rounded-2xl border border-stone-200 bg-stone-50/50 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all leading-relaxed placeholder:text-stone-400"
              required
            />
          </div>

          {/* Share to Campus Square toggle */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                캠퍼스 공감 광장에도 익명으로 나누기
              </span>
              <p className="text-[11px] text-stone-500">
                다른 대학생 친구들과 익명으로 고민을 공유하고 서로 토닥임과 응원 댓글을 받을 수 있어요.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={shareToSquare}
                onChange={(e) => setShareToSquare(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !story.trim()}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-base rounded-2xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>토닥이가 깊은 공감의 글을 작성하고 있어요...</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-white text-white" />
                <span>토닥이에게 위로와 맞춤 처방 받기</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* AI Counseling Result View */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Action top bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {nickname} 님을 위한 토닥이의 맞춤 처방전
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakComfort}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSpeaking
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>낭독 중지</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>따뜻한 음성으로 듣기</span>
                  </>
                )}
              </button>
              <button
                onClick={handleResetForm}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-600 hover:bg-stone-50 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>새로운 고민 적기</span>
              </button>
            </div>
          </div>

          {/* Empathy Summary */}
          <div className="p-6 bg-gradient-to-r from-amber-50 via-rose-50/60 to-emerald-50 rounded-3xl border border-amber-200/80 shadow-xs">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
              🕊️ 마음 어루만짐
            </p>
            <p className="text-lg sm:text-xl font-bold text-stone-800 leading-snug">
              "{counselResult.empathySummary}"
            </p>
          </div>

          {/* Deep Comfort */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-stone-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-100" />
              <span>토닥이의 진심 어린 편지</span>
            </h3>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
              {counselResult.deepComfort}
            </p>

            {/* Psychological Reframing */}
            <div className="pt-4 border-t border-stone-100">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200/70 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-emerald-700" />
                  스스로를 탓하지 마세요 (마음 시각 전환)
                </span>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                  {counselResult.psychologicalReframing}
                </p>
              </div>
            </div>
          </div>

          {/* Micro Actions (1-min healing missions) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-stone-800 flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-amber-600" />
                  <span>오늘을 버텨낼 1분 마음 처방 (작은 실천)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  거창한 목표 대신, 오늘 밤 나를 위해 실천할 작은 행동들을 체크해보세요.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {completedActions.length}/{counselResult.microActions.length} 완료
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {counselResult.microActions.map((action, idx) => {
                const isDone = completedActions.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleAction(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-stone-50/60 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        처방 #{idx + 1}
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-stone-300" />
                      )}
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm mb-1">{action.title}</h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pocket Cheer Card (with Google Chat share) */}
          <div className="bg-gradient-to-tr from-stone-900 via-stone-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 bg-white/10 rounded-full border border-white/20 text-emerald-300">
                  나만을 위한 응원 부적
                </span>
                <span className="text-[11px] text-stone-400">토닥토닥 캠퍼스 쉼터</span>
              </div>

              <blockquote className="text-xl sm:text-2xl font-extrabold leading-relaxed tracking-tight text-white/95">
                "{counselResult.pocketCheer}"
              </blockquote>

              <p className="text-xs text-stone-400 italic">
                {counselResult.recommendedQuote}
              </p>

              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyQuote}
                  className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>위로 문구 복사</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onOpenGoogleChatModal(
                      `💌 [토닥토닥 대학생 마음 쉼터 응원 메시지]\n\n"${counselResult.pocketCheer}"\n\n"${counselResult.recommendedQuote}"\n\n오늘도 수고 많았어요. 꺾이지 않고 피어날 당신을 응원합니다! 🌿`
                    )
                  }
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Google Chat 스페이스로 응원 보내기</span>
                </button>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
};
