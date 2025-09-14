/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Make primary color the gold #FFC300
        'primary': {
          50: '#fffdf0',
          100: '#fffbe0',
          200: '#fff7c2',
          300: '#fff3a3',
          400: '#ffef85',
          500: '#ffeb66',
          600: '#ffe748',
          700: '#FFC300',
          800: '#e6af00',
          900: '#cc9b00',
          DEFAULT: '#FFC300',
        },
        // Keep company colors for custom styling
        'company-primary': '#02264f',
        'company-primary-light': '#1a3a6b',
        'company-primary-dark': '#011a3a',
        'company-secondary': '#FFC300',
        'company-secondary-light': '#ffd633',
        'company-secondary-dark': '#e6af00',
        'company-accent': '#f8f9fa',
        'company-text': '#2c3e50',
        'company-text-light': '#6c757d',
        // Add blue as secondary for cases where we need the dark blue
        'secondary': {
          50: '#f0f4f8',
          100: '#d9e6f2',
          200: '#b3cce5',
          300: '#8db3d8',
          400: '#6799cb',
          500: '#4180be',
          600: '#1b66b1',
          700: '#02264f',
          800: '#011a3a',
          900: '#010f25',
          DEFAULT: '#02264f',
        },
      },
    },
  },
  plugins: [],
};