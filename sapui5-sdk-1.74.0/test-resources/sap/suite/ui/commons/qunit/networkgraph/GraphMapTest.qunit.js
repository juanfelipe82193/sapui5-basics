sap.ui.define([
	"./TestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (GraphTestUtils, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	document.body.setAttribute("style", "height: 100%;");
	var html = document.getElementsByTagName('html')[0];
	html.setAttribute("style", "height: 100%;");

	QUnit.module("Network graph map");

	QUnit.test("Map triggers map ready & unique id test for Buttons.", function (assert) {
		var mContent = GraphTestUtils.buildGraphWithMap({
				nodes: [
					{
						key: 0,
						title: "Title"
					}
				]
			}, {
				directRenderNodeLimit: 0
			}),
			fnDone = assert.async();

		assert.expect(3);
		var sIdNode = mContent.graph.getNodes()[0].getId(),
			sIdMap = mContent.map.getId(),
			sLeftButtons = "-leftdivbuttons",
			sRightButtons = "-rightdivbuttons",
			sIdLeftButtons = sIdNode + sIdMap + sLeftButtons,
			sIdRightButtons = sIdNode + sIdMap + sRightButtons;

		mContent.map.attachMapReady(function () {
			assert.ok(true, "Map should trigger ready event.");
			assert.equal(this.$().find(".sapSuiteUiCommonsNetworkGraphDivActionButtons")[0].id,sIdLeftButtons, "LeftButtons id contains sufix map");
			assert.equal(this.$().find(".sapSuiteUiCommonsNetworkGraphDivActionButtons")[1].id,sIdRightButtons, "RightButtons id contains sufix map");
			fnDone();
			mContent.all.destroy();
		});

		mContent.all.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Replacing graph rerenders map.", function (assert) {
		var mContent = GraphTestUtils.buildGraphWithMap({
				nodes: [
					{
						key: 0
					}
				]
			}, {
				directRenderNodeLimit: 0
			}),
			fnDone = assert.async(),
			oSecondGraph = GraphTestUtils.buildGraph({
				nodes: [
					{
						key: 0
					},
					{
						key: 1
					}
				],
				lines: [
					{
						from: 0,
						to: 1
					}
				]
			}),
			bFirstRun = true,
			aPromisses = [
				new Promise(function (resolve, reject) {
					mContent.map.attachMapReady(resolve);
				}),
				new Promise(function (resolve, reject) {
					oSecondGraph.attachGraphReady(resolve);
				})
			];

		assert.expect(2);
		mContent.all.addItem(oSecondGraph);

		Promise.all(aPromisses).then(function () {
			assert.equal(mContent.map.$().find(".sapSuiteUiCommonsNetworkGraphDivNode").size(), 1, "There should be only one node.");
			mContent.map.setGraph(oSecondGraph);
			bFirstRun = false;
		});

		mContent.map.attachMapReady(function () {
			if (!bFirstRun) {
				assert.equal(mContent.map.$().find(".sapSuiteUiCommonsNetworkGraphDivNode").size(), 2, "There should be two nodes.");
				fnDone();
				mContent.all.destroy();
			}
		});

		mContent.all.placeAt("content");
		sap.ui.getCore().applyChanges();
	});
});
