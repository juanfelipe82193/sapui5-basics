sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/actions/Press",
    "./Common"
], function (Opa5, Properties, Press, Common) {
    "use strict";

    Opa5.createPageObjects({
        onTheToolAreaItemPlayground: {
            baseClass: Common,
            actions: {
                iSelectAnIcon: function () {
                    return this.iSelectAnItemInASelectControl("tool-area-item-icon-select", "deleteItem");
                },
                iInputAToolAreaItemTitle: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter a Tool Area Item text ...", "Toole area item title");
                },
                iTurnOnTheExpandableSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Expandable");
                },
                iTurnOnThePressActionSwitch: function () {
                    return this.iTurnOnTheSwitchWithId("press-action");
                },
                iTurnOnTheExpandActionSwitch: function () {
                    return this.iTurnOnTheSwitchWithId("expand-action");
                },
                iTurnOnTheSelectedSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Selected");
                },
                iFireExpand: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ToolAreaItem",
                        matchers: new Properties({
                            visible: true,
                            expandable: true
                        }),
                        actions: function (oControl) {
                            oControl.fireExpand();
                        },
                        errorMessage: "The tool area item was not found."
                    });
                },
                iPressTheToolAreaItem: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ToolAreaItem",
                        matchers: new Properties({
                            visible: true,
                            expandable: true
                        }),
                        actions: new Press(),
                        errorMessage: "The tool area item was not found."
                    });
                },
                iTurnOnTheVisibleSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Visible");
                }
            },
            assertions: {
                iShouldSeeTheToolAreaItem: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ToolAreaItem",
                        matchers: new Properties({
                            icon: "sap-icon://delete",
                            text: "Toole area item title",
                            selected: true,
                            visible: true,
                            expandable: true
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The tool area item with configuation was found");
                        },
                        errorMessage: "The tool area item with configuation was not found."
                    });
                },
                iShouldSeeTheMessageToast: function () {
                    return this.iShouldSeeAMessageToast();
                }
            }
        }
    });
});