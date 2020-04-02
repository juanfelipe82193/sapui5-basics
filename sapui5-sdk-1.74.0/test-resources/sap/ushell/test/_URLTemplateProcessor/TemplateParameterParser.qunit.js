// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.TemplateParameterParser
 */
sap.ui.require([
    "sap/ushell/_URLTemplateProcessor/TemplateParameterParser"
], function (oTemplateParameterParser) {
    "use strict";

    /* global QUnit */

    QUnit.dump.maxDepth = 0;

    QUnit.module("URLTemplateProcessor", {
        beforeEach: function () { },
        afterEach: function () { }
    });

    var oIsExpressionTestFixture = {
        "{*}": true,
        "{&/}": false,
        "{var}": true,
        "{v}": true,
        "{vv}": true,
        "var": false,
        "{'val'}": true,
        "{and /path/to/foo,{var},var,''}": true,
        "{or /a/b/c}": true,
        "{|| /a/b/c}": false,
        "{or }": false,
        "{/absolute/path}": true,
        "{or arg1,arg2}": true,
        "{or sap-system,/path/to/systemAliases/default/id}": true,
        "{and /path/to/systemAliases/{destName}/https,'https'}": true,
        "{./sap.gui/_transaction}": true,
        "{}": false,
        "{or {valueA},{valueB}}": true,
        "{{valueA}}": true,
        "{url(field)}": true,
        "{join {expr},literal,{var}}": true,
        "{join {expr},literal,'str'}": true,
        "{join {expr},'literal',var}": true,
        "{join(literal) {expr},'literal',var}": true,
        "{join(literal,literal) {expr},'literal',var}": true,
        "{join({expr}) {expr},'literal',var}": true,
        "{join('sep') {expr},'literal',var}": false,
        "{join sSkipScreenChar,./sap.gui/transaction,sTransactionParamsSeparator}": true,
        "{match(abc) def}": true,
        // execute and only if var1 is defined
        "{and({var1}) 'true','false'}": true,
        // execute or only if var1 is defined
        "{or({var1}) 'true','false'}": true,
        "{not {var1}}": true,
        "{and {var1}}": true,
        "{and({/path/to/the/moon}) value}": true,
        "{not() 'something'}": true,
        "{&namespace:name}": true,
        "{&namespace:.}": true,
        "{*|match}": true,
        "{*|match(^~|^sap-)}": true,
        "{*|match(^~|^sap-)|match(123)}": true // inner string starts and ends at the parentheses
    };
    Object.keys(oIsExpressionTestFixture).forEach(function (sString) {
        QUnit.test("#isExpression: " + sString, function (assert) {
            var bResult;
            try {
                bResult = oTemplateParameterParser._isExpression(sString);
            } catch (e) {
                bResult = false;
            }
            assert.strictEqual(bResult, oIsExpressionTestFixture[sString], "returned the expected value");
        });
    });

    [
        {
            testDescription: "literal",
            sValue: "1002",
            expectedResult: {
                type: "literal",
                value: "1002"
            }
        },
        {
            testDescription: "simple not",
            sValue: "{not p1}",
            expectedResult: {
                type: "expression",
                value: {
                    type: "function",
                    name: "not",
                    args: [],
                    params: [
                        { type: "reference", namespace: "intentParameter", value: "p1" }
                    ]
                }
            }
        },
        {
            testDescription: "function with arguments and intent parameters",
            sValue: "{and(args) item1,item2,item3}",
            expectedResult: {
                type: "expression",
                value: {
                    type: "function",
                    name: "and",
                    args: [ { type: "literal", value: "args" } ],
                    params: [
                        { type: "reference", namespace: "intentParameter", value: "item1" },
                        { type: "reference", namespace: "intentParameter", value: "item2" },
                        { type: "reference", namespace: "intentParameter", value: "item3" }
                    ]
                }
            }
        },
        {
            testDescription: "function with no arguments but various parameters",
            sValue: "{join sSkipScreenChar,./sap.gui/transaction,sap-system}",
            expectedResult: {
                type: "expression",
                value: {
                    "args": [],
                    "name": "join",
                    "params": [
                        {
                            "type": "reference",
                            "namespace": "intentParameter",
                            "value": "sSkipScreenChar"
                        },
                        {
                            "type": "path",
                            "pathType": "relative",
                            "value": [
                                { type: "literal", value: "sap.gui" },
                                { type: "literal", value: "transaction" }
                            ]
                        },
                        {
                            "type": "reference",
                            "namespace": "intentParameter",
                            "value": "sap-system"
                        }
                    ],
                    "type": "function"

                }
            }
        },
        {
            testDescription: "function with no arguments",
            sValue: "{and &item1,&item2,&item3}",
            expectedResult: {
                type: "expression",
                value: {
                    type: "function",
                    name: "and",
                    args: [],
                    params: [
                        { type: "reference", value: "item1" },
                        { type: "reference", value: "item2" },
                        { type: "reference", value: "item3" }
                    ]
                }
            }
        },
        {
            testDescription: "conditional with empty value",
            sValue: "{and /path/to/foo,{&var},var,''}",
            expectedResult: {
                type: "expression",
                value: {
                    type: "function",
                    name: "and",
                    args: [],
                    params: [
                        { type: "path", pathType: "absolute", value: [
                            { type: "literal", value: "path" },
                            { type: "literal", value: "to" },
                            { type: "literal", value: "foo" }
                        ]},
                        { type: "reference", value: "var" },
                        { type: "reference", namespace: "intentParameter", value: "var" },
                        { type: "literal", value: "" }
                    ]
                }
            }
        },
        {
            testDescription: "path without references",
            sValue: "{/path/to}",
            expectedResult: {
                type: "expression",
                value: {
                    type: "path",
                    pathType: "absolute",
                    value: [{
                        type: "literal",
                        value: "path"
                    }, {
                        type: "literal",
                        value: "to"
                    }]
                }
            }
        },
        {
            testDescription: "path with references",
            sValue: "{/path/to/{&someReference}/something}",
            expectedResult: {
                type: "expression",
                value: {
                    type: "path",
                    pathType: "absolute",
                    value: [{
                        type: "literal",
                        value: "path"
                    }, {
                        type: "literal",
                        value: "to"
                    }, {
                        type: "reference",
                        value: "someReference"
                    }, {
                        type: "literal",
                        value: "something"
                    }]
                }
            }
        },
        {
            testDescription: "reference",
            sValue: "{&someReference}",
            expectedResult: {
                type: "expression",
                value: {
                    type: "reference",
                    value: "someReference"
                }
            }
        },
        {
            testDescription: "intent parameter",
            sValue: "{someReference}",
            expectedResult: {
                type: "expression",
                value: {
                    type: "reference",
                    namespace: "intentParameter",
                    value: "someReference"
                }
            }
        },
        {
            testDescription: "reference with curly braces",
            sValue: "{&{someReference}}",
            expectedError: true
        },
        {
            testDescription: "intent parameter with double curly braces",
            sValue: "{{someReference}}",
            expectedResult: {
                type: "expression",
                value: {
                    type: "reference",
                    namespace: "intentParameter",
                    value: "someReference"
                }
            }
        },
        {
            testDescription: "intent parameter with triple curly braces",
            sValue: "{{{someReference}}}",
            expectedError: true
        },
        {
            testDescription: "literal expression",
            sValue: "{'someLiteral'}",
            expectedResult: {
                type: "expression",
                value: {
                    type: "literal",
                    value: "someLiteral"
                }
            }
        },
        {
            testDescription: "wildcard",
            sValue: "{*}",
            expectedResult: {
                "type": "expression",
                "value": {
                    "type": "pipe",
                    "value": [{
                        "value": "*",
                        "type": "wildcard"
                    }]
                }
            }
        },
        {
            testDescription: "wildcard with arguments",
            sValue: "{*|match(^p[2\\,3])}",
            expectedResult: {

                "type": "expression",
                "value": {
                    "type": "pipe",
                    "value": [{
                            "type": "wildcard",
                            "value": "*"
                        },
                        {
                            "args": [
                                { type: "literal", value: "^p[2,3]" }
                            ],
                            "name": "match",
                            "params": [],
                            "type": "function"
                        }
                    ]
                }
            }
        },
        {
            testDescription: "wildcard with closing parentheses as part of the content",
            sValue: "{*|match(some[)]parenthesis)}",
            expectedResult: {
                "type": "expression",
                "value": {
                    "type": "pipe",
                    "value": [{
                            "type": "wildcard",
                            "value": "*"
                        },
                        {
                            "type": "function",
                            "args": [
                                { type: "literal", value: "some[)]parenthesis" }
                            ],
                            "name": "match",
                            "params": []
                        }
                    ]
                }
            }
        },
        {
            testDescription: "wildcard with match expression",
            sValue: "{*|match(^(?!(sap)))}",
            expectedResult: {

                "type": "expression",
                "value": {
                    "type": "pipe",
                    "value": [{
                            "type": "wildcard",
                            "value": "*"
                        },
                        {
                            "type": "function",
                            "args": [
                                { type: "literal", value: "^(?!(sap))" }
                            ],
                            "name": "match",
                            "params": []
                        }
                    ]
                }
            }
        },
        {
            testDescription: "wildcard with multiple function applications",
            sValue: "{*|match(a)|match(b)}",
            expectedResult: {

                "type": "expression",
                "value": {
                    "type": "pipe",
                    "value": [{
                            "type": "wildcard",
                            "value": "*"
                        },
                        {
                            "type": "function",
                            "args": [
                                { type: "literal", value: "a" }
                            ],
                            "name": "match",
                            "params": []
                        },
                        {
                            "type": "function",
                            "args": [
                                { type: "literal", value: "b" }
                            ],
                            "name": "match",
                            "params": []
                        }
                    ]
                }
            }
        },
        {
            testDescription: "wildcard with multiple function applications",
            sValue: "{*|encodeURIComponent|match(b)}",
            expectedResult: {

                "type": "expression",
                "value": {
                    "type": "pipe",
                    "value": [{
                            "type": "wildcard",
                            "value": "*"
                        },
                        {
                            "type": "function",
                            "args": [],
                            "name": "encodeURIComponent",
                            "params": []
                        },
                        {
                            "type": "function",
                            "args": [
                                { type: "literal", value: "b" }
                            ],
                            "name": "match",
                            "params": []
                        }
                    ]
                }
            }
        },
        {
            testDescription: "if",
            sValue: "{if(stringNotEmpty) 'A','B'}",
            expectedResult: {
                "type": "expression",
                "value": {
                    "type": "function",
                    "name": "if",
                    "args": [
                        { type: "literal", value: "stringNotEmpty" }
                    ],
                    "params": [
                        { "type": "literal", "value": "A" },
                        { "type": "literal", "value": "B" }
                    ]
                }
            }
        },
        {
            testDescription: "or - with a variable that has the same name",
            sValue: "{orthogonal}",
            expectedResult: {
              type: "expression",
              value: {
                type: "reference",
                namespace: "intentParameter",
                value: "orthogonal"
              }
            }
        },
        {
            testDescription: "alternate namespace syntax",
            sValue: "{&namespace:property}",
            expectedResult: {
                type: "expression",
                value: {
                    type: "reference",
                    value: "property",
                    namespace: "namespace"
                }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("#_parseParameterValue: " + oFixture.testDescription, function (assert) {
            var bError = false;
            var oParsed;
            try {
                oParsed = oTemplateParameterParser._parseParameterValue("intentParameter", oFixture.sValue);
            } catch (e) {
                bError = true;
            }

            if (oFixture.hasOwnProperty("expectedError")) {
                assert.deepEqual(bError, true, "Expected error was thrown");
            }
            assert.deepEqual(oParsed, oFixture.expectedResult, "got the expected result");
        });
    });

    [
        {
            sString: "*|match(a,b)",
            expected: ["*", "match(a,b)"]
        },
        {
            sString: "*|match(a\\|b)",
            expected: ["*", "match(a|b)"]
        },
        {
            sString: "*|match(a\\|b)|not(c)",
            expected: ["*", "match(a|b)", "not(c)"]
        },
        {
            sString: "*|match()|not",
            expected: ["*", "match()", "not"]
        },
        {
            sString: "*|match(a\\|\\|b)|not",
            expected: ["*", "match(a||b)", "not"]
        }
    ].forEach(function (oFixture) {
        QUnit.test("#_parseList: " + oFixture.sString, function (assert) {
            var aResult = oTemplateParameterParser._parseList("intentParams", oFixture.sString, "|");

            assert.deepEqual(aResult, oFixture.expected, "got the expected result");
        });
    });

});
