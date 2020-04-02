// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for _AppState's WindowAdapter
 */
sap.ui.require([
    "sap/ushell/services/_AppState/WindowAdapter"
], function (WindowAdapter) {
    "use strict";

    /* global QUnit sinon */

    QUnit.module("WindowAdapter", {
        beforeEach: function () {
            WindowAdapter.prototype.data = {
                addAsHead: sinon.spy()
            };
        }
    });

    QUnit.test("WindowAdapter: buffer does not fill when no promise in config", function (assert) {
        var oAdapter = new WindowAdapter();
        assert.ok(oAdapter.data.addAsHead.notCalled, "buffer does not fill when no promise in config");
    });

    QUnit.test("WindowAdapter: state from promise is added to buffer", function (assert) {
        var fnDone = assert.async(),
        oAppStatePromise = Promise.resolve({
            "ABC": JSON.stringify({"abc": 1}),
            "DEF": JSON.stringify({"def": 1})
        }),
        oAdapterConfig = {
            config: {
                initialAppStatesPromise: oAppStatePromise
            }
        };
        var oAdapter = new WindowAdapter(null, null, oAdapterConfig);
        setTimeout(function () {
            assert.ok(oAdapter.data.addAsHead.calledTwice, "addAsHead called for all states");
            assert.deepEqual(oAdapter.data.addAsHead.getCall(0).args, ["ABC", JSON.stringify({"abc": 1})], "The correct state was added");
            assert.deepEqual(oAdapter.data.addAsHead.getCall(1).args, ["DEF", JSON.stringify({"def": 1})], "The correct state was added");
            fnDone();
        }, 10);
    });

    QUnit.test("WindowAdapter: state from config is added to buffer", function (assert) {
        var oState = {
            "ABC": JSON.stringify({"abc": 1})
        },
        oAdapterConfig = {
            config: {
                initialAppStates: oState
            }
        };
        var oAdapter = new WindowAdapter(null, null, oAdapterConfig);
        assert.ok(oAdapter.data.addAsHead.calledOnce, "addAsHead called for all states");
        assert.deepEqual(oAdapter.data.addAsHead.getCall(0).args, ["ABC", JSON.stringify({"abc": 1})], "The correct state was added");
    });


});
