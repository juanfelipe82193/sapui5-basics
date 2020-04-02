sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function(Controller, UIComponent) {
	"use strict";

	return Controller.extend("sap.ui.demo.chartdemo.controller.BaseController", {
		getRouter: function() {
			return UIComponent.getRouterFor(this);
		},
		parseURL: function(oEvent) {
			var args = oEvent.getParameter('arguments');
			var parameters, temp;
			var urlInfo = {
				chartIndex: {id: 0},
				colorIndex: {id: 1},
				popoverIndex: {id: 2},
				measureIndex: {id: 3}
			};
			if (args.chartIndex) { // translate url parameters by type
				parameters = args.chartIndex;
				temp = parameters.split('&');
				for (var i = 0; i < temp.length; ++i) {
					temp[i] = temp[i].split('=').pop();
				}
				for (var elem in urlInfo) {
					urlInfo[elem].value = temp[urlInfo[elem].id];
				}
			}
			return urlInfo;
		},
		onExit: function() {
			if (typeof this.onModelLoaded === "function") {
				this.getEventBus().unsubscribe("model", "loaded", this.onModelLoaded, this);
			}
		},
	});
});
