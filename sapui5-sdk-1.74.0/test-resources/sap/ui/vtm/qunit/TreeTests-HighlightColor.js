/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

(function () {
    "use strict";

    var testName = "treeTests-highlightColor";
    var testFunc = function (assert) {
        var vtm = new sap.ui.vtm.createVtm();
        var panel = vtm.createPanel();
        vtm._addPanel(panel);
        var tree = panel.getTree();

        var treeData = [
            {
                id: "visual1",
                visibility: true,
                highlightColor: "blue",
                includedChildren: [
                    {
                        id: "nonVisual1",
                        includedChildren: [
                            {
                                id: "visual2",
                                visibility: false,
                                highlightColor: "yellow"
                            },
                            {
                                id: "visual3",
                                visibility: true
                            },
                            {
                                id: "nonVisual2",
                                visibility: null,
                                highlightColor: "white"
                            }
                        ]
                    }
                ],
                excludedChildren: [
                    {
                        id: "excludedVisual1",
                        visibility: true,
                        highlightColor: "red"
                    },
                    {
                        id: "excludedNonVisual1"
                    }

                ]
            }
        ];

        var cloneTreeData = function (treeData) {
            return sap.ui.vtm.TreeItemUtilities.mapTree(treeData, function (treeItem) {
                return JSON.parse(JSON.stringify(treeItem));
            });
        };

        var testTreeData, visual1, visual2, visual3, nonVisual1, nonVisual2, excludedVisual1, excludedNonVisual1;

        var prepareTest = function () {
            testTreeData = cloneTreeData(treeData);
            visual1 = testTreeData[0];
            nonVisual1 = visual1.includedChildren[0];
            visual2 = nonVisual1.includedChildren[0];
            visual3 = nonVisual1.includedChildren[1];
            nonVisual2 = nonVisual1.includedChildren[2];
            excludedVisual1 = visual1.excludedChildren[0];
            excludedNonVisual1 = visual1.excludedChildren[1];

            tree.setRootItems(testTreeData);
            tree.updateCollections();
            tree.updateModel();
        };

        // visibility tests

        prepareTest();

        var actual, expected, message;
        
        actual = tree.getHighlightColor([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = ["blue", undefined, "yellow", undefined, "white", "red", undefined];
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        expected = "blue";
        actual = tree.getHighlightColor(visual1);
        message = "\r\nInitial visibility (tree items object): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setHighlightColor([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], "green", false);
        actual = tree.getHighlightColor([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = ["green", undefined, "green", "green", "white", "green", undefined];
        // Expectation: opacity of visual items set to "green", opacity of non visual items unchanged 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setHighlightColor([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], undefined, false);
        actual = tree.getHighlightColor([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [undefined, undefined, undefined, undefined, "white", undefined, undefined];
        // Expectation: opacity of included and excluded visual items set to undefined, opacity of non visual items unchanged 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setHighlightColor([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], "green", false, false);
        actual = tree.getHighlightColor([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = ["green", "green", "green", "green", "green", "green", "green"];
        // Expectation: opacity of included and excluded visual and non visual items set to "green" 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setHighlightColor([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], undefined, false, false);
        actual = tree.getHighlightColor([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
        // Expectation: opacity of included and excluded visual and non visual items set to undefined 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        // Same as previous test but with refresh disabled
        tree.setHighlightColor([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], undefined, false, false, false);
        actual = tree.getHighlightColor([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
        // Expectation: opacity of included and excluded visual and non visual items set to undefined 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);
    };

    if (QUnit.config.autostart !== false) {
        QUnit.config.autostart = false;
        QUnit.test(testName, testFunc);
        QUnit.start();
    } else {
        QUnit.test(testName, testFunc);
    }
})();