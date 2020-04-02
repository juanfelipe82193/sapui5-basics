Feature: Show different configurations of the Tile

  Background:
    Given I start my app

  Scenario: Modify the Tile
    When on the Nav Container: I press the Tile
    Then on the Nav Container: I should see the Tile playground

    When on the Tile playground: I turn on the visible switch
    Then on the Tile playground: I should see the Tile
    When on the Tile playground: I turn on the long switch
    Then on the Tile playground: I should see the long Tile
    When on the Tile playground: I select a target
    When on the Tile playground: I turn on the Tile action mode active switch
    When on the Tile playground: I turn on the show Tile view switch
    When on the Tile playground: I turn on the show pin button switch
    When on the Tile playground: I turn on the press action switch
    When on the Tile playground: I turn on the delete action switch
    Then on the Tile playground: I should see the Tile with given configurations

    When on the Tile playground: I press the Tile
    Then on the Tile playground: I should see the Message Toast
    When on the Tile playground: I press the delete icon
    Then on the Tile playground: I should see the Message Toast

  Then I teardown my app
