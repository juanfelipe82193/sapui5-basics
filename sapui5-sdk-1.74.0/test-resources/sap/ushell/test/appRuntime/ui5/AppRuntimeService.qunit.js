// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.AppRuntimeService
 */
sap.ui.require([
    "jquery.sap.global",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr"
], function (jQuery, AppRuntimeService, AppCommunicationMgr) {
    "use strict";

    /*global module, asyncTest, start, sap, sinon */

    module("sap.ushell.appRuntime.ui5.AppRuntimeService", {
        teardown: function () {
        }
    });

    [
        {
            input: {
                sMessageId: "sap.ushell.services.dummy1",
                oParams: {},
                sRequestId: "1111"
            },
            output: {
                response: {
                    data: '{"type":"response","service":"sap.ushell.services.dummy1","request_id":"1111","status":"success","body":{"result": {"a": 1}}}',
                    origin: "test"
                },
                type: "success"
            }
        },
        {
            input: {
                sMessageId: "sap.ushell.services.dummy2",
                oParams: {},
                sRequestId: "2222"
            },
            output: {
                response: {
                    data: '{"type":"response","service":"sap.ushell.services.dummy1","request_id":"2222","status":"fail","body":{"a": "0"}}',
                    origin: "test"
                },
                type: "fail"
            }

        }
    ].forEach(function (oFixture) {
        asyncTest('TestSendMessageToOuterShell', function(assert) {
            var getTargetWindowSinon = sinon.stub(AppCommunicationMgr, "_getTargetWindow", function () {
                return {
                    postMessage: function() {
                        setTimeout(function () {
                            AppCommunicationMgr.__proto__._handleMessageEvent(AppCommunicationMgr, oFixture.output.response);
                        }, 200);
                    }
                };
            });

            AppRuntimeService.sendMessageToOuterShell(
                oFixture.input.sMessageId,
                oFixture.input.oParams,
                oFixture.input.sRequestId).done(function (response) {
                assert.ok(oFixture.output.type === "success", 'request should be success');
                start();
            }).fail(function () {
                assert.ok(oFixture.output.type === "fail", 'request should be fail');
                start();
            });

            getTargetWindowSinon.restore();
        });
    });
});
