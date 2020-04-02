sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/AggregationLengthEquals",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "./Common"
], function (Opa5, AggregationLengthEquals, Press, Properties, Common) {
    "use strict";

    var fnPressButtonWithText = function (sText) {
        return this.waitFor({
            controlType: "sap.m.Button",
            matchers: new Properties({
                text: sText
            }),
            actions: new Press(),
            errorMessage: "No button with text: " + sText + " was found."
        });
    };

    var fnAggregationLengthEquals = function (sText, sNumber) {
        return this.waitFor({
            controlType: "sap.ushell.ui.shell.ShellNavigationMenu",
            matchers: new AggregationLengthEquals({
                name: sText,
                length: sNumber
            }),
            success: function () {
                Opa5.assert.ok(true, sNumber + sText + " was found.");
            },
            errorMessage: sText + " was not empty."
        });
    };

    Opa5.createPageObjects({
        onTheShellNavigationMenuPlayground: {
            baseClass: Common,
            actions: {
                iInputATitle: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter title ...", "Navigation Menu Title");
                },
                iTurnOnTheShowTitleSwitch: function () {
                    return this.iTurnOnTheSwitchWithId("showTitleSwitch");
                },
                iSelectAnIcon: function () {
                    return this.iSelectAnItemInASelectControl("navigation-menu-icon-select", "SNV-home-icon");
                },
                iInputListItemText: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter text ...", "List Item Text");
                },
                iSelectAListItemIcon: function () {
                    return this.iSelectAnItemInASelectControl("navigation-menu-item-select", "SNM-std-list-icon");
                },
                iPressTheAddItemButton: function () {
                    return fnPressButtonWithText.call(this, "Add Item");
                },
                iPressTheRemoveItemButton: function () {
                    return fnPressButtonWithText.call(this, "Remove Item");
                },
                iInputMiniTileHeaderText: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter mini-tile header ...", "Mini Tile Header");
                },
                iSelectAMiniTileIcon: function () {
                    return this.iSelectAnItemInASelectControl("navigation-menu-mini-tile-icon-select", "SNV-std-mt-icon");
                },
                iPressTheAddMiniTileButton: function () {
                    return fnPressButtonWithText.call(this, "Add Mini-Tile");
                },
                iPressTheRemoveMiniTileButton: function () {
                    return fnPressButtonWithText.call(this, "Remove Mini-Tile");
                }
            },

            assertions: {
                iShouldSeeTheTitle: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellNavigationMenu",
                        matchers: new Properties({
                            title: "Navigation Menu Title"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The shell navigation menu title was found.");
                        },
                        errorMessage: "The shell navigation menu title was not found."
                    });
                },
                iShouldSeeTheIcon: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellNavigationMenu",
                        matchers: new Properties({
                            icon: "sap-icon://home"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The shell navigation menu icon was found.");
                        },
                        errorMessage: "The shell navigation menu icon was not found."
                    });
                },
                iShouldSeeANavigationMenuItem: function () {
                    return fnAggregationLengthEquals.call(this, "items", 1);
                },
                iShouldSeeNoNavigationMenuItem: function () {
                    return fnAggregationLengthEquals.call(this, "items", 0);
                },
                iShouldSeeTheMiniTile: function () {
                    return fnAggregationLengthEquals.call(this, "miniTiles", 1);
                },
                iShouldSeeNoMiniTile: function () {
                    return fnAggregationLengthEquals.call(this, "miniTiles", 0);
                }
            }
        }
    });
});