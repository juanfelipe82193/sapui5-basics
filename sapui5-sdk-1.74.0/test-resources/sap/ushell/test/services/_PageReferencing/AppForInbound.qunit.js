// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for module "AppForInbound" in "sap.ushell.services._PageReferencing"
 * "
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.require([
    "sap/ushell/services/_PageReferencing/AppForInbound",
    "sap/base/util/ObjectPath"
], function (AppForInbound, ObjectPath) {

    "use strict";
    QUnit.start();

    //#region AppForInbound.get()
    QUnit.module("The function get", {
        beforeEach: function (assert) {

            // Create stubs
            this.TRApplication = {};
            this.oCreateTRApplicationStub = sinon.stub(AppForInbound, "_getTRApp").returns(this.TRApplication);
            this.UI5Application = {};
            this.oCreateUI5ApplicationStub = sinon.stub(AppForInbound, "_getUI5App").returns(this.UI5Application);
            this.URLApplication = {};
            this.oCreateURLApplicationStub = sinon.stub(AppForInbound, "_getURLApp").returns(this.URLApplication);
            this.WCFApplication = {};
            this.oCreateWCFApplicationStub = sinon.stub(AppForInbound, "_getWCFApp").returns(this.WCFApplication);
            this.WDAApplication = {};
            this.oCreateWDAApplicationStub = sinon.stub(AppForInbound, "_getWDAApp").returns(this.WDAApplication);
        },
        afterEach: function (assert) {
            // Restore
            this.oCreateTRApplicationStub.restore();
            this.oCreateUI5ApplicationStub.restore();
            this.oCreateURLApplicationStub.restore();
            this.oCreateWCFApplicationStub.restore();
            this.oCreateWDAApplicationStub.restore();
        }
    });

    QUnit.test("Can handle ABAP apps.", function (assert) {

        // Arrange
        var sInboundPermanentKey = "4711",
            oInbound = {
                resolutionResult: {
                    applicationType: "TR"
                }
            };

        // Act
        var oApp = AppForInbound.get(sInboundPermanentKey, oInbound);

        // Assert
        assert.deepEqual(oApp, this.TRApplication, "An ABAP application is returned, if the app type is 'TR'.");
        assert.strictEqual(this.oCreateTRApplicationStub.getCall(0).args[0], sInboundPermanentKey,
            "_getTRApp() is called with the sInboundPermanentKey as the first parameter.");
        assert.deepEqual(this.oCreateTRApplicationStub.getCall(0).args[1], oInbound,
            "_getTRApp() is called with the inbound as the second parameter.");
        assert.ok(this.oCreateTRApplicationStub.called, "_getTRApp() is called.");
        assert.notOk(this.oCreateUI5ApplicationStub.called, "_getUI5App() is not called.");
        assert.notOk(this.oCreateURLApplicationStub.called, "_getURLApp() is not called.");
        assert.notOk(this.oCreateWCFApplicationStub.called, "_getWCFApp() is not called.");
        assert.notOk(this.oCreateWDAApplicationStub.called, "_getWDAApp() is not called.");
    });

    QUnit.test("Can handle SAPUI5 apps.", function (assert) {

        // Arrange
        var sInboundPermanentKey = "4711",
            oInbound = {
                resolutionResult: {
                    applicationType: "SAPUI5"
                }
            };

        // Act
        var oApp = AppForInbound.get(sInboundPermanentKey, oInbound);

        // Assert
        assert.deepEqual(oApp, this.UI5Application, "An UI5 application is returned, if the app type is 'SAPUI5'.");
        assert.strictEqual(this.oCreateUI5ApplicationStub.getCall(0).args[0], sInboundPermanentKey,
            "_getUI5App() is called with the sInboundPermanentKey as the first parameter.");
        assert.deepEqual(this.oCreateUI5ApplicationStub.getCall(0).args[1], oInbound,
            "_getUI5App() is called with the inbound as the second parameter.");
        assert.notOk(this.oCreateTRApplicationStub.called, "_getTRApp() is not called.");
        assert.ok(this.oCreateUI5ApplicationStub.called, "_getUI5App() is called.");
        assert.notOk(this.oCreateURLApplicationStub.called, "_getURLApp() is not called.");
        assert.notOk(this.oCreateWCFApplicationStub.called, "_getWCFApp() is not called.");
        assert.notOk(this.oCreateWDAApplicationStub.called, "_getWDAApp() is not called.");
    });

    QUnit.test("Can handle URL apps.", function (assert) {

        // Arrange
        var sInboundPermanentKey = "4711",
            oInbound = {
                resolutionResult: {
                    applicationType: "URL"
                }
            };

        // Act
        var oApp = AppForInbound.get(sInboundPermanentKey, oInbound);

        // Assert
        assert.deepEqual(oApp, this.URLApplication, "An ABAP application is returned, if the app type is 'URL'.");
        assert.strictEqual(this.oCreateURLApplicationStub.getCall(0).args[0], sInboundPermanentKey,
            "_getURLApp() is called with the sInboundPermanentKey as the first parameter.");
        assert.deepEqual(this.oCreateURLApplicationStub.getCall(0).args[1], oInbound,
            "_getURLApp() is called with the inbound as the second parameter.");
        assert.notOk(this.oCreateTRApplicationStub.called, "_getTRApp() is not called.");
        assert.notOk(this.oCreateUI5ApplicationStub.called, "_getUI5App() is not called.");
        assert.ok(this.oCreateURLApplicationStub.called, "_getURLApp() is called.");
        assert.notOk(this.oCreateWCFApplicationStub.called, "_getWCFApp() is not called.");
        assert.notOk(this.oCreateWDAApplicationStub.called, "_getWDAApp() is not called.");
    });

    QUnit.test("Can handle Web Client UI Framework apps.", function (assert) {

        // Arrange
        var sInboundPermanentKey = "4711",
            oInbound = {
                resolutionResult: {
                    applicationType: "WCF"
                }
            };

        // Act
        var oApp = AppForInbound.get(sInboundPermanentKey, oInbound);

        // Assert
        assert.deepEqual(oApp, this.WCFApplication, "An WCF application is returned, if the app type is 'WCF'.");
        assert.strictEqual(this.oCreateWCFApplicationStub.getCall(0).args[0], sInboundPermanentKey,
            "_getWCFApp() is called with the sInboundPermanentKey as the first parameter.");
        assert.deepEqual(this.oCreateWCFApplicationStub.getCall(0).args[1], oInbound,
            "_getWCFApp() is called with the inbound as the second parameter.");
        assert.notOk(this.oCreateTRApplicationStub.called, "_getTRApp() is not called.");
        assert.notOk(this.oCreateUI5ApplicationStub.called, "_getUI5App() is not called.");
        assert.notOk(this.oCreateURLApplicationStub.called, "_getURLApp() is not called.");
        assert.ok(this.oCreateWCFApplicationStub.called, "_getWCFApp() is called.");
        assert.notOk(this.oCreateWDAApplicationStub.called, "_getWDAApp() is not called.");
    });

    QUnit.test("Can handle Web Dynpro ABAP apps.", function (assert) {

        // Arrange
        var sInboundPermanentKey = "4711",
            oInbound = {
                resolutionResult: {
                    applicationType: "WDA"
                }
            };

        // Act
        var oApp = AppForInbound.get(sInboundPermanentKey, oInbound);

        // Assert
        assert.deepEqual(oApp, this.WDAApplication, "An Web Dynpro ABAP application is returned, if the app type is 'WDA'.");
        assert.strictEqual(this.oCreateWDAApplicationStub.getCall(0).args[0], sInboundPermanentKey,
            "_getWDAApp() is called with the sInboundPermanentKey as the first parameter.");
        assert.deepEqual(this.oCreateWDAApplicationStub.getCall(0).args[1], oInbound,
            "_getWDAApp() is called with the inbound as the second parameter.");
        assert.notOk(this.oCreateTRApplicationStub.called, "_getTRApp() is not called.");
        assert.notOk(this.oCreateUI5ApplicationStub.called, "_getUI5App() is not called.");
        assert.notOk(this.oCreateURLApplicationStub.called, "_getURLApp() is not called.");
        assert.notOk(this.oCreateWCFApplicationStub.called, "_getWCFApp() is not called.");
        assert.ok(this.oCreateWDAApplicationStub.called, "_getWDAApp() is called.");
    });

    QUnit.test("Can handle system alias defintions.", function (assert) {

        // Arrange
        var sInboundPermanentKey = "4711",
            oInbound = {
                resolutionResult: {
                    applicationType: "SAPUI5",
                    systemAlias: "ALI"
                }
            };

        var oExpectedDestination = {
            name: "ALI",
            semantics: "applied"
        };

        // Act
        var oApp = AppForInbound.get(sInboundPermanentKey, oInbound);

        // Assert
        assert.deepEqual(ObjectPath.get(["sap.app", "destination"], oApp), oExpectedDestination,
            "The alias definition is taken over as destination.");

    });

    QUnit.test("Raises an exception if the application type is unknown.", function (assert) {

        // Arrange
        var sInboundPermanentKey = "4711",
            oInboundUnknownApplicationType = {
                resolutionResult: {
                    applicationType: "XXX"
                }
            };

        assert.expect(1);

        // Act & assert
        assert.throws(
            function () { AppForInbound.get(sInboundPermanentKey, oInboundUnknownApplicationType); }, "Raises an exception"
        );
    });
    //#endregion

    //#region AppForInbound._getUI5App(inboundPermanentKey, inbound)
    QUnit.module("The function _getUI5App");

    QUnit.test("Creates a CDM app for an SAPUI5 inbound as expected.", function (assert) {

        // Arrange
        var sInboundPermanentKey = "ui5App",
            oSignature = {},
            oInbound = {
                id: sInboundPermanentKey,
                semanticObject: "semantic-object",
                action: "action",
                signature: oSignature,
                deviceTypes: { "desktop": true, "tablet": true, "phone": false },
                resolutionResult: {
                    text: "text",
                    information: "info",
                    ui5ComponentName: "ui5.component",
                    url: "url"
                }
            };
        var oUi5AppExpected = {
                "sap.app": {
                    id: "ui5App",
                    title: "text",
                    subTitle: "info",
                    crossNavigation: {
                        inbounds: {
                            ui5App: {
                                semanticObject: "semantic-object",
                                action: "action",
                                signature: {}
                            }
                        }
                    }
                },
                "sap.ui5": {
                    componentName: "ui5.component"
                },
                "sap.ui": {
                    technology: "UI5",
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: false
                    }
                },
                "sap.platform.runtime": {
                    componentProperties: {
                        url: "url"
                    }
                }
            };

        // Act
        var oUI5App = AppForInbound._getUI5App(sInboundPermanentKey, oInbound);

        // Assert
        assert.deepEqual(oUI5App, oUi5AppExpected, "The properties of the UI5 inbound are taken over into the CDM app properly.");
    });
    //#endregion

    //#region AppForInbound._getURLApp(inboundPermanentKey, inbound)
    QUnit.module("The function _getURLApp");

    QUnit.test("Creates a CDM app for a URL inbound as expected.", function (assert) {

        // Arrange
        var sInboundPermanentKey = "urlApp",
            oInbound = {
                id: sInboundPermanentKey,
                semanticObject: "semantic-object",
                action: "action",
                deviceTypes: {
                    desktop: true,
                    tablet: true,
                    phone: false
                },
            resolutionResult: {
                    url: "url"
                }
            },
            oUrlAppExpected = {
                "sap.app": {
                    id: "urlApp",
                    crossNavigation: {
                        inbounds: {
                            "Shell-launchURL": {
                                semanticObject: "Shell",
                                action: "launchURL",
                                signature: {
                                    parameters: {
                                        "sap-external-url": {
                                            required: true,
                                            filter: {
                                                value: "url",
                                                format: "plain"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "sap.ui": {
                    technology: "URL",
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: false
                    }
                },
                "sap.url": {
                    uri: "url"
                }
            };

        // Act
        var oUrlApp = AppForInbound._getURLApp(sInboundPermanentKey, oInbound);

        // Assert
        assert.deepEqual(oUrlApp, oUrlAppExpected, "The properties of the URL inbound are taken over into the CDM app properly.");
    });
    //#endregion

    //#region AppForInbound._getTRApp(inboundPermanentKey, inbound)
    QUnit.module("The function _getTRApp");

    QUnit.test("Creates a CDM app for an ABAP transaction inbound as expected.", function (assert) {

        // Arrange
        var sInboundPermanentKey = "abapApp",
            oInbound = {
                id: sInboundPermanentKey,
                semanticObject: "semanticObject",
                action: "action",
                deviceTypes: {
                    desktop: true,
                    tablet: true,
                    phone: false
                },
            signature: {
                    "parameters": {},
                    "additionalParameters": "allowed"
                },
                resolutionResult: {
                    text: "text",
                    information: "information",
                    url: "http:...?x=1&transaction=SE80&y=2"
                }
            },
            oTrAppExpected = {
                "sap.app": {
                    id: "abapApp",
                    title: "text",
                    subTitle: "information",
                    crossNavigation: {
                        inbounds: {
                            abapApp: {
                                semanticObject: "semanticObject",
                                action: "action",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                }
                            }
                        }
                    }
                },
                "sap.ui": {
                    technology: "GUI",
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: false }
                },
                "sap.flp": {
                    type: "application"
                },
                "sap.gui": {
                    transaction: "SE80"
                }
            };

        // Act
        var oTrApp = AppForInbound._getTRApp(sInboundPermanentKey, oInbound);

        // Assert
        assert.deepEqual(oTrApp, oTrAppExpected,
            "The properties of the ABAP transaction inbound are taken over into the ABAP app properly.");
    });
    //#endregion

    //#region AppForInbound._getWDAApp(inboundPermanentKey, inbound)
    QUnit.module("The function _getWDAApp");

    QUnit.test("Creates a CDM app for a Web Dynpro ABAP inbound as expected.", function (assert) {

        // Arrange
        var sInboundPermanentKey = "wdaApp",
            oInbound = {
                id: sInboundPermanentKey,
                semanticObject: "semantic-object",
                action: "action",
                deviceTypes: {
                    desktop: true,
                    tablet: true,
                    phone: false
                },
                signature: {
                    parameters: {},
                    additionalParameters: "allowed"
                },
                resolutionResult: {
                    text: "text",
                    information: "information",
                    url: "url"
                }
            },
            oWdaAppExpected = {
                "sap.app": {
                    id: "wdaApp",
                    title: "text",
                    subTitle: "information",
                    crossNavigation: {
                        inbounds: {
                            wdaApp: {
                                action: "action",
                                semanticObject: "semantic-object",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                }
                            }
                        }
                    }
                },
                "sap.ui": {
                    technology: "URL",
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: false
                    }
                },
                "sap.url": {
                    uri: "url"
                }
            };

        // Act
        var oWdaApp = AppForInbound._getWDAApp(sInboundPermanentKey, oInbound);

        // Assert
        assert.deepEqual(oWdaApp, oWdaAppExpected,
            "The properties of the Web Dynpro ABAP inbound are taken over into the CDM app properly.");
    });
    //#endregion

    //#region AppForInbound._getWCFApp(inboundPermanentKey, inbound)
    QUnit.module("The function _getWCFApp");

    QUnit.test("Creates a CDM app for a Web Client inbound as expected.", function (assert) {

        // Arrange
        var sInboundPermanentKey = "wcfApp",
            oInbound = {
                id: sInboundPermanentKey,
                semanticObject: "semantic-object",
                action: "action",
                deviceTypes: {
                    desktop: true,
                    tablet: true,
                    phone: false
                },
                signature: {
                    parameters: {},
                    additionalParameters: "allowed"
                },
                resolutionResult: {
                    text: "text",
                    information: "information",
                    url: "url"
                }
            },
            oWcfAppExpected = {
                "sap.app": {
                    id: "wcfApp",
                    title: "text",
                    subTitle: "information",
                    crossNavigation: {
                        inbounds: {
                            wcfApp: {
                                action: "action",
                                semanticObject: "semantic-object",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                }
                            }
                        }
                    }
                },
                "sap.ui": {
                    technology: "URL",
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: false
                    }
                },
                "sap.url": {
                    uri: "url"
                }
            };

        // Act
        var oWcfApp = AppForInbound._getWCFApp(sInboundPermanentKey, oInbound);

        // Assert
        assert.deepEqual(oWcfApp, oWcfAppExpected, "The properties of the Web Client inbound are taken over into the CDM app properly.");
    });
    //#endregion

});