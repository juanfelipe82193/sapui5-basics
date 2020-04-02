// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.LaunchPageAdapter
 */

sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/adapters/cdm/ClientSideTargetResolutionAdapter",
    "sap/ushell/services/Container"
], function(testUtils, ClientSideTargetResolutionAdapter) {
    "use strict";
    /*global test deepEqual asyncTest strictEqual module start jQuery ok sinon sap */

    var O_LOCAL_SYSTEM_ALIAS = {
        http: {
            host: "",
            port: 0,
            pathPrefix: "/sap/bc/"
        },
        https: {
            host: "",
            port: 0,
            pathPrefix: "/sap/bc/"
        },
        rfc: {
            systemId: "",
            host: "",
            service: 0,
            loginGroup: "",
            sncNameR3: "",
            sncQoPR3: ""
        },
        id: "",
        client: "",
        language: ""
    };

    var O_SYSTEM_ALIASES = {
        "AA2CLNT000": {
            id: "AA2CLNT000",
            client: "000",
            systemId:"AB2",
            language: "EN",
            http: {
                host: "ldcaa2.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcaa2.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "AB2",
                host: "ldcsaa2.xyz.com",
                service : 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        },
        "AB2CLNT000": {
            id: "AB2CLNT000",
            client: "000",
            systemId:"AB2",
            language: "EN",
            http: {
                host: "ldcab2.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcab2.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "AB2",
                host: "ldcsab2.xyz.com",
                service : 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        },
        "AB1CLNT000": {
            id: "AB1CLNT000",
            client: "000",
            systemId:"AB1",
            language: "EN",
            http: {
                host: "ldcab1.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcab1.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "AB1",
                host: "ldcsab1.xyz.com",
                service : 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        },
        "XYZCLNT000": {
            id: "XYZCLNT000",
            client: "000",
            systemId:"XYZ",
            language: "EN",
            http: {
                host: "ldcxyz.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcxyz.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "XYZ",
                host: "ldcxyz.xyz.com",
                service : 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        },
        "DuplicateToAbove": {
            id: "duplicateToAbove",
            client: "000",
            systemId:"XYZ",
            language: "EN",
            http: {
                host: "ldcxyz.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcxyz.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "XYZ",
                host: "ldcxyz.xyz.com",
                service : 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        },
        "sid(U1Y.120)": {
            id: "sid(U1Y.120)",
            client: "120",
            language: "EN",
            http: {
                host: "ldcu1y.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcu1y.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "U1Y",
                host: "ldcu1y.xyz.com",
                service : 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        },
        "U2YCLNT120": {
            id: "U2YCLNT120",
            client: "120",
            language: "EN",
            http: {
                host: "ldcu2y.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcu2y.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "U2Y",
                host: "ldcu2y.xyz.com",
                service : 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        }
    };

    module("sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter", {
        setup : function() {
            this.oAdapter = new ClientSideTargetResolutionAdapter(
                undefined, undefined, {
                    config : {}
                });

            // local bootstrap, so not all needs to be done manually.
            // note: some adapters are stubbed later
            stop();
            sap.ushell.bootstrap("local").done(function () {
                start();
            });
        },
        teardown : function() {
            testUtils.restoreSpies(
                    sap.ushell.Container.getServiceAsync,
                    jQuery.sap.log.error,
                    jQuery.sap.log.warning
            );
            delete sap.ushell.Container;
            delete this.oAdapter;
        }
    });

    [
        {
            testDescription: "site promise is rejected",
            sSystemAlias: "anything",
            bGetSystemAliasesPromiseRejected: true,
            expectedSystemAliasPromiseRejected: true, // test this
            expectedSystemAliasPromiseRejectedArg: undefined,
            expectedSystemAliasPromiseRejectedWarningArgs: undefined,
            oSystemAliases: { "any": "thing" }
        },
        {
            testDescription: "system alias is the empty string",
            sSystemAlias: "",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: false,
            oSystemAliases: {}, // nothing known
            expectedSystemAliasData: O_LOCAL_SYSTEM_ALIAS
        },
        {
            testDescription: "system alias is the empty string",
            sSystemAlias: "",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: false,
            oSystemAliases: { // another local system alias comes from the site
                "": {
                    id: "",
                    client: "123",
                    language: "it",
                    http: { },
                    https: { },
                    rfc: { }
                }
            },
            expectedSystemAliasData: {
                id: "",
                client: "123",
                language: "it",
                http: { },
                https: { },
                rfc: { }
            }
        },
        {
            testDescription: "a non-existing system alias is to be resolved",
            sSystemAlias: "DOES_NOT_EXIST",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: true,
            expectedSystemAliasPromiseRejectedArg: "Cannot resolve system alias DOES_NOT_EXIST",
            expectedSystemAliasPromiseRejectedWarningArgs: [
                "Cannot resolve system alias DOES_NOT_EXIST",
                "The system alias cannot be found in the site response",
                "sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter"
            ],
            oSystemAliases: {}
        },
        {
            testDescription: "system alias exists",
            sSystemAlias: "AB1CLNT000",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: false,
            oSystemAliases: O_SYSTEM_ALIASES,
            expectedSystemAliasData: O_SYSTEM_ALIASES["AB1CLNT000"]
        },
        {
            testDescription: "SID exists",
            sSystemAlias: "sid(AB1.000)",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: false,
            oSystemAliases: O_SYSTEM_ALIASES,
            expectedSystemAliasData: O_SYSTEM_ALIASES["AB1CLNT000"]
        },
        {
            testDescription: "SID does not exist -- empty alias object",
            sSystemAlias: "sid(AB1.000)",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: true,
            expectedSystemAliasPromiseRejectedArg: "Cannot resolve system alias SID(AB1.000)",
            oSystemAliases: {}
        },
        {
            testDescription: "SID does not exist",
            sSystemAlias: "sid(ABC.100)",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: true,
            expectedSystemAliasPromiseRejectedArg: "Cannot resolve system alias SID(ABC.100)",
            expectedSystemAliasPromiseRejectedWarningArgs: [
                "Cannot resolve system alias SID(ABC.100)",
                "The system alias cannot be found in the site response",
                "sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter"
            ],
            oSystemAliases: O_SYSTEM_ALIASES
        },
        {
            testDescription: "SID exist but with mixed case",
            sSystemAlias: "SiD(ab1.000)",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: false,
            oSystemAliases: O_SYSTEM_ALIASES,
            expectedSystemAliasData: O_SYSTEM_ALIASES["AB1CLNT000"]
        },
        {
            testDescription: "resolve directly on SID",
            sSystemAlias: "sid(U1Y.120)",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: false,
            oSystemAliases: O_SYSTEM_ALIASES,
            expectedSystemAliasData: O_SYSTEM_ALIASES["sid(U1Y.120)"]
        },
        {
            testDescription: "SID exists with more matching system Aliases",
            sSystemAlias: "sid(AB2.000)",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: false,
            oSystemAliases: O_SYSTEM_ALIASES,
            expectedSystemAliasData: O_SYSTEM_ALIASES["AA2CLNT000"] //First alphabetically sorted System Alias is returned
        },
        {
            testDescription: "SID exist but no system Id",
            sSystemAlias: "SID(U2Y.120)",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: true,
            expectedSystemAliasPromiseRejectedArg: "Cannot resolve system alias SID(U2Y.120)",
            expectedSystemAliasPromiseRejectedWarningArgs: [
                "Cannot resolve system alias SID(U2Y.120)",
                "The system alias cannot be found in the site response",
                "sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter"
            ],
            oSystemAliases: O_SYSTEM_ALIASES
        }
    ].forEach(function(oFixture) {
        asyncTest("resolveSystemAlias: " + oFixture.testDescription, function() {
            sinon.stub(jQuery.sap.log, "warning");

            var oGetSystemAliasesStub = sinon.stub(this.oAdapter, "_getSystemAliases");
            if (oFixture.bGetSystemAliasesPromiseRejected) {
                oGetSystemAliasesStub.returns(new jQuery.Deferred().reject().promise());
            } else {
                oGetSystemAliasesStub.returns(new jQuery.Deferred().resolve(oFixture.oSystemAliases).promise());
            }

            this.oAdapter.resolveSystemAlias(oFixture.sSystemAlias)
                .done(function (oResolvedSystemAlias) {
                    if (oFixture.expectedSystemAliasPromiseRejected) {
                        ok(false, "promise was rejected");
                    } else {
                        ok(true, "promise was resolved");
                    }

                    if (typeof oFixture.checkReturnedSystemAlias === "function") {
                        oFixture.checkReturnedSystemAlias(oResolvedSystemAlias);
                    } else {
                        deepEqual(oResolvedSystemAlias, oFixture.expectedSystemAliasData, "resolved to the expected system alias");
                    }
                })
                .fail(function (sMessage) {
                    if (oFixture.expectedSystemAliasPromiseRejected) {
                        ok(true, "promise was rejected");

                        if (oFixture.expectedSystemAliasPromiseRejectedWarningArgs) {
                            strictEqual(jQuery.sap.log.warning.callCount, 1, "jQuery.sap.log.warning was called 1 time");

                            deepEqual(jQuery.sap.log.warning.getCall(0).args, oFixture.expectedSystemAliasPromiseRejectedWarningArgs,
                                "jQuery.sap.log.warning called as expected");
                        }

                        strictEqual(sMessage, oFixture.expectedSystemAliasPromiseRejectedArg,
                            "promise was rejected with the expected message");
                    } else {
                        ok(false, "promise was resolved");
                    }
                })
                .always(function () {
                    start();
                });
        });
    });

    [
        {
            testDescription: "site promise resolves with system aliases",
            bSitePromiseRejected: false,
            oSiteSystemAliases: {
                "UI2_WDA": {
                    "http": {
                        "host": "",
                        "port": 0,
                        "pathPrefix": ""
                    },
                    "https": {
                        "host": "example.corp.com",
                        "port": 44355,
                        "pathPrefix": ""
                    },
                    "rfc": {
                        "systemId": "",
                        "host": "",
                        "service": 32,
                        "loginGroup": "",
                        "sncNameR3": "",
                        "sncQoPR3": ""
                    },
                    "client": "111",
                    "language": ""
                },
                "U1YCLNT000": {
                    "http": {
                        "host": "",
                        "port": 0,
                        "pathPrefix": ""
                    },
                    "https": {
                        "host": "example.corp.com",
                        "port": 44355,
                        "pathPrefix": ""
                    },
                    "rfc": {
                        "systemId": "",
                        "host": "",
                        "service": 32,
                        "loginGroup": "",
                        "sncNameR3": "",
                        "sncQoPR3": ""
                    },
                    "client": "000",
                    "language": ""
                },
                "U1YCLNT111": {
                    "http": {
                        "host": "",
                        "port": 0,
                        "pathPrefix": ""
                    },
                    "https": {
                        "host": "example.corp.com",
                        "port": 44355,
                        "pathPrefix": ""
                    },
                    "rfc": {
                        "systemId": "",
                        "host": "",
                        "service": 32,
                        "loginGroup": "",
                        "sncNameR3": "",
                        "sncQoPR3": ""
                    },
                    "client": "111",
                    "language": ""
                }
            },
            expectedSystemAliases: {
                "UI2_WDA": {
                    "http": {
                        "host": "",
                        "port": 0,
                        "pathPrefix": ""
                    },
                    "https": {
                        "host": "example.corp.com",
                        "port": 44355,
                        "pathPrefix": ""
                    },
                    "rfc": {
                        "systemId": "",
                        "host": "",
                        "service": 32,
                        "loginGroup": "",
                        "sncNameR3": "",
                        "sncQoPR3": ""
                    },
                    "id": "UI2_WDA",
                    "client": "111",
                    "language": ""
                },
                "U1YCLNT000": {
                    "http": {
                        "host": "",
                        "port": 0,
                        "pathPrefix": ""
                    },
                    "https": {
                        "host": "example.corp.com",
                        "port": 44355,
                        "pathPrefix": ""
                    },
                    "rfc": {
                        "systemId": "",
                        "host": "",
                        "service": 32,
                        "loginGroup": "",
                        "sncNameR3": "",
                        "sncQoPR3": ""
                    },
                    "id": "U1YCLNT000",
                    "client": "000",
                    "language": ""
                },
                "U1YCLNT111": {
                    "http": {
                        "host": "",
                        "port": 0,
                        "pathPrefix": ""
                    },
                    "https": {
                        "host": "example.corp.com",
                        "port": 44355,
                        "pathPrefix": ""
                    },
                    "rfc": {
                        "systemId": "",
                        "host": "",
                        "service": 32,
                        "loginGroup": "",
                        "sncNameR3": "",
                        "sncQoPR3": ""
                    },
                    "id": "U1YCLNT111",
                    "client": "111",
                    "language": ""
                }
            },
            expectedPromiseReject: false
        },
        {
            testDescription: "site promise rejects with an error message",
            bSitePromiseRejected: true,
            sSitePromiseRejectedWith: "deliberate error message",
            expectedPromiseReject: true,
            expectedPromiseRejectWith: "deliberate error message"
        }
    ].forEach(function (oFixture) {
        asyncTest("_getSystemAliases: returns the expected system aliases when " + oFixture.testDescription, function () {
            var oCDMServiceStub = {
                getSite: function() {
                    var oSiteResponse = {
                        systemAliases: oFixture.oSiteSystemAliases
                    };

                    if (oFixture.bSitePromiseRejected) {
                        return new jQuery.Deferred().reject(oFixture.sSitePromiseRejectedWith).promise();
                    }

                    return new jQuery.Deferred().resolve(oSiteResponse).promise();
                }
            };
            var oCDMServiceAsyncStub = new jQuery.Deferred().resolve(oCDMServiceStub).promise();

            sinon.stub(sap.ushell.Container, "getServiceAsync").returns(oCDMServiceAsyncStub);

            this.oAdapter._getSystemAliases()
                .done(function (oSystemAliases) {
                    if (oFixture.expectedPromiseReject) {
                        ok(false, "promise was rejected");
                    } else {
                        ok(true, "promise was resolved");
                    }

                    deepEqual(oSystemAliases, oFixture.expectedSystemAliases,
                        "got the expected system aliases");
                })
                .fail(function (sErr) {
                    if (oFixture.expectedPromiseReject) {
                        ok(true, "promise was rejected");

                        deepEqual(
                            sErr,
                            oFixture.expectedPromiseRejectWith,
                            "the promise was rejected with the expected arguments"
                        );
                    } else {
                        ok(false, "promise was resolved");
                    }

                })
                .always(function () {
                    start();
                });
        });
    });


    [
        {
            testDescription: "site data is empty",
            oSiteData: {},
            expectedInbounds: []
        },
        {
            testDescription: "single application with minimal settings defined",
            oSiteData: {
                "_version": "3.0.0",
                "applications":{
                    "AppDescId1234":{
                      "sap.app":{
                         "title":"translated title of application",
                         "applicationVersion":{
                             "version":"1.0.0"
                         },
                         "crossNavigation": {
                            "inbounds": {
                                "start": {
                                    "semanticObject": "Display",
                                    "action": "Desktop"
                                }
                            }
                        }
                      },
                      "sap.ui":{
                         "technology":"WDA",
                         "deviceTypes":{
                            "desktop":true,
                            "tablet":false,
                            "phone":false
                         }
                      }
                    }
                }
            },
            expectedInbounds: [
              {
                "action": "Desktop",
                "deviceTypes": {
                  "desktop": true,
                  "phone": false,
                  "tablet": false
                },
                "icon": undefined,
                "info": undefined,
                "resolutionResult": {
                  "appId": undefined,
                  "applicationType": "WDA",
                  "sap.wda": undefined,
                  "systemAlias": undefined,
                  "systemAliasSemantics": "apply",
                  "text": "translated title of application",
                  "sap.ui": {
                      "technology": "WDA"
                  }
                },
                "semanticObject": "Display",
                "shortTitle": undefined,
                "signature": {
                  "additionalParameters": "allowed",
                  "parameters": {}
                },
                "subTitle": undefined,
                "tileResolutionResult": {
                  "appId": undefined,
                  "dataSources": undefined,
                  "description": undefined,
                  "deviceTypes": {
                    "desktop": true,
                    "phone": false,
                    "tablet": false
                  },
                  "icon": undefined,
                  "indicatorDataSource": undefined,
                  "info": undefined,
                  "isCard": false,
                  "isPlatformVisualization": false,
                  "runtimeInformation": undefined,
                  "size": undefined,
                  "subTitle": undefined,
                  "technicalInformation": undefined,
                  "tileComponentLoadInfo": {
                  },
                  "title": "translated title of application"
                },
                "title": "translated title of application"
              }
            ]
        }
    ].forEach(function(oFixture) {
        asyncTest("getInbounds returns the correct inbounds when " + oFixture.testDescription, function () {
            var oAdapter,
                oSystem = {};

            // Arrange
            var oCDMServiceStub = {
                getSite: function() {
                    return new jQuery.Deferred().resolve(oFixture.oSiteData).promise();
                }
            };
            var oCDMServiceAsyncStub = new jQuery.Deferred().resolve(oCDMServiceStub).promise();
            sinon.stub(sap.ushell.Container, "getServiceAsync").returns(oCDMServiceAsyncStub);
            // Act
            oAdapter = new sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter(
                    oSystem,
                    undefined,
                    undefined
            );
            oAdapter.getInbounds()
                .fail(function(sMessage) {
                    ok(false, "getInbounds was rejected with message '" + sMessage + "'.");
                })
                .done(function(aInbounds) {
                    // Assert
                    start();
                    ok(sap.ushell.Container.getServiceAsync.calledWith("CommonDataModel"));
                    deepEqual(aInbounds, oFixture.expectedInbounds, "ok");
                });
        });
    });

    asyncTest("getInbounds rejects as expected when CDM site promise rejects", function () {
        // Arrange
        var oCDMServiceStub = {
            getSite: function() {
                return new jQuery.Deferred().reject("deliberate error").promise();
            }
        };
        var oCDMServiceAsyncStub = new jQuery.Deferred().resolve(oCDMServiceStub).promise();
        sinon.stub(sap.ushell.Container, "getServiceAsync").returns(oCDMServiceAsyncStub);

        this.oAdapter.getInbounds()
            .fail(function(sMessage) {
                ok(true, "promise was rejected");

                strictEqual(sMessage, "deliberate error",
                    "promise was rejected with the expected error message");
            })
            .done(function(aInbounds) {
                ok(false, "promise was resolved");
            })
            .always(function () {
                start();
            });
    });

    test("#_createSIDMap does create a proper SID map", function () {
        var oSIDMap = this.oAdapter._createSIDMap(O_SYSTEM_ALIASES);
        var oExpectedSIDMap = {
            "SID(XYZ.000)" : "DuplicateToAbove",
            "SID(AB2.000)": "AA2CLNT000",
            "SID(AB1.000)" : "AB1CLNT000"
        };
        deepEqual(oSIDMap, oExpectedSIDMap, "returned correct sid map");
    });

});
