sap.ui.require([
	"sap/ui/core/ComponentContainer"
], function(
	ComponentContainer
) {
	"use strict";

	new ComponentContainer({
		name: "test.sap.ui.comp.smartfield",
		settings: {
			id : "smartfield"
		},
		manifest: true
	}).placeAt("body");

});