describe("Register Page Test", () => {
    beforeEach(() => {
      cy.visit("http://localhost:5173/register"); // Adjust the URL if needed
    });
  
    it("should display all input fields and buttons", () => {
      cy.get("[data-cy=email-input]").should("be.visible");
      cy.get("[data-cy=username-input]").should("be.visible");
      cy.get("[data-cy=phone-input]").should("be.visible");
      cy.get("[data-cy=password-input]").should("be.visible");
      cy.get("[data-cy=signup-button]").should("be.visible");
      cy.get("[data-cy=back-to-login]").should("be.visible");
    });
  
    it("should show an error if fields are empty", () => {
      cy.get("[data-cy=signup-button]").click();
      cy.contains("⚠️ Input fields cannot be empty!").should("be.visible");
    });
  
    it("should allow user to type in all fields", () => {
      cy.get("[data-cy=email-input]").type("test@example.com").should("have.value", "test@example.com");
      cy.get("[data-cy=username-input]").type("John Doe").should("have.value", "John Doe");
      cy.get("[data-cy=phone-input]").type("1234567890").should("have.value", "1234567890");
      cy.get("[data-cy=password-input]").type("password123").should("have.value", "password123");
    });
  
    // it("should register a user successfully", () => {
    //   cy.get("[data-cy=email-input]").type("test@example.com");
    //   cy.get("[data-cy=username-input]").type("John Doe");
    //   cy.get("[data-cy=phone-input]").type("1234567890");
    //   cy.get("[data-cy=password-input]").type("password123");
    //   cy.get("[data-cy=signup-button]").click();
  
    //   cy.contains("login").should("be.visible");
    // });
  
    it("should navigate back to login when clicking the button", () => {
      cy.get("[data-cy=back-to-login]").click();
      cy.url().should("include", "/login");
    });
  });
  