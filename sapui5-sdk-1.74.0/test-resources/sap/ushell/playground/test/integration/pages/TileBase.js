sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/actions/Press",
    "./Common"
], function (Opa5, Properties, Press, Common) {
    "use strict";

    Opa5.createPageObjects({
        onTheTileBasePlayground: {
            baseClass: Common,
            actions: {
                iSelectAnIcon: function () {
                    return this.iSelectAnItemInASelectControl("tile-base-icon-select", "world-item");
                },
                iInputATitle: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter tile base title ...", "Tile Base Title");
                },
                iInputASubtitle: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter tile base subtitle ...", "Tile Base Subtitle");
                },
                iInputTileBaseInfo: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter tile base info ...", "Tile Base Info");
                },
                iInputHighlightTerms: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter highlight terms ...", "Highlight terms");
                },
                iTurnOnThePressActionSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Press Action");
                },
                iPressTheTileBase: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.tile.TileBase",
                        matchers: [new Properties({
                            title: "Tile Base Title",
                            subtitle: "Tile Base Subtitle",
                            icon: "sap-icon://world",
                            info: "Tile Base Info",
                            highlightTerms: "Highlight terms"
                        })],
                        actions: new Press(),
                        errorMessage: "The tile base was not found."
                    });
                }
            },
            assertions: {
                iShouldSeeTheTileBaseWithTheGivenConfigurations: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.tile.TileBase",
                        matchers: [new Properties({
                            title: "Tile Base Title",
                            subtitle: "Tile Base Subtitle",
                            icon: "sap-icon://world",
                            info: "Tile Base Info",
                            highlightTerms: "Highlight terms"
                        })],
                        success: function () {
                            Opa5.assert.ok(true, "The tile base with given configuration was found.");
                        },
                        errorMessage: "The tile base with given configuration was not found."
                    });
                },
                iShouldSeeTheMessageToast: function () {
                    return this.iShouldSeeAMessageToast();
                }
            }
        }
    });
});