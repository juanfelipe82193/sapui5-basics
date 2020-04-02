function buildExample(containingDivId) {
    "use strict";

    jQuery.sap.measure.setActive(true, ["sap.ui.vtm"]);

    var updateIcons = function(tree) {
        tree.traverseTree(function(treeItem) {
            var hasChildren = sap.ui.vtm.TreeItemUtilities.hasIncludedChildren(treeItem);
            treeItem.iconUrl = hasChildren ? "sap-icon://tree" : "sap-icon://product";
            treeItem.iconTooltip = hasChildren ? "Group/Assembly" : "Item";
        });
    };

    // 1. Create VTM and the panels.
    var vtm = sap.ui.vtm.createVtm("vtm");
    vtm.attachInitialized(function() {
        var sourcePanel = vtm.createPanel("source", {
            title: "Source"
        });
        var targetPanel = vtm.createPanel("target", {
            title: "Target"
        });

        vtm.setActivePanel(sourcePanel);

        var scene = vtm.getScene();

        // 2. Add some planning status calculation code
        var sourceTree = sourcePanel.getTree();
        var targetTree = targetPanel.getTree();
        var trees = [sourceTree, targetTree];

        trees.forEach(function(tree) {
            tree.setSelectionMode(sap.ui.vtm.SelectionMode.MultiToggle);
        });

        var sourceViewport = sourcePanel.getViewport();
        var targetViewport = targetPanel.getViewport();
        
        var treeLookupsByTree = new Map();
        treeLookupsByTree.set(sourceTree, TreeLookups.createTreeLookups(sourceTree));
        treeLookupsByTree.set(targetTree, TreeLookups.createTreeLookups(targetTree));

        var findTreeItemsByGeometryMatch = function(selectedTreeItem, selectionSourceTree, selectionTargetTree) {
            var toLookup = treeLookupsByTree.get(selectionTargetTree);
            var matchingItems = toLookup.findTreeItemMatches(selectedTreeItem, selectionSourceTree);
            return matchingItems;
        };

        var sceneNodeLookups = SceneNodeLookups.createLookups();

        var handleTreeUpdates = function (updatedTrees) {

            updatedTrees.forEach(function(updatedTree) {
                if (jQuery.sap.debug()) {
                    sourceTree.validateTree();
                }
                updatedTree.updateCollections();
                var viewport = updatedTree.getPanel().getViewport();
                var treeLookups = TreeLookups.createTreeLookups(updatedTree);
                treeLookupsByTree.set(updatedTree, treeLookups);
                GeometryMatchCalculator.performGeometryMatching(updatedTree, scene, sceneNodeLookups);
                viewport.refresh();
                updateIcons(updatedTree);
            });

            var treesWithUpdatedPlanningStatus = PlanningStatusCalculator.calculatePlanningStatus(
                treeLookupsByTree.get(sourceTree),
                null,
                treeLookupsByTree.get(targetTree));
            
            var modifiedTrees = sap.ui.vtm.ArrayUtilities.union([updatedTrees, treesWithUpdatedPlanningStatus]);
            modifiedTrees.forEach(function(modifiedTree) {
                modifiedTree.updateModel();
            });
        };


        // 3. Specify some commands
        var planItems = function (sourceItems, targetItem, recursive) {
            var createPlannedTreeItem = function (sourceTreeItem) {
                var plannedTreeItem = {
                    id: jQuery.sap.uid(),
                    name: sourceTreeItem.name
                };
                if (sourceTreeItem.iconUrl) {
                    plannedTreeItem.iconUrl = sourceTreeItem.iconUrl;
                }
                if (sourceTreeItem.relativeMatrix) {
                    plannedTreeItem.relativeMatrix = sourceTreeItem.relativeMatrix;
                }
                if (sourceTreeItem.absoluteMatrix) {
                    plannedTreeItem.absoluteMatrix = sourceTreeItem.absoluteMatrix;
                }
                if (sourceTreeItem.metadata) {
                    plannedTreeItem.metadata = sap.ui.vtm.TreeItemUtilities.cloneMetadata(sourceTreeItem);
                }
                if (sourceTreeItem.identifiers) {
                    plannedTreeItem.identifiers = sap.ui.vtm.TreeItemUtilities.cloneIdentifiers(sourceTreeItem);
                }
                if (sourceTreeItem.appData) {
                    plannedTreeItem.appData = sap.ui.vtm.TreeItemUtilities.cloneAppData(sourceTreeItem);
                }
                if(sap.ui.vtm.TreeItemUtilities.hasVisibility(sourceTreeItem)) {
                    plannedTreeItem.visibility = false;
                }
                return plannedTreeItem;
            };

            var calculateRelativeMatrix = sap.ui.vtm.TreeItemUtilities.calculateRelativeMatrix;
            var plannedTreeItems = [];

            sourceItems.forEach(function(sourceItem) {
                var plannedTreeItem = recursive
                        ? sap.ui.vtm.TreeItemUtilities.mapBranch(sourceItem, createPlannedTreeItem)
                        : createPlannedTreeItem(sourceItem);

                if (targetItem) {
                    sap.ui.vtm.TreeItemUtilities.addChild(targetItem, plannedTreeItem);
                    if (plannedTreeItem.relativeMatrix) {
                        plannedTreeItem.relativeMatrix = calculateRelativeMatrix(plannedTreeItem.absoluteMatrix, targetItem.absoluteMatrix);
                    }
                }
                else {
                    targetTree.addRoot(plannedTreeItem);
                    if (plannedTreeItem.relativeMatrix) {
                        plannedTreeItem.relativeMatrix = calculateRelativeMatrix(plannedTreeItem.absoluteMatrix, null);
                    }
                }
                plannedTreeItems.push(plannedTreeItem);
            });
            targetTree.setVisibility(plannedTreeItems, true, true);
            handleTreeUpdates([targetTree]);
        };

        var deleteItems = function (itemsToDelete, tree) {
            itemsToDelete.forEach(function(itemToDelete) {
                var parentItem = tree.getParentItem(itemToDelete.id);
                if (parentItem)
                    sap.ui.vtm.TreeItemUtilities.removeChild(parentItem, itemToDelete);
                else
                    sap.ui.vtm.TreeItemUtilities.removeRoot(tree.getRootItems(), itemToDelete);
            });
            handleTreeUpdates([targetTree]);
        };

        var getTreeState = function(tree) {
            var data = JSON.stringify(tree.getRootItems(), function(key, value) {
                // skip scene node id as they'll be reassigned after restoring the tree
                if (key === "sceneNodeIds") {
                    return undefined;
                }
                return value;
            }, '\t');
            return data;
        };

        var restoreTreeState = function(tree, data) {
            var rootItems = JSON.parse(data);
            tree.setRootItems(rootItems);
        }


        // 4. Create some menus and buttons
        var planMenuItem = new sap.m.MenuItem({
            text: "Plan Item",
            press: function (event) {
                var sourceSelectedItems = sourceTree.getSelectedItems();
                var targetSelectedItems = targetTree.getSelectedItems();
                var targetItem = targetSelectedItems.length == 0 ? null : targetSelectedItems[0];
                planItems(sourceSelectedItems, targetItem, false);
            }
        });

        var planAsDesignedMenuItem = new sap.m.MenuItem({
            text: "Plan as Designed",
            press: function (event) {
                var sourceSelectedItems = sourceTree.getSelectedItems();
                var targetSelectedItems = targetTree.getSelectedItems();
                var targetItem = targetSelectedItems.length == 0 ? null : targetSelectedItems[0];
                planItems(sourceSelectedItems, targetItem, true);
            }
        });

        var sourcePlanMenu = new sap.m.Menu({
            items: [planMenuItem, planAsDesignedMenuItem],
            itemSelected: function(event) {
                event.getParameter("item").firePress();
            }
        });

        var sourcePlanMenuButton = new sap.m.Button({
            text: "Plan",
            press: function(event) {
                sourcePlanMenu.openBy(event.getSource());
            }
        });

        var deleteMenuItem = new sap.m.MenuItem({
            text: "Delete",
            press: function (event) {
                var itemsToDelete = targetTree.getSelectedItems();
                deleteItems(itemsToDelete, targetTree);
            }
        });

        var targetPlanMenu = new sap.m.Menu({
            items: [deleteMenuItem],
            itemSelected: function(event) {
                event.getParameter("item").firePress();
            }
        });

        var targetPlanMenuButton = new sap.m.Button({
            text: "Plan",
            press: function(event) {
                targetPlanMenu.openBy(event.getSource());
            }
        });

        var treeState = new Map();
        var saveTreeStateMenuItem = new sap.m.MenuItem({
            text: "Save trees",
            press: function(event) {
                treeState.set(sourceTree.getId(), getTreeState(sourceTree));
                treeState.set(targetTree.getId(), getTreeState(targetTree));
            }
        });

        var restoreTreeStateMenuItem = new sap.m.MenuItem({
            text: "Restore trees",
            press: function(event) {
                restoreTreeState(sourceTree, treeState.get(sourceTree.getId()));
                restoreTreeState(targetTree, treeState.get(targetTree.getId()));
                handleTreeUpdates([sourceTree, targetTree]);
            }
        });

        var selectColumnsDialog = new sap.ui.vtm.SelectColumnsDialog();

        var selectSourceColumnsMenuItem = new sap.m.MenuItem({
            text: "Select Columns",
            press: function () {
                var selectableColumns = SelectableTreeColumnsCalculator.getSelectableColumns([sourceTree, targetTree]);
                selectColumnsDialog.setTree(sourceTree);
                selectColumnsDialog.setSelectableColumns(selectableColumns);
                selectColumnsDialog.open();
            },
        });

        var sourceTreeMenu = new sap.m.Menu({
            items: [selectSourceColumnsMenuItem],
            itemSelected: function(event) {
                event.getParameter("item").firePress();
            }
        });

        var sourceTreeMenuButton = new sap.m.Button({
            text: "Tree",
            press: function(event) {
                sourceTreeMenu.openBy(event.getSource());
            }
        });

        var selectTargetColumnsButton = new sap.m.MenuItem({
            text: "Select Columns",
            press: function () {
                var selectableColumns = SelectableTreeColumnsCalculator.getSelectableColumns([sourceTree, targetTree]);
                selectColumnsDialog.setTree(targetTree);
                selectColumnsDialog.setSelectableColumns(selectableColumns);
                selectColumnsDialog.open();
            },
        });

        var targetTreeMenu = new sap.m.Menu({
            items: [selectTargetColumnsButton],
            itemSelected: function(event) {
                event.getParameter("item").firePress();
            }
        });

        var targetTreeMenuButton = new sap.m.Button({
            text: "Tree",
            press: function(event) {
                targetTreeMenu.openBy(event.getSource());
            }
        });

        var loadViewableDialog = LoadViewableDialog.createDialog(vtm);
        var loadFileMenuItem = new sap.m.MenuItem({
            text: "Load File",
            press: function() {
                loadViewableDialog.open();
            },
        });

        var fileMenu = new sap.m.Menu({
            items: [loadFileMenuItem, saveTreeStateMenuItem, restoreTreeStateMenuItem],
            itemSelected: function(event) {
                event.getParameter("item").firePress();
            }
        });
        
        var fileMenuButton = new sap.m.Button({
            text: "File",
            press: function(event) {
                fileMenu.openBy(event.getSource());
            }
        });

        var applyLinkSelectionState = function() {
            var selectionLinkingExtension = vtm.getExtensionByInterface("sap.ui.vtm.interfaces.ISelectionLinkingExtension");
            selectionLinkingExtension.setFindMatchingTreeItems(findTreeItemsByGeometryMatch);
            selectionLinkingExtension.setEnabled(linkSelectionToggleButton.getPressed());
        };

        var linkSelectionToggleButton = new sap.m.ToggleButton({
            text: "Link Selection",
            press: function() {
                applyLinkSelectionState();
            }
        });

        applyLinkSelectionState();

        var applyLinkViewState = function() {
            var viewLinkingExtension = vtm.getExtensionByInterface("sap.ui.vtm.interfaces.IViewLinkingExtension");
            viewLinkingExtension.setEnabled(linkViewsToggleButton.getPressed());
        };

        var linkViewsToggleButton = new sap.m.ToggleButton({
            text: "Link View",
            pressed: true,
            press: function() {
                applyLinkViewState();
            }
        });

        applyLinkViewState();


        // 5. Add the toolbars
        sourcePanel.addTreeHeaderControl(new sap.m.OverflowToolbar({
            content: [fileMenuButton, sourcePlanMenuButton, sourceTreeMenuButton],
            design: sap.m.ToolbarDesign.Transparent
        }));

        targetPanel.addTreeHeaderControl(new sap.m.OverflowToolbar({
            content: [targetPlanMenuButton, targetTreeMenuButton],
            design: sap.m.ToolbarDesign.Transparent
        }));


        // 6. Add code to manage the enabled state of the buttons
        var itemIsPlannable = function (item) {
            if (!item.appData)
                return true;
            var planningStatus = item.appData["planningStatus"];
            return !planningStatus || planningStatus === "unplanned";
        };

        var itemsArePlannable = function (items) {
            return items.length > 0 && items.every(itemIsPlannable);
        };

        var canPlanAsDesigned = function (sourceItems, targetItems) {
            return sourceItems.length == 1 &&
                targetItems.length <= 1 &&
                itemsArePlannable(sourceTree.getDescendantItems(sourceItems[0].id).concat(sourceItems[0]));
        };

        var setButtonEnabledStatus = function () {
            setTimeout(function() {
                var sourceSelectedItems = sourceTree.getSelectedItems();
                var targetSelectedItems = targetTree.getSelectedItems();
                var enableDelete = targetSelectedItems.length > 0;
                deleteMenuItem.setEnabled(enableDelete);
                var enablePlan = itemsArePlannable(sourceSelectedItems) && targetSelectedItems.length <= 1;
                planMenuItem.setEnabled(enablePlan);
                var enablePlanAsDesigned = canPlanAsDesigned(sourceSelectedItems, targetSelectedItems);
                planAsDesignedMenuItem.setEnabled(enablePlanAsDesigned);
            });
        };

        sourceTree.attachSelectionChanged(function (event) { setButtonEnabledStatus(); });
        targetTree.attachSelectionChanged(function (event) { setButtonEnabledStatus(); });
        sourceTree.attachModelUpdated(function (event) { setButtonEnabledStatus(); });
        targetTree.attachModelUpdated(function (event) { setButtonEnabledStatus(); });


        // 7. Add some drag and drop handlers
        sourceTree.attachDragStart(function (event) {
            var dragItem = event.getParameter("dragItem");
            var sourceSelectedItems = sourcePanel.getTree().getSelectedItems();
            var itemsToPlan = sourceSelectedItems.length == 0 ? [dragItem] : sourceSelectedItems;
            if (!itemsArePlannable(itemsToPlan))
                event.preventDefault();
        });
        targetTree.attachDragStart(function (event) { event.preventDefault(); }); // Prevent drags being initiated from the target tree
        targetTree.attachDragOver(function (event) { event.preventDefault(); }); // Allow drop on empty space or tree items
        targetTree.attachDrop(function (event) {
            var dragItem = event.getParameter("dragItem");
            var dropItem = event.getParameter("dropItem");
            var sourceSelectedItems = sourcePanel.getTree().getSelectedItems();
            var itemsToPlan = sourceSelectedItems.length == 0 ? [dragItem] : sourceSelectedItems;
            planItems(itemsToPlan, dropItem, false);
        });


        // 8. Some code to handle file loads
        var progressDialog = new sap.ui.vtm.ProgressDialog({
            progressBarVisible: false
        });

        var messageView = new sap.m.MessageView();
        var showMessageDialog = function() {
            var dialog = new sap.m.Dialog({
                showHeader: false,
                content: [messageView],
                buttons: [new sap.m.Button({
                    text: "Ok",
                    press: function() {
                        dialog.close();
                    }
                })],
                contentHeight: "440px",
                contentWidth: "640px",
                verticalScrolling: false,
                horizontalScrolling: false
            });
            dialog.open();
        };

        var createTree = function(allSceneNodeIds) {
            var allSceneNodeIds = scene.getAllIds();
            var treeRoots = new Array();
            var sceneNodeInfoMap = new Map();
            var loadedViewables = scene.getLoadedViewables();

            messageView.removeAllItems();

            loadedViewables.forEach(function(loadedViewable) {
                var anyNodeHasMaterialId = false;
                var rootNodeIds = loadedViewable.getRootNodeIds();
                rootNodeIds.forEach(function(rootNodeId) {
                    scene.traverseBranch(rootNodeId, function(sceneNode, ancestorIds) {
                        var identifiers = sceneNode.getIdentifiers();
                        var absoluteMatrix = sceneNode.getAbsoluteMatrix();
                        var metadata = sceneNode.getNodeMetadata();
                        var materialIds = sap.ui.vtm.ArrayUtilities.wrap(metadata[materialIdDescriptor]);
                        var sceneNodeId = sceneNode.getSceneNodeId();
                        var parentSceneNodeId = ancestorIds[ancestorIds.length - 1];
                        var parentInfo = sceneNodeInfoMap.get(parentSceneNodeId);
                        var materialIdsParentPath = parentInfo ? parentInfo.materialIdsPath : [];
                        var materialIdsPath = materialIdsParentPath.concat([materialIds]);
                        
                        if (materialIds.length) {
                            anyNodeHasMaterialId = true;
                            GeometryMatchCalculator.addSceneNodeToLookup(
                                sceneNodeId,
                                parentSceneNodeId,
                                absoluteMatrix,
                                materialIds,
                                materialIdsParentPath,
                                sceneNodeLookups);
                        }

                        var hasComponentId = identifiers && identifiers[componentIdDescriptor];
                        if (!hasComponentId) {
                            return;
                        }

                        var treeItem = {
                            id: jQuery.sap.uid(),
                            name: sceneNode.getName(),
                            absoluteMatrix: absoluteMatrix,
                            relativeMatrix: sceneNode.getRelativeMatrix(),
                            metadata: metadata,
                            identifiers: identifiers,
                            appData: { "matchBy": "materialIdAndAbsMatrix" },
                            visibility: true
                        };

                        sceneNodeInfoMap.set(sceneNodeId, {
                            treeItem: treeItem,
                            materialIdsPath: materialIdsPath
                        });

                        if (parentInfo) {
                             sap.ui.vtm.TreeItemUtilities.addChild(parentInfo.treeItem, treeItem);
                        } else {
                            treeRoots.push(treeItem);
                        }
                    });
                });
                
                if (rootNodeIds.length && !anyNodeHasMaterialId) {
                    messageView.addItem(new sap.m.MessagePopoverItem({
                        type: sap.ui.core.MessageType.Error,
                        title: loadedViewable.getName()
                            ? jQuery.sap.formatMessage("''{0}'' has no material IDs", [loadedViewable.getName()])
                            : "Viewable has no material IDs"
                    }));
                }
            });
            progressDialog.close();
            sourceTree.setRootItems(treeRoots);
            handleTreeUpdates([sourceTree, targetTree]);

            if (messageView.getItems().length) {
                showMessageDialog();
            }
        };

        scene.attachLoadCompleted(function (event) {
            progressDialog.setProgressText("Creating tree...")
            progressDialog.open();
            sap.ui.getCore().applyChanges();
            
            setTimeout(function() {
                createTree();
            });
        });


        // 9. Miscellaneous initialization and cleanup code
        handleTreeUpdates([sourceTree, targetTree]);
        setButtonEnabledStatus();

        window.onbeforeunload = function(e) {
            splitter.destroy(true);
        };


        // 10. Layout the panels and place in the control hierarchy
        var splitter = new sap.ui.layout.Splitter({
            orientation: sap.ui.core.Orientation.Horizontal,
            contentAreas: [sourcePanel, targetPanel]
        });

        var page = new sap.m.Page({
            content: [splitter],
            showHeader: false,
            footer: new sap.m.Toolbar({
                content: [linkSelectionToggleButton, linkViewsToggleButton]
            })
        })
        page.placeAt(containingDivId);

        // That's it.
    });
}
