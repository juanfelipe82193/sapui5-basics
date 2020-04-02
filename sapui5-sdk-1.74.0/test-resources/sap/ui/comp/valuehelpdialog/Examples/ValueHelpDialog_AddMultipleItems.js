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
					name: "sap.ui.comp.valuehelpdialog.example.AddMultipleItems",
					id: "myComponent"
				})
			})
		}).placeAt("content");
	});
});