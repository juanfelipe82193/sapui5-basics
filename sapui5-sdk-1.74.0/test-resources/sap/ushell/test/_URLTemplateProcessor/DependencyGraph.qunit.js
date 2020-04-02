// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.DependencyGraph
 */
sap.ui.require([
    "sap/ushell/_URLTemplateProcessor/DependencyGraph"
], function (oDependencyGraph) {
    "use strict";

    /* global QUnit */

    QUnit.module("DependencyGraph", {
        beforeEach: function () { },
        afterEach: function () { }
    });

    [
        {
            testDescription: "deep structure",
            oParsedParameters: {
                p1: {
                    "type": "expression",
                    "value": {
                        "type": "function",
                        "name": "if",
                        "args": [
                            "stringNotEmpty"
                        ],
                        "params": [{
                                "type": "literal",
                                "value": "A"
                            },
                            {
                                "type": "literal",
                                "value": "B"
                            }
                        ]
                    }
                },
                p2: {
                    "type": "expression",
                    "value": {
                        "type": "pipe",
                        "value": [{
                            "value": "*",
                            "type": "wildcard"
                        }]
                    }
                },
                p3: {
                    type: "expression",
                    value: {
                        type: "function",
                        name: "not",
                        args: [
                            { type: "reference", value: "p2" }
                        ],
                        params: [
                            { type: "reference", value: "p1" }
                        ]
                    }
                }
            },
            expectedResult: {
                p1: [],
                p2: [],
                p3: ["p2", "p1"]
            }
        },
        {
            testDescription: "deep structure with namespace",
            oParsedParameters: {
                p1: {
                    "type": "expression",
                    "value": {
                        "type": "function",
                        "name": "if",
                        "args": [
                            "stringNotEmpty"
                        ],
                        "params": [{
                                "type": "literal",
                                "value": "A"
                            },
                            {
                                "type": "literal",
                                "value": "B"
                            }
                        ]
                    }
                },
                p2: {
                    "type": "expression",
                    "value": {
                        "type": "pipe",
                        "value": [{
                            "value": "*",
                            "type": "wildcard"
                        }]
                    }
                },
                p3: {
                    type: "expression",
                    value: {
                        type: "function",
                        name: "not",
                        args: [
                            { type: "reference", value: "p2" }
                        ],
                        params: [
                            { type: "reference", namespace: "env", value: "p1" }
                        ]
                    }
                }
            },
            expectedResult: {
                p1: [],
                p2: [],
                p3: ["p2"]
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("#buildDependencyGraph: " + oFixture.testDescription, function (assert) {
            var oParsed = oDependencyGraph.buildDependencyGraph(oFixture.oParsedParameters);

            assert.deepEqual(oParsed, oFixture.expectedResult, "got the expected result");
        });

    });

    QUnit.test("#buildDependencyGraph throws when an unknown type is given", function (assert) {
        var oParsedParameters = {
            p1: {
                "type": "expression",
                "value": {
                    "type": "function",
                    "name": "if",
                    "args": [
                        "stringNotEmpty"
                    ],
                    "params": [{
                            "type": "something_strange",
                            "value": "A"
                        },
                        {
                            "type": "literal",
                            "value": "B"
                        }
                    ]
                }
            },
            p3: { }
        };

        try {
            oDependencyGraph.buildDependencyGraph(oParsedParameters);
        } catch (oError) {
            assert.ok(true, "An exception is raised");
            assert.strictEqual(oError.message, "Unknown type encountered while building dependency graph: 'something_strange'", "the expected exception is raised");
            return;
        }

        assert.ok(false, "An exception is raised");
    });

});
