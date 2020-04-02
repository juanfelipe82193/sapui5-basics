sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("vbm-regression.tests.07.controller.App", {

		onInit: function() {

			var vbi1 = this.byId("vbi1"),
				vbi2 = this.byId("vbi2"),
				vbi3 = this.byId("vbi3")

			$.getJSON("media/scale/main.json", function(dat) {
				vbi1.load(dat);
			});

			$.getJSON("media/scale/miles.json", function(dat) {
				vbi2.load(dat);
			});

			$.getJSON("media/scale/nauticalmiles.json", function(dat) {
				vbi3.load(dat);
			});

		}

	});
});
