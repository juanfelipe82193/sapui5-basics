sap.ui.define([
	"sap/ui/demo/chartdemo/controller/BaseController",
	"sap/ui/Device",
	"sap/ui/core/mvc/View"
], function(BaseController, Device, View) {
	"use strict";

	var lastMeasure = ""; // to keep at least one measure for the url

	return BaseController.extend("sap.ui.demo.chartdemo.controller.Master", {

		onChartTypeChanged: function() {
			//just tell the detail to call
			var par = "";
			var measure = "";

			//way 1: by route
			var arr = this.byId('MeasureList').getSelectedItems();
			var itemPros = [];
			for (var i = arr.length - 1; i >= 0; i--) {
				itemPros[i] = arr[i].mProperties.title;
				measure = measure + itemPros[i];
			}
			if (measure) {
				lastMeasure = measure;
			}
			if (!measure) {
				measure = lastMeasure;
			}
			par = "chartType=" + this.byId("select").getSelectedKey() + "&" + 
				"color=" + this.byId("selectColor").getSelectedKey() + "&" +
				"tooltip=" + this.byId('selectPopover').getSelectedKey() + "&" +
				"measureNames=" + measure;
			this.getRouter().navTo("idoVizFrame2", {
				'chartIndex': par
			}, false);
		},

		onInit: function() {
			if (Device.system.phone) {
				return;
			}
			this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function(oEvent) {
			var urlInfo = this.parseURL(oEvent);
			this.byId("select").setSelectedKey(urlInfo.chartIndex.value);
			this.byId("selectColor").setSelectedKey(urlInfo.colorIndex.value);
			this.byId("selectPopover").setSelectedKey(urlInfo.popoverIndex.value);
			var hasValidURL = false;
			for (var elem in urlInfo) {
				if (urlInfo[elem].hasOwnProperty('value')) {
					hasValidURL = true;
				}
			}
			if (hasValidURL) {
				var parameters = urlInfo.measureIndex.value;
				var measures = [];
				var startIdx = 0;
				parameters.split('').forEach(function(elem, idx) {
					if (elem.toLowerCase() !== elem && idx !== startIdx) {
						measures.push(parameters.substring(startIdx, idx));
						startIdx = idx;
					}
					if (idx === parameters.length - 1) {
						measures.push(parameters.substring(startIdx, parameters.length));
					}
				});
				this.byId("Profit").setSelected(false);
				this.byId("Cost").setSelected(false);
				this.byId("Revenue").setSelected(false);
				for (var i = 0; i < measures.length; ++i) {
					this.byId(measures[i]).setSelected(true);
				}
			}
			//Load the detail view in desktop
			var myRouter = this.getRouter();
			var oOptions = {
				currentView: this.getView(),
				targetViewName: "sap.ui.demo.chartdemo.view.Detail",
				targetViewType: "XML"
			};
			var oControl = oOptions.currentView;
			var findSplitApp = (function() {
				return  function fn(oControl) {
					var sAncestorControlName = "idAppControl";
					if (oControl instanceof View && oControl.byId(sAncestorControlName)) {
						return oControl.byId(sAncestorControlName);
					}
					return oControl.getParent() ? fn(oControl.getParent(), sAncestorControlName) : null;
				};
			})();
			var oSplitApp = findSplitApp(oControl);
			var oView = myRouter.getView(oOptions.targetViewName, oOptions.targetViewType);
			oSplitApp.addPage(oView, oOptions.isMaster);
			oSplitApp.to(oView.getId(), oOptions.transition || "show", oOptions.data);
		},

		showDetail: function(oItem) {
			var bReplace = Device.is.phone ? false : true;
			UIComponent.getRouterfor(this).navTo("idoVizFrame2", {
				chartType: '1'
			},
			bReplace);
		}
	});
});
