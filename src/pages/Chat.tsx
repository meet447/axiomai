import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { Sidebar } from '../components/Sidebar';
import { ChatWindow } from '../components/ChatWindow';
import { getAllChats, saveChat } from '../db';
import { streamChat } from '../services/api';
import type { Chat, Message } from '../types';

export function Chat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  async function loadChats() {
    const loadedChats = await getAllChats();
    setChats(loadedChats);
  }

  function createNewChat() {
    const newChat: Chat = {
      id: nanoid(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setChats((prev) => [...prev, newChat]);
    setSelectedChatId(newChat.id);
    saveChat(newChat);
  }

  async function handleSendMessage(content: string, model: string) {
    if (!selectedChatId || isStreaming) return;

    const newMessage: Message = {
      id: nanoid(),
      content,
      role: 'user',
      model,
      timestamp: Date.now(),
    };

    setChats((currentChats) => 
      currentChats.map((chat) => {
        if (chat.id === selectedChatId) {
          const updatedChat = {
            ...chat,
            messages: [...chat.messages, newMessage],
            updatedAt: Date.now(),
            title: chat.messages.length === 0 ? content.slice(0, 30) + '...' : chat.title,
          };
          saveChat(updatedChat);
          return updatedChat;
        }
        return chat;
      })
    );

    // Create a temporary message for streaming
    const streamingMessageId = nanoid();
    const streamingMessage: Message = {
      id: streamingMessageId,
      content: '',
      role: 'assistant',
      model,
      timestamp: Date.now(),
    };

    setChats((currentChats) => 
      currentChats.map((chat) => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            messages: [...chat.messages, streamingMessage],
          };
        }
        return chat;
      })
    );

    setIsStreaming(true);

    try {
      const selectedChat = chats.find(chat => chat.id === selectedChatId);
      if (!selectedChat) return;

      let streamedContent = '';

      await streamChat(
        content,
        selectedChat.messages,
        model,
        (token) => {
          streamedContent += token;
          setChats((currentChats) => 
            currentChats.map((chat) => {
              if (chat.id === selectedChatId) {
                const updatedMessages = chat.messages.map((msg) => 
                  msg.id === streamingMessageId
                    ? { ...msg, content: streamedContent }
                    : msg
                );
                return { ...chat, messages: updatedMessages };
              }
              return chat;
            })
          );
        }
      );

      // Save the final message
      setChats((currentChats) => 
        currentChats.map((chat) => {
          if (chat.id === selectedChatId) {
            const updatedChat = {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === streamingMessageId
                  ? { ...msg, content: streamedContent }
                  : msg
              ),
              updatedAt: Date.now(),
            };
            saveChat(updatedChat);
            return updatedChat;
          }
          return chat;
        })
      );
    } catch (error) {
      console.error('Error in chat stream:', error);
      // Handle the error appropriately
    } finally {
      setIsStreaming(false);
    }
  }

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar
        chats={chats}
        selectedChat={selectedChatId}
        onSelectChat={setSelectedChatId}
        onNewChat={createNewChat}
      />
      <ChatWindow 
        chat={selectedChat} 
        onSendMessage={handleSendMessage}
        isStreaming={isStreaming}
      />
    </div>
  );
}