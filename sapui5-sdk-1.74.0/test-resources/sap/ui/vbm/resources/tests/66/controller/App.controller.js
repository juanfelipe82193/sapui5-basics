
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/layout/SplitterLayoutData",
	"sap/ui/model/json/JSONModel",
	"sap/ui/vbm/Adapter3D",
	"sap/ui/vbm/Viewport"
], function(Controller, SplitterLayoutData, JSONModel, Adapter3D, Viewport) {
	"use strict";
	return Controller.extend("vbm-regression.tests.66.controller.App", {

		onInit: function() {

			this.payloads = {
				methodPayload: undefined,
				eventPayload: undefined
			};

			this.model = new sap.ui.model.json.JSONModel();
			this.model.setData(this.payloads);
			sap.ui.getCore().setModel(this.model, "source");

			var viewport1 = this.byId("viewport1");
			viewport1.setLayoutData(new sap.m.FlexItemData({
				baseSize: "100%"
			}));
			this.oAdapter3D = new Adapter3D({
				id: "adapter3D",
				viewport: viewport1,
				submit: function(oPayload) {
					this.payloads.eventPayload = oPayload.getParameters().data;
					this.model.setData(this.payloads);
					this.byId("output").setValue(this.payloads.eventPayload);
				}.bind(this)
			});
		},


		load: function(url, extendWithUrl) {
			{
				// Helper function to extend VBI JSON with a JSON object representing the additional/changed values
				// WARNING: Function cannot remove nodes, so you need to manually craft/check that the base is only ever extended
				var extendVbiJSON = function(base, extension) {
					var replaceAddObjectInArrayByIdProperty = function(baseArray, objectToReplaceAdd) {
						var replace = false;
						for (var i = 0; i < baseArray.length; i++) {
							if (baseArray[i]["id"] == objectToReplaceAdd["id"]) {
								baseArray[i] = objectToReplaceAdd;
								replace = true;
								continue;
							}
						}

						// If no object was found to replace, then add the new object
						if (!replace) {
							baseArray.push(objectToReplaceAdd);
						}
					} 

					var replaceAddObject = function(targetObjectRef, propertyName, valueObject, checkForId) {
						if (checkForId) {
							return targetObjectRef[propertyName] == valueObject;
						}
						targetObjectRef[propertyName] = valueObject;
					} 

					if (extension["SAPVB"]["Actions"]) {
						for (var ia = 0; ia < extension["SAPVB"]["Actions"]["Set"]["Action"].length; ia++) {
							replaceAddObjectInArrayByIdProperty(base["SAPVB"]["Actions"]["Set"]["Action"], extension["SAPVB"]["Actions"]["Set"]["Action"][ia]);
						}
					}

					if (extension["SAPVB"]["Scenes"]) {
						var extendWithObj = extension["SAPVB"]["Scenes"]["Set"]["Scene"];
						if (replaceAddObject(base["SAPVB"]["Scenes"]["Set"]["Scene"], "id", extendWithObj["id"], true)) {
							for (var prop in extendWithObj) {
								if (extendWithObj.hasOwnProperty(prop)) {
									replaceAddObject(base["SAPVB"]["Scenes"]["Set"]["Scene"], prop, extendWithObj[prop]);
								}
							}
						}
					}
				}

				//Load the JSON extension
				var onSuccess = function(data, status, xhr) {
					if (extendWithUrl && extendWithUrl.length != 0) {
						var jsonToExtend = data;
						var that = this;
						$.ajax({
							url: extendWithUrl,
							dataType: "json",
							success: function(extendData, status, xhr) {
								try {
									var extendWithUrlData = extendData;
									if (extendWithUrlData["SAPVB"]) {
										extendVbiJSON(jsonToExtend, extendWithUrlData);
									}

									this.payloads.methodPayload = JSON.stringify(jsonToExtend);
									this.model.setData(this.payloads);
									this.byId("input").setValue(this.payloads.methodPayload);
								} catch (ex) {
									alert(ex);
								}
							}.bind(that)
						});
					} else {
						try {
							this.payloads.methodPayload = JSON.stringify(data);
							this.model.setData(this.payloads);
							this.byId("input").setValue(this.payloads.methodPayload);
						} catch (ex) {
							alert(ex);
						}
					}
				}

				$.ajax({
					url: url,
					dataType: "json",
					success: onSuccess.bind(this)
				});
			}
		},

		onInitialLoad: function() {
			this.load("media/threejs/Initial_base.json", "media/threejs/Initial.initial_base.json");
		},


		onInitialTopRightLoad: function() {
			this.load("media/threejs/Initial_base.json", "media/threejs/InitialZoomTopRight.initial_base.json");
		},

		onInitialBottomLeftLoad: function() {
			this.load("media/threejs/Initial_base.json", "media/threejs/InitialZoomBottomLeft.initial_base.json");
		},

		onTruckEurope: function() {
			this.load("media/threejs/Truck_Europe.json");
		},

		onTruckBorderColour: function() {
			this.load("media/threejs/Truck_Europe_With_Border_Colors.json");
		},
		
		onTruckUS: function() {
			this.load("media/threejs/Truck_US.json");
		},

		onContextMenu: function() {
			this.load("media/threejs/ContextMenu.json");
		},

		onEmptyTruck: function() {
			this.load("media/threejs/EmptyTruck.json");
		},

		onClearScene: function() {
			this.load("media/threejs/ClearScene.json");
		},

		onResponsivePopover1: function() {
			this.load("media/threejs/ResponsivePopover1.json");
		},

		onResponsivePopover2: function() {
			this.load("media/threejs/ResponsivePopover2.json");
		},

		onResponsivePopover3: function() {
			this.load("media/threejs/ResponsivePopover3.json");
		},

		onFlyTo: function() {
			this.load("media/threejs/FlyTo.json");
		},

		onLoad: function() {
			this.oAdapter3D.load(this.byId("input").getValue());
		}

	});
});

