sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/ContentConnector",
	 "sap/ui/vk/dvl/ViewStateManager"
], function(Controller, ContentResource, ContentConnector, ViewStateManager) {
	"use strict";

	return Controller.extend("standaloneViewport.controller.App", {

		onInit: function() {
			var view = this.getView();
			var oViewport = view.byId("viewport");

			// Constructor for a new content resource. procides an object that owns content resouces, tracks changes, loads and destroys
			// content built from the content resource.
			var contentResource = new ContentResource({
				// specifying the resource to load
				source: "models/boxTestModel.vds",
				sourceType: "vds",
				sourceId: "abc123"
			});
			// Constructor for a new content connector
			var contentConnector = new ContentConnector("abcd");

			// Manages the visibility and the selection states of nodes in the scene.
			var viewStateManager = new ViewStateManager("vsmA", {
				contentConnector: contentConnector
			});

			// set content connector and viewStateManager for viewport
			oViewport.setContentConnector(contentConnector);
			oViewport.setViewStateManager(viewStateManager);

			view.addDependent(contentConnector).addDependent(viewStateManager);

			// Add resource to load to content connector
			contentConnector.addContentResource(contentResource);
		}
	});
});