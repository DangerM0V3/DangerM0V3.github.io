/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Share Tech Mono', 'monospace'],
        terminal: ['VT323', 'monospace'],
        special: ['Special Elite', 'monospace'],
      },
      colors: {
        'terminal-bg': '#0a0a1a',
        'terminal-text': '#00ff00',
        'terminal-dim': '#007700',
        'terminal-highlight': '#0f0',
        'terminal-error': '#ff3333',
        'terminal-warning': '#ffcc00',
        'terminal-border': '#007700',
        'terminal-hover': '#002200',
      },
      animation: {
        'blink': 'blink 0.8s infinite',
        'blink-slow': 'blink 1.5s infinite',
        'flicker': 'flicker 0.3s infinite alternate-reverse',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        flicker: {
          '0%': { opacity: '0.98' },
          '5%': { opacity: '0.97' },
          '10%': { opacity: '0.99' },
          '15%': { opacity: '0.98' },
          '20%': { opacity: '1' },
          '25%': { opacity: '0.99' },
          '30%': { opacity: '1' },
          '35%': { opacity: '0.98' },
          '40%': { opacity: '1' },
          '45%': { opacity: '0.99' },
          '50%': { opacity: '1' },
          '55%': { opacity: '0.98' },
          '60%': { opacity: '1' },
          '65%': { opacity: '0.99' },
          '70%': { opacity: '0.98' },
          '75%': { opacity: '0.99' },
          '80%': { opacity: '1' },
          '85%': { opacity: '0.99' },
          '90%': { opacity: '0.98' },
          '95%': { opacity: '0.99' },
          '100%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'terminal': 'inset 0 0 60px rgba(0, 255, 0, 0.1)',
        'terminal-hover': '0 0 10px rgba(0, 255, 0, 0.5)',
      },
    },
  },
  plugins: [],
}