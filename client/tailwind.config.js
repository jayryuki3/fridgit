/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        fridgit: {
          bg: "#F7F9F4",
          surface: "#FFFFFF",
          surfaceAlt: "#F0F4EC",
          primary: "#3D7A5A",
          primaryLight: "#5FA37D",
          primaryPale: "#E8F3ED",
          accent: "#F4A24A",
          accentPale: "#FEF3E2",
          danger: "#E8604C",
          dangerPale: "#FDECEA",
          warning: "#F4A24A",
          text: "#1A2A1E",
          textMid: "#4A6352",
          textMuted: "#8AA898",
          border: "#E2EDE6",
        }
      },
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        serif: ["'DM Serif Display'", "serif"],
      }
    }
  },
  plugins: [],
}
