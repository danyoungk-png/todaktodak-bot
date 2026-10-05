import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Wind,
  PhoneCall,
  Volume2,
  Heart,
  RotateCw,
  MessageSquare,
  Copy,
  Check,
  Coffee,
  HelpCircle,
} from 'lucide-react';
import { DAILY_CHEER_CAPSULES } from '../data/seedWorries';
import { CheerCard } from '../types/counseling';
import { AmbientSoundType, playAmbientSound } from '../utils/audio';

interface WellnessTabProps {
  onOpenGoogleChatModal: (messageText: string) => void;
}

export const WellnessTab: React.FC<WellnessTabProps> = ({ onOpenGoogleChatModal }) => {
  // Fortune / Cheer Capsule state
  const [currentCapsuleIndex, setCurrentCapsuleIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const currentCapsule: CheerCard = DAILY_CHEER_CAPSULES[currentCapsuleIndex];

  const handleDrawCapsule = () => {
    setIsRevealed(false);
    setTimeout(() => {
      const nextIndex = (currentCapsuleIndex + 1) % DAILY_CHEER_CAPSULES.length;
      setCurrentCapsuleIndex(nextIndex);
      setIsRevealed(true);
    }, 200);
  };

  useEffect(() => {
    setIsRevealed(true);
  }, []);

  const handleCopyQuote = () => {
    const text = `"${currentCapsule.message}"\n- ${currentCapsule.quote}\n(토닥토닥 대학생 마음 쉼터)`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 4-7-8 Breathing Guide state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!isBreathingActive) {
      setBreathPhase('inhale');
      setCountdown(4);
      return;
    }

    let currentPhase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    let timer = 4;
    setCountdown(4);

    const interval = setInterval(() => {
      timer -= 1;
      if (timer <= 0) {
        if (currentPhase === 'inhale') {
          currentPhase = 'hold';
          timer = 7;
        } else if (currentPhase === 'hold') {
          currentPhase = 'exhale';
          timer = 8;
        } else {
          currentPhase = 'inhale';
          timer = 4;
        }
        setBreathPhase(currentPhase);
      }
      setCountdown(timer);
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 sm:py-6">
      {/* 1. Daily Cheer Capsule (오늘의 마음 응원 캡슐) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>오늘의 마음 캡슐</span>
            </div>
            <h2 className="text-xl font-bold text-stone-800">
              오늘 나에게 필요한 위로와 격려
            </h2>
          </div>
          <button
            onClick={handleDrawCapsule}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>다른 응원 뽑기</span>
          </button>
        </div>

        {/* Capsule Card */}
        {isRevealed && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/80 via-emerald-50/50 to-teal-50 border border-amber-200 shadow-xs space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-[11px] font-bold text-emerald-800 bg-white/80 px-2.5 py-1 rounded-md border border-emerald-200">
              {currentCapsule.tag}
            </span>

            <h3 className="text-lg sm:text-xl font-extrabold text-stone-800">
              {currentCapsule.title}
            </h3>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {currentCapsule.message}
            </p>

            <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between">
              <p className="text-xs text-stone-500 italic">
                "{currentCapsule.quote}"
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyQuote}
                className="px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-medium border border-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>문구 복사</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  onOpenGoogleChatModal(
                    `💌 [토닥토닥 오늘의 마음 응원]\n\n*${currentCapsule.title}*\n\n"${currentCapsule.message}"\n\n_${currentCapsule.quote}_\n\n오늘도 수고 많았어요! 따뜻한 하루 보내세요 🌿`
                  )
                }
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Google Chat으로 보내기</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. 4-7-8 Grounding Breathing Exercise */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-teal-800 text-xs font-semibold mb-2">
            <Wind className="w-3.5 h-3.5 text-teal-600" />
            <span>자율신경 이완</span>
          </div>
          <h2 className="text-xl font-bold text-stone-800">
            불안을 잠재우는 4-7-8 이완 호흡
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            시험 전 긴장되거나 발표 직전, 혹은 밤에 잡생각으로 잠이 안 올 때 심박수를 낮춰줍니다.
          </p>
        </div>

        <div className="py-8 flex flex-col items-center justify-center bg-stone-50/70 rounded-3xl border border-stone-150">
          {/* Animated Circle */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div
              className={`w-40 h-40 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 shadow-lg ${
                !isBreathingActive
                  ? 'bg-stone-300 scale-95'
                  : breathPhase === 'inhale'
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 scale-125 duration-4000 shadow-emerald-500/30'
                  : breathPhase === 'hold'
                  ? 'bg-gradient-to-tr from-teal-500 to-amber-400 scale-125 shadow-amber-500/30'
                  : 'bg-gradient-to-tr from-indigo-500 to-teal-500 scale-90 duration-8000 shadow-indigo-500/30'
              }`}
            >
              <span className="text-3xl font-extrabold">{isBreathingActive ? countdown : '준비'}</span>
              <span className="text-xs font-semibold mt-1">
                {!isBreathingActive
                  ? '시작 버튼을 눌러주세요'
                  : breathPhase === 'inhale'
                  ? '코로 숨 들이마시기 (4초)'
                  : breathPhase === 'hold'
                  ? '숨 멈추기 (7초)'
                  : '입으로 천천히 내쉬기 (8초)'}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer ${
                isBreathingActive
                  ? 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isBreathingActive ? '호흡 멈추기' : '호흡 가이드 시작하기'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Emergency Support Hotline & Student Care */}
      <div className="bg-gradient-to-br from-rose-50/50 via-stone-50 to-emerald-50/40 rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-rose-600" />
          <h3 className="font-bold text-base text-stone-800">
            혼자 견디기 어려울 때, 전문가와 즉시 이야기 나누세요
          </h3>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          토닥토닥은 익명 위로 앱이지만, 극심한 우울감이나 심리적 위기 상황에서는 국가 공공 전문 상담 기관의 도움을 받을 수 있습니다. 24시간 언제든 무료로 익명 상담이 가능합니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
            <span className="text-[11px] font-bold text-rose-600">위기 상담</span>
            <h4 className="font-extrabold text-stone-800 text-lg">국번없이 109</h4>
            <p className="text-[11px] text-stone-500">24시간 자살예방 및 정신위기 상담전화</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
            <span className="text-[11px] font-bold text-teal-600">정신건강위기상담</span>
            <h4 className="font-extrabold text-stone-800 text-lg">1577-0199</h4>
            <p className="text-[11px] text-stone-500">보건복지부 24시간 정신건강 상담</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
            <span className="text-[11px] font-bold text-indigo-600">청년 심리지원</span>
            <h4 className="font-extrabold text-stone-800 text-base">청년마음건강지원</h4>
            <p className="text-[11px] text-stone-500">지자체 바우처를 통한 1:1 심리상담 지원</p>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-stone-500 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
          <span>각 대학교 학생상담센터(학생생활연구소)에서도 재학생 무료 전문 상담을 제공하고 있습니다.</span>
        </div>
      </div>
    </div>
  );
};
