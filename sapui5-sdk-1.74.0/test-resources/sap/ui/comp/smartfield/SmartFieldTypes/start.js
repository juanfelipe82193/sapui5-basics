sap.ui.require([
	"sap/ui/core/ComponentContainer"
], function(
	ComponentContainer
){
	"use strict";

		new ComponentContainer({
			name: "test.sap.ui.comp.smartfield.SmartFieldTypes",
			manifest: true
		}).placeAt("content");
	}
);
