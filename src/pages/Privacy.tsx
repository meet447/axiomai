import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const Privacy = () => {
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
          <h1 className="text-4xl font-bold mb-8 dark:text-white">Privacy Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Data Collection and Usage</h2>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                AxiomAI is committed to protecting your privacy. We do not store or retain any conversation data. 
                All interactions with our AI models are processed in real-time and immediately discarded after the response is delivered.
              </p>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                We do not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground dark:text-gray-300 mb-4">
                <li>Collect personal information</li>
                <li>Store chat histories</li>
                <li>Use cookies or tracking technologies</li>
                <li>Share any data with third parties</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Data Security</h2>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                All communications between your browser and our servers are encrypted using industry-standard SSL/TLS protocols.
                Since we don't store any user data, there is no risk of data breaches affecting your conversations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">User Rights</h2>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                As we don't collect or store personal data, there is no need for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground dark:text-gray-300 mb-4">
                <li>Data access requests</li>
                <li>Data deletion requests</li>
                <li>Data portability</li>
                <li>Data correction</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Changes to Privacy Policy</h2>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                We reserve the right to update this privacy policy at any time. Any changes will be reflected on this page.
                By continuing to use AxiomAI after changes to this policy, you accept the updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Contact Us</h2>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                If you have any questions about our privacy practices, please contact us through our GitHub repository.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;