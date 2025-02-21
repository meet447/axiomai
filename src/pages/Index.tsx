
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Sparkles, Zap, Lock, Rocket, Brain, SwitchCamera, HelpCircle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Index = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16 animate-fade-down">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Ultra-lightweight AI Chat
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 dark:text-white">
            Chat Freely. No Accounts. No Limits.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 dark:text-gray-300">
            Experience the fastest, most private AI chat platform. No sign-up required.
            Start chatting instantly with advanced AI models.
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

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
          <div className="glass dark:bg-gray-800/50 p-6 rounded-2xl animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 dark:bg-primary/20">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">No Data Saved</h3>
            <p className="text-muted-foreground dark:text-gray-300">
              Private and secure conversations with zero data retention.
            </p>
          </div>

          <div className="glass dark:bg-gray-800/50 p-6 rounded-2xl animate-fade-up" style={{ animationDelay: "400ms" }}>
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 dark:bg-primary/20">
              <Rocket className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">No Account Required</h3>
            <p className="text-muted-foreground dark:text-gray-300">
              Start chatting instantly - no sign-up, no hassle.
            </p>
          </div>

          <div className="glass dark:bg-gray-800/50 p-6 rounded-2xl animate-fade-up" style={{ animationDelay: "600ms" }}>
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 dark:bg-primary/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Unlimited Free Use</h3>
            <p className="text-muted-foreground dark:text-gray-300">
              Enjoy unrestricted access to AI models, completely free.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 mx-auto dark:bg-primary/20">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Choose Your Model</h3>
              <p className="text-muted-foreground">Select from various AI models optimized for different tasks</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 mx-auto dark:bg-primary/20">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Start Chatting</h3>
              <p className="text-muted-foreground">Begin your conversation immediately with no setup required</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 mx-auto dark:bg-primary/20">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Get Results</h3>
              <p className="text-muted-foreground">Receive instant, accurate responses to your queries</p>
            </div>
          </div>
        </div>

        {/* Model Selection Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Available Models</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass dark:bg-gray-800/50 p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 mr-3 text-primary" />
                <h3 className="text-xl font-semibold dark:text-white">DeepSeek R1</h3>
              </div>
              <p className="text-muted-foreground">Advanced language model for complex tasks and detailed conversations and reasoning</p>
            </div>
            <div className="glass dark:bg-gray-800/50 p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <MessageSquare className="h-6 w-6 mr-3 text-primary" />
                <h3 className="text-xl font-semibold dark:text-white">Llama 3.3 70B</h3>
              </div>
              <p className="text-muted-foreground">Specialized in analytical thinking and detailed explanations</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is my conversation private?</AccordionTrigger>
              <AccordionContent>
                Yes, absolutely! We don't store any conversation data. Everything is processed in real-time and immediately discarded.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I switch between different AI models?</AccordionTrigger>
              <AccordionContent>
                You can easily switch between models using the model selector in the chat interface. Each model has its own strengths for different types of tasks.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Are there any usage limits?</AccordionTrigger>
              <AccordionContent>
                No, you can use AxiomAI as much as you want! We believe in providing unrestricted access to AI technology.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Footer */}
        <footer className="text-center text-muted-foreground">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://github.com/yourusername/axiomai" className="hover:text-primary transition-colors">
              GitHub
            </a>
            <a href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-primary transition-colors">
              Terms
            </a>
          </div>
          <p className="text-sm">© 2024 AxiomAI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
