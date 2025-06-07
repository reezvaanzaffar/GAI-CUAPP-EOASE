describe('Product Tracker Flow', () => {
  beforeEach(() => {
    // Visit the Startup Sam dashboard directly
    cy.visit('/dashboard/sam');
  });

  it('should allow adding a new product and checking its first item', () => {
    // Click the Add New Product button
    cy.contains('Add New Product').click();

    // Fill in the product name in the modal
    cy.get('input[placeholder*="product name"]').type('My Test Product');

    // Click the Add Product button in the modal
    cy.get('button').contains('Add Product').click();

    // Assert the new product appears in the list
    cy.contains('My Test Product').should('be.visible');

    // Find the first checklist item of the new product and click its checkbox
    cy.contains('My Test Product').parent().find('input[type="checkbox"]').first().click();

    // Assert the checkbox is checked
    cy.contains('My Test Product')
      .parent()
      .find('input[type="checkbox"]')
      .first()
      .should('be.checked');
  });
});
