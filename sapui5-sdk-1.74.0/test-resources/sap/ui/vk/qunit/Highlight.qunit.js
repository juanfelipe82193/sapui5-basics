/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/Highlight",
	"sap/ui/vk/View",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/threejs/HighlightPlayer",
	"sap/ui/vk/HighlightDisplayState",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	jQuery,
	Highlight,
	View,
	ViewStateManager,
	Viewport,
	HighlightPlayer,
	HighlightDisplayState,
	loader
) {
	"use strict";

	var viewStateManager = new ViewStateManager();
	var viewport = new Viewport({ viewStateManager: viewStateManager });
	viewport.placeAt("content");

	QUnit.moduleWithContentConnector("Material", "test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", "threejs.test.json", function(assert) {
		viewport.setContentConnector(this.contentConnector);
		viewStateManager.setContentConnector(this.contentConnector);
	});

	QUnit.test("Highlight", function(assert) {
		var done = assert.async();
		var scene = viewport.getScene();

		var id1 = "1";
		var param1 = { duration: 0.0,
						cycles: 0,
						name: "highlight1",
						opacities: [ 0.5, 0.6 ],
						colours: [ [ 1.0, 0.0, 0.0, 1.0 ], [ 0.0, 1.0, 0.0, 1.0 ] ] };

		var highlight1 = scene.createHighlight(id1, param1);
		assert.deepEqual(highlight1, scene.getHighlight(id1), "scene createHighlight");

		assert.equal(highlight1.getId(), id1, "getDuration of static highlight");
		assert.equal(highlight1.getDuration(), 0.0, "getDuration of highlight");
		assert.equal(highlight1.getCycles(), 0, "getCycles of highlight");
		assert.equal(highlight1.getName(), "highlight1", "getName of highlight");
		assert.deepEqual(highlight1.getOpacities(), [ 0.5, 0.6 ], "getOpacities of highlight");
		assert.deepEqual(highlight1.getColours(), [ [ 1.0, 0.0, 0.0, 1.0 ], [ 0.0, 1.0, 0.0, 1.0 ] ], "getColours of static highlight");

		var result;
		result = highlight1.getOpacity(3);
		assert.equal(result.opacity, 0.5, "getOpacity of static highlight at a time");
		assert.equal(result.isCompleted, true, "getOpacity of static highlight at a time");
		result = highlight1.getColour(3);
		assert.deepEqual(result.colour, [ 1.0, 0.0, 0.0, 1.0 ], "getColour of static highlight at a time");
		assert.equal(result.isCompleted, true, "getColour of static highlight at a time");

		var s1 = scene.removeHighlight(id1);
		assert.equal(s1.getHighlight(id1), undefined, "scene removeHighlight");

		var id2 = "2";
		var highlight2 = scene.createHighlight(id2);
		assert.equal(highlight2.getDuration(), 0.0, "getDuration default value of highlight");
		assert.equal(highlight2.getCycles(), 0, "getCycles default value of highlight");
		assert.equal(highlight2.getName(), "", "getName defaule value of highlight");
		assert.deepEqual(highlight2.getOpacities(), [ ], "getOpacities defaule value of highlight");
		assert.deepEqual(highlight2.getColours(), [ ], "getColours defaule value of highlight");

		highlight2.setName("highlight2");
		highlight2.setDuration(2.0);
		highlight2.setCycles(2);
		highlight2.setOpacities([ 0.5, 1.0, 0.5, 1.0 ]);
		highlight2.setColours([ [ 1.0, 1.0, 1.0, 1.0 ], [ 0.5, 0.5, 0.5, 0.5 ] ]);

		assert.equal(highlight2.getDuration(), 2.0, "setDuration of highlight");
		assert.equal(highlight2.getCycles(), 2, "setCycles of highlight");
		assert.equal(highlight2.getName(), "highlight2", "setName of highlight");
		assert.deepEqual(highlight2.getOpacities(), [ 0.5, 1.0, 0.5, 1.0 ], "setOpacities of highlight");
		assert.deepEqual(highlight2.getColours(), [ [ 1.0, 1.0, 1.0, 1.0 ], [ 0.5, 0.5, 0.5, 0.5 ] ], "setColours  of highlight");

		result = highlight2.getOpacity(0);
		assert.equal(result.opacity, 0.5, "getOpacity of finit highlight at the start of 1st cycle");
		assert.equal(result.isCompleted, false, "getOpacity of finit highlight at the start of 1st cycle");
		assert.equal(highlight2.getOpacity(0.5).opacity, 1.0, "getOpacity of finit highlight at the 1st time of 1st cycle");
		assert.equal(highlight2.getOpacity(1).opacity, 0.5, "getOpacity of finit highlight at the 2nd time of 1st cycle");
		assert.equal(highlight2.getOpacity(2).opacity, 0.5, "getOpacity of finit highlight at the start of 2nd cycle");
		assert.equal(highlight2.getOpacity(3).opacity, 0.5, "getOpacity of finit highlight at the 1st time of 2nd cycle");
		assert.equal(highlight2.getOpacity(3.5).opacity, undefined, "getOpacity of finit highlight at the end of 2nd cycle");
		assert.equal(highlight2.getOpacity(4.5).opacity, undefined, "getOpacity of finit highlight outside playing cycle");
		assert.equal(highlight2.getOpacity(7).opacity, undefined, "getOpacity of finit highlight outside playing cycle");

		assert.deepEqual(highlight2.getColour(0).colour, [ 1.0, 1.0, 1.0, 1.0 ], "getColour of finite highlight at the start of 1st cycle");
		assert.deepEqual(highlight2.getColour(0.5).colour, [ 0.75, 0.75, 0.75, 0.75 ], "getColour of finite highlight within 1st cycle");
		assert.deepEqual(highlight2.getColour(1).colour, [ 0.5, 0.5, 0.5, 0.5 ], "getColour of finite highlight at the end of 1st cycle");
		assert.deepEqual(highlight2.getColour(1.5).colour, [ 0.75, 0.75, 0.75, 0.75 ], "getColour of finite highlight between 1st and 2nd cycles");
		assert.deepEqual(highlight2.getColour(2).colour, [ 1.0, 1.0, 1.0, 1.0 ], "getColour of finite highlight at the start of 2ndcycle");
		result = highlight2.getColour(3);
		assert.deepEqual(result.colour, undefined, "getColour of finite highlight at the end of 2nd cycle");
		assert.equal(result.isCompleted, true, "getColour of finite highlight at the end of 2nd cycle");
		assert.deepEqual(highlight2.getColour(8).colour, undefined, "getColour of finite highlight outside playing cycle");

		highlight2.setCycles(0);

		assert.equal(highlight2.getOpacity(0).opacity, 0.5, "getOpacity of infinit highlight at the start of 1st cycle");
		assert.equal(highlight2.getOpacity(0.25).opacity, 0.75, "getOpacity of infinit highlight at the 1st time of 1st cycle");
		assert.equal(highlight2.getOpacity(1).opacity, 0.5, "getOpacity of infinit highlight at the 2nd time of 1st cycle");
		assert.equal(highlight2.getOpacity(1.5).opacity, 1.0, "getOpacity of infinit highlight at the end of 1st cycle");
		result = highlight2.getOpacity(2.0);
		assert.equal(result.opacity, 0.5, "getOpacity of infinit highlight at the start of 2nd cycle");
		assert.equal(result.isCompleted, false, "getOpacity of infinit highlight at the start of 2nd cycle");
		assert.equal(highlight2.getOpacity(2.5).opacity, 1.0, "getOpacity of infinit highlight at the 1st time of 2nd cycle");
		assert.equal(highlight2.getOpacity(2.75).opacity, 0.75, "getOpacity of infinit highlight at the 2nd time of 2nd cycle");
		result = highlight2.getOpacity(3.5);
		assert.equal(result.opacity, 1.0,  "getOpacity of infinit highlight at the end of 2nd cycle");
		assert.equal(result.isCompleted, false, "getOpacity of infinit highlight at the end of 2nd cycle");
		assert.equal(highlight2.getOpacity(60).opacity, 0.5, "getOpacity of infinit highlight at start of 30th cycle");
		assert.equal(highlight2.getOpacity(60.5).opacity, 1.0, "getOpacity of infinit highlight within 30th cycle");
		assert.equal(highlight2.getOpacity(62).opacity, 0.5, "getOpacity of infinit highlight at the end of 30th cycle");

		assert.deepEqual(highlight2.getColour(0).colour, [ 1.0, 1.0, 1.0, 1.0 ], "getColour of infinite highlight at start time");
		assert.deepEqual(highlight2.getColour(0.5).colour, [ 0.75, 0.75, 0.75, 0.75 ], "getColour of infinite highlight within 1st cycle");
		assert.deepEqual(highlight2.getColour(1).colour, [ 0.5, 0.5, 0.5, 0.5 ], "getColour of infinite highlight at the end of 1st cycle");
		assert.deepEqual(highlight2.getColour(1.5).colour, [ 0.75, 0.75, 0.75, 0.75 ], "getColour of infinite highlight between 1st and 2nd cycle");
		assert.deepEqual(highlight2.getColour(3).colour, [ 0.5, 0.5, 0.5, 0.5 ], "getColour of infinite highlight at the end of 2nd cycle");
		assert.deepEqual(highlight2.getColour(60).colour, [ 1.0, 1.0, 1.0, 1.0 ], "getColour of infinite highlight at start of 30th cycle");
		result = highlight2.getColour(60.5);
		assert.deepEqual(result.colour, [ 0.75, 0.75, 0.75, 0.75 ], "getColour of infinite highlight within 30th cycle");
		assert.equal(result.isCompleted, false, "getColour of infinite highlight within 30th cycle");


		var getNodesWithMeshChildren = function(parent, nodes) {
			if (parent && parent.children && parent.children.length && parent.children[0] instanceof THREE.Mesh) {
				nodes.push(parent);
			}

			if (parent && parent.children && parent.children.length > 0) {
				var oi;
				for (oi = 0; oi < parent.children.length; oi += 1) {
					getNodesWithMeshChildren(parent.children[ oi ], nodes);
				}
			}
		};

		var nodes = [];
		getNodesWithMeshChildren(scene.getSceneRef(), nodes);

		var view = scene.createView({});
		view.addHighlightedNodes("1", nodes[0]);
		view.addHighlightedNodes("2", nodes[1]);
		view.addHighlightedNodes("3", nodes[2]);
		assert.deepEqual(view.getHighlightIdNodesMap().get("1"), [ nodes[0] ], "highlighted node1 is inserted into view");
		assert.deepEqual(view.getHighlightIdNodesMap().get("2"), [ nodes[1] ], "highlighted node1 is inserted into view");
		assert.deepEqual(view.getHighlightIdNodesMap().get("3"), [ nodes[2] ], "highlighted node1 is inserted into view");

		var player = new HighlightPlayer();
		player.reset(view, scene);
		assert.ok(player._highlightsNodesMap.size > 0, "highlight player is reset");

		player.start(500);
		assert.ok(player._state === HighlightDisplayState.playing && player._startTime === 500, "start playing highlightt");

		assert.ok(player.play(1000) && player._timeElapsed === 500, "playing highlightt");

		player.pause(1500);
		assert.ok(player._state === HighlightDisplayState.pausing && player._timeElapsed === 1000, "pause playing highlightt");

		player.start(2500);
		assert.ok(player.play(2500) && player._state === HighlightDisplayState.playing && player._startTime === 1500, "resume playing highlightt");

		player.stop();
		assert.ok(!player.play(2500) && player._state === HighlightDisplayState.stopped, "stopped playing highlightt");


		done();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
