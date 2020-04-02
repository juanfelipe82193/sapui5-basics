/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/Scene",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/thirdparty/three",
	"sap/ui/vk/colorToCSSColor",
	"sap/ui/vk/colorToABGR"
], function(
	jQuery,
	Scene,
	ViewStateManager,
	three,
	colorToCSSColor,
	colorToABGR
) {
	"use strict";

	var getAllChildMeshNodes = function(parent, meshNodes) {
		if (parent && parent instanceof THREE.Mesh) {
			meshNodes.push(parent);
		}

		if (parent && parent.children && parent.children.length > 0) {
			var oi;
			for (oi = 0; oi < parent.children.length; oi += 1) {
				getAllChildMeshNodes(parent.children[ oi ], meshNodes);
			}
		}
	};

	var getAllChildNodes = function(parent, childNodes) {
		if (parent && !(parent.geometry && (parent.name === "" || parent.name === undefined))) {
			childNodes.push(parent);
		}

		if (parent && parent.children && parent.children.length > 0) {
			var oi;
			for (oi = 0; oi < parent.children.length; oi += 1) {
				getAllChildNodes(parent.children[ oi ], childNodes);
			}
		}
	};

	var getParentNodeWithMoreThanOneMeshes = function(object) {
		while (object && object.parent) {
			var meshNodes = [];
			getAllChildMeshNodes(object.parent, meshNodes);
			if (meshNodes.length > 2) {
				return object.parent;
			}
			object = object.parent;
		}
	};

	QUnit.test("Three JS ViewStateManager", function(assert) {
		var done = assert.async();
		var test = 0;

		var testVisibility = function(viewStateManager, originallySelectedNode) {
			viewStateManager.setVisibilityState(originallySelectedNode, true, false);
			assert.deepEqual(viewStateManager.getVisibilityState(originallySelectedNode), true, "Setting visibility true");

			viewStateManager.setVisibilityState(originallySelectedNode, false, false);
			assert.deepEqual(viewStateManager.getVisibilityState(originallySelectedNode), false, "Setting visibility false");

			var parent = getParentNodeWithMoreThanOneMeshes(originallySelectedNode);
			var children = [];
			getAllChildNodes(parent, children);

			viewStateManager.setVisibilityState(parent, true, true);
			viewStateManager.getVisibilityState(children).forEach(function(state) {
				assert.deepEqual(state, true, "Setting visibility true recursively");
			});

			viewStateManager.setVisibilityState(parent, false, true);
			viewStateManager.getVisibilityState(children).forEach(function(state) {
				assert.deepEqual(state, false, "Setting visibility false recursively");
			});

			// TODO - call getVisibilityChanges to test VEIDs of changed nodes
		};

		var getCurrentOpacity = function(nodeRef) {
			if (nodeRef.material) {
				return nodeRef.material.opacity;
			}
		};

		var testOpacity = function(viewStateManager, originallySelectedNode) {
			var originalOpacity = getCurrentOpacity(originallySelectedNode);
			var opacity = 0.5;

			viewStateManager.setOpacity(originallySelectedNode, opacity, false);
			var returnedOpacity = viewStateManager.getOpacity(originallySelectedNode);
			var currentOpacity = getCurrentOpacity(originallySelectedNode);
			assert.ok(Math.abs(opacity - returnedOpacity) < 0.0000001 && Math.abs(opacity - currentOpacity) < 0.0000001, "Setting opacity works ok");

			var parent = getParentNodeWithMoreThanOneMeshes(originallySelectedNode);
			var children = [];
			getAllChildNodes(parent, children);

			viewStateManager.setOpacity(originallySelectedNode, null, false);
			returnedOpacity = viewStateManager.getOpacity(originallySelectedNode);
			currentOpacity = getCurrentOpacity(originallySelectedNode);
			assert.ok(returnedOpacity == null && Math.abs(originalOpacity - currentOpacity) < 0.0000001, "Removing opacity works ok");
		};

		var getCurrentColor = function(nodeRef) {
			if (nodeRef && nodeRef.material) {
				var color = {
					red: Math.round(nodeRef.material.color.r * 255),
					green: Math.round(nodeRef.material.color.g * 255),
					blue: Math.round(nodeRef.material.color.b * 255),
					alpha: nodeRef.material.opacity
				};
				return colorToABGR(color);
			}
		};

		var testTintColor = function(viewStateManager, originallySelectedNode) {
			var parent = getParentNodeWithMoreThanOneMeshes(originallySelectedNode);
			var children = [];
			getAllChildNodes(parent, children);
			var originalNodeColor = getCurrentColor(originallySelectedNode);

			var color = { red: 255, green: 150, blue: 0, alpha: 1 };
			var colorRGBA = colorToABGR(color);

			viewStateManager.setTintColor(originallySelectedNode, colorRGBA, false);
			var returnedColor = viewStateManager.getTintColor(originallySelectedNode, true);
			var currentNodeColor = getCurrentColor(originallySelectedNode);
			assert.ok(colorRGBA == returnedColor && colorRGBA == currentNodeColor, "Setting tint color works ok");

			viewStateManager.setTintColor(parent, colorRGBA, true);
			var colorOK = true;
			var ni;
			for (ni = 0; ni < children.length; ni++) {
				var returnColor = viewStateManager.getTintColor(children[ ni ], true);
				currentNodeColor = getCurrentColor(children[ ni ]);

				if (returnColor && returnColor !== colorRGBA) {
					colorOK = false;
				}

				if (currentNodeColor && currentNodeColor !== colorRGBA) {
					colorOK = false;
				}
			}
			assert.ok(colorOK, "Setting tint color recursively works ok");

			viewStateManager.setTintColor(originallySelectedNode, null, false);
			returnedColor = viewStateManager.getTintColor(originallySelectedNode, true);
			currentNodeColor = getCurrentColor(originallySelectedNode);
			assert.ok(returnedColor == undefined && originalNodeColor == currentNodeColor, "Removing tint color works ok");

			viewStateManager.setTintColor(parent, null, true);
			colorOK = true;
			for (ni = 0; ni < children.length; ni++) {
				var returnTintColor = viewStateManager.getTintColor(children[ ni ], true);
				currentNodeColor = getCurrentColor(children[ ni ]);

				if (returnTintColor) {
					colorOK = false;
				}

				if (currentNodeColor && currentNodeColor === colorRGBA) {
					colorOK = false;
				}
			}
			assert.ok(colorOK, "Removing tint color recursively works ok");
		};

		var testSelection = function(viewStateManager, originallySelectedNode, testNodeName) {
			var parent = getParentNodeWithMoreThanOneMeshes(originallySelectedNode);
			var children = [];
			getAllChildNodes(parent, children);
			var originalNodeColor = getCurrentColor(originallySelectedNode);
			var highlightingColor = 0xFF123456;
			viewStateManager.setHighlightColor(highlightingColor);

			viewStateManager.setSelectionState(originallySelectedNode, true, false);
			var currentNodeColor = getCurrentColor(originallySelectedNode);
			var selected = viewStateManager.getSelectionState(originallySelectedNode);
			assert.ok(selected && highlightingColor == currentNodeColor, "Selecting signal node works ok");

			viewStateManager.setSelectionState(originallySelectedNode, false, false);
			currentNodeColor = getCurrentColor(originallySelectedNode);
			selected = viewStateManager.getSelectionState(originallySelectedNode);
			assert.ok(!selected && originalNodeColor == currentNodeColor, "Deselecting signal node works ok");

			viewStateManager.setSelectionState(parent, true, true);
			var colorOK = true;
			var ni;
			for (ni = 0; ni < children.length; ni++) {
				selected = viewStateManager.getSelectionState(children[ni]);
				currentNodeColor = getCurrentColor(children[ ni ]);

				if (!selected) {
					colorOK = false;
				}

				if (currentNodeColor && currentNodeColor !== highlightingColor) {
					colorOK = false;
				}
			}
			assert.ok(colorOK, "Selecting recursively works ok");

			viewStateManager.setSelectionState(parent, false, true);
			colorOK = true;
			for (ni = 0; ni < children.length; ni++) {
				selected = viewStateManager.getSelectionState(children[ni]);
				currentNodeColor = getCurrentColor(children[ ni ]);

				if (selected) {
					colorOK = false;
				}

				if (currentNodeColor && currentNodeColor !== originalNodeColor) {
					colorOK = false;
				}
			}
			assert.ok(colorOK, "Deselecting recursively works ok");

			var nodes = [ parent.parent, parent, parent.children[ 0 ], parent.children[ 1 ], parent.children[ 2 ] ];

			viewStateManager.setSelectionState(nodes[ 0 ], false, true);
			assert.deepEqual(viewStateManager.getSelectionState(nodes), [ false, false, false, false, false ], "All nodes are deselected.");

			viewStateManager.setSelectionState(nodes[ 0 ], true, false);
			assert.deepEqual(viewStateManager.getSelectionState(nodes), [ true, false, false, false, false ], "Only the root parent is selected.");

			viewStateManager.setRecursiveSelection(true);
			viewStateManager.setSelectionState(nodes[ 0 ], true, false);
			assert.deepEqual(viewStateManager.getSelectionState(nodes), [ true, true, true, true, true ], "All nodes are selected.");

			viewStateManager.setRecursiveSelection(false);
			viewStateManager.setSelectionState(nodes[ 3 ], false, false);
			assert.deepEqual(viewStateManager.getSelectionState(nodes), [ true, true, true, false, true ], "Only one child is deselected.");

			viewStateManager.setRecursiveSelection(true);
			viewStateManager.setSelectionState(nodes[ 3 ], false, false);
			assert.deepEqual(viewStateManager.getSelectionState(nodes), [ false, false, true, false, true ], "One child and ancestors are deselected.");

			viewStateManager.setSelectionState(nodes[ 3 ], true, false);
			assert.deepEqual(viewStateManager.getSelectionState(nodes), [ false, false, true, true, true ], "Children are selected, ancestors are deselected.");
		};

		var testOutlining = function(viewStateManager, topNode) {

			viewStateManager.setOutlineColor(0x00FFFF00);
			var outliningColor = viewStateManager.getOutlineColor(true);
			var cssOutlineColor = viewStateManager.getOutlineColor(false);
			assert.ok(outliningColor === 0x00FFFF00 && cssOutlineColor === "rgba(0,255,255,0)", "Outline color is ok");

			viewStateManager.setOutlineWidth(2.0);
			var outliningWidth = viewStateManager.getOutlineWidth();
			assert.ok(outliningWidth === 2.0, "Outline width is ok");

			viewStateManager.setOutliningStates(topNode, [], false, true);
			assert.deepEqual(viewStateManager.getOutliningState(topNode), true, "One node is outlined.");

			viewStateManager.setOutliningStates([], topNode, false, true);
			assert.deepEqual(viewStateManager.getOutliningState(topNode), false, "One node is unoutlined.");

			var children = [];
			getAllChildNodes(topNode, children);

			var i;
			var outlined = [];
			var unoutlined = [];
			for (i = 0; i < children.length; i++){
				outlined.push(true);
				unoutlined.push(false);
			}

			viewStateManager.setOutliningStates(children, [], false, true);
			assert.deepEqual(viewStateManager.getOutliningState(children), outlined, "Multiple nodes are outlined.");

			viewStateManager.setOutliningStates([], children, false, true);
			assert.deepEqual(viewStateManager.getOutliningState(children), unoutlined, "Multiple nodes are unoutlined.");

			viewStateManager.setOutliningStates(topNode, [], true, false);
			assert.deepEqual(viewStateManager.getOutliningState(children), outlined, "Nodes are outlined recursively.");

			viewStateManager.setOutliningStates([], topNode, true, false);
			assert.deepEqual(viewStateManager.getOutliningState(children), unoutlined, "Nodes are unoutlined recursively.");
		};

		var testLightingColor = function(viewStateManager) {

			var originalColor = { red: 255, green: 0, blue: 0, alpha: 1.0 };
			var setColor = { red: 10, green: 50, blue: 50, alpha: 0.4 };

			var originalColorRBGA = colorToABGR(originalColor);
			var setColorRBGA = colorToABGR(setColor);

			var originalColorCSS = colorToCSSColor(originalColor);
			var setColorCSS = colorToCSSColor(setColor);

			assert.equal(originalColorRBGA, viewStateManager.getHighlightColor(true), "original highligh color RBGA is ok");
			assert.equal(originalColorCSS, viewStateManager.getHighlightColor(), "original highligh color CSS is ok");

			viewStateManager.setHighlightColor(setColorRBGA);
			assert.equal(setColorRBGA, viewStateManager.getHighlightColor(true), "setting highlighting color RBGA is ok");

			viewStateManager.setHighlightColor(setColorCSS);
			assert.equal(setColorRBGA, viewStateManager.getHighlightColor(true), "setting highlighting color CSS is ok");
		};

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			// use the last mesh node as the selected node
			var meshNodes = [];
			getAllChildMeshNodes(nativeScene, meshNodes);
			var originallySelectedNode = meshNodes[ meshNodes.length - 1 ];

			// find the parent of the selected node
			var parent = getParentNodeWithMoreThanOneMeshes(originallySelectedNode);
			// find all the children of parent node
			var selectedNodesWithCallback = [];
			getAllChildMeshNodes(parent, selectedNodesWithCallback);

			testVisibility(viewStateManager, originallySelectedNode);
			testOpacity(viewStateManager, originallySelectedNode);
			testTintColor(viewStateManager, originallySelectedNode);
			testLightingColor(viewStateManager);
			testSelection(viewStateManager, originallySelectedNode);

			testOutlining(viewStateManager, obj);

			test++;
			if (test === 2) {
				done();
			}
		};

		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/stand_foot_rests.asm.json", testFunction);
		loader.load("test-resources/sap/ui/vk/qunit/media/chair.json", testFunction);
	});

	QUnit.test("BulkOperations - visibility", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var meshNodes = [];
			getAllChildMeshNodes(nativeScene, meshNodes);

			var currentVisibility = viewStateManager.getVisibilityState(meshNodes);
			var makeVisibleCount = 0, makeHiddenCount = 0;
			var invertedVisibility = currentVisibility.map(function(item) {
				if (!item) {
					makeVisibleCount++;
				} else {
					makeHiddenCount++;
				}

				return !item;
			});

			viewStateManager.attachEventOnce("visibilityChanged", function(event) {
				var visible = event.getParameter("visible");
				var hidden = event.getParameter("hidden");

				assert.ok(Array.isArray(visible), "visible event parameter ok");
				assert.ok(visible.length === makeVisibleCount, "visible element count ok");
				assert.ok(Array.isArray(hidden), "hidden event parameter ok");
				assert.ok(hidden.length === makeHiddenCount, "hidden element count ok");

				done();
			});

			viewStateManager.setVisibilityState(meshNodes, invertedVisibility);
		};

		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/stand_foot_rests.asm.json", testFunction);

	});

	QUnit.test("BulkOperations - opacity", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var meshNodes = [];
			getAllChildMeshNodes(nativeScene, meshNodes);

			var currentOpacity = viewStateManager.getOpacity(meshNodes);
			var changedNodesCount = Math.min(3, currentOpacity.length);

			var changedOpacity = currentOpacity.map(function(item, idx) {
				if (idx >= changedNodesCount) {
					return item;
				}
				return idx;
			});

			viewStateManager.attachEventOnce("opacityChanged", function(event) {
				var changed = event.getParameter("changed");
				var opacity = event.getParameter("opacity");

				assert.ok(Array.isArray(changed), "nodes array ok");
				assert.equal(changed.length, changedNodesCount, "nodes array element count ok");
				assert.ok(Array.isArray(opacity), "opacity array ok");
				assert.equal(opacity.length, changedNodesCount, "opacity array count ok");

				done();
			});

			viewStateManager.setOpacity(meshNodes, changedOpacity);
		};

		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/stand_foot_rests.asm.json", testFunction);

	});

	QUnit.test("BulkOperations - tint color", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var meshNodes = [];
			getAllChildMeshNodes(nativeScene, meshNodes);

			var currentTint = viewStateManager.getTintColor(meshNodes);
			var changedNodesCount = Math.min(3, currentTint.length);

			var changedTint = currentTint.map(function(item, idx) {
				if (idx >= changedNodesCount) {
					return item;
				}
				return idx;
			});

			viewStateManager.attachEventOnce("tintColorChanged", function(event) {
				var changed = event.getParameter("changed");
				var tintColor = event.getParameter("tintColor");
				var tintColorABGR = event.getParameter("tintColorABGR");

				assert.ok(Array.isArray(changed), "nodes array ok");
				assert.equal(changed.length, changedNodesCount, "nodes array element count ok");
				assert.ok(Array.isArray(tintColor), "tint color array ok");
				assert.equal(tintColor.length, changedNodesCount, "tint color array count ok");
				assert.ok(Array.isArray(tintColorABGR), "tint color ABGR array ok");
				assert.equal(tintColorABGR.length, changedNodesCount, "tint color ABGR array count ok");

				done();
			});

			viewStateManager.setTintColor(meshNodes, changedTint);
		};

		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/stand_foot_rests.asm.json", testFunction);

	});

	QUnit.test("three.js ViewStateManager.setJoints", function(assert) {
		var done = assert.async();

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			var nodes = [];
			for (var i = 5; i < 32; i++) {
				nodes[ i ] = obj.getChildByName("Box #" + i);
			}

			var d1 = 1.234;
			var d2 = 2.345;
			var d3 = 3.456;
			var d4 = 4.567;
			var d5 = 5.678;
			var d6 = 6.789;

			var joints = [
				{
					node: nodes[ 7 ],  // (7) < 23 < (6) < 25
					parent: nodes[ 23 ],
					translation: [ 0, 0, d6 ]
				}, {
					node: nodes[ 14 ], // (14) < (22) < 18 < (10) < 11
					parent: nodes[ 22 ],
					translation: [ 0, d5, 0 ]
				}, {
					node: nodes[ 6 ],  // (6) < 25
					parent: nodes[ 25 ],
					translation: [ d4, 0, 0 ]
				}, {
					node: nodes[ 22 ], // (22) < 18 < (10) < 11
					parent: nodes[ 18 ],
					translation: [ 0, 0, d3 ]
				}, {
					node: nodes[ 10 ], // (10) < 11
					parent: nodes[ 11 ],
					translation: [ d1, 0, 0 ]
				}, {
					node: nodes[ 12 ], // (12) < 17 < 16 < (10) < 11
					parent: nodes[ 17 ],
					translation: [ 0, d2, 0 ]
				}
			];
			joints.forEach(function(joint) {
				joint.quaternion = [ 0, 0, 0, 1 ];
				joint.scale = [ 1, 1, 1 ];
			});
			viewStateManager.setJoints(joints);

			function testArrayOfNodes(a, b, message) {
				assert.deepEqual(typeof a, typeof b, message);
				if (b) {
					assert.deepEqual(a.length, b.length, message);
					b.forEach(function(node, index) {
						assert.deepEqual(a[ index ].name, node.name, message + index);
					});
				}
			}

			function indexToNode(index) {
				return nodes[ index ];
			}

			function testNodePosition(node, x, y, z, message) {
				assert.deepEqual(node.matrixWorld.elements[ 12 ], x, message + " x");
				assert.deepEqual(node.matrixWorld.elements[ 13 ], y, message + " y");
				assert.deepEqual(node.matrixWorld.elements[ 14 ], z, message + " z");
			}

			var order = [ 6, 7, 10, 22, 14, 12 ].map(indexToNode);
			var nodesToUpdate = [ [ 23 ].map(indexToNode), undefined, [ 18, 16, 17 ].map(indexToNode), undefined, undefined, undefined ];
			joints = viewStateManager.getJoints();
			assert.deepEqual(joints.length, order.length, "VSM joint count");
			joints.forEach(function(joint, index) {
				assert.deepEqual(joint.node.name, order[ index ].name, "joints[" + index + "] order test");
				testArrayOfNodes(joint.nodesToUpdate, nodesToUpdate[ index ], "joints[" + index + "] nodesToUpdate test");
			});

			nativeScene.updateMatrixWorld(true);
			testNodePosition(nodes[ 6 ], 0, 0, 50, "nodes[6] origin position");       // 5 > 6 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[ 7 ], 0, 50, 50, "nodes[7] origin position");      // 5 > 7 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[ 11 ], 0, 0, 50, "nodes[10] origin position");     // 5 > 11 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[ 10 ], 0, 0, 50, "nodes[10] origin position");     // 5 > 10 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[ 22 ], 0, 50, 50, "nodes[22] origin position");    // 6 > 22 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[ 23 ], 0, 50, 50, "nodes[23] origin position");    // 6 > 23 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[ 16 ], 0, 0, 50, "nodes[16] origin position");     // 10 > 16 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[ 17 ], 0, 50, 50, "nodes[17] origin position");    // 16 > 17 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[ 18 ], 0, 50, 50, "nodes[18] origin position");    // 10 > 18 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[ 12 ], 0, -100, -10, "nodes[12] origin position"); // 5 > 9 > 12 {x: 0, y: 0, z: -60}
			testNodePosition(nodes[ 14 ], 0, -100, 50, "nodes[14] origin position");  // 9 > 14 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[ 25 ], 0, 50, 50, "nodes[25] origin position");    // 9 > 13 > 25 {x: 0, y: 160, z: 100}

			// nodes.forEach(function(node) {
			// 	console.log(node.name, node.position, node.matrixWorld.elements);
			// });

			viewStateManager._updateJointNodes();

			// nodes.forEach(function(node) {
			// 	console.log(">", node.name, node.matrixWorld.elements);
			// });

			testNodePosition(nodes[ 11 ], 0, 0, 50, "nodes[11] position");             // 5 > 11 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[ 10 ], d1, 0, 50, "nodes[10] position");            // 11 > (10) pos(d1, 0, 0)
			testNodePosition(nodes[ 16 ], d1, 0, 50, "nodes[16] position");            // (10) > 16 {x: 0, y: 0, z: 0}
			testNodePosition(nodes[ 17 ], d1, 50, 50, "nodes[17] position");           // 16 > 17 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[ 12 ], d1, 50 + d2, 50, "nodes[12] position");      // 17 > (12) pos(0, d2, 0)
			testNodePosition(nodes[ 18 ], d1, 50, 50, "nodes[18] origin position");    // (10) > 18 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[ 22 ], d1, 50, 50 + d3, "nodes[22] position");      // 18 > (22) pos(0, 0, d3)
			testNodePosition(nodes[ 14 ], d1, 50 + d5, 50 + d3, "nodes[22] position"); // (22) > (14) pos(0, d5, 0)
			testNodePosition(nodes[ 25 ], 0, 50, 50, "nodes[25] position");            // 9 > 13 > 25 {x: 0, y: 160, z: 100}
			testNodePosition(nodes[ 6 ], d4, 50, 50, "nodes[6] position");             // 25 > (6) pos(d4, 0, 0)
			testNodePosition(nodes[ 23 ], d4, 100, 50, "nodes[23] position");          // (6) > 23 {x: 0, y: 50, z: 0}
			testNodePosition(nodes[ 7 ], d4, 100, 50 + d6, "nodes[7] position");       // 23 > (7) pos(0, 0, d6)

			done();
		};

		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", testFunction);

	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
