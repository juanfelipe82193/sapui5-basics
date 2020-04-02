sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ushell/sample/OpaFLPSandbox/test/integration/pages/Common",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/PropertyStrictEquals"
], function (Opa5, Common, Press, AggregationLengthEquals, PropertyStrictEquals) {
	"use strict";

	var sViewName = "Master";

	Opa5.createPageObjects({
		onTheMasterPage: {
			baseClass: Common,
			actions: {
				iPressOnTheFirstObject: function () {
					return this.waitFor({
						controlType: "sap.m.ObjectListItem",
						viewName: sViewName,
						matchers: new PropertyStrictEquals({name: "title", value: "Object 1"}),
						actions: new Press()
					});
				}
			},

			assertions: {
				iShouldSeeTheList: function () {
					return this.waitFor({
						id: "list",
						viewName: sViewName,
						matchers: new AggregationLengthEquals({name: "items", length: 1}),
						success: function (oList) {
							Opa5.assert.ok(oList, "Found the object List");
						}
					});
				}
			}
		}
	});
});
