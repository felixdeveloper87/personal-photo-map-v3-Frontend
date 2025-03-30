describe('Login Flow - Invalid Credentials', () => {
    it('should display an error when logging in with invalid credentials', () => {
      cy.visit('https://personal-photo-map-v3-frontend.vercel.app/login')
  
      cy.get('input[placeholder="Enter your email"]').type('user@invalid.com')
      cy.get('input[placeholder="Enter your password"]').type('wrongpassword')
  
      cy.get('button[type="submit"]').click()
  
      // Verifica se a mensagem de erro aparece
      cy.contains('Invalid credentials').should('exist')
    })
  })
  