
import { Button } from "@/components/ui/button";
import { Moon, Sun, Trash2, Plus, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

interface Message {
  role: 'user' | 'assistant';
  content: string | MessageContent[];
}

interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  timestamp: number;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onResetChat: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onChatSelect: (chatId: string) => void;
  currentChatId: string;
}

export function ChatSidebar({
  isOpen,
  onResetChat,
  selectedModel,
  onModelChange,
  onChatSelect,
  currentChatId,
}: ChatSidebarProps) {
  const { theme, setTheme } = useTheme();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    try {
      const savedChats = localStorage.getItem('chats');
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        if (Array.isArray(parsedChats)) {
          setChats(parsedChats);
        }
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      localStorage.removeItem('chats'); // Clear corrupted data
    }
  }, []);

  const createNewChat = () => {
    try {
      // Generate a unique ID using timestamp and random number
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const newChat: Chat = {
        id: uniqueId,
        title: `New Chat ${chats.length + 1}`,
        messages: [],
        model: selectedModel,
        timestamp: Date.now()
      };
      const updatedChats = [newChat, ...chats];
      setChats(updatedChats);
      localStorage.setItem('chats', JSON.stringify(updatedChats));
      onChatSelect(newChat.id);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const deleteChat = (chatId: string) => {
    try {
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      setChats(updatedChats);
      localStorage.setItem('chats', JSON.stringify(updatedChats));
      
      // If deleting current chat, select the next available chat
      if (chatId === currentChatId) {
        if (updatedChats.length > 0) {
          onChatSelect(updatedChats[0].id);
        } else {
          onResetChat(); // Reset if no chats remain
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const clearAllChats = () => {
    try {
      setChats([]);
      localStorage.removeItem('chats');
      onResetChat();
    } catch (error) {
      console.error('Error clearing chats:', error);
    }
  };
  
  const models = [
    { id: "meta-llama/Llama-Vision-Free", name: "Llama Vision" },
    { id: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free", name: "Llama 3.3 70B" },
    { id: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free", name: "DeepSeek R1" },
    { id: "google/gemma-2-27b-it", name: "gemma 2 27B" },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full w-64 bg-background border-r transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full p-4">
        <Button
          onClick={createNewChat}
          className="w-full mb-4"
          variant="default"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>

        <div className="mb-4">
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {chats.map((chat) => (
            <div key={chat.id} className="flex items-center gap-2">
              <Button
                variant={currentChatId === chat.id ? "default" : "ghost"}
                className="w-full justify-start text-sm truncate"
                onClick={() => onChatSelect(chat.id)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {chat.title}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                onClick={() => deleteChat(chat.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <>
                <Sun className="mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-2" />
                Dark Mode
              </>
            )}
          </Button>
          
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={clearAllChats}
          >
            <Trash2 className="mr-2" />
            Clear All Chats
          </Button>
        </div>
      </div>
    </div>
  );
}
