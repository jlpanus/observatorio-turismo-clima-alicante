import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        alicante: {
          blue: "#0877B9",
          deep: "#082F49",
          sky: "#EAF6FF",
          slate: "#334155",
          mist: "#F8FAFC",
          amber: "#B7791F",
          green: "#1F8A5B",
          red: "#B42318",
          violet: "#0877B9",
          lavender: "#65BFEA",
          ink: "#0F1020",
          muted: "#64748B",
          border: "#E5E7EB"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 16, 32, 0.08)",
        glow: "0 24px 70px rgba(8, 119, 185, 0.18)"
      }
    },
  },
  plugins: [],
};

export default config;
