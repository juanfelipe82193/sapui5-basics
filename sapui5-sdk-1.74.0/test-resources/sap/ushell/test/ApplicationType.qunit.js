// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/ApplicationType",
    "sap/ushell/services/URLParsing",
    "sap/ushell/_ApplicationType/systemAlias"
], function (oApplicationType, URLParsing, oSystemAlias) {
    "use strict";
    /* global QUnit sinon */
    var O_LOCAL_SYSTEM_ALIAS = { // local system alias (hardcoded in the adapter for now)
           "http": {
               "id": "",
               "host": "",
               "port": 0,
               "pathPrefix": "/sap/bc/"
           },
           "https": {
               "id": "",
               "host": "",
               "port": 0,
               "pathPrefix": "/sap/bc/"
           },
           "rfc": {
               "id": "",
               "systemId": "",
               "host": "",
               "service": 0,
               "loginGroup": "",
               "sncNameR3": "",
               "sncQoPR3": ""
           },
           "id": "",
           "client": "",
           "language": ""
        };

    var O_KNOWN_SYSTEM_ALIASES = {
        "UR3CLNT120": {
            "http": {
                "id": "UR3CLNT120_HTTP",
                "host": "example.corp.com",
                "port": "50055",   // note: string is also valid for the port
                "pathPrefix": ""
            },
            "https": {
                "id": "UR3CLNT120_HTTPS",
                "host": "example.corp.com",
                "port": 44355,
                "pathPrefix": ""
            },
            "rfc": {
                "id": "UR3CLNT120",
                "systemId": "",
                "host": "example.corp.com",
                "service": 3255,
                "loginGroup": "",
                "sncNameR3": "p/secude:CN=UR3, O=SAP-AG, C=DE",
                "sncQoPR3": "8"
            },
            "id": "UR3CLNT120",
            "client": "120",
            "language": ""
        },
        "SYSCONNSTRING": {
            "http": {
                "id": "UR3CLNT120_HTTP",
                "host": "example.corp.com",
                "port": "50055",   // note: string is also valid for the port
                "pathPrefix": ""
            },
            "https": {
                "id": "UR3CLNT120_HTTPS",
                "host": "example.corp.com",
                "port": 44355,
                "pathPrefix": ""
            },
            "rfc": {
                "id": "UR3CLNT120",
                "systemId": "",
                "host": "/H/Coffee/S/Decaf/G/Roast",
                "service": 3255,
                "loginGroup": "",
                "sncNameR3": "p/secude:CN=UR3, O=SAP-AG, C=DE",
                "sncQoPR3": "8"
            },
            "id": "UR3CLNT120",
            "client": "120",
            "language": ""
        },
        "ALIASRFC": {
            "http": {
                "id": "ALIASRFC_HTTP",
                "host": "example.corp.com",
                "port": 50055,
                "pathPrefix": "/aliaspath//"
            },
            "https": {
                "id": "ALIASRFC_HTTPS",
                "host": "example.corp.com",
                "port": 1111,
                "pathPrefix": "/path/"
            },
            "rfc": {
                "id": "ALIASRFC",
                "systemId": "UV2",
                "host": "ldcsuv2",
                "service": 32,
                "loginGroup": "SPACE",
                "sncNameR3": "p/secude:CN=UXR, O=SAP-AG, C=DE",
                "sncQoPR3": "9"
            },
            "id": "ALIASRFC",
            "client": "220",
            "language": ""
        },
        "ALIAS111": {
            "http": {
                "id": "ALIAS111",
                "host": "vmw.example.corp.com",
                "port": 44335,
                "pathPrefix": "/go-to/the/moon"
            },
            "https": {
                "id": "ALIAS111_HTTPS",
                "host": "vmw.example.corp.com",
                "port": 44335,
                "pathPrefix": "/go-to/the/moon"
            },
            "rfc": {
                "id": "",
                "systemId": "",
                "host": "",
                "service": 32,
                "loginGroup": "",
                "sncNameR3": "",
                "sncQoPR3": ""
            },
            "id": "ALIAS111",
            "client": "111",
            "language": ""
        },
        "EMPTY_PORT_PREFIX_RFC": {
            // typical system alias defined in HCP
            "id": "ABAP_BACKEND_FOR_DEMO",
            "language": "",
            "client": "",
            "https": {
                "id": "ABAP_BACKEND_FOR_DEMO",
                "host": "system.our.domain.corp",
                "port": 0,       // note: null port
                "pathPrefix": "" // note: empty path prefix
            },
            "rfc": {}  // note: empty RFC
        },
        "MULTIPLE_INVALID_FIELDS": {
            "http": {
                "id": "SYS",
                "host": 123,  // note: should be a string
                "port": "",   // note: this is ok: string or number
                "pathPrefix": "/go-to/the/moon"  // this is correct
            },
            "https": {
                "id": "SYS",
                // "host": "vmw.example.corp.com",  // no host provided
                "port": [44335],  // no string or number
                "pathPrefix": 456  // note: should be a string
            },
            "rfc": {
                "id": "",
                "systemId": "",
                "host": "",
                "service": 32,
                "loginGroup": "",
                "sncNameR3": "",
                "sncQoPR3": ""
            },
            "id": "SYS",
            "client": "120",
            "language": ""
        },
        "ONLY_RFC": {
            "rfc": {
                "id": "SYS",
                "systemId": "SYS",
                "host": "ldcisys",
                "service": 32,
                "loginGroup": "SPACE",
                "sncNameR3": "",
                "sncQoPR3": ""
            },
            "id": "SYS",
            "client": "120",
            "language": ""
        }
   };

    QUnit.module("sap.ushell.ApplicationType", {
        beforeEach: function () { },
        afterEach: function () { }
    });

    QUnit.test("module exports an object", function (assert) {
        assert.strictEqual(
            Object.prototype.toString.apply(oApplicationType),
            "[object Object]",
            "got an object back"
        );
    });

    [
        /*
         * Fixture format
         *
         * - expectSuccess: required boolean
         * - expectedWarnings: optional
         * - expectedResolutionResult: to check for the complete resolution result
         */
        {
            testDescription: "a valid (transaction) intent is provided",
            oIntent: {
                semanticObject: "Shell",
                action: "startGUI",
                params: {
                    "sap-system": ["ALIASRFC"],
                    "sap-ui2-tcode": ["SU01"]
                }
            },
            expectedResolutionResult: {
                url: "https://example.corp.com:1111/path/gui/sap/its/webgui;~sysid=UV2;~loginGroup=SPACE;~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=9?%7etransaction=SU01&%7enosplash=1&sap-client=220&sap-language=EN", // see below
                applicationType: "TR", // simply add "TR"
                text: "SU01",
                additionalInformation: "", // leave empty
                "sap-system": "ALIASRFC" // propagate sap-system in here
            }
        }, {
            testDescription: "a valid (transaction) intent is provided with extra parameters",
            oIntent: {
                semanticObject: "Shell",
                action: "startGUI",
                params: {
                    "sap-system": ["ALIASRFC"],
                    "sap-ui2-tcode": ["*SU01"],
                    "sap-theme": ["sap_hcb"],
                    "some_parameter": ["some_value"]
                }
            },
            /*
             * Note: do not fail anymore here, we
             * just resolve now because the target mapping is assumed to be there
             * in the correct format
             */
            expectedResolutionResult: {
                "additionalInformation": "",
                "applicationType": "TR",
                "sap-system": "ALIASRFC",
                "text": "*SU01",
                "url": "https://example.corp.com:1111/path/gui/sap/its/webgui;~sysid=UV2;~loginGroup=SPACE;~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=9?%7etransaction=*SU01&%7enosplash=1&sap-client=220&sap-language=EN"
            }
        }, {
            testDescription: "a valid (wda) intent is provided",
            oIntent: {
                semanticObject: "Shell",
                action: "startWDA",
                params: {
                    "sap-system": ["UR3CLNT120"],
                    "sap-ui2-wd-app-id": ["APPID"]
                }
            },
            expectedResolutionResult: {
                url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/APPID/?sap-client=120&sap-language=EN",
                applicationType: "NWBC",
                text: "APPID",
                additionalInformation: "",
                "sap-system": "UR3CLNT120"
            }
        }, {
            testDescription: "a valid (wda) intent with sap-wd-conf-id is provided",
            oIntent: {
                semanticObject: "Shell",
                action: "startWDA",
                params: {
                    "sap-system": ["UR3CLNT120"],
                    "sap-ui2-wd-app-id": ["APPID"],
                    "sap-ui2-wd-conf-id": ["CONFIG_PARAMETER"]
                }
            },
            expectedResolutionResult: {
                url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/APPID/?sap-wd-configId=CONFIG_PARAMETER&sap-client=120&sap-language=EN",
                applicationType: "NWBC",
                text: "APPID",
                additionalInformation: "",
                "sap-system": "UR3CLNT120"
            }
        }, {
            testDescription: "a valid (wda) intent with sap-wd-conf-id with special characters is provided",
            oIntent: {
                semanticObject: "Shell",
                action: "startWDA",
                params: {
                    "sap-system": ["UR3CLNT120"],
                    "sap-ui2-wd-app-id": ["APPID"],
                    "sap-ui2-wd-conf-id": ['CO!@^*()_ ":{}<>NFIG']
                }
            },
            expectedResolutionResult: {
                url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/APPID/?sap-wd-configId=CO!%40%5E*()_%20%22%3A%7B%7D%3C%3ENFIG&sap-client=120&sap-language=EN",
                applicationType: "NWBC",
                text: "APPID",
                additionalInformation: "",
                "sap-system": "UR3CLNT120"
            }
        }, {
            testDescription: "a valid (wda) intent is provided with extra parameters",
            oIntent: {
                semanticObject: "Shell",
                action: "startWDA",
                params: {
                    "sap-system": ["UR3CLNT120"],
                    "sap-ui2-wd-app-id": ["APPID"],
                    "sap-theme": ["sap_hcb"],
                    "some_parameter": ["some_value"]
                }
            },
            expectedResolutionResult: {
                url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/APPID/?sap-theme=sap_hcb&some_parameter=some_value&sap-client=120&sap-language=EN",
                applicationType: "NWBC",
                text: "APPID",
                additionalInformation: "",
                "sap-system": "UR3CLNT120"
            }
        }
    ].forEach(function (oFixture) {

        QUnit.test("resolveEasyAccessMenuIntent returns the correct resolution result when " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();

            window.sap = {
                ushell: {
                    Container: {
                        getUser: sinon.stub().returns({
                            getLanguage: sinon.stub().returns("EN")
                        }),
                        getService: sinon.stub().withArgs("URLParsing").returns(new URLParsing())
                    }
                }
            };

            var fnExternalResolver = function (sSystemAlias) {
                if (sSystemAlias === "") {
                    return new jQuery.Deferred().resolve(O_LOCAL_SYSTEM_ALIAS).promise();
                }
                if (O_KNOWN_SYSTEM_ALIASES.hasOwnProperty(sSystemAlias)) {
                    return new jQuery.Deferred().resolve(O_KNOWN_SYSTEM_ALIASES[sSystemAlias]).promise();
                }
                return new jQuery.Deferred().reject("Cannot resolve unknown system alias").promise();
            };

            // Act
            var sIntent = [oFixture.oIntent.semanticObject, oFixture.oIntent.action].join("-");
            var fnResolver =  oApplicationType.getEasyAccessMenuResolver(sIntent);
            if (!fnResolver) {
                assert.ok(false, "resolver was not returned");
                fnDone();
                return;
            }
            assert.ok(true, "resolver was returned");

            fnResolver(oFixture.oIntent, {
                resolutionResult: {},
                intentParamsPlusAllDefaults: {
                    "sap-system": [oFixture.oIntent["sap-system"]]
                },
                inbound: {
                    "semanticObject": "Shell",
                    "action": "startGUI",
                    "id": "Shell-startGUI~686q",
                    "title": "DUMMY",
                    "resolutionResult": {
                        "applicationType": "TR",
                        "additionalInformation": "",
                        "text": "DUMMY",
                        "url": "/ui2/nwbc/~canvas;window=app/transaction/DUMMY?sap-client=120&sap-language=EN",
                        "systemAlias": ""
                    },
                    "deviceTypes": {
                        "desktop": true,
                        "phone": false,
                        "tablet": false
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "sap-ui2-tcode": {
                                "required": true,
                                "filter": {
                                    "value": ".+",
                                    "format": "regexp"
                                }
                            },
                            "sap-system": {
                                "required": true,
                                "filter": {
                                    "value": ".+",
                                    "format": "regexp"
                                }
                            }
                        }
                    }
                }
            }, fnExternalResolver)
            .then(function (oResolutionResultGot) {
                // Assert
                if (oFixture.expectedError) {
                    assert.ok(false, "promise was rejected");
                } else {
                    assert.ok(true, "promise was resolved");
                    assert.strictEqual(jQuery.isPlainObject(oResolutionResultGot), true, "an object was returned");

                    if (oFixture.expectedResolutionResult) {
                        assert.deepEqual(oResolutionResultGot, oFixture.expectedResolutionResult,
                            "obtained the expected resolution result");
                    }
                }
            }, function (sErrorGot) {
                // Assert
                if (oFixture.expectedError) {
                    assert.ok(true, "promise was rejected");
                    assert.strictEqual(sErrorGot, oFixture.expectedError, "expected error was returned");
                } else {
                    assert.ok(false, "promise was resolved");
                }
            })
            .then(fnDone, fnDone);
        });
    });

    [{
        testDescription: "return null for Shell-startGUI when resolved application type is SAPUI5",
        sIntent: "Shell-startGUI",
        sResolvedApplicationType: "SAPUI5",
        bReturnResolver: false
    }, {
        testDescription: "return null for Shell-startWDA when resolved application type is SAPUI5",
        sIntent: "Shell-startWDA",
        sResolvedApplicationType: "SAPUI5",
        bReturnResolver: false
    }, {
        testDescription: "return resolver for easyaccess intent when resolved application type is not SAPUI5",
        sIntent: "Shell-startGUI",
        sResolvedApplicationType: "TR",
        bReturnResolver: true
    }, {
        testDescription: "return null for not easyaccess intent",
        sIntent: "Acction-foo",
        sResolvedApplicationType: "TR",
        bReturnResolver: false
    }, {
        testDescription: "return resolver for easyaccess intent when application type is not defined",
        sIntent: "Shell-startGUI",
        sResolvedApplicationType: undefined,
        bReturnResolver: true
    }].forEach(function (oFixture) {
        QUnit.test("resolveEasyAccessMenuIntent: " + oFixture.testDescription, function (assert) {
            var oResolved = oApplicationType.getEasyAccessMenuResolver(oFixture.sIntent, oFixture.sResolvedApplicationType);
            assert.equal(!!oResolved, oFixture.bReturnResolver, "Resolver should be returned: " + oFixture.bReturnResolver);
        });
    });





});
