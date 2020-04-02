sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/demo/nav/localService/mockserver"
], function (UIComponent, MockServer) {
	"use strict";

	return UIComponent.extend("sap.ui.demo.nav.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

            MockServer.init();
            this.getModel().refreshMetadata();

			// create the views based on the url/hash
			this.getRouter().initialize();
		}

	});

});
