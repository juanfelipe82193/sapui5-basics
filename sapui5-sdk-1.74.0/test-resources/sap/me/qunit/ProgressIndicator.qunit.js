/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/me/ProgressIndicator"
], function(QUnitUtils, createAndAppendDiv, ProgressIndicator) {
	"use strict";

	// prepare DOM
	createAndAppendDiv("uiArea1");
	createAndAppendDiv("uiArea2");
	createAndAppendDiv("uiArea3");
	createAndAppendDiv("uiArea4");
	createAndAppendDiv("uiArea5");
	createAndAppendDiv("uiArea6");
	createAndAppendDiv("uiArea7");


	var oProgInds = {};

	var initProgInd = function(idx, bVisible, bEnabled, xBarColor, sDispVal, iPercentVal, bShowVal, iWidth){			
		var sId = "oProgInd" + idx;
		var oProgInd = new ProgressIndicator(sId);
		if (bVisible != -1) {
			oProgInd.setVisible(bVisible);
		}
		if (bEnabled != -1) {
			oProgInd.setEnabled(bEnabled);
		}
		if (xBarColor != -1) {
			oProgInd.setBarColor(xBarColor);
		}
		if (sDispVal != -1) {
			oProgInd.setDisplayValue(sDispVal);
		}
		if (iPercentVal != -1) {
			oProgInd.setPercentValue(iPercentVal);
		}
		if (bShowVal != -1) {
			oProgInd.setShowValue(bShowVal);
		}
		if (iWidth != -1) {
			oProgInd.setWidth(iWidth);
		}

		oProgInd.placeAt("uiArea" + idx);
		oProgInds[sId] = oProgInd;
	};

	initProgInd(1, -1, -1, -1, -1, -1, -1, -1); // ProgressIndicator with default values
	initProgInd(2, -1, -1, -1, "30%", 30, -1, "300px"); // ProgressIndicator with 30%
	initProgInd(3, true, true, -1, "110%", 110, true, "300px"); // ProgressIndicator with 110%
	initProgInd(4, true, true, "POSITIVE", "50%", 50, true, "300px"); // ProgressIndicator with 50% POSITIVE
	initProgInd(5, true, true, "NEGATIVE", "50%", 50, true, "300px"); // ProgressIndicator with 50% NEGATIVE
	initProgInd(6, true, true, -1, "50%", 50, true, "100%"); // ProgressIndicator with 50% NEUTRAL width=100%
	initProgInd(7, true, true, -1, "200%", 200, false, "10%"); // ProgressIndicator with 200% NEUTRAL width=10% and no value displayed



	QUnit.module("Properties");

	QUnit.test("Default Values", function(assert) {
		var oProgInd = oProgInds["oProgInd1"];
		assert.equal(oProgInd.getVisible(), true, "Default 'visible':");
		assert.equal(oProgInd.getEnabled(), true, "Default 'enabled':");
		assert.equal(oProgInd.getBarColor(), "NEUTRAL", "Default 'bar color':");
		assert.equal(oProgInd.getDisplayValue(), "0%", "Default 'display value':");
		assert.equal(oProgInd.getPercentValue(), 0, "Default 'percent value':");
		assert.equal(oProgInd.getShowValue(), true, "Default 'show value':");
		assert.equal(oProgInd.getWidth(), "100%", "Default 'width':");
	 });

	QUnit.test("Properties", function(assert) {
		var oProgInd = oProgInds["oProgInd2"];
		assert.equal(oProgInd.getVisible(), true, "Default 'visible':");
		assert.equal(oProgInd.getEnabled(), true, "Default 'enabled':");
		assert.equal(oProgInd.getBarColor(), "NEUTRAL", "Default 'bar color':");
		assert.equal(oProgInd.getDisplayValue(), "30%", "Custom 'display value':");
		assert.equal(oProgInd.getPercentValue(), 30, "Custom 'percent value':");
		assert.equal(oProgInd.getShowValue(), true, "Default 'show value':");
		assert.equal(oProgInd.getWidth(), "300px", "Custom 'width:");
	});

	QUnit.test("Properties", function(assert) {
		var oProgInd = oProgInds["oProgInd3"];
		assert.equal(oProgInd.getVisible(), true, "Custom 'visible':");
		assert.equal(oProgInd.getEnabled(), true, "Custom 'enabled':");
		assert.equal(oProgInd.getBarColor(), "NEUTRAL", "Default 'bar color':");
		assert.equal(oProgInd.getDisplayValue(), "110%", "Custom 'display value':");
		assert.equal(oProgInd.getPercentValue(), 110, "Custom 'percent value':");
		assert.equal(oProgInd.getShowValue(), true, "Custom 'show value':");
		assert.equal(oProgInd.getWidth(), "300px", "Custom 'width:");
	});

	QUnit.test("Properties", function(assert) {
		var oProgInd = oProgInds["oProgInd4"];
		assert.equal(oProgInd.getVisible(), true, "Custom 'visible':");
		assert.equal(oProgInd.getEnabled(), true, "Custom 'enabled':");
		assert.equal(oProgInd.getBarColor(), "POSITIVE", "Custom 'bar color':");
		assert.equal(oProgInd.getDisplayValue(), "50%", "Custom 'display value':");
		assert.equal(oProgInd.getPercentValue(), 50, "Custom 'percent value':");
		assert.equal(oProgInd.getShowValue(), true, "Custom 'show value':");
		assert.equal(oProgInd.getWidth(), "300px", "Custom 'width:");
	});

	QUnit.test("Properties", function(assert) {
		var oProgInd = oProgInds["oProgInd5"];
		assert.equal(oProgInd.getVisible(), true, "Custom 'visible':");
		assert.equal(oProgInd.getEnabled(), true, "Custom 'enabled':");
		assert.equal(oProgInd.getBarColor(), "NEGATIVE", "Custom 'bar color':");
		assert.equal(oProgInd.getDisplayValue(), "50%", "Custom 'display value':");
		assert.equal(oProgInd.getPercentValue(), 50, "Custom 'percent value':");
		assert.equal(oProgInd.getShowValue(), true, "Custom 'show value':");
		assert.equal(oProgInd.getWidth(), "300px", "Custom 'width:");
	});

	QUnit.test("Properties", function(assert) {
		var oProgInd = oProgInds["oProgInd6"];
		assert.equal(oProgInd.getVisible(), true, "Custom 'visible':");
		assert.equal(oProgInd.getEnabled(), true, "Custom 'enabled':");
		assert.equal(oProgInd.getBarColor(), "NEUTRAL", "Default 'bar color':");
		assert.equal(oProgInd.getDisplayValue(), "50%", "Custom 'display value':");
		assert.equal(oProgInd.getPercentValue(), 50, "Custom 'percent value':");
		assert.equal(oProgInd.getShowValue(), true, "Custom 'show value':");
		assert.equal(oProgInd.getWidth(), "100%", "Custom 'width:");
	});

	QUnit.test("Properties", function(assert) {
		var oProgInd = oProgInds["oProgInd7"];
		assert.equal(oProgInd.getVisible(), true, "Custom 'visible':");
		assert.equal(oProgInd.getEnabled(), true, "Custom 'enabled':");
		assert.equal(oProgInd.getBarColor(), "NEUTRAL", "Default 'bar color':");
		assert.equal(oProgInd.getDisplayValue(), "200%", "Custom 'display value':");
		assert.equal(oProgInd.getPercentValue(), 200, "Custom 'percent value':");
		assert.equal(oProgInd.getShowValue(), false, "Custom 'show value':");
		assert.equal(oProgInd.getWidth(), "10%", "Custom 'width:");
	});
});