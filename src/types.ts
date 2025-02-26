export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  model: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
}