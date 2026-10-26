/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#060608",
          900: "#0b0b0f",
          850: "#0f1016",
          800: "#141622"
        },
        gold: {
          50: "#fff8db",
          100: "#ffefb0",
          200: "#ffe27a",
          300: "#ffd24a",
          400: "#f0c02e",
          500: "#d4af37",
          600: "#b78d20",
          700: "#8d6a14",
          800: "#62470b",
          900: "#3c2c06"
        }
      },
      boxShadow: {
        glow: "0 0 24px rgba(212, 175, 55, .35)",
        glowStrong: "0 0 48px rgba(212, 175, 55, .55)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(80% 60% at 50% 0%, rgba(212,175,55,.20) 0%, rgba(212,175,55,.05) 30%, rgba(0,0,0,0) 70%)",
        noise:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E\")"
      }
    }
  },
  plugins: []
};

