sap.ui.define([
	"sap/suite/ui/commons/library",
	"sap/suite/ui/commons/networkgraph/layout/LayoutAlgorithm",
	"sap/suite/ui/commons/networkgraph/layout/LayoutTask"
], function (library, LayoutAlgorithm, LayoutTask) {

	var LayoutRenderType = library.networkgraph.LayoutRenderType;

	return LayoutAlgorithm.extend("sap.suite.ui.commons.sample.NetworkGraphCarFactory.CustomLayout", {
		getLayoutRenderType: function () {
			return LayoutRenderType.LayeredWithGroups;
		},
		layout: function () {
			return new LayoutTask(function (fnResolve, fnReject, oLayoutTask) {
				// The task might have been canceled by a newer update call. Do not update graph as it might collide
				// with another layout task.
				if (oLayoutTask.isTerminated()) {
					fnResolve();
					return;
				}

				var oGraph = this.getParent(),
					aNodes = oGraph.getNodes(),
					aLines = oGraph.getLines(),
					oNode1Center, oNode2Center, oNode3Center;

				aNodes[0].setX(30);
				aNodes[0].setY(120);

				aNodes[1].setX(250);
				aNodes[1].setY(250);

				aNodes[2].setX(5);
				aNodes[2].setY(30);

				oNode1Center = aNodes[0].getCenterPosition();
				oNode2Center = aNodes[1].getCenterPosition();
				oNode3Center = aNodes[2].getCenterPosition();

				// !IMPORTANT
				// don't use direct aggregation methods in this function (like addCoordinate) as it would
				// trigger invalidate to the graph and throw code in the never ending loop (as line is not rendered yet
				// and invalidate throws invalidation to its parent).
				// these methods does not trigger invalidate.
				aLines[0].setSource({
					x: oNode1Center.x,
					y: oNode1Center.y
				});

				aLines[0].setTarget({
					x: oNode2Center.x,
					y: oNode2Center.y
				});

				// !IMPORTANT
				// before adding bends you have to add target and source
				aLines[0].addBend({
					x: 140,
					y: oNode1Center.y
				});

				aLines[0].addBend({
					x: 140,
					y: oNode2Center.y
				});

				// second line
				// by default you should use rectangular bend line but graph can display this one too
				// you have to take care of arrow position tho
				// either by setting it to the middle (this case) or by moving end (start) of the line
				aLines[1].setSource({
					x: oNode3Center.x,
					y: oNode3Center.y
				});

				aLines[1].setTarget({
					x: oNode1Center.x,
					y: oNode1Center.y
				});

				fnResolve();
			}.bind(this));
		}
	});
});
