// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "jquery.sap.global",
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/LabelFor",
    "sap/ui/test/actions/Press"
], function ($, Opa5, Properties, EnterText, LabelFor, Press) {
    "use strict";

    return Opa5.extend("ControlPlaygrounds.test.integration.pages.Common", {

        iSelectAnItemInASelectControl: function (sControlId, sItemId) {
            return this.waitFor({
                id: sControlId,
                actions: new Press(),
                success: function () {
                    this.waitFor({
                        id: sItemId,
                        actions: new Press(),
                        errorMessage: "No item with id " + sItemId + " in the control with id " + sControlId + " was found."
                    });
                }
            });
        },
        iShouldSeeAMessageToast: function () {
            return this.waitFor({
                autoWait: false,
                check: function () {
                    return $(".sapMMessageToast");
                },
                success: function () {
                    Opa5.assert.ok(true, "The message toast was found");
                },
                errorMessage: "The message toast was not found."
            });
        },

        iTurnOnTheSwitchWithLabelFor: function (sText) {
            return this.waitFor({
                controlType: "sap.m.Switch",
                matchers: new LabelFor({
                    text: sText
                }),
                actions: new Press(),
                errorMessage: "No switch for " + sText + " was found."
            });
        },

        iTurnOnTheSwitchWithId: function (sId) {
            return this.waitFor({
                id: sId,
                actions: new Press(),
                errorMessage: "No switch with id " + sId + " was found."
            });
        },
        iPressTheButtonWithLabelFor: function (sText) {
            return this.waitFor({
                controlType: "sap.m.Button",
                matchers: new LabelFor({
                    text: sText
                }),
                actions: new Press(),
                errorMessage: "No button for " + sText + "was found."
            });
        },
        iPressTheButtonWithId: function (sId) {
            return this.waitFor({
                id: sId,
                controlType: "sap.m.Button",
                actions: new Press(),
                errorMessage: "No button for " + sId + " was found."
            });
        },
        iEnterTextInTheInputFieldWithPlaceholder: function (sPlaceholder, sText) {
            return this.waitFor({
                controlType: "sap.m.Input",
                matchers: new Properties({
                    placeholder: sPlaceholder
                }),
                actions: [new EnterText({
                    text: sText
                }), function (oInput) {
                    oInput.fireSubmit();
                }],
                errorMessage: "No input field for shell title was found."
            });
        },
        iEnterTextInTheInputFieldWithId: function (sId, sText) {
            return this.waitFor({
                controlType: "sap.m.Input",
                id: sId,
                actions: [new EnterText({
                    text: sText
                }), function (oInput) {
                    oInput.fireSubmit();
                }],
                errorMessage: "No input field for id " + sId + " was found."
            });
        },
        iSelectAValueInTheSelectWithId: function (sId, sValue) {
            return this.waitFor({
                controlType: "sap.m.Select",
                id: sId,
                actions: function (oSelect) {
                    oSelect.setSelectedKey(sValue);
                },
                errorMessage: "No select for id " + sId + " was found."
            });
        }
    });
});