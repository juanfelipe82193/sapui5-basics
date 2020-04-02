Feature: Show different configurations of the Tile Base

  Background:
    Given I start my app

  Scenario: Modify the Tile Base
    When on the Nav Container: I press the Tile Base
    Then on the Nav Container: I should see the Tile Base playground

    When on the Tile Base playground: I select an icon
    When on the Tile Base playground: I input a title
    When on the Tile Base playground: I input a subtitle
    When on the Tile Base playground: I input Tile Base info
    When on the Tile Base playground: I turn on the press action switch
    When on the Tile Base playground: I input highlight terms
    Then on the Tile Base playground: I should see the Tile Base with the given configurations

    When on the Tile Base playground: I press the Tile Base
    Then on the Tile Base playground: I should see the Message Toast

  Then I teardown my app
