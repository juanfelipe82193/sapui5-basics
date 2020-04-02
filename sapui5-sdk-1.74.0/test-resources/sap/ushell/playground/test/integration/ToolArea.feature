Feature: Show different configurations of the Tool Area

  Background:
    Given I start my app

  Scenario: Modify the Tool Area
    When on the Nav Container: I press the Tool Area
    Then on the Nav Container: I should see the Tool Area playground

    When on the Tool Area playground: I press the Tool Area item add button
    When on the Tool Area playground: I press the Tool Area item add button
    Then on the Tool Area playground: I should see two Tool Area item

    When on the Tool Area playground: I press the Tool Area item remove button
    Then on the Tool Area playground: I should see one Tool Area item

  Then I teardown my app
