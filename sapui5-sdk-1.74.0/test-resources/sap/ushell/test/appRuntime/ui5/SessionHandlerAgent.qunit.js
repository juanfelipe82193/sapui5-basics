// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.SessionHandlerAgent
 */
sap.ui.require([
    "jquery.sap.global",
    "sap/ushell/appRuntime/ui5/SessionHandlerAgent",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/SessionHandler"
], function (jQuery, SessionHandlerAgent, AppCommunicationMgr, AppRuntimeService, SessionHandler) {
    "use strict";

    /* global sap, test, equal, sinon, start, assert, asyncTest*/

    [
        {
            testName: "ExtendSession",
            api: "handleExtendSessionEvent",
            input: {
                oMessage: {
                    source: {
                        postMessage: function (sResponseData, origin) {
                            return new jQuery.Deferred().resolve().promise();
                        }
                    },
                    "data": '{"type":"request","request_id":"1111","service":"sap.ushell.sessionHandler.extendSessionEvent","body":{}}',
                    "origin": "*"
                },
                oMessageData: {
                    "service": "sap.ushell.sessionHandler.extendSessionEvent",
                    "body": {},
                    "request_id": "1111",
                    "type": "request"
                }
            }
        },
        {
            testName: "Logout",
            api: "handleLogoutEvent",
            input: {
                oMessage: {
                    source: {
                        postMessage: function (sResponseData, origin) {
                            return new jQuery.Deferred().resolve().promise();
                        }
                    },
                    "data": '{"type":"request","request_id":"2222","service":"sap.ushell.sessionHandler.logout","body":{}}',
                    "origin": "*"
                },
                oMessageData: {
                    "service": "sap.ushell.sessionHandler.logout",
                    "body": {},
                    "request_id": "2222",
                    "type": "request"
                }
            }
        }
    ].forEach(function (oFixture) {
        test("Test " + oFixture.testName, function(assert) {

            var oMockContainer = {
                    AppCommunicationMgr: function () {
                    }
                };

            sap.ushell.Container = {
                logout: function () {
                    return new jQuery.Deferred().resolve().promise();
                },
                sessionKeepAlive: function () {
                    return new jQuery.Deferred().resolve().promise();
                }
            };

            SessionHandlerAgent.init();
            AppCommunicationMgr.init();

            var _handleMessageResponse = sinon.stub(AppCommunicationMgr, "_handleMessageResponse", function () {
                return new jQuery.Deferred().resolve(oFixture.output.response);
            });

            var _isTrustedPostMessageSourceSinon = sinon.stub(AppCommunicationMgr, "_isTrustedPostMessageSource",
                function (oContainer, oMessage) {
                    return true;
                });

            var oSpy = sinon.spy(SessionHandlerAgent, oFixture.api);

            AppCommunicationMgr._handleMessageRequest(oMockContainer, oFixture.input.oMessage, oFixture.input.oMessageData);

            equal(oSpy.calledOnce, true, oFixture.api + " invoked");

            _isTrustedPostMessageSourceSinon.restore();
            _handleMessageResponse.restore();
            oSpy.restore();

        });
    });

    asyncTest("mousedown to trigger userActivityHandler", function () {

        SessionHandlerAgent.init();
        AppCommunicationMgr.init();

        var _isTrustedPostMessageSourceSinon = sinon.stub(AppCommunicationMgr, "_isTrustedPostMessageSource",
            function (oContainer, oMessage) {
                return true;
            });

        var _handleMessageResponse = sinon.stub(AppCommunicationMgr, "_handleMessageResponse", function () {
            return new jQuery.Deferred().resolve();//oFixture.output.response);
        });


        var sendMessageToOuterShell = sinon.stub(AppRuntimeService, "sendMessageToOuterShell", function(sMessageId, oParams, sRequestId) {
            var oDeffered = new jQuery.Deferred();

            assert.ok(sMessageId === "sap.ushell.sessionHandler.notifyUserActive",
                "notifyUserActive successfully delivered to Shell");
            start();

            SessionHandlerAgent.detachUserEvents();
            _isTrustedPostMessageSourceSinon.restore();
            _handleMessageResponse.restore();
            sendMessageToOuterShell.restore();

            return oDeffered.promise();
        });

        SessionHandlerAgent.userActivityHandler();

    });

});
