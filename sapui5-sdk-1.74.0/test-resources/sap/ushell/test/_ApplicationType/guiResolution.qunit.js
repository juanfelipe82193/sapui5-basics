// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ui/thirdparty/URI",
    "sap/ushell/_ApplicationType/guiResolution",
    "sap/ushell/services/URLParsing",
    "sap/ushell/test/utils",
    "sap/ushell/_ApplicationType/systemAlias"
], function (URI, oGuiResolution, URLParsing, oTestUtils, oSystemAlias) {
    "use strict";

    /* global QUnit sinon */

    QUnit.module("sap.ushell._ApplicationType.guiResolution", {
        beforeEach: function () {
        },
        afterEach: function () {
            oTestUtils.restoreSpies(
                jQuery.sap.log.error,
                oSystemAlias.spliceSapSystemIntoURI
            );
        }
    });

    QUnit.test("module exports an object", function (assert) {
        assert.strictEqual(
            Object.prototype.toString.apply(oGuiResolution),
            "[object Object]",
            "got an object back"
        );
    });

    [
        {
            testDescription: "empty query",
            sQuery: "",
            oParamsToInject: {
                "param1": ["A"],
                "param2": ["B"]
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P_OBJECT=param1%2521A%2525param2%2521B"
        },
        {
            testDescription: "empty query and no parameters",
            sQuery: "",
            oParamsToInject: {},
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: ""
        },
        {
            testDescription: "no parameters",
            sQuery: "A=B&C=D",
            oParamsToInject: {},
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "A=B&C=D"
        },
        {
            testDescription: "P_OBJECT= parameter has some parameters already assigned",
            sQuery: "P1=V1&P_OBJECT=X%2521Y%2525ZZZ%2521KKK&P2=V2",
            oParamsToInject: {
                "param1": ["A"],
                "param2": ["B"]
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P1=V1&P_OBJECT=X%2521Y%2525ZZZ%2521KKK%2525param1%2521A%2525param2%2521B&P2=V2"
        },
        {
            testDescription: "P_OBJECT= parameter is in the middle of the query string",
            sQuery: "P1=V1&P_OBJECT=&P2=V2",
            oParamsToInject: {
                "param1": ["A"],
                "param2": ["B"]
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P1=V1&P_OBJECT=param1%2521A%2525param2%2521B&P2=V2"
        },
        {
            testDescription: "P_OBJECT= parameter is at the beginning of the query string",
            sQuery: "P_OBJECT=&P1=V1&P2=V2",
            oParamsToInject: {
                "param1": ["A"],
                "param2": ["B"]
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P_OBJECT=param1%2521A%2525param2%2521B&P1=V1&P2=V2"
        },
        {
            testDescription: "P_OBJECT= not passed in query string",
            sQuery: "P1=V1&P2=V2",
            oParamsToInject: {
                "param1": ["A"],
                "param2": ["B"]
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P1=V1&P2=V2&P_OBJECT=param1%2521A%2525param2%2521B"
        },
        {
            testDescription: "P_OBJECT# parameter has some parameters already assigned, and # is used for assignment, and ! is used for separator",
            sQuery: "P1#V1!P_OBJECT#X%2521Y%2525ZZZ%2521KKK!P2#V2",
            oParamsToInject: {
                "param1": ["A"],
                "param2": ["B"]
            },
            sParamDelimiter: "!",
            sAssignDelimiter: "#",
            expectedQuery: "P1#V1!P_OBJECT#X%2521Y%2525ZZZ%2521KKK%2525param1%2521A%2525param2%2521B!P2#V2"
         },
         {
             testDescription: "empty query, but exactly 132 characters in P_OBJECT",
             sQuery: "",
             oParamsToInject: {
                 "param1": ["0123456789"],   // 22 characters = 16 characters + 3 (%xx for =) + 3 (%xx for &)
                 "param2": ["0123456789"],   // 22 characters
                 "param3": ["0123456789"],   // 22 characters
                 "param4": ["0123456789"],   // 22 characters
                 "param5": ["0123456789"],   // 22 characters
                 "param6": ["0123456789xyz"] // 22 characters (no & separator)
                                             // -------------
                                             // 132
             },
             sParamDelimiter: "&",
             sAssignDelimiter: "=",
             expectedQuery: "P_OBJECT=param1%25210123456789%2525param2%25210123456789%2525param3%25210123456789%2525param4%25210123456789%2525param5%25210123456789%2525param6%25210123456789xyz"
         },
         {
             testDescription: "empty query, but exactly 133 characters in P_OBJECT (132 is the limit)",
             sQuery: "",
             oParamsToInject: {
                 "param1": ["0123456789"], // 22 characters = 16 characters + 3 (%xx for =) + 3 (%xx for &)
                 "param2": ["0123456789"], // 22 characters
                 "param3": ["0123456789"], // 22 characters
                 "param4": ["0123456789"], // 22 characters
                 "param5": ["0123456789"], // 22 characters
                 "param6": ["0123456789xyzK"] // 23 characters (no & separator)
                                           // -------------
                                           // 133
             },
             sParamDelimiter: "&",
             sAssignDelimiter: "=",
             expectedQuery: "P_OBJ1=K&P_OBJECT=param1%25210123456789%2525param2%25210123456789%2525param3%25210123456789%2525param4%25210123456789%2525param5%25210123456789%2525param6%25210123456789xyz"
         },
         {
             testDescription: "empty query, but more than 132 characters with break at param separator",
             sQuery: "",
             oParamsToInject: {
                 "param1": ["0123456789"],
                 "param2": ["0123456789"],
                 "param3": ["0123456789"],
                 "param4": ["0123456789"],
                 "param5": ["0123456789"],
                 "param6": ["0123456789xyz"],  // all that can fit in a P_OBJECT parameter
                 "param7": ["A"]
             },
             sParamDelimiter: "&",
             sAssignDelimiter: "=",
             expectedQuery: "P_OBJ1=%2525param7%2521A&P_OBJECT=param1%25210123456789%2525param2%25210123456789%2525param3%25210123456789%2525param4%25210123456789%2525param5%25210123456789%2525param6%25210123456789xyz"
         },
         {
             testDescription: "empty query, but more than 132 characters with break inbetween param separator",
             sQuery: "",
             oParamsToInject: {
                 "param1": ["0123456789"],
                 "param2": ["0123456789"],
                 "param3": ["0123456789"],
                 "param4": ["0123456789"],
                 "param5": ["0123456789"],
                 "param6": ["0123456789xy"],
                 "param7": ["A"]
             },
             sParamDelimiter: "&",
             sAssignDelimiter: "=",
             expectedQuery: "P_OBJ1=25param7%2521A&P_OBJECT=param1%25210123456789%2525param2%25210123456789%2525param3%25210123456789%2525param4%25210123456789%2525param5%25210123456789%2525param6%25210123456789xy%25"
        }
    ].forEach(function (oFixture) {
        QUnit.test("injectEffectiveParametersIntoWebguiPobjectParam: works as expected when " + oFixture.testDescription, function (assert) {
            window.sap = {
                ushell: {
                    Container: {
                        getService: sinon.stub().withArgs("URLParsing").returns(new URLParsing())
                    }
                }
            };

            sinon.stub(jQuery.sap.log, "error");
            var sGotQuery = oGuiResolution.injectEffectiveParametersIntoWebguiPobjectParam(oFixture.sQuery, oFixture.oParamsToInject, oFixture.sParamDelimiter, oFixture.sAssignDelimiter);
            var iLogFunctionCallCount = jQuery.sap.log.error.getCalls().length;

            if (oFixture.expectedErrorArgs && jQuery.isArray(oFixture.expectedErrorArgs)) {
                assert.strictEqual(iLogFunctionCallCount, 1, "jQuery.sap.log.error was called 1 time");
                if (iLogFunctionCallCount) {
                    assert.deepEqual(jQuery.sap.log.error.getCall(0).args, oFixture.expectedErrorArgs, "jQuery.sap.log.error was called with the expected arguments");
                }
            } else {
                assert.strictEqual(iLogFunctionCallCount, 0, "jQuery.sap.log.error was called 0 times");
            }

            assert.strictEqual(sGotQuery, oFixture.expectedQuery, "obtained expected result");
        });
    });

    [
        {
            testDescription: "query is empty, there is no content",
            sParamName: "SOME_PARAM",
            sQuery: "",
            sQueryParamDelimiter: "anything",
            sQueryParamAssignDelimiter: "anything",
            fnAmend: function (sParam) { return sParam; },
            expectedResult: {
                query: "",
                found: false
            }
        },
        {
            testDescription: "non-existing parameter name",
            sParamName: "NOT_IN_QUERY",
            sQuery: "P1=V1&P2=V2&P_OBJECT=param1%2521A%2525param2%2521B",
            sQueryParamDelimiter: "&",
            sQueryParamAssignDelimiter: "=",
            fnAmend: function (sParam) { return sParam; },
            expectedResult: {
                query: "P1=V1&P2=V2&P_OBJECT=param1%2521A%2525param2%2521B",
                found: false
            }
        },
        {
            testDescription: "existing parameter name",
            sParamName: "THE_PARAMETER",
            sQuery: "P1=V1&P2=V2&THE_PARAMETER=param1%2521A%2525param2%2521B",
            sQueryParamDelimiter: "&",
            sQueryParamAssignDelimiter: "=",
            fnAmend: function (sParam) { return sParam; },
            expectedResult: {
                query: "P1=V1&P2=V2&THE_PARAMETER=param1%2521A%2525param2%2521B",
                found: true
            }
        },
        {
            testDescription: "middle parameter is deleted",
            sParamName: "P2",
            sQuery: "P1=V1&P2=V2&THE_PARAMETER=param1%2521A%2525param2%2521B",
            sQueryParamDelimiter: "&",
            sQueryParamAssignDelimiter: "=",
            fnAmend: function (sParam) { return; },
            expectedResult: {
                query: "P1=V1&THE_PARAMETER=param1%2521A%2525param2%2521B",
                found: true
            }
        },
        {
            testDescription: "last parameter is deleted",
            sParamName: "P3",
            sQuery: "P1=V1&P2=V2&P3=V3",
            sQueryParamDelimiter: "&",
            sQueryParamAssignDelimiter: "=",
            fnAmend: function (sParam) { return; },
            expectedResult: {
                query: "P1=V1&P2=V2",
                found: true
            }
        },
        {
            testDescription: "existing parameter is modified",
            sParamName: "THE_PARAMETER",
            sQuery: "P1=V1&P2=V2&THE_PARAMETER=param1%2521A%2525param2%2521B",
            sQueryParamDelimiter: "&",
            sQueryParamAssignDelimiter: "=",
            fnAmend: function (sParam) { return "something else"; },
            expectedResult: {
                query: "P1=V1&P2=V2&something else",
                found: true
            }
        },
        {
            testDescription: "existing parameter is emptied",
            sParamName: "P2",
            sQuery: "P1=V1&P2=<to be removed>&P3=V3",
            sQueryParamDelimiter: "&",
            sQueryParamAssignDelimiter: "=",
            fnAmend: function (sParam) { return "P2="; },
            expectedResult: {
                query: "P1=V1&P2=&P3=V3",
                found: true
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("_amendGuiParam works as expected when " + oFixture.testDescription, function (assert) {
            // Arrange

            // Act
            var oResult = oGuiResolution.amendGuiParam(
                oFixture.sParamName,
                oFixture.sQuery,
                oFixture.sQueryParamDelimiter,
                oFixture.sQueryParamAssignDelimiter,
                oFixture.fnAmend
            );

            // Assert
            assert.deepEqual(oResult, oFixture.expectedResult, "method returned the expected result object");
        });
    });

    [
        {
            sUrl: "%7etransaction=SU01",
            expected: {
                hasParameters: false,
                transactionParamName: "%7etransaction",
                transactionCode: "SU01",
                parameters: []
            }
        },
        {
            sUrl: "%7etransaction=SU01%20", // %20 does not matter
            expected: {
                hasParameters: false,
                transactionParamName: "%7etransaction",
                transactionCode: "SU01",
                parameters: []
            }
        },
        {
            sUrl: "%7etransaction=*SU01%20", // %20 does not matter
            expected: {
                hasParameters: false,
                transactionParamName: "%7etransaction",
                transactionCode: "*SU01",
                parameters: []
            }
        },
        {
            sUrl: "?%7etransaction=SU01%20%3d",
            expected: {
                hasParameters: false,
                transactionParamName: "?%7etransaction",
                transactionCode: "SU01",
                parameters: []
            }
        },
        {
            sUrl: "?%7etransaction=*SU01%20%3d",
            expected: {
                hasParameters: false,
                transactionParamName: "?%7etransaction",
                transactionCode: "*SU01",
                parameters: []
            }
        },
        {
            sUrl: "?%7etransaction=*SU01",
            expected: {
                hasParameters: false,
                transactionParamName: "?%7etransaction",
                transactionCode: "*SU01",
                parameters: []
            }
        },
        {
            sUrl: "?%7etransaction=SAPAPO%2fRES01",
            expected: {
                hasParameters: false,
                transactionParamName: "?%7etransaction",
                transactionCode: "SAPAPO%2fRES01",
                parameters: []
            }
        },
        {
            sUrl: "?%7etransaction=/SAP/APO/RES%3001",
            expected: {
                hasParameters: false,
                transactionParamName: "?%7etransaction",
                transactionCode: "/SAP/APO/RES%3001",
                parameters: []
            }
        },
        {
            sUrl: "%7etransaction=*su01%20Param1%3dValue1%3bParam2%3dValue2",
            expected: {
                hasParameters: true,
                transactionParamName: "%7etransaction",
                transactionCode: "su01",
                parameters: [
                    { "name": "Param1", "value": "Value1" },
                    { "name": "Param2", "value": "Value2" }
                ]
            }
        },
        {
            sUrl: "%7etransaction=**su01%20Param1%3dValue1%3bParam2%3dValue2",
            expected: {
                hasParameters: true,
                transactionParamName: "%7etransaction",
                transactionCode: "*su01",
                parameters: [
                    { "name": "Param1", "value": "Value1" },
                    { "name": "Param2", "value": "Value2" }
                ]
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("parseWebguiTransactionQueryParam: parses correctly when url is " + oFixture.sUrl, function (assert) {
            assert.deepEqual(
                oGuiResolution.parseWebguiTransactionQueryParam(oFixture.sUrl),
                oFixture.expected,
                "obtained expected result"
            );
        });
    });

    [
        {
            testDescription: "simple transaction parameter, no parameters to interpolate",
            sQuery: "%7etransaction=SU01",
            oParamsToInject: {},
            expectedErrorArgs: undefined,
            expectedQuery: "%7etransaction=SU01"  // '*' is added
        },
        {
            testDescription: "transaction parameter with leading question mark, no parameters to interpolate",
            sQuery: "?%7etransaction=SU01",
            oParamsToInject: {},
            expectedErrorArgs: undefined,
            expectedQuery: "?%7etransaction=SU01" // leading "?" is preserved
        },
        {
            testDescription: "transaction without parameters and parameters to interpolate",
            sQuery: "?%7etransaction=SU01",
            oParamsToInject: {
                "Param1" : ["Value1"],
                "Param2" : ["Value2"]
            },
            expectedErrorArgs: undefined,
            expectedQuery: "?%7etransaction=*SU01%20PARAM1%3dValue1%3bPARAM2%3dValue2" // leading "?" is preserved
        },
        {
            testDescription: "transaction without parameters with trailing %20 and parameters to interpolate",
            sQuery: "?%7etransaction=SU01%20",
            oParamsToInject: {
                "Param1" : ["Value1"],
                "Param2" : ["Value2"]
            },
            expectedErrorArgs: undefined,
            expectedQuery: "?%7etransaction=*SU01%20PARAM1%3dValue1%3bPARAM2%3dValue2"
        },
        {
            testDescription: "transaction without parameters with trailing %20 and no parameters to interpolate",
            sQuery: "?%7etransaction=SU01%20",
            oParamsToInject: {},
            expectedErrorArgs: undefined,
            expectedQuery: "?%7etransaction=SU01"
        },
        {
            testDescription: "transaction with parameters (and leading transaction '*') but no parameters to interpolate",
            sQuery: "?%7etransaction=*SU01%20Param1%3dValue1%3bParam2%3dValue2",
            oParamsToInject: {},
            expectedErrorArgs: undefined,
            expectedQuery: "?%7etransaction=*SU01%20PARAM1%3dValue1%3bPARAM2%3dValue2"
        },
        {
            testDescription: "multiple equals (=) in transaction query parameter, with parameters to inject",
            sQuery: "%7etransaction=SU01%20&Foo=Fie",
            oParamsToInject: {},
            expectedErrorArgs: [
                "Found more than one assignment ('=') in the transaction query parameter",
                "Only one '=' sign is expected in %7etransaction=SU01%20&Foo=Fie",
                "sap.ushell.services.ClientSideTargetResolution"
            ],
            expectedQuery: "%7etransaction=SU01%20&Foo=Fie"
        },
        {
            testDescription: "input does not specify a transaction name",
            sQuery: "%7etransaction=",
            oParamsToInject: {},
            expectedErrorArgs: [
                "The transaction query parameter must specify at least the transaction name",
                "Got %7etransaction= instead.",
                "sap.ushell.services.ClientSideTargetResolution"
            ],
            expectedQuery: "%7etransaction="
        }
    ].forEach(function (oFixture) {
        QUnit.test("injectEffectiveParametersIntoWebguiQueryParam: works as expected when " + oFixture.testDescription, function (assert) {
            window.sap = {
                ushell: {
                    Container: {
                        getService: sinon.stub().withArgs("URLParsing").returns(new URLParsing())
                    }
                }
            };

            sinon.stub(jQuery.sap.log, "error");

            var sGotQuery = oGuiResolution.injectEffectiveParametersIntoWebguiQueryParam(oFixture.sQuery, oFixture.oParamsToInject, oFixture.sParamDelimiter, oFixture.sAssignDelimiter);
            var iLogFunctionCallCount = jQuery.sap.log.error.callCount;

            if (oFixture.expectedErrorArgs && jQuery.isArray(oFixture.expectedErrorArgs)) {
                assert.strictEqual(iLogFunctionCallCount, 1, "jQuery.sap.log.error was called 1 time");
                if (iLogFunctionCallCount) {
                    assert.deepEqual(jQuery.sap.log.error.getCall(0).args, oFixture.expectedErrorArgs, "jQuery.sap.log.error was called with the expected arguments");
                }
            } else {
                assert.strictEqual(iLogFunctionCallCount, 0, "jQuery.sap.log.error was called 0 times");
            }

            assert.strictEqual(sGotQuery, oFixture.expectedQuery, "obtained expected result");
        });
    });

    [
        { sName: "name"               , sValue: "value"          , expected: true },
        { sName: "sap-name"           , sValue: "value"          , expected: false },
        { sName: "something-sap-name" , sValue: "value"          , expected: true },
        { sName: "something"          , sValue: "sap-name=value" , expected: true },
        { sName: "sap-name"           , sValue: "sap-value"      , expected: false },
        { sName: "sap-"               , sValue: "value"          , expected: false }
    ].forEach(function (oFixture) {
        var sTestName = "returns expected result when " + oFixture.sName + "=" + oFixture.sValue + " is given";

        QUnit.test("isWebguiBusinessParameter: " + sTestName + " as 1 parameter", function (assert) {
            QUnit.strictEqual(
                oGuiResolution.isWebguiBusinessParameter(oFixture.sName + "=" + oFixture.sValue),
                oFixture.expected,
                "got expected result"
            );
        });
        QUnit.test("isWebguiBusinessParameter: " + sTestName + " as 2 parameters", function (assert) {
            QUnit.strictEqual(
                oGuiResolution.isWebguiBusinessParameter(oFixture.sName, oFixture.sValue),
                oFixture.expected,
                "got expected result"
            );
        });
    });

    [{
        testDescription: "business and non-business parameters are given",
        oParams: {
            "sap-param": "value1",
            "someParam": "value2",
            "someParam2": "value3",
            "sap-param2": "value4"
        },
        expectedBusinessParams: {
            "someParam": "value2",
            "someParam2": "value3"
        },
        expectedNonBusinessParams: {
            "sap-param": "value1",
            "sap-param2": "value4"
        }
    }].forEach(function (oFixture) {

        QUnit.test("getWebguiBusinessParameters: " + oFixture.testDescription, function (assert) {
            var oNonBusinessParamsGot = oGuiResolution.getWebguiNonBusinessParameters(oFixture.oParams);
            assert.deepEqual(oNonBusinessParamsGot, oFixture.expectedNonBusinessParams, "got expected non business parameters");

            var oBusinessParamsGot = oGuiResolution.getWebguiBusinessParameters(oFixture.oParams);
            assert.deepEqual(oBusinessParamsGot, oFixture.expectedBusinessParams, "got expected business parameters");
        });
    });

    QUnit.test("buildNativeWebGuiURI: calls _spliceSapSystemIntoURI with the expected parameters", 4, function (assert) {
        var fnDone = assert.async();

        // stubs to get the promise resolved
        sinon.stub(oSystemAlias, "spliceSapSystemIntoURI")
            .returns(new jQuery.Deferred().resolve(new URI("/resolved/url"))
                .promise());

        oGuiResolution.buildNativeWebGuiURI("ATCODE", "ASAPSYSTEM").done(function (oURI) {
            // note: guaranteed to resolve because stubs always resolve
            assert.strictEqual(oSystemAlias.spliceSapSystemIntoURI.getCalls().length, 1, "_buildNativeWebGuiURI was called 1 time");

            assert.deepEqual(
                oSystemAlias.spliceSapSystemIntoURI.getCall(0).args[0].toString(),
                "/gui/sap/its/webgui?%7etransaction=ATCODE&%7enosplash=1",
                "_spliceSapSystemIntoURI was called with the expected arguments"
            );

            assert.deepEqual(oSystemAlias.spliceSapSystemIntoURI.getCall(0).args.slice(1), [
                    "",
                    "ASAPSYSTEM",
                    undefined,
                    "NATIVEWEBGUI",
                    "apply",
                    undefined
                ],
                "buildNativeWebGuiURI was called with the expected arguments");

            assert.deepEqual(oURI.toString(), "/resolved/url");
        }).always(function () {
            fnDone();
        });
    });

    QUnit.test("constructFullWebguiResolutionResult: calls _buildNativeWebGuiURI with the expected parameters", function(assert) {
        var oMatchingGUITarget = { // a sample matching gui target
            "inbound": {
                "semanticObject": "Action",
                "action": "tosu01",
                "id": "Action-tosu01~62zS",
                "title": "tosu01",
                "resolutionResult": {
                    "applicationType": "TR",
                    "additionalInformation": "",
                    "text": "tosu01",
                    "url": "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",
                    "systemAlias": "U1Y_000",
                    "sap.gui": {
                        "transaction": "SU01"
                    },
                    "sap.ui": {
                        "technology": "GUI"
                    }
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": false
                },
                "signature": {
                    "parameters": {},
                    "additionalParameters": "allowed"
                }
            },
            "genericSO": false,
            "intentParamsPlusAllDefaults": {},
            "defaultedParamNames": [],
            "countMatchingParams": 0,
            "countMatchingRequiredParams": 0,
            "countMatchingFilterParams": 0,
            "countDefaultedParams": 0,
            "countPotentiallyMatchingParams": 0,
            "countFreeInboundParams": 0,
            "resolutionResult": {},
            "priorityString": "x TECM=0 MTCH=000 MREQ=000 NFIL=000 NDEF=000 POT=000 RFRE=999 TECP=1",
            "matches": true,
            "matchesVirtualInbound": false
        };


        var fnDone = assert.async();

        window.sap = {
            ushell: {
                Container: {
                    getService: sinon.stub().withArgs("URLParsing").returns(new URLParsing())
                }
            }
        };

        // stubs to get the promise resolved
        sinon.stub(oSystemAlias, "spliceSapSystemIntoURI").returns(new jQuery.Deferred().resolve(new URI("/resolved/url")).promise());

        oGuiResolution.constructFullWebguiResolutionResult(
            oMatchingGUITarget,
            sinon.stub(),
            "#" + oMatchingGUITarget.inbound.semanticObject + "-" + oMatchingGUITarget.inbound.action
        ).then(function (oResolutionResult) {
            assert.deepEqual(oResolutionResult, {
                "additionalInformation": "",
                "applicationType": "TR",
                "sap-system": "U1Y_000",
                "text": "tosu01",
                "url": "/resolved/url?&"
            }, "resolution result ok ");

            fnDone();

        }, fnDone);
    });

    QUnit.test("_resolveEasyAccessMenuIntentWebgui: properly handles a failed response from _buildNativeWebGuiURI", function (assert) {

        // Arrange
        var oIntent = {
                params: {
                    "sap-ui2-tcode": [null],
                    "sap-system": [null]
                }
            },
            fnDone = assert.async();

        assert.expect(1);

        // stubs to get the promise rejected
        sinon.stub(oSystemAlias, "spliceSapSystemIntoURI")
            .returns(new jQuery.Deferred().reject("Error test")
                .promise());

        oGuiResolution.resolveEasyAccessMenuIntentWebgui(oIntent, null, null, null, null).then(function () {
            assert.ok(false, "Promise was rejected");
        }, function (oError) {
            assert.ok(true, "Promise was rejected");
            fnDone();
        });
    });

    QUnit.test("_resolveEasyAccessMenuIntentWebgui: properly handles an Intent without sap-system", function (assert) {

        // Arrange
        var oIntent = {
                params: {
                    "sap-ui2-tcode": undefined,
                    "sap-system": undefined
                }
            },
            fnDone = assert.async();

        assert.expect(1);

        // stubs to get the promise rejected
        sinon.stub(oSystemAlias, "spliceSapSystemIntoURI")
            .returns(new jQuery.Deferred().reject("Error test")
                .promise());

        oGuiResolution.resolveEasyAccessMenuIntentWebgui(oIntent, null, null, null, null).then(function () {
            assert.ok(false, "Promise was rejected");
        }, function (oError) {
            assert.ok(true, "Promise was rejected");
            fnDone();
        });
    });

});
