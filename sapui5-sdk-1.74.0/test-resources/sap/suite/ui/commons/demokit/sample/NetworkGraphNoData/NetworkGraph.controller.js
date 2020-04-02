sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/OperationMode",
	"sap/ui/table/sample/TableExampleUtils",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, MockServer, ODataModel, JSONModel, OperationMode, TableExampleUtils, Filter, FilterOperator) {
	"use strict";

	var sServiceUrl = "http://my.test.service.com/";

	return Controller.extend("sap.suite.ui.commons.sample.NetworkGraphNoData.NetworkGraph", {

		onInit: function () {
			this.oMockServer = new MockServer({
				rootUri: sServiceUrl
			});

			MockServer.config({autoRespondAfter: 3000});

			var sMockDataPath = sap.ui.require.toUrl("sap/suite/ui/commons/sample/NetworkGraphNoData/");
			this.oMockServer.simulate(sMockDataPath + "/metadata.xml", {
				sMockdataBaseUrl: sMockDataPath,
				bGenerateMissingMockData: true
			});

			this.oMockServer.start();

			var oView = this.getView();
			oView.setModel(new ODataModel(sServiceUrl));

			var oContainer = this.getContainer();
			// graph uses own internal busy indicator, so its better to set busy indicator of the parent
			// it makes loading more smooth
			oContainer.setBusy(true);
			oContainer.setBusyIndicatorDelay(0);

			this.initBindingEventHandler();
		},

		onExit: function () {
			this.oMockServer.destroy();
			this.oMockServer = null;
			MockServer.config({autoRespondAfter: 0});
		},
		getGraph: function () {
			return this.byId("graph");
		},
		changeData: function (oEvent) {
			var sKey = oEvent.getParameter("item").getKey(),
				oBinding = this.getGraph().getBinding("nodes");

			if (sKey === "nodata") {
				var oFilter = new Filter({
					path: "key",
					value1: "XXXXX",
					operator: FilterOperator.EQ
				});

				oBinding.filter(oFilter);
			} else {
				oBinding.filter(null);
			}

			this.getContainer().setBusy(true);
		},
		getContainer: function () {
			return this.byId("container");
		},
		initBindingEventHandler: function () {
			var oGraph = this.getGraph(),
				oContainer = this.getContainer(),
				oBinding = oGraph.getBinding("nodes");

			oBinding.attachDataReceived(function (oEvent) {
				var aResults = oEvent.getParameter("data").results,
					bHasData = aResults.length > 0;

				oContainer.setBusy(false);
				oGraph.setNoData(!bHasData);
			});
		}
	});

});
