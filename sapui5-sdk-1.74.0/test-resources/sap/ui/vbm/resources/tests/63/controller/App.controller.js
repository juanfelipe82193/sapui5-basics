
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vbm/GeoMap"
], function(Controller, GeoMap) {
	"use strict";

	var adapter = null;
	var controller = null;
	var bIsInitialLoad = false;

	return Controller.extend("vbm-regression.tests.63.controller.App", {
		
		load: function(url)
		{
			$.ajax({
				url: url,
				dataType: "json",
				success: function(data, status, xhr) {
					try
					{
						this.getView().byId("input").setValue(JSON.stringify(data, null, '  '));
					}
					catch(ex)
					{
						alert(ex);
					}
				}.bind(this)
			});
		},
				
		onInitialLoad: function() {
			bIsInitialLoad = true;
			this.load("media/adapter/initial_load.json");
		},

		onCreateSpots: function() {
			this.load("media/adapter/create_spots.json");
		},

		onModifySpots: function() {
			this.load("media/adapter/modify_spots.json");
		},

		onDeleteSpots: function() {
			this.load("media/adapter/delete_spots.json");
		},

		onContextMenu: function() {
			this.load("media/adapter/context_menu.json");
		},

		onKeyboardEvents: function() {
			this.load("media/adapter/keyboard_events.json");
		},

		onDetailWindow1: function() {
			this.load("media/adapter/detail_request.json");
		},

		onDetailWindow2: function() {
			this.load("media/adapter/detail_request2.json");
		},

		onClusteringDistance: function() {
			this.load("media/adapter/cluster_distance.json");
		},

		onClusteringGrid: function() {
			this.load("media/adapter/cluster_grid.json");
		},

		onClusteringTree: function() {
			this.load("media/adapter/cluster_tree.json");
		},

		onClusteringDisable: function() {
			this.load("media/adapter/cluster_disable.json");
		},

		onChangeMapLayerStack: function() {
			this.load("media/adapter/refMapLayerStack.json")
		},

		onLoad: function () {
			if (bIsInitialLoad) {
				var map = new GeoMap({
					height: "100%",
					width: "100%"
				});
				map.setLayoutData(new sap.m.FlexItemData({
					baseSize: "100%"
				}));
				this.getView().byId("flexBox").insertItem(map, 0);
			
				this.adapter = new sap.ui.vbm.Adapter('adapter', {
					map: map,
					submit: function(data) {
						this.getView().byId("output").setValue(JSON.stringify(JSON.parse(data.mParameters.data), null, 2));
					}.bind(this)
				});

				bIsInitialLoad = false;
			}
			var input = this.getView().byId("input").getValue();
			if(input != null) {
				try {
					this.adapter.load(input);
				}
				catch(ex) {
					alert(ex);
				}
			}
		}
	});
});
