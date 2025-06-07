describe('User Onboarding Flow', () => {
  beforeEach(() => {
    // Visit the onboarding page directly since we're bypassing authentication
    cy.visit('/onboarding/select-persona');
  });

  it('should allow user to select Startup Sam persona and redirect to dashboard', () => {
    // Find and click the Startup Sam card
    cy.contains('Startup Sam')
      .parent()
      .within(() => {
        cy.get('button').contains('Select').click();
      });

    // Assert URL change
    cy.url().should('include', '/dashboard/sam');

    // Assert welcome message
    cy.contains('Welcome, Startup Sam!').should('be.visible');
  });
});
