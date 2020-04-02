sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("vbm-regression.tests.05.controller.App", {

		onInit: function() {

			var appConfig = {
	               "SAPVB": {
		               "version": "2.0",
		               "xmlns:VB": "VB",
		               "Windows": {
			               "Set": {
				               "Window": {
					               "id": "W1",
					               "type": "geo",
					               "refScene": "S1",
				               }
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
									} ,
                              "VisualFrame": {
                                 "layerDepth": "4",
                                 "maxLOD": "15",
                                 "offsetMaxLOD": "3.5",
                                 "minLat": "47.7",
                                 "maxLat": "48.6",
                                 "minLon": "10.9",
                                 "maxLon": "12.1"
                              }
				               }
			               }
		               },
                     "MapProviders": {
                        "Set": {
                           "MapProvider": {
                           }
                        }
                     },
                     "Data": {
                         "Set": {
                            "N":
                               {
                                  "name": "Spots",
                                  "E": [
                                     {
                                        "A": "0",
                                        "B": "11.45;48.15;0",
                                        "C": "LTL000421",
                                        "D": "0"
                                     },
                                     {
                                        "A": "1",
                                        "B": "10.9;47.7;0",
                                        "C": "LTL000522",
                                        "D": "0"
                                     },
                                     {
                                        "A": "2",
                                        "B": "10.9;48.6;0",
                                        "C": "LTL000523",
                                        "D": "0"
                                     },
                                     {
                                        "A": "3",
                                        "B": "12.1;47.7;0",
                                        "C": "LTL000522x",
                                        "D": "0"
                                     },
                                     {
                                        "A": "4",
                                        "B": "12.1;48.6;0",
                                        "C": "LTL000523x",
                                        "D": "0"
                                     }
                                  ]
                               }

                         }
                      },

						"DataTypes": {
							"Set": {
								"N": [
									{
										"name": "Spots",
										"key": "Key",
										"A": [
											{
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
									}
								]
							}
						},
                     "MapLayerStacks": {
                        "Set": {
                           "MapLayerStack": {
                           }
                        }
                     }
	               }
               };

			var vbi = this.byId("vbi");

			var userStoredData = GLOBAL_MAP_CONFIG;
			appConfig.SAPVB.MapLayerStacks.Set.MapLayerStack = userStoredData.MapLayerStacks;
			appConfig.SAPVB.MapProviders.Set.MapProvider = userStoredData.MapProvider;

			var scene = userStoredData.MapLayerStacks;
			if (scene instanceof Array) {
				appConfig.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks[0].name;
			} else {
				appConfig.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks.name;
			}
			vbi.setConfig(appConfig);
			
		},
		
		onZoomTest: function() {
			this.byId("vbi").zoomToGeoPosition(8.643494, 49.303412, 15);
		}

	});
});
