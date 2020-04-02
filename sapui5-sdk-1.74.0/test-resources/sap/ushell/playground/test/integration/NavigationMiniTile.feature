Feature: Show different configurations of the Navigation Mini Tile

  Background:
    Given I start my app

  Scenario: Modify the Navigation Mini Tile
    When on the Nav Container: I press the Navigation Mini Tile
    Then on the Nav Container: I should see the Navigation Mini Tile playground

    When on the Navigation Mini Tile playground: I input title text
    Then on the Navigation Mini Tile playground: I should see the text in both two tiles

    When on the Navigation Mini Tile playground: I input subtitle text
    Then on the Navigation Mini Tile playground: I should see the subtitle text in one tile

    When on the Navigation Mini Tile playground: I select an icon
    Then on the Navigation Mini Tile playground: I should see the icon

    When on the Navigation Mini Tile playground: I input intent
    Then on the Navigation Mini Tile playground: I should see the intent

  Then I teardown my app
