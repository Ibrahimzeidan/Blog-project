/**
 * Tailwind CSS configuration
 * --------------------------
 * The content paths specify which files Tailwind should scan for class
 * names. If you add new directories or file extensions, remember to
 * update this array so your styles are generated correctly.
 */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};