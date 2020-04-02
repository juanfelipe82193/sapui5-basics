// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for ClientSideTargetResolution's InboundProvider
 */
sap.ui.require([
    "sap/ushell/services/_ClientSideTargetResolution/InboundProvider",
    "sap/ushell/services/_ClientSideTargetResolution/InboundIndex",
    "sap/ushell/services/_ClientSideTargetResolution/VirtualInbounds",
    "sap/ushell/test/utils",
    "sap/ushell/utils"
], function (InboundProvider, oInboundIndex, oVirtualInbounds, testUtils, utils) {
    "use strict";

    /* global QUnit sinon Promise */

    var Q = QUnit;

    Q.module("InboundProvider", {
        setup: function () {
            // stub all dependencies
            sinon.stub(oInboundIndex, "createIndex");
            sinon.stub(oVirtualInbounds, "getInbounds");
        },
        teardown: function () {
            testUtils.restoreSpies(
                InboundProvider.prototype._init,
                oInboundIndex.createIndex,
                oVirtualInbounds.getInbounds
            );
        }
    });

    Q.test("InboundProvider: calls _init during construction", 1, function (assert) {
        sinon.stub(InboundProvider.prototype, "_init");

        /* eslint-disable no-new */
        new InboundProvider();
        /* eslint-enable */

        assert.strictEqual(InboundProvider.prototype._init.callCount,
            1, "InboundProvider#_init was called once");
    });


    Q.test("getInbounds: calls the inbound retrieval function when called", function (assert) {
        var fnAssertAsync = assert.async(),
            oProvider,
            fnRetrieveInbound;

        fnRetrieveInbound = sinon.stub().returns(
            new jQuery.Deferred().resolve([])
        );

        oProvider = new InboundProvider(fnRetrieveInbound);

        oProvider.getInbounds().then(function () {
            assert.ok(true, "promise was resolved");

            assert.strictEqual(fnRetrieveInbound.callCount, 1,
                "Inbound retrieval function was called once");
        }, function (oErr) {
            assert.ok(false, "promise was resolved. ERROR: " + oErr);
        }).then(fnAssertAsync);

    });

    Q.test("getInbounds: calls the the inbound retrieval function with the segment when the call is made with the segment argument", function (assert) {
        var fnAssertAsync = assert.async(),
            oProvider,
            fnRetrieveInbound;

        fnRetrieveInbound = sinon.stub().returns(
            new jQuery.Deferred().resolve([])
        );

        oProvider = new InboundProvider(fnRetrieveInbound);

        oProvider.getInbounds("TheSegment")
            .then(function () {
                assert.ok(true, "promise was resolved");

                assert.strictEqual(fnRetrieveInbound.callCount, 1,
                    "Inbound retrieval function was called once");

                assert.deepEqual(fnRetrieveInbound.getCall(0).args, [ "TheSegment" ], "Call was made with the expected arguments");

            })
            .catch(function (oErr) {
                assert.ok(false, "promise was resolved");
            })
            .then(fnAssertAsync);
    });

    Q.test("getInbounds: does not call the inbound retrieval function again when called twice", function (assert) {
        var fnAssertAsync = assert.async(),
            oProvider,
            fnRetrieveInbound;

        fnRetrieveInbound = sinon.stub().returns(
            new jQuery.Deferred().resolve([])
        );

        oProvider = new InboundProvider(fnRetrieveInbound);

        Promise.all([oProvider.getInbounds(), oProvider.getInbounds()])
            .then(function () {
                assert.ok(true, "both promises were resolved");

                assert.strictEqual(fnRetrieveInbound.callCount, 1,
                    "Inbound retrieval function was called once");

            })
            .catch(function (oErr) {
                assert.ok(false, "both promises were resolved. ERROR: " + oErr);
            })
            .then(fnAssertAsync);
    });

    Q.test("getInbounds: calls the inbound retrieval function twice when call is made with segment argument", function (assert) {
        var fnAssertAsync = assert.async(),
            oProvider,
            fnRetrieveInbound;

        fnRetrieveInbound = sinon.stub().returns(
            new jQuery.Deferred().resolve([])
        );

        oProvider = new InboundProvider(fnRetrieveInbound);

        Promise.all([oProvider.getInbounds("segment1"), oProvider.getInbounds("segment2")])
            .then(function () {
                assert.ok(true, "both promises were resolved");

                assert.strictEqual(fnRetrieveInbound.callCount, 2,
                    "Inbound retrieval function was called twice");
            })
            .catch(function (oErr) {
                assert.ok(false, "both promises were resolved. ERROR: " + oErr);
            })
            .then(fnAssertAsync);
    });

    Q.test("getInbounds: returns an index of the inbounds when called without segment argument", function (assert) {
        var fnAssertAsync = assert.async(),
            oProvider,
            oFakeIndex,
            fnRetrieveInbound;

        fnRetrieveInbound = sinon.stub().returns(
            new jQuery.Deferred().resolve(["inbound1", "inbound2"])
        );

        oFakeIndex = {
            inbound1: true,
            inbound2: true
        };

        oInboundIndex.createIndex.returns(oFakeIndex);

        oProvider = new InboundProvider(fnRetrieveInbound);

        oProvider.getInbounds()
            .then(function (oInboundIndex) {
                assert.ok(true, "promise was resolved");

                assert.deepEqual(oInboundIndex, oFakeIndex,
                    "Indexed inbounds were returned");
            })
            .catch(function (oErr) {
                assert.ok(false, "promise was resolved");
            })
            .then(fnAssertAsync);
    });

    Q.test("getInbounds: returns an index of the inbounds when called with segment argument", function (assert) {
        var fnAssertAsync = assert.async(),
            oProvider,
            oFakeIndex,
            fnRetrieveInbound;

        fnRetrieveInbound = sinon.stub().returns(
            new jQuery.Deferred().resolve(["inbound1", "inbound2"])
        );

        oFakeIndex = {
            inbound1: true,
            inbound2: true
        };

        oInboundIndex.createIndex.returns(oFakeIndex);

        oProvider = new InboundProvider(fnRetrieveInbound);

        oProvider.getInbounds("TheSegment")
            .then(function (oInboundIndex) {
                assert.ok(true, "promise was resolved");

                assert.deepEqual(oInboundIndex, oFakeIndex,
                    "Indexed inbounds were returned");
            })
            .catch(function (oErr) {
                assert.ok(false, "promise was resolved");
            })
            .then(fnAssertAsync);
    });

    Q.test("getInbounds: concatenates virtual inbounds to the response", function (assert) {
        var fnAssertAsync = assert.async(),
            oProvider,
            fnRetrieveInbound,
            aFakeInbounds,
            aFakeVirtualInbounds;

        // Assuming the index is created after the inbound set to return is determined,
        // this can be tested by checking that the we are going to test this by checking that the index is created on the
        aFakeVirtualInbounds = ["fake1", "fake2", "fake3"];
        aFakeInbounds = ["inbound1", "inbound2"];

        fnRetrieveInbound = sinon.stub().returns(
            new jQuery.Deferred().resolve(aFakeInbounds)
        );

        oVirtualInbounds.getInbounds.returns(aFakeVirtualInbounds);

        oProvider = new InboundProvider(fnRetrieveInbound);

        oProvider.getInbounds()
            .then(function () {
                assert.ok(true, "promise was resolved");

                assert.deepEqual(oInboundIndex.createIndex.getCall(0).args, [
                    aFakeInbounds.concat(aFakeVirtualInbounds)
                ], "create index was called on the base + virtual inbound set");
            })
            .catch(function (oErr) {
                assert.ok(false, "promise was resolved");
            })
            .then(fnAssertAsync);
    });

});
