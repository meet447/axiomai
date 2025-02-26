import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { Chat } from '../types';

interface ChatWindowProps {
  chat: Chat | null;
  onSendMessage: (content: string, model: string) => void;
  isStreaming: boolean;
}

export function ChatWindow({ chat, onSendMessage, isStreaming }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('google/gemma-2-27b-it');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950 p-4">
        <div className="text-center text-gray-400 max-w-md">
          <h2 className="text-xl font-semibold mb-2">Welcome to Axiom Chat</h2>
          <p className="text-sm">
            Start a new conversation by clicking the + button in the sidebar or selecting an existing chat.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isStreaming) {
      onSendMessage(message.trim(), selectedModel);
      setMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-950">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          {chat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <div className="mt-1 text-xs opacity-70">
                  {msg.model} • {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-800 bg-gray-950 p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isStreaming}
          >
            <option value="google/gemma-2-27b-it">Gemma 27B</option>
            <option value="anthropic/claude-3-opus">Claude 3</option>
            <option value="google/gemini-pro">Gemini Pro</option>
          </select>
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={isStreaming ? 'Please wait...' : 'Type your message...'}
              rows={1}
              disabled={isStreaming}
              className="w-full bg-gray-800 text-white rounded-lg pl-4 pr-10 py-2 resize-none border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isStreaming}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}