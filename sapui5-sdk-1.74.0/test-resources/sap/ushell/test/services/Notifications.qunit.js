 // Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.Notifications
 */
sap.ui.require([
    "sap/ushell/utils",
    "sap/ushell/services/Container",
    "sap/ui/thirdparty/datajs"
], function (utils, Container, OData) {
    "use strict";
    /* global QUnit sinon*/

    function readNotificationsService (fnCallback) {
        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("Notifications").then(function (oService) {
                fnCallback(oService);
            });
        });
    }

    function testAsync (assert, fnTest) {
        var done = assert.async();
        readNotificationsService(function (oService) {
            fnTest(oService);
            done();
        });
    }

    var sServicePath = "NOTIFICATIONS_SRV";

    function setStandardConfig () {
        window["sap-ushell-config"] = {
            "services": {
                "Notifications": {
                    config: {
                        enabled: true,
                        serviceUrl: sServicePath
                    }
                }
            }
        };
    }

    QUnit.module("sap.ushell.services.Notifications", {
        beforeEach: function () {
            jQuery.sap.flpmeasure = {
                end: function () {},
                start: function () {}
            };
        },

        afterEach: function () {
            delete sap.ushell.Container;

            // Clean-up event subscriptions, as Notifications.destroy() is not called reliably after each test
            sap.ui.getCore().getEventBus().destroy();
        }
    });

    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function (pattern) {
            var d = this.length - pattern.length;
            return d >= 0 && this.lastIndexOf(pattern) === d;
        };
    }
    var oModesEnum = {
            PACKAGED_APP: 0,
            FIORI_CLIENT: 1,
            WEB_SOCKET: 2,
            POLLING: 3
        },
        oBasicNotificationsResult = {
            "__count": "4",
            "results": [
                {
                    "id": "FirstNotification",
                    "isRead": false,
                    "CreatedAt": "1457892950133"
                }, {
                    "id": "SecondNotification",
                    "isRead": false,
                    "CreatedAt": "1457892950123"
                }, {
                    "id": "ThirdNotification",
                    "isRead": false,
                    "CreatedAt": "1457892950103"
                }, {
                    "id": "FourthNotification",
                    "isRead": false,
                    "CreatedAt": "1457892950100"
                }
            ]
        },
        oNotificationsResult = {
            value: [
                {
                    "id": "FirstNotification",
                    "isRead": false,
                    "CreatedAt": "1457892950133"
                }, {
                    "id": "SecondNotification",
                    "isRead": false,
                    "CreatedAt": "1457892950123"
                }, {
                    "id": "ThirdNotification",
                    "isRead": false,
                    "CreatedAt": "1457892950103"
                }, {
                    "id": "FourthNotification",
                    "isRead": false,
                    "CreatedAt": "1457892950100"
                }
            ]
        };

    /**
     * Service enabling by configuration:
     * Verify that the service is enabled when enable flag=true and a valid serviceUrl is provided
     */
    QUnit.test("Service enablement 1", function (assert) {
        setStandardConfig();
        testAsync(assert, function (oService) {
            assert.ok(oService.isEnabled() === true, "isEnabled configuration flag is read correctly");
        });
    });

    /**
     * Service enabling by configuration:
     * Verify that the service is disabled when enable flag=false and a valid serviceUrl is provided
     */
    QUnit.test("Service enablement 2", function (assert) {
        window["sap-ushell-config"] = {
            "services": {
                "Notifications": {
                    config: {
                        enabled: false,
                        serviceUrl: "NOTIFICATIONS_SRV"
                    }
                }
            }
        };
        testAsync(assert, function (oService) {
            assert.ok(oService.isEnabled() === false, "isEnabled configuration flag is read correctly");
        });
    });

    /**
     * Service enabling by configuration:
     * Verify that the service is disabled when enable flag=true but serviceUrl is an empty string
     */
    QUnit.test("Service enablement 3", function (assert) {
        window["sap-ushell-config"] = {
            "services": {
                "Notifications": {
                    config: {
                        enabled: true,
                        serviceUrl: ""
                    }
                }
            }
        };
        testAsync(assert, function (oService) {
            assert.ok(oService.isEnabled() === false, "isEnabled returns false when serviceUrl is in the service configuration is an empty string");
        });
    });

    /**
     * Service enabling by configuration:
     * Verify that the service is disabled when enable flag=true but no serviceUrl is provided
     */
    QUnit.test("Service enablement 4", function (assert) {
        window["sap-ushell-config"] = {
            "services": {
                "Notifications": {
                    config: {
                        enabled: true
                    }
                }
            }
        };
        testAsync(assert, function (oService) {
            assert.ok(oService.isEnabled() === false, "isEnabled returns false when when no serviceUrl was found in the service configuration");
        });
    });

    /**
     * Intent based consumption  - read data from service configuration
     */
    QUnit.test("Intent based consumption - read data from service configuration", function (assert) {
        var oPerformFirstReadSpy,
            oUserSettingInitializationStub;

        window["sap-ushell-config"] = {
            "services": {
                "Notifications": {
                    config: {
                        enabled: true,
                        serviceUrl: "NOTIFICATIONS_SRV",
                        intentBasedConsumption: true,
                        consumedIntents: [
                            {intent: "object1-action1"},
                            {intent: "object1-action2"},
                            {intent: "object2-action1"}
                        ]
                    }
                }
            }

        };
        testAsync(assert, function (oService) {
            oService._readSettingsFromServer = sinon.spy();
            oPerformFirstReadSpy = sinon.spy(oService, "_performFirstRead");
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();

            oService.init();

            assert.ok(oService._isIntentBasedConsumption() === true, "Intent based consumption configuration flag read");
            assert.ok(oService._getConsumedIntents() === "&NavigationIntent%20eq%20%27object1-action1%27NavigationIntent%20eq%20%27object1-action2%27NavigationIntent%20eq%20%27object2-action1%27", "Correct intents string");
            assert.ok(oUserSettingInitializationStub.calledOnce === true, "_readUserSettingsFlags called");

            oUserSettingInitializationStub.restore();
            oPerformFirstReadSpy.restore();
        });
    });

    /**
     * Packaged App use-case - read intent data from PackagedApp configuration
     */
    QUnit.test("Packaged App use-case - read intent data from PackagedApp configuration", function (assert) {
        var oPerformFirstReadSpy,
            oUserSettingInitializationStub;

        window["sap-ushell-config"] = {
            "services": {
                "Notifications": {
                    config: {
                        enabled: true,
                        serviceUrl: "NOTIFICATIONS_SRV"
                    }
                }
            }
        };
        window.sap.Push = {};
        window.sap.Push.initPush = function () {};
        window.fiori_client_appConfig = {};
        window.fiori_client_appConfig.prepackaged = true;
        window.fiori_client_appConfig.applications = [
            {
                "id": "nw.epm.refapps.shop",
                "intent": "EPMProduct-shop"
            }, {
                "id": "nw.epm.refapps.products.manage",
                "intent": "EPMProduct-manage"
            }
        ];

        testAsync(assert, function (oService) {
            oService._readSettingsFromServer = sinon.spy();
            oPerformFirstReadSpy = sinon.spy(oService, "_performFirstRead");
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            oService._setNativeIconBadgeWithDelay = sinon.spy();

            oService.init();

            assert.ok(oService._isIntentBasedConsumption() === true, "Intent based consumption configuration flag read");
            assert.ok(oService._getConsumedIntents() === "&NavigationIntent%20eq%20%27EPMProduct-shop%27NavigationIntent%20eq%20%27EPMProduct-manage%27", "Correct intents string");
            oUserSettingInitializationStub.restore();
            oPerformFirstReadSpy.restore();
            window.fiori_client_appConfig = undefined;
        });
    });

    QUnit.test("_writeSettingsEntryToServer:", function (assert) {
        testAsync(assert, function (oService) {
            // Arrange
            var oRequestStub = sinon.stub(OData, "request"),
                o_getRequestURIStub = sinon.stub(oService, "_getRequestURI").returns("uri"),
                oEntry = {
                    NotificationTypeId: "N12345",
                    NotificationTypeDesc: "typeDesc",
                    PriorityDefault: "",
                    DoNotDeliver: false,
                    DoNotDeliverMob: false,
                    DoNotDeliverEmail: false,
                    IsEmailEnabled: true,
                    IsEmailIdMaintained: true
                };

            // Act
            oService._writeSettingsEntryToServer(oEntry);

            // Assert
            var sExpectedRequestUri = "uri(NotificationTypeId=" + oEntry.NotificationTypeId + ")",
                sExpectedMethod = "PUT",
                oExpectedData = oEntry,
                oExpectedHeaders = {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json",
                    "DataServiceVersion": undefined,
                    "X-CSRF-Token": undefined
                };
            oExpectedData["@odata.context"] = "$metadata#NotificationTypePersonalizationSet/$entity";

            assert.strictEqual(oRequestStub.callCount, 1, "request was made");
            assert.strictEqual(oRequestStub.args[0][0].requestUri, sExpectedRequestUri, "request parameter has the correct requestUri property");
            assert.strictEqual(oRequestStub.args[0][0].method, sExpectedMethod, "request parameter has the correct method property");
            assert.deepEqual(oRequestStub.args[0][0].data, oExpectedData, "request parameter has the correct data property");
            assert.deepEqual(oRequestStub.args[0][0].headers, oExpectedHeaders, "request parameter has the correct headers property");

            oRequestStub.restore();
            o_getRequestURIStub.restore();
        });
    });

    /**
     * Packaged App use-case - read intent data from PackagedApp configuration and override service configuration data
     */
    QUnit.test("Packaged App use-case - read intent data from PackagedApp configuration and override service configuration data", function (assert) {
        var oPerformFirstReadSpy,
            oUserSettingInitializationStub;

        window["sap-ushell-config"] = {
            "services": {
                "Notifications": {
                    config: {
                        enabled: true,
                        serviceUrl: "NOTIFICATIONS_SRV",
                        intentBasedConsumption: true,
                        consumedIntents: [
                            {intent: "object1-action1"},
                            {intent: "object1-action2"},
                            {intent: "object2-action1"}
                        ]
                    }
                }
            }
        };
        window.sap.Push = {};
        window.sap.Push.initPush = function () {};
        window.fiori_client_appConfig = {};
        window.fiori_client_appConfig.prepackaged = true;
        window.fiori_client_appConfig.applications = [
            {
                "id": "nw.epm.refapps.shop",
                "intent": "EPMProduct-shop"
            }, {
                "id": "nw.epm.refapps.products.manage",
                "intent": "EPMProduct-manage"
            }
        ];

        testAsync(assert, function (oService) {
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            oService._readSettingsFromServer = sinon.spy();
            oService._setNativeIconBadgeWithDelay = sinon.spy();
            oPerformFirstReadSpy = sinon.spy(oService, "_performFirstRead");
            oService.init();

            assert.ok(oService._isIntentBasedConsumption() === true, "Intent based consumption configuration flag read");
            assert.ok(oService._getConsumedIntents(), "&NavigationIntent%20eq%20%27EPMProduct-shop%27NavigationIntent%20eq%20%27EPMProduct-manage%27", "Correct intents string");

            oUserSettingInitializationStub.restore();
            oPerformFirstReadSpy.restore();
            window.fiori_client_appConfig = undefined;
        });
    });

    /**
     * Packaged App use-case and intent based consumption when there are no  intents
     */
    QUnit.test("Packaged App use-case and intent based consumption when there are no intents", function (assert) {
        var oPerformFirstReadSpy,
            oUserSettingInitializationStub;

        window["sap-ushell-config"] = {
            "services": {
                "Notifications": {
                    config: {
                        enabled: true,
                        serviceUrl: "NOTIFICATIONS_SRV",
                        intentBasedConsumption: true,
                        consumedIntents: []
                    }
                }
            }
        };
        window.sap.Push = {};
        window.sap.Push.initPush = function () {};
        window.fiori_client_appConfig = {};
        window.fiori_client_appConfig.prepackaged = true;

        testAsync(assert, function (oService) {
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            oService._readSettingsFromServer = sinon.spy();
            oPerformFirstReadSpy = sinon.spy(oService, "_performFirstRead");
            oService._setNativeIconBadgeWithDelay = sinon.spy();

            oService.init();

            assert.ok(oService._isIntentBasedConsumption() === false, "Flag isIntentBasedConsumption is false when no intents are provided");
            assert.ok(oService._getConsumedIntents().length === 0, "No intents read");

            oUserSettingInitializationStub.restore();
            oPerformFirstReadSpy.restore();
            window.fiori_client_appConfig = undefined;
        });
    });

    /**
     * Packaged App use-case
     * Verify that the service private function _isPackagedApp returns true when window.fiori_client_appConfig.prepackaged is defined,
     */
    QUnit.test("Identify packaged app mode", function (assert) {

        window.fiori_client_appConfig = {};
        window.fiori_client_appConfig.prepackaged = true;
        testAsync(assert, function (oService) {
            assert.ok(oService._isPackagedMode() === true, "_isPackagedApp returns true when window.fiori_client_appConfig.prepackaged is defined");

            window.fiori_client_appConfig = undefined;
        });
    });

    /**
     * Fiori client use-case:
     * Verify that the service private function _isFioriClientMode returns true when window.sap.FioriClient is defined
     */
    QUnit.test("Identify Fiori Client mode", function (assert) {
        window.sap.FioriClient = {};

        testAsync(assert, function (oService) {
            assert.ok(oService._isFioriClientMode() === true, "_isFioriClientMode returns true when sap.push is defined");
            window.sap.FioriClient = undefined;
        });
    });

    QUnit.test("Reach Packaged App step", function (assert) {
        var oIsPackagedAppModeStub,
            oUserSettingInitializationStub,
            oGetIntentsFromConfigurationStub;

        setStandardConfig();
        window.fiori_client_appConfig = {};
        window.fiori_client_appConfig.applications = [];

        testAsync(assert, function (oService) {
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(true);
            oGetIntentsFromConfigurationStub = sinon.stub(oService, "_getIntentsFromConfiguration").returns([]);
            oService._registerForPush = sinon.spy();
            oService._setNativeIconBadgeWithDelay = sinon.spy();
            oService._readNotificationsData = sinon.spy();
            oService._performFirstRead = sinon.spy();

            oService.init();

            assert.ok(oService._getMode() === oModesEnum.PACKAGED_APP, "_getMode returns oModesEnum.PACKAGED_APP");
            assert.ok(oService._registerForPush.calledOnce === true, "_registerForPush called once");
            assert.ok(oService._readNotificationsData.calledOnce === true, "_readNotificationsData called once");
            assert.ok(oService._setNativeIconBadgeWithDelay.calledOnce === true, "_setNativeIconBadgeWithDelay called once");
            assert.ok(oService._performFirstRead.notCalled === true, "_performFirstRead not called");

            oUserSettingInitializationStub.restore();
            oIsPackagedAppModeStub.restore();
            oGetIntentsFromConfigurationStub.restore();
            window.fiori_client_appConfig = undefined;
        });
    });

    QUnit.test("Reach Fiori Client step", function (assert) {
        var oIsPackagedAppModeStub,
            oIsFioriClientModeStub,
            oFioriClientRemainingDelayStub,
            oDataReadStub,
            oUpdateCSRFStub,
            oGetIntentsFromConfigurationStub,
            oUserSettingInitializationStub;

        setStandardConfig();

        oDataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
            success({results: oBasicNotificationsResult.results}, {
                headers: {
                    "x-csrf-token": {},
                    DataServiceVersion: {}
                },
                data: {
                    GetBadgeNumber: {
                        Number: 4
                    }
                }
            });
        });

        sinon.stub(OData, "request", function (request, success, fail) {
            success(oNotificationsResult);
        });

        testAsync(assert, function (oService) {
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            oGetIntentsFromConfigurationStub = sinon.stub(oService, "_getIntentsFromConfiguration").returns([]);
            oUpdateCSRFStub = sinon.stub(oService, "_updateCSRF").returns([]);
            oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
            oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(true);
            oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
            oService._webSocketStep = sinon.spy();

            oService.init();

            assert.ok(oService._getMode() === oModesEnum.FIORI_CLIENT, "_getMode returns oModesEnum.FIORI_CLIENT");
            assert.ok(oService._webSocketStep.notCalled === true, "Next step (WebSocket) not reached");

            oUserSettingInitializationStub.restore();
            oGetIntentsFromConfigurationStub.restore();
            oUpdateCSRFStub.restore();
            oDataReadStub.restore();
            OData.request.restore();
            oIsPackagedAppModeStub.restore();
            oIsFioriClientModeStub.restore();
            oFioriClientRemainingDelayStub.restore();
        });
    });

    QUnit.test("Reach WebSocket step", function (assert) {
        var oIsPackagedAppModeStub,
            oIsFioriClientModeStub,
            oFioriClientRemainingDelayStub,
            oDataReadStub,
            oUserSettingInitializationStub;

        setStandardConfig();

        oDataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
            success({results: oBasicNotificationsResult.results}, {
                headers: {
                    "x-csrf-token": {},
                    DataServiceVersion: {}
                },
                data: {
                    GetBadgeNumber: {
                        Number: 4
                    }
                }
            });
        });

        testAsync(assert, function (oService) {
            oService._readSettingsFromServer = sinon.spy();
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();

            sinon.stub(oService, "_readNotificationsData", function () {
                return jQuery.when();
            });

            oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
            oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(false);
            oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
            sinon.spy(oService, "_readUserSettingsFlagsFromPersonalization");
            oService._webSocketRecoveryStep = sinon.spy();
            oService._activatePollingAfterInterval = sinon.spy();
            oService._establishWebSocketConnection = sinon.spy();

            oService.init();

            assert.ok(oService._getMode() === oModesEnum.WEB_SOCKET, "_getMode returns oModesEnum.WEB_SOCKET");
            assert.ok(oService._establishWebSocketConnection.calledOnce === true, "_establishWebSocketConnection called once");
            assert.ok(oService._webSocketRecoveryStep.notCalled === true, "Next step (_webSocketRecoveryStep) not reached");
            assert.ok(oService._activatePollingAfterInterval.notCalled === true, "Next step (_activatePollingAfterInterval) not reached");
            assert.ok(oUserSettingInitializationStub.calledOnce === true, "oUserSettingInitializationStub called");

            oUserSettingInitializationStub.restore();
            oDataReadStub.restore();
            oIsPackagedAppModeStub.restore();
            oIsFioriClientModeStub.restore();
            oFioriClientRemainingDelayStub.restore();
        });
    });

    QUnit.test("WebSocket activity check , when active", function (assert) {
        var oIsPackagedAppModeStub,
            oIsFioriClientModeStub,
            oReturnedWebSocket,
            oFioriClientRemainingDelayStub,
            oWebSocketRecoveryStepSpy,
            oCheckWebSocketActivityStub,
            oGetWebSocketStub,
            fGivenOnOpenCallback,
            oDataReadStub,
            oRequireStub,
            oUserSettingInitializationStub,
            oReadNotificationsDataStub;

        setStandardConfig();

        oDataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
            success({results: oBasicNotificationsResult.results}, {
                headers: {
                    "x-csrf-token": {},
                    DataServiceVersion: {}
                },
                data: {
                    GetBadgeNumber: {
                        Number: 4
                    }
                }
            });
        });

        // We don't want jQuery.sap.require("sap.ui.core.ws.SapPcpWebSocket") to be performed
        oRequireStub = sinon.stub(jQuery.sap, "require").returns({});

        // Define the custom WebSocket object
        // including an attachClose function that gets the onError callback in _establishWebSocketConnection
        // Later, we call that callback (with an appropriate message) and check that _readNotificationsData is called as a result
        oReturnedWebSocket = {
            attachMessage: function (oMessage, callback) {},
            attachError: function (oMessage, callback) {},
            attachOpen: function (oMessage, callback) {
                fGivenOnOpenCallback = callback;
            },
            attachClose: function (oMessage, callback) {}
        };

        testAsync(assert, function (oService) {
            oGetWebSocketStub = sinon.stub(oService, "_getWebSocketObjectObject").returns(oReturnedWebSocket);
            oReadNotificationsDataStub = sinon.stub(oService, "_readNotificationsData", function () {
                return jQuery.when();
            });

            oService._readSettingsFromServer = sinon.spy();
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
            oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(false);
            oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
            oCheckWebSocketActivityStub = sinon.stub(oService, "_checkWebSocketActivity", function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve(true);
                return oDeferred.promise();
            });
            oWebSocketRecoveryStepSpy = sinon.spy(oService, "_webSocketRecoveryStep");
            oService._activatePollingAfterInterval = sinon.spy();

            oService.init();

            // Call WebSocket onOpen in order to verify that validity check occurs
            fGivenOnOpenCallback();

            assert.ok(oCheckWebSocketActivityStub.calledOnce === true, "_checkWebSocketActivity called once");
            assert.ok(oWebSocketRecoveryStepSpy.notCalled === true, "oWebSocketRecovery step NOT reached");
            assert.ok(oService._activatePollingAfterInterval.notCalled === true, "_activatePollingAfterInterval not called");

            oUserSettingInitializationStub.restore();
            oReadNotificationsDataStub.restore();
            oDataReadStub.restore();
            oRequireStub.restore();
            oGetWebSocketStub.restore();
            oIsPackagedAppModeStub.restore();
            oIsFioriClientModeStub.restore();
            oWebSocketRecoveryStepSpy.restore();
            oCheckWebSocketActivityStub.restore();
            oFioriClientRemainingDelayStub.restore();
        });
    });

    QUnit.test("WebSocket activity check , when not active", function (assert) {
        var oIsPackagedAppModeStub,
            oIsFioriClientModeStub,
            oReturnedWebSocket,
            oFioriClientRemainingDelayStub,
            oWebSocketRecoveryStepSpy,
            oCheckWebSocketActivityStub,
            oGetWebSocketStub,
            fGivenOnOpenCallback,
            oDataReadStub,
            oRequireStub,
            oUserSettingInitializationStub,
            oReadNotificationsDataStub,
            oWebSocketCloseSpy = sinon.spy();

        setStandardConfig();

        oDataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
            success({results: oBasicNotificationsResult.results}, {
                headers: {
                    "x-csrf-token": {},
                    DataServiceVersion: {}
                },
                data: {
                    GetBadgeNumber: {
                        Number: 4
                    }
                }
            });
        });

        // We don't want jQuery.sap.require("sap.ui.core.ws.SapPcpWebSocket") to be performed
        oRequireStub = sinon.stub(jQuery.sap, "require").returns({});

        // Define the custom WebSocket object
        // including an attachClose function that gets the onError callback in _establishWebSocketConnection
        // Later, we call that callback (with an appropriate message) and check that _readNotificationsData is called as a result
        oReturnedWebSocket = {
            attachMessage: function (oMessage, callback) {},
            attachError: function (oMessage, callback) {},
            attachOpen: function (oMessage, callback) {
                fGivenOnOpenCallback = callback;
            },
            attachClose: function (oMessage, callback) {},
            close: oWebSocketCloseSpy
        };

        testAsync(assert, function (oService) {
            oGetWebSocketStub = sinon.stub(oService, "_getWebSocketObjectObject").returns(oReturnedWebSocket);
            oReadNotificationsDataStub = sinon.stub(oService, "_readNotificationsData", function () {
                return jQuery.when();
            });

            oService._readSettingsFromServer = sinon.spy();
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
            oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(false);
            oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
            oCheckWebSocketActivityStub = sinon.stub(oService, "_checkWebSocketActivity", function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve(false);
                return oDeferred.promise();
            });
            oWebSocketRecoveryStepSpy = sinon.spy(oService, "_webSocketRecoveryStep");
            oService._activatePollingAfterInterval = sinon.spy();

            oService.init();

            // Call WebSocket onOpen in order to verify that validity check occurs
            fGivenOnOpenCallback();

            assert.ok(oCheckWebSocketActivityStub.calledOnce === true, "_checkWebSocketActivity called once");
            assert.ok(oWebSocketRecoveryStepSpy.notCalled === true, "oWebSocketRecovery step NOT reached");
            assert.ok(oWebSocketCloseSpy.calledOnce === true, "WebSocket close function called");
            assert.ok(oService._activatePollingAfterInterval.calledOnce === true, "_activatePollingAfterInterval called");

            oUserSettingInitializationStub.restore();
            oReadNotificationsDataStub.restore();
            oDataReadStub.restore();
            oRequireStub.restore();
            oGetWebSocketStub.restore();
            oIsPackagedAppModeStub.restore();
            oIsFioriClientModeStub.restore();
            oWebSocketRecoveryStepSpy.restore();
            oCheckWebSocketActivityStub.restore();
            oFioriClientRemainingDelayStub.restore();
        });
    });

    QUnit.test("Reach WebSocket recovery mode", function (assert) {
        var oIsPackagedAppModeStub,
            oIsFioriClientModeStub,
            oReturnedWebSocket,
            oFioriClientRemainingDelayStub,
            oWebSocketRecoveryStepSpy,
            oGetWebSocketStub,
            fGivenOnCloseCallback,
            oDataReadStub,
            oRequireStub,
            oUserSettingInitializationStub,
            oReadNotificationsDataStub,
            oOnErrorEvent = {
                mParameters: {
                    code: "",
                    reason: ""
                }
            };

        setStandardConfig();

        // We don't want jQuery.sap.require("sap.ui.core.ws.SapPcpWebSocket") to be performed
        oRequireStub = sinon.stub(jQuery.sap, "require").returns({});

        oDataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
            success({results: oBasicNotificationsResult.results}, {
                headers: {
                    "x-csrf-token": {},
                    DataServiceVersion: {}
                },
                data: {
                    GetBadgeNumber: {
                        Number: 4
                    }
                }
            });
        });
        // Define the custom WebSocket object
        // including an attachClose function that gets the onError callback in _establishWebSocketConnection
        // Later, we call that callback (with an appropriate message) and check that _readNotificationsData is called as a result
        oReturnedWebSocket = {
            attachMessage: function (oMessage, callback) {},
            attachError: function (oMessage, callback) {},
            attachOpen: function (oMessage, callback) {},
            attachClose: function (oMessage, callback) {
                fGivenOnCloseCallback = callback;
            }
        };

        testAsync(assert, function (oService) {
            oGetWebSocketStub = sinon.stub(oService, "_getWebSocketObjectObject").returns(oReturnedWebSocket);
            oReadNotificationsDataStub = sinon.stub(oService, "_readNotificationsData", function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve();
                return oDeferred.promise();
            });

            oService._readSettingsFromServer = sinon.spy();
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
            oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(false);
            oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
            oWebSocketRecoveryStepSpy = sinon.spy(oService, "_webSocketRecoveryStep");
            oService._activatePollingAfterInterval = sinon.spy();

            oService.init();

            // Call WebSocket onError in order to invoke WebSocketRecovery
            fGivenOnCloseCallback(oOnErrorEvent);

            assert.ok(oWebSocketRecoveryStepSpy.calledOnce === true, "oWebSocketRecoveryStepSpy called once");
            assert.ok(oService._activatePollingAfterInterval.notCalled === true, "_activatePollingAfterInterval not called");

            oUserSettingInitializationStub.restore();
            oReadNotificationsDataStub.restore();
            oDataReadStub.restore();
            oRequireStub.restore();
            oGetWebSocketStub.restore();
            oIsPackagedAppModeStub.restore();
            oIsFioriClientModeStub.restore();
            oWebSocketRecoveryStepSpy.restore();
            oFioriClientRemainingDelayStub.restore();
        });
    });

    QUnit.test("Reach Polling step", function (assert) {
        var done1 = assert.async();
        var oIsPackagedAppModeStub,
            oIsFioriClientModeStub,
            oReturnedWebSocket,
            oGetWebSocketStub,
            oFioriClientRemainingDelayStub,
            fGivenOnCloseCallback,
            oDataReadStub,
            oRequireStub,
            oReadNotificationsDataStub,
            oUserSettingInitializationStub,
            oOnErrorEvent = {
                mParameters: {
                    code: "",
                    reason: ""
                }
            };

        setStandardConfig();

        oDataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
            success({results: oBasicNotificationsResult.results}, {
                headers: {
                    "x-csrf-token": {},
                    DataServiceVersion: {}
                },
                data: {
                    GetBadgeNumber: {
                        Number: 4
                    }
                }
            });
        });

        // We don't want jQuery.sap.require("sap.ui.core.ws.SapPcpWebSocket") to be performed
        oRequireStub = sinon.stub(jQuery.sap, "require").returns({});

        // Define the custom WebSocket object
        // including an attachClose function that gets the onError callback in _establishWebSocketConnection
        // Later, we call that callback (with an appropriate message) and check that _readNotificationsData is called as a result
        oReturnedWebSocket = {
            attachMessage: function (oMessage, callback) {},
            attachError: function (oMessage, callback) {},
            attachOpen: function (oMessage, callback) {},
            attachClose: function (oMessage, callback) {
                fGivenOnCloseCallback = callback;
            }
        };


        testAsync(assert, function (oService) {
            oGetWebSocketStub = sinon.stub(oService, "_getWebSocketObjectObject").returns(oReturnedWebSocket);
            oService._readSettingsFromServer = sinon.spy();
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();

            oReadNotificationsDataStub = sinon.stub(oService, "_readNotificationsData", function () {
                return jQuery.when();
            });

            oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
            oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(false);
            oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
            oService._activatePollingAfterInterval = sinon.spy();

            oService.init();

            // Call WebSocket onError in order to invoke WebSocketRecovery for the first time
            fGivenOnCloseCallback(oOnErrorEvent);

            // The following happens as a result of the call to fGivenOnCloseCallback (previous command):
            // - The function _webSocketRecoveryStep of notifications service is called
            // - setTimeout is called (from _webSocketRecoveryStep) with a period of 5000 second
            // Since we want to call for the second time - we need to remove the clock more than 5000ms forward.
            window.setTimeout(function () {
                // Call WebSocket onError in order to invoke WebSocketRecovery for the second time
                fGivenOnCloseCallback(oOnErrorEvent);

                assert.ok(oService._activatePollingAfterInterval.calledOnce === true, "_activatePollingAfterInterval called once");

                oUserSettingInitializationStub.restore();
                oReadNotificationsDataStub.restore();
                oDataReadStub.restore();
                oGetWebSocketStub.restore();
                oRequireStub.restore();
                oIsPackagedAppModeStub.restore();
                oIsFioriClientModeStub.restore();
                oFioriClientRemainingDelayStub.restore();
                done1();
            }, 6000);
        });
    });

    QUnit.test("Get request URLs including intent based consumption", function (assert) {
        testAsync(assert, function (oService) {
            var oIsIntentBasedConsumptionStub,
            oGetConsumedIntentsStub;

            oIsIntentBasedConsumptionStub = sinon.stub(oService, "_isIntentBasedConsumption").returns(true);
            oGetConsumedIntentsStub = sinon.stub(oService, "_getConsumedIntents").returns(["a-b", "a-c", "c-b"]);

            assert.ok(oService._getRequestURI(0) === "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams&$filter=IsGroupHeader%20eq%20false&intents%20eq%20a-b,a-c,c-b", "Intent based consumption - correct getNotifications URL");
            assert.ok(oService._getRequestURI(1) === "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams&$filter=intents%20eq%20a-b,a-c,c-b", "Intent based consumption - correct getNotificationsByType URL");
            assert.ok(oService._getRequestURI(2) === "NOTIFICATIONS_SRV/GetBadgeCountByIntent(a-b,a-c,c-b)", "Intent based consumption - correct GetBadgeNumber URL");
            assert.ok(oService._getRequestURI(8) === "NOTIFICATIONS_SRV/Notifications/$count", "count url");
            oIsIntentBasedConsumptionStub.restore();
            oIsIntentBasedConsumptionStub = sinon.stub(oService, "_isIntentBasedConsumption").returns(false);

            assert.ok(oService._getRequestURI(0) === "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams&$filter=IsGroupHeader%20eq%20false", "Not intent based consumption - correct getNotifications URL");
            assert.ok(oService._getRequestURI(1) === "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams", "Not intent based consumption - correct getNotificationsByType URL");
            assert.ok(oService._getRequestURI(2) === "NOTIFICATIONS_SRV/GetBadgeNumber()", "Not intent based consumption - correct GetBadgeNumber URL");

            oIsIntentBasedConsumptionStub.restore();
            oGetConsumedIntentsStub.restore();
        });
    });

    /**
     * Service initialization in PackagedApp use-case:
     * Verify that polling is not activated, and instead - one read operation is executed (call to _readNotificationsData)
     *  also: verify that the handler _handlePushedNotification is registered
     */
    QUnit.test("Init in PackagedApp mode", function (assert) {
        var oRegisterForPushStub,
            oUserSettingInitializationStub;

        setStandardConfig();

        window.fiori_client_appConfig = {};
        window.fiori_client_appConfig.prepackaged = true;
        testAsync(assert, function (oService) {
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            oService._setNativeIconBadgeWithDelay = sinon.spy();
            oRegisterForPushStub = sinon.stub(oService, "_registerForPush").returns();
            oService._activatePollingAfterInterval = sinon.spy();
            oService._readNotificationsData = sinon.spy();

            oService.init();

            assert.ok(oService._getMode() === oModesEnum.PACKAGED_APP, "_getMode returns the correct mode");
            assert.ok(oRegisterForPushStub.calledOnce === true, "oRegisterForPush is called only once");
            assert.ok(oService._activatePollingAfterInterval.notCalled === true, "_activatePollingAfterInterval not called");
            assert.ok(oService._readNotificationsData.calledOnce === true, "_readNotificationsData called once");

            window.fiori_client_appConfig = undefined;
            oUserSettingInitializationStub.restore();
            oRegisterForPushStub.restore();
        });
    });

    /**
     * Service initialization in Fiori client use-case:
     * Verify that polling is not activated, and instead - one read operation is executed (call to _readNotificationsData)
     *  also: verify that the handler _handlePushedNotification is registered for the event deviceready
     */
    QUnit.test("Init in Fiori Client mode", function (assert) {
        var oAddEventListenerStub,
            oFioriClientRemainingDelayStub,
            oIsPackagedAppModeStub,
            oIsFioriClientModeStub,
            oReadNotificationsDataStub,
            oUserSettingInitializationStub,
            fHandler = function () {};

        setStandardConfig();

        sinon.stub(OData, "read", function (request, success, fail) {
            success({results: oBasicNotificationsResult.results}, {
                headers: {
                    "x-csrf-token": {},
                    DataServiceVersion: {}
                },
                data: {
                    GetBadgeNumber: {
                        Number: 4
                    }
                }
            });
        });

        window.sap.Push = {};
        window.sap.Push.initPush = {};
        oAddEventListenerStub = sinon.stub(document, "addEventListener", function (sEventName, fCallback, bFlag) { return; });

        testAsync(assert, function (oService) {
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            oService._getPushedNotificationCallback = fHandler;

            oReadNotificationsDataStub = sinon.stub(oService, "_readNotificationsData", function () {
                return jQuery.when();
            });

            // Indicating that it is not packagedAdd mode
            oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
            // Indicating that it is FioriClient mode
            oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(true);
            // For validating that the next step (after FioriClient step) is not called
            oService._webSocketStep = sinon.spy();
            // In order to avoid waiting with setTimout to the end of the required FioriClient delay
            oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);

            oService.init();

            assert.ok(oService._getMode() === oModesEnum.FIORI_CLIENT, "_getMode returns oModesEnum.FIORI_CLIENT");
            assert.ok(oService._webSocketStep.notCalled === true, "Fiori Client mode: _activatePollingAfterInterval not called");
            assert.ok(oAddEventListenerStub.calledOnce, "document.addEventListener called once");
            assert.ok(oAddEventListenerStub.args[0][0] === "deviceready", "Callback registered for event deviceready");

            oUserSettingInitializationStub.restore();
            oReadNotificationsDataStub.restore();
            oAddEventListenerStub.restore();
            oFioriClientRemainingDelayStub.restore();
            oIsPackagedAppModeStub.restore();
            oIsFioriClientModeStub.restore();
            document.removeEventListener("deviceready", fHandler);
            OData.read.restore();
        });
    });

    /**
     * WebSocket use-case and handling of a "ping" message
     */
    QUnit.test("WebSocket mode", function (assert) {
        var oReturnedWebSocket,
            oWebSocketPingMessage,
            fGivenAttachMessageCallback,
            oRequireStub,
            oGetWebSocketStub,
            oOriginalSapUiCoreWS = sap.ui.core.ws;

        // Define the custom WebSocket object.
        // It includes an attachMessage function that gets the onMessage callback in _establishWebSocketConnection
        // Later, we call that callback (with an appropriate message) and check that _readNotificationsData is called as a result
        oReturnedWebSocket = {
            attachMessage: function (oMessage, callback) {
                fGivenAttachMessageCallback = callback;
            },
            attachClose: function (oMessage, callback) {},
            attachOpen: function (oMessage, callback) {},
            attachError: function (oMessage, callback) {}
        };

        testAsync(assert, function (oService) {
            oGetWebSocketStub = sinon.stub(oService, "_getWebSocketObjectObject").returns(oReturnedWebSocket);

            oService._activatePollingAfterInterval = sinon.spy();

            // The call to _readNotificationsData is what we would like to test,
            // as a result of the next call to fGivenAttachMessageCallback
            oService._readNotificationsData = sinon.spy();

            oWebSocketPingMessage = {
                getParameter: function (sParamName) {
                    if (sParamName === "pcpFields") {
                        return {
                            Command: "Notification"
                        };
                    }
                }
            };

            // We don't want jQuery.sap.require("sap.ui.core.ws.SapPcpWebSocket") to be performed
            oRequireStub = sinon.stub(jQuery.sap, "require").returns({});

            // Start the flow
            oService._webSocketStep();

            assert.ok(oService._readNotificationsData.notCalled === true, "Before the onMessage callback: _readNotificationsData not called");

            // Call the message callback in order to verify that it calls _readNotificationsData
            fGivenAttachMessageCallback(oWebSocketPingMessage, {});

            assert.ok(oService._readNotificationsData.calledOnce === true, "After the onMessage callback: _readNotificationsData called from the WebSoocket on attachMessage event");
            assert.ok(oService._getMode() === oModesEnum.WEB_SOCKET, "_getMode returns oModesEnum.WEB_SOCKET");
            assert.ok(oService._activatePollingAfterInterval.notCalled === true, "_activatePollingAfterInterval not called");

            oRequireStub.restore();
            oGetWebSocketStub.restore();
            sap.ui.core.ws = oOriginalSapUiCoreWS;
        });
    });

    QUnit.test("Verify executeAction function - success", function (assert) {
        var oPromise,
            oInvalidCsrfTokenRecoveryStub;

        sinon.stub(OData, "request");

        testAsync(assert, function (oService) {
            oService.notificationsSeen();
            oInvalidCsrfTokenRecoveryStub = sinon.stub(oService, "_invalidCsrfTokenRecovery").returns();

            oPromise = oService.executeAction("notificationId", "actionId");

            oPromise.done(function () {
                assert.ok(true, "resolve is called");
                assert.ok(oInvalidCsrfTokenRecoveryStub.notCalled === true, "No CSRF Token problem - InvalidCsrfTokenRecoveryStub not called");
            });
            OData.request.args[1][1]("true");

            OData.request.restore();
            oInvalidCsrfTokenRecoveryStub.restore();
        });
    });

    QUnit.test("Verify executeAction function - general failure", function (assert) {
        var oPromise,
            oInvalidCsrfTokenRecoveryStub;

        sinon.stub(OData, "request");
        testAsync(assert, function (oService) {
            oService.notificationsSeen();
            oInvalidCsrfTokenRecoveryStub = sinon.stub(oService, "_invalidCsrfTokenRecovery").returns();

            oPromise = oService.executeAction("notificationId", "actionId");

            oPromise.fail(function () {
                assert.ok(true, "reject is called");
                assert.ok(oInvalidCsrfTokenRecoveryStub.notCalled === true, "No CSRF Token problem - InvalidCsrfTokenRecoveryStub not called");
            });
            OData.request.args[1][2]("true");

            OData.request.restore();
            oInvalidCsrfTokenRecoveryStub.restore();
        });
    });

    QUnit.test("Verify executeAction function - invalid CSRF token failure, step 1", function (assert) {
        var oInvalidCsrfTokenRecoveryStub;

        testAsync(assert, function (oService) {
            oInvalidCsrfTokenRecoveryStub = sinon.stub(oService, "_invalidCsrfTokenRecovery").returns();

            sinon.stub(OData, "request", function (oRequest, fSuccessFn, fFailureFn) {
                fFailureFn(
                    {
                        response: {
                            statusCode: 403,
                            headers: {"x-csrf-token": "Required"}
                        }
                    }
                );
            });

            oService.executeAction("notificationId", "actionId");

            assert.ok(oInvalidCsrfTokenRecoveryStub.calledOnce === true, "Invalid CSRF Token problem - invalidCsrfTokenRecovery called");
            assert.ok(oInvalidCsrfTokenRecoveryStub.args[0][1] === oService.executeAction, "Invalid CSRF Token problem - the original function passed to invalidCsrfTokenRecovery");
            assert.ok(oInvalidCsrfTokenRecoveryStub.args[0][2][0] === "notificationId", "Invalid CSRF Token problem - the original call parameters passed to invalidCsrfTokenRecovery");
            assert.ok(oInvalidCsrfTokenRecoveryStub.args[0][2][1] === "actionId", "Invalid CSRF Token problem - the original call parameters passed to invalidCsrfTokenRecovery");

            oInvalidCsrfTokenRecoveryStub.restore();
            OData.request.restore();
        });
    });

    QUnit.test("test _invalidCsrfTokenRecovery when CSRF token is invalid and the recovery fails (called function is executeAction)", function (assert) {
        var oPromise,
            oGetNotificationsBufferBySortingTypeStub;

        testAsync(assert, function (oService) {
            sinon.spy(oService, "executeAction");

            oGetNotificationsBufferBySortingTypeStub = sinon.stub(oService, "getNotificationsBufferBySortingType", function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve();
                return oDeferred.promise();
            });

            sinon.stub(OData, "request", function (oRequest, fSuccessFn, fFailureFn) {
                fFailureFn(
                    {
                        response: {
                            statusCode: 403,
                            headers: {"x-csrf-token": "Required"}
                        }
                    }
                );
            });

            oPromise = oService.executeAction("notificationId", "actionId");

            assert.ok(oGetNotificationsBufferBySortingTypeStub.calledOnce === true, "Invalid CSRF Token problem - getNotificationsBufferBySortingType called for obtaining updated token");
            assert.ok(oService.executeAction.calledTwice === true, "Invalid CSRF Token problem - executeAction called twice");
            assert.ok(oPromise.state() === "rejected", "CSRF Token keeps being invalid - executeAction returns rejected promise");

            oGetNotificationsBufferBySortingTypeStub.restore();
            OData.request.restore();
        });
    });

    QUnit.test("test _invalidCsrfTokenRecovery when CSRF token is invalid and the recovery is successful (called function is executeAction)", function (assert) {
        var oPromise,
            oGetNotificationsBufferBySortingTypeStub,
            iExecuteActionCalled = false;

        testAsync(assert, function (oService) {
            sinon.spy(oService, "executeAction");

            // getNotificationsBufferBySortingType is called by _invalidCsrfTokenRecovery in order to obtain updated/valid CSRF token
            oGetNotificationsBufferBySortingTypeStub = sinon.stub(oService, "getNotificationsBufferBySortingType", function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve();
                return oDeferred.promise();
            });

            sinon.stub(OData, "request", function (oRequest, fSuccessFn, fFailureFn) {
                if (!iExecuteActionCalled) {
                    iExecuteActionCalled = true;
                    fFailureFn({
                        response: {
                            statusCode: 403,
                            headers: {"x-csrf-token": "Required"}
                        }
                    });
                } else {
                    fSuccessFn();
                }
            });

            oPromise = oService.executeAction("notificationId", "actionId");

            assert.ok(oGetNotificationsBufferBySortingTypeStub.calledOnce === true, "Invalid CSRF Token problem - getNotificationsBufferBySortingType called for obtaining updated token");
            assert.ok(oService.executeAction.calledTwice === true, "Invalid CSRF Token problem - executeAction called twice");
            assert.ok(oPromise.state() === "resolved", "CSRF Token is valid after recovery - executeAction returns resolved promise");

            oGetNotificationsBufferBySortingTypeStub.restore();
            OData.request.restore();
        });
    });

    QUnit.test("Verify executeAction function - failure and some notifications actions success", function (assert) {
        testAsync(assert, function (oService) {
            sinon.stub(OData, "request");
            oService.notificationsSeen();
            oService.executeAction("notificationId", "actionId").done(function (oResult) {
                assert.ok(oResult.isSucessfull === true, "oResult status is sucessfull");
                assert.ok(oResult.message === "text", "oResult status is currect");
            });
            OData.request.args[1][2]({response: {statusCode: 200, body: "{\"Success\": true, \"MessageText\": \"text\"}"}});
            OData.request.restore();
        });
    });

    /**
     * Verify that the OData calls are sent correctly
     */
    QUnit.test("Verify that the OData calls are sent correctly", function (assert) {
        var oFioriClientRemainingDelayStub,
            oEstablishWebSocketStub;

        testAsync(assert, function (oService) {
            sinon.stub(OData, "request");
            sinon.stub(OData, "read");

            oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
            oService._updateNotificationsConsumers = sinon.spy();
            oService._updateNotificationsCountConsumers = sinon.spy();
            oEstablishWebSocketStub = sinon.stub(oService, "_establishWebSocketConnection").returns(false);
            oService._determineMode = sinon.spy();

            oService.notificationsSeen();
            assert.ok(OData.request.args[0][0].method === "POST", "Call to notificationsSeen: OData.request was called with method POST");
            assert.ok(OData.request.args[0][0].requestUri.endsWith("NOTIFICATIONS_SRV/ResetBadgeNumber") === true, "notificationsSeen: OData.request was called with funciton call ResetBadgeNumber");

            oService._readUnseenNotificationsCount();
            assert.ok(OData.read.args[0][0].requestUri.endsWith("NOTIFICATIONS_SRV/GetBadgeNumber()") === true, "_readUnseenNotificationsCount: OData.request was called with function call GetBadgeNumber");

            oService._readNotificationsData();
            assert.ok(OData.read.args[1][0].requestUri.endsWith("NOTIFICATIONS_SRV/GetBadgeNumber()") === true, "_readNotificationsData 1st call: GetBadgeNumber");
            assert.ok(OData.request.args[1][0].requestUri.endsWith("NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams&$orderby=CreatedAt%20desc&$filter=IsGroupHeader%20eq%20false&$skip=0&$top=10") === true,
                    "_readNotificationsData 2nd call: Get Notifications");

            oService.executeAction("notificationId", "actionId");

            assert.ok(OData.request.args[2][0].method === "POST", "executeAction: OData.request was called with method POST");
            assert.ok(OData.request.args[2][0].requestUri.endsWith("ExecuteAction") === true, "executeAction: OData.request was called with function ExecuteAction");
            assert.ok(OData.request.args[2][0].data.ActionId === "actionId", "executeAction: ActionId should be 'actionId'");
            assert.ok(OData.request.args[2][0].data.NotificationId === "notificationId", "executeAction: NotificationId should be 'notificationId'");

            oService.executeBulkAction("notificationGroupId", "actionIdForBulk");
            assert.ok(OData.request.args.length === 4, "number of calls to OData request is 6: 3 previous calls, and 1 as a result of the executeBulkAction call");

            assert.ok(OData.request.args[3][0].method === "POST", "executeBulkAction: 1st OData.request was called with method POST");
            assert.ok(OData.request.args[3][0].requestUri.endsWith("BulkActionByHeader") === true, "executeBulkAction: OData.request was called with function BulkActionByHeader");
            assert.ok(OData.request.args[3][0].data.ActionId === "actionIdForBulk", "executeBulkAction: ActionId should be 'actionIdForBulk'");
            assert.ok(OData.request.args[3][0].data.ParentId === "notificationGroupId", "executeBulkAction: ParentId is notificationGroupId");

            oService.dismissBulkNotifications("notificationId1");
            assert.ok(OData.request.args.length === 5, "number of calls to OData request is 5: 4 previous calls, and 1 as a result of the dismissBulkNotifications call");

            assert.ok(OData.request.args[4][0].method === "POST", "dismissBulkNotifications: OData.request was called with method POST");
            assert.ok(OData.request.args[4][0].requestUri.endsWith("DismissAll") === true, "dismissBulkNotifications: OData.request was called with function ExecuteAction");
            assert.ok(OData.request.args[4][0].data.ParentId === "notificationId1", "dismissBulkNotifications: notificationId is notificationId1");

            OData.request.restore();
            OData.read.restore();
            oEstablishWebSocketStub.restore();
            oFioriClientRemainingDelayStub.restore();
        });
    });

    /**
     * Verify that the model is updated correctly with notifications data
     */
    QUnit.test("Verify that the model is updated correctly with notifications data", function (assert) {
        var oEstablishWebSocketStub,
            oFioriClientRemainingDelayStub,
            oUserSettingInitializationStub,
            oUnseenCount = {
                "data":
                    {
                        "GetBadgeNumber":
                            {
                                "Number": 1
                            }
                    }
            };

        testAsync(assert, function (oService) {
            sinon.stub(oService, "_activatePollingAfterInterval", function () {
                oService._readNotificationsData(true);
            });
            sinon.stub(OData, "read", function (request, success, fail) {
                success(oBasicNotificationsResult, oUnseenCount);
            });
            sinon.stub(OData, "request", function (request, success, fail) {
                success(oNotificationsResult);
            });

            oService._readSettingsFromServer = sinon.spy();
            oEstablishWebSocketStub = sinon.stub(oService, "_establishWebSocketConnection").returns(false);
            oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
            oService._getHeaderXcsrfToken = sinon.stub().returns(true);
            oService._getDataServiceVersion = sinon.stub().returns(true);
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            oService._isFioriClientMode = sinon.stub().returns(false);
            oService._updateCSRF = sinon.spy();
            oService._updateNotificationsConsumers = sinon.spy();
            oService._updateNotificationsCountConsumers = sinon.spy();
            oService._determineMode = sinon.spy();
            oService._establishWebSocketConnection = sinon.spy();
            oService._getModel().setProperty = sinon.spy();

            oService.init();

            assert.ok(oService._getModel().setProperty.callCount === 3, "setProperty of the model was called 3 times");
            assert.ok(oService._getModel().setProperty.args[0][0] === "/UnseenCount", "2nd call to setProperty: setting UnseenCount");
            assert.ok(oService._getModel().setProperty.args[0][1] === 1, "2nd call to setProperty:  putting the value 1");
            assert.ok(oService._getModel().setProperty.args[1][0] === "/NotificationsCount", "1st call to setProperty: setting Notifications data");
            assert.ok(oService._getModel().setProperty.args[2][0] === "/Notifications", "1st call to setProperty: setting Notifications data");
            assert.ok(oService._getModel().setProperty.args[2][1].length === 4, "1st call to setProperty: putting 4 array of 4 notifications");

            oUserSettingInitializationStub.restore();
            OData.read.restore();
            OData.request.restore();
            oEstablishWebSocketStub.restore();
            oFioriClientRemainingDelayStub.restore();
        });
    });

    /**
     * Register callback functions and call them on data update (OData.read success)
     */
    QUnit.test("Callback functions called on update", function (assert) {
        var oUserSettingInitializationStub,
            oUnseenCount = {
                "data":
                    {
                        "GetBadgeNumber":
                            {
                                "Number": 2
                            }
                    }
            },
            oNotificationsCallback1 = sinon.spy(),
            oNotificationsCallback2 = sinon.spy(),
            oNotificationsCallback3 = sinon.spy(),
            oNotificationsCountCallback1 = sinon.spy(),
            oNotificationsCountCallback2 = sinon.spy(),
            oNotificationsCountCallback3 = sinon.spy();

        testAsync(assert, function (oService) {
            sinon.stub(OData, "read", function (request, success, fail) {
                success(oBasicNotificationsResult, oUnseenCount);
            });
            sinon.stub(OData, "request", function (request, success, fail) {
                success(oNotificationsResult);
            });

            oService._readSettingsFromServer = sinon.spy();
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
            var oEstablishWebSocketStub = sinon.stub(oService, "_establishWebSocketConnection", function () {
                oService._activatePollingAfterInterval();
            });
            oService._isFioriClientMode = sinon.stub().returns(false);
            oService._updateCSRF = sinon.spy();
            oService._getHeaderXcsrfToken = sinon.stub().returns(true);
            oService._getDataServiceVersion = sinon.stub().returns(true);

            // Register notifications callback functions
            oService.registerNotificationsUpdateCallback(oNotificationsCallback1);
            oService.registerNotificationsUpdateCallback(oNotificationsCallback2);
            oService.registerNotificationsUpdateCallback(oNotificationsCallback3);

            // Register notifications count callback functions
            oService.registerNotificationCountUpdateCallback(oNotificationsCountCallback1);
            oService.registerNotificationCountUpdateCallback(oNotificationsCountCallback2);
            oService.registerNotificationCountUpdateCallback(oNotificationsCountCallback3);

            sinon.stub(oService, "_activatePollingAfterInterval", function () {
                oService._readNotificationsData(true);
            });

            oService.init();

            assert.ok(oNotificationsCallback1.calledTwice === true, "1st notifications callback called");
            assert.ok(oNotificationsCallback2.calledTwice === true, "2nd notifications callback called");
            assert.ok(oNotificationsCallback3.calledTwice === true, "3rd notifications callback called");

            assert.ok(oNotificationsCountCallback1.calledTwice === true, "1st notifications count callback called");
            assert.ok(oNotificationsCountCallback2.calledTwice === true, "2nd notifications count callback called");
            assert.ok(oNotificationsCountCallback3.calledTwice === true, "3rd notifications count callback called");

            oService._activatePollingAfterInterval.restore();
            oUserSettingInitializationStub.restore();
            oEstablishWebSocketStub.restore();
            OData.request.restore();
            OData.read.restore();
        });
    });

    /**
     * Disable calling callback functions after notifications data read
     */
    QUnit.test("Disable calling callback functions after notifications data read", function (assert) {
        var oUnseenCount = {
                "data": {
                    "GetBadgeNumber": {
                        "Number": 2
                    }
                }
            };

        testAsync(assert, function (oService) {
            sinon.stub(OData, "read", function (request, success, fail) {
                success(oBasicNotificationsResult, oUnseenCount);
            });

            oService._getHeaderXcsrfToken = sinon.stub().returns(true);
            oService._getDataServiceVersion = sinon.stub().returns(true);
            oService._isFioriClientMode = sinon.stub().returns(false);
            oService._updateNotificationsConsumers = sinon.spy();
            oService._updateNotificationsCountConsumers = sinon.spy();

            // Call _readNotificationsData with parameter false in oder to disable calling the registered callback functions
            oService._readNotificationsData(false);
            assert.ok(oService._updateNotificationsConsumers.notCalled === true, "Service private function _updateNotificationsConsumers was not called because the value 'false' was passed to _readNotificationsData");
            assert.ok(oService._updateNotificationsCountConsumers.notCalled === true, "Service private function _updateNotificationsCountConsumers was not called because the value 'false' was passed to _readNotificationsData");

            OData.read.restore();
        });
    });

    /**
     * getNotifications full flow, including:
     * - Service initialization
     * - Cosumer registraiotn oc callback function
     * - First readNotification call
     * - Verify that the resigtered callback was called with the correct notifications data
     */
    QUnit.test("API: getNotifications full flow", function (assert) {
        var oUnseenCount = {
                "data": {
                    "GetBadgeNumber": {
                        "Number": 4
                    }
                }
            };

        setStandardConfig();

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sinon.stub(OData, "request", function (request, success, fail) {
            success(oNotificationsResult);
        });

        testAsync(assert, function (oService) {
            function notificationsCallback () {
                var oNotificationsPromise = oService.getNotifications();
                oNotificationsPromise.done(function (oNotifications) {
                    assert.ok(oNotifications.length === 4, "Function getNotifications returns the expected number of notifications");
                    assert.ok(oNotifications[0].id === "FirstNotification", "First notification is correct");
                    assert.ok(oNotifications[1].id === "SecondNotification", "Second notification is correct");
                    assert.ok(oNotifications[2].id === "ThirdNotification", "Third notification is correct");
                    assert.ok(oNotifications[3].id === "FourthNotification", "Fourth notification is correct");
                });
            }
            oService.registerNotificationsUpdateCallback(notificationsCallback);
            var oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            oService._readSettingsFromServer = sinon.spy();
            oService._updateCSRF = sinon.spy();
            oService._fioriClientStep = sinon.spy();

            var oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
            oService._getHeaderXcsrfToken = sinon.stub().returns(true);
            oService._getDataServiceVersion = sinon.stub().returns(true);

            oService.init();

            OData.read.restore();
            OData.request.restore();
            oUserSettingInitializationStub.restore();
            oIsPackagedAppModeStub.restore();
        });
    });

    /**
     * Intent based consumption full flow - verify URL correctness
     */
    QUnit.test("Intent based consumption full flow - verify URL correctness", function (assert) {
        sinon.stub(OData, "read");
        sinon.stub(OData, "request");
        setStandardConfig();
        window["sap-ushell-config"].services.Notifications.config.intentBasedConsumption = true;
        window["sap-ushell-config"].services.Notifications.config.consumedIntents = [{intent: "a-b"}, {intent: "a-c"}, {intent: "d-a"}];

        testAsync(assert, function (oService) {
            var oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            var oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
            oService._readSettingsFromServer = sinon.spy();

            oService.init();

            assert.ok(OData.read.callCount == 2, "Two call to OData.read");
            assert.ok(OData.request.calledOnce == true, "One calles to OData.request");
            assert.ok(OData.read.args[0][0].requestUri === "NOTIFICATIONS_SRV/GetBadgeCountByIntent(a-b,a-c,d-a)", "The 1st call to OData.read for badge number includes the intents");
            assert.ok(OData.read.args[1][0].requestUri === "NOTIFICATIONS_SRV/Notifications/$count", "The 2nd call to OData.read for notification count ");
            assert.ok(OData.request.args[0][0].requestUri === "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams&$orderby=CreatedAt%20desc&$filter=IsGroupHeader%20eq%20false&$skip=0&$top=10&intents%20eq%20&NavigationIntent%2520eq%2520%2527a-b%2527NavigationIntent%2520eq%2520%2527a-c%2527NavigationIntent%2520eq%2520%2527d-a%2527", "The 2nd call to OData.read for badgenumber inclued the intents");

            window["sap-ushell-config"].services.Notifications.config.intentBasedConsumption = undefined;
            window["sap-ushell-config"].services.Notifications.config.consumedIntents = undefined;
            oUserSettingInitializationStub.restore();
            oIsPackagedAppModeStub.restore();

            OData.read.restore();
            OData.request.restore();
        });
    });

    /**
     * getUnseenNotificationsCount full flow:
     * Starts from service initialization, until invoking consumer that gets correct unseenNotificationsCount data
     */
    QUnit.test("API: getUnseenNotificationsCount full flow", function (assert) {
        var oIsEnabledStub,
            oIsPackagedAppModeStub,
            oIsFioriClientModeStub,
            oFioriClientRemainingDelayStub,
            oEstablishWebSocketStub,
            oUserSettingInitializationStub,
            oGetNotificationsBufferBySortingType,
            oUnseenCount = {
                "data":
                    {
                        "GetBadgeNumber":
                            {
                                "Number": 2
                            }
                    }
            };

        window["sap-ushell-config"] = {
            "services": {
                "Notifications": {
                    config: {
                        enabled: false,
                        serviceUrl: "NOTIFICATIONS_SRV"
                    }
                }
            }
        };

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });

        testAsync(assert, function (oService) {
            oUserSettingInitializationStub = sinon.stub(oService, "_userSettingInitialization").returns();
            oIsEnabledStub = sinon.stub(oService, "isEnabled").returns(true);

            // Stub objects for reaching the rqeuires mode:

            // Indicating that it is not packagedAdd mode
            oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
            // Indicating that it is FioriClient mode
            oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(false);
            // In order to avoid waiting with setTimout to the end of the required FioriClient delay
            oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
            // For avoinding WebSocket initialization
            oEstablishWebSocketStub = sinon.stub(oService, "_establishWebSocketConnection", function () {
                oService._activatePollingAfterInterval();
            });

            oService._getHeaderXcsrfToken = sinon.stub().returns(true);
            oService._getDataServiceVersion = sinon.stub().returns(true);

            oService.registerNotificationCountUpdateCallback(function () {
                var oNotificationsCountPromise = oService.getUnseenNotificationsCount();
                oNotificationsCountPromise.done(function (iCount) {
                    assert.ok(parseInt(iCount, 10) === 2, "Function getCount returns the expected number of unseen notifications");
                });
            });

            oGetNotificationsBufferBySortingType = sinon.stub(oService, "getNotificationsBufferBySortingType").returns(jQuery.Deferred().resolve({}));

            sinon.stub(oService, "_activatePollingAfterInterval", function () {
                oService._readNotificationsData(true);
            });

            oService.init();

            oIsEnabledStub.restore();
            oUserSettingInitializationStub.restore();
            oIsPackagedAppModeStub.restore();
            oIsFioriClientModeStub.restore();
            oFioriClientRemainingDelayStub.restore();
            oEstablishWebSocketStub.restore();
            oGetNotificationsBufferBySortingType.restore();
            OData.read.restore();
        });
    });

    /**
     * Verify that data update occures atfer each data change
     */
    QUnit.test("Data update occurs after each data change", function (assert) {
        setStandardConfig();
        testAsync(assert, function (oService) {
            var oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
            var oEstablishWebSocketStub = sinon.stub(oService, "_establishWebSocketConnection").returns(false);
            var oGetModeStub = sinon.stub(oService, "_getMode").returns(oModesEnum.POLLING);

            sinon.stub(OData, "request");

            oService._readNotificationsData = sinon.spy();

            oService.notificationsSeen();
            assert.ok(oService._readNotificationsData.callCount === 0, "oService._readNotificationsData should not called");
            assert.ok(OData.request.args[0][0].requestUri === sServicePath + "/ResetBadgeNumber", "ResetBadgeNumber should trigger ResetBadgeNumber api");

            oService.executeAction("notificationId", "actionId");
            assert.ok(oService._readNotificationsData.callCount === 0, "oService._readNotificationsData should not called");

            oFioriClientRemainingDelayStub.restore();
            oEstablishWebSocketStub.restore();
            oGetModeStub.restore();
            OData.request.restore();
        });
    });

    /**
     * Push notification in Fiori client use-case.
     * Verify that calling _handlePushedNotification triggers an OData.read request.
     */
    QUnit.test("Push notification scenario in Fiori Client mode - foreground use-case", function (assert) {
        var oUnseenCount = {
                "data": {
                    "GetBadgeNumber": {
                        "Number": 1
                    }
                }
            };

        setStandardConfig();

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sinon.stub(OData, "request", function (request, success, fail) {
            success(oNotificationsResult);
        });

        testAsync(assert, function (oService) {
            oService._getHeaderXcsrfToken = sinon.stub().returns(true);
            oService._getDataServiceVersion = sinon.stub().returns(true);
            oService._readNotificationsData = sinon.spy();
            oService.markRead = sinon.spy();
            oService._handlePushedNotification({additionalData: {foreground: true}});

            assert.ok(oService._readNotificationsData.calledOnce === true, "Function _readNotificationsData was called by _handlePushedNotification");
            assert.ok(oService.markRead.notCalled === true, "Function MarkRead was not called by _handlePushedNotification in Foreground scenario");

            OData.read.restore();
            OData.request.restore();
        });
    });

    QUnit.test("Push notification scenario in Fiori Client mode - Empty data object (should be handled the same way as foreground use-case)", function (assert) {
        var oUnseenCount = {
                "data": {
                    "GetBadgeNumber": {
                        "Number": 1
                    }
                }
            };

        setStandardConfig();

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sinon.stub(OData, "request", function (request, success, fail) {
            success(oNotificationsResult);
        });

        testAsync(assert, function (oService) {
            oService._updateCSRF = sinon.spy();
            oService._getHeaderXcsrfToken = sinon.stub().returns(true);
            oService._getDataServiceVersion = sinon.stub().returns(true);
            oService._readNotificationsData = sinon.spy();
            oService.markRead = sinon.spy();
            oService._handlePushedNotification({});

            assert.ok(oService._readNotificationsData.calledOnce === true, "Function _readNotificationsData was called by _handlePushedNotification");
            assert.ok(oService.markRead.notCalled === true, "Function MarkRead was not called by _handlePushedNotification in Foreground scenario");

            OData.read.restore();
            OData.request.restore();
        });
    });

    QUnit.test("Push notification scenario in Fiori Client mode - Undefined data object", function (assert) {
        setStandardConfig();
        testAsync(assert, function (oService) {
            oService._getHeaderXcsrfToken = sinon.stub().returns(true);
            oService._getDataServiceVersion = sinon.stub().returns(true);
            oService._readNotificationsData = sinon.spy();
            oService.markRead = sinon.spy();
            oService._handlePushedNotification();

            assert.ok(oService._readNotificationsData.notCalled === true, "Function _readNotificationsData was not called by _handlePushedNotificatio");
            assert.ok(oService.markRead.notCalled === true, "Function MarkRead was not called by _handlePushedNotification");
        });
    });

    /**
     * Push notification in Fiori client use-case.
     * Verify that calling _handlePushedNotification triggers an OData.read request.
     */
    QUnit.test("Push notification scenario in Fiori Client mode - background use-case", function (assert) {
        var oOrigToExternalNavigation = utils.toExternalWithParameters,
            oUnseenCount = {
                "data": {
                    "GetBadgeNumber": {
                        "Number": 1
                    }
                }
            };

        setStandardConfig();

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sinon.stub(OData, "request", function (request, success, fail) {
            success(oNotificationsResult);
        });

        utils.toExternalWithParameters = sinon.spy();

        testAsync(assert, function (oService) {
            oService._getHeaderXcsrfToken = sinon.stub().returns(true);
            oService._getDataServiceVersion = sinon.stub().returns(true);
            oService._readNotificationsData = sinon.spy();
            oService.markRead = sinon.spy();
            oService._handlePushedNotification({
                NotificationId: "123",
                NavigationTargetObject: "object1",
                NavigationTargetAction: "action1",
                NavigationTargetParam: "param1",
                additionalData: {
                    foreground: false
                }
            });

            assert.ok(oService._readNotificationsData.calledOnce === true, "Function _readNotificationsData was called by _handlePushedNotification");
            assert.ok(oService.markRead.calledOnce === true, "Function MarkRead was called by _handlePushedNotification");
            assert.ok(oService.markRead.args[0][0] === "123", "Function MarkRead was called with the correct notification ID");
            assert.ok(utils.toExternalWithParameters.calledOnce === true, "Function utils.toExternalWithParameters was called once by _handlePushedNotification");
            assert.ok(utils.toExternalWithParameters.args[0][0] === "object1", "Function utils.toExternalWithParameters was called with the correct senamtic object");
            assert.ok(utils.toExternalWithParameters.args[0][1] === "action1", "Function utils.toExternalWithParameters was called with the correct action");
            assert.ok(utils.toExternalWithParameters.args[0][2][0] === "param1", "Function utils.toExternalWithParameters was called with the correct parameters");

            OData.read.restore();
            OData.request.restore();
            utils.toExternalWithParameters = oOrigToExternalNavigation;
        });
    });

    /**
     * Push notification in Fiori client use-case with additional data
     * Verify that calling _handlePushedNotification triggers an OData.read request
     * and that the navigation action is called with the correct parameters
     */
    QUnit.test("Push notification scenario in Fiori Client mode - background use-case with additionalData", function (assert) {
        var oOrigToExternalNavigation = utils.toExternalWithParameters,
            oUnseenCount = {
                "data": {
                    "GetBadgeNumber": {
                        "Number": 1
                    }
                }
            };

        setStandardConfig();

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sinon.stub(OData, "request", function (request, success, fail) {
            success(oNotificationsResult);
        });

        utils.toExternalWithParameters = sinon.spy();

        testAsync(assert, function (oService) {
            oService._getHeaderXcsrfToken = sinon.stub().returns(true);
            oService._getDataServiceVersion = sinon.stub().returns(true);
            oService._readNotificationsData = sinon.spy();
            oService.markRead = sinon.spy();
            oService._handlePushedNotification({
                NotificationId: "123",
                additionalData: {
                    NavigationTargetObject: "additional_object1",
                    NavigationTargetAction: "additional_action1",
                    NavigationTargetParam: "additional_param1",
                    foreground: false
                }
            });

            assert.ok(oService._readNotificationsData.calledOnce === true, "Function _readNotificationsData was called by _handlePushedNotification");
            assert.ok(oService.markRead.calledOnce === true, "Function MarkRead was called by _handlePushedNotification");
            assert.ok(oService.markRead.args[0][0] === "123", "Function MarkRead was called with the correct notification ID");
            assert.ok(utils.toExternalWithParameters.calledOnce === true, "Function utils.toExternalWithParameters was called once by _handlePushedNotification");
            assert.ok(utils.toExternalWithParameters.args[0][0] === "additional_object1", "Function utils.toExternalWithParameters was called with the correct senamtic object");
            assert.ok(utils.toExternalWithParameters.args[0][1] === "additional_action1", "Function utils.toExternalWithParameters was called with the correct action");
            assert.ok(utils.toExternalWithParameters.args[0][2][0] === "additional_param1", "Function utils.toExternalWithParameters was called with the correct parameters");

            OData.read.restore();
            OData.request.restore();
            utils.toExternalWithParameters = oOrigToExternalNavigation;
        });
    });

    /**
     * Push notification in Fiori client use-case with partial additional data
     * Verify that calling _handlePushedNotification triggers an OData.read request
     * and that the navigation action is called with the correct parameters,
     * while additionalData does not include all the required data
     */
    QUnit.test("Push notification scenario in Fiori Client mode - background use-case with partial additionalData", function (assert) {
        var oOrigToExternalNavigation = utils.toExternalWithParameters,
            oUnseenCount = {
                "data": {
                    "GetBadgeNumber": {
                        "Number": 1
                    }
                }
            };

        setStandardConfig();

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sinon.stub(OData, "request", function (request, success, fail) {
            success(oNotificationsResult);
        });

        utils.toExternalWithParameters = sinon.spy();

        testAsync(assert, function (oService) {
            oService._getHeaderXcsrfToken = sinon.stub().returns(true);
            oService._getDataServiceVersion = sinon.stub().returns(true);
            oService._readNotificationsData = sinon.spy();
            oService.markRead = sinon.spy();
            oService._handlePushedNotification({
                NotificationId: "123",
                additionalData: {
                    NavigationTargetParam: [
                        {
                            Key: "key1",
                            Value: "value1"
                        }, {
                            Key: "key2",
                            Value: "value2"
                        }
                    ],
                    foreground: false
                },
                NavigationTargetObject: "object1",
                NavigationTargetAction: "action1"
            });

            assert.ok(oService._readNotificationsData.calledOnce === true, "Function _readNotificationsData was called by _handlePushedNotification");
            assert.ok(oService.markRead.calledOnce === true, "Function MarkRead was called by _handlePushedNotification");
            assert.ok(oService.markRead.args[0][0] === "123", "Function MarkRead was called with the correct notification ID");
            assert.ok(utils.toExternalWithParameters.calledOnce === true, "Function utils.toExternalWithParameters was called once by _handlePushedNotification");
            assert.ok(utils.toExternalWithParameters.args[0][0] === "object1", "Function utils.toExternalWithParameters was called with the correct senamtic object");
            assert.ok(utils.toExternalWithParameters.args[0][1] === "action1", "Function utils.toExternalWithParameters was called with the correct action");
            assert.ok(utils.toExternalWithParameters.args[0][2] instanceof Array === true, "Function utils.toExternalWithParameters was called with an array of parameters");
            assert.ok(utils.toExternalWithParameters.args[0][2].length === 2, "Function utils.toExternalWithParameters was called with an array of 2 parameters");
            assert.ok(utils.toExternalWithParameters.args[0][2][1].Key === "key2", "Function utils.toExternalWithParameters was called with the correct 2nd parameter key");
            assert.ok(utils.toExternalWithParameters.args[0][2][1].Value === "value2", "Function utils.toExternalWithParameters was called with the correct 2nd parameter value");

            OData.read.restore();
            OData.request.restore();
            utils.toExternalWithParameters = oOrigToExternalNavigation;
        });
    });

    /**
     *
     */
    QUnit.test("Fiori client: sequential read actions when not in FioriClient Mode", function (assert) {
        var oFioriClientRemainingDelayStub,
            oGetModeStub,
            oUnseenCount = {
                "data":
                    {
                        "GetBadgeNumber":
                            {
                                "Number": 2
                            }
                    }
            };

        setStandardConfig();

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sinon.stub(OData, "request", function (request, success, fail) {
            success(oNotificationsResult);
        });

        testAsync(assert, function (oService) {
            oService._updateCSRF = sinon.spy();

            oService.registerNotificationsUpdateCallback(function () {
                oService = sap.ushell.Container.getService("Notifications");
                oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
                oGetModeStub = sinon.stub(oService, "_getMode").returns(oModesEnum.POLLING);
                oService._getHeaderXcsrfToken = sinon.stub().returns(true);
                oService._getDataServiceVersion = sinon.stub().returns(true);
            });

            oService._isFioriClientMode = sinon.stub().returns(false);

            // As a result of the following call, the following happens:
            //  1. A call to _readNotificationsData
            //  2. A call to _updateConsumers (in the success handler of the OData.read)
            //  3. The registered callback is called
            //  4. The callback calls getNotifications
            //  5. getNotifications calls _readNotificationsData, which calls OData.read =>
            //  This test verifies that the 3rd call to OData.read WILL NOT be issued
            oService._handlePushedNotification({additionalData: {}});
            assert.ok(OData.request.calledTwice, "third call to OData.read was prevented");
            oFioriClientRemainingDelayStub.restore();
            oGetModeStub.restore();
            OData.read.restore();
            OData.request.restore();
        });
    });

    QUnit.test("Verify mark as read", function (assert) {
        sinon.stub(OData, "request");

        testAsync(assert, function (oService) {
            oService.markRead("notificationId");
            assert.ok(OData.request.args[0][0].method === "POST", "OData.request was called with method POST");
            assert.ok(OData.request.args[0][0].data.NotificationId === "notificationId", "NotificationId should be 'notificationId'");
            assert.ok(OData.request.args[0][0].requestUri.endsWith("/MarkRead") === true, "markRead: OData.request was called with function /MarkRead");

            OData.request.restore();
        });
    });

    QUnit.test("Verify dismiss Notification", function (assert) {
        sinon.stub(OData, "request");

        testAsync(assert, function (oService) {
            oService.dismissNotification("notificationId");
            assert.ok(OData.request.args[0][0].method === "POST", "OData.request was called with method POST");
            assert.ok(OData.request.args[0][0].data.NotificationId === "notificationId", "NotificationId should be 'notificationId'");
            assert.ok(OData.request.args[0][0].requestUri.endsWith("/Dismiss") === true, "Dismiss: OData.request was called with function /Dismiss");

            OData.request.restore();
        });
    });

    QUnit.test("Check High Prio Messages", function (assert) {
        sinon.stub(OData, "request");

        testAsync(assert, function (oService) {
            oService.lastNotificationDate = 1;
            var fnValidateHighPrioMessages = function (sChannelId, sEventId, aNewNotifications) {
                assert.ok(aNewNotifications.length == 2, "Recived two High Priority notification");
            };
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.services.Notifications", "onNewNotifications", fnValidateHighPrioMessages, this);

            oService._notificationAlert([
                {
                    CreatedAt: 2,
                    Priority: "HIGH",
                    Text: "HEAD1",
                    IsRead: false

                },
                {
                    CreatedAt: 3,
                    Priority: "HIGH",
                    Text: "HEAD2",
                    IsRead: false

                },
                {
                    CreatedAt: 4,
                    Priority: "LOW",
                    Text: "HEAD2",
                    IsRead: false

                }

            ]);

            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.services.Notifications", "onNewNotifications", fnValidateHighPrioMessages, this);

            OData.request.restore();
        });
    });

    QUnit.test("Validate No High Prio Messages, When no messages with High priority", function (assert) {
        sinon.stub(OData, "request");

        testAsync(assert, function (oService) {
            oService.lastNotificationDate = 1;
            var fnValidateHighPrioMessages = function (sChannelId, sEventId, aNewNotifications) {
                assert.ok(false, "Should not Recived High Priority notification");
            };
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.services.Notifications", "onNewNotifications", fnValidateHighPrioMessages, this);

            oService._notificationAlert([
                {
                    CreatedAt: 2,
                    Priority: "LOW",
                    Text: "HEAD1",
                    IsRead: false

                },
                {
                    CreatedAt: 3,
                    Priority: "LOW",
                    Text: "HEAD2",
                    IsRead: false

                },
                {
                    CreatedAt: 4,
                    Priority: "LOW",
                    Text: "HEAD2",
                    IsRead: false

                }

            ]);

            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.services.Notifications", "onNewNotifications", fnValidateHighPrioMessages, this);
            assert.ok(true, "Done validating High Prio Messages");

            OData.request.restore();
        });
    });

    QUnit.test("Read UserSettings from server", function (assert) {
        var oDataRequestStub,
            oPromise;

        testAsync(assert, function (oService) {
            oDataRequestStub = sinon.stub(OData, "request", function (aArgs, fSuccess) {
                fSuccess({results: {}});
            });

            oPromise = oService.readSettings();
            oPromise.done(function () {
                assert.ok(oDataRequestStub.calledOnce === true, "OData.request called once");
                assert.ok(oDataRequestStub.args[0][0].requestUri.endsWith("/NotificationTypePersonalizationSet") === true, "OData.request called with getSettings URL");
            });

            oDataRequestStub.restore();
        });
    });

    QUnit.test("Read UserSettings from server - falure", function (assert) {
        var oDataRequestStub,
            oPromise;

        testAsync(assert, function (oService) {
            oDataRequestStub = sinon.stub(OData, "request", function (aArgs, fSuccess, fFailure) {
                fFailure({response: {statusCode: 404}});
            });

            oPromise = oService.readSettings();
            oPromise.fail(function () {
                assert.ok(oDataRequestStub.calledOnce === true, "OData.request called once");
            });

            oDataRequestStub.restore();
        });
    });

    QUnit.test("Read UserSettings flags from personalization service - empty result", function (assert) {
        var oGetUserSettingsPersonalizerStub,
            oFlagsPromise,
            oDeferred = new jQuery.Deferred(),
            oPromise = oDeferred.promise();

        testAsync(assert, function (oService) {
            oDeferred.resolve();
            oGetUserSettingsPersonalizerStub = sinon.stub(oService, "_getUserSettingsPersonalizer").returns({
                getPersData: function () {
                    return oPromise;
                },
                setPersData: function (oFlags) {
                    return;
                }
            });

            oService._readUserSettingsFlagsFromPersonalization();

            oFlagsPromise = oService.getUserSettingsFlags();
            oFlagsPromise.done(function (oFlags) {
                assert.ok(oFlags.highPriorityBannerEnabled === true, "highPriorityBannerEnabled flag has the default value (true) after Personalizer returnd empty object");
            });
            oGetUserSettingsPersonalizerStub.restore();
        });
    });

    QUnit.test("Read UserSettings flags from personalization service", function (assert) {
        var oGetUserSettingsPersonalizerStub,
            oFlagsPromise,
            oDeferred = new jQuery.Deferred(),
            oPromise = oDeferred.promise();

        testAsync(assert, function (oService) {
            oDeferred.resolve({
                highPriorityBannerEnabled: false
            });
            oGetUserSettingsPersonalizerStub = sinon.stub(oService, "_getUserSettingsPersonalizer").returns({
                getPersData: function () {
                    return oPromise;
                }
            });

            oService._readUserSettingsFlagsFromPersonalization();
            oFlagsPromise = oService.getUserSettingsFlags();

            oFlagsPromise.done(function (oFlags) {
                assert.ok(oFlags.highPriorityBannerEnabled === false, "highPriorityBannerEnabled flag has the correct value (false) returned from Personalization service");
            });

            oGetUserSettingsPersonalizerStub.restore();
        });
    });

    QUnit.test("UserSettings Initialization with Mobile support - successfull request with negative result", function (assert) {
        testAsync(assert, function (oService) {
            sinon.stub(oService, "_readSettingsFromServer").returns(jQuery.Deferred().resolve());
            sinon.stub(oService, "_readEmailSettingsFromServer").returns(jQuery.Deferred().resolve("{\"IsActive\": true, \"successStatus\": true}"));
            sinon.stub(oService, "_readMobileSettingsFromServer").returns(jQuery.Deferred().resolve("{\"IsActive\": false, \"successStatus\": true}"));

            oService._userSettingInitialization();

            var oSettingsAvailabilityPromise = oService._getNotificationSettingsAvalability();
            oSettingsAvailabilityPromise.done(function (oResult) {
                assert.ok(oService._getNotificationSettingsMobileSupport() === false, "_getNotificationSettingsMobileSupport returns false");
                assert.ok(oResult.settingsAvailable === true, "oResult.settingsAvailable is true");
                assert.ok(oResult.mobileAvailable === false, "oResult.mobileAvailable is false");
                assert.ok(oResult.emailAvailable === true, "oResult.emailAvailable is true");
            });
        });
    });

    QUnit.test("UserSettings Initialization with Mobile support - successfull request with positive result", function (assert) {
        testAsync(assert, function (oService) {
            sinon.stub(oService, "_readSettingsFromServer").returns(jQuery.Deferred().resolve());
            sinon.stub(oService, "_readEmailSettingsFromServer").returns(jQuery.Deferred().resolve("{\"successStatus\": false}"));
            sinon.stub(oService, "_readMobileSettingsFromServer").returns(jQuery.Deferred().resolve("{\"IsActive\": true, \"successStatus\": true}"));

            oService._userSettingInitialization();

            var oSettingsAvailabilityPromise = oService._getNotificationSettingsAvalability();
            oSettingsAvailabilityPromise.done(function (oResult) {
                assert.ok(oService._getNotificationSettingsMobileSupport() === true, "_getNotificationSettingsMobileSupport returns true");
                assert.ok(oResult.settingsAvailable === true, "oResult.settingsAvailable is true");
                assert.ok(oResult.mobileAvailable === true, "oResult.mobileAvailable is true");
                assert.ok(oResult.emailAvailable === false, "oResult.emailAvailable is false");
            });
        });
    });

    QUnit.test("UserSettings Initialization with Mobile support - unsuccessfull request", function (assert) {
        testAsync(assert, function (oService) {
            /* eslint new-cap:0 */
            sinon.stub(oService, "_readSettingsFromServer").returns(jQuery.Deferred().resolve());
            sinon.stub(oService, "_readEmailSettingsFromServer").returns(jQuery.Deferred().resolve("{\"IsActive\": false, \"successStatus\": true}"));
            sinon.stub(oService, "_readMobileSettingsFromServer").returns(jQuery.Deferred().resolve("{\"successStatus\": false}"));

            oService._userSettingInitialization();

            oService._getNotificationSettingsAvalability().done(function (oResult) {
                assert.ok(oService._getNotificationSettingsMobileSupport() === false, "_getNotificationSettingsMobileSupport returns true");
                assert.ok(oResult.settingsAvailable === true, "oResult.settingsAvailable is true");
                assert.ok(oResult.mobileAvailable === false, "oResult.mobileAvailable is false");
                assert.ok(oResult.emailAvailable === false, "oResult.emailAvailable is false");
            });
        });
    });

    QUnit.test("UserSettings Initialization no Mobile support", function (assert) {
        testAsync(assert, function (oService) {
            /* eslint new-cap:0 */
            sinon.stub(oService, "_readSettingsFromServer").returns(jQuery.Deferred().resolve());
            sinon.stub(oService, "_readEmailSettingsFromServer").returns(jQuery.Deferred().resolve("{\"IsActive\": false, \"successStatus\": true}"));
            sinon.stub(oService, "_readMobileSettingsFromServer").returns(jQuery.Deferred().resolve("{\"IsActive\": false}"));

            oService._userSettingInitialization();

            oService._getNotificationSettingsAvalability().done(function (oResult) {
                assert.ok(oService._getNotificationSettingsMobileSupport() === false, "_getNotificationSettingsMobileSupport returns false");
                assert.ok(oResult.settingsAvailable === true, "oResult.settingsAvailable is true");
                assert.ok(oResult.mobileAvailable === false, "oResult.mobileAvailable is false");
            });
        });
    });

    QUnit.test("_resumeConnection re-creates the connection", function (assert) {
        testAsync(assert, function (oService) {
            /* eslint new-cap:0 */
            sinon.stub(oService, "_webSocketStep");

            oService._closeConnection();
            oService._resumeConnection();

            assert.ok(oService._webSocketStep.calledOnce, "_webSocketStep was called when connection is resumed");
        });
    });

    QUnit.test("The event 'launchpad'/'setConnectionToServer' gets subscribed in the init method", function (assert) {
        testAsync(assert, function (oService) {
            // Arrange
            var oEventBusSubscribeSpy = sinon.spy(sap.ui.getCore().getEventBus(), "subscribe");

            // Act
            oService.init();

            // Assert
            assert.ok(oEventBusSubscribeSpy.withArgs("launchpad", "setConnectionToServer").calledOnce,
                "The event was subscribed correctly."
            );

            // Clean up
            oEventBusSubscribeSpy.restore();
        });
    });

    QUnit.test("_closeConnection gets triggered via event 'launchpad'/'setConnectionToServer' for { 'active': false }", function (assert) {
        var done = assert.async();
        testAsync(assert, function (oService) { // Using asynchronous service retrieval as in all tests above
            // Arrange
            var resumeConnectionStub = sinon.stub(oService, "_resumeConnection");
            var closeConnectionStub = sinon.stub(oService, "_closeConnection", function () {
                // Assert
                assert.ok(true, "_closeConnection was triggered.");
                assert.ok(resumeConnectionStub.notCalled, "_resumeConnectionStub was not called.");

                // Clean up
                closeConnectionStub.restore();
                resumeConnectionStub.restore();
                done();
            });
            oService.init();

            // Act - Use real eventing here
            sap.ui.getCore().getEventBus().publish("launchpad", "setConnectionToServer", { "active": false });
        });
    });

    QUnit.test("_resumeConnection gets triggered via event 'launchpad'/'setConnectionToServer' for { 'active': true }", function (assert) {
        testAsync(assert, function (oService) {
            // Arrange
            var done = assert.async();
            var closeConnectionStub = sinon.stub(oService, "_closeConnection");
            var resumeConnectionStub = sinon.stub(oService, "_resumeConnection", function () {
                // Assert
                assert.ok(true, "_resumeConnection was triggered.");
                assert.ok(closeConnectionStub.notCalled, "_closeConnectionStub was not called.");

                // Clean up
                closeConnectionStub.restore();
                resumeConnectionStub.restore();
                done();
            });
            oService.init();

            // Act
            sap.ui.getCore().getEventBus().publish("launchpad", "setConnectionToServer", { "active": true });
        });
    });

    QUnit.test("The event subscription for 'launchpad'/'setConnectionToServer' gets deleted in the destroy method", function (assert) {
        testAsync(assert, function (oService) {
            // Arrange
            var oEventBusUnsubscribeSpy = sinon.spy(sap.ui.getCore().getEventBus(), "unsubscribe");
            oService.init();

            // Act
            oService.destroy();

            // Assert
            assert.ok(oEventBusUnsubscribeSpy.withArgs("launchpad", "setConnectionToServer").calledOnce,
                "The event was unsubscribed correctly."
            );

            // Clean up
            oEventBusUnsubscribeSpy.restore();
        });
    });

});
