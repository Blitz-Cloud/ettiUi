import { Moon, Sun } from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "../context/themeManager";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  if (theme == "dark") {
    return (
      <Button variant="ghost" size="icon" onClick={() => setTheme("light")}>
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </Button>
    );
  } else if (theme == "light") {
    return (
      <Button variant="ghost" size="icon" onClick={() => setTheme("dark")}>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      </Button>
    );
  }
}
