/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { CounselingTab } from './components/CounselingTab';
import { CampusSquareTab } from './components/CampusSquareTab';
import { WellnessTab } from './components/WellnessTab';
import { GoogleChatTab } from './components/GoogleChatTab';
import { GoogleChatModal } from './components/GoogleChatModal';
import { initAuth, googleSignIn, logout, getAccessToken } from './services/googleAuth';
import { ChatSpace, fetchGoogleChatSpaces } from './services/googleChat';
import { WorryPost } from './types/counseling';
import { INITIAL_WORRIES } from './data/seedWorries';
import {
  fetchWorriesFromServer,
  saveWorryToServer,
  sendReactionToServer,
  sendCommentToServer,
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'counsel' | 'square' | 'wellness' | 'chat'>('counsel');

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Google Chat Spaces State
  const [spaces, setSpaces] = useState<ChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ChatSpace | null>(null);
  const [isFetchingSpaces, setIsFetchingSpaces] = useState(false);

  // Modal State
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [pendingChatMessage, setPendingChatMessage] = useState('');

  // Worries State fetched from backend server
  const [worries, setWorries] = useState<WorryPost[]>(INITIAL_WORRIES);
  const [isLoadingWorries, setIsLoadingWorries] = useState(true);

  // Fetch worries from Backend Server on mount
  useEffect(() => {
    let isMounted = true;
    async function loadBackendData() {
      try {
        setIsLoadingWorries(true);
        const data = await fetchWorriesFromServer();
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          setWorries(data);
        }
      } catch (err) {
        console.warn('Backend data load fallback to initial worries:', err);
      } finally {
        if (isMounted) setIsLoadingWorries(false);
      }
    }
    loadBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      async (authUser, token) => {
        setUser(authUser);
        setAccessToken(token);
        loadSpaces(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setSpaces([]);
        setSelectedSpace(null);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const loadSpaces = async (token: string) => {
    setIsFetchingSpaces(true);
    try {
      const spaceList = await fetchGoogleChatSpaces(token);
      setSpaces(spaceList);
      if (spaceList.length > 0 && !selectedSpace) {
        setSelectedSpace(spaceList[0]);
      }
    } catch (err) {
      console.warn('Could not load spaces:', err);
    } finally {
      setIsFetchingSpaces(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        await loadSpaces(result.accessToken);
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      setSpaces([]);
      setSelectedSpace(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleRefreshSpaces = async () => {
    const token = accessToken || (await getAccessToken());
    if (token) {
      await loadSpaces(token);
    }
  };

  // Open Chat Modal (Prompt login if not authenticated)
  const handleOpenGoogleChatModal = async (messageText: string) => {
    setPendingChatMessage(messageText);

    if (!user || !accessToken) {
      // Prompt user to sign in
      setActiveTab('chat');
      return;
    }

    if (spaces.length === 0) {
      await handleRefreshSpaces();
    }
    setIsChatModalOpen(true);
  };

  // Campus Square Actions (Persisted to Backend Server)
  const handleAddWorry = async (newPost: WorryPost) => {
    // Optimistic local update
    setWorries((prev) => [newPost, ...prev]);
    try {
      const saved = await saveWorryToServer(newPost);
      // Update with server assigned ID if any
      setWorries((prev) => prev.map((w) => (w.id === newPost.id ? saved : w)));
    } catch (err) {
      console.error('Failed to save worry to backend:', err);
    }
  };

  const handleReact = async (postId: string, reactionType: 'hug' | 'warmth' | 'youCanDoIt') => {
    // Optimistic local update
    setWorries((prev) =>
      prev.map((w) => {
        if (w.id !== postId) return w;
        return {
          ...w,
          likes: {
            ...w.likes,
            [reactionType]: (w.likes[reactionType] || 0) + 1,
          },
        };
      })
    );

    try {
      await sendReactionToServer(postId, reactionType);
    } catch (err) {
      console.error('Failed to sync reaction to backend:', err);
    }
  };

  const handleAddComment = async (postId: string, text: string) => {
    const tempId = `comm-${Date.now()}`;
    const newComment = {
      id: tempId,
      nickname: '따뜻한 캠퍼스 벗',
      text,
      createdAt: '방금 전',
    };

    // Optimistic local update
    setWorries((prev) =>
      prev.map((w) => {
        if (w.id !== postId) return w;
        return {
          ...w,
          comments: [...(w.comments || []), newComment],
        };
      })
    );

    try {
      const res = await sendCommentToServer(postId, '따뜻한 캠퍼스 벗', text);
      if (res.comment) {
        setWorries((prev) =>
          prev.map((w) => {
            if (w.id !== postId) return w;
            return {
              ...w,
              comments: w.comments.map((c) => (c.id === tempId ? res.comment : c)),
            };
          })
        );
      }
    } catch (err) {
      console.error('Failed to sync comment to backend:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto w-full">
        {activeTab === 'counsel' && (
          <CounselingTab
            onAddWorryToSquare={handleAddWorry}
            onOpenGoogleChatModal={handleOpenGoogleChatModal}
          />
        )}

        {activeTab === 'square' && (
          <CampusSquareTab
            worries={worries}
            onReact={handleReact}
            onAddComment={handleAddComment}
            onOpenGoogleChatModal={handleOpenGoogleChatModal}
          />
        )}

        {activeTab === 'wellness' && (
          <WellnessTab onOpenGoogleChatModal={handleOpenGoogleChatModal} />
        )}

        {activeTab === 'chat' && (
          <GoogleChatTab
            user={user}
            accessToken={accessToken}
            spaces={spaces}
            selectedSpace={selectedSpace}
            onSelectSpace={setSelectedSpace}
            onRefreshSpaces={handleRefreshSpaces}
            isFetchingSpaces={isFetchingSpaces}
            onLogin={handleLogin}
            isLoggingIn={isLoggingIn}
            onOpenGoogleChatModal={handleOpenGoogleChatModal}
          />
        )}
      </main>

      {/* Mandatory Google Chat User Confirmation Modal */}
      {accessToken && (
        <GoogleChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          spaces={spaces}
          selectedSpace={selectedSpace}
          onSelectSpace={setSelectedSpace}
          messageText={pendingChatMessage}
          accessToken={accessToken}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white/70 py-6 text-center text-xs text-stone-500 space-y-1">
        <p className="font-medium text-stone-700">
          토닥토닥 (TodakTodak) — 지친 대한민국 대학생들을 위한 캠퍼스 마음 쉼터
        </p>
        <p className="text-[11px] text-stone-400">
          익명 고민 상담 · AI 맞춤 심리 위로 · Google Chat 연동 마음 우체통
        </p>
      </footer>
    </div>
  );
}
