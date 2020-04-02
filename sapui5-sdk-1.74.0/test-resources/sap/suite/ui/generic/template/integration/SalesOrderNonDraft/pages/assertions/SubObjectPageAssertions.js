/*** Sub Object Page assertions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/matchers/AggregationFilled"],

	function (PropertyStrictEquals, AggregationFilled) {

	return function (prefix, viewName, viewNamespace) {

		return {
			/************************************************
			 NAVIGATION ASSERTIONS
			 *************************************************/
			thePageShouldContainTheCorrectTitle: function(sTitle) {
				//oManifestJSONModel = OpaManifest.demokit["sample.stta.sales.order.nd"];
				return this.waitFor({
					id: prefix + "objectTypeName",
					matchers: new PropertyStrictEquals({
						name: "text",
//						value: entityType["com.sap.vocabularies.UI.v1.HeaderInfo"].TypeName.String
						value: sTitle
					}),
					success: function() {
						ok(true, "The Sub-Object Page Title is correct");
					},
					errorMessage: "The Sub-Object Page Title is not rendered correctly"
				});
			},
			
			theHeaderActionButtOnSubObjectPageIsPresent: function (sButtonText) {
				return this.waitFor({
					controlType: "sap.uxap.ObjectPageHeader",
					autoWait: false,
					success: function (aControl) {
						var aActions = aControl[0].getActions();
						for (var i = 0; i < aActions.length; i++) {
							var sId = aActions[i].getId();
							if (sId.indexOf(sButtonText) !== -1) {
								ok(true,""+ sButtonText +" Delete button is present in the header of Sub Object Page");
							}
						}
					},
					errorMessage: ""+ sButtonText +" Delete button is not present in the header of Sub Object Page"
				});
			},
			
			thePageShouldBeInEditMode: function() {
				return this.waitFor({
					controlType: "sap.uxap.ObjectPageLayout",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers:[
						function(oControl) {
							return (oControl.getModel("ui").getData().editable);
						}],
					success: function() {
						ok(true, "The Sub Object Page is in Edit mode");
					},
					errorMessage: "The Sub Object Page is not rendered"
				});
			}
		}
	};
});
