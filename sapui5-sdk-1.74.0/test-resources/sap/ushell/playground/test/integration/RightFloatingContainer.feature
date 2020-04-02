Feature: Show different configurations of the Right Floating Container

  Background:
    Given I start my app

  Scenario: Modify the Right Floating Container
    When on the Nav Container: I press the Right Floating Container
    Then on the Nav Container: I should see the Right Floating Container playground

    When on the Right Floating Container playground: I input a number for top
    When on the Right Floating Container playground: I input a number for right
    When on the Right Floating Container playground: I turn on the hide items after presentation switch
    When on the Right Floating Container playground: I turn on the enable bounce animations switch
    When on the Right Floating Container playground: I turn on the act as preview container switch
    When on the Right Floating Container playground: I input item description
    When on the Right Floating Container playground: I turn on the item hide show more button switch
    When on the Right Floating Container playground: I turn on the item truncate switch
    When on the Right Floating Container playground: I input item author name
    When on the Right Floating Container playground: I select item set author picture
    When on the Right Floating Container playground: I input item set date
    When on the Right Floating Container playground: I select item set priority
    When on the Right Floating Container playground: I input the item title
    When on the Right Floating Container playground: I press add item button

    Then on the Right Floating Container playground: I should see the item in the Right Floating Container

  Then I teardown my app
