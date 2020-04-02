"use strict";
var PlanningStatusCalculator = {};

var TreeItemUtilities = sap.ui.vtm.TreeItemUtilities;
/**
 * A partial implementation of the VMP algorithm for calculating planning status.
 * Does not include support for replanning of non-visual items.
 * Does not bother with a separate "pending" state.
 * Returns an array of modified trees.
 */
PlanningStatusCalculator.calculatePlanningStatus = function(sourceTreeLookups, workingTreeLookups, targetTreeLookups) {
    "use strict";
    var trees = [sourceTreeLookups, workingTreeLookups, targetTreeLookups]
        .filter(function(lookup) { return !!lookup; })
        .map(function(lookup) { return lookup.tree });

    var treeModifiedMap = new Map();
    trees.forEach(function(tree) {
        treeModifiedMap.set(tree, false);
    })
    
    function setPlanningStatus(treeItem, planningStatus, tree, recursive) {
        var existingValues = TreeItemUtilities.getAppDataValues(treeItem, "planningStatus");
        if (!existingValues.length || existingValues[0] !== planningStatus) {
            treeModifiedMap.set(tree, true);
        }
        TreeItemUtilities.setAppDataValues(treeItem, "planningStatus", planningStatus);

        if (tree.getId() === "source_tree") {
            var greyedOut = planningStatus === "planned" || planningStatus === "unplannable";
            if (greyedOut) {
                treeItem.textColor = sap.ui.vtm.TextColor.Grey;
            } else {
                delete treeItem.textColor;
            }
        }
        if (recursive) {
            var children = sap.ui.vtm.TreeItemUtilities.getChildren(treeItem, sap.ui.vtm.ChildCollectionType.IncludedAndExcluded);
            children.forEach(function(childItem) {
                setPlanningStatus(childItem, planningStatus, tree, recursive);
            });
        }
    }

    if (targetTreeLookups) {
       targetTreeLookups.tree
           .getAllItems()
           .forEach(function (plannedTreeItem) { return setPlanningStatus(plannedTreeItem, "planned", targetTreeLookups.tree, false); });
    }

    if (workingTreeLookups) {
       workingTreeLookups.tree
           .getAllItems()
           .forEach(function (workingTreeItem) { return setPlanningStatus(workingTreeItem, "planned", workingTreeLookups.tree, false); });
    }

    var sourceTree = sourceTreeLookups.tree;

    var calculatePlanningStatusForSourceTreeItem = function (sourceTreeItem) {
        var planningStatus = "unplanned";
        var children = sap.ui.vtm.TreeItemUtilities.getChildren(sourceTreeItem, sap.ui.vtm.ChildCollectionType.IncludedAndExcluded);
        var targetMatches = !targetTreeLookups ? [] : targetTreeLookups.findTreeItemMatches(sourceTreeItem, sourceTree);
        var workingMatches = !workingTreeLookups ? [] : workingTreeLookups.findTreeItemMatches(sourceTreeItem, sourceTree);
        var allMatches = targetMatches.concat(workingMatches);

        if (children.length !== 0) {
            var childPlanningStatusValues = children.map(calculatePlanningStatusForSourceTreeItem);
            planningStatus = childPlanningStatusValues.every(function (ps) { return ps === "unplanned"; })
                ? "unplanned"
                : "unplannable";
        }
        if (allMatches.length != 0) {
            planningStatus = "planned";

            var matchesWithChildren = allMatches.filter(function(treeItem) {
                return sap.ui.vtm.TreeItemUtilities.hasChildren(treeItem, sap.ui.vtm.ChildCollectionType.IncludedAndExcluded);
            });

            if (matchesWithChildren.length == 0) {
                setPlanningStatus(sourceTreeItem, planningStatus, sourceTree, true);
                return planningStatus;
            }
        }

        setPlanningStatus(sourceTreeItem, planningStatus, sourceTree, false);
        return planningStatus;
    };

    var sourceTreeRootItems = sourceTree.getRootItems();
    sourceTreeRootItems.forEach(function(sourceTreeRootItem) {
        calculatePlanningStatusForSourceTreeItem(sourceTreeRootItem);
    });
    
    var modifiedTrees = trees.filter(function(tree) {
        return treeModifiedMap.get(tree);
    });
    return modifiedTrees;
};