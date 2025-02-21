import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 dark:bg-gray-900/80 border-b border-border dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a
              href="/"
              className="text-xl font-semibold text-foreground hover:text-primary transition-colors"
            >
              AxiomAI
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className={location.pathname === "/" ? "text-primary" : ""}
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              className={location.pathname === "/privacy" ? "text-primary" : ""}
              onClick={() => navigate("/privacy")}
            >
              Privacy
            </Button>
            <Button
              variant="ghost"
              className={location.pathname === "/terms" ? "text-primary" : ""}
              onClick={() => navigate("/terms")}
            >
              Terms
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;