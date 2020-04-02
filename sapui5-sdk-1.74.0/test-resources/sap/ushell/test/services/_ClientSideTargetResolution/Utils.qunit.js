// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for ClientSideTargetResolution's Utils
 */
sap.ui.require([
    "sap/ushell/services/_ClientSideTargetResolution/Utils",
    "sap/ushell/test/utils",
    "sap/ushell/utils"
], function (oUtils, testUtils, utils) {
    "use strict";

    /* global QUnit */

    var Q = QUnit;

    Q.module("Utils", {
        setup: function () {
        },
        teardown: function () {
            testUtils.restoreSpies(
            );
        }
    });
    [
        {
            "description" : "Object has 2 parameters and parameter filterMe is filtered",
            "oFilterObject" : {
                "doNotFilterMe": "foo",
                "filterMe" : "foo"
            },
            "fnFilterMe": function (sKey, vValue) {
                return sKey == "filterMe";
            },
            expectedResults : {
                "filteredObject" : {
                    "filterMe" : "foo"
                }
            }
        },
        {
            "description" : "Object has 2 parameters and all of the parameters are filtered",
            "oFilterObject" : {
                "filterMe": "foo",
                "filterMeToo" : "foo"
            },
            "fnFilterMe": function (sKey, vValue) {
                return true;
            },
            expectedResults : {
                "filteredObject" : {
                    "filterMe" : "foo",
                    "filterMeToo" : "foo"
                }
            }
        },
        {
            "description" : "Object has 2 parameters and none of the parameters are filtered",
            "oFilterObject" : {
                "doNotfilterMe": "foo",
                "meNeither" : "foo"
            },
            "fnFilterMe": function (sKey, vValue) {
                return false;
            },
            expectedResults : {
                "filteredObject" : {
                }
            }
        },
        {
            "description" : "Object has no parameters and none of the parameters are filtered",
            "oFilterObject" : {
            },
            "fnFilterMe": function (sKey, vValue) {
                return false;
            },
            expectedResults : {
                "filteredObject" : {
                }
            }
        }

    ].forEach(
        function (oFixture){
            Q.test("filter Object when " + oFixture.description, function(assert) {
                var actObject = oUtils.filterObjectKeys(
                    oFixture.oFilterObject,
                    oFixture.fnFilterMe
                );
                Q.deepEqual( actObject, oFixture.expectedResults.filteredObject, "filtered object is ok" );
            });
        }
    );
    [
        {
            "description" : "diverse mappings",
            "oParameters" : {
                "A" : {"renameTo" : "ANew" },
                "B" : {"renameTo" : "ANew" },
                "D" : { "renameTo" : "C"},
                "C" : {},
                "E" : { }
            },
            expectedResults : {
                  "A" : {  renameTo : "ANew", "dominatedBy" : ["A", "B" ] },
                  "B" : {  renameTo : "ANew", "dominatedBy" : ["A", "B" ] },
                  "C" : {  renameTo : "C", "dominatedBy" : ["C", "D" ] },
                  "D" : {  renameTo : "C", "dominatedBy" : ["C", "D" ] },
                  "E" : {  renameTo : "E", "dominatedBy" : ["E" ] }
            }
        }
    ].forEach(function (oFixture) {
        Q.test("constructParameterDominatorMap when " + oFixture.description, function(assert) {
            var oMap = oUtils.constructParameterDominatorMap(oFixture.oParameters);
            Q.deepEqual(Object.keys(oMap).sort(), Object.keys(oFixture.expectedResults).sort(), " keys appropriate");
            Object.keys(oFixture.expectedResults).forEach(function (sKey) {
                assert.deepEqual(oMap[sKey], oFixture.expectedResults[sKey]," entry for " + sKey + " identical");
            });
        });
    });

    [{
        "description": " default is dropped",
        "oParameters": {
            "A": {
                "renameTo": "ANew"
            },
            "B": {
                "renameTo": "ANew"
            }
        },
        aDefaultedParamNames: ["B"],
        oIntentParamsPlusAllDefaults: {
            "A": ["1000"],
            "B": ["2000"]
        },
        expectedIntentParamsPlusAllDefaults: {
            "A": ["1000"]
        },
        expectedDefaultedParamNames: []
    }, {
        "description": " default is dropped irrespective of order",
        "oParameters": {
            "A": {
                "renameTo": "ANew"
            },
            "B": {
                "renameTo": "ANew"
            }
        },
        aDefaultedParamNames: ["A"],
        oIntentParamsPlusAllDefaults: {
            "A": ["1000"],
            "B": ["2000"]
        },
        expectedIntentParamsPlusAllDefaults: {
            "B": ["2000"]
        },
        expectedDefaultedParamNames: []
    }, {
        "description": " default is dropped in A->A, B->A ",
        "oParameters": {
            "A": {},
            "B": {
                "renameTo": "A"
            }
        },
        aDefaultedParamNames: ["A"],
        oIntentParamsPlusAllDefaults: {
            "A": ["1000"],
            "B": ["2000"]
        },
        expectedIntentParamsPlusAllDefaults: {
            "B": ["2000"]
        },
        expectedDefaultedParamNames: []
    }, {
        "description": " both defaulted : retained",
        "oParameters": {
            "A": {},
            "B": {
                "renameTo": "A"
            }
        },
        aDefaultedParamNames: ["A", "B"],
        oIntentParamsPlusAllDefaults: {
            "A": ["1000"],
            "B": ["2000"]
        },
        expectedIntentParamsPlusAllDefaults: {
            "A": ["1000"],
            "B": ["2000"]
        },
        expectedDefaultedParamNames: ["A", "B"]
    }, {
        "description": " some combined cases",
        "oParameters": {
            "A": {
                "renameTo": "ANew"
            },
            "B": {
                "renameTo": "ANew"
            },
            "D": {
                "renameTo": "C"
            },
            "C": {},
            "E": {},
            "F": {}
        },
        aDefaultedParamNames: ["A", "B", "C", "E", "F"],
        oIntentParamsPlusAllDefaults: {
            "A": [],
            "B": [],
            "C": [],
            "D": [],
            "E": [],
            "F": [],
            "ANew": []
        },
        expectedIntentParamsPlusAllDefaults: {
            "A": [],
            "B": [],
            "D": [],
            "E": [],
            "F": [],
            "ANew": []
        },
        expectedDefaultedParamNames: ["A", "B", "E", "F"]
    }].forEach(function (oFixture) {
        /*
         * Tests that once found and deleted, dominated parameters do not
         * appear in the aDefaultedParamNames and
         * oDominatedDefaultParametersToRemove structures.
         */
        Q.test("constructParameterDominatorMap when " + oFixture.description, function (assert) {
            var oParameterDominatorMap = oUtils.constructParameterDominatorMap(oFixture.oParameters);
            var oDominatedDefaultParametersToRemove = oUtils.findDominatedDefaultParameters(oFixture.oIntentParamsPlusAllDefaults, oFixture.aDefaultedParamNames, oParameterDominatorMap);

            var aDefaultedParameterNamesWithoutDominatedParams =
                oFixture.aDefaultedParamNames.filter(function (sDefaultedParam) {
                    return !oDominatedDefaultParametersToRemove[sDefaultedParam];
                });

            var oIntentParamsPlusAllDefaultsWithoutDominatedParams =
                oUtils.filterObjectKeys(oFixture.oIntentParamsPlusAllDefaults, function (sDefaultedParam) {
                    return !oDominatedDefaultParametersToRemove[sDefaultedParam]; // keep condition
                });

            assert.deepEqual(oIntentParamsPlusAllDefaultsWithoutDominatedParams, oFixture.expectedIntentParamsPlusAllDefaults, " intent params ok");
            assert.deepEqual(aDefaultedParameterNamesWithoutDominatedParams, oFixture.expectedDefaultedParamNames, " defaulted Param Names ok");
        });
    });

    [
        {
            testDescription: "inbound has no parameters but one parameter is required",
            oInboundSignatureParameters: {},
            aParametersWithOptions: [
                { name: "p1", options: { required: true } }
            ],
            expected: false
        },
        {
            testDescription: "inbound has parameters but no options",
            oInboundSignatureParameters: {
                "p1": {
                    filter: "v1",
                    required: true
                }
            },
            aParametersWithOptions: [],  // nothing to check
            expected: true
        },
        {
            testDescription: "required parameter meets options (positive)",
            oInboundSignatureParameters: {
                "p1": {
                    required: true
                }
            },
            aParametersWithOptions: [
                { name: "p1", options: { required: true } }
            ],
            expected: true
        },
        {
            testDescription: "required parameter meets options (negative)",
            oInboundSignatureParameters: {
                "p1": {
                    defaultValue: {
                        value: "v1"
                    }
                }
            },
            aParametersWithOptions: [
                { name: "p1", options: { required: false } }
            ],
            expected: true
        },
        {
            testDescription: "one signature with one matching option",
            oInboundSignatureParameters: {
                "px": {
                    required: true,
                    filter: {
                        value: "v1"
                    }
                }
            },
            aParametersWithOptions: [
                { name: "p1", options: { required: false } },
                { name: "p2", options: { required: false } },
                { name: "px", options: { required: true } }
            ],
            expected: true
        },
        {
            testDescription: "multi-parameter signature with one non-matching option",
            oInboundSignatureParameters: {
                "p1": {
                    required: true,
                    filter: {
                        value: "v1"
                    }
                },
                "p2": {
                    required: true,
                    filter: {
                        value: "v2"
                    }
                },
                "p3": {
                    required: true,
                    filter: {
                        value: "v3"
                    }
                }
            },
            aParametersWithOptions: [
                { name: "p1", options: { required: true } },
                { name: "p2", options: { required: true } },
                { name: "p3", options: { required: false } }
            ],
            expected: false
        }
    ].forEach(function (oFixture) {
        QUnit.test("inboundSignatureMeetsParameterOptions when " + oFixture.testDescription, function (assert) {
            var bResult = oUtils.inboundSignatureMeetsParameterOptions(
                oFixture.oInboundSignatureParameters,
                oFixture.aParametersWithOptions
            );

            assert.strictEqual(bResult, oFixture.expected,
                "returns the expected result");
        });
    });

    [
        {
            sTestDescription: "test extract parameters - all parameterss are in the object",
            aParams: ["parameter1", "parameter2", "parameter3"],
            oWithParameters: {
                    parameter1: "test",
                    parameter2: "test2",
                    parameter3: "test3",
                    parameter4: "test4",
                    parameter5: "test5"
                },
            oExpected: {
                oReturned: {
                    parameter1: "test",
                    parameter2: "test2",
                    parameter3: "test3"
                },
                oWithLessParameters: {
                    parameter4: "test4",
                    parameter5: "test5"
                }
            }
        },
        {
            sTestDescription: "test extract parameters - some of the parameters are in the object",
            aParams: ["parameter1", "parameter2", "parameter3"],
            oWithParameters: {
                parameter1: "test",
                parameter3: "test3",
                parameter4: "test4",
                parameter5: "test5"
            },
            oExpected: {
                oReturned: {
                    parameter1: "test",
                    parameter3: "test3"
                },
                oWithLessParameters: {
                    parameter4: "test4",
                    parameter5: "test5"
                }
            }
        },
        {
            sTestDescription: "test extract parameters - non of the parameters where in the object",
            aParams: ["parameter1", "parameter2", "parameter3"],
            oWithParameters: {
                parameter4: "test4",
                parameter5: "test5"
            },
            oExpected: {
                oReturned: {
                },
                oWithLessParameters: {
                    parameter4: "test4",
                    parameter5: "test5"
                }
            }
        },
        {
            sTestDescription: "test extract parameters - no parameters where send",
            aParams: [],
            oWithParameters: {
                parameter1: "test",
                parameter2: "test2",
                parameter3: "test3",
                parameter4: "test4",
                parameter5: "test5"
            },
            oExpected: {
                oReturned: {
                },
                oWithLessParameters: {
                    parameter1: "test",
                    parameter2: "test2",
                    parameter3: "test3",
                    parameter4: "test4",
                    parameter5: "test5"
                }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("" + oFixture.sTestDescription, function (assert) {
            // Arrange
            // Act
            var oResult = oUtils.extractParameters(oFixture.aParams, oFixture.oWithParameters);

            // Assert
            assert.deepEqual(oResult, oFixture.oExpected.oReturned, "The returned object had all the expected parameters");
            assert.deepEqual(oFixture.oWithParameters, oFixture.oExpected.oWithLessParameters, "All expected parameters got removed from the the original object");
        });
    });


});
