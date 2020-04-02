sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/PropertyStrictEquals",
    "./Common"
], function (Opa5, PropertyStrictEquals, Common) {
    "use strict";

    Opa5.createPageObjects({
        onTheNavigationMiniTilePlayground: {
            baseClass: Common,
            actions: {
                iInputTitleText: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter title ...", "Related Apps");
                },
                iInputSubtitleText: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter subtitle ...", "Application view");
                },
                iSelectAnIcon: function () {
                    return this.iSelectAnItemInASelectControl("mini-tile-icon-select", "NMT-std-icon");
                },
                iInputIntent: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter intent ...", "Navigation Mini Title Intent");
                }
            },
            assertions: {
                iShouldSeeTheTextInBothTwoTiles: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.NavigationMiniTile",
                        matchers: new PropertyStrictEquals({
                            name: "title",
                            value: "Related Apps"
                        }),
                        success: function (oControl) {
                            Opa5.assert.equal(oControl.length, 2, "The navigation mini tiles were found.");
                        },
                        errorMessage: "The navigation mini tiles were found."
                    });
                },
                iShouldSeeTheSubtitleTextInOneTile: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.NavigationMiniTile",
                        matchers: new PropertyStrictEquals({
                            name: "subtitle",
                            value: "Application view"
                        }),
                        success: function (oControl) {
                            Opa5.assert.equal(oControl.length, 2, "The navigation mini tile with the subtitle was found.");
                        },
                        errorMessage: "The navigation mini tile with the subtitle was not found."
                    });
                },
                iShouldSeeTheIcon: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.NavigationMiniTile",
                        matchers: new PropertyStrictEquals({
                            name: "icon",
                            value: "sap-icon://documents"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The navigation mini tile with icon was found.");
                        },
                        errorMessage: "The navigation mini tile with icon was not found."
                    });
                },
                iShouldSeeTheIntent: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.NavigationMiniTile",
                        matchers: new PropertyStrictEquals({
                            name: "intent",
                            value: "Navigation Mini Title Intent"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The navigation mini tile with intent was found.");
                        },
                        errorMessage: "The navigation mini tile with intent was not found."
                    });
                }
            }
        }
    });
});