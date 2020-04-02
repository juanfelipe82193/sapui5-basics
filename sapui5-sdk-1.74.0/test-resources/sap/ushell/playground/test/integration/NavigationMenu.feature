Feature: Show different configurations of the Shell Navigation Menu

  Background:
    Given I start my app

  Scenario: Modify the Shell Navigation Menu
    When on the Nav Container: I press the Shell Navigation Menu
    Then on the Nav Container: I should see the Shell Navigation Menu playground

    When on the Shell Navigation Menu playground: I input a title
    When on the Shell Navigation Menu playground: I turn on the show title switch
    Then on the Shell Navigation Menu playground: I should see the title

    When on the Shell Navigation Menu playground: I select an icon
    Then on the Shell Navigation Menu playground: I should see the icon

    When on the Shell Navigation Menu playground: I input list item text
    When on the Shell Navigation Menu playground: I select a list item icon
    When on the Shell Navigation Menu playground: I press the add item button
    Then on the Shell Navigation Menu playground: I should see a Navigation Menu item

    When on the Shell Navigation Menu playground: I press the remove item button
    Then on the Shell Navigation Menu playground: I should see no Navigation Menu item

    When on the Shell Navigation Menu playground: I input Mini Tile header text
    When on the Shell Navigation Menu playground: I select a Mini Tile icon
    When on the Shell Navigation Menu playground: I press the add Mini Tile button
    Then on the Shell Navigation Menu playground: I should see the Mini Tile

    When on the Shell Navigation Menu playground: I press the remove Mini Tile button
    Then on the Shell Navigation Menu playground: I should see no Mini Tile

  Then I teardown my app
