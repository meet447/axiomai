import type { Message } from '../types';

const API_URL = 'https://assisttalk.onrender.com/chat';

export async function streamChat(
  message: string,
  messages: Message[],
  model: string,
  onToken: (text: string) => void
): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
    },
    body: JSON.stringify({
      message,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      model
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch response');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim() === '') continue;
      if (line === 'data: [DONE]') break;

      try {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(5));
          if (data.choices?.[0]?.text) {
            onToken(data.choices[0].text);
          }
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  }
}