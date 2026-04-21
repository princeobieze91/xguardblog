import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#f0eeff",
          100: "#e3deff",
          200: "#cbbeff",
          300: "#a98eff",
          400: "#8b5cf6",
          500: "#6C63FF",
          600: "#5a52d5",
          700: "#4640aa",
          800: "#342f80",
          900: "#221f55",
          950: "#110f2b",
        },
        rose: {
          400: "#fb7185",
          500: "#FF6584",
          600: "#e5536f",
        },
        dark: {
          50:  "#f0f0f8",
          100: "#e0e0f0",
          200: "#c0c0e0",
          300: "#9090c8",
          400: "#6060a8",
          500: "#404080",
          600: "#303060",
          700: "#202048",
          800: "#141430",
          900: "#0F0F1A",
          950: "#08080f",
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card:  "12px",
        input: "8px",
        pill:  "999px",
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease forwards",
        "slide-up":   "slideUp 0.4s ease forwards",
        float:        "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        float:   { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
    },
  },
  plugins: [],
};

export default config;
