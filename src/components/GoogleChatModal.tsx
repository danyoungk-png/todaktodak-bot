import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle2, X, MessageSquare, ShieldCheck } from 'lucide-react';
import { ChatSpace, sendChatMessage } from '../services/googleChat';

interface GoogleChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaces: ChatSpace[];
  selectedSpace: ChatSpace | null;
  onSelectSpace: (space: ChatSpace) => void;
  messageText: string;
  accessToken: string;
  onSuccess?: () => void;
}

export const GoogleChatModal: React.FC<GoogleChatModalProps> = ({
  isOpen,
  onClose,
  spaces,
  selectedSpace,
  onSelectSpace,
  messageText,
  accessToken,
  onSuccess,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!selectedSpace) {
      setErrorMessage('메시지를 전송할 Google Chat 스페이스를 선택해주세요.');
      return;
    }
    if (!messageText.trim()) {
      setErrorMessage('전송할 메시지 내용이 비어있습니다.');
      return;
    }

    setIsSending(true);
    setErrorMessage('');
    try {
      await sendChatMessage(accessToken, selectedSpace.name, messageText);
      setSendResult('success');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      setSendResult('error');
      setErrorMessage(err?.message || 'Google Chat 메시지 전송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  const handleResetAndClose = () => {
    setSendResult('idle');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-800 text-base">Google Chat 메시지 전송 확인</h3>
              <p className="text-xs text-stone-500">지정된 스페이스로 위로/응원 메시지를 전달합니다.</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {sendResult === 'success' ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-stone-800">메시지가 안전하게 전송되었습니다!</h4>
              <p className="text-sm text-stone-600 max-w-sm mx-auto">
                선택하신 <span className="font-medium text-emerald-700">[{selectedSpace?.displayName || 'Google Chat 스페이스'}]</span>에 따뜻한 응원의 온기가 전달되었습니다.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                >
                  확인 완료
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Mandatory Confirmation Notice */}
              <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <p className="font-semibold mb-0.5">사용자 승인 후 전송 (Google Workspace 정책 준수)</p>
                  <p>
                    로그인하신 본인의 Google 계정 권한으로 아래의 메시지가 실제 Google Chat 스페이스에 게시됩니다. 내용을 확인하신 후 전송 여부를 결정해주세요.
                  </p>
                </div>
              </div>

              {/* Space Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  1. 전송 대상 Google Chat 스페이스 선택
                </label>
                {spaces.length === 0 ? (
                  <div className="p-4 bg-stone-50 rounded-xl text-center text-xs text-stone-500 border border-stone-200">
                    스페이스를 불러오는 중이거나 참여 중인 스페이스가 없습니다.
                  </div>
                ) : (
                  <div className="max-h-36 overflow-y-auto space-y-1.5 border border-stone-200 rounded-xl p-1.5 bg-stone-50/50">
                    {spaces.map((space) => {
                      const isSelected = selectedSpace?.name === space.name;
                      return (
                        <button
                          key={space.name}
                          type="button"
                          onClick={() => onSelectSpace(space)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white font-medium shadow-xs'
                              : 'text-stone-700 hover:bg-stone-200/60'
                          }`}
                        >
                          <span className="truncate">{space.displayName || '이름 없는 스페이스'}</span>
                          <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-stone-200 text-stone-600'
                          }`}>
                            {space.type || 'SPACE'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Message Preview */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  2. 전송될 메시지 내용 미리보기
                </label>
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap font-sans">
                  {messageText || '메시지 내용이 없습니다.'}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Actions: Explicit Confirmation vs Cancel */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  disabled={isSending}
                  className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-100 font-medium rounded-xl transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending || !selectedSpace}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>전송 중...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Google Chat으로 전송 확인</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
