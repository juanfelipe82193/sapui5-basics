sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel"
], function(Controller, JSONModel, MockServer, ODataModel) {
	"use strict";

	return Controller.extend("sap.gantt.simple.test.UtilizationChart", {

		onInit : function() {
			var sServiceUrl = "http://my.test.service.com/";
			var oMockServer = new MockServer({
				rootUri : sServiceUrl
			});

			oMockServer.simulate("odata/metadata.xml", {
				sMockdataBaseUrl : "odata/",
				bGenerateMissingMockData : false
			});

			oMockServer.start();
			var oDataModel = new ODataModel(sServiceUrl, {
				useBatch: true,
				refreshAfterChange: false
			});

			oDataModel.setDefaultBindingMode("TwoWay");
			oDataModel.setSizeLimit(5000);
			this.getView().setModel(oDataModel, "data");

			this.oFormatter = sap.ui.core.format.DateFormat.getDateInstance();
		},

		urlFor: function(sId) {
			var that = this;
			return function(sId) {
				return "url(#" + that.getView().byId(sId).getId() + ")";
			};
		},
		dimensionTooltip: function(sFrom, sTo, sValue) {
			return "From: " + this.oFormatter.format(sFrom) + "\n" +
					"To :"  + this.oFormatter.format(sTo) + "\n" +
					"Value: " + sValue;
		},

		ubcPeriodItemTooltip: function(supply, demand) {
			var aTexts = ["Capacity: " + supply, "Required Capacity: " + demand];
			if (demand > supply) {
				aTexts.push("Over Capacity: " + (demand - supply));
			}
			return aTexts.join("\n");
		}
	});
});
