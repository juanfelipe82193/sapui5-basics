sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals",
		"sap/ui/test/matchers/AggregationFilled",
		"sap/ui/test/actions/Press"],
	function (PropertyStrictEquals, AggregationFilled, Press) {

		return function (prefix, viewName, viewNamespace) {

			return {
				iWaitForTheSubObjectPageToLoad: function () {
					var sId = "SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrderItem_WD_20";
					console.log ( "OPA5::SubObjectPageActions::iWaitForTheSubObjectPageToLoad" + " sId:" + sId );
					return this.waitFor({
						id: sId,
						matchers: function (oView) {
							var oComponentContainer = oView.getParent().getComponentContainer();
							var oAppComponent = oComponentContainer.getParent();
							return !oAppComponent.getBusy();
						},
						success: function () {
							console.log("Sub Object Page Loaded");
							return;
						},
						errorMessage: "Sub Object Page not loaded"
					});
				},
				iClickTheSubObjectPageDeleteButton: function () {
					return this.iClickAButtonInTheSubObjectPageHeaderActions(prefix + "delete", "Delete");
				},
				iClickAButtonInTheSubObjectPageHeaderActions: function (sId, sButtonText) {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageHeader",
						autoWait: false,
						success: function (aControl) {
							var aActions = aControl[0].getActions();
							for (var i = 0; i < aActions.length; i++) {
								if (aActions[i].getId() === sId) {
									aActions[i].firePress();
									return;
								}
							}
							//if not the correct action is found trigger an error
							notOk(true, "The " + sButtonText + "button could not be found");
						},
						errorMessage: "ObjectPageLayout could not be found"
					});
				},
				/* WAIT FOR DELETE DIALOG */
				iWaitForADialogAndPressTheConfirmationButton: function () {
					return this.waitFor({
						searchOpenDialogs: true,
						viewName: viewName,
						controlType: "sap.m.Button",
						viewNamespace: viewNamespace,
						matchers:  new PropertyStrictEquals({
							name: "text",
							value: "Delete"
						}),
						success: function (oDeleteConfirmationButton) {
							oDeleteConfirmationButton[0].firePress();
							return;
						},
						errorMessage: "Delete Dialog not rendered correctly"
					});
				}
			};
		};
	}
);
