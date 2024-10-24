/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        karma: ['Karma', 'sans-serif'],
        ks : ['Kaushan Script','cursive']
      },
    },
  },
  plugins: [],
}

