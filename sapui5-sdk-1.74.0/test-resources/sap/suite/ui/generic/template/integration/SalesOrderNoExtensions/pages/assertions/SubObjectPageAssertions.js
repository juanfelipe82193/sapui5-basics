/*** Object Page Assertions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals",
		"sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/utils/OpaResourceBundle",
		"sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/utils/OpaManifest",
		"sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/utils/OpaDataStore"
	],
	function (PropertyStrictEquals, OpaResourceBundle, OpaManifest, OpaDataStore) {

		return function (prefix, viewName, viewNamespace, entityType, entitySet) {

			return {
				thePageContextShouldBeCorrect: function () {
					return this.waitFor({
						id: prefix + "objectPage",
						success: function (oControl) {
							assert.equal(oControl.getBindingContext().getPath(), OpaDataStore.getData("navContextPath"), "The Sub Object Page has the correct context");
						},
						errorMessage: "The Sub Object Page does not have the correct context"
					});
				},
				iCheckForDeleteButtonInHeaderOfSubObjectPage: function () {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageHeader",
						autoWait: false,
						success: function (aControl) {
							var aActions = aControl[0].getActions();
							for (var i = 0; i < aActions.length; i++) {
								var sId = aActions[i].getId();
								if (sId.indexOf("delete") !== -1) {
									ok(true,"Delete button is present in the header of Sub Object Page");
								}
							}
						},
						errorMessage: "ObjectPageLayout could not be found"
					});
				}
			};
		};
	}
);
