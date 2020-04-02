sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/model/json/JSONModel"
], function(Controller, ContentResource, JSONModel) {
	"use strict";

	var firstData = [
		{
			url: "../../internal/media/9cubes-layers-c.vds",
			type: "vds",
			id: "abc123"
		}
	];

	var secondData = [
		{
			url: "../../internal/media/multiple_shapes.vds",
			type: "vds",
			id: "abc123"
		}
	];

	var factory = function(id, context) {
		return new ContentResource({
			source: "{url}",
			sourceType: "{type}",
			sourceId: "{id}"
		});
	};

	return Controller.extend("sap-demo.controller.App", {
		onInit: function() {
			// For debugging purposes assign objects to the global scope (window).

			window.vkCore                 = sap.ui.vk.getCore();
			window.view                   = this.getView();
			window.viewportLeft           = window.view.byId("viewportLeft");
			window.viewportRight          = window.view.byId("viewportRight");
			window.firstContentConnector  = window.view.byId("first-connector");
			window.secondContentConnector = window.view.byId("second-connector");

			window.firstContentConnector
				.bindContentResources({
					path: "/",
					factory: factory
				})
				.setModel(new JSONModel(firstData));
			window.secondContentConnector
				.bindContentResources({
					path: "/",
					factory: factory
				})
				.setModel(new JSONModel(secondData));
		}
	});
});