Feature: Show different configurations of the Shell App Title

  Background:
    Given I start my app

  Scenario: Modify the Shell App Title
    When on the Nav Container: I press the Shell App Title
    Then on the Nav Container: I should see the Shell App Title playground

    When on the Shell App Title playground: I modify the Shell App Title text
    Then on the Shell App Title playground: I should see the modified Shell App Title text

    When on the Shell App Title playground: I turn on the Navigation Menu switch
    Then on the Shell App Title playground: I should see a drop down icon

    When on the Shell App Title playground: I press the Shell App Title
    Then on the Shell App Title playground: I should see a Navigation Menu

    When on the Shell App Title playground: I turn on the All My Apps view switch
    When on the Shell App Title playground: I press the Shell App Title
    Then on the Shell App Title playground: I should see the All My Apps view

  Then I teardown my app