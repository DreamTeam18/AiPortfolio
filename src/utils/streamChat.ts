import type { ChatMessage } from '../types/chat';

interface StreamChatOptions {
  message: string;
  history: ChatMessage[];
  /** Called with the full text accumulated so far, each time a token arrives. */
  onDelta: (accumulated: string) => void;
  signal?: AbortSignal;
}

/**
 * POSTs to /api/chat and reads the SSE response, calling onDelta as tokens
 * arrive. Resolves with the complete message once the stream closes.
 */
export async function streamChat({
  message,
  history,
  onDelta,
  signal,
}: StreamChatOptions): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      history: history.map(m => ({
        role: m.role,
        content: m.content
      })),
    }),
    signal,
  });

  // Failures are sent as JSON before the stream starts, so this stays readable.
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to get response');
  }

  if (!response.body) {
    throw new Error('Streaming is not supported in this browser.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // A chunk can end mid-line, so keep the trailing fragment for the next read.
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') return accumulated;

      let frame: { delta?: string; error?: string };
      try {
        frame = JSON.parse(payload);
      } catch {
        continue; // partial or non-JSON frame
      }

      if (frame.error) throw new Error(frame.error);
      if (frame.delta) {
        accumulated += frame.delta;
        onDelta(accumulated);
      }
    }
  }

  return accumulated;
}
