sap.ui.define(["sap/ui/core/ComponentContainer"], function (ComponentContainer) {
	"use strict";

	new ComponentContainer("DemoApplication", {
		height : "100%",
		name : "sap.apf.newDemokit.runtime",
		settings: {
			id: "runtime"
		},
		manifest: true
	}).placeAt("applicationComponentContainer");

});