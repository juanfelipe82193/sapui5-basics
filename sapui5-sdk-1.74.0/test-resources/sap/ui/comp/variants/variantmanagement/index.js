sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"sap/ui/core/ComponentContainer"

	], function(ComponentContainer) {

		new ComponentContainer("CompCont1", {
			height: "100%",
			name: "sap.ui.comp.sample.variantmanagement",
			settings: {
				id: "Comp1"
			}

		}).placeAt("target1");

	});
});
