sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.36.controller.App", {

		onInit: function() {

			var vbi = this.byId("vbi");

			// load the json and set the default text area text
			$.getJSON("media/vbmass2000/main2.json", function(data) {
				var userStoredData = GLOBAL_MAP_CONFIG;
				data.SAPVB.MapLayerStacks.Set.MapLayerStack = userStoredData.MapLayerStacks;
				data.SAPVB.MapProviders.Set.MapProvider = userStoredData.MapProvider;

				var scene = userStoredData.MapLayerStacks;
				if (scene instanceof Array) {
					data.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks[0].name;
				} else {
					data.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks.name;
				}
				vbi.load(data);
				
				vbi.zoomToGeoPosition(12, 50, 6);
			});
		},
		
		onGridClustering: function() {
			$.getJSON("media/vbmass2000/gridclustering.json", function(datclust) {
				this.byId("vbi").load(datclust);
			}.bind(this));
		},
		
		onGridClusteringHot: function() {
			$.getJSON("media/vbmass2000/gridclusteringHot.json", function(datclust) {
				this.byId("vbi").load(datclust);
			}.bind(this));
		},
		
		onGridClustering2: function() {
			var datclust = $.getJSON("media/vbmass2000/gridclustering2.json", function(datclust) {
				this.byId("vbi").load(datclust);
			}.bind(this));
		},

		onDistClustering: function() {
			var datclust = $.getJSON("media/vbmass2000/distclustering.json", function(datclust) {
				this.byId("vbi").load(datclust);
			}.bind(this));
		},

		onMixedClustering: function() {
			var datclust = $.getJSON("media/vbmass2000/mixedclustering.json", function(datclust) {
				this.byId("vbi").load(datclust);
			}.bind(this));
		},

		onTreeClustering: function() {
			var datclust = $.getJSON("media/vbmass2000/treeclustering.json", function(datclust) {
				this.byId("vbi").load(datclust);
			}.bind(this));
		},

		onTreeClusteringWithSubs: function() {
			var datclust = $.getJSON("media/vbmass2000/treeclusteringWSub.json", function(datclust) {
				this.byId("vbi").load(datclust);
			}.bind(this));
		},

		onTreeClusteringWithSuper: function() {
			var datclust = $.getJSON("media/vbmass2000/treeclusteringWSuper.json", function(datclust) {
				this.byId("vbi").load(datclust);
			}.bind(this));
		},

		onNoClustering: function() {
			var datclust = $.getJSON("media/vbmass2000/noclustering.json", function(datclust) {
				this.byId("vbi").load(datclust);
			}.bind(this));
		}
	});
});
