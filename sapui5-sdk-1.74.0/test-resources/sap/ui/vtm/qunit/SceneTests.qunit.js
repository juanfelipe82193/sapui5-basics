/* global QUnit*/

sap.ui.define([
    "sap/ui/vtm/library"
], function(
    lib
) {
    "use strict";

    QUnit.test("sceneTests", function (assert) {
        var panelId = "panel1";
        var vtm = new sap.ui.vtm.createVtm();
        vtm.getExtensionByInterface("sap.ui.vtm.interfaces.IDisplayStateCalculationExtension").setEnabled(false);

        vtm._addPanel(vtm.createPanel(panelId))
        var panel = vtm.getPanel(panelId);
        var scene = vtm.getScene();

        // viewport set/get scene tests
        var viewport = panel.getViewport();
        viewport._setScene(scene);
        assert.equal(scene, viewport.getScene());

        var viewable = new sap.ui.vtm.Viewable({
            source: "test-resources/sap/ui/vtm/models/Skateboard.vds"
        });
        var viewableName = "Valid Viewable";
        viewable.setName(viewableName);
        assert.ok(viewable.getName() === viewableName);

        var invalidViewable = new sap.ui.vtm.Viewable({
            source: "test-resources/sap/ui/vtm/models/invalidViewable.vds"
        });

        var viewableId = viewable.getId();

        var done = assert.async();

        scene.attachDownloadCompleted(function (downloadCompletedEvent) {
            var viewableLoadInfos = downloadCompletedEvent.getParameter("viewableLoadInfos");
            assert.equal(1, viewableLoadInfos.length);

            var viewableLoadInfo = viewableLoadInfos[0];
            assert.equal(viewableId, viewableLoadInfo.getViewable().getId());
            assert.equal(sap.ui.vtm.ViewableLoadStatus.Downloaded, viewableLoadInfo.getStatus());
            assert.ok(!viewableLoadInfo.getErrorCode());
            assert.ok(!viewableLoadInfo.getErrorText());
        });

        scene.attachLoadCompleted(function (loadCompletedEvent) {

            var succeeded = loadCompletedEvent.getParameter("succeeded");
            assert.ok(succeeded);

            // loaded viewables
            var loadedViewables = scene.getLoadedViewables();
            assert.ok(loadedViewables && loadedViewables.length === 1 && loadedViewables[0] === viewable);
            // build TreeItems from VDS scene hierarchy
            var treeRoots = new Array();
            var treeItemsBySceneNodeId = new Map();

            var testRootNodes = true;

            scene.traverseTree(function (sceneNode) {

                var sceneNodeId = sceneNode.getSceneNodeId()
                var treeItem = {
                    id: jQuery.sap.uid(),
                    name: sceneNode.getName(),
                    absoluteMatrix: sceneNode.getAbsoluteMatrix(),
                    relativeMatrix: sceneNode.getRelativeMatrix(),
                    metadata: sceneNode.getNodeMetadata(),
                    identifiers: sceneNode.getIdentifiers(),
                    sceneNodeIds: [sceneNodeId],
                    visibility: true
                };

                treeItemsBySceneNodeId.set(sceneNodeId, treeItem);

                var parentSceneNodeId = scene.getParentId(sceneNodeId);
                if (parentSceneNodeId) {
                    var parentTreeItem = treeItemsBySceneNodeId.get(parentSceneNodeId);
                    sap.ui.vtm.TreeItemUtilities.addIncludedChild(parentTreeItem, treeItem);
                } else {
                    treeRoots.push(treeItem);
                    if (testRootNodes) {
                        // first root node is not closed
                        assert.ok(!sceneNode.getClosed());
                        testRootNodes = false;
                    }
                }

            });

            var containerNodeId = scene.getRootIds()[0];
            var firstRootNodeId = scene.getChildIds(containerNodeId)[0];
            var childNodeIds = scene.getChildIds(firstRootNodeId);
            var nodeNames = [];
            scene.traverseNodes(childNodeIds, function (sceneNode) {
                nodeNames.push(sceneNode.getName());
            });
            assert.equal(
                "Deck,Screws,Support Skateboard,Support Skateboard,Complete Truck With Wheel,Complete Truck With Wheel",
                nodeNames.join());

            // check all ids
            var allIds = scene.getAllIds();
            assert.ok(treeItemsBySceneNodeId.size === allIds.length);

            // traverseBranch with invalid parameters - no tree item Id
            var exceptionFired = false;
            try {
                scene.traverseBranch(null, null);
            } catch (ex) {
                exceptionFired = true;
            }
            assert.ok(exceptionFired);

            // traverseBranch with invalid parameters - no callback function
            var exceptionFired = false;
            try {
                scene.traverseBranch(treeRoots[0], null);
            } catch (ex) {
                exceptionFired = true;
            }
            assert.ok(exceptionFired);

            // viewport tests
            var viewport = panel.getViewport();

            viewport._initialize();
            viewport._onSceneCreated();
            assert.ok(viewport.getPanel() === panel);

            // visibility
            assert.ok(viewport.getVisibility(firstRootNodeId) === true);
            viewport.setVisibility(firstRootNodeId, false, false);
            assert.ok(viewport.getVisibility(firstRootNodeId) === false);
            viewport.setVisibility(scene.getRootIds(), true, true);
            assert.ok(viewport.getVisibility(firstRootNodeId) === true);

            // selection
            assert.ok(viewport.getSelected(firstRootNodeId) === false);
            viewport.setSelected(firstRootNodeId, true, false);
            var selectedIds = viewport.getSelectedIds();
            assert.ok(Array.isArray(selectedIds) && selectedIds.length === 1 && selectedIds[0] === firstRootNodeId);
            assert.ok(viewport.getSelected(firstRootNodeId) === true);
            viewport.setSelected(firstRootNodeId, false, false);

            // opacity
            assert.equal(viewport.getOpacity(firstRootNodeId), 1.0);
            viewport.setOpacity(firstRootNodeId, 0.5, false);
            assert.equal(viewport.getOpacity(firstRootNodeId), 0.5);
            viewport.setOpacity(firstRootNodeId, 1.0, false);

            // highlight
            assert.equal(viewport.getHighlightColor(firstRootNodeId), "rgba(0,0,0,0)"); // not set
            viewport.setHighlightColor(firstRootNodeId, "rgba(0,128,0,1)", false);
            assert.equal(viewport.getHighlightColor(firstRootNodeId), "rgba(0,128,0,1)");
            viewport.setHighlightColor(firstRootNodeId, "rgba(0,0,0,0)", false);

            // predefined views
            var viewTop = {
                position: {
                    x: 1505.52,
                    y: 1.43912,
                    z: -53.3202
                },
                rotation: {
                    pitch: 0,
                    roll: -0,
                    yaw: 0
                }
            };

            var viewBottom = {
                position: {
                    x: -576.158,
                    y: 1.43925,
                    z: -53.3202
                },
                rotation: {
                    pitch: -90,
                    roll: 0,
                    yaw: 90
                }
            };

            var viewFront = {
                position: {
                    x: 464.757,
                    y: 1.33701,
                    z: 968.898
                },
                rotation: {
                    pitch: 90,
                    roll: 0,
                    yaw: 90
                }
            };

            var viewBack = {
                position: {
                    x: 464.604,
                    y: 1.33701,
                    z: -1075.42
                },
                rotation: {
                    pitch: 0,
                    roll: 0,
                    yaw: 90
                }
            };

            var viewLeft = {
                position: {
                    x: -5.19615,
                    y: 0,
                    z: 0
                },
                rotation: {
                    pitch: 0,
                    roll: -0,
                    yaw: 0
                }
            };

            var viewRight = {
                position: {
                    x: 1505.52,
                    y: 1.43925,
                    z: -53.3202
                },
                rotation: {
                    pitch: 0,
                    roll: 0,
                    yaw: 180
                }
            };

            var compareCameraInfo = function (caption, info1, info2) {
                var areEqual =
                    Math.abs(info1.position.x - info2.position.x) < 0.1 &&
                    Math.abs(info1.position.y - info2.position.y) < 0.1 &&
                    Math.abs(info1.position.z - info2.position.z) < 0.1 &&
                    Math.abs(info1.rotation.pitch - info2.rotation.pitch) < 0.1 &&
                    Math.abs(info1.rotation.roll - info2.rotation.roll) < 0.1 &&
                    Math.abs(info1.rotation.yaw - info2.rotation.yaw) < 0.1;
                assert.ok(areEqual, caption + " (rotation)");
            };

            // viewport.setPredefinedView(sap.ui.vtm.PredefinedView.Right);
            // var cameraInfo = viewport.getCameraInfo();
            // compareCameraInfo("predefined view - right", cameraInfo, viewRight);
            // console.warn("Right:", cameraInfo);

            viewport.setPredefinedView(sap.ui.vtm.PredefinedView.Left);
            var cameraInfo = viewport.getCameraInfo();
            compareCameraInfo("predefined view - left", cameraInfo, viewLeft);
            // console.warn("Left:", cameraInfo);

            cameraInfo.position = viewRight.position;
            cameraInfo.rotation = viewRight.rotation;
            viewport.setCameraInfo(cameraInfo);
            cameraInfo = viewport.getCameraInfo();
            viewport.setPredefinedView(sap.ui.vtm.PredefinedView.Right);
            compareCameraInfo("custom view - right", cameraInfo, viewport.getCameraInfo());
            //console.warn("Right:", viewport.getCameraInfo());

            viewport.setPredefinedView(sap.ui.vtm.PredefinedView.Top);
            cameraInfo = viewport.getCameraInfo();
            compareCameraInfo("predefined view - top", cameraInfo, viewTop);
            // console.warn("Top:", cameraInfo);

            viewport.setPredefinedView(sap.ui.vtm.PredefinedView.Bottom);
            cameraInfo = viewport.getCameraInfo();
            compareCameraInfo("predefined view - bottom", cameraInfo, viewBottom);
            // console.warn("Bottom:", cameraInfo);
            viewport.setPredefinedView(sap.ui.vtm.PredefinedView.Front);
            cameraInfo = viewport.getCameraInfo();
            compareCameraInfo("predefined view - front", cameraInfo, viewFront);
            // console.warn("Front:", cameraInfo);
            viewport.setPredefinedView(sap.ui.vtm.PredefinedView.Back);
            cameraInfo = viewport.getCameraInfo();
            compareCameraInfo("predefined view - back", cameraInfo, viewBack);
            // console.warn("Back:", cameraInfo);

            // viewport background color
            assert.equal(viewport.getBackgroundGradientTopColor(), "black");
            assert.equal(viewport.getBackgroundGradientBottomColor(), "white");

            viewport.setBackgroundGradientTopColor("white");
            viewport.setBackgroundGradientBottomColor("black");

            assert.equal(viewport.getBackgroundGradientTopColor(), "white");
            assert.equal(viewport.getBackgroundGradientBottomColor(), "black");

            // visibility
            // var testNode = ;


            var sourceTree = panel.getTree();
            sourceTree.setRootItems(treeRoots);
            sourceTree.updateCollections();
            sourceTree.updateModel();

            done();
        });

        // loadViewablesAsync with invalid parameters - no viewables
        var exceptionFired = false;
        try {
            scene.loadViewablesAsync(null);
        } catch (ex) {
            exceptionFired = true;
        }
        assert.ok(exceptionFired);

        scene.loadViewablesAsync(viewable);
    });

    QUnit.done(function() {
        //jQuery("#qunit-fixture").hide();
    });
});
