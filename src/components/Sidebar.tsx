import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquarePlus, Search, Settings, Bot, Menu, X, Trash2 } from 'lucide-react';
import type { Chat } from '../types';

interface SidebarProps {
  chats: Chat[];
  selectedChat: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

export function Sidebar({ chats, selectedChat, onSelectChat, onNewChat, onDeleteChat }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = searchTerm 
    ? chats.filter(chat => 
        chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : chats;

  const sidebarContent = (
    <>
      <div className="p-4 flex items-center gap-2 border-b border-gray-800">
        <Bot className="h-6 w-6 text-blue-500" />
        <h1 className="text-white text-lg font-semibold">Axiom Chat</h1>
      </div>
      
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
        >
          <MessageSquarePlus size={20} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        {filteredChats.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            {searchTerm ? 'No chats found' : 'No chats yet'}
          </div>
        )}
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center w-full text-left px-3 py-2 rounded-lg mb-1 hover:bg-gray-800 transition-colors ${
              selectedChat === chat.id ? 'bg-gray-800' : ''
            }`}
          >
            <button
              onClick={() => {
                onSelectChat(chat.id);
                setIsMobileMenuOpen(false);
              }}
              className="flex-1 text-left"
            >
              <h3 className="text-white text-sm font-medium truncate">{chat.title}</h3>
              <p className="text-gray-400 text-xs truncate">
                Continue Chatting
              </p>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-700 rounded-md"
              aria-label="Delete chat"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-800">
        <Link to="/settings" className="flex items-center text-gray-400 hover:text-white gap-2 px-2">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="w-64 h-full bg-gray-900 flex flex-col border-r border-gray-800">
          {sidebarContent}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 bg-gray-900 h-screen flex flex-col border-r border-gray-800">
        {sidebarContent}
      </div>
    </>
  );
}