
sap.ui.require([
	"sap/ui/core/ComponentContainer"
], function (
	ComponentContainer
) {
	"use strict";

	// initialize the UI component
	new ComponentContainer({
		name: "DateRangeSample",
		height: "100%",
		manifest: true,
		settings: {
			id: "Comp1"
		}
	}).placeAt("target1");
});