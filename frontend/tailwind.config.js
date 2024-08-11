/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
   ],
   theme: {
     extend: {
       backgroundImage: {
         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
         "gradient-conic":
           "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
       },
       colors: {
         "color1": "#FBF5F3",
         "color2": "#0C120C",
         "color3": "#343434",
         "color4": "#6D7275",
         "color5": "#AAAAAA",
         "color6": "#586F7C"
       },       
       keyframes: {
         spin: {
           '0%': { transform: 'rotate(0deg)' },
           '100%': { transform: 'rotate(360deg)' },
         },
       },
       animation: {
         spin: 'spin 1s linear infinite',
       },
     },
   },
   plugins: [],
 };
 