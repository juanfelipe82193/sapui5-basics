sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.50.controller.App", {

		onInit: function() {

			var dataModel = {
				map: {
					mapConfiguration: GLOBAL_MAP_CONFIG
				},
				features: [{
						"id": "DE-BE",
						"color": "rgba(184,225,245,0.8)"
					}
				]
			};

			jQuery.sap.require("sap.ui.model.json.JSONModel");
			var model = new sap.ui.model.json.JSONModel(dataModel);
			model.setSizeLimit(3000)
			this.getView().setModel(model);

			this.addedFeatureModel = {
				"id": "DE-BB",
				"color": "rgba(184,25,45,0.7)"
			};

		},

		onClickFeatureCollection: function() {
			MessageToast.show("Click Feature Collection");
		},

		onClickFeature: function() {
			MessageToast.show("Click Feature");
		},

		onContextMenuFeatureCollection: function() {
			MessageToast.show("Context Menu Feature Collection");
		},

		onContextMenuFeature: function() {
			MessageToast.show("Context Menu Feature");
		},

		onAddFeatureCollection: function() {
			if (this.addedFeature) {
				this.addedFeature.destroy();
			}
			this.addedFeature = new sap.ui.vbm.FeatureCollection("NI", {
				srcURL: "media/vbarea/DE-NI.geojson"
			});
			this.byId("vbi").addFeatureCollection(this.addedFeature);
		},

		onRemoveFeatureCollection: function() {
			this.byId("vbi").removeFeatureCollection(this.addedFeature);
		},

		onAddFeatureCollectionModel: function() {
			var currentData = this.getView().getModel().getData();
			currentData.features.push(this.addedFeatureModel);
			this.getView().getModel().setData(currentData);
		},

		onRemoveFeatureCollectionModel: function() {
			var currentData = this.getView().getModel().getData();
			currentData.features = currentData.features.filter(function(feature) {
				return feature.id !== this.addedFeatureModel.id; 
			}, this);
			this.getView().getModel().setData(currentData);
		}
	});
});
