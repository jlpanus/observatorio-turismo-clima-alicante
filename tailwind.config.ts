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
          blue: "#0B5CAD",
          deep: "#063B72",
          sky: "#DDF0FF",
          slate: "#334155",
          mist: "#F3F7FA",
          amber: "#B7791F",
          green: "#1F8A5B",
          red: "#B42318"
        }
      },
      boxShadow: {
        soft: "0 14px 40px rgba(15, 23, 42, 0.08)"
      }
    },
  },
  plugins: [],
};

export default config;
