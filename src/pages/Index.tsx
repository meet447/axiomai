
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

const Index = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
        <header className="text-center mb-16 animate-fade-down">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Welcome to AxiomAI
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 dark:text-white">
            Experience the Next Generation of Conversation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 dark:text-gray-300">
            Engage in natural conversations powered by advanced AI technology.
            Get instant answers, explanations, and insights.
          </p>
          <Button
            size="lg"
            className="group"
            onClick={() => navigate("/chat")}
          >
            Start Chatting
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </header>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="glass dark:bg-gray-800/50 p-6 rounded-2xl animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 dark:bg-primary/20">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Natural Conversations</h3>
            <p className="text-muted-foreground dark:text-gray-300">
              Engage in fluid, context-aware discussions that feel natural and intuitive.
            </p>
          </div>

          <div className="glass dark:bg-gray-800/50 p-6 rounded-2xl animate-fade-up" style={{ animationDelay: "400ms" }}>
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 dark:bg-primary/20">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Instant Responses</h3>
            <p className="text-muted-foreground dark:text-gray-300">
              Get immediate, accurate answers to your questions in real-time.
            </p>
          </div>

          <div className="glass dark:bg-gray-800/50 p-6 rounded-2xl animate-fade-up" style={{ animationDelay: "600ms" }}>
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 dark:bg-primary/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Smart Understanding</h3>
            <p className="text-muted-foreground dark:text-gray-300">
              Experience AI that truly understands context and nuance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
