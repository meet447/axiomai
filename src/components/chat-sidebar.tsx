
import { Button } from "@/components/ui/button";
import { Moon, Sun, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";

interface ChatSidebarProps {
  isOpen: boolean;
  onResetChat: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ChatSidebar({
  isOpen,
  onResetChat,
  selectedModel,
  onModelChange,
}: ChatSidebarProps) {
  const { theme, setTheme } = useTheme();
  
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
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">AI Models</h3>
            {models.map((model) => (
              <Button
                key={model.id}
                variant={selectedModel === model.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onModelChange(model.id)}
              >
                {model.name}
              </Button>
            ))}
          </div>
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
            onClick={onResetChat}
          >
            <Trash2 className="mr-2" />
            Reset Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
