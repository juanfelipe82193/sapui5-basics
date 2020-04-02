jQuery.sap.declare("sap.apf.tests.integration.withMockServer.helper");
(function() {
	if (!sap.apf.tests.integration.withMockServer.helper) {
		sap.apf.tests.integration.withMockServer.helper = {};
		var helper = sap.apf.tests.integration.withMockServer.helper;
		/**
		 * All the Common Actions which could be re-used across multiple Test cases go here.
		 * Individual Tests could extend their actions with these CommonActions.
		 * */
		helper.CommonActions = {
			iLookAtTheScreen : function() {
				return this;
			},
			iPressOnAddStepButton : function() {
				return this.waitFor({
					viewName : "carousel",
					check : function () {
						var jQuery = sap.ui.test.Opa5.getJQuery(); // Get jQuery of iFrame.
						var btnExists = jQuery(".addStepBtnHolder button").length;
						return btnExists;
					},
					success : function(aButtons) {
						var jQuery = sap.ui.test.Opa5.getJQuery(); // Get jQuery of iFrame.
						jQuery(".addStepBtnHolder button").trigger("tap");
					}
				});
			},
			iSelectAnItemFromSelectDialog : function(sName, sValue) {
				return this.waitFor({
					searchOpenDialogs : true,
					controlType : "sap.m.StandardListItem",
					matchers : [ new sap.ui.test.matchers.PropertyStrictEquals({
						name : sName,
						value : sValue
					}) ],
					success : function(aListItems) {
						var oListItem = aListItems[0];
						oListItem.$().trigger("tap");
					}
				});
			},
			iSelectAStepFromStepGallery : function(sCategoryTitle, sStepTitle, sRepTitle) {
				// Select the Category
				return this.iSelectAnItemFromSelectDialog("title", sCategoryTitle)
				// Select the Step
				.and.iSelectAnItemFromSelectDialog("title", sStepTitle)
				// Select the Representation
				.and.iSelectAnItemFromSelectDialog("title", sRepTitle);
			},
			iAddAStep : function(sCategoryTitle, sStepTitle, sRepTitle) {
				// Press on Add Step Button
				return this.iPressOnAddStepButton()
				// Select the step from step gallery
				.and.iSelectAStepFromStepGallery(sCategoryTitle, sStepTitle, sRepTitle);
			}
		};
	}
}());