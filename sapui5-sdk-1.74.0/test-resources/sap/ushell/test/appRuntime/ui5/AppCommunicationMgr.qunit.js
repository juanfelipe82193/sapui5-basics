// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.Shell
 */
sap.ui.require([
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ushell/appRuntime/ui5/AppRuntimePostMessageAPI"
], function (AppCommunicationMgr, AppRuntimePostMessageAPI) {
    "use strict";

    /*global module, jQuery, start, sap, asyncTest, window, sinon */

    module("sap.ushell.appRuntime.ui5.AppCommunicationMgr", {
        teardown: function() {
            AppCommunicationMgr.destroy();
        }
    });

    asyncTest("test postMessage", function (assert) {
        var that = this,
            msg = {a: 1};

        function handleMessageEvent(oContainer, oMessage) {
            var oMessageData = JSON.parse(oMessage.data);
            assert.ok(oMessageData.a === 1, "ApplicationContainer.postMessage - Message successfully passed");
            start();
            removeEventListener("message", fnHandleMessageEvent);
        }

        var fnHandleMessageEvent = handleMessageEvent.bind(null, that);
        addEventListener("message", fnHandleMessageEvent);

        AppCommunicationMgr.postMessage(msg);
    });

    [
        {
            input: {
                oMsg: {
                    "service": "test.add",
                    "body": {"x": 1, "y": 2},
                    "request_id": "1111"
                }
            },
            output: {
                fnCalc: function (oMessageData) {
                    return oMessageData.body.x + oMessageData.body.y;
                },
                result: "3"
            }
        },
        {
            input: {
                oMsg: {
                    "service": "test.noInput",
                    "body": {},
                    "request_id": "2222"
                }
            },
            output: {
                fnCalc: function (oMessageData) {
                    if (jQuery.isEmptyObject(oMessageData.body)) {
                        return "ok";
                    }
                    return "NOT ok";
                },
                result: "ok"
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("test sendMessageToOuterShell", function (assert) {
            var that = this;

            function handleMessageEvent(oContainer, oMessage) {
                var oMessageData = JSON.parse(oMessage.data);
                var result = "";
                result = oFixture.output.fnCalc(oMessageData);
                removeEventListener("message", fnHandleMessageEvent);
                window.postMessage('{"type":"response","service": "' +
                    oFixture.input.oMsg.service + '","request_id": "' +
                    oFixture.input.oMsg.request_id+'","status":"success","body": {"result":{"result":"' + result + '"}}}', "*");
            }

            var fnHandleMessageEvent = handleMessageEvent.bind(null, that);
            addEventListener("message", fnHandleMessageEvent);
            AppCommunicationMgr.init();

            AppCommunicationMgr.sendMessageToOuterShell(
                oFixture.input.oMsg.service,
                oFixture.input.oMsg.body,
                oFixture.input.oMsg.request_id)
                .done(function (oResult) {
                    assert.ok(oResult.result === oFixture.output.result,
                        "ApplicationContainer.postMessage - Result successfully passed to IFrame");
                    start();
                });
        });
    });

    asyncTest("test _handleMessageEvent", function (assert) {
        var that = this;
        AppRuntimePostMessageAPI.registerCommunicationHandler(
            "sap.ushell.services.appLifeCycle",
            {
                oInboundActions: {
                    "subscribe": {
                        executeServiceCallFn: function (oServiceParams) {
                            return new jQuery.Deferred().resolve({
                                action: "subscribe"
                            }).promise();
                        }
                    }
                }
            },
            "qunit.test",
            {
                oInboundActions: {
                    "add": {
                        executeServiceCallFn: function (oServiceParams) {
                            var x = oServiceParams.oMessageData.body.x;
                            var y = oServiceParams.oMessageData.body.y;
                            return new jQuery.Deferred().resolve(x+y).promise();
                        }
                    }
                }
            }
        );

        function handleMessageEvent(oContainer, oMessage) {
            var oMessageData = JSON.parse(oMessage.data);
            if (oMessageData && oMessageData.type && oMessageData.type === "request") {
                return;
            }
            if (oMessageData && oMessageData.type && oMessageData.type === "response") {
                if (oMessageData.service === "sap.ushell.services.appLifeCycle.subscribe") {
                    assert.ok(oMessageData.body.result.action === "subscribe", "ApplicationContainer.handleMessageEvent - Result successfully passed to IFrame");
                } else {
                    assert.ok(oMessageData.body.result === 5, "ApplicationContainer.handleMessageEvent - Result successfully passed to IFrame");
                }
                start();
                removeEventListener("message", fnHandleMessageEvent);
            }
        }

        AppCommunicationMgr.init();
        var fnHandleMessageEvent = handleMessageEvent.bind(null, that);
        addEventListener("message", fnHandleMessageEvent);

        window.postMessage('{"type":"request","request_id":"1234","service":"qunit.test.add","body":{"x":2, "y":3}}', "*");
    });

    [
        {
            input: {
                oMessage: {
                    "source": window,
                    "data": '{"type":"request","request_id":"1111","service":"qunit.test.add","body":{"x": 1, "y": 2}}',
                    "origin": "*"
                },
                oMessageData: {
                    "service": "qunit.test.add",
                    "body": {"x": 1, "y": 2},
                    "request_id": "1111",
                    "type": "request"
                }
            },
            output: {
                result: 3,
                status: "success"
            }
        },
        {
            input: {
                oMessage: {
                    "source": window,
                    "data": '{"type":"request","request_id":"1111","service":"wrong.service","body":{"x": 1, "y": 2}}',
                    "origin": "*"
                },
                oMessageData: {
                    "service": "wrong.service", //wrong service was sent
                    "body": {"x": 1, "y": 2},
                    "request_id": "1111",
                    "type": "request"
                }
            },
            output: {
                result: "Unknown service name: 'wrong.service'",
                status: "error"
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("test _handleMessageRequest", function (assert) {
            var that = this;
            AppRuntimePostMessageAPI.registerCommunicationHandler(
                "qunit.test",
                {
                    oInboundActions: {
                        "add": {
                            executeServiceCallFn: function (oServiceParams) {
                                var x = oServiceParams.oMessageData.body.x;
                                var y = oServiceParams.oMessageData.body.y;
                                return new jQuery.Deferred().resolve(x+y).promise();
                            }
                        }
                    }
                }
            );

            function handleMessageEvent(oContainer, oMessage) {
                var oMessageData = JSON.parse(oMessage.data);
                if (oMessageData && oMessageData.type && oMessageData.type === "request") {
                    return;
                }
                if (oMessageData && oMessageData.type && oMessageData.type === "response") {
                    assert.ok(oFixture.output.status === oMessageData.status, "ApplicationContainer._handleMessageRequest - The request status received as expected");
                    if (oMessageData.status === "success") {
                        assert.ok(oFixture.output.result === oMessageData.body.result, "ApplicationContainer._handleMessageRequest - Result successfully passed to IFrame");
                    } else if (oMessageData.status === "error") {
                        assert.ok(oFixture.output.result === oMessageData.body.message, "ApplicationContainer._handleMessageRequest - Error message successfully passed to IFrame");
                    }

                    start();
                    removeEventListener("message", fnHandleMessageEvent);
                }
            }

            AppCommunicationMgr.init();
            var fnHandleMessageEvent = handleMessageEvent.bind(null, that);
            addEventListener("message", fnHandleMessageEvent);

            var _isTrustedPostMessageSourceSinon = sinon.stub(AppCommunicationMgr, "_isTrustedPostMessageSource",
                function (oContainer, oMessage) {
                    return true;
            });

            AppCommunicationMgr._handleMessageRequest(AppCommunicationMgr, oFixture.input.oMessage, oFixture.input.oMessageData);
            _isTrustedPostMessageSourceSinon.restore();
        });
    });

});

