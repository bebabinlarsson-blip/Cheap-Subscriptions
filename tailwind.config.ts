import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 30px rgba(34, 211, 238, 0.2)",
      },
      backgroundImage: {
        cyber:
          "radial-gradient(circle at top left, rgba(249, 115, 22, 0.18), transparent 28%), radial-gradient(circle at bottom right, rgba(34, 211, 238, 0.18), transparent 30%), radial-gradient(circle at center, rgba(168, 85, 247, 0.14), transparent 40%)",
      },
    },
  },
  plugins: [],
};
export default config;
