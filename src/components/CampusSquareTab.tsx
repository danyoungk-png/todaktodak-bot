import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Sparkles,
  Share2,
  ChevronDown,
  ChevronUp,
  Send,
  MessageSquare,
  ThumbsUp,
  SmilePlus,
} from 'lucide-react';
import { WorryPost, CounselingCategory } from '../types/counseling';

interface CampusSquareTabProps {
  worries: WorryPost[];
  onReact: (postId: string, reactionType: 'hug' | 'warmth' | 'youCanDoIt') => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenGoogleChatModal: (messageText: string) => void;
}

const ALL_CATEGORIES = [
  '전체',
  '학업/시험',
  '진로/취업',
  '인간관계/친구',
  '연애/이별',
  '번아웃/무기력',
  '자취/생활',
];

export const CampusSquareTab: React.FC<CampusSquareTabProps> = ({
  worries,
  onReact,
  onAddComment,
  onOpenGoogleChatModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [expandedAi, setExpandedAi] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const toggleComments = (id: string) => {
    setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAi = (id: string) => {
    setExpandedAi((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  const filteredWorries = worries
    .filter((w) => selectedCategory === '전체' || w.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'popular') {
        const totalA = a.likes.hug + a.likes.warmth + a.likes.youCanDoIt;
        const totalB = b.likes.hug + b.likes.warmth + b.likes.youCanDoIt;
        return totalB - totalA;
      }
      return 0; // Default order is latest
    });

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 sm:py-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-100" />
              <span>캠퍼스 익명 공감 광장</span>
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              서버 동기화 저장
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            "나만 힘든 게 아니었구나." 지친 대학생 동기들의 고민을 읽고 따뜻한 토닥임을 건네주세요.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              sortBy === 'latest' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              sortBy === 'popular' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
            }`}
          >
            공감 많은 순
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Worry Posts Feed */}
      <div className="space-y-4">
        {filteredWorries.map((worry) => {
          const isCommentsOpen = !!expandedComments[worry.id];
          const isAiOpen = !!expandedAi[worry.id];
          const totalReactions = worry.likes.hug + worry.likes.warmth + worry.likes.youCanDoIt;

          return (
            <article
              key={worry.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 hover:border-stone-300 transition-colors"
            >
              {/* Author & Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${worry.avatarColor}`}
                  >
                    {worry.nickname[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-800">{worry.nickname}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium">
                        {worry.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400">{worry.createdAt}</span>
                  </div>
                </div>

                {/* Intensity Indicator */}
                <div className="flex items-center gap-1 text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-150">
                  <span>마음 무게 {worry.intensity}/5</span>
                </div>
              </div>

              {/* Story Content */}
              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                {worry.content}
              </p>

              {/* AI Counselor Response Toggle (if available) */}
              {worry.aiResponse && (
                <div className="rounded-2xl border border-emerald-150 bg-emerald-50/50 overflow-hidden">
                  <button
                    onClick={() => toggleAi(worry.id)}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-bold text-emerald-800 hover:bg-emerald-100/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>토닥이의 심리 처방 & 따뜻한 위로 편지</span>
                    </div>
                    {isAiOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isAiOpen && (
                    <div className="p-4 pt-1 space-y-2.5 border-t border-emerald-100 text-xs text-stone-700">
                      <p className="font-semibold text-emerald-900 bg-white/70 p-2.5 rounded-xl border border-emerald-100">
                        "{worry.aiResponse.empathySummary}"
                      </p>
                      <p className="leading-relaxed whitespace-pre-wrap">
                        {worry.aiResponse.deepComfort}
                      </p>
                      <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-emerald-800 font-medium">
                        💌 맞춤 응원: "{worry.aiResponse.pocketCheer}"
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reactions & Actions Row */}
              <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                {/* 3 Emotional Reaction Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onReact(worry.id, 'hug')}
                    title="토닥토닥 안아주기"
                    className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-rose-50 text-stone-700 hover:text-rose-600 border border-stone-200 hover:border-rose-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>🫂 토닥토닥</span>
                    <span className="font-bold text-rose-600">{worry.likes.hug}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReact(worry.id, 'warmth')}
                    title="따뜻한 온기 건네기"
                    className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-700 border border-stone-200 hover:border-amber-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>💛 온기</span>
                    <span className="font-bold text-amber-600">{worry.likes.warmth}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReact(worry.id, 'youCanDoIt')}
                    title="넌 할 수 있어 격려하기"
                    className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 hover:border-emerald-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>💪 힘내자</span>
                    <span className="font-bold text-emerald-600">{worry.likes.youCanDoIt}</span>
                  </button>
                </div>

                {/* Right: Comments Toggle & Google Chat Share */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleComments(worry.id)}
                    className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>댓글 {worry.comments.length}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenGoogleChatModal(
                        `🤝 [캠퍼스 익명 사연 공유]\n\n"${worry.content.slice(0, 140)}${worry.content.length > 140 ? '...' : ''}"\n\n토닥토닥 응원 ${totalReactions}개가 모였습니다. 우리 캠퍼스 동기들을 함께 응원해주세요! 🌿`
                      )
                    }
                    title="이 사연과 응원을 Google Chat으로 공유하기"
                    className="p-1.5 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {isCommentsOpen && (
                <div className="pt-3 border-t border-stone-100 space-y-3">
                  {worry.comments.length > 0 && (
                    <div className="space-y-2">
                      {worry.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-3 bg-stone-50 rounded-xl text-xs space-y-1 border border-stone-150"
                        >
                          <div className="flex items-center justify-between text-stone-500">
                            <span className="font-bold text-stone-700">🌱 {comment.nickname}</span>
                            <span className="text-[10px]">{comment.createdAt}</span>
                          </div>
                          <p className="text-stone-700 leading-relaxed">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add supportive comment form */}
                  <form onSubmit={(e) => handleCommentSubmit(worry.id, e)} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="익명으로 따뜻한 응원의 한마디를 남겨주세요..."
                      value={commentInputs[worry.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [worry.id]: e.target.value }))
                      }
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentInputs[worry.id]?.trim()}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>보내기</span>
                    </button>
                  </form>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
