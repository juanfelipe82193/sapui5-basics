sap.ui.require(["sap/ui/test/Opa5",
                "STTA_MP/test/integration/pages/Common",
                "sap/ui/test/matchers/AggregationLengthEquals",
                "sap/ui/test/matchers/AggregationFilled",
                "sap/ui/test/matchers/PropertyStrictEquals",
                "sap/ui/test/actions/Press",
                "sap/ui/test/actions/EnterText"],
	function(Opa5, Common, 
				AggregationLengthEquals, AggregationFilled, PropertyStrictEquals, Press, EnterText) {
		"use strict";
		
		var VIEWNAME = "ListReport";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ListReport.view.";
		var PREFIX_ID = "STTA_MP::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_MP_Product--";
		
		var PRODUCT_ENTITY_TYPE = "STTA_PROD_MAN.STTA_C_MP_ProductType";
		var PRODUCT_ENTITY_SET = "STTA_C_MP_Product";
		//var oProductType = OpaModel.getEntityType(PRODUCT_ENTITY_TYPE);
		
		Opa5.createPageObjects({
			onTheListReportPage: {
				baseClass: Common,
				actions: {
					iClickTheGoButton: function() {
						return this.waitFor({
							controlType: "sap.m.Button",
							viewName: VIEWNAME,
							viewNamespace: VIEWNAMESPACE,
							matchers: [
						           new PropertyStrictEquals({
						        	   name: "text",
						        	   value: "Go"
						           }),
						           new PropertyStrictEquals({
						        	   name: "enabled",
						        	   value: true
						           })
							],
							actions: new Press(),
							errorMessage: "The 'Go' button is not rendered correctly"
						});
					}
				},
				
				assertions: {
					thePageShouldContainTheCorrectTitle: function() {
						return this.waitFor({
							controlType: "sap.m.semantic.FullscreenPage",
							matchers: new PropertyStrictEquals({
								name: "title",
								value: "Manage Products (Technical Application)" // application-defined title
							}),
							success: function() {
								Opa5.assert.ok(true, "The List Report title is correct");
							},
							errorMessage: "The List Report title is not correct"
						});
					}
				}
			}
		});
	}
);