export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F8FAFC',       // Very light gray/blue background for the app
          surface: '#FFFFFF',  // Pure white for the cards/tables
          border: '#E2E8F0',   // Light gray borders
          accent: '#0EA5E9',   // The vibrant "Medical SaaS" Blue
          accentHover: '#0284C7', // Darker blue for hover states
          textMain: '#0F172A', // Dark slate for primary text (readable)
          textMuted: '#64748B' // Gray for table headers and secondary text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
