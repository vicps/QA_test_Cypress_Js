/// <reference types="cypress" />



describe('quicknote_test', () => {

  beforeEach(() => {
    // We want to visit once URL to be tested before each test, so
    // we include in our beforeEach hook the function "cy.visit", so that it runs before all the tests
    cy.visit('https://quicknote.io/mynotes', {'failOnStatusCode': false})

    //Cypress is not saving the notes included in each test execution, so we need to 
    //add new notes for every test case. That way, it's easier to add the note creation steps here in a hook

    cy.contains('New note').click()
  
    const newTitle = 'Test_QA_1'
    const newText = 'TestQA'

    //Adding the Title
    cy.get('input[placeholder="Title"]').type(`${newTitle}{enter}`)

    //Adding the text
    cy.get('trix-editor').should('have.attr', 'placeholder', 'Your note').type(`${newText}{enter}`)

    //Now, we need to click the publish button and wait a few seconds to reload the page
    cy.contains('Publish').click()
    cy.wait(3000)

    //To make sure the note was published, we need to find it in the "My notes" list 
    //This way, we need to go back to the main page
    cy.get('[data-hint="My notes"]').click()
    cy.wait(3000)
  })


  //ADDING NOTE TEST CASE
  it('can add new notes', () => {
    
    //Since we already added the steps to add a note in beforeEach hook, 
    //we can add a new note and assert that this new note is there, on the top of the list

    cy.contains('New note').click()

    const newTitle = 'Test_QA_2'
    const newText = 'TestQA_2'

    //Adding the Title
    cy.get('input[placeholder="Title"]').type(`${newTitle}{enter}`)

    //Adding the text
    cy.get('trix-editor').should('have.attr', 'placeholder', 'Your note').type(`${newText}{enter}`)

    //Now, we need to click the publish button and wait a few seconds to reload the page
    cy.contains('Publish').click()
    cy.wait(3000)

    //To make sure the note was published, we need to find it in the "My notes" list 
    //This way, we need to go back to the main page
    cy.get('[data-hint="My notes"]').click()
    cy.wait(3000)

    // Asserting that the note was included in the list
    //this should be the first item in the list
    cy.get('li')
      .first()
      .should('have.text', newTitle)
  })


  //EDITING TEST CASE
  it('can edit notes', () => {

     //first of all, we need to click in the note we want to edit
     cy.contains('Test_QA_1').click()
     //wait for 2 seconds, for the page to load
     cy.wait(2000)
 
     //now we need to click in the editing button, to enter in editing mode
     //the wait is needed since there's a delay between clicking and the page laoding
     cy.get('[data-hint="Edit this note"]').click()
     cy.wait(3000)
     
     const newTitle2 = '_EDITED'
     const newText2 = '- after editing'
 
     //Editing the Title
     cy.get('.title').type(`${newTitle2}{enter}`)
 
     //Editing the text
     cy.get('trix-editor').type(`${newText2}{enter}`)
     
     //Now, we need to click the publish button and wait a few seconds to reload the page
     cy.contains('Save').click()
     cy.wait(3000)
 
     //To make sure the note was published, we need to find it in the "My notes" list 
     //This way, we need to go back to the main page
     cy.get('[data-hint="My notes"]').click()
     cy.wait(2000)
 
     // Asserting that the note was included in the list
     //this should be the first item in the list
     cy.get('.mynotes.nolist').should('have.text', 'Test_QA_1_EDITED')

  })

  //DELETING  NOTE TEST CASE
  it('can delete a note', () => {
 
    //We should find the note in the list, and click in the icon beside the title
 
    cy.contains('Test_QA_1')
      .parent()
      .find('[data-hint="Remove note"]')
      .click()

    //a window will show up asking for confirmation before deleting the note
    //we should find the confirmation button to click it
    cy.on('window:confirm', () => true);

    //asserting that the note no longer exists
    cy.contains('TEST_QA_1_EDITED').should('not.exist')

  })
})