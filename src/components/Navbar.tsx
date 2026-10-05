import React, { useState } from 'react';
import { Heart, Volume2, VolumeX, Sparkles, MessageSquare, Shield, LogOut, Disc, MessageCircleHeart } from 'lucide-react';
import { User } from 'firebase/auth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { AmbientSoundType, playAmbientSound, setAmbientVolume } from '../utils/audio';

interface NavbarProps {
  activeTab: 'counsel' | 'square' | 'wellness' | 'chat';
  setActiveTab: (tab: 'counsel' | 'square' | 'wellness' | 'chat') => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogin,
  onLogout,
  isLoggingIn,
}) => {
  const [soundType, setSoundType] = useState<AmbientSoundType>('none');
  const [volume, setVolume] = useState(0.3);
  const [showSoundMenu, setShowSoundMenu] = useState(false);

  const handleSoundChange = (type: AmbientSoundType) => {
    setSoundType(type);
    playAmbientSound(type, volume);
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    setAmbientVolume(v);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('counsel')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-0.5 shadow-md shadow-emerald-700/10">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-emerald-600">
                <Heart className="w-5 h-5 fill-rose-400 text-rose-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-800">
                  토닥토닥
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  마음 쉼터
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                학업·진로·관계로 지친 대학생을 위한 익명 위로소
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200/80">
            <button
              onClick={() => setActiveTab('counsel')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'counsel'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI 토닥이 상담</span>
            </button>
            <button
              onClick={() => setActiveTab('square')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'square'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <MessageCircleHeart className="w-3.5 h-3.5 text-rose-500" />
              <span>캠퍼스 공감 광장</span>
            </button>
            <button
              onClick={() => setActiveTab('wellness')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'wellness'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Disc className="w-3.5 h-3.5 text-teal-500" />
              <span>마음 처방 캡슐</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Chat 연동</span>
            </button>
          </nav>

          {/* Right Action: Sound & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ambient Sound Controller */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSoundMenu(!showSoundMenu)}
                title="캠퍼스 힐링 사운드"
                className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  soundType !== 'none'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {soundType !== 'none' ? (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span className="hidden sm:inline text-[11px]">
                      {soundType === 'rain' && '빗소리'}
                      {soundType === 'library' && '도서관'}
                      {soundType === 'campfire' && '모닥불'}
                      {soundType === 'waves' && '파도'}
                    </span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-stone-400" />
                    <span className="hidden sm:inline text-[11px]">사운드</span>
                  </>
                )}
              </button>

              {showSoundMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-xs font-bold text-stone-700 mb-2 flex items-center justify-between">
                    <span>캠퍼스 백색소음</span>
                    <span className="text-[10px] text-stone-400 font-normal">마음 안정용</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    <button
                      onClick={() => handleSoundChange('rain')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                        soundType === 'rain' ? 'bg-emerald-600 text-white' : 'hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      🌧️ 창가 빗소리
                    </button>
                    <button
                      onClick={() => handleSoundChange('library')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                        soundType === 'library' ? 'bg-emerald-600 text-white' : 'hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      📖 심야 열람실
                    </button>
                    <button
                      onClick={() => handleSoundChange('campfire')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                        soundType === 'campfire' ? 'bg-emerald-600 text-white' : 'hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      🪵 따뜻한 모닥불
                    </button>
                    <button
                      onClick={() => handleSoundChange('waves')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                        soundType === 'waves' ? 'bg-emerald-600 text-white' : 'hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      🌊 잔잔한 파도
                    </button>
                  </div>
                  {soundType !== 'none' && (
                    <div className="pt-2 border-t border-stone-100">
                      <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                        <span>음량 조절</span>
                        <span>{Math.round(volume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-full accent-emerald-600 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => handleSoundChange('none')}
                    className="w-full mt-2 py-1 text-center text-xs text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 cursor-pointer"
                  >
                    소리 끄기
                  </button>
                </div>
              )}
            </div>

            {/* Google Account Profile / Sign-in */}
            {user ? (
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google 사용자'}
                    className="w-6 h-6 rounded-full border border-stone-300"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium text-stone-700 max-w-[90px] truncate hidden sm:inline">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={onLogout}
                  title="로그아웃"
                  className="text-stone-400 hover:text-rose-600 p-1 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <GoogleSignInButton
                onClick={onLogin}
                loading={isLoggingIn}
                text="Google Chat 연동"
                className="text-xs px-3 py-1.5"
              />
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-100 text-[11px]">
          <button
            onClick={() => setActiveTab('counsel')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg cursor-pointer ${
              activeTab === 'counsel' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI 상담</span>
          </button>
          <button
            onClick={() => setActiveTab('square')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg cursor-pointer ${
              activeTab === 'square' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <MessageCircleHeart className="w-4 h-4" />
            <span>공감 광장</span>
          </button>
          <button
            onClick={() => setActiveTab('wellness')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg cursor-pointer ${
              activeTab === 'wellness' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <Disc className="w-4 h-4" />
            <span>마음 캡슐</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg cursor-pointer ${
              activeTab === 'chat' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Google Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
