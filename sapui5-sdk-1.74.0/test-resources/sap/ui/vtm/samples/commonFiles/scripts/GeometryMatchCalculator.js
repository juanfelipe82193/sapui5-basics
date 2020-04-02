"use strict";
var GeometryMatchCalculator = {};

GeometryMatchCalculator.addSceneNodeToLookup = function(
        sceneNodeId,
        parentSceneNodeId,
        absoluteMatrix,
        materialIds,
        materialIdsParentPath,
        sceneNodeLookups) {
    "use strict";
    if (materialIds.length === 0 || !absoluteMatrix) {
        return;
    }
    var value = {
        sceneNodeId: sceneNodeId,
        absoluteMatrix: absoluteMatrix,
        materialIds: materialIds,
        materialIdsParentPath: materialIdsParentPath
    };
    var sceneNodeInfosByHash = sceneNodeLookups.sceneNodeInfosByHash,
        sceneNodeInfosByMaterialId = sceneNodeLookups.sceneNodeInfosByMaterialId,
        sceneNodeChildIdsById = sceneNodeLookups.sceneNodeChildIdsById;

    materialIds.forEach(function (materialId) {
        var hash = visualItemHashFunction(materialId, absoluteMatrix);
        var alreadyAdded = sceneNodeInfosByHash.getValues(hash).some(function(existingValue) {
            return existingValue.sceneNodeId === sceneNodeId
        });
        if (!alreadyAdded) {
            sceneNodeInfosByHash.addValue(hash, value);
        }
        alreadyAdded = sceneNodeInfosByMaterialId.getValues(materialId).some(function(existingValue) {
            return existingValue.sceneNodeId === sceneNodeId
        });
        if (!alreadyAdded) {
            sceneNodeInfosByMaterialId.addValue(materialId, value)
        }
        alreadyAdded = sceneNodeChildIdsById.getValues(parentSceneNodeId).indexOf(sceneNodeId) !== -1;
        if (!alreadyAdded) {
            sceneNodeChildIdsById.addValue(parentSceneNodeId, sceneNodeId);
        }
    });
};

GeometryMatchCalculator.performGeometryMatching = function(trees, scene, sceneNodeLookups) {
    "use strict";
    var findSceneNodeMatches = function(treeItem, tree) {
        var sceneNodeInfosByHash = sceneNodeLookups.sceneNodeInfosByHash,
            sceneNodeInfosByMaterialId = sceneNodeLookups.sceneNodeInfosByMaterialId;
        var matchBy;
        var instanceNotFoundBehavior;
        if (treeItem.appData) {
            matchBy = treeItem.appData["matchBy"];
            instanceNotFoundBehavior = treeItem.appData["instanceNotFoundBehavior"];
        }
        var sceneNodeMatches = [];
        var materialIds, absoluteMatrix;
        switch (matchBy) {
            case "materialIdAndAbsMatrix":
            case "materialIdPathAndAbsMatrix":
                absoluteMatrix = treeItem.absoluteMatrix;
                materialIds = sap.ui.vtm.TreeItemUtilities.getMetadataValues(treeItem, materialIdDescriptor);
                var materialIdsParentPath;

                materialIds.forEach(function (materialId) {
                    var hash = visualItemHashFunction(materialId, absoluteMatrix);
                    var matches = sceneNodeInfosByHash.getValues(hash);
                    matches = matches.filter(function(sceneNodeInfo) {
                        return sceneNodeInfo.materialIds.indexOf(materialId) !== -1  &&
                               sap.ui.vtm.MatrixUtilities.areEqual(absoluteMatrix, sceneNodeInfo.absoluteMatrix);
                    });
                    if (matches.length > 1 && matchBy === "materialIdPathAndAbsMatrix") {
                        if (!materialIdsParentPath) {
                            materialIdsParentPath = MaterialIdPathHelper.getMaterialIdParentPath(tree, treeItem);
                        }
                        matches = matches.filter(function (sceneNodeInfo) {
                            return MaterialIdPathHelper.materialIdPathsMatch(sceneNodeInfo.materialIdsParentPath, materialIdsParentPath);
                        });
                    }
                    matches.forEach(function(sceneNodeInfo) {
                        if (sceneNodeMatches.indexOf(sceneNodeInfo.sceneNodeId) === -1) {
                            sceneNodeMatches.push(sceneNodeInfo.sceneNodeId);
                        }
                    });
                });
                break;
            default:
                break;
        }
        
        if (sceneNodeMatches.length == 0) {
            switch (instanceNotFoundBehavior) {
            case "createInstance":
                if (sceneNodeInfosByMaterialId) {
                    materialIds = sap.ui.vtm.TreeItemUtilities.getMetadataValues(treeItem, materialIdDescriptor);
                    for (var i = 0; i < materialIds.length; i++) {
                        var values = sceneNodeInfosByMaterialId.getValues(materialIds[i]);
                        if (values.length) {
                            var matchedNodeId = values[0].sceneNodeId;
                            var newNodeId = scene.cloneNode(matchedNodeId, null, null, treeItem.name);
                            if (newNodeId) {
                                var newSceneNode = new sap.ui.vtm.SceneNode({
                                    scene: scene,
                                    sceneNodeId: newNodeId
                                });
                                newSceneNode.setAbsoluteMatrix(absoluteMatrix);
                                newSceneNode.destroy();
                                sceneNodeMatches.push(newNodeId);

                                var materialIdParentPath = MaterialIdPathHelper.getMaterialIdParentPath(tree, treeItem);

                                GeometryMatchCalculator.addSceneNodeToLookup(
                                    newNodeId,
                                    null,
                                    absoluteMatrix,
                                    materialIds,
                                    materialIdParentPath,
                                    sceneNodeLookups);

                                var materialIdPath = materialIdParentPath.concat([materialIds]);
                                var materialIdIdPathsBySceneNode = new Map();
                                materialIdIdPathsBySceneNode.set(newNodeId, materialIdPath)

                                scene.traverseBranch(newNodeId, function(sceneNode, ancestorIds) {
                                    var sceneNodeId = sceneNode.getSceneNodeId();
                                    if (sceneNodeId !== newNodeId) {
                                        var sceneNodeMetadata = sceneNode.getNodeMetadata();
                                        var sceneNodeMaterialIds = sap.ui.vtm.ArrayUtilities.wrap(sceneNodeMetadata[materialIdDescriptor]);
                                        var parentId = ancestorIds[ancestorIds.length - 1];
                                        materialIdParentPath = materialIdIdPathsBySceneNode.get(parentId);
                                        materialIdPath = materialIdParentPath.concat([sceneNodeMaterialIds]);
                                        materialIdIdPathsBySceneNode.set(sceneNodeId, materialIdPath);

                                        GeometryMatchCalculator.addSceneNodeToLookup(
                                            sceneNode.getSceneNodeId(),
                                            parentId,
                                            sceneNode.getAbsoluteMatrix,
                                            sceneNodeMaterialIds,
                                            materialIdParentPath,
                                            sceneNodeLookups);
                                    }
                                });
                            }
                            break;
                        }
                    } 
                }
                break;
            default:
                // Could have other behaviors like "showError":
                break;
            }
        }
        return sceneNodeMatches;
    };

    var getTreeItemSceneNodeIds = function(treeItem, tree, scene, sceneNodeLookups) {
        var sceneNodeIdsForExcludedDescendants = [];
        if (sap.ui.vtm.TreeItemUtilities.hasExcludedChildren(treeItem)) {
            var excludedDescendants = tree.getDescendantItems(treeItem.id, sap.ui.vtm.TreeItemType.Excluded);
            var visualExcludedDescendants = excludedDescendants.filter(function(ti) {
                return sap.ui.vtm.TreeItemUtilities.hasVisibility(ti);
            })
            sceneNodeIdsForExcludedDescendants = sap.ui.vtm.ArrayUtilities.flatten(visualExcludedDescendants.map(function(ti) {
                return getTreeItemSceneNodeIds(ti, tree, scene, sceneNodeLookups);
            }));
        }
        var sceneNodeIds;
        var geometryMatchSceneNodeIds = findSceneNodeMatches(treeItem, tree);
        if (geometryMatchSceneNodeIds.length) {
            var geometryMatchSceneNodeId = geometryMatchSceneNodeIds[0];
            if (sap.ui.vtm.TreeItemUtilities.hasChildren(treeItem)) {
                sceneNodeIds = sap.ui.vtm.ArrayUtilities.flatten([
                    [geometryMatchSceneNodeId],
                    sceneNodeIdsForExcludedDescendants
                ]);
            } else {
                sceneNodeIds = sap.ui.vtm.ArrayUtilities.flatten([
                    [geometryMatchSceneNodeId],
                    sceneNodeLookups.getDescendantSceneNodeIds(geometryMatchSceneNodeId),
                    sceneNodeIdsForExcludedDescendants
                ]);
            }
        } else {
            sceneNodeIds = sceneNodeIdsForExcludedDescendants;
        }
        return sap.ui.vtm.ArrayUtilities.unwrap(sceneNodeIds);
    };

    sap.ui.vtm.ArrayUtilities.wrap(trees).forEach(function(tree) {
        sap.ui.vtm.TreeItemUtilities.traverseTree(tree.getRootItems(), function(treeItem) {
            var sceneNodeIds = getTreeItemSceneNodeIds(treeItem, tree, scene, sceneNodeLookups);
            sap.ui.vtm.TreeItemUtilities.setSceneNodeIds(treeItem, sceneNodeIds);
        });
        tree.updateTreeItemsBySceneNodeId();
    });
};
