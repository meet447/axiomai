import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const Terms = () => {
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

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 dark:text-white">Terms of Service</h1>
          
          <div className="prose prose-lg dark:prose-invert">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Acceptance of Terms</h2>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                By accessing and using AxiomAI, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Service Description</h2>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                AxiomAI provides access to AI-powered chat services. The service is provided "as is" and 
                "as available" without any warranties of any kind.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground dark:text-gray-300 mb-4">
                <li>No account registration required</li>
                <li>Free access to AI models</li>
                <li>Real-time chat processing</li>
                <li>No data retention</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">User Responsibilities</h2>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                Users agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground dark:text-gray-300 mb-4">
                <li>Use the service in compliance with all applicable laws</li>
                <li>Not attempt to bypass any service limitations</li>
                <li>Not use the service for harmful or malicious purposes</li>
                <li>Not interfere with the service's operation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Intellectual Property</h2>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                All content, features, and functionality of AxiomAI are owned by us and are protected by 
                international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Limitation of Liability</h2>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                AxiomAI and its operators shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Changes to Terms</h2>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                We reserve the right to modify these terms at any time. Continued use of the service after 
                any changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Contact</h2>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                For questions about these terms, please contact us through our GitHub repository.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;