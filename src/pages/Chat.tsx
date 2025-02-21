
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ImagePlus } from "lucide-react";
import { useState, useRef } from "react";
import { ChatSidebar } from "@/components/chat-sidebar";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";

interface Message {
  role: "user" | "assistant";
  content: string | MessageContent[];
}

interface MessageContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: {
    url: string;
  };
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("meta-llama/Llama-3.3-70B-Instruct-Turbo-Free");
  const currentStreamController = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://assisttalk.onrender.com/upload-image', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const messageContent: MessageContent[] = [
          {
            type: 'text',
            text: input.trim() || 'Analyze this image'
          },
          {
            type: 'image_url',
            image_url: {
              url: data.url
            }
          }
        ];

        const newMessage: Message = { role: "user", content: messageContent };
        setMessages(prev => [...prev, newMessage]);
        setInput("");
        handleSendMessage(true);
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleSendMessage = async (skipInput = false) => {
    if (currentStreamController.current) {
      currentStreamController.current.abort();
      currentStreamController.current = null;
    }

    if (!skipInput && !input.trim()) return;

    if (!skipInput) {
      const newMessage: Message = { role: "user", content: input };
      setMessages(prev => [...prev, newMessage]);
      setInput("");
    }

    setIsLoading(true);

    const controller = new AbortController();
    currentStreamController.current = controller;

    try {
      const response = await fetch('https://assisttalk.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          messages,
          model: selectedModel
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';

      if (reader) {
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.choices && data.choices[0]) {
                  const text = data.choices[0].text;
                  assistantResponse += text;
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = assistantResponse;
                    return newMessages;
                  });

                  // Scroll to bottom
                  if (chatBoxRef.current) {
                    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                  }
                }
              } catch (e) {
                continue;
              }
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      }]);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      currentStreamController.current = null;
    }
  };

  const handleResetChat = () => {
    if (currentStreamController.current) {
      currentStreamController.current.abort();
      currentStreamController.current = null;
    }
    setMessages([]);
    setInput("");
    setIsLoading(false);
  };

  const formatMessage = (content: string | MessageContent[]) => {
    if (typeof content === 'string') {
      return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');
    } else if (Array.isArray(content)) {
      return (
        <div className="flex flex-col gap-2">
          {content.map((part, index) => {
            if (part.type === 'text') {
              return (
                <div 
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html: part.text?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') || ''
                  }}
                />
              );
            } else if (part.type === 'image_url') {
              return (
                <img
                  key={index}
                  src={part.image_url?.url}
                  alt="Uploaded content"
                  className="max-w-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(part.image_url?.url, '_blank')}
                />
              );
            }
            return null;
          })}
        </div>
      );
    }
    return content;
  };

  return (
    <div className="flex h-screen bg-background">
      <SidebarToggle 
        isOpen={isSidebarOpen} 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <ChatSidebar
        isOpen={isSidebarOpen}
        onResetChat={handleResetChat}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4" ref={chatBoxRef}>
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-bubble ${message.role}`}
              >
                {formatMessage(message.content)}
              </div>
            ))}
            {isLoading && (
              <div className="message-bubble assistant">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border-t">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }} 
            className="max-w-3xl mx-auto p-4"
          >
            <div className="flex gap-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <ImagePlus className="h-4 w-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
