Feature: Show different configurations of the Shell Header

  Background:
    Given I start my app

  Scenario: Modify the Shell Header
    When on the Nav Container: I press the Shell Header
    Then on the Nav Container: I should see the Shell Header playground

    When on the Shell Header playground: I turn on the Shell Header switch
    When on the Shell Header playground: I turn on the logo switch
    When on the Shell Header playground: I select a logo
    Then on the Shell Header playground: I should see the logo

    When on the Shell Header playground: I press the Head Item add button
    Then on the Shell Header playground: I should see the Head Item

    When on the Shell Header playground: I press the Head Item remove button
    Then on the Shell Header playground: I should see no Head Item

    When on the Shell Header playground: I press the Head End Item add button
    Then on the Shell Header playground: I should see the Head End Item

    When on the Shell Header playground: I press the Head End Item remove button
    Then on the Shell Header playground: I should see no Head End Item

    When on the Shell Header playground: I input a Shell Title
    Then on the Shell Header playground: I should see the Shell Title

   When on the Shell Header playground: I input a Shell App Title
   Then on the Shell Header playground: I should see the Shell App Title

   Then I teardown my app
