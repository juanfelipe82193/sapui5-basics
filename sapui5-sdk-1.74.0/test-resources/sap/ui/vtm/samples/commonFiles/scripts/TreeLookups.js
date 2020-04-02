"use strict";
var TreeLookups = {};

TreeLookups.findTreeItemMatches = function (treeItem, tree, treeLookups) {
    "use strict";
    var matchBy = treeItem.appData["matchBy"];
    var matches = [];

    switch (matchBy) {
        case "guid": {
            var guidValues = sap.ui.vtm.TreeItemUtilities.getAppDataValues(treeItem, "guid");
            if (guidValues.length) {
                matches = treeLookups.nonVisualItemsLookup.getValues(guidValues[0]);
            }
            break;
        }
        case "materialIdAndAbsMatrix":
        case "materialIdPathAndAbsMatrix": {
            if (treeItem.absoluteMatrix) {
                var materialIds = sap.ui.vtm.TreeItemUtilities.getMetadataValues(treeItem, materialIdDescriptor);
                if (materialIds.length) {
                    materialIds.forEach(function (materialId) {
                        var hash = visualItemHashFunction(materialId, treeItem.absoluteMatrix);
                        var hashMatches = treeLookups.visualItemsLookup.getValues(hash);
                        if (hashMatches.length) {
                            var matchesByMaterialIdAndAbsTMat = hashMatches.filter(function (hashMatch) {
                                var a = treeItem, b = hashMatch;
                                if (!a.metadata || !b.metadata || !a.absoluteMatrix || !b.absoluteMatrix)
                                    return false;

                                var aMaterialIds = sap.ui.vtm.TreeItemUtilities.getMetadataValues(a, materialIdDescriptor);
                                var bMaterialIds = sap.ui.vtm.TreeItemUtilities.getMetadataValues(b, materialIdDescriptor);
                                return sap.ui.vtm.ArrayUtilities.haveIntersection([aMaterialIds, bMaterialIds]) &&
                                       sap.ui.vtm.MatrixUtilities.areEqual(a.absoluteMatrix, b.absoluteMatrix);
                            });
                            matches = matches.concat(matchesByMaterialIdAndAbsTMat);
                        }
                    });

                    if (matchBy == "materialIdPathAndAbsMatrix" && matches.length > 1) {
                        var materialIdParentPathToMatch = MaterialIdPathHelper.getMaterialIdParentPath(tree, treeItem);
                        matches = matches.filter(function (matchTreeItem) {
                            var materialIdParentPath = MaterialIdPathHelper.getMaterialIdParentPath(treeLookups.tree, matchTreeItem);
                            return MaterialIdPathHelper.materialIdPathsMatch(materialIdParentPathToMatch, materialIdParentPath);
                        });
                    }
                }
            }
            break;
        }
        default:
            break;
    }
    return matches;
};

TreeLookups.addTreeItemToLookup = function(treeItem, treeLookups) {
    "use strict";
    var appData = treeItem.appData;
    if (!appData)
        return;

    var matchBy = appData["matchBy"];
    switch (matchBy) {
    case "guid":
        var guidValues = sap.ui.vtm.TreeItemUtilities.getAppDataValues(treeItem, "guid");
        if (guidValues.length) {
            treeLookups.nonVisualItemsLookup.addValue(guidValues[0], treeItem);
        }
        break;
    case "materialIdAndAbsMatrix":
    case "materialIdPathAndAbsMatrix":
        var absoluteMatrix = treeItem.absoluteMatrix;
        if (!absoluteMatrix) {
            return;
        }
        var materialIds = sap.ui.vtm.TreeItemUtilities.getMetadataValues(treeItem, materialIdDescriptor);
        if (materialIds.length) {
            materialIds.forEach(function (materialId) {
                var hash = visualItemHashFunction(materialId, absoluteMatrix);
                treeLookups.visualItemsLookup.addValue(hash, treeItem);
            });
        }
        break;
    default:
        break;
    }
};

TreeLookups.createTreeLookups = function (tree) {
    var treeLookups = {
        tree: tree,
        visualItemsLookup: new sap.ui.vtm.Lookup(),
        nonVisualItemsLookup: new sap.ui.vtm.Lookup(),
        findTreeItemMatches: function (treeItem, tree) {
            return TreeLookups.findTreeItemMatches(treeItem, tree, treeLookups);
        },
    };

    sap.ui.vtm.TreeItemUtilities.traverseTree(tree.getRootItems(), function (treeItem) {
        TreeLookups.addTreeItemToLookup(treeItem, treeLookups);
        return sap.ui.vtm.ChildCollectionType.IncludedAndExcluded;
    });
    return treeLookups;
};
