import { Toaster as Sonner } from "sonner";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

type SonnerTheme = "light" | "dark" | "system";

const Toaster = ({ ...props }: React.ComponentProps<typeof Sonner>) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={(theme as SonnerTheme) ?? "light"}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
