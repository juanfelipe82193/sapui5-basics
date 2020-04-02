// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services._PluginManager.HeaderExtensions
 */
sap.ui.require([
    "sap/ushell/services/_PluginManager/HeaderExtensions",
    "sap/ushell/EventHub"
], function (HeaderExtensions, EventHub) {
    "use strict";

    /* global QUnit sinon */

    QUnit.module("sap.ushell.services._PluginManager.HeaderExtensions", {

    });

    QUnit.test("HeaderExtensions: setHeaderCentralAreaElement", function (assert) {
        var oEmitStub = sinon.stub(EventHub, "emit"),
            oPayload = {
                id: "testId",
                currentState: false,
                states: undefined
            };

        HeaderExtensions.setHeaderCentralAreaElement(oPayload.id, oPayload.currentState);

        assert.ok(oEmitStub.calledOnce, "The EventHub event was emitted");
        assert.strictEqual(oEmitStub.firstCall.args[0], "setHeaderCentralAreaElement", "The event name is setHeaderCentralAreaElement");
        assert.deepEqual(oEmitStub.firstCall.args[1], oPayload, "The payload of the event is correct");

        oEmitStub.restore();
    });
});
