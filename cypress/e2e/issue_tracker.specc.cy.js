/// <reference types="cypress" />

describe('Issue Tracker Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should add a new user', () => {
    cy.visit('/add-user');

    cy.get('input[placeholder="Name"]').type('John Doe');
    cy.get('input[placeholder="Email"]').type('john.doe@example.com');
    cy.get('button[type="submit"]').click();

    cy.contains('User added successfully');
  });

  it('should display the users in the users list', () => {
    cy.visit('/users');
    cy.contains('John Doe');
    cy.contains('john.doe@example.com');
  });

  it('should create a new issue with status Closed', () => {
    cy.visit('/new-issue');

    cy.get('input[placeholder="Title"]').type('Test Issue');
    cy.get('.CodeMirror.cm-s-easymde.CodeMirror-wrap').then(editor => {
      const doc = editor[0].CodeMirror;
      doc.setValue('This is a test issue description');
    });
    cy.get('select').select('John Doe');
    cy.get('input[type="range"]').invoke('val', 2).trigger('change');

    cy.get('.flex.items-center.px-4.py-2.border.rounded-md').click();

    cy.contains('Closed').click();

    cy.get('button[type="submit"]').click();

    cy.contains('Issue created successfully');
  });

  it('should delete the created issue using the dropdown menu', () => {
  
    cy.visit('/');

    cy.contains('Test Issue').parent().find('button').click(); 
    cy.contains('Delete').click(); 

    cy.on('window:confirm', () => true);

  });

  it('should delete a user from the users list', () => {
    cy.visit('/users');
    cy.contains('John Doe').parent().find('button').click();
    cy.contains('User deleted successfully');
  });
});
