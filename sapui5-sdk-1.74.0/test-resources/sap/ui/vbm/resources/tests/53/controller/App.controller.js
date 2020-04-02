sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.53.controller.App", {

		onInit: function() {

			var dataModel = {
				map: {
					mapConfiguration: GLOBAL_MAP_CONFIG
				}
			};

			jQuery.sap.require("sap.ui.model.json.JSONModel");
			var model = new sap.ui.model.json.JSONModel(dataModel);
			model.setSizeLimit(3000)
			this.getView().setModel(model);

		},

		onClickVO: function(sourceType) {
			MessageToast.show("Click event from: " + sourceType);
		},

		onContextMenuVO: function(sourceType) {	
			MessageToast.show("Context Menu event from: " + sourceType);

		},

		onCreateSpot: function() {
			this.byId("vbi").getPositionInteractive(false, function(pos) {
				this.byId("my-spots").addItem(new sap.ui.vbm.Spot({
					key: "N",
					position: pos,
					click: this.onClickVO.bind(this, "Spot"),
					contextMenu: this.onContextMenuVO.bind(this, "Spot")
				}));
			}.bind(this));
		},

		onCreateRoute: function() {
			this.byId("vbi").getPositionInteractive(true, function(pos) {
				this.byId("my-routes").addItem(new sap.ui.vbm.Route({
					position: pos,
					tooltip: 'This is a New Route',
					end: "1",
					start: "0",
					color: 'rgba(131, 142, 147, 1)',
					linewidth: "3",
					changeable: true,
					click: this.onClickVO.bind(this, "Route"),
					contextMenu: this.onContextMenuVO.bind(this, "Route")
				}));
			}.bind(this));
		},

		onCreateArea: function() {
			this.byId("vbi").getPositionInteractive(true, function(pos) {
				this.byId("my-areas").addItem(new sap.ui.vbm.Area({
					position: pos,
					color: 'rgba(166, 25, 38, 0.8)',
					colorBorder: 'rgb(255,255,255)',
					changeable: true,
					click: this.onClickVO.bind(this, "Area"),
					contextMenu: this.onContextMenuVO.bind(this, "Area")
				}));
			}.bind(this));

		},

		onCreateCircle: function() {
			this.byId("vbi").getPositionInteractive(false, function(pos) {
				this.byId("my-circles").addItem(new sap.ui.vbm.Circle({
					position: pos,
					radius: "20",
					changeable: true,
					click: this.onClickVO.bind(this, "Circle"),
					contextMenu: this.onContextMenuVO.bind(this, "Circle")
				}));
			}.bind(this));
		},

		onCreateGeoCircle: function() {
			this.byId("vbi").getPositionInteractive(false, function(pos) {
				this.byId("my-geocircles").addItem(new sap.ui.vbm.GeoCircle({
					radius: "1000000",
					slices: "40",
					position: pos,
					tooltip: 'This is a New GeoCircle',
					color: 'rgba(181, 216, 87, 0.8)',
					colorBorder: 'rgb(255, 255, 255)',
					changeable: true,
					click: this.onClickVO.bind(this, "GeoCircle"),
					contextMenu: this.onContextMenuVO.bind(this, "GeoCircle")
				}));
			}.bind(this));
		},

		onCreateBox: function() {
			this.byId("vbi").getPositionInteractive(false, function(pos) {
				this.byId("my-boxes").addItem(new sap.ui.vbm.Box({
					scale: '0.1;0.1;0.1',
					position: pos,
					tooltip: 'This is a New Box',
					color: 'rgba(249, 194, 100, 0.8)',
					colorBorder: 'rgb(255,255,255)',
					changeable: true,
					click: this.onClickVO.bind(this, "Box"),
					contextMenu: this.onContextMenuVO.bind(this, "Box")
				}));
			}.bind(this));
		},

		onCreatePie: function() {
			this.byId("vbi").getPositionInteractive(false, function(pos) {
				this.byId("my-pies").addItem(new sap.ui.vbm.Pie({
					scale: '3;1;1',
					position: pos,
					tooltip: 'This is a New Pie',
					changeable: true,
					items: [new sap.ui.vbm.PieItem({
						value: '20'
					}), new sap.ui.vbm.PieItem({
						value: '50'
					})],
					click: this.onClickVO.bind(this, "Pie"),
					contextMenu: this.onContextMenuVO.bind(this, "Pie")
				}));
			}.bind(this));
		}

	});
});
