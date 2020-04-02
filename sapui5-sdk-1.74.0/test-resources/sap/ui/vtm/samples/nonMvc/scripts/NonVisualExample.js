function buildExample(containingDivId) {
    "use strict";

    jQuery.sap.measure.setActive(true, ["sap.ui.vtm"]);

    var matrixUtilities = sap.ui.vtm.MatrixUtilities;
    var currentTreeItemId = 0;
    var createTreeItemId = function () { return "ti_" + currentTreeItemId++; };
    var createIdentityMatrix = sap.ui.vtm.MatrixUtilities.createIdentity;

    // Some functions to create and translate BOM hierarchies.
    function createBomTree(mainBom, boms) {
        var bomTree = {
            mainBom: mainBom,
            bomsByBomId: new Map()
        };
        boms.forEach(function(bom) {
            addBom(bomTree, bom);
        });
        if (!bomTree.bomsByBomId.has(mainBom.bomId))
            addBom(bomTree, mainBom);
        return bomTree;
    }

    function addBom(bomTree, bom) {
        var bomId = bom.bomId;
        var bomsByBomId = bomTree.bomsByBomId;
        if (bomsByBomId.has(bomId))
            throw "Duplicate bom id: '" + bomId + "'.";
        bomsByBomId.set(bomId, bom);
    }

    function handleTreeUpdate(tree) {
        tree.validateTree();
        tree.updateCollections();
        tree.updateModel();
    }

    function createTreeFromBomTree(tree, bomTree) {
        var rootTreeItems = createTreeRootsFromBomTree(tree, bomTree);
        tree.setRootItems(rootTreeItems);
        handleTreeUpdate(tree);
    }

    function createTreeRootsFromBomTree(tree, bomTree) {
        var rootBom = bomTree.mainBom;
        var bomsByBomId = bomTree.bomsByBomId;
        var rootTreeItems = rootBom.items.map(function (bomItem) { return createTreeItemFromBomItem(tree, bomItem, rootBom, null, bomsByBomId); });
        return rootTreeItems;
    }

    function createTreeItemFromBomItem(tree, bomItem, bom, parentTreeItem, bomsByBomId) {
        var treeItem;
        var bomId = bom.bomId;
        var name = bomItem.name;
        var bomItemId = bomItem.bomItemId;
        var refBomId = bomItem.refBomId;
        var relativeMatrix = bomItem.relativeMatrix;
        var id = createTreeItemId();
        var absoluteMatrix = parentTreeItem
            ? sap.ui.vtm.TreeItemUtilities.calculateAbsoluteMatrix(bomItem.relativeMatrix, parentTreeItem.absoluteMatrix)
            : bomItem.relativeMatrix;

        if (!refBomId) {
            treeItem = {
                id: id,
                name: name,
                appData: {
                    "bomId": bomId,
                    "bomItemId": bomItemId,
                },
                relativeMatrix: relativeMatrix,
                absoluteMatrix: absoluteMatrix
            };
            if (parentTreeItem)
                sap.ui.vtm.TreeItemUtilities.addChild(parentTreeItem, treeItem);

            var childBomItems = bomItem.children;
            if (childBomItems) {
                childBomItems.forEach(function(childBomItem) {
                    createTreeItemFromBomItem(tree, childBomItem, bom, treeItem, bomsByBomId);
                });
            }
        }
        else {
            treeItem = {
                id: id,
                name: name,
                appData:{
                    "bomId": bomId,
                    "refBomId": refBomId,
                    "bomItemId": bomItemId,
                },
                relativeMatrix: relativeMatrix,
                absoluteMatrix: absoluteMatrix
            };
            if (parentTreeItem)
                sap.ui.vtm.TreeItemUtilities.addChild(parentTreeItem, treeItem);
            var childBom = bomsByBomId.get(refBomId);
            if (!childBom)
                throw "Bom with id '" + bomId + "' not found.";

            var childBomItems = childBom.items;
            if (childBomItems) {
                childBomItems.forEach(function(childBomItem) {
                    createTreeItemFromBomItem(tree, childBomItem, childBom, treeItem, bomsByBomId);
                });
            }
        }
        return treeItem;
    }

    var sourceRootBom = null;
    var sourceBoms = null;
    var targetRootBom = null;
    var currentBomId = 0;
    var currentBomItemId = 0;
    var createBomId = function () { return "b_" + currentBomId++; };
    var createBomItemId = function () { return "bi_" + currentBomItemId++; };

    // Create some fake BOM data.
    var wheelSystemBom = {
        bomId: createBomId(),
        name: "System Wheel BOM",
        items: [
            {
                bomItemId: createBomItemId(),
                name: "Wheel Skateboard",
                relativeMatrix: createIdentityMatrix(),
                children: [
                    {
                        bomItemId: createBomItemId(),
                        name: "PartBody",
                        relativeMatrix: createIdentityMatrix(),
                        children: [
                            {
                                bomItemId: createBomItemId(),
                                name: "Chamfer.1",
                                relativeMatrix: createIdentityMatrix()
                            }
                        ]
                    }
                ]
            },
            {
                bomItemId: createBomItemId(),
                name: "Gear",
                relativeMatrix: matrixUtilities.fromVsmMatrixString("1 0 0 0 1 0 0 0 1 0 4.00000000000001 0 1")
            }
        ]
    };

    var completeTruckWithWheelBom = {
        bomId: createBomId(),
        name: "Complete Truck With Wheel BOM",
        items: [
            {
                bomItemId: createBomItemId(),
                name: "Truck",
                relativeMatrix: matrixUtilities.fromVsmMatrixString("1 0 0 0 1 0 0 0 1 7.105427357601E-15 20 0 1")
            },
            {
                bomItemId: createBomItemId(),
                name: "System Wheel",
                relativeMatrix: matrixUtilities.fromVsmMatrixString("1 0 0 0 1 0 0 0 1 -26.3093410995522 80 -56.8259993373748 1"),
                refBomId: wheelSystemBom.bomId
            },
            {
                bomItemId: createBomItemId(),
                name: "System Wheel",
                relativeMatrix: matrixUtilities.fromVsmMatrixString("0.837169104331222 0 0.546944138603989 0 -1 0 0.546944138603989 0 -0.837169104331222 -26.3093410995522 -40 -56.8259993373748 1"),
                refBomId: wheelSystemBom.bomId
            }
        ]
    };

    var skateboardBom = {
        bomId: createBomId(),
        name: "Skateboard BOM",
        items: [
            {
                bomItemId: createBomItemId(),
                name: "Deck",
                relativeMatrix: matrixUtilities.fromVsmMatrixString("-1 -3.88578058618805E-16 9.63634374750424E-18 3.88578058618805E-16 -1 -1.2208090799712E-16 9.63634374750429E-18 -1.2208090799712E-16 1 467.518653869629 1.43923950195322 -3.5527136788005E-15 1"),
            },
            {
                bomItemId: createBomItemId(),
                refBomId: completeTruckWithWheelBom.bomId,
                name: "Complete Truck With Wheel",
                relativeMatrix: matrixUtilities.fromVsmMatrixString("1 1.66533453693773E-16 -1.20042864537595E-15 -2.22044604925031E-16 1 -1.87350135405495E-16 7.28583859910259E-16 1.66533453693773E-16 1 233.653800883859 -18.5607604980468 -28.1827764819507 1")
            },
            {
                bomItemId: createBomItemId(),
                refBomId: completeTruckWithWheelBom.bomId,
                name: "Complete Truck With Wheel",
                relativeMatrix: matrixUtilities.fromVsmMatrixString("-1 6.20407086386848E-16 -9.99200722162571E-16 -5.64895935155597E-16 -1 6.92196276505141E-15 -6.10622663543836E-16 6.94277944676314E-15 1 701.383506855398 21.4392395019533 -28.1827764819509 1")
            }
        ]
    };

    sourceRootBom = {
        bomId: createBomId(),
        name: "Root BOM",
        items: [
            {
                bomItemId: createBomItemId(),
                name: "Skateboard",
                relativeMatrix: createIdentityMatrix(),
                refBomId: skateboardBom.bomId
            }
        ]
    };

    sourceBoms = [
        skateboardBom,
        completeTruckWithWheelBom,
        wheelSystemBom
    ];

    targetRootBom = {
        bomId: createBomId(),
        name: "Skateboard MBOM",
        items: [
            {
                bomItemId: createBomItemId(),
                name: "Restructured Skateboard"
            }
        ]
    };


    // 1. Create VTM and the panels.
    var vtm = sap.ui.vtm.createVtm("vtm");
    vtm.attachInitialized(function() {

        var sourcePanel = vtm.createPanel("source", {
            title: "Source",
            showViewport: false
        });
        var targetPanel = vtm.createPanel("target", {
            title: "Target",
            showViewport: false
        });

        var sourceTree = sourcePanel.getTree();
        var targetTree = targetPanel.getTree();


        // 2. Add and remove some columns
        var notVisibilityColumn = function(column) { return column.getDescriptor() !== sap.ui.vtm.InternalColumnDescriptor.Visibility; }
        sourceTree.setFixedColumns(sourceTree.getFixedColumns().filter(notVisibilityColumn));
        targetTree.setFixedColumns(targetTree.getFixedColumns().filter(notVisibilityColumn));

        var columns = [
            new sap.ui.vtm.Column({
                type: sap.ui.vtm.ColumnType.AppData,
                descriptor:"bomItemId",
                label: "bomItemId"
            }),
            new sap.ui.vtm.Column({
                type: sap.ui.vtm.ColumnType.AppData,
                descriptor: "bomId",
                label: "bomId"
            }),
            new sap.ui.vtm.Column({
                type: sap.ui.vtm.ColumnType.AppData,
                descriptor: "refBomId",
                label: "refBomId"
            }),
            sap.ui.vtm.InternalColumns.createRelativeMatrixColumn(),
            sap.ui.vtm.InternalColumns.createAbsoluteMatrixColumn(),
        ];
        sourceTree.setDataColumns(columns);
        targetTree.setDataColumns(columns);


        // 3. Create the initial trees
        var fakeSourceBomTree = createBomTree(sourceRootBom, sourceBoms);
        createTreeFromBomTree(sourceTree, fakeSourceBomTree);
        var fakeTargetBomTree = createBomTree(targetRootBom, []);
        createTreeFromBomTree(targetTree, fakeTargetBomTree);


        // 4. Specify some commands
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
                return plannedTreeItem;
            };

            var calculateRelativeMatrix = sap.ui.vtm.TreeItemUtilities.calculateRelativeMatrix;
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
            });
            handleTreeUpdate(targetTree);
        };

        var deleteItems = function (itemsToDelete, tree) {
            var targetSelectedItems = tree.getSelectedItems();
            targetSelectedItems.forEach(function(targetItem) {
                var targetItemParent = targetTree.getParentItem(targetItem.id);
                if (targetItemParent)
                    sap.ui.vtm.TreeItemUtilities.removeChild(targetItemParent, targetItem);
                else
                    sap.ui.vtm.TreeItemUtilities.removeRoot(tree.getRootItems(), targetItem);
            });
            handleTreeUpdate(tree);
        };


        // 5. Create some buttons
        var planButton = new sap.m.Button({
            text: "Plan",
            press: function (event) {
                var sourceSelectedItems = sourceTree.getSelectedItems();
                var targetSelectedItems = targetTree.getSelectedItems();
                var targetItem = targetSelectedItems.length == 0 ? null : targetSelectedItems[0];
                planItems(sourceSelectedItems, targetItem, false);
            }
        });

        var planAsDesignedButton = new sap.m.Button({
            text: "Plan as Designed",
            press: function (event) {
                var sourceSelectedItems = sourceTree.getSelectedItems();
                var targetSelectedItems = targetTree.getSelectedItems();
                var targetItem = targetSelectedItems.length == 0 ? null : targetSelectedItems[0];
                planItems(sourceSelectedItems, targetItem, true);
            }
        });

        var deleteButton = new sap.m.Button({
            text: "Delete",
            press: function (event) {
                var itemsToDelete = targetTree.getSelectedItems();
                deleteItems(itemsToDelete, targetTree);
            }});


        // 6. Add the toolbars
        sourcePanel.addTreeHeaderControl(new sap.m.OverflowToolbar({
            content: [planButton, planAsDesignedButton],
            design: sap.m.ToolbarDesign.Transparent
        }));

        targetPanel.addTreeHeaderControl(new sap.m.OverflowToolbar({
            content: [deleteButton],
            design: sap.m.ToolbarDesign.Transparent
        }));


        // 7. Add code to manage the enabled state of the buttons
        var setButtonEnabledStatus = function () {
            var sourceSelectedItems = sourceTree.getSelectedItems();
            var targetSelectedItems = targetTree.getSelectedItems();
            deleteButton.setEnabled(targetSelectedItems.length > 0);
            planButton.setEnabled(sourceSelectedItems.length > 0 && targetSelectedItems.length <= 1);
            planAsDesignedButton.setEnabled(sourceSelectedItems.length == 1 && targetSelectedItems.length <= 1);
        };

        sourceTree.attachSelectionChanged(function (event) { setButtonEnabledStatus(); });
        targetTree.attachSelectionChanged(function (event) { setButtonEnabledStatus(); });
        sourceTree.attachModelUpdated(function (event) { setButtonEnabledStatus(); });
        targetTree.attachModelUpdated(function (event) { setButtonEnabledStatus(); });

        // 8. Add some drag and drop handlers
        targetTree.attachDragStart(function (event) { event.preventDefault(); }); // Prevent drags being initiated from the target tree
        targetTree.attachDragOver(function (event) { event.preventDefault(); }); // Allow drop on empty space or tree items
        targetTree.attachDrop(function (event) {
            var dragItem = event.getParameter("dragItem");
            var dropItem = event.getParameter("dropItem");
            var sourceSelectedItems = sourcePanel.getTree().getSelectedItems();
            var itemsToPlan = sourceSelectedItems.length == 0 ? [dragItem] : sourceSelectedItems;
            planItems(itemsToPlan, dropItem, false);
            handleTreeUpdate(targetTree);
        });


        // 9. Miscellaneous initialization and cleanup code
        setButtonEnabledStatus();
        
        window.onbeforeunload = function(e) {
            splitter.destroy(true);
        };

        // 10. Layout the panels and place in the control hierarchy.
        var splitter = new sap.ui.layout.Splitter({
            orientation: sap.ui.core.Orientation.Horizontal,
            contentAreas: [sourcePanel, targetPanel]
        });
        splitter.placeAt(containingDivId, "last");

        // That's it.
    });
}
