/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          void: '#05070E',
          dark: '#0A0E1A',
          surface: '#0F1629',
          card: '#131B32',
          border: '#1E293B',
          cyan: '#00F0FF',
          violet: '#A855F7',
          magenta: '#EC4899',
          emerald: '#00FFA3',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
        display: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 25px rgba(0, 240, 255, 0.4)',
        'neon-violet': '0 0 25px rgba(168, 85, 247, 0.4)',
        'neon-emerald': '0 0 25px rgba(0, 255, 163, 0.4)',
        'neon-strong': '0 0 35px rgba(0, 240, 255, 0.6), inset 0 0 15px rgba(0, 240, 255, 0.2)',
        'cyber-floating': '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 240, 255, 0.25)',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatDelayed: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.04)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        radarScan: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        laserSweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-delayed': 'floatDelayed 7s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'radar-scan': 'radarScan 8s linear infinite',
        'laser-sweep': 'laserSweep 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}
