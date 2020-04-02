sap.ui.require([
	"sap/ui/core/ComponentContainer"
], function(
	ComponentContainer
){
	"use strict";

		new ComponentContainer({
			name: "TextInEditModeSource",
			manifest: true
		}).placeAt("content");
	}
);
