// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.bootstrap._SchedulingAgent.FLPLoader
 */
sap.ui.require([
    "sap/ushell/bootstrap/_SchedulingAgent/FLPLoader",
    "sap/ushell/EventHub",
    "sap/ui/core/Component"
], function (FLPLoader, EventHub, Component) {
    "use strict";

    /* global sinon, sap, window, QUnit */

    QUnit.module("FLPLoader", {
        beforeEach: function() {

        },
        afterEach: function() {
            EventHub._reset();
        }
    });

    QUnit.test("Load component by event", function (assert) {
        //Arrange
        var done = assert.async();
        assert.expect(1);

        //Act
        FLPLoader.loadComponentByEvent({eventName: "loadComponent", eventData: {}});
        EventHub.wait("loadComponent").then(function () {
            EventHub.once("loadComponent").do(function () {
                //Assert
                assert.ok(true, "The event has been emitted.");
                EventHub._reset();
                done();
            });
        });
    });

    QUnit.test("Load component by component create", function (assert) {
        //Arrange
        var oSpyComponentCreate = sinon.stub(Component, "create").returns("This should be a stub!");

        //Act
        FLPLoader.loadComponentByComponentCreate("my.component");

        //Assert
        assert.ok(oSpyComponentCreate.calledOnce, "Component.create is called once.");

        oSpyComponentCreate.restore();
    });

    QUnit.test("Set a time out and emit with StepDone", function (assert) {
        var done = assert.async();
        var oTimeOutSpy = sinon.spy(window, "setTimeout");
        var oStep = {sStepName: "Alas, dear FLP, we still need TimeOuts!", iWaitingTime: 100};
        assert.expect(3);

        FLPLoader.waitInMs(oStep);

        EventHub.once("StepDone").do(function () {
            //Assert
            assert.ok(true, "The correct event has been emitted.");
            assert.ok(oTimeOutSpy.called, "A timeout happened.");
            assert.strictEqual(oTimeOutSpy.firstCall.args[1], 100, "The Timeout has the correct duration.");
            done();
        }.bind(this));
    });

    QUnit.test("Load component by require", function (assert) {
        //Arrange
        var done = assert.async();
        var sModuleToLoad = "my/path";
        var sModuleLoaded;
        var oReturnedDependency = {};
        var fnRequireStub = function(aRequiredModules, fnHandler) {
            sModuleLoaded = aRequiredModules[0];
            fnHandler(oReturnedDependency);
        };
        var oRequireStub = sinon.stub(sap.ui, "require", fnRequireStub);

        //Act
        var oPromise = FLPLoader.loadComponentByRequire(sModuleToLoad);

        //Assert
        assert.expect(3);
        oPromise.then(function () {
            assert.ok(true, "A promise was returned.");
            assert.ok(oRequireStub.called, "sap.ui.require was called.");
            assert.strictEqual(sModuleLoaded, sModuleToLoad, "The correct module was loaded.");
            oRequireStub.restore();
            done();
        });
    });


    QUnit.test("FlpLoader.directLoading available", function (assert) {

        var bFunctionExists = typeof FLPLoader.directLoading === "function";
        assert.ok(bFunctionExists, "Method FlpLoader.directLoading exists.");
    });
});
