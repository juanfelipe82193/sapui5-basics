sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("samples.table.Main", {
		onInit: function() {
			window._measure.result["view_init"] = performance.now();
		},
		onAfterRendering: function() {
			window._measure.result["view_end"] = performance.now();
			var oRowModel = new sap.ui.model.json.JSONModel(window._measure);
			this.getView().setModel(oRowModel);
			var that = this;
			setTimeout(function() {
				var oView = that.getView();
				if (window._getUrlParameter("usexml") === "yes" && window._getUrlParameter("caching") === "local") {
					var sCacheKey = document.location.search.substring(1);
					localStorage.setItem(sCacheKey, (new XMLSerializer()).serializeToString(oView._xContent));
				}
				if (oView.getViewName() && oView.getMetadata().getName() === "sap.ui.core.mvc.XMLView") {
					var oXML = sap.ui.core.XMLTemplateProcessor.loadTemplate(oView.getViewName(), "view");
					if (window._getUrlParameter("storeflow") === "yes") {
						window._addFlow("before_initial_templating", (new XMLSerializer()).serializeToString(oXML));
						window._addFlow("final_view", (new XMLSerializer()).serializeToString(oView._xContent));
					}
				} else if (!oView.getViewName()){
					window._addFlow("final_view", (new XMLSerializer()).serializeToString(oView._xContent));
				} else {
					window._addFlow("jsview", "X");
				}
				window.parent.reportMeasurements(JSON.parse(JSON.stringify(window._measure.result)));
			}, 500);
		}
	});
});
