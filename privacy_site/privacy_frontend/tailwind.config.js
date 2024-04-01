/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        gwColors: {
          "primary": "#033C5A",
          "primary-focus": "#033C5A",
          "secondary": "#AA9868",
          "accent": "#0190DB",
          "neutral": "#FFFFFF",
          "base-100": "#FFFFFF",
        },
      },
      {
        gwColorsInvert: {
          "primary": "#AA9868",
          "secondary": "#033C5A",
          "accent": "#0190DB",
          "base-100": "#FFFFFF",
          "neutral": "#FFFFFF",
        },
      },
      {
        tableButtons: {
          "primary": "#033C5A",
          "primary-focus": "#033C5A",
          "secondary": "#FFFFFF",
          "accent": "#0190DB",
          "neutral": "#FFFFFF",
          "base-100": "#FFFFFF",
        },
      },
    ],
  },
  plugins: [require("daisyui"), require('flowbite/plugin')],
}

