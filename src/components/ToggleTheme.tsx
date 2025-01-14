"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ToggleTheme({ label }: { label?: string }) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={!label ? "icon" : "default"}
          className={cn(
            label &&
              "p-0 h-fit text-base w-full justify-start focus-visible:ring-0"
          )}
        >
          <Sun
            className={cn(
              "rotate-0 scale-100 dark:-rotate-90 dark:scale-0",
              label && "!size-5"
            )}
          />
          <Moon
            className={cn(
              "absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100",
              label && "!size-5"
            )}
          />
          {label}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
