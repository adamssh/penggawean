/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        importantUrgent: '#ef4444', // red-500
        importantNotUrgent: '#3b82f6', // blue-500
        notImportantUrgent: '#f59e0b', // amber-500
        notImportantNotUrgent: '#71717a', // zinc-500
      }
    },
  },
  plugins: [],
}
