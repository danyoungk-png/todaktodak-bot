import { WorryPost } from '../types/counseling';

export async function fetchWorriesFromServer(): Promise<WorryPost[]> {
  try {
    const res = await fetch('/api/worries');
    if (!res.ok) {
      throw new Error(`Failed to fetch worries: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching worries from backend:', error);
    throw error;
  }
}

export async function saveWorryToServer(worry: Partial<WorryPost>): Promise<WorryPost> {
  try {
    const res = await fetch('/api/worries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(worry),
    });
    if (!res.ok) {
      throw new Error(`Failed to save worry: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error saving worry to backend:', error);
    throw error;
  }
}

export async function sendReactionToServer(
  worryId: string,
  type: 'hug' | 'warmth' | 'youCanDoIt'
): Promise<{ success: boolean; likes: { hug: number; warmth: number; youCanDoIt: number } }> {
  try {
    const res = await fetch(`/api/worries/${worryId}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    if (!res.ok) {
      throw new Error(`Failed to send reaction: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error sending reaction to backend:', error);
    throw error;
  }
}

export async function sendCommentToServer(
  worryId: string,
  nickname: string,
  text: string
): Promise<{ success: boolean; comment: any }> {
  try {
    const res = await fetch(`/api/worries/${worryId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, text }),
    });
    if (!res.ok) {
      throw new Error(`Failed to send comment: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error sending comment to backend:', error);
    throw error;
  }
}
