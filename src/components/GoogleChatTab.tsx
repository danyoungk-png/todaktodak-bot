import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  RefreshCw,
  CheckCircle2,
  Users,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { ChatSpace } from '../services/googleChat';

interface GoogleChatTabProps {
  user: User | null;
  accessToken: string | null;
  spaces: ChatSpace[];
  selectedSpace: ChatSpace | null;
  onSelectSpace: (space: ChatSpace) => void;
  onRefreshSpaces: () => void;
  isFetchingSpaces: boolean;
  onLogin: () => void;
  isLoggingIn: boolean;
  onOpenGoogleChatModal: (messageText: string) => void;
}

const CHEER_TEMPLATES = [
  {
    title: '스터디원 응원',
    text: '☕ [스터디 응원]\n오늘도 도서관과 카페에서 열공하느라 다들 진짜 고생 많았어요! 조급해하지 말고 우리 페이스대로 끝까지 완주해봐요. 파이팅!',
  },
  {
    title: '시험 기간 위로',
    text: '🌿 [시험 기간 토닥임]\n잠도 못 자고 밤샘 공부하느라 몸과 마음이 많이 지쳤을 텐데, 결과보다 더 값진 건 여러분이 쏟은 진심이에요. 든든하게 밥 꼭 챙겨먹어요!',
  },
  {
    title: '취준·스펙 격려',
    text: '🌟 [취준생 응원]\n수많은 불합격과 불안감 속에서도 꿋꿋하게 하루를 걸어가는 당신. 지금의 시련은 당신이 주인공으로 빛나기 위한 과정일 뿐이에요. 반드시 해낼 겁니다!',
  },
  {
    title: '조별과제 팀원 격려',
    text: '👏 [팀플 수고 메시지]\n프로젝트 준비하느라 다들 고생 많으셨습니다! 혼자였으면 막막했을 텐데 함께 머리 맞대어 주셔서 감사해요. 맛있는 거 먹고 푹 쉽시다!',
  },
];

export const GoogleChatTab: React.FC<GoogleChatTabProps> = ({
  user,
  accessToken,
  spaces,
  selectedSpace,
  onSelectSpace,
  onRefreshSpaces,
  isFetchingSpaces,
  onLogin,
  isLoggingIn,
  onOpenGoogleChatModal,
}) => {
  const [customMessage, setCustomMessage] = useState(CHEER_TEMPLATES[0].text);

  const handleApplyTemplate = (templateText: string) => {
    setCustomMessage(templateText);
  };

  const handleTriggerSend = () => {
    if (!customMessage.trim()) return;
    onOpenGoogleChatModal(customMessage);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 sm:py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-stone-50 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-sm relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 border border-emerald-200 rounded-full text-emerald-800 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Chat Workspace Integration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
            대학생 동기 및 스터디원들과 응원 나누기
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed max-w-xl">
            Google Chat의 스터디 스페이스나 팀플방, 동아리방으로 따뜻한 위로와 맞춤형 응원 메시지를 전달할 수 있습니다.
          </p>
        </div>
      </div>

      {!user || !accessToken ? (
        /* Sign-in prompt card */
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-stone-800">
              Google 계정으로 연동하고 Chat 스페이스 불러오기
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Google Chat 연동을 통해 참여 중인 대화방(스페이스) 목록을 확인하고, 터치 한 번으로 따뜻한 응원을 전송할 수 있습니다. 모든 메시지는 전송 전 사용자의 명시적 확인을 거칩니다.
            </p>
          </div>
          <div className="pt-2">
            <GoogleSignInButton
              onClick={onLogin}
              loading={isLoggingIn}
              text="Google 계정으로 연동 시작"
              className="py-3 px-6 text-sm"
            />
          </div>
        </div>
      ) : (
        /* Authenticated Workspace Chat Dashboard */
        <div className="space-y-6">
          {/* User Account Bar */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google 사용자'}
                  className="w-10 h-10 rounded-full border border-stone-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-stone-800">{user.displayName || 'Google 사용자'}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    Chat 연결됨
                  </span>
                </div>
                <span className="text-xs text-stone-500">{user.email}</span>
              </div>
            </div>

            <button
              onClick={onRefreshSpaces}
              disabled={isFetchingSpaces}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingSpaces ? 'animate-spin' : ''}`} />
              <span>스페이스 새로고침</span>
            </button>
          </div>

          {/* Spaces List Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-stone-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>내 Google Chat 스페이스 목록</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  메시지를 보낼 대상 대화방을 선택하세요.
                </p>
              </div>
              <span className="text-xs text-stone-500">
                {spaces.length}개 스페이스 감지됨
              </span>
            </div>

            {isFetchingSpaces ? (
              <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span>Google Chat 스페이스 목록을 불러오는 중...</span>
              </div>
            ) : spaces.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <p className="font-medium text-stone-700">참여 중인 Google Chat 스페이스가 없습니다.</p>
                <p className="text-[11px] text-stone-400">
                  Google Chat 웹 또는 앱에서 새 스페이스(대화방)를 만든 후 [스페이스 새로고침] 버튼을 눌러주세요.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {spaces.map((sp) => {
                  const isSelected = selectedSpace?.name === sp.name;
                  return (
                    <button
                      key={sp.name}
                      type="button"
                      onClick={() => onSelectSpace(sp)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 shadow-xs text-emerald-900'
                          : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <p className="font-bold text-xs sm:text-sm truncate">
                          {sp.displayName || '이름 없는 스페이스'}
                        </p>
                        <p className="text-[10px] text-stone-400 uppercase mt-0.5">
                          {sp.type || 'SPACE'}
                        </p>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-stone-300 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cheer Message Composer */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-stone-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>보낼 응원 메시지 작성</span>
            </h3>

            {/* Template Buttons */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-2">
                추천 대학생 응원 템플릿:
              </label>
              <div className="flex flex-wrap gap-2">
                {CHEER_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.title}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl.text)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                  >
                    {tmpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <textarea
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Google Chat 대화방에 보낼 응원과 위로의 메시지를 입력하세요..."
                className="w-full p-4 rounded-2xl border border-stone-200 bg-stone-50/50 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans leading-relaxed"
              />
            </div>

            {/* Mandatory confirmation notice before click */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
              <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <p>
                전송 버튼을 누르면 메시지 미리보기 및 대상 스페이스 확인 창이 열립니다. 최종 확인 후 안전하게 전송됩니다.
              </p>
            </div>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleTriggerSend}
              disabled={!customMessage.trim() || !selectedSpace}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>
                {selectedSpace
                  ? `[${selectedSpace.displayName || '선택한 스페이스'}] 로 전송하기`
                  : '스페이스를 먼저 선택해주세요'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
