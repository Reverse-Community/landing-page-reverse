import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: "#050509",
        surface: "#0b0d13",
        surface2: "#111521",
        ink: "#f3f6ff",
        muted: "#8c93a8",
        line: "rgba(255,255,255,0.10)",
        red: {
          reverse: "#ff3b3b"
        },
        blue: {
          reverse: "#2f7dff"
        }
      },
      boxShadow: {
        red: "0 0 42px rgba(255, 59, 59, 0.22)",
        blue: "0 0 42px rgba(47, 125, 255, 0.22)",
        soft: "0 24px 80px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "radial-red": "radial-gradient(circle at 20% 20%, rgba(255,59,59,.25), transparent 32rem)",
        "radial-blue": "radial-gradient(circle at 80% 10%, rgba(47,125,255,.24), transparent 30rem)"
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.9" }
        }
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
