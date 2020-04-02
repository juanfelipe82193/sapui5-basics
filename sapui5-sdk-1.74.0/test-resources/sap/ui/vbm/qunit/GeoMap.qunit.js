sap.ui.define([
	"sap/ui/vbm/GeoMap"
], function(
	GeoMap
) {
	"use strict";

	var geoMap = new GeoMap();

	QUnit.test("GeoMap.prototype.isNumeric", function(assert) {

		assert.ok(geoMap.isNumeric(5), "5 is numeric.");
		assert.ok(geoMap.isNumeric("5"), "'5' is numeric.");
		assert.ok(geoMap.isNumeric(0x000000), "0x000000 is numeric.");
		assert.ok(geoMap.isNumeric("0x000000"), "'0x000000' is numeric.");
		assert.ok(geoMap.isNumeric(0.005), "0.005 is numeric.");
		assert.ok(geoMap.isNumeric("0.005"), "'0.005' is numeric.");
		assert.ok(geoMap.isNumeric(0), "0 is numeric.");
		assert.ok(geoMap.isNumeric("0"), "'0' is numeric.");

		assert.notOk(geoMap.isNumeric("abc"), "abc is not numeric.");
		assert.notOk(geoMap.isNumeric(true), "true is not numeric");
		assert.notOk(geoMap.isNumeric(false), "false is not numeric.");
		assert.notOk(geoMap.isNumeric("123abc"), "123abc is not numeric.");
		assert.notOk(geoMap.isNumeric(null), "null is not numeric.");
		assert.notOk(geoMap.isNumeric({}), "{} is not numeric.");
		assert.notOk(geoMap.isNumeric([]), "[] is not numeric.");

	});


	//		QUnit.test("Spots.prototype.getBindInfo", function(assert) {
	//
	//			var expectedBindInfo = {
	//					"hasTemplate": false,
	//					"HS": true,
	//					"HDC": true,
	//					"SC": true,
	//					"FS": true,
	//					"FD": true,
	//					"ET": true,
	//					"LT": true,
	//					"LBC": true,
	//					"LBBC": true,
	//					"AR": true,
	//					"LP": true,
	//					"TT": true,
	//					"DD": true,
	//					"M": true,
	//					"DS": true,
	//					"DT": true,
	//					"LabelType": true,
	//					"S": true,
	//					"I": true,
	//					"IS": true,
	//					"P": true,
	//					"T": true,
	//					"AL": true,
	//					"IC": true,
	//					"CC": true,
	//					"CO": true,
	//					"CF": true,
	//					"CS": true,
	//					"Type": true
	//				},
	//				bindInfo = spots.getBindInfo();
	//
	//			for (var property in expectedBindInfo) {
	//				if (expectedBindInfo.hasOwnProperty(property)) {
	//					assert.strictEqual(bindInfo[property], expectedBindInfo[property], "The '" + property + "' value matches the expected one.");
	//				}
	//			}
	//		});
});