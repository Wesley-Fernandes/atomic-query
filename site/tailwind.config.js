/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#030014',
        primary: '#9d4edd',
        secondary: '#3c096c',
        accent: '#00f2ff',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at 50% -20%, #240046 0%, #030014 70%)',
      },
    },
  },
  plugins: [],
};
