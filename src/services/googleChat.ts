export interface ChatSpace {
  name: string; // e.g. "spaces/AAAAAAAAAAA"
  displayName?: string;
  type?: 'SPACE' | 'GROUP_CHAT' | 'DIRECT_MESSAGE' | string;
  spaceThreadingState?: string;
}

export interface ChatMessageResponse {
  name: string;
  text: string;
  createTime: string;
}

/**
 * Fetch spaces available to the authenticated user in Google Chat
 */
export async function fetchGoogleChatSpaces(accessToken: string): Promise<ChatSpace[]> {
  try {
    const res = await fetch('https://chat.googleapis.com/v1/spaces?pageSize=50', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `스페이스 목록 조회 실패 (${res.status})`);
    }

    const data = await res.json();
    return data.spaces || [];
  } catch (error: any) {
    console.error('Failed to fetch Google Chat spaces:', error);
    throw error;
  }
}

/**
 * Send an encouraging message to a selected Google Chat Space
 */
export async function sendChatMessage(
  accessToken: string,
  spaceName: string,
  messageText: string
): Promise<ChatMessageResponse> {
  try {
    const cleanSpaceName = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;
    const res = await fetch(`https://chat.googleapis.com/v1/${cleanSpaceName}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: messageText,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `메시지 전송 실패 (${res.status})`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('Failed to send Google Chat message:', error);
    throw error;
  }
}
