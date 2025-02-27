import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { Chat } from '../types';
import { marked } from 'marked';

interface ChatWindowProps {
  chat: Chat | null;
  onSendMessage: (content: string, model: string) => void;
  isStreaming: boolean;
}

export function ChatWindow({ chat, onSendMessage, isStreaming }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free');
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

  // Function to render markdown content safely
  const renderMarkdown = (content: string) => {
    try {
      // Process thinking tags before rendering markdown
      let processedContent = content;
      const thinkRegex = /<think>([\s\S]*?)<\/think>/g;
      
      processedContent = processedContent.replace(thinkRegex, (match, thinking) => {
        return `<div class="thinking-block"><div class="thinking-header">Thinking...</div><div class="thinking-content">${thinking}</div></div>`;
      });
      
      const html = marked(processedContent, { breaks: true });
      return { __html: html };
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return { __html: content };
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-950">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6">
          {chat.messages.map((msg, index) => (
            <div key={`${msg.id}-${index}`} className="mb-6">
              {msg.role === 'user' ? (
                <div className="flex justify-end mb-2">
                  <div className="bg-blue-600 text-white rounded-2xl px-4 py-2 max-w-[85%]">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <div className="mt-1 text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-2">
                  <div className="prose prose-invert prose-lg max-w-none px-4">
                    <div dangerouslySetInnerHTML={renderMarkdown(msg.content)} />
                    <div className="text-xs text-gray-400 mt-1">
                      {msg.model} • {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}
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
            <optgroup label="Meta Llama">
              <option value="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K">Llama 3.1 8B (128K)</option>
              <option value="meta-llama/Llama-Vision-Free">Llama Vision</option>
            </optgroup>
            <optgroup label="DeepSeek">
              <option value="deepseek-ai/DeepSeek-R1">DeepSeek R1</option>
              <option value="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free">DeepSeek R1 Distill</option>
            </optgroup>
            <optgroup label="Google">
              <option value="google/gemma-2-27b-it">Gemma 2 27B</option>
            </optgroup>
            <optgroup label="Databricks">
              <option value="databricks/dbrx-instruct">DBRX Instruct</option>
            </optgroup>
            <optgroup label="Qwen">
              <option value="Qwen/Qwen2-72B-Instruct">Qwen2 72B</option>
              <option value="Qwen/Qwen2.5-Coder-32B-Instruct">Qwen2.5 Coder 32B</option>
            </optgroup>
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