/* global QUnit */
/* eslint no-warning-comments: 0 */
sap.ui.define([
	'sap/ui/thirdparty/sinon',
	'sap/base/util/deepEqual',
	'sap/ui/test/TestUtils',
	'sap/ui/model/odata/v4/ODataModel',
	'sap/fe/macros/ChartDelegate'
], function(sinon, deepEqual, TestUtils, ODataModel, ChartDelegate) {
	"use strict";

	// *********************************************************************************************
	QUnit.module("Chart Delegate Tests for an OData V4 Service", {
		before: function() {
			var sServiceUrl = "/fake/",
				sSourceBase = "sap/fe/macros/qunit/macros/chartMetadata",
				mFixture = {
					"$metadata" : {source : "metadata.xml"}
				};

			var oSandbox = sinon.sandbox.create();
			TestUtils.setupODataV4Server(oSandbox, mFixture, sSourceBase, sServiceUrl);

			this.oModel = new ODataModel({
				groupId: "$direct",
				operationMode: "Server",
				serviceUrl: TestUtils.proxy(sServiceUrl),
				synchronizationMode: "None"
			});

			return ChartDelegate.retrieveAllMetadata(this.oModel, '/BusinessPartners').then(function(mMetadata) {
				this.mMetadata = mMetadata;
				return true;
			}.bind(this));
		},
		after: function() {
			this.oModel.destroy();
			this.oModel = null;
		}
	});

	QUnit.test("General structure of metadata", function(assert) {
		assert.ok(this.mMetadata, "There is metadata");
		assert.ok(this.mMetadata.properties, "There are chart properties that correspond to the chart items");
		assert.ok(this.mMetadata.attributes, "There are attributes of the entity type");
	});

	QUnit.test("Fetch Properties returns a parts", function(assert) {
		var done = assert.async();

		ChartDelegate.fetchProperties(this.oModel, "/BusinessPartners").then(function(aProperties) {
			var bDeepEqual = deepEqual(aProperties, this.mMetadata.properties);

			assert.equal(bDeepEqual, true, "FetchProperties returns a part of the metadata");
			done();
		}.bind(this));
	});

	QUnit.test("Properties and property count", function(assert) {
		var aAttributes = this.mMetadata.attributes;
		assert.equal(aAttributes.length, 9, "The business partner entity contains 9 properties");
		assert.equal(aAttributes[0].name, "Id", "The first property is the Id");
		assert.equal(aAttributes[0].inChart, false, "This Id property is not in the chart");

		assert.equal(aAttributes[1].name, "Name", "The first property is the Name");
		assert.equal(aAttributes[1].inChart, true, "This Name property is in the chart");

		assert.equal(aAttributes[2].name, "Country", "The next property is the Country");
		assert.equal(aAttributes[2].inChart, true, "This Country property is in the chart");

		assert.equal(aAttributes[3].name, "Region", "The next property is the Region");
		assert.equal(aAttributes[3].inChart, true, "This Region property is in the chart");

		assert.equal(aAttributes[4].name, "AccountResponsible", "The next property is the AccountResponsible");
		assert.equal(aAttributes[4].inChart, true, "This AccountResponsible property is in the chart");

		assert.equal(aAttributes[5].name, "SalesAmount", "The next property is the SalesAmount");
		assert.equal(aAttributes[5].inChart, true, "This SalesAmount property is in the chart");

		assert.equal(aAttributes[6].name, "Currency", "The next property is the Currency");
		assert.equal(aAttributes[6].inChart, true, "This Currency property is in the chart");

		assert.equal(aAttributes[7].name, "Info", "The eights property is the Info");
		assert.equal(aAttributes[7].inChart, false, "This Info property is not in the chart");

		assert.equal(aAttributes[8].name, "Friendliness", "The last property is friendliness");
		assert.equal(aAttributes[8].inChart, true, "Which is in the chart");
		assert.ok(aAttributes[8].criticality, "And has a ValueCriticality annotation");
	});

	QUnit.test("Chart Items and item count", function(assert) {
		var aItems = this.mMetadata.properties;

		assert.equal(aItems.length, 15, "There are 14 items");
		var iCountCustom = 0;

		for (var i = 0; i < aItems.length; i++) {
			if (aItems[i].custom == true) {
				iCountCustom++;
			}
		}

		assert.equal(iCountCustom, 4, "There are 4 custom aggregates");
	});

	QUnit.test("Criticality type for a groupable item/property", function(assert) {
		var aItems = this.mMetadata.properties;

		//criticality of dimension friendliness
		var oItem = aItems[14];
		assert.equal(oItem.propertyPath, "Friendliness", "The last item corresponds to friendliness");
		assert.equal(oItem.kind, "Dimension", "It is a dimension");
		assert.ok(oItem.criticality, "The has the value criticality annotion");
		var oCriticality = {
			Positive: ["Polite"],
			Critical: ["Demanding"],
			Negative: ["Unpolite"]

		};
		assert.deepEqual(oItem.criticality, oCriticality, "with correct values");
	});

	QUnit.test("Labels of custom aggregates", function(assert) {
		var aItems = this.mMetadata.properties;

		//the first four items are custom aggregates
		var oItem = aItems[0];
		assert.equal(oItem.name, "Sales", "The first custom item is Sales");
		assert.equal(oItem.propertyPath, "Sales", "Its property path equals the name");
		assert.equal(oItem.kind, "Measure", "It is a measure");
		assert.equal(oItem.label, "The average sales amount", "Label is from metadata");

		oItem = aItems[1];
		assert.equal(oItem.name, "SalesAmountTotal", "The first custom item is SalesAmountTotal");
		assert.equal(oItem.propertyPath, "SalesAmountTotal", "Its property path equals the name");
		assert.equal(oItem.kind, "Measure", "It is a measure");
		assert.equal(oItem.label, "Custom Aggregate (SalesAmountTotal)", "There is no label in metadata thus a default label is filled");

		oItem = aItems[2];
		assert.equal(oItem.name, "SalesNumber", "The first custom item is SalesNumber");
		assert.equal(oItem.propertyPath, "SalesNumber", "Its property path equals the name");
		assert.equal(oItem.kind, "Measure", "It is a measure");
		assert.equal(oItem.label, "The sales number", "Label is from metadata");

		oItem = aItems[3];
		assert.equal(oItem.name, "NumberOfCustomers", "The first custom item is NumberOfCustomers");
		assert.equal(oItem.propertyPath, "NumberOfCustomers", "Its property path equals the name");
		assert.equal(oItem.kind, "Measure", "It is a measure");
		assert.equal(oItem.label, "Custom Aggregate (NumberOfCustomers)", "There is no label in metadata thus a default label is filled");

	});

	QUnit.test("Labels and Names of aggregated properties", function(assert) {
		var aAttributes = this.mMetadata.attributes;

		var oSalesAmount = aAttributes[5];
		assert.equal(oSalesAmount.name, "SalesAmount", "The next property is the SalesAmount");
		assert.equal(oSalesAmount.inChart, true, "This SalesAmount property is in the chart");
		assert.equal(oSalesAmount.chartItems.length, 4, "There are 4 items for the sales amount");

		var aItems = oSalesAmount.chartItems;

		//Supported aggregation methods are in order sum, min, max, average
		assert.equal(aItems[0].aggregationMethod, "sum");
		assert.equal(aItems[1].aggregationMethod, "min");
		assert.equal(aItems[2].aggregationMethod, "max");
		assert.equal(aItems[3].aggregationMethod, "average");

		//While min/max are Aggregated properties there label counts for the others
		//the label is generated
		assert.equal(aItems[0].label, oSalesAmount.label + " (sum)");
		//note minSalesMount has no label
		assert.equal(aItems[1].label, "Aggregatable property (minSalesMount)");
		assert.equal(aItems[2].label, "Maximum Sales Amount");
		assert.equal(aItems[3].label, oSalesAmount.label + " (average)");

		//While min/max are Aggregated properties there name counts for the others
		//the label is generated
		assert.equal(aItems[0].name, "sumSalesAmount");
		assert.equal(aItems[1].name, "minSalesMount");
		assert.equal(aItems[2].name, "maxSalesMount");
		assert.equal(aItems[3].name, "averageSalesAmount");
	});
});
