function buildExample(containingDivId) {
    "use strict";

    jQuery.sap.measure.setActive(true, ["sap.ui.vtm"]);

    var messageView = new sap.m.MessageView();

    // 1. Create VTM and the panels.
    var vtm = sap.ui.vtm.createVtm("vtm");
    vtm.attachInitialized(function() {
        var sourcePanel = vtm.createPanel("source", {
            title: "Source"
        });
        var workingPanel = vtm.createPanel("working", {
            title: "Working"
        });
        var targetPanel = vtm.createPanel("target", {
            title: "Target"
        });

        vtm.setActivePanel(sourcePanel);

        var scene = vtm.getScene();

        var sourceTree = sourcePanel.getTree();
        var workingTree = workingPanel.getTree();
        var targetTree = targetPanel.getTree();
        var trees = [sourceTree, workingTree, targetTree];

        trees.forEach(function(tree) {
            tree.setSelectionMode(sap.ui.vtm.SelectionMode.MultiToggleWithSingleSelect);
        });

        var workingViewport = workingPanel.getViewport();
        var targetViewport = targetPanel.getViewport();

        // Create some lookups used for planning status calculation and selection linking
        var treeLookupsByTree = new Map();
        treeLookupsByTree.set(sourceTree, TreeLookups.createTreeLookups(sourceTree));
        treeLookupsByTree.set(workingTree, TreeLookups.createTreeLookups(workingTree));
        treeLookupsByTree.set(targetTree, TreeLookups.createTreeLookups(targetTree));

        // Create some lookups used for geometry matching
        var sceneNodeLookups = SceneNodeLookups.createLookups();

        // Code to handle tree modifications
        var handleTreeUpdates = function (updatedTrees) {
            var updateIcons = function(tree) {
                tree.traverseTree(function(treeItem) {
                    var hasChildren = sap.ui.vtm.TreeItemUtilities.hasIncludedChildren(treeItem);
                    treeItem.iconUrl = hasChildren ? "sap-icon://tree" : "sap-icon://product";
                    treeItem.iconTooltip = hasChildren ? "Group/Assembly" : "Item";
                });
            };

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
                treeLookupsByTree.get(workingTree),
                treeLookupsByTree.get(targetTree));
            
            var modifiedTrees = sap.ui.vtm.ArrayUtilities.union([updatedTrees, treesWithUpdatedPlanningStatus]);
            modifiedTrees.forEach(function(modifiedTree) {
                modifiedTree.updateModel();
            });
        };
        
        // Populate the target tree with a top level assembly.
        var createTopLevelAssembly = function() {
            targetTree.addRoot({
                id: jQuery.sap.uid(),
                name: "Top Level Assembly",
                visibility: true,
                relativeMatrix: sap.ui.vtm.MatrixUtilities.createIdentity(),
                absoluteMatrix: sap.ui.vtm.MatrixUtilities.createIdentity(),
                appData: {
                    topLevel: "true"
                }
            });
        };
        var isTopLevelAssembly = function(treeItem) {
            return treeItem && treeItem.appData && treeItem.appData.topLevel;
        }
        createTopLevelAssembly();


        // 3. Specify some commands
        var originalTreeRootsByTree = new Map();

        var isolateSelected = function(tree) {
            var selectedItems = tree.getSelectedItems();
            var rootItems = tree.getRootItems();
            var isolatedRoots = [];
            tree.traverseTree(function(treeItem, ancestors) {
                var itemSelected = selectedItems.indexOf(treeItem) !== -1;
                var ancestorSelected = sap.ui.vtm.ArrayUtilities.haveIntersection([selectedItems, ancestors]);
                var isolated = itemSelected || ancestorSelected;
                if (itemSelected && !ancestorSelected) {
                    isolatedRoots.push(treeItem);
                }
                if (sap.ui.vtm.TreeItemUtilities.hasVisibility(treeItem)) {
                    treeItem.visibility = isolated;
                }
            });
            if (!originalTreeRootsByTree.has(tree)) {
                originalTreeRootsByTree.set(tree, rootItems);
            }
            tree.setSelectedItems([]);
            tree.setRootItems(isolatedRoots);
            handleTreeUpdates([tree]);
            tree.collapseAll();
         };
        
        var showAll = function(tree) {
            var originalTreeRoots = originalTreeRootsByTree.get(tree);
            if (originalTreeRoots) {
                tree.setRootItems(originalTreeRoots);
            }
            originalTreeRootsByTree.delete(tree);
            tree.traverseTree(function(treeItem) {
                if (sap.ui.vtm.TreeItemUtilities.hasVisibility(treeItem)) {
                    treeItem.visibility = true;
                }
            });
            tree.setSelectedItems([]);
            tree.collapseAll();
            tree.expandToLevel(1);
        };

        var planItems = function (sourceItems, targetItem, targetItemTree, recursive) {
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
                if (sap.ui.vtm.TreeItemUtilities.hasVisibility(sourceTreeItem)) {
                    plannedTreeItem.visibility = true;
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
                } else {
                    targetItemTree.addRoot(plannedTreeItem);
                    if (plannedTreeItem.relativeMatrix) {
                        plannedTreeItem.relativeMatrix = calculateRelativeMatrix(plannedTreeItem.absoluteMatrix, null);
                    }
                }
                plannedTreeItems.push(plannedTreeItem);
            });
            targetItemTree.setVisibility(plannedTreeItems, true, true);
            return plannedTreeItems;
        };

        var deleteItems = function (itemsToDelete, tree) {
            itemsToDelete.forEach(function(itemToDelete) {
                var parentItem = tree.getParentItem(itemToDelete.id);
                if (parentItem)
                    sap.ui.vtm.TreeItemUtilities.removeChild(parentItem, itemToDelete);
                else
                    sap.ui.vtm.TreeItemUtilities.removeRoot(tree.getRootItems(), itemToDelete);
            });
        };


        // 4. Create some menus/buttons
        var planMenuItem = new sap.m.MenuItem({
            text: "Plan Items",
            press: function (event) {
                var sourceSelectedItems = sourceTree.getSelectedItems();
                var workingSelectedItems = workingTree.getSelectedItems();
                var workingItem = workingSelectedItems.length == 0 ? workingTree.getRootItems()[0] : workingSelectedItems[0];
                planItems(sourceSelectedItems, workingItem, workingTree, false);
                handleTreeUpdates([workingTree]);
            }
        });

        var planAsDesignedMenuItem = new sap.m.MenuItem({
            text: "Plan as Designed",
            press: function (event) {
                var sourceSelectedItems = sourceTree.getSelectedItems();
                var targetSelectedItems = targetTree.getSelectedItems();
                var targetItem = targetSelectedItems.length == 0 ? null : targetSelectedItems[0];
                planItems(sourceSelectedItems, targetItem, targetTree, true);
                handleTreeUpdates([targetTree]);
            }
        });

        var sourcePlanMenu = new sap.m.Menu({
            items: [planMenuItem, planAsDesignedMenuItem]
        });

        var sourcePlanMenuButton = new sap.m.Button({
            text: "Plan",
            press: function(event) {
                sourcePlanMenu.openBy(event.getSource());
            }
        });

        var targetDeleteMenuItem = new sap.m.MenuItem({
            text: "Delete",
            press: function (event) {
                var itemsToDelete = targetTree.getSelectedItems();
                deleteItems(itemsToDelete, targetTree);
                handleTreeUpdates([targetTree]);
            }
        });
        
        var workingDeleteMenuItem = new sap.m.MenuItem({
            text: "Delete",
            press: function (event) {
                var itemsToDelete = workingTree.getSelectedItems();
                deleteItems(itemsToDelete, workingTree);
                handleTreeUpdates([workingTree]);
            }
        });
        
        var sendToTargetMenuItem = new sap.m.MenuItem({
            text: "Send To Target",
            press: function() {
                var plannedTreeItem = planItems([workingTree.getRootItems()[0]], null, targetTree, true)[0];
                if (isTopLevelAssembly(plannedTreeItem)) {
                    sap.ui.vtm.TreeItemUtilities.includeAllChildren(plannedTreeItem, true);
                } else {
                    sap.ui.vtm.TreeItemUtilities.excludeAllChildren(plannedTreeItem);
                }
                workingTree.setRootItems([]);
                handleTreeUpdates([workingTree, targetTree]);
           }
        });

        var sendToWorkingMenuItem = new sap.m.MenuItem({
            text: "Send To Working",
            press: function() {
                var targetTreeItem = targetTree.getSelectedItems()[0];
                var workingTreeRootItems = workingTree.getRootItems();
                var plannedTreeItems;
                if (workingTreeRootItems.length) {
                    plannedTreeItems = planItems([targetTreeItem], workingTreeRootItems[0], workingTree, true);
                    sap.ui.vtm.TreeItemUtilities.excludeAllChildren(plannedTreeItems[0]);
                    deleteItems([targetTreeItem], targetTree);
                } else {
                    plannedTreeItems = planItems([targetTreeItem], null, workingTree, true);
                    sap.ui.vtm.TreeItemUtilities.includeAllChildren(plannedTreeItems[0]);
                    var childItems = sap.ui.vtm.TreeItemUtilities.getChildren(plannedTreeItems[0]);
                    sap.ui.vtm.TreeItemUtilities.excludeAllChildren(childItems);
                    deleteItems([targetTreeItem], targetTree);
                }
                handleTreeUpdates([workingTree, targetTree]);
           }
        });

        var targetPlanMenu = new sap.m.Menu({
            items: [sendToWorkingMenuItem, targetDeleteMenuItem]
        });

        var targetPlanMenuButton = new sap.m.Button({
            text: "Plan",
            press: function(event) {
                targetPlanMenu.openBy(event.getSource());
            }
        });

        var selectColumnsDialog = new sap.ui.vtm.SelectColumnsDialog();

        var selectSourceColumnsMenuItem = new sap.m.MenuItem({
            text: "Select Columns",
            press: function () {
                var selectableColumns = SelectableTreeColumnsCalculator.getSelectableColumns(trees);
                selectColumnsDialog.setTree(sourceTree);
                selectColumnsDialog.setSelectableColumns(selectableColumns);
                selectColumnsDialog.open();
            },
        });

        var sourceIsolateSelectedMenuItem = new sap.m.MenuItem({
            text: "Isolate Selected",
            press: function() {
                isolateSelected(sourceTree);
            }
        });

        var sourceShowAllMenuItem = new sap.m.MenuItem({
            text: "Show All",
            press: function() {
                showAll(sourceTree);
                handleTreeUpdates([sourceTree]);
            }
        });

        var sourceTreeMenu = new sap.m.Menu({
            items: [selectSourceColumnsMenuItem, sourceIsolateSelectedMenuItem, sourceShowAllMenuItem]
        });

        var sourceTreeMenuButton = new sap.m.Button({
            text: "Tree",
            press: function(event) {
                sourceTreeMenu.openBy(event.getSource());
            }
        });

        var selectWorkingColumnsButton = new sap.m.MenuItem({
            text: "Select Columns",
            press: function () {
                var selectableColumns = SelectableTreeColumnsCalculator.getSelectableColumns(trees);
                selectColumnsDialog.setTree(workingTree);
                selectColumnsDialog.setSelectableColumns(selectableColumns);
                selectColumnsDialog.open();
            },
        });

        var workingIsolateSelectedMenuItem = new sap.m.MenuItem({
            text: "Isolate Selected",
            press: function() {
                isolateSelected(workingTree);
                handleTreeUpdates([workingTree]);
            }
        });

        var workingShowAllMenuItem = new sap.m.MenuItem({
            text: "Show All",
            press: function() {
                showAll(workingTree);
                handleTreeUpdates([workingTree]);
            }
        });

        var workingTreeMenu = new sap.m.Menu({
            items: [selectWorkingColumnsButton, workingIsolateSelectedMenuItem, workingShowAllMenuItem]
        });

        var workingTreeMenuButton = new sap.m.Button({
            text: "Tree",
            press: function(event) {
                workingTreeMenu.openBy(event.getSource());
            }
        });

        var selectTargetColumnsButton = new sap.m.MenuItem({
            text: "Select Columns",
            press: function () {
                var selectableColumns = SelectableTreeColumnsCalculator.getSelectableColumns(trees);
                selectColumnsDialog.setTree(targetTree);
                selectColumnsDialog.setSelectableColumns(selectableColumns);
                selectColumnsDialog.open();
            },
        });

        var targetIsolateSelectedMenuItem = new sap.m.MenuItem({
            text: "Isolate Selected",
            press: function() {
                isolateSelected(targetTree);
                handleTreeUpdates([targetTree]);
            }
        });

        var targetShowAllMenuItem = new sap.m.MenuItem({
            text: "Show All",
            press: function() {
                showAll(targetTree);
                handleTreeUpdates([targetTree]);
            }
        });

        var targetTreeMenu = new sap.m.Menu({
            items: [selectTargetColumnsButton, targetIsolateSelectedMenuItem, targetShowAllMenuItem]
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
                messageView.removeAllItems();
                loadViewableDialog.open();
            },
        });

        var fileMenu = new sap.m.Menu({
            items: [loadFileMenuItem]
        });
        
        var fileMenuButton = new sap.m.Button({
            text: "File",
            press: function(event) {
                fileMenu.openBy(event.getSource());
            }
        });

        var assemblyNumber = 0
        var createStructureMenuItem = new sap.m.MenuItem({
            text: "Create Assembly",
            press: function() {
                workingTree.addRoot({
                    id: jQuery.sap.uid(),
                    name: "Custom Assembly " + assemblyNumber++,
                    visibility: true,
                    relativeMatrix: sap.ui.vtm.MatrixUtilities.createIdentity(),
                    absoluteMatrix: sap.ui.vtm.MatrixUtilities.createIdentity()
                });
                handleTreeUpdates([workingTree]);
            }
        });
        
        var nonVisualNumber = 0;
        var createNonVisualMenuItem = new sap.m.MenuItem({
            text: "Create Non Visual",
            press: function() {
                var root = workingTree.getRootItems()[0];
                sap.ui.vtm.TreeItemUtilities.addChild(root, {
                    id: jQuery.sap.uid(),
                    name: "Non Visual " + nonVisualNumber++
                });
                handleTreeUpdates([workingTree]);
            }
        });

        var workingPlanMenu = new sap.m.Menu({
            items: [sendToTargetMenuItem, workingDeleteMenuItem, createStructureMenuItem, createNonVisualMenuItem]
        });

        var workingPlanMenuButton = new sap.m.Button({
            text: "Plan",
            press: function(event) {
                workingPlanMenu.openBy(event.getSource());
            }
        });

        var linkSelectionToggleButton, linkViewsToggleButton;

        var applyLinkSelectionState = function() {
            var findMatchingItems = function(selectedTreeItem, selectionSourceTree, selectionTargetTree) {
                var toLookup = treeLookupsByTree.get(selectionTargetTree);
                var matchingItems = toLookup.findTreeItemMatches(selectedTreeItem, selectionSourceTree);
                return matchingItems;
            };
            var selectionLinkingExtension = vtm.getExtensionByInterface("sap.ui.vtm.interfaces.ISelectionLinkingExtension");
            selectionLinkingExtension.setFindMatchingTreeItems(findMatchingItems);
            selectionLinkingExtension.setEnabled(linkSelectionToggleButton.getPressed());
        };

        linkSelectionToggleButton = new sap.m.ToggleButton({
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

        linkViewsToggleButton = new sap.m.ToggleButton({
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
        
        workingPanel.addTreeHeaderControl(new sap.m.OverflowToolbar({
            content: [workingPlanMenuButton, workingTreeMenuButton],
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
                var sourceSelectedItems = sourceTree.getSelectedItems(),
                    sourceHasSelection = sourceSelectedItems.length !== 0,
                    workingSelectedItems = workingTree.getSelectedItems(),
                    workingHasSelection = workingSelectedItems.length !== 0,
                    workingSelectionIncludesTopLevel = workingSelectedItems.length && workingSelectedItems.some(isTopLevelAssembly),
                    targetSelectedItems = targetTree.getSelectedItems(),
                    targetRootItems = targetTree.getRootItems(),
                    targetHasSelection = targetSelectedItems.length !== 0,
                    targetHasMultipleItemsSelected = targetSelectedItems.length > 1,
                    targetSelectionIncludesTopLevel = targetSelectedItems.length && targetSelectedItems.some(isTopLevelAssembly),
                    targetSelectionIncludesRoot = sap.ui.vtm.ArrayUtilities.haveIntersection([targetSelectedItems, targetRootItems]),
                    sourceTreeEmpty = sourceTree.getRootItems().length === 0,
                    workingTreeEmpty = workingTree.getRootItems().length === 0,
                    targetTreeEmpty = targetTree.getRootItems().length === 0;
                workingDeleteMenuItem.setEnabled(workingHasSelection && !workingSelectionIncludesTopLevel);
                targetDeleteMenuItem.setEnabled(targetHasSelection && !targetSelectionIncludesTopLevel);
                planMenuItem.setEnabled(itemsArePlannable(sourceSelectedItems) && !workingTreeEmpty);
                planAsDesignedMenuItem.setEnabled(canPlanAsDesigned(sourceSelectedItems, targetSelectedItems));
                createStructureMenuItem.setEnabled(workingTreeEmpty);
                sendToTargetMenuItem.setEnabled(!workingTreeEmpty);
                sendToWorkingMenuItem.setEnabled(targetHasSelection && !targetHasMultipleItemsSelected && targetSelectionIncludesRoot && (!targetSelectionIncludesTopLevel || workingTreeEmpty));
                createNonVisualMenuItem.setEnabled(!workingTreeEmpty);
                sourceIsolateSelectedMenuItem.setEnabled(sourceHasSelection);
                workingIsolateSelectedMenuItem.setEnabled(workingHasSelection);
                targetIsolateSelectedMenuItem.setEnabled(targetHasSelection);
                sourceShowAllMenuItem.setEnabled(!sourceTreeEmpty);
                workingShowAllMenuItem.setEnabled(!workingTreeEmpty);
                targetShowAllMenuItem.setEnabled(!targetTreeEmpty);
            });
        };

        sourceTree.attachSelectionChanged(function (event) { setButtonEnabledStatus(); });
        workingTree.attachSelectionChanged(function (event) { setButtonEnabledStatus(); });
        targetTree.attachSelectionChanged(function (event) { setButtonEnabledStatus(); });
        sourceTree.attachModelUpdated(function (event) { setButtonEnabledStatus(); });
        workingTree.attachModelUpdated(function (event) { setButtonEnabledStatus(); });
        targetTree.attachModelUpdated(function (event) { setButtonEnabledStatus(); });


        // 7. Add some drag and drop handlers
        sourceTree.attachDragStart(function (event) {
            var dragItem = event.getParameter("dragItem");
            var sourceSelectedItems = sourcePanel.getTree().getSelectedItems();
            var itemsToPlan = sourceSelectedItems.length == 0 ? [dragItem] : sourceSelectedItems;
            var allowDrag = itemsArePlannable(itemsToPlan);
            if (!allowDrag) {
                event.preventDefault();
            }
        });
        
        workingTree.attachDragOver(function (event) {
            // Allow drop on empty space or tree items if there is a root item
            var allowDrop = workingTree.getRootItems().length !== 0;
            if (allowDrop) {
                event.preventDefault();
            }
        });  

        workingTree.attachDrop(function(event) {
            var dragTree = event.getParameter("dragTree");
            var dragItem = event.getParameter("dragItem");
            var rootItem = workingTree.getRootItems()[0];
            switch (dragTree) {
            case sourceTree:
                var sourceSelectedItems = sourcePanel.getTree().getSelectedItems();
                var itemsToPlan = sourceSelectedItems.length == 0 ? [dragItem] : sourceSelectedItems;
                planItems(itemsToPlan, rootItem, workingTree, false);
                handleTreeUpdates([workingTree]);
                break;
            default:
                break;
            }
        });
        
        // For simplicity prevent drags being initiated from the target tree
        targetTree.attachDragStart(function (event) { event.preventDefault(); }); 

        // 8. Some code to handle file loads
        var progressDialog = new sap.ui.vtm.ProgressDialog({
            progressBarVisible: false
        });

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

        var updateSourceTree = function(tree, loadedViewables) {
            var treeRoots = tree.getRootItems();
            var sceneNodeInfoMap = new Map();

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
                    var source = loadedViewable.getSource();
                    var sourceString = typeof source === "string" ? source : source.name;
                    messageView.addItem(new sap.m.MessagePopoverItem({
                        type: sap.ui.core.MessageType.Error,
                        title: jQuery.sap.formatMessage("Viewable has no material IDs: {0}", [sourceString])
                    }));
                }
            });
            progressDialog.close();
            sourceTree.setRootItems(treeRoots);
            handleTreeUpdates([sourceTree]);
            workingViewport.refresh();
            targetViewport.refresh()
        };

        scene.attachDownloadCompleted(function(event) {
            var viewableLoadInfos = event.getParameter("viewableLoadInfos");
            var allFailed = true;
            viewableLoadInfos.forEach(function(viewableLoadInfo) {
                var status = viewableLoadInfo.getStatus();
                if (status === sap.ui.vtm.ViewableLoadStatus.DownloadFailed) {
                    var sourceString = viewableLoadInfo.getViewable().getSourceString();
                    messageView.addItem(new sap.m.MessagePopoverItem({
                        type: sap.ui.core.MessageType.Error,
                        title: jQuery.sap.formatMessage("Viewable could not be downloaded: {0}", [sourceString])
                    }));
                } else {
                    allFailed = false;
                }
            });
            if (allFailed) {
                showMessageDialog();
            }
        });
        
        scene.attachLoadCompleted(function (event) {
            var viewableLoadInfos = event.getParameter("viewableLoadInfos");
            viewableLoadInfos.forEach(function(viewableLoadInfo) {
                var status = viewableLoadInfo.getStatus();
                if (status === sap.ui.vtm.ViewableLoadStatus.LoadFailed) {
                    var sourceString = viewableLoadInfo.getViewable().getSourceString();
                    messageView.addItem(new sap.m.MessagePopoverItem({
                        type: sap.ui.core.MessageType.Error,
                        title: jQuery.sap.formatMessage("Viewable could not be loaded: {0}", [sourceString])
                    }));
                }
            });
            var loadedViewables = event.getParameter("loadedViewables");
            if (loadedViewables.length === 0) {
                return;
            }
            [workingViewport, targetViewport].forEach(function(viewport) {
                // Avoid showing the loaded geometry in the viewports while the scene tree is being traversed.
                // Allow it to be shown in the source tree since this example we are including all the new geometry in the source tree.
                viewport.refresh();
            });

            var progressMessage = sourceTree.isEmpty() ? "Creating tree..." : "Updating tree...";
            progressDialog.setProgressText(progressMessage);
            progressDialog.open();
            sap.ui.getCore().applyChanges();

            setTimeout(function() {
                updateSourceTree(sourceTree, loadedViewables);
                
                if (messageView.getItems().length) {
                    showMessageDialog();
                }
            });
        });


        // Buttons to demonstrate saving and restoring tree state
        var saveTreeState = function() {
            var storage = window.localStorage;
            storage.setItem("sourceTree", JSON.stringify(sourceTree.getRootItems()));
            storage.setItem("workingTree", JSON.stringify(workingTree.getRootItems()));
            storage.setItem("targetTree", JSON.stringify(targetTree.getRootItems()));
        };

        var restoreTreeState = function() {
            var storage = window.localStorage;
            var sourceTreeString = storage.getItem("sourceTree");
            if (sourceTreeString) {
                sourceTree.setRootItems(JSON.parse(sourceTreeString));
            }
            var workingTreeString = storage.getItem("workingTree");
            if (workingTreeString) {
                workingTree.setRootItems(JSON.parse(workingTreeString));
            }
            var targetTreeString = storage.getItem("targetTree");
            if (targetTreeString) {
                targetTree.setRootItems(JSON.parse(targetTreeString));
            }
            handleTreeUpdates([sourceTree, workingTree, targetTree]);
        };

        var saveTreeStateButton = new sap.m.Button({
            text: "Save Tree State",
            press: saveTreeState
        });
        var restoreTreeStateButton = new sap.m.Button({
            text: "Restore Tree State",
            press: restoreTreeState
        });


        // 9. Layout the panels and place  in the control hierarchy
        var splitter = new sap.ui.layout.Splitter({
            orientation: sap.ui.core.Orientation.Horizontal,
            contentAreas: [sourcePanel, new sap.ui.layout.Splitter({
                orientation: sap.ui.core.Orientation.Vertical,
                contentAreas: [workingPanel, targetPanel]
            })]
        });

        var page = new sap.m.Page({
            content: [splitter],
            showHeader: false,
            footer: new sap.m.Toolbar({
                content: [linkSelectionToggleButton, linkViewsToggleButton, saveTreeStateButton, restoreTreeStateButton]
            })
        })
        page.placeAt(containingDivId);


        // 10. Miscellaneous initialization and cleanup code
        handleTreeUpdates(trees);
        setButtonEnabledStatus();

        window.onbeforeunload = function(e) {
            splitter.destroy(true);
        };

        // That's it.
    });
}
