// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for resolveHashFragment method of ClientSideTargetResolution
 *
 */

sap.ui.define([
    "jquery.sap.global",
    "sap/ushell/test/utils",
    "sap/ushell/utils",
    "sap/ushell/services/ClientSideTargetResolution",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/test/services/_ClientSideTargetResolution/TestHelper"
], function (jQuery, testUtils, utils, ClientSideTargetResolution, oAppConfiguration, oTestHelper) {
    "use strict";

    /* global QUnit sinon */

    /*
     * A complete resolveHashFragment test, mocking only AppState, check that
     * everything works semantically together (black box).
     */

    /*
     * generate a string of around iCnt characters
     */
    function genStr (sStr, iCnt) {
        var s = sStr;
        while (s.length < iCnt) {
            s = s + sStr;
        }
        return s;
    }

    var O_KNOWN_SYSTEM_ALIASES = {
        LOCAL_SYSTEM: oTestHelper.getLocalSystemAlias(),
        UR3CLNT120: oTestHelper.createSystemAlias({
            client: "120",
            http: oTestHelper.createHttpConnection("example.corp.com", 50055),
            https: oTestHelper.createHttpConnection("example.corp.com", 44355),
            rfc: oTestHelper.createRfcConnection("", "example.corp.com", 3255, "PUBLIC", "p/secude:CN=UR3, O=SAP-AG, C=DE", "8")
        }),
        SYSCONNSTRING: oTestHelper.createSystemAlias({
            https: oTestHelper.createHttpConnection("example.corp.com", 44355),
            rfc: oTestHelper.createRfcConnection("", "/H/Coffee/S/Decaf/G/Roast", 3255, "", "p/secude:CN=UR3, O=SAP-AG, C=DE", "8"),
            client: "120"
        }),
        SYS_RFC_SYSID: oTestHelper.createSystemAlias({
            https: oTestHelper.createHttpConnection("test.example.corp.com", 44355),
            rfc: oTestHelper.createRfcConnection("UR7", "example.corp.com", 3255, "PUBLIC", "p/secude:CN=UR3, O=SAP-AG, C=DE", "8"),
            client: "120"
        }),
        SYS_WITH_PATH: oTestHelper.createSystemAlias({
            https: oTestHelper.createHttpConnection("vmw.example.corp.com", 44335, "/go-to/the/moon"),
            client: "111"
        }),
        SYS_IT_NO_R3: oTestHelper.createSystemAlias({
            https: oTestHelper.createHttpConnection("example.corp.com", 44355),
            rfc: oTestHelper.createRfcConnection("UR3", "ldcsuv2", 32, "SPACE", "", ""),
            client: "815",
            language: "IT"
        }),
        ALIASRFC: oTestHelper.createSystemAlias({
            https: oTestHelper.createHttpConnection("example.corp.com", 1111, "/path"),
            rfc: oTestHelper.createRfcConnection("UV2", "ldcsuv2", 32, "SPACE", "p/secude:CN=UXR, O=SAP-AG, C=DE", "9"),
            client: "220",
            language: ""
        }),
        ALIASRFC_IT: oTestHelper.createSystemAlias({
            https: oTestHelper.createHttpConnection("example.corp.com", 44355),
            rfc: oTestHelper.createRfcConnection("UR3", "ldcsuv2", 32, "SPACE", "p/secude:CN=UXR, O=SAP-AG, C=DE", "9"),
            client: "815",
            language: "IT"
        }),
        // typical system alias defined in HCP
        EMPTY_PORT_PREFIX_RFC: oTestHelper.createSystemAlias({
            http: undefined,
            https: oTestHelper.createHttpConnection("system.our.domain.corp"),
            rfc: {}
        }),
        MULTIPLE_INVALID_FIELDS: oTestHelper.createSystemAlias({
            http: oTestHelper.createHttpConnection(123, "", "/go-to/the/moon"), //not correct host, port as string is ok
            https: {
                port: [44355],
                pathPrefix: 456
            }, //host not provided, port should be string or number, path should be string
            rfc: {}
        }),
        ONLY_RFC: {
            client: "",
            rfc: oTestHelper.createRfcConnection("SYS", "ldcisys", 32, "SPACE", "", "")
        }
   };

    var O_CDM3_TEMPLATE_NOTIONS = {
        "_baseUrl": "{join() &_destProtocol,'://',&_destHost,':',&_destPort,&_destPrefix}",
        "_destName": "{or sap-system,./sap.app/destination}",
        "_destProtocolHttps": "{and /systemAliases/{&_destName}/https,'https'}",
        "_destProtocolHttp": "{and /systemAliases/{&_destName}/http,'http'}",
        "_destProtocol": "{or &_destProtocolHttps,&_destProtocolHttp}",
        "_destHost": "{/systemAliases/{&_destName}/{&_destProtocol}/host}",
        "_destPort": "{or /systemAliases/{&_destName}/{&_destProtocol}/port,''}",
        "_destHasNoAppRuntime": "{not &appRuntime}",
        "_destDefaultToAbapPrefix": "{or &_destHasNoAppRuntime,&isAppRuntimeAbap}",
        "_destDefaultPrefix": "{and &_destDefaultToAbapPrefix,'/sap/bc'}",
        "_destPrefix": "{if({/systemAliases/{&_destName}/{&_destProtocol}/pathPrefix}) /systemAliases/{&_destName}/{&_destProtocol}/pathPrefix,&_destDefaultPrefix}",
        "_destIsLoadBalancing": "{and /systemAliases/{&_destName}/rfc/systemId}",
        "_destIsNotLoadBalancing": "{not &_destIsLoadBalancing}",
        "_destHostIsConnectString": "{match(^[/][HGMR][/].*) /systemAliases/{&_destName}/rfc/host}",
        "_startupParameters": "{*|match(^(?!sap-(system\\|(ushell-navmode))$))}"
    };

    var O_CDM3_SAMPLE_SITE = {
        "systemAliases": {
            "fiori_blue_box": {
                "https": {
                    "id": "fiori_blue_box_HTTPS",
                    "host": "tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com",
                    "pathPrefix": ""
                },
                "id": "fiori_blue_box",
                "client": "000",
                "language": "IT"
            },
            "legacy_blue_box": {
                "https": {
                    "id": "legacy_blue_box_HTTPS",
                    "host": "tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com",
                    "pathPrefix": ""
                },
                "rfc": {
                    "id": "legacy_blue_box",
                    "systemId": "",
                    "host": "example.corp.com",
                    "service": "3255",
                    "loginGroup": "",
                    "sncNameR3": "p/secude:CN=EXAMPLE, O=SAP-AG, C=DE",
                    "sncQoPR3": "8"
                },
                "id": "legacy_blue_box",
                "client": "120",
                "language": "DE"
            }
        }
    };

        /*
     * Checks whether the expected warnings and errors were logged on the
     * console, taking the expectations from the given test fixture, which
     * should be defined as follows:
     *
     * {
     *
     *   ... rest of the fixture...
     *
     *   expectedWarningCalls: [
     *      [   // arguments of the first call
     *          "1stArg",
     *          "2ndArg",
     *          "3rdArg"
     *      ],
     *      ... more items if more calls are expected
     *   ],
     *   expectedErrorCalls: []  // 0 calls to jQuery.sap.log.error expected
     * }
     *
     * NOTE:
     * - If the given fixture does not specify the 'expectedWarningCalls' and
     *   'expectedErrorCalls' keys, no test will be executed.
     * - jQuery.sap.log.error and jQuery.sap.log.warning should have been
     *   already stubbed before this function is called.
     */
    function testExpectedErrorAndWarningCalls (assert, oFixture) {

        if (oFixture.hasOwnProperty("expectedErrorCalls")) {
            var aExpectedErrorCalls = (oFixture.expectedErrorCalls || []);

            assert.strictEqual(
                jQuery.sap.log.error.callCount,
                aExpectedErrorCalls.length,
                "jQuery.sap.log.error was called the expected number of times"
            );

            if (aExpectedErrorCalls.length > 0) {
                assert.deepEqual(
                    jQuery.sap.log.error.args,
                    aExpectedErrorCalls,
                    "jQuery.sap.log.error logged the expected errors"
                );
            }
        }

        if (oFixture.hasOwnProperty("expectedWarningCalls")) {
            var aExpectedWarningCalls = (oFixture.expectedWarningCalls || []);

            assert.strictEqual(
                jQuery.sap.log.warning.callCount,
                aExpectedWarningCalls.length,
                "jQuery.sap.log.warning was called the expected number of times"
            );

            if (aExpectedWarningCalls.length > 0) {
                assert.deepEqual(
                    jQuery.sap.log.warning.args,
                    aExpectedWarningCalls,
                    "jQuery.sap.log.warning logged the expected warnings"
                );
            }
        }
    }

    function createService (oArgs) {
        var oConfiguration = (oArgs || {}).configuration;
        var aInbounds = (oArgs || {}).inbounds || [];
        var oAdapter = (oArgs || {}).adapter;

        if (!oAdapter) {
            // create fake adapter
            oAdapter = {
                getInbounds: sinon.stub().returns(
                    new jQuery.Deferred().resolve(aInbounds).promise()
                )
            };
        }

        var oUshellConfig = testUtils.overrideObject({}, {
            "/services/ClientSideTargetResolution": oConfiguration
        });

        testUtils.resetConfigChannel(oUshellConfig);

        return new ClientSideTargetResolution(
            oAdapter,
            null,
            null,
            oConfiguration
        );
    }

    function generateDefault (sValue, oExtended) {
        return {
            value: sValue,
            extendedValue: oExtended
        };
    }

    function generateEqExtendedDefault (sHighValue) {
        return {
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: sHighValue,
                High: null
            }]
        };
    }

    var aTestCases = [
        {
            "testDescription": "Full local webgui resolution with intent parameters",
            "intent": "SpoolRequest-display?JobCount=pYRJlwlG&JobName=FA163E2CC4811ED6BCD8CCCFB7A47242",
            oKnownSapSystemData: {
                // Mocks expansions from ClientSideTargetResolutionAdapter#resolveSystemAlias
                SYSRFCSYSID: O_KNOWN_SYSTEM_ALIASES.SYS_RFC_SYSID
            },
            "inbound": {
                "semanticObject": "SpoolRequest",
                "action": "display",
                "title": "Display Spoolrequests",
                "resolutionResult": {
                    "componentProperties": {
                        "url": "/sap/bc/gui/sap/its/webgui;~sysid=UXV;~service=3200?%7etransaction=SP01_SIMPLE&%7enosplash=1",
                        "siteId": "4fbb8326-f630-497b-83c5-6cf48371715d",
                        "appId": "X-SAP-UI2-ADCAT:SAP_NW_BE_APPS:NW:005056AB5B8D1EE5BFAFFCA268719CAF_TM"
                    },
                    "sap.platform.runtime": {
                        "componentProperties": {
                            "url": "/sap/bc/gui/sap/its/webgui;~sysid=UXV;~service=3200?%7etransaction=SP01_SIMPLE&%7enosplash=1",
                            "siteId": "4fbb8326-f630-497b-83c5-6cf48371715d",
                            "appId": "X-SAP-UI2-ADCAT:SAP_NW_BE_APPS:NW:005056AB5B8D1EE5BFAFFCA268719CAF_TM"
                        }
                    },
                    "sap.gui": {
                        "_version": "1.2.0",
                        "transaction": "SP01_SIMPLE"
                    },
                    "applicationType": "TR",
                    "systemAlias": "SYSRFCSYSID",
                    "text": "Display Spoolrequests",
                    "url": "https://domain.example.it:44300/sap/bc/gui/sap/its/webgui;?%7etransaction=SP01_SIMPLE&%7enosplash=1&sap-client=910&sap-language=EN"
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": false,
                    "phone": false
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "DYNP_OKCODE": {
                            "required": false,
                            "renameTo": "SSCRFIELDS-UCOMM",
                            "defaultValue": {
                                "value": "ONLI"
                            }
                        },
                        "JobCount": {
                            "required": true,
                            "renameTo": "JOBCOUNT"
                        },
                        "JobName": {
                            "required": true,
                            "renameTo": "JOBNAME"
                        }
                    }
                },
                "tileResolutionResult": {
                    "title": "Display Spoolrequests",
                    "tileComponentLoadInfo": "#Shell-staticTile",
                    "isCustomTile": false
                }
            },
            expectedUrl: "https://test.example.corp.com:44355/sap/bc/gui/sap/its/webgui;~sysid=UR7;~loginGroup=PUBLIC;~messageServer=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=8?%7etransaction=*SP01_SIMPLE%20JOBCOUNT%3dpYRJlwlG%3bJOBNAME%3dFA163E2CC4811ED6BCD8CCCFB7A47242%3bSSCRFIELDS-UCOMM%3dONLI&%7enosplash=1&sap-client=120&sap-language=en"
        },
        {
            // see BCP: 466862 / 2017 .
            testDescription: "URI with sap-system",
            intent: "NZPayroll-display?sap-system=NW", // sap-system is not applied to URIs
            inbound: oTestHelper.createInbound("#NZPayroll-display{<no params><+>}",
                {
                    "additionalInformation": "",
                    "applicationType": "URL",
                    "ui5ComponentName": "",
                    "url": "sap-nwbc://https://some-pt.it.something.net/nwbc/~roletest/ABCDEFGHIL_NWBC_NZ_PAYROLL_MGR",
                    "systemAlias": ""
                }
            ),
            expectedUrl: "sap-nwbc://https://some-pt.it.something.net/nwbc/~roletest/ABCDEFGHIL_NWBC_NZ_PAYROLL_MGR"
        },
        {
            // see BCP: 466862 / 2017 .
            testDescription: "URI without sap-system",
            intent: "NZPayroll-display",
            inbound: oTestHelper.createInbound("#NZPayroll-display{<no params><+>}",
                {
                    "additionalInformation": "",
                    "applicationType": "URL",
                    "ui5ComponentName": "",
                    "url": "sap-nwbc://https://some-pt.it.something.net/nwbc/~roletest/ABCDEFGHIL_NWBC_NZ_PAYROLL_MGR",
                    "systemAlias": ""
                }
            ),
            expectedUrl: "sap-nwbc://https://some-pt.it.something.net/nwbc/~roletest/ABCDEFGHIL_NWBC_NZ_PAYROLL_MGR"
        },
        {
            testDescription: "UI5 with absent URL",
            intent: "Action-toui5absenturl",
            "inbound": oTestHelper.createInbound("#Action-toui5absenturl{<no params><+>}", {
                    "applicationType": "SAPUI5",
                    "additionalInformation": "",
                    "text": "UI5 App Without URL",
                    // NOTE: "url" is absent
                    "systemAlias": ""
                }),
            "expectedResolve": false,
            "expectedRejectError": "Cannot resolve intent: url was not specified in matched inbound"
        },
        {
            "testDescription": "UI5 with empty URL",
            "intent": "Action-toui5nourl",
            "inbound": oTestHelper.createInbound("#Action-toui5nourl{<no params><+>}", {
                "applicationType": "SAPUI5",
                "additionalInformation": "",
                "text": "UI5 App Without URL",
                "url": "", // NOTE: empty URL
                "systemAlias": ""
            }),
            "expectedResolve": true,
            "expectedUrl": ""
        },
        {
            "testDescription": "UI5 with undefined URL",
            "intent": "Action-toui5nourl",
            "inbound": oTestHelper.createInbound("#Action-toui5nourl{<no params><+>}",{
                "applicationType": "SAPUI5",
                "additionalInformation": "",
                "text": "UI5 App Without URL",
                "url": undefined,
                "systemAlias": "",
                "applicationDependencies": {
                    "manifestUrl": "/some/url" // NOTE: url specified here
                }
            }),
            "expectedResolve": true,
            "expectedUrl": ""
        },
        {
            "testDescription": "UI5 with no URL and manifestUrl specified in applicationDependencies",
            "intent": "Action-toui5nourl",
            "inbound": oTestHelper.createInbound("#Action-toui5nourl{<no params><+>}",{
                "applicationType": "SAPUI5",
                "additionalInformation": "",
                "text": "UI5 App Without URL",
                "systemAlias": "",
                "applicationDependencies": {
                    "manifestUrl": "/some/url"
                }
            }),
            "expectedResolve": true,
            "expectedUrl": ""
        },
        {
            "testDescription": "UI5 with both URL and manifestUrl specified in applicationDependencies",
            "intent": "Action-toui5nourl",
            "inbound": oTestHelper.createInbound("#Action-toui5nourl{<no params><+>}",{
                "applicationType": "SAPUI5",
                "additionalInformation": "",
                "text": "UI5 App Without URL",
                "url": "/some/url/1",
                "systemAlias": "",
                "applicationDependencies": {
                    "manifestUrl": "/some/url2"
                }
            }),
            "expectedResolve": true,
            "expectedUrl": "/some/url/1" // URL is not empty
        },
        {
            "testDescription": "Transaction SU01 via designer",
            "intent": "Action-case1",
            "inbound": oTestHelper.createInbound("#Action-case1{[undefined:]<+>}",{
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "SU01",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via designer with 'sap', '~', and neutral default parameters",
            "intent": "Action-case2",
            "inbound": oTestHelper.createInbound("#Action-case2{[sap-theme:[sap_hcb]],[~PARAM:[tilde]],[NeutralParam:[neutral]]<+>}",{
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "SU01",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20NEUTRALPARAM%3dneutral&%7enosplash=1&sap-client=120&sap-language=EN&sap-theme=sap_hcb&%7ePARAM=tilde"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST",
            "intent": "Action-case3",
            "inbound": oTestHelper.createInbound("#Action-case3{[undefined:]<+>}",{
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "User Maintenance WebGUI",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + batch input",
            "intent": "Action-case4",
            "inbound": oTestHelper.createInbound("#Action-case4{[undefined:]<+>}",{
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test4",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + batch input + parameter mappings",
            "intent": "Action-case5",
            "inbound": {
                "semanticObject": "Action",
                "action": "case5",
                "id": "Action-case5~6Nm",
                "title": "Test5",
                "resolutionResult": {
                    "applicationType": "TR",
                    "additionalInformation": "",
                    "text": "Test5",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "pfrom": {
                            "defaultValue": {
                                "value": "pfrom_value",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "tildefrom": {
                            "defaultValue": {
                                "value": "tildefrom_value",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "sap-from": {
                            "defaultValue": {
                                "value": "sapfrom_value",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "PFROM1": {
                            "renameTo": "SAP-THEME"
                        },
                        "SAP-FROM": {
                            "renameTo": "SAP-TO"
                        },
                        "TILDEFROM": {
                            "renameTo": "~TILDETO"
                        }
                    }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20PFROM%3dpfrom_value%3bTILDEFROM%3dtildefrom_value&%7enosplash=1&sap-client=120&sap-from=sapfrom_value&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 direct with defaulted DYNP_OKCODE and parameters : with OKCODE",
            "intent": "Action-case5?p1=ABC",
            "inbound": oTestHelper.createInbound("#Action-case5{DYNP_OKCODE:[STARTME]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test5",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20DYNP_OKCODE%3dSTARTME%3bP1%3dABC&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 direct with required DYNP_NO1ST parameter (but default value)",
            "intent": "Action-case5",
            "inbound": oTestHelper.createInbound("#Action-case5{DYNP_NO1ST:[1]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test5",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20DYNP_NO1ST%3d1&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 with default DYNP_NO1ST parameter only",
            "intent": "Action-case5",
            "inbound": oTestHelper.createInbound("#Action-case5{[DYNP_NO1ST:[1]]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test5",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 direct with defaulted DYNP_OKCODE and DYNP_NO1ST parameters : with OKCODE",
            "intent": "Action-case5?p1=ABC",
            "inbound": oTestHelper.createInbound("#Action-case5{DYNP_OKCODE:[STARTME],[DYNP_NO1ST:[SKIPPMEDURINGBACK]]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test5",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20DYNP_NO1ST%3dSKIPPMEDURINGBACK%3bDYNP_OKCODE%3dSTARTME%3bP1%3dABC&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 direct with defaulted DYNP_OKCODE but no parameters: no OKCODE",
            "intent": "Action-case5",
            "inbound": oTestHelper.createInbound("#Action-case5{[DYNP_OKCODE:[STARTME]]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test5",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 direct with defaulted DYNP_OKCODE and DYNP_NO1ST but no parameters: no OKCODE",
            "intent": "Action-case5",
            "inbound": oTestHelper.createInbound("#Action-case5{[DYNP_OKCODE:[STARTME]],[DYNP_NO1ST:[SKIP_ME]]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test5",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 direct with defaulted DYNP_NO1ST but no parameters: no OKCODE",
            "intent": "Action-case5",
            "inbound": oTestHelper.createInbound("#Action-case5{[DYNP_OKCODE:[STARTME]],[DYNP_NO1ST:[SKIP_ME]]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test5",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 direct with defaulted DYNP_NO1ST but no parameters: no OKCODE, wrapped case",
            "intent": "Action-case5",
            "inbound": oTestHelper.createInbound("#Action-case5{[DYNP_OKCODE:[STARTME]]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test5",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dD%25N%3bP_OBJECT%3d%3bP_OKCODE%3dO%3fK%25A%2fI%3bP_PRGRAM%3dPROGRAM%7e1%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dD%25N%3bP_OBJECT%3dDYNP_OKCODE%2521STARTME%3bP_OKCODE%3dO%3fK%25A%2fI%3bP_PRGRAM%3dPROGRAM%7e1%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 direct with defaulted DYNP_OKCODE but no parameters (only sap- parameters): no OKCODE",
            "intent": "Action-case5",
            "inbound": oTestHelper.createInbound("#Action-case5{[sap-from:[sapfrom_value]],[DYNP_OKCODE:[STARTME]]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test5",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-from=sapfrom_value&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 direct with defaulted DYNP_OKCODE but required : with OKCODE",
            "intent": "Action-case5",
            "inbound": oTestHelper.createInbound("#Action-case5{DYNP_OKCODE:[STARTME]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test5",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20DYNP_OKCODE%3dSTARTME&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 direct with supplied Dynp_OkCode but no parameters: no OKCODE",
            "intent": "Action-case5?Dynp_OkCode=GO1234",
            "inbound": oTestHelper.createInbound("#Action-case5{<no params><+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test5",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 direct with supplied Dynp_OkCode but and parameters: with OKCODE",
            "intent": "Action-case5?Dynp_OkCode=GO1234&ABC=DEF",
            "inbound": oTestHelper.createInbound("#Action-case5{<no params><+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test5",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20ABC%3dDEF%3bDYNP_OKCODE%3dGO1234&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + batch input + parameter mappings + Not completed by COMMIT",
            "intent": "Action-case6",
            "inbound": {
                "semanticObject": "Action",
                "action": "case6",
                "id": "Action-case6~6Nn",
                "title": "Test6",
                "resolutionResult": {
                    "applicationType": "TR",
                    "additionalInformation": "",
                    "text": "Test6",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dD%25N%3bP_OBJECT%3d%3bP_OKCODE%3dO%3fK%25A%2fI%3bP_PRGRAM%3dPROGRAM%7e1%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "pfrom": {
                            "defaultValue": {
                                "value": "pfrom_value",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "tildefrom": {
                            "defaultValue": {
                                "value": "tildefrom_value",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "sap-from": {
                            "defaultValue": {
                                "value": "sapfrom_value",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "PFROM1": {
                            "renameTo": "SAP-THEME"
                        },
                        "SAP-FROM": {
                            "renameTo": "SAP-TO"
                        },
                        "TILDEFROM": {
                            "renameTo": "~TILDETO"
                        }
                    }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dD%25N%3bP_OBJECT%3dpfrom%2521pfrom_value%2525sap-from%2521sapfrom_value%2525tildefrom%2521tildefrom_value%3bP_OKCODE%3dO%3fK%25A%2fI%3bP_PRGRAM%3dPROGRAM%7e1%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via Designer + sap-parameter called with intent sap-parameter with different value.",
            "intent": "Action-case7?sap-parameter=valueB",
            "inbound": oTestHelper.createInbound("#Action-case7{[sap-parameter:[valueA]]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Case 7",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-parameter=valueB"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + sap- forced parameter in LPD_CUST",
            "intent": "Action-case8",
            "inbound": oTestHelper.createInbound("#Action-case8{[undefined:]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test8",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01%20%3d&%7enosplash=1&sap-theme=sap_gemstone&sap-fiori=1&%7eWEBGUI_ICON_TOOLBAR=0&sap-personas-runmode=0&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&%7eWEBGUI_ICON_TOOLBAR=0&sap-client=120&sap-fiori=1&sap-language=EN&sap-personas-runmode=0&sap-theme=sap_gemstone"
        },
        {
            "testDescription": "Transaction SU01 via Designer + forbidden parameters",
            "intent": "Action-case8b",
            "inbound": oTestHelper.createInbound("#Action-case8b{[sap-Wd-run-SC:[1]],[sap-wd-auTo-detect:[1]],[sap-EP-version:[1.32]],[sap-theme:[sap_hcc]]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Case 8b native url",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-theme=sap_hcc"
        },
        {
            "testDescription": "WebGui transaction via full url generation (sap.gui in resolution result)",
            oKnownSapSystemData: {
                SYSRFCSYSID: O_KNOWN_SYSTEM_ALIASES.SYS_RFC_SYSID
            },
            "intent": "Action-case10",
            "inbound": oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
                "applicationType": "TR",
                "sap.gui": {
                    "transaction": "SU01"
                },
                "text": "Test 10",
                "systemAlias": "SYSRFCSYSID"
            }),
            "expectedUrl":
                "https://test.example.corp.com:44355/sap/bc/gui/sap/its/webgui;~sysid=UR7;~loginGroup=PUBLIC;~messageServer=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=8?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=en"
        },
        {
            "testDescription": "WDA transaction via full url generation",
            "intent": "Action-case10",
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            "inbound": oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
                "applicationType": "WDA",
                "sap.wda": {
                    "applicationId": "WDAONE"
                },
                "text": "Test 10",
                "systemAlias": "UR3CLNT120"
            }),
            "expectedUrl": "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDAONE/?sap-client=120&sap-language=en"
        },
        {
            "testDescription": "WDA Compatibility mode true - generate wrapped NWBC url",
            "intent": "Action-case10",
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            "inbound": oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
                "applicationType": "WDA",
                "sap.wda": {
                    "applicationId": "WDAONE",
                    "compatibilityMode": true
                },
                "text": "Test 10",
                "systemAlias": "UR3CLNT120"
            }),
            "expectedUrl": "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDAONE/?sap-client=120&sap-language=en"
        },
        {
            "testDescription": "WDA Compatibility mode false - generate standalone WDA url ",
            "intent": "Action-case10",
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            "inbound": oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
                "applicationType": "WDA",
                "sap.wda": {
                    "applicationId": "WDAONE",
                    "compatibilityMode": false
                },
                "text": "Test 10",
                "systemAlias": "UR3CLNT120"
            }),
            "expectedUrl": "https://example.corp.com:44355/sap/bc/webdynpro/sap/WDAONE?sap-client=120&sap-language=en"
        },
        {
            "testDescription": "WDA Compatibility mode undefined - generate wrapped NWBC url",
            "intent": "Action-case10",
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            "inbound": oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
                "applicationType": "WDA",
                "sap.wda": {
                    "applicationId": "WDAONE"
                },
                "text": "Test 10",
                "systemAlias": "UR3CLNT120"
            }),
            "expectedUrl": "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDAONE/?sap-client=120&sap-language=en"
        },
        {
            "testDescription": "WDA Compatibility mode false with custom namespace  - generate standalone WDA url",
            "intent": "Action-case10",
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            "inbound": oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
                "applicationType": "WDA",
                "sap.wda": {
                    "applicationId": "/ui2/WDAONE",
                    "compatibilityMode": false
                },
                "text": "Test 10",
                "systemAlias": "UR3CLNT120"
            }),
            "expectedUrl": "https://example.corp.com:44355/sap/bc/webdynpro/ui2/WDAONE?sap-client=120&sap-language=en"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + forbidden parameters",
            "intent": "Action-case10",
            "inbound": oTestHelper.createInbound("#Action-case10{[undefined:]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test 10",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01%20%3d&%7enosplash=1&sap-theme=sap_hcd&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-theme=sap_hcd"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + batch input + Not Completed by commit",
            "intent": "Action-case11",
            "inbound": oTestHelper.createInbound("#Action-case11{[undefined:]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test11",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d137%3bP_OBJECT%3d%3bP_OKCODE%3dOK%7e1%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d137%3bP_OBJECT%3d%3bP_OKCODE%3dOK%7e1%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + sap- forced parameter in LPD_CUST + Batch input + Not completed by commit",
            "intent": "Action-case12",
            "inbound": oTestHelper.createInbound("#Action-case12{[undefined:]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test12",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d012%3bP_OBJECT%3d%2525sap-theme%2521sap_gemstone%2525sap-fiori%25211%2525%257eWEBGUI_ICON_TOOLBAR%25210%2525sap-personas-runmode%25210%3bP_OKCODE%3dOKCODY%21%3bP_PRGRAM%3dTHEPROGRAM%21%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d012%3bP_OBJECT%3d%2525sap-theme%2521sap_gemstone%2525sap-fiori%25211%2525%257eWEBGUI_ICON_TOOLBAR%25210%2525sap-personas-runmode%25210%3bP_OKCODE%3dOKCODY%21%3bP_PRGRAM%3dTHEPROGRAM%21%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + forbidden parameters + Batch input + Not completed by commit",
            "intent": "Action-case13",
            "inbound": oTestHelper.createInbound("#Action-case13{[undefined:]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Test 13",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dDYN%3bP_OBJECT%3d%2525sap-Wd-run-SC%25211%2525sap-wd-auTo-detect%25211%2525sap-EP-version%25211.32%2525sap-theme%2521sap_hcd%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dDYN%3bP_OBJECT%3d%2525sap-Wd-run-SC%25211%2525sap-wd-auTo-detect%25211%2525sap-EP-version%25211.32%2525sap-theme%2521sap_hcd%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 with many transaction parameters",
            "intent": "Action-case16?param1=1234567890&param2=1234567890&param3=1234567890&param4=1234567890&param5=1234567890&param6=1234567890&param7=1234567890&param8=1234567890&param9=1234567890&param10=123456790&param11=1234567890&param12=1234567890&param13=1234567890&param14=1234567890&param15=1234567890&param16=1234567890&param17=1234567890&param18=1234567890&param19=1234567890&param20=123456790&param21=1234567890&param22=1234567890&param23=1234567890&param24=1234567890&param25=1234567890&param26=1234567890&param27=1234567890&param28=1234567890&param29=1234567890&param30=123456790",
            "inbound": oTestHelper.createInbound("#Action-case16{<no params><+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "DisplayWebguiLongParams",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d137%3bP_OBJECT%3d%3bP_OKCODE%3dOK%7e1%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dZSAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": "",
                "sap.ui": {
                    "technology": "GUI"
                }
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d137%3bP_OBJ1%3d0%2525param15%25211234567890%2525param16%25211234567890%2525param17%25211234567890%2525param18%25211234567890%2525param19%25211234567890%2525param2%25211234%3bP_OBJ2%3d567890%2525param20%2521123456790%2525param21%25211234567890%2525param22%25211234567890%2525param23%25211234567890%2525param24%25211234567890%2525param25%252%3bP_OBJ3%3d11234567890%2525param26%25211234567890%2525param27%25211234567890%2525param28%25211234567890%2525param29%25211234567890%2525param3%25211234567890%2525para%3bP_OBJ4%3dm30%2521123456790%2525param4%25211234567890%2525param5%25211234567890%2525param6%25211234567890%2525param7%25211234567890%2525param8%25211234567890%2525para%3bP_OBJ5%3dm9%25211234567890%3bP_OBJECT%3dparam1%25211234567890%2525param10%2521123456790%2525param11%25211234567890%2525param12%25211234567890%2525param13%25211234567890%2525param14%2521123456789%3bP_OKCODE%3dOK%7e1%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dZSAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction *SU01 via designer (note 'star' in transaction)",
            "intent": "Action-case14",
            "inbound": oTestHelper.createInbound("#Action-case14{[undefined:]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "*SU01",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction *SU01 via designer (note 'star' in transaction) + parameter",
            "intent": "Action-case15",
            "inbound": oTestHelper.createInbound("#Action-case15{[Param1:[Value1]]<+>}", {
                "applicationType": "TR",
                "additionalInformation": "",
                "text": "Case15",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=**SU01%20PARAM1%3dValue1&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "renameTo with additionalParameters = 'ignored'",
            "intent": "SO-action?P1=V1",
            "inbound": {
                "title": "Currency manager",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=Currency.Component",
                    "applicationType": "SAPUI5",
                    "text": "Currency manager (ignored)", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/url/to/currency",
                    "sap.platform.runtime" : { "everything" : "propagated" }
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": {
                            "renameTo": "P2"
                        }
                    }
                },
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            },
            "oOldAppStateData": {
            },
            "expectedResolutionResult" : {
                  "sap.platform.runtime" : { "everything" : "propagated" },
                  "additionalInformation": "SAPUI5.Component=Currency.Component",
                  "applicationType": "SAPUI5",
                  "sap-system": undefined,
                  "text": "Currency manager",
                  "ui5ComponentName": "Currency.Component",
                  "url": "/url/to/currency?P2=V1",
                  "reservedParameters": {},
                  "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            },
            "expectedAppStateData": {},
            "expectedUrl": "/url/to/currency?P2=V1"
        },
        {
            "testDescription": "additionalParameters = 'ignored' applies to selection variants stored in an x-app-state",
            "intent": "SO-action?P1=v1&sap-xapp-state=ASOLD",
            "inbound": oTestHelper.createInbound("#SO-action{P1:<o>}", {
                "additionalInformation": "SAPUI5.Component=Currency.Component",
                "applicationType": "SAPUI5",
                "text": "Currency manager (ignored)",
                "ui5ComponentName": "Currency.Component",
                "url": "/url/to/currency",
                "sap.platform.runtime": {
                    "everything": "propagated"
                }
            }, {
                "title": "Currency manager",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }),
            "oOldAppStateData": {
                "selectionVariant" : {
                    "ODataFilterExpression" : "",
                    "Parameters": [
                        {
                            "PropertyName": "P2",
                            "PropertyValue": "P2Value"
                        }
                    ],
                    "SelectOptions" : [],
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    }
                }
            },
            "expectedResolutionResult" : {
                  "sap.platform.runtime" : { "everything" : "propagated" },
                  "additionalInformation": "SAPUI5.Component=Currency.Component",
                  "applicationType": "SAPUI5",
                  "sap-system": undefined,
                  "text": "Currency manager",
                  "ui5ComponentName": "Currency.Component",
                  "url": "/url/to/currency?P1=v1&sap-xapp-state=ASNEW",
                  "reservedParameters": {},
                  "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            },
            "expectedAppStateData": {
                "selectionVariant" : {
                    "ODataFilterExpression" : "",
                    "Parameters": [
                        // P2 is deleted because additionalParameters = 'ignored'
                    ],
                    "SelectOptions" : [],
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    }
                }
            },
            "expectedUrl": "/url/to/currency?P1=v1&sap-xapp-state=ASNEW"
        },
        {
            "testDescription": "resolution result, extended User Defaults, mapping of parameter names",
            // ignore certain fields not needed for the test
            UserDefaultParameters: {
                Pref1: generateDefault("P1refSimple", generateEqExtendedDefault("P1ExtVal")),
                P2: generateDefault("P2Def", generateEqExtendedDefault("P2ExtVal"))
            },
            "intent": "SO-action?P1=a&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=Currency.Component",
                    "applicationType": "SAPUI5",
                    "text": "Currency manager (ignored )", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/url/to/currency",
                    "sap.platform.runtime": { "everything": "propagated" }
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": { "renameTo": "P1New", "defaultValue": { value: "UserDefault.extended.Pref1", format: "reference" } },
                        "P2": { "renameTo": "P2New", "defaultValue": { value: "UserDefault.extended.Pref1", format: "reference" } },
                        "P3": { "renameTo": "P3New", "defaultValue": { value: "UserDefault.extended.Pref1", format: "reference" } },
                        "P4": { "renameTo": "P4New", "defaultValue": { value: "UserDefault.Pref1", format: "reference" } },
                        "P5": { "renameTo": "P5New", "defaultValue": { value: "UserDefault.Pref5", format: "reference" } }
                    }
                },
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            },
            "oOldAppStateData": {
                "selectionVariant": {
                    "ODataFilterExpression": "",
                    "Parameters": [{"PropertyName": "P2", "PropertyValue": "P2Value"}],
                    "SelectOptions": [],
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    }
                }
            },
            "expectedResolutionResult": {
                  "sap.platform.runtime": { "everything": "propagated" },
                  "additionalInformation": "SAPUI5.Component=Currency.Component",
                  "applicationType": "SAPUI5",
                  "sap-system": undefined,
                  "text": "Currency manager (this one)",
                  "ui5ComponentName": "Currency.Component",
                  "url": "/url/to/currency?P1New=a&P4New=P1refSimple&sap-ushell-defaultedParameterNames=%5B%22P3New%22%2C%22P4New%22%5D&sap-xapp-state=ASNEW",
                  "reservedParameters": {},
                  "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            },
            "expectedAppStateData": {
                "selectionVariant": {
                    "ODataFilterExpression": "",
                    "Parameters": [{
                        "PropertyName": "P2New",
                        "PropertyValue": "P2Value"
                    }],
                    "SelectOptions": [{
                        "PropertyName": "P3New",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }, {
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1refSimple",
                            "High": null
                        }]
                    }],
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    }
                }
            },
            "expectedUrl": "/url/to/currency?P1New=a&P4New=P1refSimple&sap-ushell-defaultedParameterNames=%5B%22P3New%22%2C%22P4New%22%5D&sap-xapp-state=ASNEW"
        },
        {
            "testDescription": "P5 in appstate does not prevent transitivie non-substitution of dominated primitive Parameters (P5 is substituted although present in appstate!)!",
            // ignore certain fields not needed for the test
            UserDefaultParameters: {
                Pref1: generateDefault("P1refSimple", generateEqExtendedDefault("P1ExtVal")),
                Pref5: generateDefault("Pref5Def", generateEqExtendedDefault("P2ExtVal"))
            },
            "intent": "SO-action?sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=Currency.Component",
                    "applicationType": "SAPUI5",
                    "text": "Currency manager (ignored )", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/url/to/currency"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": { "renameTo": "P1New", "defaultValue": { "value": "UserDefault.Pref1", "format": "reference" } },
                        "P2": { "renameTo": "P1New", "defaultValue": { "value": "UserDefault.extended.Pref1", "format": "reference" } },
                        "P3": { "renameTo": "P1New", "defaultValue": { "value": "UserDefault.extended.Pref1", "format": "reference" } },
                        "P5": { "renameTo": "P1New", "defaultValue": { "value": "UserDefault.Pref5", "format": "reference" } }
                    }
                },
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            },
            "oOldAppStateData": {
                "selectionVariant": {
                    "Parameters": [{ "PropertyName": "P5", "PropertyValue": "P5Value" }]
                }
            },
            "expectedAppStateData": {
                "selectionVariant": {
                    "ODataFilterExpression": "",
                    "Parameters": [{ "PropertyName": "P1New", "PropertyValue": "P5Value" }],
                    "SelectionVariantID": "",
                    "SelectOptions": [],
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    }
                }
            },
            "expectedUrl": "/url/to/currency?P1New=P1refSimple&sap-ushell-defaultedParameterNames=%5B%22P1New%22%5D&sap-xapp-state=ASNEW",
            "expectedErrorCalls": [
                [
                    "collision of values during parameter mapping : \"P5\" -> \"P1New\""
                ],
                [
                    "renaming of defaultedParamNames creates duplicatesP5->P1New"
                ]
            ]
        },
        {
            testDescription: "P5 in appstate does not prevent transitive non-substitution of dominated primitive Parameters (P5 is substituted although present in appstate) Note also that for primitive first one is chosen, for complex 2nd one?",
            // ignore certain fields not needed for the test
            UserDefaultParameters: {
                Pref1: generateDefault("P1refSimple", generateEqExtendedDefault("P1ExtVal")),
                Pref5: generateDefault("Pref5Def", generateEqExtendedDefault("P5ExtVal"))
            },
            "intent": "SO-action?sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=Currency.Component",
                    "applicationType": "SAPUI5",
                    "text": "Currency manager (ignored )", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/url/to/currency"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": { "renameTo": "P1New", "defaultValue": { value: "UserDefault.Pref1", format: "reference" } },
                        "P2": { "renameTo": "P2New", "defaultValue": { value: "UserDefault.extended.Pref1", format: "reference" } },
                        "P3": { "renameTo": "P2New", "defaultValue": { value: "UserDefault.extended.Pref5", format: "reference" } },
                        "P5": { "renameTo": "P1New", "defaultValue": { value: "UserDefault.Pref5", format: "reference" } }
                    }
                },
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    Parameters: [{ "PropertyName": "P1New", "PropertyValue": "P5Value" }],
                    SelectOptions: [{
                        "PropertyName": "P2New",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }, {
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1refSimple",
                            "High": null
                        }]
                    }],
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    }
                }
            },
            expectedUrl: "/url/to/currency?P1New=P1refSimple&sap-ushell-defaultedParameterNames=%5B%22P1New%22%2C%22P2New%22%5D&sap-xapp-state=ASNEW"
        },
        {
            testDescription: "url compactation in WDA case with appstate and transient test",
            // ignore certain fields not needed for the test
            UserDefaultParameters: {
                Pref1: generateDefault(genStr("ABCD", 2049), generateEqExtendedDefault("P1ExtVal")),
                Pref2: generateDefault("Pref5Def")
            },
            "intent": "SO-action?AAA=1234&AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "WDA",
                    "text": "Currency manager (ignored text)",
                    "ui5ComponentName": "Currency.Component",
                    "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            "defaultValue": {
                                "value": "UserDefault.Pref1",
                                "format": "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            "defaultValue": {
                                "value": "UserDefault.extended.Pref2",
                                "format": "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            "defaultValue": {
                                "value": "UserDefault.extended.Pref2",
                                "format": "reference"
                            }
                        },
                        "ZSOME": {
                            "renameTo": "ZZome",
                            "defaultValue": {
                                "value": "UserDefault.Pref2",
                                "format": "reference"
                            }
                        }
                    }
                },
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "BUKR",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }, {
                        "PropertyName": "KORK",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }]
                }
            },
            expectedAppStateData2: ("BUKR=" + genStr("ABCD", 2049) + "&ZZZ=444&ZZome=Pref5Def"),
            expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&AAA=1234&AAAA=4321&sap-intent-param=ASNEW2&sap-ushell-defaultedParameterNames=%5B%22BUKR%22%2C%22KORK%22%2C%22ZZome%22%5D&sap-xapp-state=ASNEW",
            expectedTransientCompaction: true
        },
        {
            testDescription: "assure long renames paramter names via renameTo are compacted WDA case with appstate",
            // ignore certain fields not needed for the test
            UserDefaultParameters: {
                Pref1: generateDefault("Pref1", generateEqExtendedDefault("P1ExtVal")),
                Pref2: generateDefault("Pref5Def")
            },
            "intent": "SO-action?AAA=1234&AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "WDA",
                    "text": "Currency manager (ignored text)", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.Pref1",
                                format: "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "ZSOME": {
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        },
                        "AAA": {
                            "renameTo": genStr("XUXU", 2044),
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        }
                    }
                },
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "BUKR",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }, {
                        "PropertyName": "KORK",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }]
                }
            },
            expectedAppStateData2: (genStr("XUXU", 2044) + "=1234&ZSOME=Pref5Def&ZZZ=444"),
            expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&AAAA=4321&BUKR=Pref1&sap-intent-param=ASNEW2&sap-ushell-defaultedParameterNames=%5B%22BUKR%22%2C%22KORK%22%2C%22ZSOME%22%5D&sap-xapp-state=ASNEW"
        },
        {
            testDescription: "assure sap-ushell-defaulted-parameter names can be compacted (very long parameter name) url compactation in WDA case with appstate",
            // ignore certain fields not needed for the test
            UserDefaultParameters: {
                Pref1: generateDefault("P1Def", generateEqExtendedDefault("P1ExtVal")),
                Pref2: generateDefault("Pref5Def")
            },
            "intent": "SO-action?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "WDA",
                    "text": "Currency manager (ignored text)", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.Pref1",
                                format: "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "ZSOME": {
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        },
                        "AAA": {
                            "renameTo": genStr("XIXI", 2044),
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        }
                    }
                },
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "BUKR",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }, {
                        "PropertyName": "KORK",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }]
                }
            },
            expectedAppStateData2: ("AAAA=4321&BUKR=P1Def" +
                    "&" + genStr("XIXI", 2044) + "=Pref5Def&ZSOME=Pref5Def&ZZZ=444") +
                "&sap-ushell-defaultedParameterNames=" + encodeURIComponent(JSON.stringify([
                    "BUKR",
                    "KORK",
                    genStr("XIXI", 2044),
                    "ZSOME"
                ])),
            expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&sap-intent-param=ASNEW2&sap-xapp-state=ASNEW"
        },
        {
            testDescription: "no extended user default value can be found (parameter should not appear in sap-ushell-defaultedParameterNames",
            // ignore certain fields not needed for the test
            UserDefaultParameters: {
                Pref1: generateDefault()
            },
            "intent": "SO-action?sap-xapp-state=ASOLD",
            "inbound": oTestHelper.createInbound("#SO-action{[CostCenter:[@UserDefault.extended.Pref1@]]<+>}", {
                "additionalInformation": "",
                "applicationType": "WDA",
                "text": "Currency manager (ignored text)",
                "ui5ComponentName": "Currency.Component",
                "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
            }, {
                "title": "Currency manager (this one)",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }),
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&sap-xapp-state=ASOLD"
        },
        {
            testDescription: "extended user default is merged",
            // ignore certain fields not needed for the test
            UserDefaultParameters: {
                Pref1: generateDefault("P1")
            },
            "intent": "SO-action?sap-xapp-state=ASOLD",
            "inbound": oTestHelper.createInbound("#SO-action{[CostCenter:[@UserDefault.extended.Pref1@]]<+>}", {
                "additionalInformation": "",
                "applicationType": "WDA",
                "text": "Currency manager (ignored text)",
                "ui5ComponentName": "Currency.Component",
                "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
            }, {
                "title": "Currency manager (this one)",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }),
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "CostCenter",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1",
                            "High": null
                        }]
                    }]
                }
            },
            expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&sap-ushell-defaultedParameterNames=%5B%22CostCenter%22%5D&sap-xapp-state=ASNEW"
        },
        {
            testDescription: "TR url without wrapped transaction is provided - no parameters compaction, no sap-ushell-defaultedParameterNames",
            // ignore certain fields not needed for the test
            UserDefaultParameters: {
                Pref1: generateDefault("P1Def", generateEqExtendedDefault("P1ExtVal")),
                Pref2: generateDefault("Pref5Def")
            },
            "intent": "SO-action?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "TR",
                    "text": "Currency manager (ignored text)", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.Pref1",
                                format: "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "ZSOME": {
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        },
                        "AAA": {
                            "renameTo": genStr("XIXI", 2044),
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        }
                    }
                },
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "BUKR",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }, {
                        "PropertyName": "KORK",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }]
                }
            },
            expectedAppStateData2: undefined,
            expectedUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?" + [
                "sap-client=120",
                "sap-language=EN",
                "AAAA=4321&BUKR=P1Def",
                genStr("XIXI", 2044) + "=Pref5Def&ZSOME=Pref5Def&ZZZ=444",
                "sap-xapp-state=ASNEW"
            ].join("&")
        },
        {
            testDescription: "TR url with wrapped transaction is provided - no parameters compaction, no sap-ushell-defaultedParametersNames",
            // ignore certain fields not needed for the test
            UserDefaultParameters: {
                Pref1: generateDefault("P1Def", generateEqExtendedDefault("P1ExtVal")),
                Pref2: generateDefault("Pref5Def")
            },
            "intent": "SO-action?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "TR",
                    "text": "Currency manager (ignored text)", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "https://uv2.example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/APB_LPD_CALL_B_I_TXN?DYNP_OKCODE=onli&P_APPL=FS2_TEST&P_CTO=EA%20%20X%20X&P_DYNNR=1000&P_OBJECT=&P_OKCODE=OKCODE&P_PRGRAM=FOOS&P_ROLE=FS2SAMAP&P_SELSCR=X&P_TCODE=SU01&sap-client=120&sap-language=EN"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.Pref1",
                                format: "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "ZSOME": {
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        },
                        "AAA": {
                            "renameTo": genStr("XIXI", 2044),
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        }
                    }
                },
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "BUKR",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }, {
                        "PropertyName": "KORK",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }]
                }
            },
            expectedAppStateData2: undefined,
            expectedUrl: "https://uv2.example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/APB_LPD_CALL_B_I_TXN?" + [
                "DYNP_OKCODE=onli",
                "P_APPL=FS2_TEST",
                "P_CTO=EA%20%20X%20X",
                "P_DYNNR=1000",
                // This equals the following, but spread over P_OBJECT, P_OBJx parameters:
                // [
                //     "AAAA%25214321",
                //     "BUKR%2521P1Def",
                //     genStr("XIXI", 2044) + "%2521" + "Pref5Def",
                //     "ZSOME%2521Pref5Def",
                //     "ZZZ%2521444",
                //     "sap-xapp-state%2521ASNEW"
                // ].join("%2525"),
                //
                "P_OBJ1=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ2=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ3=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ4=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ5=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ6=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ7=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ8=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ9=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ10=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ11=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ12=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ13=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ14=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ15=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXI%2521Pref5Def%2525ZSOME%2521Pref5Def%2525ZZZ%2521",
                "P_OBJ16=444%2525sap-xapp-state%2521ASNEW",
                "P_OBJECT=AAAA%25214321%2525BUKR%2521P1Def%2525XIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",

                "P_OKCODE=OKCODE",
                "P_PRGRAM=FOOS",
                "P_ROLE=FS2SAMAP",
                "P_SELSCR=X",
                "P_TCODE=SU01",
                "sap-client=120",
                "sap-language=EN"
            ].join("&")
        },
        { // tests that fallback is used when no resolutionResult section is provided in the inbound.
            testDescription: "no resolutionResult section was provided in the inbound",

            // ignore certain fields not needed for the test
            "intent": "Object-action",
            "inbound": oTestHelper.createInbound("#Object-action{<no params><o>}"),
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedUrl: "fallback :-({}" // url resolved via fallback
        },
        {
            testDescription: "sap-system with multiple errors provided",
            // ignore certain fields not needed for the test
            "intent": "Object-action?sap-system=SYS",
            "inbound": oTestHelper.createInbound("#Object-action{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "TR",
                "text": "Sap System Test",
                "ui5ComponentName": "",
                "url": "https://uv2.example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=&sap-client=120&sap-language=en"
            }, {
                "title": "Sap System Test",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }),
            oKnownSapSystemData: { // Optional fixture parameter
                "SYS": O_KNOWN_SYSTEM_ALIASES.MULTIPLE_INVALID_FIELDS
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedResolve: false,
            expectedRejectError: "Invalid system alias definition",
            expectedErrorCalls: [
                [
                    "Invalid system alias definition: " + JSON.stringify(O_KNOWN_SYSTEM_ALIASES.MULTIPLE_INVALID_FIELDS, null, 3),
                    "ERRORS:\n" + [
                    " - https>host field must be a string",
                    " - https>port field must be a number or a string",
                    " - https>pathPrefix field must be a string",
                    " - http>host field must be a string"
                    ].join("\n"),
                    "sap.ushell.ApplicationType"
                ]
            ]
        },
        {
            testDescription: "sap-system provided as intent parameter resolves to alias with blank http/https data",
            // ignore certain fields not needed for the test
            "intent": "Object-action?sap-system=SYS",
            "inbound": oTestHelper.createInbound("#Object-action{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "TR",
                "text": "Sap System Test",
                "ui5ComponentName": "",
                "url": "https://uv2.example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=&sap-client=120&sap-language=en"
            }),
            oKnownSapSystemData: { // Optional fixture parameter
                "SYS": O_KNOWN_SYSTEM_ALIASES.ONLY_RFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedResolve: false,
            expectedRejectError: "Invalid system alias definition",
            expectedErrorCalls: [
                [
                    "Invalid system alias definition: " + JSON.stringify(O_KNOWN_SYSTEM_ALIASES.ONLY_RFC, null, 3),
                    "ERRORS:\n" +
                    " - at least one of 'http' or 'https' fields must be defined",
                    "sap.ushell.ApplicationType"
                ]
            ]
        },
        {
            testDescription: "sap-system provided as intent parameter",
            // ignore certain fields not needed for the test
            "intent": "Object-action?sap-system=UR3CLNT120",
            "inbound": oTestHelper.createInbound("#Object-action{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "TR",
                "text": "Sap System Test",
                "ui5ComponentName": "",
                "url": "https://uv2.example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=&sap-client=120&sap-language=en"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=&sap-client=120&sap-language=en"
        },
        {
            testDescription: "sap-system provided as intent parameter, WDA url with system alias",
            // ignore certain fields not needed for the test
            "intent": "Object-action?sap-system=U1YCLNT111",
            "inbound": oTestHelper.createInbound("#Object-action{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "WDA",
                "text": "Sap System Test",
                "ui5ComponentName": "",
                "url": "https://u1y.example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_PORTAL_NAV_TARGET/?sap-client=000&sap-language=EN",
                "systemAlias": "UI2_WDA"
            }),
            oKnownSapSystemData: {
                "U1YCLNT111": {
                    https: {
                        id: "U1YCLNT111_HTTPS",
                        host: "u1y.example.corp.com",
                        port: 44355,
                        pathPrefix: "" // use local
                    },
                    id: "U1YCLNT111",
                    client: "111",
                    language: ""
                },
                "UI2_WDA": {
                    http: {
                        id: "UI2_WDA",
                        host: "u1y.example.corp.com",
                        port: 44355,
                        pathPrefix: "" // path from local system!
                    },
                    https: {
                        id: "UI2_WDA",
                        host: "u1y.example.corp.com",
                        port: 44355,
                        pathPrefix: ""
                    },
                    rfc: {
                        id: "",
                        systemId: "",
                        host: "",
                        service: 32,
                        loginGroup: "",
                        sncNameR3: "",
                        sncQoPR3: ""
                    },
                    id: "UI2_WDA",
                    client: "000",
                    language: ""
                }
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedUrl: "https://u1y.example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_PORTAL_NAV_TARGET/?sap-client=111&sap-language=en"
        },
        {
            testDescription: "sap-system provided as intent parameter, WDA url, relative path",
            // ignore certain fields not needed for the test
            "intent": "Object-action?sap-system=UR3CLNT120",
            "inbound": oTestHelper.createInbound("#Object-action{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "WDA",
                "text": "Sap System Test",
                "ui5ComponentName": "",
                "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=en"
        },
        {
            testDescription: "relative app/transaction URL with sap-system=ALIAS111, sap-client and sap-language are provided",
            // ignore certain fields not needed for the test
            "intent": "Object-action?sap-system=ALIAS111",
            "inbound": oTestHelper.createInbound("#Object-action{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "TR",
                "text": "Sap System Test",
                "ui5ComponentName": "",
                "url": "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",
                "systemAlias": "" // important -> local system!
            }),
            oKnownSapSystemData: {
                "": O_KNOWN_SYSTEM_ALIASES.LOCAL_SYSTEM,
                "ALIAS111": O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedUrl: "https://vmw.example.corp.com:44335/go-to/the/moon/~canvas;window=app/transaction/SU01?sap-client=111&sap-language=en"
        },
        {
            testDescription: "GUI Application with system alias having the same path prefix as local system (/sap/bc/)",
                // ignore certain fields not needed for the test
            "intent": "Object-action?sap-system=UR3CLNT120",
            "inbound": oTestHelper.createInbound("#Object-action{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "TR",
                "text": "Sap System Test",
                "ui5ComponentName": "",
                "url": "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",
                "systemAlias": "" // important -> local system!
            }),
            oKnownSapSystemData: {
                "": O_KNOWN_SYSTEM_ALIASES.LOCAL_SYSTEM,
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=en"
        },
        {
            testDescription: "relative app/transaction URL with sap-system=QH3CLNT815 (with empty pathPrefix) parameter provided",
            // ignore certain fields not needed for the test
            "intent": "Object-action?sap-system=UR3CLNT120",
            "inbound": oTestHelper.createInbound("#Object-action{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "TR",
                "text": "Sap System Test",
                "ui5ComponentName": "",
                "url": "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=en"
        },
        {
            testDescription: "Native Wrapped Webgui URL with load balanced sap-system",
            // ignore certain fields not needed for the test
            "intent": "Object-action?sap-system=ALIASRFC",
            "inbound": oTestHelper.createInbound("#Object-action{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "TR",
                "text": "Sap System Test",
                "ui5ComponentName": "",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            oKnownSapSystemData: {
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC_IT
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "TR",
            expectedUrl:
                "https://example.corp.com:44355/sap/bc/gui/sap/its/webgui;" + [
                    "~sysid=UR3",
                    "~loginGroup=SPACE",
                    "~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE",
                    "~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE",
                    "~sncQoPR3=9"
                ].join(";") +
                "?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1" +
                "&sap-client=815" +
                "&sap-language=IT"
        },
        {
            testDescription: "Native Wrapped Webgui URL with load balanced sap-system (but missing parameters in rfc)",
            // ignore certain fields not needed for the test
            "intent": "Object-action?sap-system=ALIASRFC",
            "inbound": oTestHelper.createInbound("#Object-action{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "TR",
                "text": "Sap System Test",
                "ui5ComponentName": "",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                "systemAlias": ""
            }),
            oKnownSapSystemData: {
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.SYS_IT_NO_R3
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "TR",
            expectedUrl:
                "https://example.corp.com:44355/sap/bc/gui/sap/its/webgui;" + [
                    "~sysid=UR3",
                    "~loginGroup=SPACE"
                ].join(";") +
                "?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1" +
                "&sap-client=815" +
                "&sap-language=IT"
        },
        {
            testDescription: "Native Wrapped Webgui URL resolution",
            // ignore certain fields not needed for the test
            UserDefaultParameters: {
                Pref1: generateDefault("P1Def", generateEqExtendedDefault("P1ExtVal")),
                Pref2: generateDefault("Pref5Def")
            },
            "intent": "Action-towrappedwebgui?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "To Wrapped webgui",
                "semanticObject": "Action",
                "action": "towrappedwebgui",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "TR",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.Pref1",
                                format: "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "ZSOME": {
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        },
                        "AAA": {
                            "renameTo": genStr("XIXI", 2044),
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        }
                    }
                }
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "BUKR",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }, {
                        "PropertyName": "KORK",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }]
                }
            },
            expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?" +
                "%7etransaction=*APB_LPD_CALL_B_I_TXN%20" + [
                        "DYNP_OKCODE%3donli",
                        "P_APPL%3dFS2_TEST",
                        "P_CTO%3dEA%20%20X%20X",
                        "P_DYNNR%3d1000",
                        // This equals the following, but spread over P_OBJECT, P_OBJx parameters:
                        // [
                        //     "AAAA%25214321",
                        //     "BUKR%2521P1Def",
                        //     genStr("XIXI", 2044) + "%2521" + "Pref5Def",
                        //     "ZSOME%2521Pref5Def",
                        //     "ZZZ%2521444",
                        //     "sap-xapp-state%2521ASNEW"
                        // ].join("%2525"),
                        //
                        "P_OBJ1%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ2%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ3%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ4%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ5%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ6%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ7%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ8%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ9%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ10%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ11%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ12%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ13%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ14%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ15%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXI%2521Pref5Def%2525ZSOME%2521Pref5Def%2525ZZZ%2521",
                        "P_OBJ16%3d444%2525sap-xapp-state%2521ASNEW",
                        "P_OBJECT%3dAAAA%25214321%2525BUKR%2521P1Def%2525XIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",

                        "P_OKCODE%3dOKCODE",
                        "P_PRGRAM%3dFOOS",
                        "P_ROLE%3dFS2SAMAP",
                        "P_SELSCR%3dX",
                        "P_TCODE%3dSU01"
                ].join("%3b") + "&" + [
                    "%7enosplash=1",
                    "sap-client=120",
                    "sap-language=EN"
                ].join("&")
        },
        {
            testDescription: "Native Non-wrapped Webgui URL resolution",
            // ignore certain fields not needed for the test
            UserDefaultParameters: {
                Pref1: generateDefault("P1Def", generateEqExtendedDefault("P1ExtVal")),
                Pref2: generateDefault("Pref5Def")
            },
            "intent": "Action-tononwrappedwebgui?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "To Non Native Wrapped webgui",
                "semanticObject": "Action",
                "action": "tononwrappedwebgui",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "TR",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.Pref1",
                                format: "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "ZSOME": {
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        },
                        "AAA": {
                            "renameTo": genStr("XIXI", 2044),
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        }
                    }
                }
            },
        oOldAppStateData: {
            selectionVariant: {
                Parameters: [{
                    "PropertyName": "P5",
                    "PropertyValue": "P5Value"
                }]
            }
        },
        expectedApplicationType: "TR",
        expectedAppStateData: {
            selectionVariant: {
                "ODataFilterExpression": "",
                "SelectionVariantID": "",
                "Text": "Selection Variant with ID ",
                "Version": {
                    "Major": "1",
                    "Minor": "0",
                    "Patch": "0"
                },
                Parameters: [{
                    "PropertyName": "P5",
                    "PropertyValue": "P5Value"
                }],
                SelectOptions: [{
                    "PropertyName": "BUKR",
                    "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "Pref5Def",
                        "High": null
                    }]
                }, {
                    "PropertyName": "KORK",
                    "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "Pref5Def",
                        "High": null
                    }]
                }]
            }
        },
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?" +
            "%7etransaction=*SU01%20" + [
                "AAAA%3d4321",
                "BUKR%3dP1Def",
                genStr("XIXI", 2044) + "%3dPref5Def",
                "ZSOME%3dPref5Def",
                "ZZZ%3d444"
            ].join("%3b") + "&" + [
                "%7enosplash=1",
                "sap-client=120",
                "sap-language=EN",
                "sap-xapp-state=ASNEW"
            ].join("&")
        },
        {
            "testDescription": "Long Templated URL",
            "appCapabilitiesNames": {
                attribute: "protocol",
                value: "GUI"
            },
            "intent": "Action-templated?sap-ushell-navmode=inplace&sap-system=UR3CLNT120&p1=" + genStr("XIXI", 2044) + "&/inner/app",
            "inbound": (function (oApplicationSection) {
                return {
                    "title": "templated",
                    "semanticObject": "Action",
                    "action": "templated",
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                    "resolutionResult": {
                        "applicationType": "URL",
                        "navigationMode": "embedded"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            p1: {
                                required: false,
                                "defaultValue": {
                                    value: "v1",
                                    format: "plain"
                                }
                            }
                        }
                    },
                    "templateContext": {
                        "payload": {
                            capabilities: {
                                statefulContainer: {
                                    enabled: true,
                                    protocol: "GUI"
                                }
                            },
                            urlTemplate: "http://www.google.com/{?query,p1,innerAppRoute}",
                            parameters: {
                                names: {
                                    query: "ABC",
                                    innerAppRoute: "{&innerAppRoute:.}"
                                }
                            }
                        },
                        "site": {
                            some: {
                                kind: {
                                    of: {
                                        site: {
                                        },
                                        application: oApplicationSection
                                    }
                                }
                            }
                        },
                        "siteAppSection": oApplicationSection
                    }
                };
            })({ // application section
                destination: "UR5",
                inbound: {
                    semanticObject: "Action",
                    action: "templated"
                }
            }),
            "oOldAppStateData": {},
            "expectedAppStateData": "p1=" + genStr("XIXI", 2044) + "&query=ABC",
            "expectedResolutionResult": {
                "applicationType": "URL",
                "reservedParameters": {},
                "text": "templated",
                "url": "http://www.google.com/?innerAppRoute=%26%2Finner%2Fapp&sap-intent-param=ASNEW",
                "explicitNavMode": true,
                "navigationMode": "embedded",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            "testDescription": "Templated URL",
            "appCapabilitiesNames": {
                attribute: "protocol",
                value: "GUI"
            },
            "intent": "Action-templated?sap-ushell-navmode=inplace&sap-system=UR3CLNT120&/inner/app",
            "inbound": (function (oApplicationSection) {
                return {
                    "title": "templated",
                    "semanticObject": "Action",
                    "action": "templated",
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                    "resolutionResult": {
                        "applicationType": "URL",
                        "navigationMode": "embedded"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            p1: {
                                required: false,
                                "defaultValue": {
                                    value: "v1",
                                    format: "plain"
                                }
                            }
                        }
                    },
                    "templateContext": {
                        "payload": {
                            capabilities: {
                                statefulContainer: {
                                    enabled: true,
                                    protocol: "GUI"
                                }
                            },
                            urlTemplate: "http://www.google.com/{?query,p1,innerAppRoute}",
                            parameters: {
                                names: {
                                    query: "ABC",
                                    innerAppRoute: "{&innerAppRoute:.}"
                                }
                            }
                        },
                        "site": {
                            some: {
                                kind: {
                                    of: {
                                        site: {
                                        },
                                        application: oApplicationSection
                                    }
                                }
                            }
                        },
                        "siteAppSection": oApplicationSection
                    }
                };
            })({ // application section
                destination: "UR5",
                inbound: {
                    semanticObject: "Action",
                    action: "templated"
                }
            }),
            "oOldAppStateData": {},
            "expectedAppStateData": {},
            "expectedResolutionResult": {
                "applicationType": "URL",
                "reservedParameters": {},
                "text": "templated",
                "url": "http://www.google.com/?query=ABC&p1=v1&innerAppRoute=%26%2Finner%2Fapp",
                "explicitNavMode": true,
                "navigationMode": "embedded",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            "testDescription": "CDM 3.0 WDA URL",
           "intent": "Product-wdaSearch?parameterName=parameterValue&sap-ushell-navmode=inplace",
            "inbound": (function (oApplicationSection) {
                return {
                    "title": "templated",
                    "semanticObject": "Product",
                    "action": "wdaSearch",
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                    "resolutionResult": {
                        "applicationType": "URL",
                        "navigationMode": "embedded"
                    },
                    "signature": {
                        "additionalParameters": "allowed",
                        "parameters": {
                            defaultP1: {
                                required: false,
                                renameTo: "defaultP1Renamed",
                                defaultValue: {
                                    value: "v1",
                                    format: "plain"
                                }
                            }
                        }
                    },
                    "templateContext": {
                        "payload": {
                            urlTemplate: "{+_baseUrl}/ui2/nwbc/~canvas;window=app/wda/{wdaAppId}/{?wdConfigId,_defaultParameterNames,_startupParameters*,sapTheme,sapLanguage}",
                            parameters: {
                                names: utils.shallowMergeObject(O_CDM3_TEMPLATE_NOTIONS, {
                                    "wdaAppId": "{./sap.integration/urlTemplateParams/applicationId}",
                                    "wdConfigId": {
                                        "renameTo": "sap-wd-configId",
                                        "value": "{./sap.integration/urlTemplateParams/configId}"
                                    },
                                    "_defaultParameterNamesPrejoin": "{join(\"\\,\") &defaultParameterNames:.}",
                                    "_defaultParameterNamesPostjoin": "{join() '[\"',&_defaultParameterNamesPrejoin,'\"]'}",
                                    "_defaultParameterNames": {
                                        "renameTo": "sap-ushell-defaultedParameterNames",
                                        "value": "{if({&_defaultParameterNamesPrejoin}) &_defaultParameterNamesPostjoin}"
                                    },
                                    "sapTheme": {
                                        "renameTo": "sap-theme",
                                        "value": "{&env:theme}"
                                    },
                                    "sapLanguage": {
                                        "renameTo": "sap-language",
                                        "value": "{&env:logonLanguage}"
                                    }
                                })
                            }
                        },
                        "site": O_CDM3_SAMPLE_SITE,
                        "siteAppSection": oApplicationSection
                    }
                };
            })({ // application section
                "sap.app": {
                    "destination": "legacy_blue_box",
                    "title": "CALL WDA EC Cockpit - Scenario 2",
                    "crossNavigation": {
                        "inbounds": {
                            "AcademicCourse-a5": {
                                "semanticObject": "AcademicCourse",
                                "action": "a5",
                                "signature": {
                                    "parameters": {},
                                    "additionalParameters": "allowed"
                                }
                            }
                        }
                    }
                },
                "sap.integration": {
                    "urlTemplateId": "urltemplate.wda",
                    "urlTemplateParams": {
                        "applicationId": "S_EPM_FPM_PD",
                        "configId": "s_epm_fpm_pd"
                    }
                },
                "sap.flp": {
                    "businessApp": "businessapp.urltemplate-wda",
                    "defaultLauncher": "businessapp.urltemplate-wda#AcademicCourse-a5"
                },
                "sap.ui": {
                    "technology": "URL"
                }
            }),
            "oOldAppStateData": {},
            "expectedAppStateData": {},
            "expectedResolutionResult": {
                "applicationType": "URL",
                "appCapabilities": undefined,
                "reservedParameters": {},
                "text": "templated",
                "url": "https://tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com/sap/bc/ui2/nwbc/~canvas;window=app/wda/S_EPM_FPM_PD/?sap-wd-configId=s_epm_fpm_pd&sap-ushell-defaultedParameterNames=%5B%22defaultP1Renamed%22%5D&defaultP1Renamed=v1&parameterName=parameterValue&sap-theme=sap_belize&sap-language=EN",
                "explicitNavMode": true,
                "navigationMode": "embedded",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            "testDescription": "CDM 3.0 GUI URL",
            "appCapabilitiesNames": {
                attribute: "protocol",
                value: "GUI"
            },
            "intent": "Employee-display?parameterName=parameterValue&sap-ushell-navmode=inplace",
            "inbound": (function (oApplicationSection) {
                return {
                    "title": "templated",
                    "semanticObject": "Employee",
                    "action": "display",
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                    "resolutionResult": {
                        "applicationType": "URL",
                        "navigationMode": "embedded"
                    },
                    "signature": {
                        "additionalParameters": "allowed",
                        "parameters": {
                            "defaultP1": {
                                "required": false,
                                "defaultValue": {
                                    "value": "v1",
                                    "format": "plain"
                                }
                            }
                        }
                    },
                    "templateContext": {
                        "payload": {
                            urlTemplate: "{+_baseUrl}/gui/sap/its/webgui{;connectString,service,sysid,loginGroup,messageServer,sncNameR3,sncQoPR3}?%7etransaction={+skipScreenChar}{+transaction}{transactionParams}&%7enosplash=1{&sapTheme,sapLanguage}",
                            parameters: {
                                names: utils.shallowMergeObject(O_CDM3_TEMPLATE_NOTIONS, {
                                    "sysid": {
                                        "renameTo": "~sysid",
                                        "value": "{and _destIsLoadBalancing,/systemAliases/{&_destName}/rfc/systemId}"
                                    },
                                    "loginGroup": {
                                        "renameTo": "~loginGroup",
                                        "value": "{and _destIsLoadBalancing,/systemAliases/{&_destName}/rfc/loginGroup}"
                                    },
                                    "messageServer": {
                                        "renameTo": "~messageServer",
                                        "value": "{and _destIsLoadBalancing,/systemAliases/{&_destName}/rfc/sncNameR3}"
                                    },
                                    "sncNameR3": {
                                        "renameTo": "~sncNameR3",
                                        "value": "{/systemAliases/{&_destName}/rfc/sncNameR3}"
                                    },
                                    "sncQoPR3": {
                                        "renameTo": "~sncQoPR3",
                                        "value": "{/systemAliases/{&_destName}/rfc/sncQoPR3}"
                                    },
                                    "service": {
                                        "renameTo": "~service",
                                        "value": "{/systemAliases/{&_destName}/rfc/service}"
                                    },
                                    "rfcHost": "{/systemAliases/{&_destName}/rfc/host}",
                                    "connectString": {
                                        "renameTo": "~connectString",
                                        "value": "{and &_destIsNotLoadBalancing,&_destHostIsConnectString,&rfcHost}"
                                    },
                                    "businessParams": "{*|match(^(?!sap-))}",
                                    "skipScreenChar": "{and({&businessParams}) '*'}",
                                    "transactionParamsSeparator": "{and({&businessParams}) ' '}",
                                    "transactionParamsJoined": "{join(;,=) &businessParams}",
                                    "transaction": "{./sap.integration/urlTemplateParams/transaction}",
                                    "transactionParams": "{join &transactionParamsSeparator,&transactionParamsJoined}",
                                    "sapTheme": {
                                        "renameTo": "sap-theme",
                                        "value": "{&env:theme}"
                                    },
                                    "sapLanguage": {
                                        "renameTo": "sap-language",
                                        "value": "{&env:logonLanguage}"
                                    }
                                })
                            }
                        },
                        "site": O_CDM3_SAMPLE_SITE,
                        "siteAppSection": oApplicationSection
                    }
                };
            })({ // application section
                "sap.app": {
                    "destination": "legacy_blue_box",
                    "title": "CALL EC Cockpit - Scenario 1",
                    "crossNavigation": {
                        "inbounds": {
                            "AcademicCourse-a4": {
                                "semanticObject": "AcademicCourse",
                                "action": "a4",
                                "signature": {
                                    "parameters": {},
                                    "additionalParameters": "allowed"
                                }
                            }
                        }
                    }
                },
                "sap.integration": {
                    "urlTemplateId": "urltemplate.gui",
                    "urlTemplateParams": {
                        "transaction": "/BAOF/EC_CP_21"
                    }
                },
                "sap.flp": {
                    "businessApp": "businessapp.urltemplate-gui",
                    "defaultLauncher": "businessapp.urltemplate-gui#AcademicCourse-a4"
                },
                "sap.ui": {
                    "technology": "URL"
                }
            }),
            "oOldAppStateData": {},
            "expectedAppStateData": {},
            "expectedResolutionResult": {
                "appCapabilities": undefined,
                "applicationType": "URL",
                "reservedParameters": {},
                "text": "templated",
                "url": "https://tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com/sap/bc/gui/sap/its/webgui;~service=3255;~sncNameR3=p%2Fsecude%3ACN%3DEXAMPLE%2C%20O%3DSAP-AG%2C%20C%3DDE;~sncQoPR3=8?%7etransaction=*/BAOF/EC_CP_21%20defaultP1%3Dv1%3BparameterName%3DparameterValue&%7enosplash=1&sap-theme=sap_belize&sap-language=EN",
                "explicitNavMode": true,
                "navigationMode": "embedded",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            "testDescription": "UI5 (CLP App Runtime)",
            "appCapabilitiesNames": {
                attribute: "protocol",
                value: "GUI"
            },
            "intent": "Employee-display?parameterName=parameterValue&sap-ushell-navmode=inplace",
            "inbound": (function (oApplicationSection) {
                return {
                    "title": "templated",
                    "semanticObject": "Employee",
                    "action": "display",
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                    "resolutionResult": {
                        "applicationType": "URL",
                        "navigationMode": "embedded"
                    },
                    "signature": {
                        "additionalParameters": "allowed",
                        "parameters": {
                            "defaultP1": {
                                "required": false,
                                "defaultValue": {
                                    "value": "v1",
                                    "format": "plain"
                                }
                            }
                        }
                    },
                    "templateContext": {
                        "payload": {
                            urlTemplate: "{+_baseUrl}{+appRuntime}{?appId,startupParameters,originalHash,sapUiDebug}",
                            parameters: {
                                names: utils.shallowMergeObject(O_CDM3_TEMPLATE_NOTIONS, {
                                    "appPlatform": "{./sap.integration/urlTemplateParams/appPlatform}",
                                    "isAppRuntimeNeo": "{match(^NEO$) &appPlatform}",
                                    "isAppRuntimeAbap": "{match(^ABAP$) &appPlatform}",
                                    "isAppRuntimeCf": "{match(^CF$) &appPlatform}",
                                    "appRuntimeAbap": "{if({&isAppRuntimeAbap}) '/ui2/flp/ui5appruntime.html'}",
                                    "appRuntimeCf": "{if({&isAppRuntimeCf}) '/ui5appruntime.html'}",
                                    "appRuntimeNeo": "{if({&isAppRuntimeNeo}) '/sap/fiori/fioriappruntime'}",
                                    "appRuntime": "{or &appRuntimeAbap,&appRuntimeCf,&appRuntimeNeo}",
                                    "startupParameters": "{*|match(^(?!sap-(system\\|(ushell-navmode))$))|join(&,=)}",
                                    "originalHash": "{url(hash)}",
                                    "appId": {
                                        "value": "{./sap.integration/urlTemplateParams/appId}",
                                        "renameTo": "sap-ui-app-id"
                                    },
                                    "sapUiDebug": {
                                        "renameTo": "sap-ui-debug",
                                        "value": "{if({&env:isDebugMode}) &env:isDebugMode}"
                                    }
                                })
                            }
                        },
                        "site": O_CDM3_SAMPLE_SITE,
                        "siteAppSection": oApplicationSection
                    }
                };
            })({ // application section
                "sap.app": {
                    "destination": "fiori_blue_box",
                    "title": "Invoices",
                    "crossNavigation": {
                        "inbounds": {
                            "InvoiceList-manage": {
                                "semanticObject": "InvoiceList",
                                "action": "manage",
                                "signature": {
                                    "parameters": {},
                                    "additionalParameters": "allowed"
                                }
                            }
                        }
                    }
                },
                "sap.integration": {
                    "urlTemplateId": "urltemplate.fiori",
                    "urlTemplateParams": {
                        "appId": "cus.sd.billingdoclist.manages1",
                        "appPlatform": "ABAP"
                    }
                },
                "sap.flp": {
                    "businessApp": "businessapp.urltemplate-fiori",
                    "defaultLauncher": "businessapp.urltemplate-fiori#InvoiceList-manage"
                },
                "sap.ui": {
                    "technology": "URL"
                }

            }),
            "oOldAppStateData": {},
            "expectedAppStateData": {},
            "expectedResolutionResult": {
                "appCapabilities": undefined,
                "applicationType": "URL",
                "reservedParameters": {},
                "text": "templated",
                "url": "https://tenant-fin-dyn-dest-approuter.cfapps.sap.hana.ondemand.com/sap/bc/ui2/flp/ui5appruntime.html?sap-ui-app-id=cus.sd.billingdoclist.manages1&startupParameters=defaultP1%3Dv1%26parameterName%3DparameterValue&originalHash=",
                "explicitNavMode": true,
                "navigationMode": "embedded",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "Relative target in URL, no system alias, sap-system without path prefix",
            // ignore certain fields not needed for the test
            "intent": "Action-aliasToUrl?sap-system=UR3CLNT120",
            "inbound": oTestHelper.createInbound("#Action-aliasToUrl{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "/sap/bc/to/the/moon",
                "systemAlias": ""
            }, {
                "title": "Sap System Test",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedResolutionResult: {
                applicationType: "URL",
                reservedParameters: {},
                url: "https://example.corp.com:44355/sap/bc/to/the/moon?sap-client=120&sap-language=en",
                additionalInformation: "",
                "sap-system": "UR3CLNT120",
                text: "Sap System Test",
                inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "Relative URL, no system alias, sap-system with path",
            // ignore certain fields not needed for the test
            "intent": "Action-aliasToUrl?sap-system=ALIASRFC",
            "inbound": oTestHelper.createInbound("#Action-aliasToUrl{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "/sap/bc/to/the/moon",
                "systemAlias": ""
            }),
            oKnownSapSystemData: {
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "https://example.corp.com:1111/path/sap/bc/to/the/moon?sap-client=220&sap-language=en"
        },
        {
            testDescription: "Absolute URL, no system alias, sap-system without path",
            // ignore certain fields not needed for the test
            "intent": "Action-aliasToAbsoluteUrl?sap-system=UR3CLNT120",
            "inbound": oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "http://www.google.com/path/to/the/moon.html",
                "systemAlias": ""
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/path/to/the/moon.html"
        },
        {
            testDescription: "Absolute URL, no system alias, sap-system with path",
            // ignore certain fields not needed for the test
            "intent": "Action-aliasToAbsoluteUrl?sap-system=ALIASRFC",
            "inbound": oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "http://www.google.com/path/to/the/moon.html",
                "systemAlias": ""
            }),
            oKnownSapSystemData: {
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/path/to/the/moon.html"
        },
        {
            testDescription: "Relative URL, system alias with path prefix, sap-system without path prefix",
            // ignore certain fields not needed for the test
            "intent": "Action-aliasToUrl?sap-system=UR3CLNT120",
            "inbound": oTestHelper.createInbound("#Action-aliasToUrl{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "https://vmw.example.corp.com:44335/go-to/the/moon/sap/bc/to/the/moon?sap-client=111&sap-language=EN",
                "systemAlias": "ALIAS111"
            }),
            oKnownSapSystemData: {
                "ALIAS111": O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH,
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "https://example.corp.com:44355/sap/bc/to/the/moon?sap-client=120&sap-language=en"
        },
        {
            testDescription: "Relative URL, system alias with path prefix, sap-system with path prefix",
            // ignore certain fields not needed for the test
            "intent": "Action-aliasToUrl?sap-system=ALIAS111",
            "inbound": oTestHelper.createInbound("#Action-aliasToUrl{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "https://example.corp.com:1111/path//sap/bc/to/the/moon?sap-client=220&sap-language=EN",
                "systemAlias": "ALIASRFC"
            }),
            oKnownSapSystemData: {
                "ALIAS111": O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "https://vmw.example.corp.com:44335/go-to/the/moon/sap/bc/to/the/moon?sap-client=111&sap-language=en"
        },
        {
            testDescription: "Absolute URL, system alias with path prefix, sap-system without path prefix",
            // ignore certain fields not needed for the test
            "intent": "Action-aliasToAbsoluteUrl?sap-system=UR3CLNT120",
            "inbound": oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "http://www.google.com/sap/bc/to/the/moon.html",
                "systemAlias": "ALIASRFC"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html"
        },
        {
            testDescription: "Relative URL, with apply system alias semantics on relative URL",
            // ignore certain fields not needed for the test
            "intent": "Action-toCdmTarget",
            "inbound": oTestHelper.createInbound("#Action-toCdmTarget{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "/path/to/some/document.html",
                "systemAlias": "UR3CLNT120",
                "systemAliasSemantics": "apply"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "https://example.corp.com:44355/path/to/some/document.html?sap-client=120&sap-language=en"
        },
        {
            testDescription: "Relative URL, with apply system alias semantics and sap system on relative URLs",
            "intent": "Action-toCdmTarget?p1=v1&sap-system=ALIASRFC", // NOTE: sap-system wins here
            "inbound": oTestHelper.createInbound("#Action-toCdmTarget{<no params><+>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "/path/to/some/document.html",
                "systemAlias": "UR3CLNT120",
                "systemAliasSemantics": "apply"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "https://example.corp.com:1111/path/path/to/some/document.html?sap-client=220&sap-language=en&p1=v1"
        },
        {
            "testDescription": "Relative URL, with no sap system or system alias, but apply semantics",
            "intent": "Action-toCdmTarget", // NOTE: sap-system wins here
            "inbound": oTestHelper.createInbound("#Action-toCdmTarget{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "/path/to/some/document.html",
                "systemAliasSemantics": "apply"
            }),
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "/path/to/some/document.html"
        },
        {
            "testDescription": "WebGUI Target, with no sap system or system alias, but apply semantics",
            "intent": "Action-toCdmGuiTarget", // NOTE: sap-system wins here
            "inbound": oTestHelper.createInbound("#Action-toCdmGuiTarget{<no params><+>}", {
                "sap.gui": {
                    "_version": "1.2.0",
                    "transaction": "/SAPSLL/CLSNR_01"
                },
                "applicationType": "TR",
                "systemAliasSemantics": "apply",
                "text": "Manage Commodity Codes"
            }),
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "TR",
            expectedUrl: "/sap/bc/gui/sap/its/webgui;?%7etransaction=/SAPSLL/CLSNR_01&%7enosplash=1&sap-language=en"
        },
        {
            "testDescription": "WebGUI Target, with sap-system and sap-system-src",
            "intent": "Action-toCdmGuiTarget?sap-system=UR3CLNT120&sap-system-src=OTHERSYSTEM",
            inbound: oTestHelper.createInbound("#Action-toCdmGuiTarget{<no params><+>}", {
                applicationType: "TR",
                systemAliasSemantics: "apply",
                text: "Manage Commodity Codes",
                "sap.gui": {
                   "_version": "1.2.0",
                   "transaction": "/SAPSLL/CLSNR_01"
                }
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }),
            oKnownSapSystemData: {
                UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oLocalStorageContent: {
                "sap-system-data#OTHERSYSTEM:UR3CLNT120": (function (oSystemData) {
                    oSystemData.https.host = "test." + oSystemData.https.host;
                    return JSON.stringify(oSystemData);
                })(utils.clone(O_KNOWN_SYSTEM_ALIASES.UR3CLNT120))
            },
            expectedResolutionResult: {
                "applicationType": "TR",
                "reservedParameters": {},
                "sap-system": "UR3CLNT120",
                "sap-system-src": "OTHERSYSTEM",
                "text": undefined,
                "url": "https://test.example.corp.com:44355/sap/bc/gui/sap/its/webgui;~rfcHostName=example.corp.com;~service=3255;~sncNameR3=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=8?%7etransaction=/SAPSLL/CLSNR_01&%7enosplash=1&sap-client=120&sap-language=en&sap-system-src=OTHERSYSTEM",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            "testDescription": "WebGUI Target, with connect string in system alias",
            "intent": "Action-toCdmGuiTarget?sap-system=SYSCONNSTRING",
            inbound: oTestHelper.createInbound("#Action-toCdmGuiTarget{<no params><+>}", {
                applicationType: "TR",
                systemAliasSemantics: "apply",
                text: "Manage Commodity Codes",
                "sap.gui": {
                   "_version": "1.2.0",
                   "transaction": "/SAPSLL/CLSNR_01"
                }
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }),
            oKnownSapSystemData: {
                SYSCONNSTRING: O_KNOWN_SYSTEM_ALIASES.SYSCONNSTRING
            },
            oLocalStorageContent: {},
            expectedResolutionResult: {
                "applicationType": "TR",
                "reservedParameters": {},
                "sap-system": "SYSCONNSTRING",
                "text": undefined,
                "url": "https://example.corp.com:44355/sap/bc/gui/sap/its/webgui;~connectString=%2fH%2fCoffee%2fS%2fDecaf%2fG%2fRoast;~service=3255;~sncNameR3=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=8?%7etransaction=/SAPSLL/CLSNR_01&%7enosplash=1&sap-client=120&sap-language=en",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            "testDescription": "WebGUI Target, with no sap system and local system alias from server, and apply semantics",
            "intent": "Action-toCdmGuiTarget", // NOTE: sap-system wins here
            "inbound": oTestHelper.createInbound("#Action-toCdmGuiTarget{<no params><+>}", {
                "sap.gui": {
                    "_version": "1.2.0",
                    "transaction": "/SAPSLL/CLSNR_01"
                },
                "applicationType": "TR",
                "systemAliasSemantics": "apply",
                "text": "Manage Commodity Codes"
            }),
            oKnownSapSystemData: {
                "": {
                   "https": {
                       "id": "",
                       "host": "server.example.com", // NOTE: this causes protocol to be added to the URL.
                       "port": 0, // 0: null port
                       "pathPrefix": "/sap/bc2/" // pathPrefix always prepended to URL.
                   }
                }
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "TR",
            expectedUrl: "https://server.example.com/sap/bc2/gui/sap/its/webgui?%7etransaction=/SAPSLL/CLSNR_01&%7enosplash=1&sap-language=en"
        },
        {
            testDescription: "Absolute URL, system alias with path prefix, sap-system with path prefix",
            "intent": "Action-aliasToAbsoluteUrl?sap-system=ALIAS111",
            "inbound": oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{<no params><o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "http://www.google.com/sap/bc/to/the/moon.html",
                "systemAlias": "ALIASRFC"
            }),
            oKnownSapSystemData: {
                "ALIAS111": O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html"
        },
        {
            testDescription: "Absolute URL, with user-env parameters added",
            "UserEnvParameters": { "sap-accessibility": "X",
                "sap-statistics": true,
                "sap-language": "ZH"},
            "intent": "Action-aliasToAbsoluteUrl?sap-system=ALIAS111&param1=value1&param2=value2",
            "inbound": oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{[mylanguage:[@User.env.sap-language@]],[mystatistics:[@User.env.sap-statistics@]],[myaccess:[@User.env.sap-accessibility@]]<+>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "http://www.google.com/sap/bc/to/the/moon.html",
                "systemAlias": "ALIASRFC"
            }),
            oKnownSapSystemData: {
                "ALIAS111": O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html?myaccess=X&mylanguage=ZH&mystatistics=true&param1=value1&param2=value2"
        },
        {
            testDescription: "relative Intent URL with with parameters (default configuration used)",
            "intent": "Employee-display?C=E&D=F&E=K",
            "inbound": oTestHelper.createInbound("#Employee-display{[C:],[D:]<o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "/path/to/FioriLaunchpad.html?sap-theme=sap_belize#Action-toappnavsample?p1=v1",
                "systemAlias": "ALIASRFC"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "/path/to/FioriLaunchpad.html?sap-theme=sap_belize#Action-toappnavsample?C=E&D=F&p1=v1"
        },
        {
            testDescription: "relative Intent URL with with parameters (non default FLP URL)",
            "intent": "Employee-display?C=E&D=F&E=K",
            "inbound": oTestHelper.createInbound("#Employee-display{[C:],[D:]<o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "/path/to/index.html?sap-theme=sap_belize#Action-toappnavsample?p1=v1",
                "systemAlias": "ALIASRFC"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "/path/to/index.html?sap-theme=sap_belize&C=E&D=F#Action-toappnavsample?p1=v1"
        },
        {
            testDescription: "relative Intent URL with with parameters (non default FLP URL + configuration)",
            "intent": "Employee-display?C=E&D=F&E=K",
            "inbound": oTestHelper.createInbound("#Employee-display{[C:],[D:]<o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "/path/to/index.html?sap-theme=sap_belize#Action-toappnavsample?p1=v1",
                "systemAlias": "ALIASRFC"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oCSTRConfig: {
                config: {
                    flpURLDetectionPattern: "[/]index.html"
                }
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "/path/to/index.html?sap-theme=sap_belize#Action-toappnavsample?C=E&D=F&p1=v1"
        },
        {
            testDescription: "Absolute URL, with user-env parameters added value accessiblity, statistics turned off!",
            "UserEnvParameters": { "sap-accessibility": false,
                                    "sap-statistics": false,
                                    "sap-language": "ZH"},
            "intent": "Action-aliasToAbsoluteUrl?sap-system=ALIAS111&param1=value1&param2=value2",
            "inbound": oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{[mylanguage:[@User.env.sap-language@]],[mystatistics:[@User.env.sap-statistics@]],[myaccess:[@User.env.sap-accessibility@]]<+>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "http://www.google.com/sap/bc/to/the/moon.html",
                "systemAlias": "ALIASRFC"
            }),
            oKnownSapSystemData: {
                "ALIAS111": O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html?mylanguage=ZH&param1=value1&param2=value2"
        },
        {
            testDescription: "Absolute URL, system alias with path prefix, sap-system with path prefix + intent parameters",
            "intent": "Action-aliasToAbsoluteUrl?sap-system=ALIAS111&param1=value1&param2=value2",
            "inbound": oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{<no params><+>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "http://www.google.com/sap/bc/to/the/moon.html",
                "systemAlias": "ALIASRFC"
            }),
            oKnownSapSystemData: {
                "ALIAS111": O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html?param1=value1&param2=value2"
        },
        {
            testDescription: "Absolute URL with parameter and hash (no hash parameters) and sap-system",
            // ignore certain fields not needed for the test
            "intent": "Action-aliasToAbsoluteUrl?C=E&D=F&sap-system=UR3CLNT120",
            "inbound": oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{[C:],[D:]<+>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "http://www.google.com/sap/bc/to/the/moon.html#SoIsses",
                "systemAlias": "ALIASRFC"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html?C=E&D=F#SoIsses"
        },
        {
            testDescription: "relative URL with parameter and hash (no hash parameters) and no sap-system",
            // ignore certain fields not needed for the test
            "intent": "Action-aliasToAbsoluteUrl?C=E&D=F&E=K",
            "inbound": oTestHelper.createInbound("#Action-aliasToAbsoluteUrl{[C:],[D:]<o>}", {
                "additionalInformation": "",
                "applicationType": "URL",
                "ui5ComponentName": "",
                "url": "/sap/bc/to/the/moon.html?A=B#SoIsses",
                "systemAlias": "ALIASRFC"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "/sap/bc/to/the/moon.html?A=B&C=E&D=F#SoIsses"
        },
        {
            testDescription: "an Easy User Access Menu transaction is resolved",
            // ignore certain fields not needed for the test
            "intent": "Shell-startGUI?sap-system=ALIASRFC&sap-ui2-tcode=SU01",
            "inbound": oTestHelper.createInbound("#Shell-startGUI{sap-system:ALIASRFC<+>}", {
                "applicationType": "whatever",
                "additionalInformation": "whatever",
                "text": "System U1Y on current client",
                "url": "whatever",
                "systemAlias": "whatever"
            }),
            oKnownSapSystemData: {
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "TR",
            expectedUrl: "https://example.corp.com:1111/path/gui/sap/its/webgui;~sysid=UV2;~loginGroup=SPACE;~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=9?%7etransaction=SU01&%7enosplash=1&sap-client=220&sap-language=en"
        },
        {
            testDescription: "an Easy User Access Menu transaction with parameters (!) is resolved",
            // ignore certain fields not needed for the test
            "intent": "Shell-startGUI?sap-system=ALIASRFC&sap-ui2-tcode=SU01&USER=ANTONvonWERNER&QUOTE=MeinLieberAntonWerner%20SieStehnMirEtwasFerner",
            "inbound": oTestHelper.createInbound("#Shell-startGUI{sap-system:ALIASRFC<+>}", {
                "applicationType": "whatever",
                "additionalInformation": "whatever",
                "text": "System U1Y on current client",
                "url": "whatever",
                "systemAlias": "whatever"
            }),
            oKnownSapSystemData: {
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "TR",
            expectedUrl: "https://example.corp.com:1111/path/gui/sap/its/webgui;~sysid=UV2;~loginGroup=SPACE;~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=9?%7etransaction=*SU01%20QUOTE%3dMeinLieberAntonWerner%20SieStehnMirEtwasFerner%3bUSER%3dANTONvonWERNER&%7enosplash=1&sap-client=220&sap-language=en"
        },
        {
            testDescription: "an Easy User Access Menu WDA target is resolved",
            // ignore certain fields not needed for the test
            "intent": "Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL",
            "inbound": oTestHelper.createInbound("#Shell-startWDA{sap-system:UR3CLNT120<+>}", {
                "applicationType": "whatever",
                "additionalInformation": "whatever",
                "text": "System U1Y on current client",
                "url": "whatever",
                "systemAlias": "whatever"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "NWBC",
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-client=120&sap-language=en"
        },
        {
            testDescription: "test WDA EAM navigation from legacy application with inplace WDA navigation configured",
            //
            // This test has a common input with the test above, but aims at
            // testing other aspects.
            //
            "intent": "Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL",
            "inbound": oTestHelper.createInbound("#Shell-startWDA{sap-system:UR3CLNT120<+>}", {
                "applicationType": "WDA",
                "additionalInformation": "whatever",
                "text": "System U1Y on current client",
                "url": "whatever",
                "systemAlias": "whatever"
            }, {
                "title": "System U1Y on current client",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            // --- end of common input
            sCurrentApplicationType: "WDA",
            oCSTRConfig: {
                config: {
                    enableInPlaceForClassicUIs: { WDA: true }
                }
            },
            expectedResolutionResult: {
              "additionalInformation": "",
              // no navigation mode property added
              "applicationType": "NWBC",
              "sap-system": "UR3CLNT120",
              "text": "EPM_POWL",
              "url": "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-client=120&sap-language=en",
              "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "test WDA EAM navigation non-legacy application with inplace WDA navigation configured",
            //
            // This test has a common input with the test above, but aims at
            // testing other aspects.
            //
            "intent": "Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL",
            "inbound": oTestHelper.createInbound("#Shell-startWDA{sap-system:UR3CLNT120<+>}", {
                "applicationType": "WDA",
                "additionalInformation": "whatever",
                "text": "System U1Y on current client",
                "url": "whatever",
                "systemAlias": "whatever"
            }, {
                "title": "System U1Y on current client",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            // --- end of common input
            sCurrentApplicationType: "UI5",
            oCSTRConfig: {
                config: {
                    enableInPlaceForClassicUIs: { WDA: true }
                }
            },
            expectedResolutionResult: {
              additionalInformation: "",
              applicationType: "NWBC",
              navigationMode: "embedded",
              "sap-system": "UR3CLNT120",
              text: "EPM_POWL",
              url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-client=120&sap-language=en",
              inboundPermanentKey: "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "an Easy User Access Menu WDA target with configuration is resolved",
            // ignore certain fields not needed for the test
            "intent": "Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL&sap-ui2-wd-conf-id=CO!@^*()_+\":{}<>NFIG",
            "inbound": oTestHelper.createInbound("#Shell-startWDA{sap-system:UR3CLNT120<+>}", {
                "applicationType": "whatever",
                "additionalInformation": "whatever",
                "text": "System U1Y on current client",
                "url": "whatever",
                "systemAlias": "whatever"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "NWBC",
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-wd-configId=CO!%40%5E*()_%20%22%3A%7B%7D%3C%3ENFIG&sap-client=120&sap-language=en"
        },
        {
            testDescription: "an Easy User Access Menu WDA target with configuration & application parameters is resolved",
            // ignore certain fields not needed for the test
            "intent": "Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL&appParam1=appValue1&sap-ui2-wd-conf-id=CO!@^*()_+\":{}<>NFIG&appParam5=appValue5",
            "inbound": oTestHelper.createInbound("#Shell-startWDA{sap-system:UR3CLNT120<+>}", {
                "sap.platform.runtime": {
                    "anything": "copied"
                },
                "applicationType": "whatever",
                "additionalInformation": "whatever",
                "text": "System U1Y on current client",
                "url": "whatever",
                "systemAlias": "whatever"
            }, {
                "title": "System U1Y on current client",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "NWBC",
            expectedResolutionResult:
            {
                "additionalInformation": "",
                "applicationType": "NWBC",
                "sap-system": "UR3CLNT120",
                "text": "EPM_POWL",
                "url": "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?appParam1=appValue1&appParam5=appValue5&sap-wd-configId=CO!%40%5E*()_%20%22%3A%7B%7D%3C%3ENFIG&sap-client=120&sap-language=en",
                "sap.platform.runtime": { "anything": "copied" },
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            },
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?appParam1=appValue1&appParam5=appValue5&sap-wd-configId=CO!%40%5E*()_%20%22%3A%7B%7D%3C%3ENFIG&sap-client=120&sap-language=en"
        },
        {
            testDescription: "an Shell-launchURL record is resolved with parameter stripped!",
            // ignore certain fields not needed for the test
            "intent": "Shell-launchURL?sap-external-url=http:%2F%2Fwww.nytimes.com",
            "inbound": oTestHelper.createInbound("#Shell-launchURL{sap-external-url:http://www.nytimes.com<+>}", {
                "applicationType": "URL",
                "text": "System U1Y on current client",
                "url": "http://www.nytimes.com"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.nytimes.com"
        },
        {
            testDescription: "a system alias is resolved to an object with 'rfc: {}' and '{ https : { port: \"\" }}'",
            // We need to make sure we support that a system alias is resolved
            // in the format specified in EMPTY_PORT_PREFIX_RFC system alias. This
            // is what HCP uses in the end.
            "intent": "Flight-lookup",
            "inbound": oTestHelper.createInbound("#Flight-lookup{<no params><o>}", {
                "componentProperties": {
                    "html5AppName": "",
                    "siteId": "28000d99-ce12-4d95-98c2-eb0409d6c6b8",
                    "appId": "9c3b3414-e26e-46c1-89fa-4022b088097c-1465888775169"
                },
                "sap.platform.runtime": {
                    "componentProperties": {
                        "html5AppName": "",
                        "siteId": "28000d99-ce12-4d95-98c2-eb0409d6c6b8",
                        "appId": "9c3b3414-e26e-46c1-89fa-4022b088097c-1465888775169"
                    }
                },
                "sap.wda": {
                    "_version": "1.3.0",
                    "applicationId": "FPM_TEST_SADL_ATTR_FILT_SBOOK",
                    "configId": ""
                },
                "applicationType": "WDA",
                "systemAlias": "ABAP_BACKEND_FOR_DEMO",
                "text": "Browse Flight Bookings"
            }),
            oKnownSapSystemData: {
                "ABAP_BACKEND_FOR_DEMO": O_KNOWN_SYSTEM_ALIASES.EMPTY_PORT_PREFIX_RFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "NWBC",
            expectedUrl: "https://system.our.domain.corp/sap/bc/ui2/nwbc/~canvas;window=app/wda/FPM_TEST_SADL_ATTR_FILT_SBOOK/?sap-language=en"
        },
        {
            // When CSTR is configured to open WDA applications in embedded
            // mode, the navigation mode must be "embedded" in the result.
            testDescription: "embedded navigation mode for WDA is configured, and 'WDA' processor is used",
            intent: "Action-towda",
            inbounds: [oTestHelper.createInbound("#Action-towda", {
                applicationType: "WDA",
                "sap.ui": { technology: "WDA" },
                url: "/some/wda/app"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            oCSTRConfig: {
                config: {
                    enableInPlaceForClassicUIs: { WDA: true }
                }
            },
            expectedResolutionResult: {
                "applicationType": "NWBC",
                "navigationMode": "embedded", // <-- NOTE
                "reservedParameters": {},
                "sap-system": undefined,
                "text": undefined,
                "url": "/some/wda/app",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            // Embedded navigation mode should also works for results
            // constructed entirely locally.
            testDescription: "embedded navigation mode for WDA when is to be resolved via 'WDA full url construction' processor",
            intent: "Action-towda",
            oKnownSapSystemData: {
                "ABAP_BACKEND_FOR_DEMO": O_KNOWN_SYSTEM_ALIASES.EMPTY_PORT_PREFIX_RFC
            },
            inbounds: [oTestHelper.createInbound("#Action-towda", {
                "sap.wda": {
                    "_version": "1.2.0",
                    "applicationId": "FIS_FPM_OVP_STKEYFIGITEMCO",
                    "configId": "FIS_FPM_OVP_STKEYFIGITEMCO"
                },
                "applicationType": "WDA",
                "systemAlias": "ABAP_BACKEND_FOR_DEMO",
                "text": "Statistical Key Figures"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            oCSTRConfig: {
                config: {
                    enableInPlaceForClassicUIs: { WDA: true }
                }
            },
            expectedResolutionResult: {
                "applicationType": "NWBC",
                "navigationMode": "embedded", // <-- NOTE
                "reservedParameters": {},
                "sap-system": undefined,
                "text": undefined,
                "url": "https://system.our.domain.corp/sap/bc/ui2/nwbc/~canvas;window=app/wda/FIS_FPM_OVP_STKEYFIGITEMCO/?sap-wd-configId=FIS_FPM_OVP_STKEYFIGITEMCO&sap-language=en",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            // Test that sap-system-src and sap-system are taken into account
            // when when WDA is constructed entirely locally
            testDescription: "'WDA full url construction' processor takes into account sap-system and sap-system-src",
            intent: "Action-towda?sap-system=UR3CLNT120&sap-system-src=OTHERSYSTEM",
            oKnownSapSystemData: {
                "ABAP_BACKEND_FOR_DEMO": O_KNOWN_SYSTEM_ALIASES.EMPTY_PORT_PREFIX_RFC,
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            inbounds: [oTestHelper.createInbound("#Action-towda{<no params><+>}", {
                "sap.wda": {
                    "_version": "1.2.0",
                    "applicationId": "FIS_FPM_OVP_STKEYFIGITEMCO",
                    "configId": "FIS_FPM_OVP_STKEYFIGITEMCO"
                },
                "applicationType": "WDA",
                "systemAlias": "ABAP_BACKEND_FOR_DEMO",
                "text": "Statistical Key Figures"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            oLocalStorageContent: {
                "sap-system-data#OTHERSYSTEM:UR3CLNT120": (function (oSystemData) {
                    // stored data are different than the adapter's data
                    oSystemData.language = "DE";
                    oSystemData.client = "200";
                    oSystemData.https.host = "ur3.example.corp.com";
                    oSystemData.https.port = 8080;

                    return JSON.stringify(oSystemData);
                })(utils.clone(O_KNOWN_SYSTEM_ALIASES.UR3CLNT120))
            },
            expectedResolutionResult: {
                "applicationType": "NWBC",
                "reservedParameters": {},
                "sap-system": "UR3CLNT120",
                "sap-system-src": "OTHERSYSTEM",
                "text": undefined,
                "url": "https://ur3.example.corp.com:8080/sap/bc/ui2/nwbc/~canvas;window=app/wda/FIS_FPM_OVP_STKEYFIGITEMCO/?sap-wd-configId=FIS_FPM_OVP_STKEYFIGITEMCO&sap-client=200&sap-language=DE&sap-system-src=OTHERSYSTEM",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            // When CSTR is configured to open GUI applications in embedded
            // mode, the navigation mode must be "embedded" in the result.
            testDescription: "embedded navigation mode for GUI is configured",
            intent: "Action-togui",
            inbounds: [oTestHelper.createInbound("#Action-togui", {
                applicationType: "TR",
                "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN",
                "sap.ui": { technology: "GUI" }
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            oCSTRConfig: {
                config: {
                    enableInPlaceForClassicUIs: { GUI: true }
                }
            },
            expectedResolutionResult: {
              "applicationType": "TR",
              "navigationMode": "embedded", // <-- NOTE
              "reservedParameters": {},
              "sap-system": undefined,
              "text": undefined,
              "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN",
              "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "an intent matches a virtual target mapping",
            "intent": "Action-search",
            "inbounds": oTestHelper.getVirtualInbounds(),
            expectedResolutionResult: {
                "additionalInformation": "SAPUI5.Component=sap.ushell.renderers.fiori2.search.container",
                "applicationType": "SAPUI5",
                "sap-system": undefined,
                "text": undefined,
                "ui5ComponentName": "sap.ushell.renderers.fiori2.search.container",
                "url": "../../../../../resources/sap/ushell/renderers/fiori2/search/container",
                "reservedParameters": {},
                "inboundPermanentKey": undefined
            }
        },
        {
            testDescription: "an intent matches a virtual target mapping",
            "intent": "Action-search",
            "inbounds": [], // note, adapter returns no inbound
            expectedResolutionResult: {
                "additionalInformation": "SAPUI5.Component=sap.ushell.renderers.fiori2.search.container",
                "applicationType": "SAPUI5",
                "sap-system": undefined,
                "text": undefined,
                "ui5ComponentName": "sap.ushell.renderers.fiori2.search.container",
                "url": "../../../../../resources/sap/ushell/renderers/fiori2/search/container",
                "reservedParameters": {},
                "inboundPermanentKey": undefined
            }
        },
        {
            testDescription: "sap-tag parameter is not propagated to the resolved SAPUI5 URL",
            intent: "Object-act1",
            inbounds: [oTestHelper.createInbound("#Object-act1{[sap-tag:[superior]]}", {
                applicationType: "SAPUI5",
                "sap.ui": { technology: "UI5" },
                url: "/some/app"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            expectedResolutionResult: {
                "applicationType": "SAPUI5",
                "sap-system": undefined,
                "text": undefined,
                "url": "/some/app",
                "reservedParameters": {},
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "sap-tag parameter is not propagated to the resolved WDA URL",
            intent: "Object-act1",
            inbounds: [oTestHelper.createInbound("#Object-act1{[sap-tag:[superior]]}", {
                applicationType: "WDA",
                "sap.ui": { technology: "WDA" },
                url: "/some/wda/app"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            expectedResolutionResult: {
                "applicationType": "NWBC",
                "reservedParameters": {},
                "sap-system": undefined,
                "text": undefined,
                "url": "/some/wda/app",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "sap-tag parameter is not propagated to the resolved GUI URL",
            intent: "Object-act1",
            inbounds: [oTestHelper.createInbound("#Object-act1{[sap-tag:[superior]]}", {
                applicationType: "TR",
                "sap.ui": { technology: "GUI" },
                url: "/path/gui/sap/its/webgui;"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            expectedResolutionResult: {
                "applicationType": "TR",
                "reservedParameters": {},
                "sap-system": undefined,
                "text": undefined,
                "url": "/path/gui/sap/its/webgui;?&",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "sap-tag and sap-fiori-id parameters are not propagated to the resolved GUI URL",
            intent: "Object-act1?sap-fiori-id=12345",
            inbounds: [oTestHelper.createInbound("#Object-act1{[sap-tag:[superior]]}", {
                applicationType: "TR",
                "sap.ui": { technology: "GUI" },
                url: "/path/gui/sap/its/webgui;"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            expectedResolutionResult: {
                "applicationType": "TR",
                "reservedParameters": {
                    "sap-fiori-id": [ "12345" ]
                },
                "sap-system": undefined,
                "text": undefined,
                "url": "/path/gui/sap/its/webgui;?&",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "sap-ui-fl-max-layer is provided in the inbound as a default parameter for a SAPUI5 target",
            intent: "Object-act1",
            inbounds: [ oTestHelper.createInbound("#Object-act1{[sap-ui-fl-max-layer:[TEST]]}", {
                applicationType: "SAPUI5",
                "sap.ui": { technology: "UI5" },
                url: "/some/app"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            expectedResolutionResult: {
                "applicationType": "SAPUI5",
                "reservedParameters": {
                    "sap-ui-fl-max-layer": [ "TEST" ]
                },
                "sap-system": undefined,
                "text": undefined,
                "url": "/some/app",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "sap-ui-fl-max-layer is provided in the intent",
            intent: "Object-act1?sap-ui-fl-max-layer=TEST",
            inbounds: [ oTestHelper.createInbound("#Object-act1{<->}", { // <-> : notallowed
                                                     // but sap- parameters
                                                     // ignore additionalParameters.
                applicationType: "SAPUI5",
                "sap.ui": { technology: "UI5" },
                url: "/some/app"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            expectedResolutionResult: {
                "applicationType": "SAPUI5",
                "reservedParameters": {
                    "sap-ui-fl-max-layer": [ "TEST" ] // from intent
                },
                "sap-system": undefined,
                "text": undefined,
                "url": "/some/app",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "sap-ui-fl-max-layer and sap-fiori-id are provided in the intent",
            intent: "Object-act1?sap-ui-fl-max-layer=TEST&sap-fiori-id=12345",
            inbounds: [ oTestHelper.createInbound("#Object-act1{<->}", { // <-> : notallowed
                                                     // but sap- parameters
                                                     // ignore additionalParameters.
                applicationType: "SAPUI5",
                "sap.ui": { technology: "UI5" },
                url: "/some/app"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            expectedResolutionResult: {
                "applicationType": "SAPUI5",
                "reservedParameters": {
                    "sap-ui-fl-max-layer": [ "TEST" ], // from intent
                    "sap-fiori-id": [ "12345" ]
                },
                "sap-system": undefined,
                "text": undefined,
                "url": "/some/app",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "sap-system-src is provided in the intent",
            intent: "Object-act1?sap-system=ABC&sap-system-src=DEF",
            inbounds: [ oTestHelper.createInbound("#Object-act1{<+>}", {
                applicationType: "SAPUI5",
                "sap.ui": { technology: "UI5" },
                url: "/some/app"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            expectedResolutionResult: {
                "applicationType": "SAPUI5",
                "reservedParameters": {},
                "sap-system": "ABC",
                "sap-system-src": "DEF",
                "text": undefined,
                "url": "/some/app?sap-system=ABC&sap-system-src=DEF",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "sap-ui-fl-control-variant-id is provided in the intent",
            intent: "Object-act1?sap-ui-fl-control-variant-id=TEST",
            inbounds: [ oTestHelper.createInbound("#Object-act1{<->}", { // <-> : notallowed
                                                     // but sap- parameters
                                                     // ignore additionalParameters.
                applicationType: "SAPUI5",
                url: "/some/app"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            expectedResolutionResult: {
                "applicationType": "SAPUI5",
                "reservedParameters": {
                    "sap-ui-fl-control-variant-id": [ "TEST" ] // from intent
                },
                "sap-system": undefined,
                "text": undefined,
                "url": "/some/app",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "sap-ui-fl-max-layer is a mandatory filter",
            intent: "Object-act1?sap-ui-fl-max-layer=FOO",
            inbounds: [ oTestHelper.createInbound("#Object-act1{sap-ui-fl-max-layer:FOO<->}", {
                applicationType: "SAPUI5",
                "sap.ui": { technology: "UI5" },
                url: "/some/app"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            })],
            expectedResolutionResult: {
                "applicationType": "SAPUI5",
                "reservedParameters": {
                    "sap-ui-fl-max-layer": [ "FOO" ]
                },
                "sap-system": undefined,
                "text": undefined,
                "url": "/some/app",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            //
            // sap-ui-tech-hint=WDA can be used to select a WDA target
            //
            testDescription: "sap-ui-tech-hint=WDA specified in intent but not in inbound",
            intent: "Object-action?sap-ui-tech-hint=WDA",
            inbounds: [
                oTestHelper.createInbound("#Object-action{<no params><+>}", {
                        applicationType: "SAPUI5",
                        "sap.ui": { technology: "UI5" },
                        url: "/some/ui5app"
                    }),
                oTestHelper.createInbound("#Object-action{<no params><+>}", {
                    applicationType: "WDA",
                    "sap.ui": { technology: "WDA" },
                    url: "/some/wdaApp"
                }, {
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
                })
            ],
            expectedResolutionResult: {
                "applicationType": "NWBC",
                "reservedParameters": {},
                "sap-system": undefined,
                "text": undefined,
                "url": "/some/wdaApp?sap-ui-tech-hint=WDA", // sap-ui-tech-hint propagated
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            //
            // sap-ui-tech-hint used as filter
            //
            testDescription: "sap-ui-tech-hint=WDA specified in intent and UI5 inbound with sap-ui-tech-hint=WDA filter",
            intent: "Object-action?sap-ui-tech-hint=WDA",
            inbounds: [
                oTestHelper.createInbound("#Object-action{sap-ui-tech-hint:WDA<+>}", { // generally it's wrong, but this proves tech priority is
                                                                     // even more effective than filtering
                        applicationType: "SAPUI5",
                        "sap.ui": { technology: "UI5" },
                        url: "/some/ui5app"
                    }),
                oTestHelper.createInbound("#Object-action{<no params><->}", { // still wins
                    applicationType: "WDA",
                    "sap.ui": { technology: "WDA" },
                    url: "/some/wdaApp"
                }, {
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
                })
            ],
            expectedResolutionResult: {
                "applicationType": "NWBC",
                "reservedParameters": {},
                "sap-system": undefined,
                "text": undefined,
                "url": "/some/wdaApp?sap-ui-tech-hint=WDA", // sap-ui-tech-hint propagated
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            //
            // sap-ui-app-id-hint=app3 can be used to select the target with id=app3
            //
            testDescription: "sap-ui-app-id-hint=app3 specified in intent but not in inbound",
            intent: "Object-action?sap-ui-app-id-hint=app3",
            inbounds: [
                oTestHelper.createInbound("#Object-action{<no params><+>}", {
                    "appId": "app1",
                    "applicationType": "SAPUI5",
                    "url": ""
                }, {
                    "title": "app1",
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOBB"
                }),
                oTestHelper.createInbound("#Object-action{<no params><+>}", {
                    "appId": "app2",
                    "applicationType": "SAPUI5",
                    "url": ""
                }, {
                    "title": "app2",
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOAA"
                }),
                oTestHelper.createInbound("#Object-action{<no params><+>}", {
                    "appId": "app3",
                    "applicationType": "SAPUI5",
                    "url": ""
                }, {
                    "title": "app3",
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
                })
            ],
            expectedResolutionResult: {
                "applicationType": "SAPUI5",
                "reservedParameters": {
                    "sap-ui-app-id-hint": ["app3"]
                },
                "sap-system": undefined,
                "text": "app3",
                "url": "",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            //
            // sap-ui-app-id-hint=app5 will still navigate to an app although no app with id=app5 exists
            //
            testDescription: "sap-ui-app-id-hint=app3 specified in intent but not in inbound",
            intent: "Object-action?sap-ui-app-id-hint=app5",
            inbounds: [
                oTestHelper.createInbound("#Object-action{<no params><+>}", {
                    "appId": "app1",
                    "applicationType": "SAPUI5",
                    "url": ""
                }, {
                    "title": "app1",
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOAA"
                }),
                oTestHelper.createInbound("#Object-action{<no params><+>}", {
                    "appId": "app2",
                    "applicationType": "SAPUI5",
                    "url": ""
                }, {
                    "title": "app2",
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOBB"
                }),
                oTestHelper.createInbound("#Object-action{<no params><+>}", {
                    "appId": "app3",
                    "applicationType": "SAPUI5",
                    "url": ""
                }, {
                    "title": "app3",
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
                })
            ],
            expectedResolutionResult: {
                "applicationType": "SAPUI5",
                "reservedParameters": {
                    "sap-ui-app-id-hint": ["app5"]
                },
                "sap-system": undefined,
                "text": "app1",
                "url": "",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOAA"
            }
        },
        {
            testDescription: "a WCF target with system alias is resolved",
            intent: "WCF-displayTarget",
            oKnownSapSystemData: {
                UR3CLNT120: O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            inbound: oTestHelper.createInbound("#WCF-displayTarget{<no params><+>}",
                {
                    "applicationType": "WCF",
                    "additionalInformation": "",
                    "text": "WCF App",
                    "url": "https://example.corp.com:44335/sap/bc/bsp/sap/crm_ui_start/default.htm?sap-client=120&sap-language=EN&wcf-target-id=SVO_DISP",
                    "systemAlias": "UR3CLNT120",
                    "sap.ui": {
                        "technology": "WCF"
                    }
                }, {
                    "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
                }
            ),
            oOldAppStateData: {},
            expectedResolutionResult: {
                "additionalInformation": "",
                "applicationType": "WCF",
                "fullWidth": true,
                "navigationMode": "embedded",
                "reservedParameters": {},
                "text": "WCF App",
                "url": "https://example.corp.com:44335/sap/bc/bsp/sap/crm_ui_start/default.htm?sap-client=120&sap-language=EN&wcf-target-id=SVO_DISP",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "a WCF target with configuration is resolved",
            intent: "Shell-startWCF?technicalId=MD-BP-OV",
            inbound: {
                "semanticObject": "Shell",
                "action": "startWCF",
                "id": "Shell-startWCF",
                "title": "WCF target inbound",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                "resolutionResult": {
                    "url": "/bsp/sap/crm_ui_start/default.htm",
                    "applicationType": "WCF",
                    "sap.ui": { "technology": "WCF" }
                },
                "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "sap-system": {
                            "defaultValue": {
                                "value": "UR3CLNT120",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "technicalId": {
                            "renameTo": "crm-targetId",
                            "required": true
                        }
                    }
                }
            },
            oOldAppStateData: {},
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            expectedResolutionResult: {
                "applicationType": "WCF",
                "text": "",
                "additionalInformation": "",
                "navigationMode": "embedded",
                "reservedParameters": {},
                "fullWidth": true,
                "url": "https://example.corp.com:44355/sap/bc/bsp/sap/crm_ui_start/default.htm?sap-client=120&sap-language=en&crm-targetId=MD-BP-OV",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "a WCF target with different parameters is resolved",
            "intent": "Shell-startWCF?technicalId=MD-BP-OV&saprole=SUPPLIER",
            "inbound": {
                "semanticObject": "Shell",
                "action": "startWCF",
                "id": "Shell-startWCF",
                "title": "WCF target inbound",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                "resolutionResult": {
                    "url": "/bsp/sap/crm_ui_start/default.htm",
                    "applicationType": "WCF",
                    "sap.ui": { "technology": "WCF" }
                },
                "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "sap-system": {
                            "defaultValue": {
                                "value": "UR3CLNT120",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "technicalId": {
                            "renameTo": "crm-targetId",
                            "required": true
                        }
                    }
                }
            },
            oOldAppStateData: {},
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            expectedResolutionResult: {
                "applicationType": "WCF",
                "text": "",
                "additionalInformation": "",
                "navigationMode": "embedded",
                "reservedParameters": {},
                "fullWidth": true,
                "url": "https://example.corp.com:44355/sap/bc/bsp/sap/crm_ui_start/default.htm?sap-client=120&sap-language=en&crm-targetId=MD-BP-OV&saprole=SUPPLIER",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "a WCF target with defined title is resolved",
            "intent": "Shell-startWCF?technicalId=MD-BP-OV&saprole=SUPPLIER",
            "inbound": {
                "semanticObject": "Shell",
                "action": "startWCF",
                "id": "Shell-startWCF",
                "title": "WCF target inbound",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                "resolutionResult": {
                    "url": "/bsp/sap/crm_ui_start/default.htm",
                    "applicationType": "WCF",
                    "sap.ui": { "technology": "WCF" },
                    "text": "WCF target inbound"
                },
                "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "sap-system": {
                            "defaultValue": {
                                "value": "UR3CLNT120",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "technicalId": {
                            "renameTo": "crm-targetId",
                            "required": true
                        }
                    }
                }
            },
            oOldAppStateData: {},
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            expectedResolutionResult: {
                "applicationType": "WCF",
                "text": "WCF target inbound",
                "additionalInformation": "",
                "navigationMode": "embedded",
                "reservedParameters": {},
                "fullWidth": true,
                "url": "https://example.corp.com:44355/sap/bc/bsp/sap/crm_ui_start/default.htm?sap-client=120&sap-language=en&crm-targetId=MD-BP-OV&saprole=SUPPLIER",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "a WCF target is not resolved because technicalId is missing",
            "intent": "Shell-startWCF?saprole=SUPPLIER&sap-system=UR3CLNT120",
            "inbound": {
                "semanticObject": "Shell",
                "action": "startWCF",
                "id": "Shell-startWCF",
                "title": "WDF target inbound",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                "resolutionResult": {
                    "url": "/bsp/sap/crm_ui_start/default.htm",
                    "applicationType": "WCF",
                    "sap.ui": { "technology": "WCF" }
                },
                "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "sap-system": {
                            "defaultValue": {
                                "value": "UR3CLNT120",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "technicalId": {
                            "renameTo": "crm-targetId",
                            "required": true
                        }
                    }
                }
            },
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedResolve: false,
            expectedRejectError: "Could not resolve navigation target"
        },
        {
            testDescription: "an Easy User Access Menu WDA target is resolved with sap-system-src",
            // ignore certain fields not needed for the test
            "intent": "Shell-startWDA?sap-system=UR3CLNT120&sap-system-src=UV2CLNT120&sap-ui2-wd-app-id=EPM_POWL",
            "inbound": {
                "semanticObject": "Shell",
                "action": "startWDA",
                "id": "Shell-startWDA~6NM",
                "title": "Title",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                "resolutionResult": {
                   "applicationType": "whatever",
                   "additionalInformation": "whatever",
                   "text": "whatever",
                   "url": "whatever",
                   "systemAlias": "whatever"
                },
                "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                      "sap-system": {
                         "filter": {
                            "value": "UR3CLNT120",
                            "format": "plain"
                         },
                         "required": true
                      }
                   }
                }
            },
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oLocalStorageContent: {
                "sap-system-data#UV2CLNT120:UR3CLNT120": (function (oSystemData) {
                    // stored data are different than the adapter's data
                    oSystemData.language = "DE";
                    oSystemData.client = "200";
                    oSystemData.https.host = "ur3.example.corp.com";
                    oSystemData.https.port = 8080;

                    return JSON.stringify(oSystemData);
                })(utils.clone(O_KNOWN_SYSTEM_ALIASES.UR3CLNT120))
            },
            oOldAppStateData: {},
            expectedResolve: true,
            expectedResolutionResult: {
                "additionalInformation": "",
                "applicationType": "NWBC",
                "sap-system": "UR3CLNT120",
                "sap-system-src": "UV2CLNT120",
                "text": "EPM_POWL",
                "url": "https://ur3.example.corp.com:8080/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-client=200&sap-language=DE",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "an Easy User Access Menu GUI resolution is rejected dure to missing system data in local storage",
            "intent": "Shell-startGUI?sap-system=ALIASRFC&sap-system-src=OTHERSYS&sap-ui2-tcode=SU01",
            "inbound": oTestHelper.createInbound("#Shell-startGUI{sap-system:ALIASRFC<+>}", {
                "applicationType": "whatever",
                "additionalInformation": "whatever",
                "text": "whatever",
                "url": "whatever",
                "systemAlias": "whatever"
            }),
            oLocalStorageContent: {}, // nothing saved in local storage
            oKnownSapSystemData: {
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            expectedResolve: false,
            expectedRejectError: "Cannot find data for system 'ALIASRFC' in local storage using key 'sap-system-data#OTHERSYS:ALIASRFC'"
        },
        {
            testDescription: "an Easy User Access Menu GUI with sap-system-src",
            "intent": "Shell-startGUI?sap-system=ALIASRFC&sap-system-src=OTHERSYS&sap-ui2-tcode=SU01",
            "inbound": {
                "semanticObject": "Shell",
                "action": "startGUI",
                "id": "Shell-startGUI~6NM",
                "title": "whatever",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                "resolutionResult": {
                   "applicationType": "whatever",
                   "additionalInformation": "whatever",
                   "text": "whatever",
                   "url": "whatever",
                   "systemAlias": "whatever"
                },
                "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
                "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                      "sap-system": {
                         "filter": {
                            "value": "ALIASRFC",
                            "format": "plain"
                         },
                         "required": true
                      }
                   }
                }
            },
            oKnownSapSystemData: {
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oLocalStorageContent: {
                "sap-system-data#OTHERSYS:ALIASRFC": (function (oSystemData) {
                    // stored data are different than the adapter's data
                    oSystemData.language = "DE";
                    oSystemData.client = "200";
                    oSystemData.https.host = "othersys.example.corp.com";
                    oSystemData.https.port = 8080;
                    oSystemData.rfc.systemId = "OTH";

                    return JSON.stringify(oSystemData);
                })(utils.clone(O_KNOWN_SYSTEM_ALIASES.ALIASRFC))
            },
            expectedResolutionResult: {
             "additionalInformation": "whatever",
              "applicationType": "TR",
              "sap-system": "ALIASRFC",
              "sap-system-src": "OTHERSYS",
              "text": "SU01",
              "url": "https://othersys.example.corp.com:8080/path/gui/sap/its/webgui;~sysid=OTH;~loginGroup=SPACE;~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=9?%7etransaction=SU01&%7enosplash=1&sap-client=200&sap-language=DE&sap-system-src=OTHERSYS",
              "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "URL target with sap-system, in the context of sap-system-src",
            "intent": "Action-toSomeURL?sap-system=ALIAS111&sap-system-src=SYSTEM2",
            "inbound": oTestHelper.createInbound("#Action-toSomeURL{<no params><+>}", {
                applicationType: "URL",
                "sap.ui": { technology: "URL" },
                url: "/some/url"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }),
            oLocalStorageContent: {
                // stored data are different than the adapter's data
                "sap-system-data#SYSTEM2:ALIAS111": JSON.stringify(O_KNOWN_SYSTEM_ALIASES.SYS_IT_NO_R3)
            },
            oKnownSapSystemData: {
                "ALIAS111": O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH
            },
            expectedResolutionResult: {
                "applicationType": "URL",
                "reservedParameters": {},
                "sap-system": "ALIAS111",
                "sap-system-src": "SYSTEM2",
                "text": undefined,
                "url": "https://example.corp.com:44355/some/url?sap-client=815&sap-language=IT",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            "testDescription": "URL target with sap-system, in the context of sap-system-src and a sap-fiori-id",
            "intent": "Action-toSomeURL?sap-system=ALIAS111&sap-system-src=SYSTEM2&sap-fiori-id=12345",
            "inbound": oTestHelper.createInbound("#Action-toSomeURL{<no params><+>}", {
                applicationType: "URL",
                "sap.ui": { technology: "URL" },
                url: "/some/url"
            }, {
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }),
            oLocalStorageContent: {
                // stored data are different than the adapter's data
                "sap-system-data#SYSTEM2:ALIAS111": JSON.stringify(O_KNOWN_SYSTEM_ALIASES.SYS_IT_NO_R3)
            },
            oKnownSapSystemData: {
                "ALIAS111": O_KNOWN_SYSTEM_ALIASES.SYS_WITH_PATH
            },
            expectedResolutionResult: {
                "applicationType": "URL",
                "reservedParameters": {
                    "sap-fiori-id": ["12345"]
                },
                "sap-system": "ALIAS111",
                "sap-system-src": "SYSTEM2",
                "text": undefined,
                "url": "https://example.corp.com:44355/some/url?sap-client=815&sap-language=IT",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "an Easy User Access Menu transaction is resolved as SAPUI5 application is the application type is SAPUI5",
            "intent": "Shell-startGUI?sap-ui2-tcode=SU01",
            "inbound": oTestHelper.createInbound("#Shell-startGUI{sap-ui2-tcode:SU01<+>}", {
                "applicationType": "SAPUI5",
                "additionalInformation": "whatever",
                "text": "System U1Y on current client",
                "url": "http://someurl",
                "systemAlias": "whatever"
            }),
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "SAPUI5",
            expectedUrl: "http://someurl?sap-ui2-tcode=SU01"
        }, {
            testDescription: "easy access and permanentKey is not defined in the inbound",
            // ignore certain fields not needed for the test
            "intent": "Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL",
            "inbound": oTestHelper.createInbound("#Shell-startWDA{sap-system:UR3CLNT120<+>}", {
                "sap.platform.runtime": {
                    "anything": "copied"
                },
                "applicationType": "whatever",
                "additionalInformation": "whatever",
                "text": "System U1Y on current client",
                "url": "whatever",
                "systemAlias": "whatever"
            }, {
                "permanentKey": "Shell-startWDA"
            }),
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "NWBC",
            expectedResolutionResult:
            {
                "additionalInformation": "",
                "applicationType": "NWBC",
                "sap-system": "UR3CLNT120",
                "text": "EPM_POWL",
                "url": "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-client=120&sap-language=en",
                "sap.platform.runtime": { "anything": "copied" },
                "inboundPermanentKey": "Shell-startWDA"
            }
        }, {
            testDescription: "standard resolution and permanentKey is not defined in the inbound",
            intent: "Object-action?sap-ui-app-id-hint=app5",
            inbounds: [
                oTestHelper.createInbound("#Object-action{<no params><+>}", {
                    "appId": "app1",
                    "applicationType": "SAPUI5",
                    "url": ""
                }, {
                    "title": "app1",
                    "id": "testId"
                })
            ],
            expectedResolutionResult: {
                "applicationType": "SAPUI5",
                "reservedParameters": {
                    "sap-ui-app-id-hint": ["app5"]
                },
                "sap-system": undefined,
                "text": "app1",
                "url": "",
                "inboundPermanentKey": "testId"
            }
        }, {
            testDescription: "merge parameters",
            intent: "Employee-display?sap-xapp-state=ASOLD",
            inbounds: [{
                "semanticObject": "Employee",
                "action": "display",
                "id": "Employee-display",
                "title": "Display an employee",
                "resolutionResult": {
                    "applicationType": "SAPUI5",
                    "additionalInformation": "whatever",
                    "text": "System U1Y on current client",
                    "url": "http://someurl",
                    "systemAlias": "whatever"
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "p1": {
                            "defaultValue": {
                                "value": "v1",
                                "format": "plain"
                            },
                            "required": false,
                            "renameTo": "p1Renamed"
                        },
                        "p2": {
                            "defaultValue": {
                                "value": "v2",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "sap-prelaunch-operations": {
                            "defaultValue": {
                                "value": JSON.stringify([{
                                    type: "merge",
                                    source: ["p1Renamed", "p2"],
                                    target: "pNew"
                                }]),
                                "format": "plain"
                            },
                            "required": false
                        }
                    }
                }
            }],
            oOldAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    SelectOptions: [{
                        "PropertyName": "p1",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "v1",
                            "High": null
                        }]
                    }, {
                        "PropertyName": "p2",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "v2",
                            "High": null
                        }]
                    }]
                }
            },
            expectedAppStateName: "ASNEW2",
            expectedAppStateData: {
              "selectionVariant": {
                "ODataFilterExpression": "",
                "Parameters": [],
                "SelectOptions": [{
                    "PropertyName": "p1Renamed",
                    "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "v1",
                        "High": null
                    }]
                }, {
                    "PropertyName": "p2",
                    "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "v2",
                        "High": null
                    }]
                }, {
                    "PropertyName": "pNew",
                    "Ranges": [{
                        "High": "v2",
                        "Low": "v1",
                        "Option": "BT",
                        "Sign": "I"
                    }]
                }],
                "SelectionVariantID": "",
                "Text": "Selection Variant with ID",
                "Version": {
                  "Major": "1",
                  "Minor": "0",
                  "Patch": "0"
                }
              }
            },
            expectedResolutionResult: {
                "additionalInformation": "whatever",
                "applicationType": "SAPUI5",
                "inboundPermanentKey": "Employee-display",
                "reservedParameters": {
                  "sap-prelaunch-operations": "[{\"type\":\"merge\",\"source\":[\"p1Renamed\",\"p2\"],\"target\":\"pNew\"}]"
                },
                "sap-system": undefined,
                "text": "Display an employee",
                "url": "http://someurl?p1Renamed=v1&p2=v2&sap-ushell-defaultedParameterNames=%5B%22p1Renamed%22%2C%22p2%22%5D&sap-xapp-state=ASNEW2"
            }
        }
    ];

    function test (oFixture) {
        jQuery.sap.log.setLevel(5);

        // Fixture Defaulting
        if (!oFixture.hasOwnProperty("expectedResolve")) {
            oFixture.expectedResolve = true;
        }

        QUnit.test("Complete resolveHashFragment for intent " + oFixture.intent + " when " + oFixture.testDescription, function (assert) {
            // Given that we mock some services, here there is an explicit list
            // of the non-mocked ones.
            var fnDone = assert.async();
            var oNewAppStates = [new FakeAppState("ASNEW", {}), new FakeAppState("ASNEW2", {})];
            var oNewAppState = oFixture.expectedAppStateName === "ASNEW2" ? oNewAppStates[1] : oNewAppStates[0];
            var oAllowedRequireServices = {
                "URLParsing": true,
                "ShellNavigation": true,
                "ReferenceResolver": true,
                "UserInfo": {
                    getUser: sinon.stub().returns({
                        getTheme: sinon.stub().returns("sap_belize"),
                        getContentDensity: sinon.stub().returns("cozy")
                    })
                },
                "AppState": (function () {
                    var iCnt = 0;

                    return {
                        getAppState: sinon.stub().returns(
                            new jQuery.Deferred().resolve(new FakeAppState("ASOLD", oFixture.oOldAppStateData)).promise()
                        ),
                        createEmptyAppState: function () {
                            return oNewAppStates[iCnt++];
                        }
                    };
                })()
            };

            sinon.stub(jQuery.sap.log, "error");
            sinon.stub(jQuery.sap.log, "warning");

            if (oFixture.sCurrentApplicationType) {
                oAppConfiguration.setCurrentApplication({
                    applicationType: oFixture.sCurrentApplicationType
                    // remaining fields of this object are not relevant for
                    // this test.
                });
            }

            var oMockedLocalStorageContent = oFixture.oLocalStorageContent || {};
            sinon.stub(utils, "getLocalStorage").returns({
                getItem: function (sKey) {
                    if (!oMockedLocalStorageContent.hasOwnProperty(sKey)) {
                        return null; // localStorage return value when key is not found
                    }
                    return oMockedLocalStorageContent[sKey];
                }
            });

            var aFixtureInbounds = oFixture.inbounds || [ oFixture.inbound ];
            var aFixtureInboundsClone = aFixtureInbounds.map(function (oInbound) {
                return jQuery.extend(true, {}, oInbound);
            });
            // for one test case, the inbound.resolutionResult.url has to be undefined
            // we check for this as jQuery.extend can't handle that.

            if (oFixture.testDescription === "UI5 with undefined URL") {
                    aFixtureInboundsClone[0].resolutionResult.url = undefined;
            }

            // WOrk
            var oFakeAdapter = {
                resolveSystemAlias: function (sSystemAlias) {
                    var oDeferred = new jQuery.Deferred();
                    if (oFixture.oKnownSapSystemData && oFixture.oKnownSapSystemData.hasOwnProperty(sSystemAlias)) {
                        return oDeferred.resolve(oFixture.oKnownSapSystemData[sSystemAlias]).promise();
                    }
                    if (sSystemAlias === "") {
                        return oDeferred.resolve(O_KNOWN_SYSTEM_ALIASES.LOCAL_SYSTEM).promise();
                    }
                    return oDeferred.reject("Cannot resolve system alias").promise();
                },
                getInbounds: sinon.stub().returns(
                    new jQuery.Deferred().resolve(aFixtureInboundsClone).promise()
                ),
                resolveHashFragmentFallback: function (oIntent, oMatchingTarget, oParameters) {
                    var obj = { url: "fallback :-(" + JSON.stringify(oParameters).replace(/["]/g, "").replace(/\\/g, "") };
                    if (oMatchingTarget.resolutionResult && oMatchingTarget.resolutionResult["sap.platform.runtime"]) {
                        obj["sap.platform.runtime"] = oMatchingTarget.resolutionResult["sap.platform.runtime"];
                    }
                    return new jQuery.Deferred().resolve(obj).promise();
                }
            };

            function FakeAppState (sKey, oData) {
                this.oData = oData;
                this.getKey = function () { return sKey; };
                this.getData = function () { return this.oData; };
                this.setData = function (oData) { this.oData = oData; };
                this.save = function () { return new jQuery.Deferred().resolve().promise(); };
            }

            oFixture.UserDefaultParameters = oFixture.UserDefaultParameters || {};

            // mutate the fixture
            Object.keys(oFixture.UserDefaultParameters).forEach(function (sName) {
                var oMember = oFixture.UserDefaultParameters[sName];
                if (oMember.value === "HUGE") {
                    oMember.value = genStr("ABCDEFGHIJKLMN", 2049);
                }
            });

            var fnFactory = sap.ushell.Container.getService;
            var oShellNavigationService = sap.ushell.Container.getService("ShellNavigation");
            var oUserDefaultParametersMock = {
                    getValue: function (sName) {
                        return new jQuery.Deferred().resolve(oFixture.UserDefaultParameters[sName] || { value: undefined}).promise();
                    }
            };

            sinon.stub(sap.ushell.Container, "getService", function (sName) {
                if (sName === "UserDefaultParameters") {
                    return oUserDefaultParametersMock;
                }

                // return the result of the real service call
                if (oAllowedRequireServices[sName] === true) {
                    return fnFactory.bind(sap.ushell.Container)(sName);
                }

                if (!oAllowedRequireServices[sName]) {
                    assert.ok(false, "Test is not accessing " + sName);
                }

                // return mocked service
                return oAllowedRequireServices[sName];
            });

            sinon.stub(sap.ushell.Container, "getUser").returns({
                getLanguage: sinon.stub().returns((oFixture.UserEnvParameters && oFixture.UserEnvParameters["sap-language"]) || "en"),
                getAccessibilityMode: sinon.stub().returns((oFixture.UserEnvParameters && oFixture.UserEnvParameters["sap-accessibility"]) || false)
            });

            sinon.stub(sap.ui, "getCore").returns({
                getConfiguration: sinon.stub().returns({ // fake ui5 configuration
                    getStatistics: sinon.stub().returns((oFixture.UserEnvParameters && oFixture.UserEnvParameters["sap-statistics"]) || false),
                    getLanguage: sinon.stub().returns("en"),
                    getSAPLogonLanguage: sinon.stub().returns("EN")
                })
            });
            sinon.spy(oShellNavigationService, "compactParams");

            var oSrvc = createService({
                adapter: oFakeAdapter,
                configuration: oFixture.oCSTRConfig || {}
            });

            var fnOrigSelectSystemAliasDataName = oSrvc._selectSystemAliasDataName;
            oSrvc._selectSystemAliasDataName = function (oSystemAliasCollection, sBrowserLocationProtocol) {
                if (sBrowserLocationProtocol === "http") {
                    sBrowserLocationProtocol = "https"; // force https URL
                }
                return fnOrigSelectSystemAliasDataName.call(this, oSystemAliasCollection, sBrowserLocationProtocol);
            };

            var fnSortByPropertyName = function (a, b) {
                if (a.PropertyName < b.PropertyName) {
                    return -1;
                }
                if (a.PropertyName > b.PropertyName) {
                    return 1;
                }

                return 0;
            };

            // Act
            oSrvc.resolveHashFragment(oFixture.intent, /*fnBoundFallback*/ function () {
                assert.ok(false, "fallback function is not called");
            })
                .done(function (oResolutionResult) {
                    if (!oFixture.expectedResolve) {
                        assert.ok(false, "promise was rejected");
                        return;
                    }

                    assert.ok(true, "promise was resolved");

                    if (oFixture.expectedResolutionResult) {
                        if (oResolutionResult.appCapabilities) {
                            assert.deepEqual(oResolutionResult.appCapabilities.statefulContainer[oFixture.appCapabilitiesNames.attribute], oFixture.appCapabilitiesNames.value, "correct appCapabilities result");
                            delete oResolutionResult.appCapabilities;
                        }
                        assert.deepEqual(oResolutionResult, oFixture.expectedResolutionResult, "correct resolution result");
                    }
                    if (oFixture.expectedTransientCompaction) {
                        assert.deepEqual(oShellNavigationService.compactParams.args[0][3], true, "compactParams invoked with transient indication");
                    }
                    // test the xapp-state key !
                    if (oFixture.expectedUrl) {
                        assert.strictEqual(oResolutionResult.url, oFixture.expectedUrl, "url correct");
                    }

                    if (typeof oFixture.expectedApplicationType !== "undefined") {
                        assert.strictEqual(oResolutionResult.applicationType, oFixture.expectedApplicationType, "application type correct");
                    }

                    var oAppStateData = oNewAppState.getData();
                    if (oFixture.expectedAppStateData && jQuery.isEmptyObject(oFixture.expectedAppStateData)) {
                        assert.deepEqual(oAppStateData, oFixture.expectedAppStateData, "Appstate data is empty.");
                    } else if (oFixture.expectedAppStateData && oFixture.expectedAppStateData.selectionVariant) {
                        assert.ok(oAppStateData.selectionVariant, "The selectionVariant property is not empty.");
                        assert.ok(oAppStateData.selectionVariant.SelectOptions, "The SelectOptions property is not empty.");

                        // We must not rely on the order of the data in the AppState because it might vary between browsers, esp. IE11.
                        // Sort both arrays to ensure the same order.
                        oAppStateData.selectionVariant.SelectOptions.sort(fnSortByPropertyName);
                        oFixture.expectedAppStateData.selectionVariant.SelectOptions.sort(fnSortByPropertyName);

                        assert.deepEqual(oAppStateData, oFixture.expectedAppStateData, "Appstate data is correct.");
                    }

                    if (oFixture.expectedAppStateData2) {
                        assert.deepEqual(oNewAppStates[1].getData(), oFixture.expectedAppStateData2, "appstate data 2 correct");
                        if (oFixture.expectedAppStateData2 && oNewAppStates[1].getData().length > 2000) {
                            assert.deepEqual(oNewAppStates[1].getData().substr(2000), oFixture.expectedAppStateData2.substr(2000), "appstate data 2 2nd part correct");
                        }
                    }
                })
                .fail(function (sError) {
                    // Assert
                    if (oFixture.expectedResolve) {
                        assert.ok(false, "promise was resolved. Reject ERROR: " + sError);
                        return;
                    }

                    assert.ok(true, "promise was rejected");
                    assert.strictEqual(sError, oFixture.expectedRejectError, "promise was rejected with the expected error");
                })
                .always(function () {
                    assert.deepEqual(aFixtureInbounds, aFixtureInboundsClone,
                        "inbounds provided by getInbounds are not modified by resolveHashFragment");

                    testExpectedErrorAndWarningCalls(assert, oFixture);

                    oShellNavigationService.compactParams.restore();
                    fnDone();
                });
           });
    }

    return function () {
        aTestCases.forEach(test);
    };
});