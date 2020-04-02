sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	var oPageController = Controller.extend("sap.suite.ui.commons.sample.NetworkGraphStaticForce.NetworkGraph", {
		onInit: function () {
			var oModel = new JSONModel(jQuery.sap.getModulePath(
				"sap.suite.ui.commons.sample.NetworkGraphStaticForce",
				"/graph.json"));
			oModel.setSizeLimit(Number.MAX_SAFE_INTEGER);
			this.getView().setModel(oModel);

			this.oModelSettings = new JSONModel({
				maxIterations: 200,
				maxTime: 500,
				initialTemperature: 200,
				coolDownStep: 1
			});
			this.getView().setModel(this.oModelSettings, "settings");

			this.oGraph = this.byId("graph");
			this.oGraph._fZoomLevel = 0.75;
		},
		removeStatuses: function () {
			// Memorize original statuses
			if (!this.mStatuses) {
				this.mStatuses = {};
				this.oGraph.getNodes().forEach(function (oNode) {
					this.mStatuses[oNode.getKey()] = oNode.getStatus();
				}.bind(this));
			}
			this.oGraph.getNodes().forEach(function (oNode) {
				oNode.setStatus(null);
			});
		},
		refreshStatuses: function () {
			this.oGraph.getNodes().forEach(function (oNode) {
				oNode.setStatus(this.mStatuses[oNode.getKey()]);
			}.bind(this));
		},
		freeRangeMarvel: function () {
			this.oGraph.getLayoutAlgorithm().setStaticNodes([]);
			this.oGraph.getLayoutAlgorithm().setOptimalDistanceConstant(0.26);
			this.refreshStatuses();
		},
		fixedAvengersTimeline: function () {
			this.removeStatuses();
			this.oGraph.getLayoutAlgorithm().setStaticNodes([0, 1, 5, 6, 10, 19, 20]);
			[0, 1, 5, 6, 10, 19, 20].forEach(function (i) {
				this.oGraph.getNodes()[i].setStatus(this.mStatuses[i]);
			}.bind(this));
			this.oGraph.getNodes().forEach(function (oNode) {
				var iYear = Number(oNode.getAttributes()[0].getValue().split(" ")[2]);
				oNode.setX((iYear - 2007) * 100);
				oNode.setY(500);
			});
			this.oGraph.getLayoutAlgorithm().setOptimalDistanceConstant(0.31);
		},
		thorCaptainStandoff: function () {
			var oNode;

			this.removeStatuses();
			this.oGraph.getLayoutAlgorithm().setStaticNodes([3, 7, 12, 4, 8, 14]);
			[3, 7, 12].forEach(function (i, iIndex) {
				oNode = this.oGraph.getNodes()[i];
				oNode.setX(iIndex * 240);
				oNode.setY(250);
				oNode.setStatus(this.mStatuses[oNode.getKey()]);
			}.bind(this));
			[4, 8, 14].forEach(function (i, iIndex) {
				oNode = this.oGraph.getNodes()[i];
				oNode.setX(iIndex * 240);
				oNode.setY(750);
				oNode.setStatus(this.mStatuses[oNode.getKey()]);
			}.bind(this));
			this.oGraph.getLayoutAlgorithm().setOptimalDistanceConstant(0.27);
		},
		arcOfSecondaryHeroes: function () {
			var oNode, iArcSize = 500;

			this.removeStatuses();
			this.oGraph.getLayoutAlgorithm().setStaticNodes([2, 9, 11, 13, 15, 16, 17, 18]);
			[2, 9, 11, 13, 15, 16, 17, 18].forEach(function (i, iIndex) {
				oNode = this.oGraph.getNodes()[i];
				oNode.setX((Math.cos(Math.PI + (iIndex * Math.PI / 7)) + 1) * iArcSize);
				oNode.setY((Math.sin(Math.PI + (iIndex * Math.PI / 7)) + 2) * iArcSize);
				oNode.setStatus(this.mStatuses[oNode.getKey()]);
			}.bind(this));

			this.oGraph.getLayoutAlgorithm().setOptimalDistanceConstant(0.28);
			this.refreshStatuses();
		}
	});

	return oPageController;
});