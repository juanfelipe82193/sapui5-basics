sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/m/Shell",
		"sap/ui/core/ComponentContainer"

	], function (Shell, ComponentContainer) {

		// initialize the UI component
		new Shell("myShell", {
			app: new ComponentContainer({
				height: "100%",
				component: sap.ui.component({
					name: "sap.ui.comp.sample.valuehelpdialog.example.1",
					id: "myComponent"
				})
			})
		}).placeAt("content");
	});
});