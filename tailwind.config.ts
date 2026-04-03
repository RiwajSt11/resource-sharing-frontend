/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        "18": "4.5rem",
        "86.5": "21.625rem",
        "69.5": "17.375rem",
      },
      zIndex: {
        "100": "100",
      },
      transitionDuration: {
        "600": "600ms",
      },
    },
  },
  safelist: ["opacity-0", "opacity-100", "scale-y-0", "scale-y-100"],
};
