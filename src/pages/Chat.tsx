
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ImagePlus } from "lucide-react";
import { useState, useRef } from "react";
import { ChatSidebar } from "@/components/chat-sidebar";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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
  const [currentChatId, setCurrentChatId] = useState<string>("");

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      const chats = JSON.parse(savedChats);
      const selectedChat = chats.find((chat: any) => chat.id === chatId);
      if (selectedChat) {
        setMessages(selectedChat.messages || []);
      }
    }
  };

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
        console.log(data)
        const messageContent: MessageContent[] = [
          {
            type: 'text',
            text: input.trim() || 'Analyze this image'
          },
          {
            type: 'image_url',
            image_url: {
              url: "https://assisttalk.onrender.com" + data.url
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
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      
      // Save messages to localStorage
      const savedChats = localStorage.getItem('chats');
      if (savedChats && currentChatId) {
        const chats = JSON.parse(savedChats);
        const updatedChats = chats.map((chat: any) => {
          if (chat.id === currentChatId) {
            return { ...chat, messages: updatedMessages };
          }
          return chat;
        });
        localStorage.setItem('chats', JSON.stringify(updatedChats));
      }
      
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
                    
                    // Save updated messages to localStorage
                    const savedChats = localStorage.getItem('chats');
                    if (savedChats && currentChatId) {
                      const chats = JSON.parse(savedChats);
                      const updatedChats = chats.map((chat: any) => {
                        if (chat.id === currentChatId) {
                          return { ...chat, messages: newMessages };
                        }
                        return chat;
                      });
                      localStorage.setItem('chats', JSON.stringify(updatedChats));
                    }
                    
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
      const processedContent = content.replace(/<think>(.*?)<\/think>/gs, (_, text) => {
        return `\n::: think\n${text}\n:::\n`;
      });

      return (
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground dark:text-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    className="dark:bg-gray-800"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code {...props} className={`${className} text-foreground dark:text-foreground`}>
                    {children}
                  </code>
                );
              },
              'think': ({children}) => (
                <div className="think">{children}</div>
              ),
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </div>
      );
    } else if (Array.isArray(content)) {
      return (
        <div className="flex flex-col gap-2">
          {content.map((part, index) => {
            if (part.type === 'text') {
              return (
                <div key={index} className="prose prose-sm dark:prose-invert max-w-none text-foreground dark:text-foreground">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            className="dark:bg-gray-800"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code {...props} className={`${className} text-foreground dark:text-foreground`}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {part.text || ''}
                  </ReactMarkdown>
                </div>
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
      {/* Sidebar Toggle */}
      <SidebarToggle 
        isOpen={isSidebarOpen} 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
  
      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onResetChat={handleResetChat}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        onChatSelect={handleChatSelect}
        currentChatId={currentChatId}
      />
  
      {/* Chat Container */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4" ref={chatBoxRef}>
          <div className="max-w-3xl mx-auto space-y-4">
            
            {/* Welcome Message and Changelog (If No Messages in Current Chat) */}
            {(!messages.length) ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Welcome to AxiomAI Chat</h2>
                  <p className="text-muted-foreground">
                    Start a new conversation to experience AI-powered chat
                  </p>
                </div>
  
                <Button
                  size="lg"
                  className="group"
                  onClick={() => {
                    const newChatId = Date.now().toString();
                    const newChat = {
                      id: newChatId,
                      title: `New Chat 1`,
                      messages: [],
                      model: selectedModel,
                      timestamp: Date.now()
                    };
                    setIsSidebarOpen(true);
                  }}
                >
                  Start New Chat
                  <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
  
                {/* Recent Updates Section */}
                <div className="w-full max-w-2xl mt-8 space-y-6">
                  <h3 className="text-lg font-semibold border-b pb-2">Recent Updates</h3>
                  <div className="space-y-4">
                    <div className="glass dark:bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">February 21, 2024</div>
                      <h4 className="font-medium mb-2">Multi-Model Support Added</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Added support for Llama 3.3 70B model</li>
                        <li>• Improved chat history management</li>
                        <li>• Enhanced dark mode support</li>
                      </ul>
                    </div>
                    <div className="glass dark:bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">February 15, 2024</div>
                      <h4 className="font-medium mb-2">Image Analysis Support</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Added support for image uploads</li>
                        <li>• Improved chat interface</li>
                        <li>• Better error handling</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
  
            {/* Chat Messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-bubble ${message.role}`}
              >
                {formatMessage(message.content)}
              </div>
            ))}
  
            {/* Loading Animation While AI Responds */}
            {isLoading && (
              <div className="message-bubble assistant text-foreground dark:text-foreground">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
          </div>
        </div>
  
        {/* Chat Input Section */}
        {currentChatId && (
          <div className="border-t">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }} 
              className="max-w-3xl mx-auto p-4"
            >
              <div className="flex gap-4">
                {/* Image Upload Button */}
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
  
                {/* Text Input */}
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isLoading}
                />
  
                {/* Send Button */}
                <Button type="submit" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
