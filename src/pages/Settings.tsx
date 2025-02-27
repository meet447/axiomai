import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, AlertTriangle, Database, MessageSquare, HardDrive } from 'lucide-react';
import { getAllChats, deleteChat, clearAllChats } from '../db';
import type { Chat } from '../types';

export function Settings() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [totalChats, setTotalChats] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [storageUsed, setStorageUsed] = useState('0 KB');
  const [storageLimit, setStorageLimit] = useState('5 MB');
  const [storagePercentage, setStoragePercentage] = useState(0);

  useEffect(() => {
    loadChats();
    checkStorageQuota();
  }, []);

  async function loadChats() {
    const loadedChats = await getAllChats();
    setChats(loadedChats);
    
    // Calculate stats
    setTotalChats(loadedChats.length);
    const messages = loadedChats.reduce((acc, chat) => acc + chat.messages.length, 0);
    setTotalMessages(messages);
    
    // Estimate storage size (rough calculation)
    const chatString = JSON.stringify(loadedChats);
    const bytes = new Blob([chatString]).size;
    setStorageUsed(formatBytes(bytes));
    
    // Calculate percentage of storage used (assuming 5MB limit for IndexedDB)
    const estimatedLimit = 5 * 1024 * 1024; // 5MB in bytes
    const percentage = Math.min(100, (bytes / estimatedLimit) * 100);
    setStoragePercentage(percentage);
  }

  async function checkStorageQuota() {
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        if (estimate.quota) {
          setStorageLimit(formatBytes(estimate.quota));
        }
      }
    } catch (error) {
      console.error('Error checking storage quota:', error);
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async function handleDeleteAllChats() {
    if (isConfirmingDelete) {
      await clearAllChats();
      setChats([]);
      setIsConfirmingDelete(false);
      loadChats();
    } else {
      setIsConfirmingDelete(true);
    }
  }

  async function handleDeleteChat(id: string) {
    await deleteChat(id);
    setChats(chats.filter(chat => chat.id !== id));
    loadChats();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link to="/chat" className="text-gray-400 hover:text-white mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold">Total Chats</h3>
            </div>
            <p className="text-3xl font-bold text-blue-500">{totalChats}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold">Total Messages</h3>
            </div>
            <p className="text-3xl font-bold text-blue-500">{totalMessages}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <HardDrive className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold">Storage</h3>
            </div>
            <p className="text-3xl font-bold text-blue-500">{storageUsed}</p>
            <p className="text-sm text-gray-400 mt-1">of {storageLimit} available</p>
            
            <div className="w-full bg-gray-800 rounded-full h-2.5 mt-3">
              <div 
                className={`h-2.5 rounded-full ${
                  storagePercentage > 80 ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${storagePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleDeleteAllChats}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                isConfirmingDelete 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-800 hover:bg-gray-700'
              } transition-colors`}
            >
              <Trash2 size={18} />
              {isConfirmingDelete ? 'Confirm Delete All Chats' : 'Delete All Chats'}
            </button>
            {isConfirmingDelete && (
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
          {isConfirmingDelete && (
            <div className="mt-4 flex items-start gap-3 p-3 bg-red-950/50 border border-red-800 rounded-lg">
              <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-200">
                This action will permanently delete all your chats and cannot be undone. All your conversation history will be lost.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Chat History</h2>
          {chats.length === 0 ? (
            <p className="text-gray-400">No chats found.</p>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div key={chat.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="font-medium">{chat.title}</h3>
                    <p className="text-sm text-gray-400">
                      {chat.messages.length} messages • {new Date(chat.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteChat(chat.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Delete chat"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}