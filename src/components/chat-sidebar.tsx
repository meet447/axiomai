
import { Button } from "@/components/ui/button";
import { Moon, Sun, Trash2, Plus, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

interface Chat {
  id: string;
  title: string;
  messages: any[];
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
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  const createNewChat = () => {
    // Save current chat's messages if it exists
    if (currentChatId) {
      const savedChats = localStorage.getItem('chats');
      if (savedChats) {
        const existingChats = JSON.parse(savedChats);
        const currentChat = existingChats.find((chat: Chat) => chat.id === currentChatId);
        if (currentChat) {
          const updatedExistingChats = existingChats.map((chat: Chat) => {
            if (chat.id === currentChatId) {
              return { ...chat };
            }
            return chat;
          });
          localStorage.setItem('chats', JSON.stringify(updatedExistingChats));
        }
      }
    }

    // Create new chat
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `New Chat ${chats.length + 1}`,
      messages: [],
      model: selectedModel,
      timestamp: Date.now()
    };
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    onChatSelect(newChat.id);
  };

  const deleteChat = (chatId: string) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    if (chatId === currentChatId && updatedChats.length > 0) {
      onChatSelect(updatedChats[0].id);
    }
  };

  const clearAllChats = () => {
    setChats([]);
    localStorage.removeItem('chats');
    onResetChat();
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
