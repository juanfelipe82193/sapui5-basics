sap.ui.define([
               "sap/ui/core/ComponentContainer",
               "sap/m/Shell"
],function(ComponentContainer, Shell){
	"use strict";
			new Shell({
			app : new ComponentContainer({
				name : "sap.apf.newDemokit.modeler",
				manifest : true,
				settings: {
					id: "modeler"
				}
						}),
			appWidthLimited :false
		}).placeAt("content");
			
});
