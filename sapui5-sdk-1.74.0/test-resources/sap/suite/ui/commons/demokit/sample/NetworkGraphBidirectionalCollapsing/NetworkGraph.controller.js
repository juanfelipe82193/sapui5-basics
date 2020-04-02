sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/OverflowToolbarButton",
	"sap/suite/ui/commons/networkgraph/util/Dijkstra"
], function (Controller, JSONModel, OverflowToolbarButton, Dijkstra) {

	var STATUS_ICON = "sap-icon://notification-2",
		LEFT_ARROW = "sap-icon://navigation-left-arrow",
		RIGHT_ARROW = "sap-icon://navigation-right-arrow";

	function hasHiddenParent(oNode) {
		return oNode.getParentNodes().some(function (n) {
			return n.isHidden();
		});
	}

	function hasHiddenChild(oNode) {
		return oNode.getChildNodes().some(function (n) {
			return n.isHidden();
		});
	}

	function fixNodeState(oNode) {
		if (oNode.isHidden()) {
			return;
		}
		var bHasHiddenSiblings = false;
		var oButton = oNode.getActionButtons()[0];
		if (oNode.getParentNodes().length === 0) {
			oButton.setEnabled(false);
			oNode.getActionButtons()[1].setEnabled(false);
		} else {
			if (hasHiddenParent(oNode)) {
				bHasHiddenSiblings = true;
				oButton.setIcon(LEFT_ARROW);
				oButton.setTitle("Expand");
			} else {
				oButton.setIcon(RIGHT_ARROW);
				oButton.setTitle("Collapse");
			}
		}
		oButton = oNode.getActionButtons()[2];
		if (oNode.getChildNodes().length === 0) {
			oButton.setEnabled(false);
			oNode.getActionButtons()[3].setEnabled(false);
		} else {
			if (hasHiddenChild(oNode)) {
				bHasHiddenSiblings = true;
				oButton.setIcon(RIGHT_ARROW);
				oButton.setTitle("Expand");
			} else {
				oButton.setIcon(LEFT_ARROW);
				oButton.setTitle("Collapse");
			}
		}
		oNode.setStatusIcon(bHasHiddenSiblings ? STATUS_ICON : undefined);
	}

	return Controller.extend("sap.suite.ui.commons.sample.NetworkGraphBidirectionalCollapsing.NetworkGraph", {
		onInit: function () {
			var sModuleName = "sap.suite.ui.commons.sample.NetworkGraphBidirectionalCollapsing",
				oModel = new JSONModel(jQuery.sap.getModulePath(sModuleName, "/graph.json")),
				oView = this.getView(),
				oGraph = oView.byId("graph");

			function hideChildNodes(oNode) {
				oNode.getChildNodes().forEach(function (oChild) {
					oChild.setHidden(true);
					hideChildNodes(oChild);
				});
			}
			function hideParentNodes(oNode) {
				oNode.getParentNodes().forEach(function (oParent) {
					oParent.setHidden(true);
					hideParentNodes(oParent);
				});
			}
			function hideAllNodes() {
				var oVisibleNode = oGraph.getNodeByKey("19");
				if (oVisibleNode) {
					hideChildNodes(oVisibleNode);
					hideParentNodes(oVisibleNode);
					oVisibleNode.setStatusIcon(STATUS_ICON);
					fixNodeState(oVisibleNode);
					oGraph.scrollToElement(oVisibleNode);
				}
			}

			oView.setModel(oModel);
			oGraph.attachBeforeLayouting(hideAllNodes);
			oGraph.getToolbar().addContent(new OverflowToolbarButton({
				icon: "sap-icon://collapse-all",
				tooltip: "Collapse all nodes",
				type: "Transparent",
				press: hideAllNodes
			}));
			oGraph.attachSelectionChange(this.selectionChange, this);
		},
		selectionChange: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("items");
			if (oSelectedItem.length !== 1) {
				return;
			}
			oSelectedItem = oSelectedItem[0];
			var oGraph = this.getView().byId("graph"),
				aSelectedNodes = oGraph.getNodes().filter(function (oNode) {
				return oNode.getSelected();
			});
			if (aSelectedNodes.length === 2) {
				oGraph.getLines().forEach(function (oLine) {
					oLine.setStatus("Standard");
				});
				if (oSelectedItem !== aSelectedNodes[0] && oSelectedItem !== aSelectedNodes[1]) {
					oSelectedItem = aSelectedNodes[0];
				}
				var oFrom = (aSelectedNodes[0] === oSelectedItem) ? aSelectedNodes[1] : aSelectedNodes[0],
					oTo = oSelectedItem,
					oDijkstra = new Dijkstra(oGraph, oFrom, {bIgnoreDirections: true, bIgnoreCollapsed: true});
				var aPath = oDijkstra.getShortestPathTo(oTo);
				aPath.forEach(function (oLine) {
					oLine.setStatus("Warning");
				});
			}
		},
		leftExpandPressed: function (oEvent) {
			var oNode = oEvent.getSource().getParent();
			var bExpand = hasHiddenParent(oNode);
			oNode.getParentNodes().forEach(function (oChild) {
				oChild.setHidden(!bExpand);
			});
			oNode.getParentNodes().forEach(function (oChild) {
				fixNodeState(oChild);
				oChild.getParentNodes().forEach(fixNodeState);
				oChild.getChildNodes().forEach(fixNodeState);
			});
		},
		leftMultiExpandPressed: function (oEvent) {
			var oNode = oEvent.getSource().getParent();
			var aNodes = [];
			function getParents(oNode) {
				oNode.getParentNodes().forEach(function (n) {
					aNodes.push(n);
					getParents(n);
				});
			}
			getParents(oNode);
			aNodes.forEach(function (n) {
				n.setHidden(false);
			});
			aNodes.forEach(function (n) {
				fixNodeState(n);
				n.getParentNodes().forEach(fixNodeState);
				n.getChildNodes().forEach(fixNodeState);
			});
		},
		rightExpandPressed: function (oEvent) {
			var oNode = oEvent.getSource().getParent();
			var bExpand = hasHiddenChild(oNode);
			oNode.getChildNodes().forEach(function (oChild) {
				oChild.setHidden(!bExpand);
			});
			oNode.getChildNodes().forEach(function (oChild) {
				fixNodeState(oChild);
				oChild.getParentNodes().forEach(fixNodeState);
				oChild.getChildNodes().forEach(fixNodeState);
			});
		},
		rightMultiExpandPressed: function (oEvent) {
			var oNode = oEvent.getSource().getParent();
			var aNodes = [];
			function getChildren(oNode) {
				oNode.getChildNodes().forEach(function (n) {
					aNodes.push(n);
					getChildren(n);
				});
			}
			getChildren(oNode);
			aNodes.forEach(function (n) {
				n.setHidden(false);
			});
			aNodes.forEach(function (n) {
				fixNodeState(n);
				n.getParentNodes().forEach(fixNodeState);
				n.getChildNodes().forEach(fixNodeState);
			});
		}
	});
});
