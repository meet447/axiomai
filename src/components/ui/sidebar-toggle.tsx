
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";

interface SidebarToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function SidebarToggle({ isOpen, onClick }: SidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="fixed top-4 left-4 z-50"
    >
      {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
    </Button>
  );
}
