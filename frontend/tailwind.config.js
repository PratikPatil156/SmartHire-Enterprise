/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Corporate Palette
        primary: {
          light: '#60a5fa',
          DEFAULT: '#1e40af', // Deep Blue
          dark: '#1e3a8a',
        },
        secondary: {
          DEFAULT: '#64748b', // Slate Gray
        },
        accent: {
          success: '#10b981', // Emerald (for High Scores)
          warning: '#f59e0b', // Amber (for Medium Scores)
          danger: '#ef4444',  // Red (for Low Scores/Missing Skills)
        },
        ai: {
          purple: '#8b5cf6',   // AI/Bot related components
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}