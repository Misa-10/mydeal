/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#dbdef5",
        background: "#080a1c",
        primary: "#535fd0",
        secondary: "#0b0e28",
        accent: "#3745c8",
        fade: "rgba(255, 255, 255, 0.03)",
        disabledBackground: "#2c37a0",
        variant: {
          50: "#ebecfa",
          100: "#d7daf4",
          200: "#afb5e9",
          300: "#8790de",
          400: "#5f6ad3",
          500: "#3745c8",
          600: "#2c37a0",
          700: "#212a78",
          800: "#161c50",
          900: "#0b0e28",
          950: "#050714",
        },
      },
    },
    height: {
      he1: "90.3vh",
    },
  },
  plugins: [require("tailwindcss-animated")],
};
