/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

(function () {
    "use strict";

    var testName = "treeTests-opacity";
    var testFunc = function (assert) {
        var vtm = new sap.ui.vtm.createVtm();
        var panel = vtm.createPanel();
        vtm._addPanel(panel);
        var tree = panel.getTree();

        var treeData = [
            {
                id: "visual1",
                visibility: true,
                opacity: 0.5,
                includedChildren: [
                    {
                        id: "nonVisual1",
                        includedChildren: [
                            {
                                id: "visual2",
                                visibility: false,
                                opacity: 0
                            },
                            {
                                id: "visual3",
                                visibility: true
                            },
                            {
                                id: "nonVisual2",
                                visibility: null,
                                opacity: 0.3
                            }
                        ]
                    }
                ],
                excludedChildren: [
                    {
                        id: "excludedVisual1",
                        visibility: true,
                        opacity: 1.0
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
        
        actual = tree.getOpacity([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [0.5, undefined, 0, undefined, 0.3, 1.0, undefined];
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        expected = 0.5;
        actual = tree.getOpacity(visual1);
        message = "\r\nInitial visibility (tree items object): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setOpacity([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], 0.7, false);
        actual = tree.getOpacity([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [0.7, undefined, 0.7, 0.7, 0.3, 0.7, undefined];
        // Expectation: opacity of visual items set to 0.7, opacity of non visual items unchanged 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setOpacity([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], undefined, false);
        actual = tree.getOpacity([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [undefined, undefined, undefined, undefined, 0.3, undefined, undefined];
        // Expectation: opacity of included and excluded visual items set to undefined, opacity of non visual items unchanged 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setOpacity([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], 0.7, false, false);
        actual = tree.getOpacity([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7];
        // Expectation: opacity of included and excluded visual and non visual items set to 0.7 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        tree.setOpacity([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], undefined, false, false);
        actual = tree.getOpacity([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
        expected = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
        // Expectation: opacity of included and excluded visual and non visual items set to undefined 
        message = "\r\nInitial visibility (treeItems array): expected " + expected + "\r\n got " + actual + "\r\n";
        assert.deepEqual(expected, actual, message);

        prepareTest();
        // Same as previous test but with refresh disabled
        tree.setOpacity([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1], undefined, false, false, false);
        actual = tree.getOpacity([visual1, nonVisual1, visual2, visual3, nonVisual2, excludedVisual1, excludedNonVisual1]);
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