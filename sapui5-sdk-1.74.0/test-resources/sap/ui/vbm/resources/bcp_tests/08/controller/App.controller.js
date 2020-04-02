
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/layout/SplitterLayoutData",
	"sap/ui/model/json/JSONModel",
	"sap/ui/vbm/Adapter3D",
	"sap/ui/vbm/Viewport"
], function(Controller, SplitterLayoutData, JSONModel, Adapter3D, Viewport) {
	"use strict";
	return Controller.extend("vbm-regression.bcp_tests.08.controller.App", {

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

		load: function(url) {
			{
				$.ajax({
					url: url,
					dataType: "json",
					success: function(data, status, xhr) {
						try
						{
							this.payloads.methodPayload = JSON.stringify(data);
							this.model.setData(this.payloads);
							this.byId("input").setValue(this.payloads.methodPayload);
						}
						catch(ex)
						{
							alert(ex);
						}
					}.bind(this)
				});
			}
		},

		onThreeCubesNoRot: function() {
			this.load("media/threejs/ThreeCubesNoRot.json");
		},

		onThreeCubesDefault: function() {
			this.load("media/threejs/ThreeCubesDefault.json");
		},
		
		onThreeCubesRot: function() {
			this.load("media/threejs/ThreeCubesRot.json");
		},

		onCubeTex4: function() {
			this.load("media/threejs/Box4.json");
		},

		onCubeTex6: function() {
			this.load("media/threejs/Box6.json");
		},

		onLoad: function() {
			this.oAdapter3D.load(this.byId("input").getValue());
		}

	});
});

