
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("vbm-regression.tests.11.controller.App", {

		onInit: function() {

			var oVBIHTML = this.byId("vbi1"),
				oVBINATIVE = this.byId("vbi2");

			$.getJSON("media/vbduet/main.json", function(data) {
				oVBIHTML.load(data);
				oVBINATIVE.load(data);
			});
		},

		onSetPie: function() {
			var oVBIHTML = this.byId("vbi1"),
				oVBINATIVE = this.byId("vbi2");

			$.getJSON("media/vbduet/new_pie.json", function(data) {
				oVBIHTML.load(data);
				oVBINATIVE.load(data);
			});
		},

		onSetBox: function() {
			var oVBIHTML = this.byId("vbi1"),
				oVBINATIVE = this.byId("vbi2");

			$.getJSON("media/vbduet/new_block.json", function(data) {
				oVBIHTML.load(data);
				oVBINATIVE.load(data);
			});
		},

		onSetDetailWindow: function() {
			var oVBIHTML = this.byId("vbi1"),
				oVBINATIVE = this.byId("vbi2");

			$.getJSON("media/vbduet/opendetail.json", function(data) {
				oVBIHTML.load(data);
				oVBINATIVE.load(data);
			});
		}

	});
});

