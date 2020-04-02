sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/AggregationFilled",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/actions/Press",
    "./Common"
], function (Opa5, AggregationFilled, Properties, Press, Common) {
    "use strict";

    Opa5.createPageObjects({
        onTheTilePlayground: {
            baseClass: Common,
            actions: {
                iTurnOnTheVisibleSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Visible");
                },
                iTurnOnTheLongSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Long");
                },
                iSelectATarget: function () {
                    return this.iSelectAnItemInASelectControl("target-select", "pl-item");
                },
                iTurnOnTheTileActionModeActiveSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Tile Action Mode Active");
                },
                iTurnOnTheShowTileViewSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Show Tile View");
                },
                iTurnOnTheShowPinButtonSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Show Pin Button");
                },
                iTurnOnThePressActionSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Press Action");
                },
                iTurnOnTheDeleteActionSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Delete Action");
                },
                iPressTheTile: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Tile",
                        matchers: [new Properties({
                            visible: true,
                            long: true
                        })],
                        actions: new Press(),
                        errorMessage: "The tile was not found."
                    });
                },
                iPressTheDeleteIcon: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Tile",
                        matchers: [new Properties({
                            visible: true,
                            long: true
                        })],
                        actions: function (oControl) {
                            oControl.fireDeletePress();
                        },
                        errorMessage: "The tile was not found."
                    });
                }
            },
            assertions: {
                iShouldSeeTheTile: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Tile",
                        matchers: new Properties({
                            visible: true
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The tile was found.");
                        },
                        errorMessage: "The tile was not found."
                    });
                },
                iShouldSeeTheLongTile: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Tile",
                        matchers: new Properties({
                            visible: true,
                            Long: true
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The long tile was found.");
                        },
                        errorMessage: "The long tile was not found."
                    });
                },
                iCanOpenTheTargePage: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Tile",
                        matchers: new Properties({
                            visible: true,
                            long: true,
                            target: "PlaygroundHomepage.html"

                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The long tile was found.");
                        },
                        errorMessage: "The long tile was not found."
                    });
                },
                iShouldSeeTheTileWithGivenConfigurations: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Tile",
                        matchers: [new Properties({
                                visible: true,
                                long: true,
                                target: "PlaygroundHomepage.html",
                                rgba: "rgba(153, 204, 255, 0.3)",
                                tileActionModeActive: true
                            }),
                            new AggregationFilled({
                                name: "tileViews"
                            }),
                            new AggregationFilled({
                                name: "pinButton"
                            })
                        ],
                        success: function () {
                            Opa5.assert.ok(true, "The tile was found.");
                        },
                        errorMessage: "The tile was not found."
                    });
                },
                iShouldSeeTheMessageToast: function () {
                    return this.iShouldSeeAMessageToast();
                }
            }
        }
    });
});