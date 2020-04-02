sap.ui.define([
	"sap/ui/vk/ContentConnector",
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/threejs/ContentDeliveryService",
	"sap/m/MessageToast"
], function(ContentConnector, Controller, ContentResource, ContentDeliveryService, MessageToast) {
	"use strict";

	var sourceData = {
		url: "",
		veid: "",
		viewid: "",
		sidsToUpdate: ""
	};


	var contentConnector;
	var cds;
	var viewport;
	var view;

	var threeJsCamera; // we will write proper camera class soon.

	return Controller.extend("sap-demo.controller.App", {
		onInit: function() {
			// For debugging purposes assign objects to the global scope (window).
			window.vkCore = sap.ui.vk.getCore();
			view = this.getView();
			window.view = view;
			viewport = window.view.byId("viewport");
			window.viewport = viewport;

			contentConnector = window.view.byId("connector");
			window.contentConnector = contentConnector;

			contentConnector.attachContentChangesFinished(function(event) {
				var failureReason = event.getParameter("failureReason");
				if (failureReason && failureReason.length > 0) {
					var msg = failureReason[ 0 ].error || failureReason[ 0 ].errorMessage;
					MessageToast.show(msg);
				}
			});

			var model = new sap.ui.model.json.JSONModel();
			model.setData(sourceData);
			this.getView().setModel(model, "source");

			// register CDS
			// comment out next line to test default loader
			cds = new sap.ui.vk.threejs.ContentDeliveryService();
			if (cds) {
				ContentConnector.addContentManagerResolver({
					pattern: "stream",
					dimension: 3,
					contentManagerClassName: "sap.ui.vk.threejs.ContentManager",
					settings: {
						loader: cds
					}
				});
			}

			cds.attachErrorReported(function(event){
				var error = event.getParameter("error");
				var errorText = event.getParameter("errorText");

				var msg = "";
				if (error) {
					msg += ("error code:" + error + " ");
				}
				if (errorText) {
					msg += errorText;
				}

				MessageToast.show(msg);
			});


		},
		onButtonClick: function() {

			function loadModel() {
				// add \\ so ui5 doesnt think it is data binding since it starts with '{'
				var sourceString = "\\" + JSON.stringify(sourceData);
				// specifying the resource to load
				var contentResource = new sap.ui.vk.ContentResource({
					source: sourceString,
					sourceType: "stream",
					sourceId: "abc"
				});
				contentConnector.destroyContentResources();
				contentConnector.addContentResource(contentResource);
			}

			if (cds) {
				cds.initUrl(sourceData.url).then(function() {
					loadModel();
				}).catch(function(reason) {
					MessageToast.show(reason);
				});
			} else {
				loadModel();
			}

		},
		onLoadViewButtonClick: function() {
			if (cds && sourceData.veid && sourceData.viewid) {

				var result = cds.loadView(sourceData.veid, sourceData.viewid, "static");
				result.then(function(view) {
					viewport.activateView(view);
				});

			} else {
				jQuery.sap.log.error("load view failed, invalid args");
			}
		},
		onUpdateButtonClick: function() {
			if (cds && sourceData.sidsToUpdate.length) {
				var sids = sourceData.sidsToUpdate.split(',');
				cds.update(sourceData.veid, sids).then(function(result) {
					jQuery.sap.log.debug(result);
					jQuery.sap.log.debug("Update finished");
				});
			} else {
				jQuery.sap.log.error("sids not specified.");
			}
		},
		onRemoveExternalResolver: function() { // to test both external resolver and default one

			if (cds) {
				ContentConnector.removeContentManagerResolver(cds);
				cds = null;

				// disable buttons that we cannot test with default resolver
				view.byId("btnToggleResolver").setEnabled(false);
				view.byId("viewForm").setVisible(false);
				view.byId("updateForm").setVisible(false);
			}

		}
	});
});