import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        serif: ["Playfair Display", ...fontFamily.serif],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { transform: "scaleX(1) scaleY(1) rotate(0deg)" },
          "20%":       { transform: "scaleX(0.93) scaleY(1.06) rotate(-1.5deg)" },
          "45%":       { transform: "scaleX(1.06) scaleY(0.96) rotate(1.8deg)" },
          "70%":       { transform: "scaleX(0.96) scaleY(1.04) rotate(-0.8deg)" },
          "85%":       { transform: "scaleX(1.03) scaleY(0.98) rotate(1deg)" },
        },
        "flicker-inner": {
          "0%, 100%": { transform: "scaleX(1) scaleY(1) rotate(0deg)", opacity: "0.9" },
          "30%":      { transform: "scaleX(1.1) scaleY(0.93) rotate(2.2deg)", opacity: "0.75" },
          "60%":      { transform: "scaleX(0.9) scaleY(1.1) rotate(-1.8deg)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%":      { opacity: "0.65", transform: "scale(1.25)" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "drip": {
          "0%, 60%, 100%": { transform: "scaleY(1)" },
          "80%":           { transform: "scaleY(1.06)" },
        },
      },
      animation: {
        flicker:        "flicker 2.1s ease-in-out infinite",
        "flicker-inner": "flicker-inner 1.7s ease-in-out infinite 0.3s",
        "glow-pulse":   "glow-pulse 2.4s ease-in-out infinite",
        "fade-up":      "fade-up 0.7s ease-out forwards",
        drip:           "drip 3s ease-in-out infinite 1s",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
