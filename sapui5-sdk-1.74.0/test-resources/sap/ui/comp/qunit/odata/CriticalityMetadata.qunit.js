/* global QUnit */
(function() {
	"use strict";

	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/comp/odata/CriticalityMetadata"

	], function(CriticalityMetadata){

		QUnit.module("sap.ui.comp.odata.CriticalityMetadata");

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(CriticalityMetadata);
		});

		QUnit.test("Shall return the proper UI5 ValueState based on CriticalityType/Int32 value", function(assert) {
			var sState = null;
			sState = CriticalityMetadata.getCriticalityState("com.sap.vocabularies.UI.v1.CriticalityType/Neutral");
			assert.strictEqual(sState, "None");
			sState = CriticalityMetadata.getCriticalityState("com.sap.vocabularies.UI.v1.CriticalityType/Negative");
			assert.strictEqual(sState, "Error");
			sState = CriticalityMetadata.getCriticalityState("com.sap.vocabularies.UI.v1.CriticalityType/Critical");
			assert.strictEqual(sState, "Warning");
			sState = CriticalityMetadata.getCriticalityState("com.sap.vocabularies.UI.v1.CriticalityType/Positive");
			assert.strictEqual(sState, "Success");

			sState = CriticalityMetadata.getCriticalityState(3);
			assert.strictEqual(sState, "Success");

			sState = CriticalityMetadata.getCriticalityState("foo");
			assert.strictEqual(sState, undefined);
		});

		QUnit.test("Shall return the proper UI5 Icon based on CriticalityType/Int32 value", function(assert) {
			var sIcon = null;

			sIcon = CriticalityMetadata.getCriticalityIcon("com.sap.vocabularies.UI.v1.CriticalityType/Neutral");
			assert.strictEqual(sIcon, "sap-icon://status-inactive");
			sIcon = CriticalityMetadata.getCriticalityIcon("com.sap.vocabularies.UI.v1.CriticalityType/Negative");
			assert.strictEqual(sIcon, "sap-icon://status-negative");
			sIcon = CriticalityMetadata.getCriticalityIcon("com.sap.vocabularies.UI.v1.CriticalityType/Critical");
			assert.strictEqual(sIcon, "sap-icon://status-critical");
			sIcon = CriticalityMetadata.getCriticalityIcon("com.sap.vocabularies.UI.v1.CriticalityType/Positive");
			assert.strictEqual(sIcon, "sap-icon://status-positive");

			sIcon = CriticalityMetadata.getCriticalityIcon(2);
			assert.strictEqual(sIcon, "sap-icon://status-critical");

			sIcon = CriticalityMetadata.getCriticalityIcon("foo");
			assert.strictEqual(sIcon, undefined);
		});

		QUnit.test("Shall return the whether icon should be visible based on CriticalityRepresentationType value", function(assert) {
			var bIcon = null;
			bIcon = CriticalityMetadata.getShowCriticalityIcon("com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithIcon");
			assert.strictEqual(bIcon, true);

			bIcon = CriticalityMetadata.getShowCriticalityIcon("com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon");
			assert.strictEqual(bIcon, false);

			bIcon = CriticalityMetadata.getShowCriticalityIcon(undefined);
			assert.strictEqual(bIcon, true);

			bIcon = CriticalityMetadata.getShowCriticalityIcon("foo");
			assert.strictEqual(bIcon, true);
		});

		QUnit.start();
	});

})();