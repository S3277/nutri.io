/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fff5f2',
          100: '#fff0ea',
          200: '#ffd4c2',
          300: '#ffb599',
          400: '#ff9770',
          500: '#ff7a47',
          600: '#ff5722',
          700: '#f4511e',
          800: '#e64a19',
          900: '#d84315',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};