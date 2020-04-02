sap.ui.define([
	"sap/ui/vbm/Spots"
], function(
	Spots
) {
	"use strict";

	var spots = new Spots();


	QUnit.test("Spots constructor", function(assert) {

		assert.strictEqual(spots.getPosChangeable(), true, "Default value for posChangeable is true.");
		assert.strictEqual(spots.getScaleChangeable(), true, "Default value for scaleChangeable is true.");

	});


	QUnit.test("Spots.prototype.getBindInfo", function(assert) {

		var expectedBindInfo = {
			"hasTemplate": false,
			"HS": true,
			"HDC": true,
			"SC": true,
			"FS": true,
			"FD": true,
			"ET": true,
			"LT": true,
			"LBC": true,
			"LBBC": true,
			"AR": true,
			"LP": true,
			"TT": true,
			"DD": true,
			"M": true,
			"DS": true,
			"DT": true,
			"LabelType": true,
			"S": true,
			"I": true,
			"IS": true,
			"P": true,
			"T": true,
			"AL": true,
			"IC": true,
			"CC": true,
			"CO": true,
			"CF": true,
			"CS": true,
			"Type": true
		},
			bindInfo = spots.getBindInfo();

		for (var property in expectedBindInfo) {
			if (expectedBindInfo.hasOwnProperty(property)) {
				assert.strictEqual(bindInfo[property], expectedBindInfo[property], "The '" + property + "' value matches the expected one.");
			}
		}
	});
});