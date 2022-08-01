describe('Home', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080')
    cy.wait(2000)
    cy.get('body').type('{enter}')
    cy.compareSnapshot('home-initial')
    cy.get('body').type('{enter}')
    cy.compareSnapshot('home-pressed')
    cy.get('body').type('{enter}')
    cy.compareSnapshot('home-restored')
  })
})
