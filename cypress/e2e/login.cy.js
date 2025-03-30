describe('Login Flow', () => {
    it('should successfully log in with valid credentials', () => {
      cy.visit('https://personal-photo-map-v3-frontend.vercel.app/login')
  
      cy.get('input[placeholder="Enter your email"]').type('felixxavier8788@gmail.com')
      cy.get('input[placeholder="Enter your password"]').type('111222')      
  
      cy.get('button[type="submit"]').click()
  
      cy.contains('Welcome,').should('exist')
    })
  })
  