sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Popover",
	"sap/m/ListBase",
	"sap/m/StandardListItem",
	"sap/m/Select",
	"sap/ui/core/Item",
	"sap/suite/ui/commons/networkgraph/layout/SwimLaneChainLayout"
], function (Controller, JSONModel, Popover, ListBase, StandardListItem, Select, Item, SwimLaneChainLayout) {

	var oPageController = Controller.extend("sap.suite.ui.commons.sample.NetworkGraphSwimLane.NetworkGraph", {
		onInit: function () {
			var oGraph,
				sModuleName = "sap.suite.ui.commons.sample.NetworkGraphSwimLane",
				oModel = new JSONModel(jQuery.sap.getModulePath(sModuleName, "/graph.json"));

			this.getView().setModel(oModel);
			this.setUpOrientationSelect();

			oGraph = this.byId("graph");
			oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		},
		setUpOrientationSelect: function () {
			var oGraph = this.byId("graph"),
				oToolbar = this.byId("graph-toolbar"),
				oOrientation = new Select();

			[
				{key: "LeftRight", text: "Left to right"},
				{key: "RightLeft", text: "Right to left"},
				{key: "TopBottom", text: "Top to bottom"},
				{key: "BottomTop", text: "Bottom to top"}
			].forEach(function (o) {
				oOrientation.addItem(new Item(o));
			});
			oOrientation.setSelectedKey("LeftRight");
			oOrientation.attachChange(function (oEvent) {
				var sKey = oEvent.getParameter("selectedItem").getKey();
				oGraph.setOrientation(sKey);
			});
			oToolbar.insertContent(oOrientation, 0);
		}
	});

	return oPageController;
});