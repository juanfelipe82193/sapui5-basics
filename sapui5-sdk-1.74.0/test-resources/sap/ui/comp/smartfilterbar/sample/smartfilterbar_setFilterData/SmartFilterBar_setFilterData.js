sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/m/Shell",
		"sap/ui/core/ComponentContainer",
		"sap/ui/core/util/MockServer"

	], function (Shell, ComponentContainer, MockServer) {

		// initialize the UI component
		new ComponentContainer("CompCont1", {
			height: "100%",
			name: "sap.ui.comp.sample.smartfilterbar_setFilterData",
			settings : {
				id : "Comp1"
			}

		}).placeAt("target1");
	});
});