/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vedata: {
          bg: '#EDF2F6',
          white: '#FFFFFF',
          text: '#1E293B',
          accent: '#B3DDF2',
          primary: '#FF82B2',
          secondary: '#6EE7B7',
          success: '#10B981',
          warning: '#FBBF24',
          hover: '#F472A6',
          status: {
            todo: '#D6E4FF',
            progress: '#FFF3C4',
            done: '#DCFCE7'
          }
        }
      }
    },
  },
  plugins: [],
}
