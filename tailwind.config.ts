import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1F3A5F",
          accent: "#2E75B6",
          light: "#D9E2EC",
        },
      },
    },
  },
  plugins: [],
};

export default config;
