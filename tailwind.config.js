/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { 50: '#eef2ff', 500: '#4f6bff', 900: '#1e2a6a' },
        bg: { base: '#ffffff', layer1: '#f8f9fa', layer2: '#f0f1f3' },
        label: { primary: '#1a1a2e', secondary: '#666680', tertiary: '#999999' },
        border: { l1: '#e5e7eb', l2: '#d1d5db' },
        bubble: { 'user-bg': '#4f6bff', 'user-text': '#ffffff', 'ai-bg': '#f0f1f3', 'ai-text': '#1a1a2e' },
      },
      borderRadius: { bubble: '16px', input: '10px', modal: '24px', capsule: '9999px' },
    },
  },
  plugins: [],
}
