sap.ui.define(["sap/ui/test/Opa5",
    "sap/ui/test/matchers/AggregationLengthEquals",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "./Common"
], function (Opa5, AggregationLengthEquals, Press, Properties, Common) {
    "use strict";

    Opa5.createPageObjects({
        onTheShellAppTitlePlayground: {
            baseClass: Common,
            actions: {
                iModifyTheShellAppTitleText: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter a shell app title ...", "this is the modified shell app title text");
                },
                iTurnOnTheNavigationMenuSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Shell App Title Navigation Menu");
                },
                iPressTheShellAppTitle: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellAppTitle",
                        matchers: new Properties({
                            text: "this is the modified shell app title text"
                        }),
                        actions: new Press(),
                        errorMessage: "No modified shell app title text was found."
                    });
                },
                iTurnOnTheAllMyAppsViewSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Shell App Title All My Apps View");
                }
            },
            assertions: {
                iShouldSeeTheModifiedShellAppTitleText: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellAppTitle",
                        matchers: new Properties({
                            text: "this is the modified shell app title text"
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The modified shell app title text was found.");
                        },
                        errorMessage: "The modified shell app title text  was not found."
                    });
                },
                iShouldSeeADropDownIcon: function () {
                    return this.waitFor({
                        success: function () {
                            Opa5.assert.ok(document.getElementsByTagName("span").title = "Shell App Title tooltip", "The icon was found.");
                        },
                        errorMessage: "The icon was not found."
                    });
                },
                iShouldSeeANavigationMenu: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellNavigationMenu",
                        matchers: new AggregationLengthEquals({
                            name: "items",
                            length: 2
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The shell navigation menu was found.");
                        },
                        errorMessage: "The shell navigation menu was not found."
                    });
                },
                iShouldSeeTheAllMyAppsView: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellAppTitle",
                        matchers: new AggregationLengthEquals({
                            name: "allMyApps",
                            length: 1
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The all my apps view was found.");
                        },
                        errorMessage: "The all my apps view was not found."
                    });
                }
            }
        }
    });
});