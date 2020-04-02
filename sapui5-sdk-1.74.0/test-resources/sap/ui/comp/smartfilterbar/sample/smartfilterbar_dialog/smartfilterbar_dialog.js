sap.ui.require([
	"sap/ui/core/ComponentContainer"
	],
	function(
			ComponentContainer
	) {
	"use strict";

	new ComponentContainer("CompCont1", {
		height: "100%",
		name: "sap.ui.comp.sample.smartfilterbar_dialog"
	}).placeAt("target1");

});