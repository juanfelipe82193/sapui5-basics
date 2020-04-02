sap.ui.define([
    "sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/Properties"
], function (Opa5, Press, EnterText, Ancestor, Properties) {
    "use strict";


    var ID_PREFIX = "__component0---app--",
        DEFAULT_FIELD_NAME = "DefaultField",
		//DEFAULT_FIELD = "idDefault",
		DEFAULT_FIELD_VALUE_HELP_BUTTON = ID_PREFIX + "idDefault-input-vhi",
		DEFAULT_FIELD_VALUE_HELP_DIALOG = ID_PREFIX + "idDefault-input-valueHelpDialog",
		DEFAULT_FIELD_VALUE_HELP_DIALOG_CANCEL_BUTTON = ID_PREFIX + "idDefault-input-valueHelpDialog-cancel",
		DEFAULT_FIELD_VALUE_HELP_DIALOG_GO_BUTTON = ID_PREFIX + "idDefault-input-valueHelpDialog-smartFilterBar-btnGo",
		DEFAULT_FIELD_VALUE_HELP_DIALOG_TABLE = ID_PREFIX + "idDefault-input-valueHelpDialog-table",

		NAVIGATION_PROPERTY_NAME = "NavigationPropertyField",
		//NAVIGATION_PROPERTY_FIELD = "idNavProp",
		NAVIGATION_PROPERTY_INPUT = ID_PREFIX + "idNavProp-input",
		NAVIGATION_PROPERTY_VALUE_HELP_BUTTON = ID_PREFIX + "idNavProp-input-vhi",
		NAVIGATION_PROPERTY_VALUE_HELP_DIALOG = ID_PREFIX + "idNavProp-input-valueHelpDialog",
		NAVIGATION_PROPERTY_VALUE_HELP_DIALOG_CANCEL_BUTTON = ID_PREFIX + "idNavProp-input-valueHelpDialog-cancel",
		NAVIGATION_PROPERTY_VALUE_HELP_DIALOG_GO_BUTTON = ID_PREFIX + "idNavProp-input-valueHelpDialog-smartFilterBar-btnGo",
		NAVIGATION_PROPERTY_VALUE_HELP_DIALOG_TABLE = ID_PREFIX + "idNavProp-input-valueHelpDialog-table",

		VALUE_LIST_NAME = "ValueListField",
		//VALUE_LIST_FIELD = "idValueList",
		VALUE_LIST_INPUT = ID_PREFIX + "idValueList-input",
		VALUE_LIST_VALUE_HELP_BUTTON = ID_PREFIX + "idValueList-input-vhi",
		VALUE_LIST_VALUE_HELP_DIALOG = ID_PREFIX + "idValueList-input-valueHelpDialog",
		VALUE_LIST_VALUE_HELP_DIALOG_CANCEL_BUTTON = ID_PREFIX + "idValueList-input-valueHelpDialog-cancel",
		VALUE_LIST_VALUE_HELP_DIALOG_GO_BUTTON = ID_PREFIX + "idValueList-input-valueHelpDialog-smartFilterBar-btnGo",
        VALUE_LIST_VALUE_HELP_DIALOG_TABLE = ID_PREFIX + "idValueList-input-valueHelpDialog-table",

        VALUE_LIST_GUID_NAME = "ValueListGUIDField",
        VALUE_LIST_GUID_INPUT = ID_PREFIX + "idGuidValueList-input";


	function __createWaitForPressValueHelpButton(sId, sFieldName) {
		return {
			id: sId,
			actions: new Press(),
			errorMessage: "the '" + sFieldName + "' ValueHelp-button was not rendered"
		};
	}

	function __createWaitForPressValueHelpDialogCancelButton(sIdValueHelpDialog, sIdCancelButton, sFieldName) {
		return {
			id: sIdValueHelpDialog,
			success: function (oValueHelpDialog) {
				Opa5.getContext().control = oValueHelpDialog;

				this.waitFor({
					id: sIdCancelButton,
					actions: new Press(),
					matchers: [
						new Ancestor(oValueHelpDialog)
					],
					errorMessage: "the '" + sFieldName + "' ValueHelp-cancel-button was not rendered"
				});
			},
			errorMessage: "the '" + sFieldName + "' ValueHelp-dialog was not rendered"
		};
	}

	function __createWaitForPressValueHelpDialogGoButton(sIdValueHelpDialog, sIdGoButton, sFieldName) {
		return {
			id: sIdValueHelpDialog,
			success: function (oValueHelpDialog) {
				Opa5.getContext().control = oValueHelpDialog;

				this.waitFor({
					id: sIdGoButton,
					actions: new Press(),
					matchers: [
						new Ancestor(oValueHelpDialog)
					],
					errorMessage: "the '" + sFieldName + "' ValueHelp-go-button was not rendered"
				});
			},
			errorMessage: "the '" + sFieldName + "' ValueHelp-dialog view was not rendered"
		};
	}

	function __createWaitForSelectFirstCategoryInValueHelpDialog(sIdTable, sCategoryKey, sFieldName) {
		return {
			id: sIdTable,
			success: function (oTable) {
				return this.waitFor({
					controlType: "sap.m.Text",
					matchers: [
						new Ancestor(oTable),
						new Properties({
							text: sCategoryKey
						})
					],
					action: new Press(),
					success: function () {
						Opa5.assert.ok(true, "the column list item in the valu help dialog was found");
					}
				});
			},
			errorMessage: "the 'CategoryTable' in the '" + sFieldName + "' ValueHelp-dialog was not rendered"
		};
    }

    function __createWaitForEnterValueInField(sId, sValue, sFieldName) {
		return {
			id: sId,
			actions: new EnterText({
				text: sValue
			}),
			errorMessage: "The '" + sFieldName + "' was not rendered"
		};
    }

    function __createWaitForRememberValue(sId, sFieldName) {
		return {
			id: sId,
			success: function (oField) {
				this.getContext().currentValue = oField.getValue();
			},
			errorMessage: "The '" + sFieldName + "' is not rendered"
		};
	}

    return {
        // Press ValueHelp Button
        iPressTheDefaultValueHelpButton: function () {
            return this.waitFor(__createWaitForPressValueHelpButton(
                DEFAULT_FIELD_VALUE_HELP_BUTTON,
                DEFAULT_FIELD_NAME));
        },
        iPressTheNavigationPropertyValueHelpButton: function () {
            return this.waitFor(__createWaitForPressValueHelpButton(
                NAVIGATION_PROPERTY_VALUE_HELP_BUTTON,
                NAVIGATION_PROPERTY_NAME));
        },
        iPressTheValueListValueHelpButton: function () {
            return this.waitFor(__createWaitForPressValueHelpButton(
                VALUE_LIST_VALUE_HELP_BUTTON,
                VALUE_LIST_NAME));
        },
        // Press ValueHelp-Dialog Cancel Button
        iPressTheDefaultValueHelpDialogCancelButton: function () {
            return this.waitFor(__createWaitForPressValueHelpDialogCancelButton(
                DEFAULT_FIELD_VALUE_HELP_DIALOG,
                DEFAULT_FIELD_VALUE_HELP_DIALOG_CANCEL_BUTTON,
                DEFAULT_FIELD_NAME));
        },
        iPressTheNavigationPropertyValueHelpDialogCancelButton: function () {
            return this.waitFor(__createWaitForPressValueHelpDialogCancelButton(
                NAVIGATION_PROPERTY_VALUE_HELP_DIALOG,
                NAVIGATION_PROPERTY_VALUE_HELP_DIALOG_CANCEL_BUTTON,
                NAVIGATION_PROPERTY_NAME));
        },
        iPressTheValueListValueHelpDialogCancelButton: function () {
            return this.waitFor(__createWaitForPressValueHelpDialogCancelButton(
                VALUE_LIST_VALUE_HELP_DIALOG,
                VALUE_LIST_VALUE_HELP_DIALOG_CANCEL_BUTTON,
                VALUE_LIST_NAME));
        },
        // Press ValueHelp-Dialog GO Button
        iPressTheDefaultValueHelpDialogGoButton: function () {
            return this.waitFor(__createWaitForPressValueHelpDialogGoButton(
                DEFAULT_FIELD_VALUE_HELP_DIALOG,
                DEFAULT_FIELD_VALUE_HELP_DIALOG_GO_BUTTON,
                DEFAULT_FIELD_NAME));
        },
        iPressTheNavigationPropertyValueHelpDialogGoButton: function () {
            return this.waitFor(__createWaitForPressValueHelpDialogGoButton(
                NAVIGATION_PROPERTY_VALUE_HELP_DIALOG,
                NAVIGATION_PROPERTY_VALUE_HELP_DIALOG_GO_BUTTON,
                NAVIGATION_PROPERTY_NAME));
        },
        iPressTheValueListValueHelpDialogGoButton: function () {
            return this.waitFor(__createWaitForPressValueHelpDialogGoButton(
                VALUE_LIST_VALUE_HELP_DIALOG,
                VALUE_LIST_VALUE_HELP_DIALOG_GO_BUTTON,
                VALUE_LIST_NAME));
        },
        // Select first Category in ValueHelp-Dialog
        iSelectTheFirstCategoryInTheDefaultValueHelpDialog: function () {
            return this.waitFor(__createWaitForSelectFirstCategoryInValueHelpDialog(
                DEFAULT_FIELD_VALUE_HELP_DIALOG_TABLE,
                "GC",
                DEFAULT_FIELD_NAME));
        },
        iSelectTheFirstCategoryInTheNavigationPropertyValueHelpDialog: function () {
            return this.waitFor(__createWaitForSelectFirstCategoryInValueHelpDialog(
                NAVIGATION_PROPERTY_VALUE_HELP_DIALOG_TABLE,
                "GC",
                NAVIGATION_PROPERTY_NAME));
        },
        iSelectTheFirstCategoryInTheValueListValueHelpDialog: function () {
            return this.waitFor(__createWaitForSelectFirstCategoryInValueHelpDialog(
                VALUE_LIST_VALUE_HELP_DIALOG_TABLE,
                "GC",
                VALUE_LIST_NAME));
        },
        // Enter value in Field
        iEnterACategoryInTheNavigationPropertyField: function (sValue) {
            return this.waitFor(__createWaitForEnterValueInField(
                NAVIGATION_PROPERTY_INPUT,
                sValue,
                NAVIGATION_PROPERTY_NAME
            ));
        },
        iEnterAManufacturerInTheValueListField: function (sValue) {
            return this.waitFor(__createWaitForEnterValueInField(
                VALUE_LIST_INPUT,
                sValue,
                VALUE_LIST_NAME
            ));
        },
        iEnterACategoryInTheValueListGUIDField: function (sValue) {
            return this.waitFor(__createWaitForEnterValueInField(
                VALUE_LIST_GUID_INPUT,
                sValue,
                VALUE_LIST_GUID_NAME
            ));
        },
        // Remember value of field
        iRememberTheValueOfTheNavigationPropertyField: function () {
            return this.waitFor(__createWaitForRememberValue(NAVIGATION_PROPERTY_INPUT, NAVIGATION_PROPERTY_NAME));
        },
        iEnterTheRememberedValueInTheNavigationPropertyField: function () {
            return this.waitFor(__createWaitForEnterValueInField(
                NAVIGATION_PROPERTY_INPUT,
                this.getContext().currentValue,
                NAVIGATION_PROPERTY_NAME
            ));
        },
        iRememberTheValueOfTheValueListField: function () {
            return this.waitFor(__createWaitForRememberValue(VALUE_LIST_INPUT, VALUE_LIST_NAME));
        },
        iEnterTheRememberedValueInTheValueListField: function () {
            return this.waitFor(__createWaitForEnterValueInField(
                VALUE_LIST_INPUT,
                this.getContext().currentValue,
                VALUE_LIST_NAME
            ));
        }
    };
});