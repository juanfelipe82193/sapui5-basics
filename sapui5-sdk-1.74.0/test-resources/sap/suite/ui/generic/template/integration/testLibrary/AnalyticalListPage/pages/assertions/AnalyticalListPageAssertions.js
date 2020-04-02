sap.ui.define([	"sap/ui/test/Opa5",
               	"sap/ui/base/Object",
               	"sap/ui/test/matchers/PropertyStrictEquals",
                "sap/ui/test/matchers/AggregationFilled",
                "sap/ui/test/actions/Press",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/Common" ],
	function(Opa5, BaseObject, PropertyStrictEquals, AggregationFilled, Press, ApplicationSettings, Common) {
		return function (sViewNameAnalyticalListPage, sViewNamespaceAnalyticalListPage, ALPAssertion) {
			return {

				/**
				* Check for the visibility of the result list
				*
				* @throws {Error} Throws an error if the Smart Table could not be found
				* @public
				*/
				theTableIsVisible: function() {
					return this.waitFor({
						controlType: "sap.ui.comp.smarttable.SmartTable",
						success: function() {
							Opa5.assert.ok(true, "The Table is shown correctly on the Analytical List Page");
						},
						errorMessage: "The Smart Table couldn´t be found on the Analytical List Page"
					});
				},

				/**
				* Check the number of items loaded in the AnalyticalListPage
				*
				* @param {int} iItems The number of items you expect to be loaded in the AnalyticalListPage
				* @throws {Error} Throws an error if the wrong number of items are loaded or if the table could not be found
				* @public
				*/
				//theResultListContainsTheCorrectNumberOfItems: function(iItems) {
					// Please change this function with respect to smarttable
					// var aMatchers = [
					// 	new AggregationFilled({
					// 		name: "items"
					// 	})
					// ];
					// var fnSuccess = function(oControl) {
					// 	var actualItems = oControl.getItems();
					// 	equal(actualItems.length, iItems, "All the " + iItems + " items are present in the result list");
					// };
					// return this.iWaitForResponsiveTableInAnalyticalListPage(aMatchers, fnSuccess);
				//},

				// AnalyticalListPage common assertion function
				// Please change this function with respect to smarttable
				//iWaitForTableInAnalyticalListPage: function(aMatchers, fnSuccess) {
					// var oAppParams = ApplicationSettings.getAppParameters();
					// return this.waitFor({
					// 	id: oAppParams.ALPPrefixID + "--responsiveTable",
					// 	viewName: sViewNameAnalyticalListPage,
					// 	viewNamespace: sViewNamespaceAnalyticalListPage,
					// 	matchers: aMatchers,
					// 	success: fnSuccess,
					// 	errorMessage: "The Responsive Table is not rendered correctly"
					// });
				//},

				/**
				* Check a field within the responsive table for correct values.
				*
				* @param {object} oItem This object must be filled with the data needed to find the field in the table and
				* to compare the content against a given value
				* oItem.Line (int):		Line number of table containing the field to search for (0 based)
				* oItem.Field (string):	Field name
				* oItem.Value:			Expected value of field to be compared
				* Example: theResultListFieldHasTheCorrectValue({Line:1, Field:"GrossAmount", Value:"411.50"})
				* @throws {Error} Throws an error if responsive table could not be found or if the actual value in the table
				* is not equal to the expected field value
				* @public
				*/
				//theResultListFieldHasTheCorrectValue: function (oItem) {
					// please change this function with respect to smarttable
					// var oAppParams = ApplicationSettings.getAppParameters();
					// return this.waitFor({
					// 	id: oAppParams.ALPPrefixID + "--responsiveTable",
					// 	viewName: sViewNameAnalyticalListPage,
					// 	viewNamespace: sViewNamespaceAnalyticalListPage,
					// 	matchers: [
					// 		new AggregationFilled({
					// 			name: "items"
					// 		})
					// 	],
					// 	actions: function(oControl) {
					// 		var aTableItems = oControl.getItems();
					// 		var nValue = aTableItems[oItem.Line].getBindingContext().getProperty(oItem.Field);
					// 		equal(nValue, oItem.Value, "Checking field " + oItem.Field + " with value " + nValue);
					// 	},
					// 	errorMessage: "The Smart Table is not rendered correctly"
					// });
				//},
				/**
				 * Check if currently a dialog (sap.m.Dialog) is visible.
				 *
				 * @param {String} sTitle The displayed header title of the dialog to be checked.
				 * @throws {Error} Throws an error if the dialog is not shown
				 * @public
				 **/
				iShouldSeeTheDialogWithTitle: function(sTitle) {
					return this.iSeeTheDialogWithTitle(sTitle);
				},

				/**
				* Check if currently a button (sap.m.button) is visible.
				*
				* @param {String} sId The id of the button as listed in the DOM. You have to pass the most right part after the "--" only.
				* @throws {Error} Throws an error if the button is not shown
				* @public
				**/
				iShouldSeeTheButtonWithId: function(sId) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = oAppParams.ALPPrefixID + "--" + sId;
					return this.waitFor({
				 		id: sIntId,
				 		success: function (oButton) {
				 			Opa5.assert.ok(true, "The button with id" + sId + "is present");
				 		},
				 		errorMessage: "The button with id" + sId + "is not present"
				 	});

				},

				/**
				* Check if currently a button having a specific icon is visible.
				*
				* @param {String} sIcon The icon-id of the button as listed in the DOM.
				* @throws {Error} Throws an error if the button is not shown
				* @public
				**/
				iShouldSeeTheButtonWithIcon: function(sIcon) {
					return this.iSeeTheButtonWithIcon(sIcon);
				},

				/**
				* Check if currently a button is enabled or disabled
				*
				* @param {String} sName The name of the button
				* @param {String} bEnabled Whether button is enabled or disabled
				* @throws {Error} Throws an error if the button is not 'bEnabled'
				* @public
				**/
				checkButtonEnablement: function(sId, bEnabled) {
					return this.waitFor({
						id: sId,
						visible: !!bEnabled,
						matchers: [
							new sap.ui.test.matchers.PropertyStrictEquals({
								name: "enabled",
								value: !!bEnabled
							})
						],
						check: function(oButton) {
							if (oButton) {
								return true;
							}
							return false;
						},
						success: function(mButtons) {
							Opa5.assert.ok("Button is " + (bEnabled ? "enabled" : "disabled"));
						},
						errorMessage: "Button is " + (bEnabled ? "enabled" : "disabled")
					});
				}

			};
		};
	}
);
