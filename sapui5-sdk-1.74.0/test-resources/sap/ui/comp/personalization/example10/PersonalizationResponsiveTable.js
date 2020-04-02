sap.ui.require([
	"sap/ui/core/ComponentContainer"
	],
	function(
			ComponentContainer
	) {
	"use strict";
	new ComponentContainer({
		name: "root"
	}).placeAt("content");
});