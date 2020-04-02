sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Popover",
	"sap/m/ListBase",
	"sap/m/StandardListItem",
	"sap/suite/ui/commons/networkgraph/layout/NoopLayout"
], function (Controller, JSONModel, Popover, ListBase, StandardListItem, NoopLayout) {

	var oPageController = Controller.extend("sap.suite.ui.commons.sample.NetworkGraphAirports.NetworkGraph", {
		onInit: function () {
			var oGraph,
				sModuleName = "sap.suite.ui.commons.sample.NetworkGraphAirports",
				oModel = new JSONModel(jQuery.sap.getModulePath(sModuleName, "/graph.json"));

			this.getView().setModel(oModel);

			oGraph = this.byId("graph");
			oGraph.setLayoutAlgorithm(new NoopLayout());
			oGraph.setBackgroundImage(jQuery.sap.getModulePath(sModuleName, "/europe.jpg"));
			oGraph.attachAfterLayouting(this.hideExpand.bind(oGraph));
		},
		hideExpand: function () {
			var aNodes = this.getNodes();

			for (var i = 0; i < aNodes.length; i++) {
				if (aNodes[i].getChildNodes().length == 0) {
					aNodes[i].setShowExpandButton(false);
				}
			}
		},
		routeButtonPress: function (oEvent) {
			var oNode = oEvent.getSource().getParent(),
				aParentNodes = oNode.getParentNodes(),
				aChildNodes = oNode.getChildNodes(),
				oAirportsList = new ListBase({
					noDataText: "No destination"
				}),
				aAirports = aChildNodes.concat(aParentNodes);

			aAirports.sort(function (oItem1, oItem2) {
				return oItem1.getTitle().localeCompare(oItem2.getTitle());
			});

			for (var i = 0; i < aAirports.length; i++) {
				oAirportsList.addItem(new StandardListItem({
					title: aAirports[i].getTitle()
				}));
			}

			if (!this._oPopover) {
				this._oPopover = new Popover();
			}

			this._oPopover.destroyContent();
			this._oPopover.setTitle(oNode.getTitle());
			this._oPopover.addContent(oAirportsList);
			this._oPopover.openBy(oEvent.getParameter("buttonElement"));
		}
	});

	return oPageController;
});