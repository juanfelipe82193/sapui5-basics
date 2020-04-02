/* global QUnit*/

sap.ui.define([
    "sap/ui/vtm/library"
], function(
    lib
) {
    "use strict";

    QUnit.test("treeTests", function (assert) {
        var vtm = new sap.ui.vtm.createVtm();
        var panel = vtm.createPanel();
        vtm._addPanel(panel);
        var tree = panel.getTree();
        assert.ok(tree.getPanel() === panel);
        var item = {
            id: "123",
            name: "321",
            visibility: true,
            sceneNodeIds: ["1"]
        };
        var root =
            {
                id: "000",
                name: "000",
                visibility: true,
                sceneNodeIds: ["2"]
            };
        var child = {
            id: "456",
            name: "654",
            visibility: true,
            sceneNodeIds: ["3"],
            messages: '[{"level":"Error","text":"An error"},{"level":"Warning","text":"A warning"},{"level":"Information","text":"An info message"},{"level":"Error","text":"Another error"}]'
        };
        var grandChild = {
            id: "789",
            name: "987",
            visibility: true,
            sceneNodeIds: [],
            messageStatusIconUrl: ""
        };
        var invalidChild = {};

        sap.ui.vtm.TreeItemUtilities.addRoot(tree.getRootItems(), root);
        sap.ui.vtm.TreeItemUtilities.addChild(item, child);
        sap.ui.vtm.TreeItemUtilities.addChild(child, grandChild);
        tree.updateCollections();

        var checkTree = function () {
            var result = false;
            try {
                tree.validateTree();
                result = true;
            } catch (ex) {

            }
            return result;
        };

        assert.equal(checkTree(), true);
        sap.ui.vtm.TreeItemUtilities.addChild(root, invalidChild);
        assert.equal(checkTree(), false);
        sap.ui.vtm.TreeItemUtilities.removeChild(root, invalidChild);


        var all = tree.getAllItems();

        var expected = 1;
        var actual = all.length;
        var message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);

        expected = "000";
        actual = all[0].id;
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);

        expected = "000";
        actual = all[0].name;
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);

        sap.ui.vtm.TreeItemUtilities.removeRoot(tree.getRootItems(), root);
        sap.ui.vtm.TreeItemUtilities.addRoot(tree.getRootItems(), item);
        tree.updateCollections();
        all = tree.getAllItems();

        expected = 3;
        actual = all.length;
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);

        expected = "123";
        actual = all[0].id;
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);

        expected = "456";
        actual = all[1].id;
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);

        expected = tree.getId();
        actual = panel.getId() + "_tree";
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);

        tree.updateCollections();
        var parent = tree.getParentItem(child.id);

        expected = "123";
        actual = parent.id;
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.equal(expected, actual, message);

        expected = [-1.790003763307782, -1.442825918243607, 1.956553627716635, 0.06326958307217304, -0.2803196003884749, 0.22857485209991, -1.941043434637153, 0.05895656536284699, 0.941043434637153, 0.853795766762363, 1.0073716754806927, -0.853795766762363, 0];
        actual = sap.ui.vtm.TreeItemUtilities.calculateAbsoluteMatrix([1, 0.956553627716635, 0, 0, 0.22857485209991, 0.291844435172083, 0.941043434637153, 0, -1, -1, 0.146204233237637, 0, 0.491055731890283], [0.339166928706303, -1, 0, -1, -1, 1, -1, 0.0504203969847506, 1, 1, -1, 0, 0]);
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.ok(sap.ui.vtm.MatrixUtilities.areEqual(expected, actual), message);

        expected = [-2.3196788691687003, 1.8626192725540422, -0.241990451096312, -2.809072346614377, 2.537641439379466, 2.19998704689041, 0.007375121782702724, -0.005921959350700186, -0.7214942560353665, -0.6675709299734607, -0.46396438899708614, -0.7818555205136037, 0];
        actual = sap.ui.vtm.TreeItemUtilities.calculateRelativeMatrix([-1, 1, 0, -1, -1, 0.282056685668443, 0, 0.719084261785766, 0, -1, 0, -1, 0], [0, -1, 0, 1, 0.476190794481053, 0.802964279802034, 0.709078940427433, 1, 1, 0.00440195482429208, -1, 0, 1]);
        message = "\r\n" + expected + "\r\n" + actual + "\r\n";
        assert.ok(sap.ui.vtm.MatrixUtilities.areEqual(expected, actual), message);

        // columns
        var fixedColumns = tree.getFixedColumns();
        var treeColumn = fixedColumns[0];
        assert.ok(treeColumn.getDescriptor() === sap.ui.vtm.InternalColumnDescriptor.Tree);
        tree.setFixedColumns(fixedColumns);

        var dataColumn = new sap.ui.vtm.Column({
            type: sap.ui.vtm.ColumnType.AppData,
            descriptor: "AppData",
            label: "label"
        });
        try {
            tree.setDataColumns(null);
            assert.ok(false);
        } catch (ex) {

        }
        tree.setDataColumns([dataColumn]);
        assert.ok(tree.getDataColumns()[0] === dataColumn);

        tree.setRootItems([root, item]);
        tree.updateCollections();
        tree.updateModel();
        all = tree.getAllItems();

        // find items
        assert.ok(tree.getItem(child.id) === child);

        var itemsBySceneNodeId = tree.getItemsBySceneNodeId(child.sceneNodeIds);
        assert.ok(itemsBySceneNodeId.length === 1 && itemsBySceneNodeId[0] === child);

        itemsBySceneNodeId = tree.getItemsBySceneNodeId(child.sceneNodeIds[0]);
        assert.ok(itemsBySceneNodeId.length === 1 && itemsBySceneNodeId[0] === child);

        var descendantItems = tree.getDescendantItems(item.id);
        assert.ok(descendantItems.length === 2)

        var ancestorItems = tree.getAncestorItems(child.id);
        assert.ok(ancestorItems.length === 1)


        var treeWithExcludedItems = [{
            id: "1",
            includedChildren: [{
                id: "2",
                includedChildren: [{
                    id: "3",
                    includedChildren: [{
                        id: "4"
                    }],
                    excludedChildren: [{
                        id: "5"
                    }]
                }],
                excludedChildren: [{
                    id: "6",
                    includedChildren: [{
                        id: "7"
                    }],
                    excludedChildren: [{
                        id: "8"
                    }]
                }]
            }],
            excludedChildren: [{
                id: "9",
                includedChildren: [{
                    id: "10"
                }],
                excludedChildren: [{
                    id: "11"
                }]
            }]
        }];

        var excludedChildrenTree = new sap.ui.vtm.Tree()
        excludedChildrenTree.setRootItems(treeWithExcludedItems);
        excludedChildrenTree.updateCollections();
        excludedChildrenTree.updateModel();

        assert.ok(excludedChildrenTree.isIncludedItem(treeWithExcludedItems[0]));
        assert.ok(!excludedChildrenTree.isExcludedItem(treeWithExcludedItems[0]));

        assert.ok(excludedChildrenTree.isIncludedItem(treeWithExcludedItems[0].includedChildren[0]));
        assert.ok(!excludedChildrenTree.isExcludedItem(treeWithExcludedItems[0].includedChildren[0]));

        assert.ok(excludedChildrenTree.isIncludedItem(treeWithExcludedItems[0].includedChildren[0].includedChildren[0]));
        assert.ok(!excludedChildrenTree.isExcludedItem(treeWithExcludedItems[0].includedChildren[0].includedChildren[0]));

        assert.ok(!excludedChildrenTree.isIncludedItem(treeWithExcludedItems[0].excludedChildren[0]));
        assert.ok(excludedChildrenTree.isExcludedItem(treeWithExcludedItems[0].excludedChildren[0]));

        assert.ok(!excludedChildrenTree.isIncludedItem(treeWithExcludedItems[0].excludedChildren[0].includedChildren[0]));
        assert.ok(excludedChildrenTree.isExcludedItem(treeWithExcludedItems[0].excludedChildren[0].includedChildren[0]));

        assert.ok(!excludedChildrenTree.isIncludedItem(treeWithExcludedItems[0].includedChildren[0].excludedChildren[0]));
        assert.ok(excludedChildrenTree.isExcludedItem(treeWithExcludedItems[0].includedChildren[0].excludedChildren[0]));

        assert.ok(excludedChildrenTree.getAllItems(sap.ui.vtm.TreeItemType.IncludedOrExcluded).length === 11);
        assert.ok(excludedChildrenTree.getAllItems(sap.ui.vtm.TreeItemType.Included).length === 4);
        assert.ok(excludedChildrenTree.getAllItems(sap.ui.vtm.TreeItemType.Excluded).length === 7);

        assert.ok(excludedChildrenTree.getDescendantItems("1", sap.ui.vtm.TreeItemType.IncludedOrExcluded).length === 10);
        assert.ok(excludedChildrenTree.getDescendantItems("1", sap.ui.vtm.TreeItemType.Included).length === 3);
        assert.ok(excludedChildrenTree.getDescendantItems("1", sap.ui.vtm.TreeItemType.Excluded).length === 7);

        assert.ok(excludedChildrenTree.getDescendantItems("6", sap.ui.vtm.TreeItemType.IncludedOrExcluded).length === 2);
        assert.ok(excludedChildrenTree.getDescendantItems("6", sap.ui.vtm.TreeItemType.Included).length === 0);
        assert.ok(excludedChildrenTree.getDescendantItems("6", sap.ui.vtm.TreeItemType.Excluded).length === 2);

        assert.ok(excludedChildrenTree.getDescendantItems("2", sap.ui.vtm.TreeItemType.IncludedOrExcluded).length === 6);
        assert.ok(excludedChildrenTree.getDescendantItems("2", sap.ui.vtm.TreeItemType.Included).length === 2);
        assert.ok(excludedChildrenTree.getDescendantItems("2", sap.ui.vtm.TreeItemType.Excluded).length === 4);

        // multiple selection
        assert.ok(tree.getSelectionMode() === sap.ui.vtm.SelectionMode.Single);
        tree.setSelectionMode(sap.ui.vtm.SelectionMode.MultiToggle);

        assert.ok(tree.getSelectionMode() === sap.ui.vtm.SelectionMode.MultiToggle);
        tree.setSelectionMode(sap.ui.vtm.SelectionMode.Single);

        // selections
        assert.ok(tree.getSelectedItems().length === 0);
        tree.setSelectedItems([child]);

        var done = assert.async();

        var selectionChangedHandler = function () {

            var selected = tree.getSelectedItems();
            assert.ok(selected.length === 1 && selected[0] === child);
            tree.detachSelectionChanged(selectionChangedHandler);

            assert.equal(4, all.length);
            assert.deepEqual([root, item], tree.getRootItems());
            assert.deepEqual([child], item.includedChildren);
            assert.deepEqual([grandChild], child.includedChildren);

            // getExpanded/setExpanded/expandedChanged

            // Collapse item, then expand child
            var expandedEventNumber = 0;
            tree.attachExpandedChanged(function (oEvent) {
                assert.equal(false, oEvent.getParameter("userInteraction"));

                switch (expandedEventNumber) {

                    case 0: // "item" was collapsed
                        assert.equal(item, oEvent.getParameter("item"));
                        assert.equal(false, oEvent.getParameter("expanded"));
                        assert.equal(false, tree.getExpanded(item));
                        assert.equal(false, tree.getExpanded(child));
                        assert.equal(false, tree.getExpanded(grandChild));
                        tree.setExpanded(child, true);
                        break;

                    case 1: // "item" was expanded due to being an ancestor of "child"
                        assert.equal(item, oEvent.getParameter("item"));
                        assert.equal(true, oEvent.getParameter("expanded"));
                        assert.equal(true, tree.getExpanded(item));
                        assert.equal(false, tree.getExpanded(child));
                        assert.equal(false, tree.getExpanded(grandChild));
                        tree.setExpanded(grandChild, true);
                        break;

                    case 2: // "child" was expanded.
                        assert.equal(child, oEvent.getParameter("item"));
                        assert.equal(true, oEvent.getParameter("expanded"));
                        assert.equal(true, tree.getExpanded(item));
                        assert.equal(true, tree.getExpanded(child));
                        assert.equal(false, tree.getExpanded(grandChild));
                        done();
                }
                expandedEventNumber++;
            });
            tree.setExpanded(item, false)
        };

        tree.attachSelectionChanged(selectionChangedHandler);
        tree.setSelectedItems([child]);
    });

    QUnit.done(function() {
        jQuery("#qunit-fixture").hide();
    });
});
