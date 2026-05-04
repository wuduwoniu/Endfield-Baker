/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { 50: '#eef2ff', 500: '#4f6bff', 600: '#3d54e0', 900: '#1e2a6a' },
        baker: {
          bg: '#0f1116',
          sidebar: '#0a0b10',
          panel: '#14171f',
          accent: '#2a6fdb',
        },
        bg: { base: '#0f1116', layer1: '#111318', layer2: '#1a1d24' },
        label: { primary: '#e8e8f0', secondary: '#9a9ab0', tertiary: '#6b6b80' },
        border: { l1: '#1e2030', l2: '#2a2c3a' },
        bubble: { 'user-bg': '#1a3a5c', 'user-text': '#e8e8f0', 'ai-bg': '#1a1d24', 'ai-text': '#e8e8f0' },
        input: { bg: '#1a1d24', 'dark-bg': '#1a1d24' },
      },
      borderRadius: { bubble: '16px', input: '10px', modal: '24px', capsule: '9999px' },
    },
  },
  plugins: [],
}
