/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

(function () {
    "use strict";

    var testName = "treeItemUtilitiesTests";
    var testFunc = function (assert) {
        var root = { id: "000", name: "000", visibility: true, sceneNodeIds: [2] };
        var item = { id: "123", name: "321", visibility: true, sceneNodeIds: [1] };
        var child = { id: "456", name: "654", visibility: true, sceneNodeIds: [3] };

        var tree = [];
        sap.ui.vtm.TreeItemUtilities.addRoot(tree, root);
        sap.ui.vtm.TreeItemUtilities.addRoot(tree, item);
        sap.ui.vtm.TreeItemUtilities.addChild(item, child);

        // tree/branch mapping
        var mappedTree = sap.ui.vtm.TreeItemUtilities.mapTree(tree, function (treeItem) {
            return treeItem;
        });

        assert.ok(mappedTree.length === 2);
        assert.ok(mappedTree[0] === root);
        assert.ok(mappedTree[1] === item);
        assert.ok(mappedTree[1].includedChildren.length === 1);
        assert.ok(mappedTree[1].includedChildren[0] === child);

        // app data set/get/clone
        var appDataDescriptor = "testDescriptor";
        var appDataValue = "testValue";

        var appDataValues = sap.ui.vtm.TreeItemUtilities.getAppDataValues(item, appDataDescriptor);
        assert.ok(appDataValues.length === 0);
        sap.ui.vtm.TreeItemUtilities.setAppDataValues(item, appDataDescriptor, appDataValue);

        appDataValues = sap.ui.vtm.TreeItemUtilities.getAppDataValues(item, appDataDescriptor);
        assert.ok(appDataValues.length === 1 && appDataValues[0] === appDataValue);

        var clonedAppData = sap.ui.vtm.TreeItemUtilities.cloneAppData(item);
        assert.ok(clonedAppData !== item.appData && JSON.stringify(clonedAppData) === JSON.stringify(item.appData));

        // metadata set/get/clone
        var metadataDescriptor = "testMetadataDescriptor";
        var metadataValue = "testMetadataValue";

        var metadataValues = sap.ui.vtm.TreeItemUtilities.getMetadataValues(item, metadataDescriptor);
        assert.ok(metadataValues.length === 0);
        sap.ui.vtm.TreeItemUtilities.setMetadataValues(item, metadataDescriptor, metadataValue);

        metadataValues = sap.ui.vtm.TreeItemUtilities.getMetadataValues(item, metadataDescriptor);
        assert.ok(metadataValues.length === 1 && metadataValues[0] === metadataValue);

        var clonedMetadata = sap.ui.vtm.TreeItemUtilities.cloneMetadata(item);
        assert.ok(clonedMetadata !== item.metadata && JSON.stringify(clonedMetadata) === JSON.stringify(item.metadata));

        // identifiers set/get/clone
        var identifierDescriptor = "testIdentifierDescriptor";
        var identifierValue = "testIdentifierValue";

        var identifierValues = sap.ui.vtm.TreeItemUtilities.getIdentifierValues(item, identifierDescriptor);
        assert.ok(identifierValues.length === 0);
        sap.ui.vtm.TreeItemUtilities.setIdentifierValues(item, identifierDescriptor, identifierValue);

        identifierValues = sap.ui.vtm.TreeItemUtilities.getIdentifierValues(item, identifierDescriptor);
        assert.ok(identifierValues.length === 1 && identifierValues[0] === identifierValue);

        var clonedIdentifiers = sap.ui.vtm.TreeItemUtilities.cloneIdentifiers(item);
        assert.ok(clonedIdentifiers !== item.identifiers && JSON.stringify(clonedIdentifiers) === JSON.stringify(item.identifiers));

        // add/remove child
        var tmpChild = { id: "654", name: "tmpChild", visibility: true, sceneNodeIds: [4] };
        sap.ui.vtm.TreeItemUtilities.addChild(item, tmpChild);
        assert.ok(item.includedChildren.length === 2 && item.includedChildren[1] === tmpChild);
        sap.ui.vtm.TreeItemUtilities.removeChild(item, tmpChild);
        assert.ok(item.includedChildren.length === 1 && item.includedChildren[0] === child);

        // validate tree/tree item
        assert.ok(sap.ui.vtm.TreeItemUtilities.validateTree(tree).length === 0);

        var invalidTree = [{
            includedChildren: [{}, { id: "id" }, { name: "name" }, { absoluteMatrix: "none" }, { relativeMatrix: "none" }]
        }];
        var errors = sap.ui.vtm.TreeItemUtilities.validateTree(invalidTree);
        assert.ok(errors.length === 5);

        // traverse tree/branch
        var count = 0;
        var callback = function (treeItem) { count = count + 1; };

        sap.ui.vtm.TreeItemUtilities.traverseBranch(null, callback);
        assert.ok(count === 0);

        count = 0;
        sap.ui.vtm.TreeItemUtilities.traverseTree(tree, callback);
        assert.ok(count === 3);

        var treeWithExcludedItems = [{
            id: "1",
            includedChildren: [{
                id: "2",
                includedChildren: [{
                    id: "6"
                }, {
                    id: "7"
                }],
                excludedChildren: [{
                    id: "8"
                }, {
                    id: "9"
                }]
            }, {
                id: "3",
                includedChildren: [{
                    id: "10"
                }, {
                    id: "11"
                }],
                excludedChildren: [{
                    id: "12"
                }, {
                    id: "13",
                    includedChildren: [{
                        id: "14"
                    }, {
                        id: "15"
                    }],
                    excludedChildren: [{
                        id: "16"
                    }, {
                        id: "17"
                    }]
                }]
            }],
            excludedChildren: [{
                id: "4"
            }, {
                id: "5"
            }]
        }];

        count = 0;
        sap.ui.vtm.TreeItemUtilities.traverseTree(treeWithExcludedItems, function (treeItem) {
            count++;
            return sap.ui.vtm.ChildCollectionType.None;
        });
        assert.ok(count === 1);

        count = 0;
        sap.ui.vtm.TreeItemUtilities.traverseTree(treeWithExcludedItems, function (treeItem) {
            count++;
            return sap.ui.vtm.ChildCollectionType.Included;
        });
        assert.ok(count === 7);

        count = 0;
        sap.ui.vtm.TreeItemUtilities.traverseTree(treeWithExcludedItems, function (treeItem) {
            count++;
            return sap.ui.vtm.ChildCollectionType.Excluded;
        });
        assert.ok(count === 3);

        count = 0;
        sap.ui.vtm.TreeItemUtilities.traverseTree(treeWithExcludedItems, function (treeItem) {
            count++;
            return sap.ui.vtm.ChildCollectionType.IncludedAndExcluded;
        });
        assert.ok(count === 17);


        var messagesString = '[{"level":"Error","text":"An error"},{"level":"Warning","text":"A warning"},{"level":"Information","text":"An info message"},{"level":"Error","text":"Another error"}]';
        var treeItem = { messages: messagesString };

        var messages = sap.ui.vtm.TreeItemUtilities.getMessages(treeItem);
        assert.equal(4, messages.length);
        assert.equal("Error", messages[0].getLevel());
        assert.equal("Warning", messages[1].getLevel());
        assert.equal("Information", messages[2].getLevel());
        assert.equal("Error", messages[3].getLevel());

        sap.ui.vtm.TreeItemUtilities.setMessages(treeItem, messages);
        assert.equal(messagesString, treeItem.messages);
    };

    if (QUnit.config.autostart !== false) {
        QUnit.config.autostart = false;
        QUnit.test(testName, testFunc);
        QUnit.start();
    } else {
        QUnit.test(testName, testFunc);
    }
}) ();