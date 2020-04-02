sap.ui.define([
	"sap/ui/vbm/Spot",
	"sap/ui/vbm/Spots",
	"sap/ui/vbm/GeoMap"
], function(
	Spot,
	Spots,
	GeoMap
) {
	"use strict";

	var spot = new Spot();

	var geoMap = new GeoMap({
		vos: [
			new Spots({
				items: [
					spot
				]
			})
		]
	})

	QUnit.test("Spot constructor", function(assert) {

		assert.strictEqual(spot.getPosition(), "0;0;0", "Default position is '0;0;0'.");
		assert.strictEqual(spot.getText(), "", "Default text is empty string.");
		assert.strictEqual(spot.getImage(), "", "Default image is empty string.");
		assert.strictEqual(spot.getAlignment(), "5", "Default alignment is '5' (bottom center).");
		assert.strictEqual(spot.getScale(), "1;1;1", "Default scale is '1;1;1'.");
		assert.strictEqual(spot.getIcon(), "", "Default icon is empty string.");
		assert.strictEqual(spot.getImageSelected(), "", "Default imageSelected is empty string.");
		assert.strictEqual(spot.getContentColor(), "#000000", "Default contentColor is #000000 (we overwrite the default empty string in Spot.prototype.init method).");
		assert.strictEqual(spot.getContentOffset(), "0;0", "Default contentOffset is empty '0;0'.");
		assert.strictEqual(spot.getContentFont(), "arial", "Default contentFont is 'arial'.");
		assert.strictEqual(spot.getContentSize() === "0.875rem" || spot.getContentSize() === ".875rem", true, "Default contentSize is '0.875rem' (we overwrite the default empty string in Spot.prototype.init method).")
		assert.strictEqual(spot.getType(), "None", "Default spot type is 'None'.");
	});

	QUnit.test("Spot.prototype.handleChangedData", function(assert) {

		var spot2 = new Spot();
		spot2.handleChangedData({
			P: "test-position",
			S: "test-scale"
		});

		assert.strictEqual(spot2.getPosition(), "test-position", "handleChangedData has changed the position to 'test-position'.");
		assert.strictEqual(spot2.getScale(), "test-scale", "handleChangedData has changed the scale to 'test-scale'.");

	});

	QUnit.test("Spot.prototype.getDataElement", function(assert) {
		//mark the test as asynchronous
		var done = assert.async();

		// place map control on the page
		geoMap.placeAt("content");

		// //wait for the map to render so we can call spot.getDataElement()
		 setTimeout(function() {

			var dataElement = spot.getDataElement();
			var expectedDataElement = {
				"K": "__spot1000",
				"VB:c": false,
				"HS": "1.0;1.0;1.0",
				"HDC": "RHLSA(0;1.3;1.0;1.0)",
				"SC": "RHLSA(0.0;1.0;1.0;1.0)",
				"FS": "true",
				"FD": "true",
				"ET": "",
				"LT": "",
				"LBC": "RGB(255;255;255)",
				"LP": "",
				"LBBC": "RGB(255;255;255)",
				"AR": false,
				"DD": "",
				"VB:s": false,
				"TT": "",
				"P": "0;0;0",
				"S": "1;1;1",
				"T": "",
				"I": "",
				"IS": "",
				"AL": "5",
				"IC": "",
				"CC": "#000000",
				"CO": "0;0",
				"CF": "arial",
				"CS": "0.875rem",
				"N": []
			};

			for (var property in expectedDataElement) {
				if (expectedDataElement.hasOwnProperty(property)) {
					if (Array.isArray(expectedDataElement[property])) {
						assert.propEqual(dataElement[property], expectedDataElement[property], "The '" + property + "' value matches the expected one.");
					} else if (property === "CS") { // special handling needed as may returned "0.875rem" or ".875rem"
							assert.strictEqual(dataElement[property] === "0.875rem" || dataElement[property] === ".875rem", true, "The '" + property + "' value matches the expected one.");
					} else {
						assert.strictEqual(dataElement[property], expectedDataElement[property], "The '" + property + "' value matches the expected one.");
					}
				}
			}
			done();
		}, 1000);
	});
});