/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        khoj: {
          blue: '#1d4ed8', // approximation based on sky blue gradient
          green: '#16a34a', // approximation based on emerald/green gradient
          lightBlue: '#e0f2fe',
          lightGreen: '#dcfce7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
