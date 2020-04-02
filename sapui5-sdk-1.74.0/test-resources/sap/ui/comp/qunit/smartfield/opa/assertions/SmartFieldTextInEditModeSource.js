sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/test/matchers/Properties"
], function (Opa5, Ancestor, Properties) {
    "use strict";

    var ID_PREFIX = "__component0---app--",
        DEFAULT_FIELD_NAME = "DefaultField",
        //DEFAULT_FIELD = "idDefault",
        DEFAULT_FIELD_VALUE_HELP_DIALOG = ID_PREFIX + "idDefault-input-valueHelpDialog",
        DEFAULT_FIELD_VALUE_HELP_DIALOG_TABLE = ID_PREFIX + "idDefault-input-valueHelpDialog-table",

        NAVIGATION_PROPERTY_NAME = "NavigationPropertyField",
        //NAVIGATION_PROPERTY_FIELD = "idNavProp",
        NAVIGATION_PROPERTY_INPUT = ID_PREFIX + "idNavProp-input",
        NAVIGATION_PROPERTY_VALUE_HELP_DIALOG = ID_PREFIX + "idNavProp-input-valueHelpDialog",
        NAVIGATION_PROPERTY_VALUE_HELP_DIALOG_TABLE = ID_PREFIX + "idNavProp-input-valueHelpDialog-table",

        VALUE_LIST_NAME = "ValueListField",
        //VALUE_LIST_FIELD = "idValueList",
        VALUE_LIST_INPUT = ID_PREFIX + "idValueList-input",
        VALUE_LIST_VALUE_HELP_DIALOG = ID_PREFIX + "idValueList-input-valueHelpDialog",
        VALUE_LIST_VALUE_HELP_DIALOG_TABLE = ID_PREFIX + "idValueList-input-valueHelpDialog-table",

        VALUE_LIST_GUID_NAME = "ValueListGUIDField",
        VALUE_LIST_GUID_INPUT = ID_PREFIX + "idGuidValueList-input";

    function __createWaitForSeeValueHelpDialog(sId, sFieldName) {
        return {
            id: sId,
            autoWait: false,
            success: function () {
                Opa5.assert.ok(true, "The correct ValueHelp Dialog was shown for '" + sFieldName + "'");
            },
            errorMessage: "The ValueHelp Dialog was not shown for '" + sFieldName + "'"
        };
    }

    function __createWaitForSeeSuggestedValue(sInputId, sValue, sFieldName) {
        var sFieldValue = null;
        var oWaitForObject = {
            id: sInputId,
            success: function (oInput) {
                Opa5.getContext().control = oInput;
                this.iWaitForPromise(new Promise(function (resolve, reject) {
                    setTimeout(resolve, 300);
                }).then(function () {
                    sFieldValue = oInput.getValue();

                    Opa5.assert.strictEqual(
                        sFieldValue,
                        sValue,
                        "The suggested value for '" + sFieldName + "' is correct");
                }));
            },
            errorMessage: "The suggested value for '" + sFieldName + "' is NOT correct - '" + sFieldValue + "' but expected '" + sValue + "'"
        };
        return oWaitForObject;
    }

    function __createWaitForSeeError(sInputId, sExpectedErrorMessage, sFieldName) {
        return {
            id: sInputId,
            success: function (oInput) {
                Opa5.getContext().control = oInput;
                this.iWaitForPromise(new Promise(function (resolve, reject) {
                    setTimeout(resolve, 500);
                }).then(function () {
                    var sErrorMessage = oInput.getValueStateText();
                    var sValueState = oInput.getValueState();

                    Opa5.assert.strictEqual(
                        sErrorMessage,
                        sExpectedErrorMessage,
                        "The error message for '" + sFieldName + "' is correct");
                    Opa5.assert.strictEqual(
                        sValueState,
                        "Error",
                        "The valueState for '" + sFieldName + "' is correct");
                }));
            },
            errorMessage: "The '" + sFieldName + "' is not rendered"
        };
    }

    function __createWaitForNotSeeError(sInputId, sFieldName) {
        var sErrorMessage = null,
            sValueState = null;
        return {
            id: sInputId,
            success: function (oInput) {
                this.iWaitForPromise(new Promise(function (resolve, reject) {
                    setTimeout(resolve, 300);
                }).then(function () {
                    sErrorMessage = oInput.mProperties.valueStateText;
                    sValueState = oInput.mProperties.valueState;

                    Opa5.assert.strictEqual(sErrorMessage, "", "The error message for '" + sFieldName + "' is empty.");
                    Opa5.assert.strictEqual(sValueState, "None", "The valueStatus for '" + sFieldName + "' is 'None'.");
                }));
            },
            errorMessage: "The '" + sFieldName + "' is not rendered"
        };
    }

    function __createWaitForSeeValueHelpDialogValues(sIdTable, sCategoryKey, sFieldName) {
        return {
            id: sIdTable,
            success: function (oTable) {
                Opa5.getContext().control = oTable;
                return this.waitFor({
                    controlType: "sap.m.Text",
                    matchers: [
                        new Ancestor(oTable),
                        new Properties({
                            text: sCategoryKey
                        })
                    ],
                    success: function () {
                        Opa5.assert.ok(true, "The ValueHelp Dialog values for '" + sFieldName + "' were found");
                    }
                });
            },
            errorMessage: "The ValueHelp Dialog values were not shown for '" + sFieldName + "'"
        };
    }

    return {
        // Press ValueHelp Button Assertions
        iShouldSeeTheDefaultValueHelpDialog: function () {
            return this.waitFor(__createWaitForSeeValueHelpDialog(DEFAULT_FIELD_VALUE_HELP_DIALOG, DEFAULT_FIELD_NAME));
        },
        iShouldSeeTheNavigationPropertyValueHelpDialog: function () {
            return this.waitFor(__createWaitForSeeValueHelpDialog(NAVIGATION_PROPERTY_VALUE_HELP_DIALOG, NAVIGATION_PROPERTY_NAME));
        },
        iShouldSeeTheValueListValueHelpDialog: function () {
            return this.waitFor(__createWaitForSeeValueHelpDialog(VALUE_LIST_VALUE_HELP_DIALOG, VALUE_LIST_NAME));
        },
        // Pree ValueHelp Go Button Assertions
        iShouldSeeTheDefaultValueHelpDialogValue: function (sValue) {
            return this.waitFor(__createWaitForSeeValueHelpDialogValues(
                DEFAULT_FIELD_VALUE_HELP_DIALOG_TABLE,
                sValue,
                DEFAULT_FIELD_NAME
            ));
        },
        iShouldSeeTheNavigationPropertyValueHelpDialogValue: function (sValue) {
            return this.waitFor(__createWaitForSeeValueHelpDialogValues(
                NAVIGATION_PROPERTY_VALUE_HELP_DIALOG_TABLE,
                sValue,
                NAVIGATION_PROPERTY_NAME
            ));
        },
        iShouldSeeTheValueListValueHelpDialogValue: function (sValue) {
            return this.waitFor(__createWaitForSeeValueHelpDialogValues(
                VALUE_LIST_VALUE_HELP_DIALOG_TABLE,
                sValue,
                VALUE_LIST_NAME
            ));
        },
        // Enter Value assertions
        iShouldSeeASuggestedCategoryInTheNavigationPropertyField: function (sValue) {
            return this.waitFor(__createWaitForSeeSuggestedValue(
                NAVIGATION_PROPERTY_INPUT,
                sValue,
                NAVIGATION_PROPERTY_NAME
            ));
        },
        iShouldSeeASuggestedManufacturerInTheValueListField: function (sValue) {
            return this.waitFor(__createWaitForSeeSuggestedValue(
                VALUE_LIST_INPUT,
                sValue,
                VALUE_LIST_NAME
            ));
        },
        iShouldSeeAnErrorForTheNavigationPropertyField: function (sValue) {
            return this.waitFor(__createWaitForSeeError(
                NAVIGATION_PROPERTY_INPUT,
                sValue,
                NAVIGATION_PROPERTY_NAME
            ));
        },
        iShouldSeeAnErrorForTheValueListField: function (sValue) {
            return this.waitFor(__createWaitForSeeError(
                VALUE_LIST_INPUT,
                sValue,
                VALUE_LIST_NAME
            ));
        },
        iShouldSeeAnErrorForTheValueListGUIDField: function (sValue) {
            return this.waitFor(__createWaitForSeeError(
                VALUE_LIST_GUID_INPUT,
                sValue,
                VALUE_LIST_GUID_NAME
            ));
        },
        iShouldNotSeeAnErrorForTheNavigationPropertyField: function () {
            return this.waitFor(__createWaitForNotSeeError(NAVIGATION_PROPERTY_INPUT, NAVIGATION_PROPERTY_NAME));
        },
        iShouldNotSeeAnErrorForTheValueListField: function () {
            return this.waitFor(__createWaitForNotSeeError(VALUE_LIST_INPUT, VALUE_LIST_NAME));
        },
        iShouldNotSeeAnErrorForTheValueListGUIDField: function () {
            return this.waitFor(__createWaitForNotSeeError(VALUE_LIST_GUID_INPUT, VALUE_LIST_GUID_NAME));
        }
    };
});