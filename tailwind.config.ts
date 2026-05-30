import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#FF4FA3",
          plum: "#7A1E5D",
          peach: "#FF9E6D",
          gold: "#FFD166",
          cream: "#FFF8F5",
          charcoal: "#2D2D2D",
        },
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #FF4FA3 0%, #FF73B5 35%, #FFA5D1 70%, #FFE1EF 100%)",
        "dark-gradient":
          "linear-gradient(135deg, #7A1E5D 0%, #9B2E7A 35%, #B84A96 70%, #D470B2 100%)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
