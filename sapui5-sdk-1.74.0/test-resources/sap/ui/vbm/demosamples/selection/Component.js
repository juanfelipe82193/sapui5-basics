sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.vbdemos.selection.Component", {

		metadata: {
			rootView: "sap.ui.vbdemos.selection.Standalone"
		},

		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

		}

	});

});
