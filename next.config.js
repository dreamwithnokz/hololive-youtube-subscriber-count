const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    mode: 'production',
    dest: 'public',
  }
})