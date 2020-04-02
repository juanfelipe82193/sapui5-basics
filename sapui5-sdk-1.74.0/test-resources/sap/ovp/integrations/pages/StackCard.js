/*global QUnit */
sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ovp/test/integrations/pages/Common",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/PropertyStrictEquals"
], function(Opa5, Common, AggregationLengthEquals, AggregationFilled, Properties, PropertyStrictEquals) {

	"use strict";

	Opa5.createPageObjects({
		onTheStackCard: {
			baseClass: Common,
			actions: {
				

			},

			assertions: {
				
				


			}
		}
	});
});