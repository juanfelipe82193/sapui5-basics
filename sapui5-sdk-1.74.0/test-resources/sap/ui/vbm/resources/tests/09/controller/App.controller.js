sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.09.controller.App", {

		onInit: function() {
			var appData = {
				"SAPVB": {
					"version": "2.0",
					"xmlns:VB": "VB",
					"Windows": {
						"Set": {
							"Window": {
								"id": "W1",
								"type": "geo",
								"refScene": "S1"
							}
						}
					},
					"MapProviders": {
						"Set": {
							"MapProvider": [{
									"name": "MAPQUEST",
									"type": "",
									"description": "",
									"tileX": "256",
									"tileY": "256",
									"maxLOD": "19",
									"copyright": "Tiles Courtesy of MapQuest © OpenStreetMap under ODbL v1.0",
									"Source": [{
											"id": "s1",
											"url": "http://otile1.mqcdn.com/tiles/1.0.0/map/{LOD}/{X}/{Y}.png"
										},
										{
											"id": "s2",
											"url": "http://otile2.mqcdn.com/tiles/1.0.0/map/{LOD}/{X}/{Y}.png"
										},
										{
											"id": "s3",
											"url": "http://otile3.mqcdn.com/tiles/1.0.0/map/{LOD}/{X}/{Y}.png"
										},
										{
											"id": "s4",
											"url": "http://otile4.mqcdn.com/tiles/1.0.0/osm/{LOD}/{X}/{Y}.png"
										}
									]
								},
								{
									"name": "MAPQUESTSAT",
									"type": "",
									"description": "",
									"tileX": "256",
									"tileY": "256",
									"maxLOD": "11",
									"copyright": "Satellite Tiles Courtesy of MapQuest using OpenStreetMap under ODbL (1.0)",
									"Source": [{
											"id": "s1",
											"url": "http://otile1.mqcdn.com/tiles/1.0.0/vy/sat/{LOD}/{X}/{Y}.png"
										},
										{
											"id": "s2",
											"url": "http://otile2.mqcdn.com/tiles/1.0.0/vy/sat/{LOD}/{X}/{Y}.png"
										},
										{
											"id": "s3",
											"url": "http://otile3.mqcdn.com/tiles/1.0.0/vy/sat/{LOD}/{X}/{Y}.png"
										},
										{
											"id": "s4",
											"url": "http://otile4.mqcdn.com/tiles/1.0.0/vy/sat/{LOD}/{X}/{Y}.png"
										}
									]
								}
							]
						}
					},
					"MapLayerStacks": {
						"Set": {
							"MapLayerStack": [{
									"name": "lsMapQuest",
									"MapLayer": {
										"name": "layer1",
										"refMapProvider": "MAPQUEST",
										"opacity": "1.0",
										"colBkgnd": "RGB(255,255,255)"
									}
								},
								{
									"name": "lsMapQuestSat",
									"MapLayer": {
										"name": "layer1",
										"refMapProvider": "MAPQUESTSAT",
										"opacity": "1.0",
										"colBkgnd": "RGB(255,255,255)"
									}
								}
							]
						}
					},
					"Scenes": {
						"Set": {
							"SceneGeo": {
								"id": "S1",
								"refMapLayerStack": "lsMapQuest",
								"VO": {
									"id": "Spot",
									"type": "{00100000-2012-0004-B001-64592B8DB964}",
									"datasource": "Spots",
									"pos.bind": "Spots.GeoPosition",
									"scale": "1.0;1.0;1.0",
									"fxdir": "true",
									"fxsize": "true"
								}
							}
						}
					},
					"Data": {
						"Set": {
							"N": {
								"name": "Spots",
								"E": []
							}
			
						}
					},
					"DataTypes": {
						"Set": {
							"N": [{
								"name": "Spots",
								"key": "Key",
								"A": [{
										"name": "Key",
										"alias": "A",
										"type": "string"
									},
									{
										"name": "GeoPosition",
										"alias": "B",
										"type": "vector"
									},
									{
										"name": "Name",
										"alias": "C",
										"type": "string"
									},
									{
										"name": "Selected",
										"alias": "D",
										"type": "boolean"
									}
								]
							}]
						}
					},
					"Actions": {
						"Set": {
							"Action": [{
									"id": "1",
									"name": "CONTEXT_MENU_REQUEST",
									"refScene": "S1",
									"refVO": "Spot",
									"refEvent": "ContextMenu"
								},
								{
									"id": "2",
									"name": "CONTEXT_MENU_REQUEST",
									"refScene": "S1",
									"refVO": "Map",
									"refEvent": "ContextMenu",
									"AddActionProperty": [{
											"name": "zoom"
										},
										{
											"name": "centerpoint"
										},
										{
											"name": "pos"
										},
										{
											"name": "pitch"
										},
										{
											"name": "yaw"
										}
									]
								},
								{
									"id": "3",
									"name": "ZOOM_EVENT",
									"refScene": "S1",
									"refVO": "Map",
									"refEvent": "ZoomChanged",
									"AddActionProperty": [{
											"name": "zoom"
										},
										{
											"name": "centerpoint"
										},
										{
											"name": "pos"
										}
									]
								},
								{
									"id": "4",
									"name": "CENTERCHANGED_EVENT",
									"refScene": "S1",
									"refVO": "Map",
									"refEvent": "CenterChanged",
									"AddActionProperty": [{
											"name": "zoom"
										},
										{
											"name": "centerpoint"
										},
										{
											"name": "pos"
										}
									]
								},
								{
									"id": "5",
									"name": "DETAIL_REQUEST",
									"refScene": "S1",
									"refVO": "Map",
									"refEvent": "Click",
									"AddActionProperty": [{
										"name": "pos"
									}]
								}
							]
						}
					}
				}
			};

			var oVbi = this.byId("vbiControl");

			// Load map layers
			var userStoredData = GLOBAL_MAP_CONFIG;
			appData.SAPVB.MapLayerStacks.Set.MapLayerStack = userStoredData.MapLayerStacks;
			appData.SAPVB.MapProviders.Set.MapProvider = userStoredData.MapProvider;
			var scene = userStoredData.MapLayerStacks;
			if (scene instanceof Array) {
				appData.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks[0].name;
			} else {
				appData.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks.name;
			}

			oVbi.load(appData);

		},

		onZoomToGeoPosition: function() {
						
			this.byId("vbiControl").zoomToGeoPosition( 8.643494, 49.303412, 14 );

		},

		onZoomWithJSON: function() {
			$.getJSON("media/vbzoom/automated_zoom.json", function(data) {
				this.byId("vbiControl").load(data);
			}.bind(this));
		}

	});
});
