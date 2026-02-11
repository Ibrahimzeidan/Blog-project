/**
 * PostCSS configuration for Tailwind CSS.
 *
 * Vite uses PostCSS under the hood to process your CSS. By configuring
 * Tailwind and Autoprefixer here you enable automatic generation of
 * utility classes and vendor prefixes.
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};