sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ushell/sample/OpaFLPSandbox/test/integration/pages/Common",
	"sap/ui/test/matchers/AggregationLengthEquals"
], function (Opa5, Common, AggregationLengthEquals) {
	"use strict";

	var sViewName = "Detail";

	Opa5.createPageObjects({
		onTheDetailPage: {
			baseClass: Common,
			assertions: {
				iShouldSeeTheObjectLineItemsList: function () {
					return this.waitFor({
						id: "lineItemsList",
						viewName: sViewName,
						matchers: new AggregationLengthEquals({name: "items", length: 2}),
						success: function (oList) {
							Opa5.assert.ok(oList, "Found the line items list.");
						}
					});
				}
			}
		}
	});
});
