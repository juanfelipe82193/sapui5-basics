Feature: Show different configurations of the Tool Area Item

  Background:
    Given I start my app

  Scenario: Modify the Tool Area Item
    When on the Nav Container: I press the Tool Area Item
    Then on the Nav Container: I should see the Tool Area Item playground
    When on the Tool Area Item playground: I select an icon
    When on the Tool Area Item playground: I input a Tool Area Item title
    When on the Tool Area Item playground: I turn on the expandable switch
    When on the Tool Area Item playground: I turn on the selected switch
    When on the Tool Area Item playground: I turn on the visible switch
    When on the Tool Area Item playground: I turn on the press action switch
    When on the Tool Area Item playground: I turn on the expand action switch
    Then on the Tool Area Item playground: I should see the Tool Area Item

    When on the Tool Area Item playground: I fire expand
    Then on the Tool Area Item playground: I should see the Message Toast

    When on the Tool Area Item playground: I press the Tool Area Item
    Then on the Tool Area Item playground: I should see the Message Toast

  Then I teardown my app
