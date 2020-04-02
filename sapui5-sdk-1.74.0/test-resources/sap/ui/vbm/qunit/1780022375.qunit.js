sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vbm/GeoMap",
	"sap/ui/vbm/Containers",
	"sap/ui/vbm/Container",
	"sap/m/Text"
], function(jQuery, GeoMap, Containers, Container, Text) {
	'use strict';
	// This unit test is covering message 1780022375
	// Container items are rendererd twice. It is expected they are rendered only once.

	// query for charts library, the microchart is positioned in a container vo

	QUnit.test("test loading scene", function(assert) {
		var done = assert.async();

		var myText = new Text({
			text: "1111111111111111"
		});

		var geoMap = new GeoMap({
			vos: [
				new Containers("containers", {
					items: [
						new Container({
							position: '70;0;0',
							item: myText
						})
					]
				})
			]
		});

		geoMap.placeAt("content");

		setTimeout(function() {
			var numberOfLabels = jQuery('span').filter(function() {
				return jQuery(this).text() === '1111111111111111';
			}).length;
			assert.equal(numberOfLabels, 1, "The container item is rendered only once");
			done();
		}, 2000);

	});
});