// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for ClientSideTargetResolution's VirtualInbound
 */
sap.ui.require([
    "sap/ushell/services/_ClientSideTargetResolution/VirtualInbounds"
], function (VirtualInbounds) {
    "use strict";

    /* global QUnit */

    QUnit.module("VirtualInbounds", {
        setup: function () {
        },
        teardown: function () {
        }
    });

    QUnit.test("VirtualInbounds: getInbounds should return array", function (assert) {
        assert.ok(Array.isArray(VirtualInbounds.getInbounds()), "VirtualInbounds.getInbounds() should return array");
    });


});
