module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    './node_modules/flowbite-react/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [    
    require('flowbite/plugin'),
  ],
}