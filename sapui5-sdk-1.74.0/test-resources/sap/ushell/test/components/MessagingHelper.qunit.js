// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.MessagingHelper.
 */

sap.ui.require([
    "sap/ushell/components/MessagingHelper",
    "sap/ushell/services/Message",
    "sap/ushell/services/Container"
],function (oMessagingHelper, Message) {
    "use strict";

    /*global module test jQuery sap sinon stop start */

    var oGetTextStub;

    module("sap.ushell.components.MessagingHelper", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                //jQuery.sap.getObject("sap.ushell.resources.i18n", 1);
                oGetTextStub = sinon.stub(sap.ushell.resources.i18n, "getText");

                start();
            });
        },

        teardown: function () {
            delete sap.ushell.Container;
            oGetTextStub.restore();
        }
    });

    test("i18n.getText should be called when getLocalizedText is called", function (assert) {
        var sMsg = "test_message",
            aParams = ["param1", "param2"];
        oMessagingHelper.getLocalizedText(sMsg, aParams);
        assert.ok(oGetTextStub.calledOnce, "sap.ushell.resources.i18n.getText should be called");
        assert.equal(oGetTextStub.getCall(0).args[0], sMsg, "sMsg should be the first argument");
        assert.deepEqual(oGetTextStub.getCall(0).args[1], aParams, "aParams should be the second argument");
    });

    test("showLocalizedMessage: call show with default type", function (assert) {
        var sMsg = "test_message",
            oMessageService = sap.ushell.Container.getService("Message"),
            oShowStub = sinon.stub(oMessageService, "show");

        oMessagingHelper.showLocalizedMessage(sMsg);
        assert.ok(oShowStub.calledOnce, "show method should called once");
        assert.equal(oShowStub.getCall(0).args[0], Message.Type.INFO, "Message type should be INFO");
        oShowStub.restore();
    });

    test("showLocalizedError: call show with error type", function (assert) {
        var sMsg = "test_message",
            oMessageService = sap.ushell.Container.getService("Message"),
            oShowStub = sinon.stub(oMessageService, "show");

        oMessagingHelper.showLocalizedError(sMsg);
        assert.ok(oShowStub.calledOnce, "show method should called once");
        assert.equal(oShowStub.getCall(0).args[0], Message.Type.ERROR, "Message type should be ERROR");
        oShowStub.restore();
    });


    test("showLocalizedErrorHelper should return the wrapper of showLocalizedError", function (assert) {
        var sMsg = "test_message",
            oMessageService = sap.ushell.Container.getService("Message"),
            oShowStub = sinon.stub(oMessageService, "show"),
            fnWrapper;

        fnWrapper = oMessagingHelper.showLocalizedErrorHelper(sMsg);
        assert.equal(typeof fnWrapper, "function", "showLocalizedErrorHelper should return closure");
        fnWrapper();
        assert.ok(oShowStub.calledOnce, "show method should called once");
        assert.equal(oShowStub.getCall(0).args[0], Message.Type.ERROR, "Message type should be INFO");
        oShowStub.restore();
    });



});