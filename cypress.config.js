// cypress.config.js
module.exports = {
    e2e: {
      baseUrl: 'http://localhost:3000',
      supportFile: false,
      specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
      defaultCommandTimeout: 70000, 
      pageLoadTimeout: 200000, 
    },
  };
  