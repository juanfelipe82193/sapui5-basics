/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/Viewer",
	"sap/ui/vk/dvl/Viewport",
	"sap/ui/vk/dvl/GraphicsCore",
	"sap/ui/vk/CameraProjectionType",
	"sap/ui/vk/CameraFOVBindingType"
], function(
	jQuery,
	ContentResource,
	Viewer,
	Viewport,
	GraphicsCore,
	CameraProjectionType,
	CameraFOVBindingType
) {
	"use strict";

	QUnit.config.testTimeout = 60000;
	QUnit.test("Loading content resources", function(assertMain) {
		var done = assertMain.async();

		var truncateValues = function(obj) {
				var objectClone = jQuery.extend(true, {}, obj);
				// We are truncating the camera position values to 2 decimals and rotation values to 3 decimals.
				// The expected position values and actual position values are different after the 2nd (3rd most of the times) decimal.
				// As per discussion with Product Owner and after testing this, the difference is negligible.
				objectClone.camera.position.x = Math.floor(objectClone.camera.position.x * 100);
				objectClone.camera.position.y = Math.floor(objectClone.camera.position.y * 100);
				objectClone.camera.position.z = Math.floor(objectClone.camera.position.z * 100);
				objectClone.camera.rotation.pitch = Math.floor(objectClone.camera.position.z * 1000);
				objectClone.camera.rotation.roll = Math.floor(objectClone.camera.position.z * 1000);
				objectClone.camera.rotation.yaw = Math.floor(objectClone.camera.position.z * 1000);
				return objectClone;
			};
			/*
				* Unit tests for the following public methods:
				* ---- buildSceneTree
				*/
		var testViewportWasCreated = function(viewport) {
			QUnit.test("Constructor", function(assert) {
				assert.ok(viewport, "The viewport is created.");
				assert.ok(viewport instanceof Viewport, "The current viewport is an instance of sap.ui.vk.dvl.Viewport");
			});
		};

		var testGetAndSetGraphicsCore = function(viewportNoGraphicsCore, viewport) {
			QUnit.test("setGraphicsCore & getGraphicsCore", function(assert) {
				assert.ok(!viewportNoGraphicsCore.getGraphicsCore(), "The viewport doesn't have a graphics core before setting it using setGraphicsCore");
				assert.ok(viewport.getGraphicsCore(), "The viewport has a graphics core after using setGraphicsCore");
				assert.propEqual(typeof viewport.getGraphicsCore(), "object", "The graphics core retrieved using getGraphicsCore is an ojbect");
				assert.ok(viewport.getGraphicsCore() instanceof GraphicsCore, "The viewport returns an instance of sap.ui.vk.dvl.GraphicsCore when calling 'getGraphicsCore()'.");
			});
		};

		var testGetViewInfo = function(savedInfo, expectedInfo) {
			var savedInfoClone = truncateValues(savedInfo);
			var expectedInfoClone = truncateValues(expectedInfo);
			QUnit.test("getViewInfo", function(assert) {
				assert.deepEqual(savedInfoClone, expectedInfoClone, "The getInfoView values of the default position are matching the expected ones.");
			});
		};

		var testGetViewInfoAfterGestures = function(savedInfo, expectedInfo) {
			var savedInfoClone = truncateValues(savedInfo);
			var expectedInfoClone = truncateValues(expectedInfo);
			QUnit.test("getViewInfo after gestures", function(assert) {
				assert.deepEqual(savedInfoClone, expectedInfoClone, "The getInfoView values retrieved after performing the gestures are matching the expected values");
			});
		};

		var testSetViewInfoToDefaultValues = function(savedInfo, expectedInfo) {
			var savedInfoClone = truncateValues(savedInfo);
			var expectedInfoClone = truncateValues(expectedInfo);
			QUnit.test("setViewInfo", function(assert) {
				assert.deepEqual(savedInfoClone, expectedInfoClone, "The camera returns to the initial position after using setViewInfo with the initial values.");
			});
		};

		var testSetViewInfoToAStep = function(savedInfo, expectedInfo) {
			QUnit.test("setViewInfo to a step", function(assert) {
				assert.deepEqual(savedInfo, expectedInfo, "setViewInfo to a view saved right after playing a step.");
			});
		};

		var testGetStepAndProcedureIndexes = function(viewport) {
			var procedures = [ {
				"name": "Procedure 1",
				"id": "i0000000300000000",
				"steps": [ {
					"name": "Step 1-1",
					"id": "i0000000300000004"
				}, {
					"name": "Step 1-2",
					"id": "i0000000300000005"
				} ]
			}, {
				"name": "Procedure 2",
				"id": "i0000000300000001",
				"steps": [ {
					"name": "Step 2-1",
					"id": "i0000000300000006"
				}, {
					"name": "Step 2-2",
					"id": "i0000000300000007"
				} ]
			} ];
			var stepId = "i0000000300000007";
			var expected = {
				stepIndex: 1,
				procedureIndex: 1
			};
			QUnit.test("_getStepAndProcedureIndexes", function(assert) {
				assert.deepEqual(viewport._getStepAndProcedureIndexes(procedures, stepId), expected, "For the preset procedures & stepId combination, we get procedureIndex = 1, stepIndex = 1.");
			});
		};

		var testResetView = function(initialInfo, infoAfterReset) {
			QUnit.test("resetView", function(assert) {
				assert.deepEqual(initialInfo, infoAfterReset, "The view was reset successfully.");
			});
		};

		var testIsolatedNode = function(invalidNode, expectedInvalidNode, isolatedNode, expectedIsolatedNode) {
			QUnit.test("getIsolatedNode & setIsolatedNode", function(assert) {
				assert.strictEqual(invalidNode, expectedInvalidNode, "Initially, getIsolatedNode retrieves an invalid node.");
				assert.strictEqual(isolatedNode, expectedIsolatedNode, "getIsolatedNode retrieves the node that we've just passed to the setIsolatedNode method.");
			});
		};

		var testDecomposeColor = function(viewport) {
			QUnit.test("_getDecomposedABGR", function(assert) {
				assert.deepEqual(viewport._getDecomposedABGR(0xFFFFFFFF), { red: 1, green: 1, blue: 1, alpha: 1 }, "0xFFFFFFFF color is decomposed to red: 1, green: 1, blue: 1, alpha: 1");
				assert.deepEqual(viewport._getDecomposedABGR(0x00000000), { red: 0, green: 0, blue: 0, alpha: 0 }, "0x00000000 color is decomposed to red: 0, green: 0, blue: 0, alpha: 0");
				assert.deepEqual(viewport._getDecomposedABGR(0xFFFF0000), { red: 0, green: 0, blue: 1, alpha: 1 }, "0xFFFF0000 color is decomposed to red: 0, green: 0, blue: 1, alpha: 1");
				assert.deepEqual(viewport._getDecomposedABGR(0xFF00FF00), { red: 0, green: 1, blue: 0, alpha: 1 }, "0xFF00FF00 color is decomposed to red: 0, green: 1, blue: 0, alpha: 1");
				assert.deepEqual(viewport._getDecomposedABGR(0xFF0000FF), { red: 1, green: 0, blue: 0, alpha: 1 }, "0xFF0000FF color is decomposed to red: 1, green: 0, blue: 0, alpha: 1");
			});
		};

		var contentResource = new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/box.vds",
			sourceType: "vds",
			sourceId: "abc"
		});

		var viewport = new Viewport();
		viewport.placeAt("content");
		testViewportWasCreated(viewport);
		testDecomposeColor(viewport);

		GraphicsCore.create({ totalMemory: 16777216 }, {
			antialias: true,
			alpha: true,
			premultipliedAlpha: false,
			preserveDrawingBuffer: true
		}).then(function(graphicsCore) {

			var viewportNoGraphicsCore = jQuery.extend(true, {}, viewport);
			viewport.setGraphicsCore(graphicsCore);
			// test setGraphicsCore & getGraphicsCore
			testGetAndSetGraphicsCore(viewportNoGraphicsCore, viewport);


			var scene;

			graphicsCore.loadContentResourcesAsync([ contentResource ], function(sourcesFailedToLoad) {
				assertMain.notOk(sourcesFailedToLoad, "The content resources have been loaded successfully.");
				if (sourcesFailedToLoad) {
					jQuery.sap.log.error("Some of content resources cannot be loaded.");
				} else {
					scene = graphicsCore.buildSceneTree([ contentResource ]);
					if (scene) {
						var savedInfo;

						viewport.setGraphicsCore(graphicsCore);
						viewport.setScene(scene);

						// test _getStepAndProcedureIndexes
						testGetStepAndProcedureIndexes(viewport);

						setTimeout(function() {
							// test getViewInfo & setViewInfo
							var defaultInfo = {
								animation: {
									animationTime: 0,
									procedureIndex: -1,
									stepIndex: -1
								},
								camera: {
									position: {
										x: 109.09067925252525,
										y: -129.07248088350804,
										z: 192.6303571779498
									},
									rotation: {
										pitch: -35.3,
										roll: -0.000309099,
										yaw: 135
									},
									bindingType: CameraFOVBindingType.Minimum,
									projectionType: CameraProjectionType.Orthographic,
									zoomFactor: 0.019742822274565697
								}
							};

							savedInfo = viewport.getViewInfo();
							testGetViewInfo(savedInfo, defaultInfo);

							// Perform some gestures and check the new info
							viewport.beginGesture(1, 1);
							viewport.rotate(20, 20);
							viewport.pan(5, 10);
							viewport.zoom(1.4);
							viewport.endGesture();

							viewport.setViewInfo(savedInfo);
							var newSavedInfo = viewport.getViewInfo();
							testGetViewInfoAfterGestures(newSavedInfo, savedInfo);

							var valuesAfterSetViewInfo;
							setTimeout(function() {
								// change the view back to the default state using setViewInfo
								viewport.setViewInfo(defaultInfo);
								valuesAfterSetViewInfo = viewport.getViewInfo();
								testSetViewInfoToDefaultValues(valuesAfterSetViewInfo, defaultInfo);
							}, 1000);

							var procedures,
								stepId;
							setTimeout(function() {
								// activate step2
								procedures = viewport._dvl.Scene.RetrieveProcedures(scene._dvlSceneRef);
								stepId = procedures.procedures[0].steps[1].id;
								viewport._dvl.Scene.ActivateStep(scene._dvlSceneRef, stepId, true, false);
							}, 3000);

							var positionAfterOneStep;
							setTimeout(function() {
								positionAfterOneStep = viewport.getViewInfo();
							}, 5000);

							setTimeout(function() {
								// Perform some gestures
								viewport.beginGesture(1, 1);
								viewport.rotate(20, 20);
								viewport.pan(5, 10);
								viewport.zoom(1.4);
								viewport.endGesture();
							}, 5500);

							setTimeout(function() {
								viewport.setViewInfo(positionAfterOneStep);
								var finalPosition = viewport.getViewInfo();
								testSetViewInfoToAStep(finalPosition, positionAfterOneStep);

								viewport.resetView();
								var infoAfterReset = viewport.getViewInfo();
								testResetView(savedInfo, infoAfterReset);

								var nodeRef = scene.getDefaultNodeHierarchy().getChildren()[0];
								var invalidNode = viewport.getIsolatedNode();
								viewport.setIsolatedNode(nodeRef);
								var isolatedNode = viewport.getIsolatedNode();
								testIsolatedNode(invalidNode, "iffffffffffffffff", isolatedNode, nodeRef);
								done();
							}, 6000);

						}, 500);
					} else {
						jQuery.sap.log.error("Failed to build the scene tree.");
					}
				}
			});
		});
	});

	QUnit.test("Visibility tests", function(assert) {
		var done = assert.async();

		var contentResourceShapes = new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/multiple_shapes.vds",
			sourceType: "vds",
			sourceId: "123"
		});

		var viewer = new Viewer({
			shouldTrackVisibilityChanges: true,
			showStepNavigation: true,
			runtimeSettings: { totalMemory: 16777216 * 2 }
		}).placeAt("content");

		// VDS file load error handler
		viewer.attachSceneLoadingFailed(function(event) {
			assert.ok(false, "The viewer scene has been loaded successfully.");
			done();
		});

		// VDS file load successfuly handler
		viewer.attachSceneLoadingSucceeded(function(event) {
			assert.ok(true, "The viewer scene has been loaded successfully.");

			var scene = viewer.getScene(),
				nodeHierarchy = scene.getDefaultNodeHierarchy(),
				allNodeRefs = nodeHierarchy.findNodesByName(),
				idToNameMap = new Map(),
				nameToIdMap = new Map();

			// populating the maps which will be used to convert from node reference to node name and viceversa
			allNodeRefs.forEach(function(nodeRef) {
				var node = nodeHierarchy.createNodeProxy(nodeRef);
				var name = node.getName();
				idToNameMap.set(nodeRef, name);
				nameToIdMap.set(name, nodeRef);
				nodeHierarchy.destroyNodeProxy(node);
			});

			// Testing showHotspots
			var hotspotNodeProxy = nodeHierarchy.createNodeProxy(allNodeRefs[0]);
			assert.strictEqual(hotspotNodeProxy.getTintColorABGR(), 0, "The default for this node is no highlight.");
			viewer.getViewport().showHotspots(allNodeRefs[0], true, 0xc00000ff);
			assert.strictEqual(hotspotNodeProxy.getTintColorABGR(), 0xc00000ff, "The node changed its tinting.");
			viewer.getViewport().showHotspots(allNodeRefs[0], false);
			assert.strictEqual(hotspotNodeProxy.getTintColorABGR(), 0, "After hiding the hotspots, there is no highlight left on that node.");

			var tests = [ {
				description: "VISIBILITY COMPLETE: only stairs visible, based on default view",
				visibleNodes: [ "stairs" ],
				viewInfo: { "camera": { "rotation": { "yaw": -173.741, "pitch": -35.4287, "roll": 4.39535 }, "position": { "x": 250.638, "y": 138.184, "z": 220.577 }, "projectionType": "orthographic", "zoomFactor": 0.0046546305529773235, "bindingType": "minimum" }, "visibility": { "visible": [ "14188108949268740586" ], "hidden": [ "14188108949268740208", "14188108949268740331", "14188108949268740211", "14188108949268740334", "14188108949268740337", "14188108949268740457", "14188108949268740460", "14188108949268740463", "14188108949268740466", "14188108949268740589" ], "mode": "complete", "compressed": false }, "animation": { "animationTime": 0, "stepIndex": -1, "procedureIndex": -1 } }
			}, {
				description: "VISIBILITY COMPLETE: only text visible based on default view + all off + text on",
				visibleNodes: [ "Text" ],
				viewInfo: { "camera": { "rotation": { "yaw": -173.741, "pitch": -35.4287, "roll": 4.39535 }, "position": { "x": 250.638, "y": 138.184, "z": 220.577 }, "projectionType": "orthographic", "zoomFactor": 0.0046546305529773235, "bindingType": "minimum" }, "visibility": { "visible": [ "14188108949268740589" ], "hidden": [ "14188108949268740208", "14188108949268740331", "14188108949268740211", "14188108949268740334", "14188108949268740337", "14188108949268740457", "14188108949268740460", "14188108949268740463", "14188108949268740466", "14188108949268740586" ], "mode": "complete", "compressed": false }, "animation": { "animationTime": 0, "stepIndex": -1, "procedureIndex": -1 } }
			}, {
				description: "VISIBILITY COMPLETE: all on based on default view + all on",
				visibleNodes: [ "box", "capsule", "cone", "cylinder", "donut", "frame", "gear", "geosphere", "helix", "stairs", "Text" ],
				viewInfo: { "camera": { "rotation": { "yaw": -173.741, "pitch": -35.4287, "roll": 4.39535 }, "position": { "x": 250.638, "y": 138.184, "z": 220.577 }, "projectionType": "orthographic", "zoomFactor": 0.0046546305529773235, "bindingType": "minimum" }, "visibility": { "visible": [ "14188108949268740208", "14188108949268740331", "14188108949268740211", "14188108949268740334", "14188108949268740337", "14188108949268740457", "14188108949268740460", "14188108949268740463", "14188108949268740466", "14188108949268740586", "14188108949268740589" ], "hidden": [], "mode": "complete", "compressed": false }, "animation": { "animationTime": 0, "stepIndex": -1, "procedureIndex": -1 } }
			}, {
				description: "VISIBILITY COMPLETE: only stairs based on 'Step 6'",
				visibleNodes: [ "stairs" ],
				viewInfo: { "camera": { "rotation": { "yaw": -166.626, "pitch": -27.5762, "roll": 7.70112 }, "position": { "x": 253.134, "y": 251.711, "z": 174.063 }, "projectionType": "orthographic", "zoomFactor": 0.03205079957842827, "bindingType": "minimum" }, "visibility": { "visible": [ "14188108949268740586" ], "hidden": [ "14188108949268740208", "14188108949268740331", "14188108949268740211", "14188108949268740334", "14188108949268740337", "14188108949268740457", "14188108949268740460", "14188108949268740463", "14188108949268740466", "14188108949268740589" ], "mode": "complete", "compressed": false }, "animation": { "animationTime": 0, "stepIndex": 5, "procedureIndex": 0 } }
			}, {
				description: "VISIBILITY COMPLETE: only gear based on 'Step 7' + hide stairs",
				visibleNodes: [ "gear" ],
				viewInfo: { "camera": { "rotation": { "yaw": -166.626, "pitch": -27.5762, "roll": 7.70212 }, "position": { "x": 274.866, "y": 176.92, "z": 166.704 }, "projectionType": "orthographic", "zoomFactor": 0.008427856490015984, "bindingType": "minimum" }, "visibility": { "visible": [ "14188108949268740460" ], "hidden": [ "14188108949268740208", "14188108949268740331", "14188108949268740211", "14188108949268740334", "14188108949268740337", "14188108949268740457", "14188108949268740463", "14188108949268740466", "14188108949268740586", "14188108949268740589" ], "mode": "complete", "compressed": false }, "animation": { "animationTime": 0, "stepIndex": 6, "procedureIndex": 0 } }
			}, {
				description: "VISIBILITY DIFFERENCES: only stairs visible, based on default view",
				visibleNodes: [ "stairs" ],
				viewInfo: { "camera": { "rotation": { "yaw": -173.741, "pitch": -35.4287, "roll": 4.39535 }, "position": { "x": 250.638, "y": 138.184, "z": 220.577 }, "projectionType": "orthographic", "zoomFactor": 0.0046546305529773235, "bindingType": "minimum" }, "visibility": { "changes": [ "14188108949268740208", "14188108949268740211", "14188108949268740331", "14188108949268740334", "14188108949268740337", "14188108949268740457", "14188108949268740460", "14188108949268740463", "14188108949268740466" ], "mode": "differences", "compressed": false }, "animation": { "animationTime": 0, "stepIndex": -1, "procedureIndex": -1 } }
			}, {
				description: "VISIBILITY DIFFERENCES: only text visible based on default view + all off + text on",
				visibleNodes: [ "Text" ],
				viewInfo: { "camera": { "rotation": { "yaw": -173.741, "pitch": -35.4287, "roll": 4.39535 }, "position": { "x": 250.638, "y": 138.184, "z": 220.577 }, "projectionType": "orthographic", "zoomFactor": 0.0046546305529773235, "bindingType": "minimum" }, "visibility": { "changes": [ "14188108949268740208", "14188108949268740211", "14188108949268740331", "14188108949268740334", "14188108949268740337", "14188108949268740457", "14188108949268740460", "14188108949268740463", "14188108949268740466", "14188108949268740586", "14188108949268740589" ], "mode": "differences", "compressed": false }, "animation": { "animationTime": 0, "stepIndex": -1, "procedureIndex": -1 } }
			}, {
				description: "VISIBILITY DIFFERENCES: all on based on default view + all on",
				visibleNodes: [ "box", "capsule", "cone", "cylinder", "donut", "frame", "gear", "geosphere", "helix", "stairs", "Text" ],
				viewInfo: { "camera": { "rotation": { "yaw": -173.741, "pitch": -35.4287, "roll": 4.39535 }, "position": { "x": 250.638, "y": 138.184, "z": 220.577 }, "projectionType": "orthographic", "zoomFactor": 0.0046546305529773235, "bindingType": "minimum" }, "visibility": { "changes": [ "14188108949268740589" ], "mode": "differences", "compressed": false }, "animation": { "animationTime": 0, "stepIndex": -1, "procedureIndex": -1 } }
			}, {
				description: "VISIBILITY DIFFERENCES: only stairs based on 'Step 6'",
				visibleNodes: [ "stairs" ],
				viewInfo: { "camera": { "rotation": { "yaw": -166.626, "pitch": -27.5762, "roll": 7.70112 }, "position": { "x": 253.134, "y": 251.711, "z": 174.063 }, "projectionType": "orthographic", "zoomFactor": 0.03205079957842827, "bindingType": "minimum" }, "visibility": { "changes": [], "mode": "differences", "compressed": false }, "animation": { "animationTime": 0, "stepIndex": 5, "procedureIndex": 0 } }
			}, {
				description: "VISIBILITY DIFFERENCES: only gear based on 'Step 7' + hide stairs",
				visibleNodes: [ "gear" ],
				viewInfo: { "camera": { "rotation": { "yaw": -166.626, "pitch": -27.5762, "roll": 7.70212 }, "position": { "x": 274.866, "y": 176.92, "z": 166.704 }, "projectionType": "orthographic", "zoomFactor": 0.008427856490015984, "bindingType": "minimum" }, "visibility": { "changes": [ "14188108949268740586" ], "mode": "differences", "compressed": false }, "animation": { "animationTime": 0, "stepIndex": 6, "procedureIndex": 0 } }
			} ];

			var testCounter = 0;
			var timer = setInterval(function() {
				if (testCounter < tests.length) {
					// setting the current view info
					viewer.getViewport().setViewInfo(tests[testCounter].viewInfo);
					// checking each node reference to see if it's visible or not
					allNodeRefs.forEach(function(nodeRef) {
						var nodeName = idToNameMap.get(nodeRef),
							visibilityState = viewer.getViewStateManager().getVisibilityState(nodeRef),
							shouldBeVisible = tests[testCounter].visibleNodes.indexOf(nodeName) !== -1;
						assert.strictEqual(visibilityState, shouldBeVisible, tests[testCounter].description + " => " + nodeName + ": " + (visibilityState ? "visible" : "not visible"));
					});
					testCounter++;
				} else {
					clearInterval(timer);
					done();
				}
			}, 1000);
		});

		viewer.addContentResource(contentResourceShapes);
	});

	QUnit.test("Freeze camera", function(assert){
		var done = assert.async();

		var contentResource = new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/box.vds",
			sourceType: "vds",
			sourceId: "abc"
		});

		var viewer = new Viewer().placeAt("content");

		viewer.addContentResource(contentResource);

		viewer.attachSceneLoadingSucceeded(function(event) {

			// check default value
			assert.equal(viewer.getViewport().getFreezeCamera(), false);

			// get initial camera position
			var initialCamera = viewer.getViewport().getViewInfo().camera;

			// freeze camera
			viewer.getViewport().setFreezeCamera(true);
			assert.equal(viewer.getViewport().getFreezeCamera(), true);

			var vp = viewer.getViewport().getImplementation();
			// try to rotate
			vp.beginGesture(1, 1);
			vp.rotate(20, 20);
			vp.endGesture();
			assert.deepEqual(viewer.getViewport().getViewInfo().camera, initialCamera);

			// try to pan
			vp.beginGesture(1, 1);
			vp.pan(5, 10);
			vp.endGesture();
			assert.deepEqual(viewer.getViewport().getViewInfo().camera, initialCamera);

			// try to zoom
			vp.beginGesture(1, 1);
			vp.zoom(1.4);
			vp.endGesture();
			assert.deepEqual(viewer.getViewport().getViewInfo().camera, initialCamera);

			// try to double click
			vp.beginGesture(1, 1);
			vp.tap(1, 1, true);
			vp.endGesture();
			assert.deepEqual(viewer.getViewport().getViewInfo().camera, initialCamera);

			// unfreeze camera
			viewer.getViewport().setFreezeCamera(false);
			assert.equal(viewer.getViewport().getFreezeCamera(), false);


			done();
		});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
