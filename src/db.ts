import { openDB } from 'idb';
import type { Chat, Message } from './types';

const DB_NAME = 'axiom-chat';
const DB_VERSION = 1;

export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore('chats', { keyPath: 'id' });
    },
  });
  return db;
}

export async function getAllChats(): Promise<Chat[]> {
  const db = await initDB();
  return db.getAll('chats');
}

export async function getChat(id: string): Promise<Chat | undefined> {
  const db = await initDB();
  return db.get('chats', id);
}

export async function saveChat(chat: Chat): Promise<void> {
  const db = await initDB();
  await db.put('chats', chat);
}

export async function deleteChat(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('chats', id);
}

export async function clearAllChats(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('chats', 'readwrite');
  await tx.objectStore('chats').clear();
  await tx.done;
}

export async function getStorageStats(): Promise<{ totalChats: number; totalMessages: number; storageSize: number }> {
  const chats = await getAllChats();
  const totalChats = chats.length;
  const totalMessages = chats.reduce((acc, chat) => acc + chat.messages.length, 0);
  
  // Estimate storage size
  const chatString = JSON.stringify(chats);
  const storageSize = new Blob([chatString]).size;
  
  return { totalChats, totalMessages, storageSize };
}