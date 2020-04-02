// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.applications.PageComposer.Component
 */
/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/applications/PageComposer/Component",
    "sap/ushell/services/Container",
    "sap/ushell/applications/PageComposer/util/PagePersistence"
], function (Component, Container, PagePersistence) {
    "use strict";

    QUnit.start();
    QUnit.module("The _handleStartupParams method", {
        beforeEach: function (assert) {
            sap.ushell.Container = {
                getLogonSystem: function () {
                    return {
                        getClient: sinon.stub()
                    };
                },
                getUser: function () {
                    return {
                        getLanguage: sinon.stub()
                    };
                }
            };
            sinon.stub(Component.prototype, "getComponentData").returns({
                startupParameters: {}
            });

            this.oNavToStub = sinon.stub();
            sinon.stub(Component.prototype, "getRouter").returns({
                initialize: sinon.stub(),
                navTo: this.oNavToStub
            });

            this.oComponent = new Component();

        },
        afterEach: function () {
            this.oComponent.getRouter.restore();
            Component.prototype.getComponentData.restore();
            delete sap.ushell.Container;
            delete this.oComponent;
        }
    });

    QUnit.test("will call navTo with the correct pageId, mode and roleId", function (assert) {
        var oStartupParams = {
            pageId: ["TEST-PAGE-ID"],
            mode: ["edit"],
            roleId: ["123"]
        };

        this.oComponent._handleStartupParams(oStartupParams);

        assert.ok(this.oNavToStub.calledWith("edit", {
            pageId: "TEST-PAGE-ID"
        }));
    });

    QUnit.test("will call navTo with 'view' mode if mode is empty", function (assert) {
        var oStartupParams = {
            pageId: ["TEST-PAGE-ID"],
            mode: [""],
            roleId: ["123"]
        };

        this.oComponent._handleStartupParams(oStartupParams);

        assert.ok(this.oNavToStub.calledWith("view", {
            pageId: "TEST-PAGE-ID"
        }));
    });

    QUnit.test("will call navTo with 'view' mode if mode is invalid", function (assert) {
        var oStartupParams = {
            pageId: ["TEST-PAGE-ID"],
            mode: ["INVALID_MODE"],
            roleId: ["123"]
        };

        this.oComponent._handleStartupParams(oStartupParams);

        assert.ok(this.oNavToStub.calledWith("view", {
            pageId: "TEST-PAGE-ID"
        }));
    });

    QUnit.test("will not call navTo if pageId is empty", function (assert) {
        var oStartupParams = {
            pageId: [""],
            mode: ["edit"],
            roleId: ["123"]
        };

        this.oComponent._handleStartupParams(oStartupParams);

        assert.notOk(this.oNavToStub.called);
    });

    QUnit.test("will not call navTo with encoded pageId", function (assert) {
        var oStartupParams = {
            pageId: ["/UI2/TEST"],
            mode: ["edit"],
            roleId: ["123"]
        };

        this.oComponent._handleStartupParams(oStartupParams);

        assert.ok(this.oNavToStub.calledWith("edit", {
            pageId: "%2FUI2%2FTEST"
        }));
    });

    QUnit.test("will call navTo with joined roleIds", function (assert) {
        var oStartupParams = {
            pageId: ["TEST-PAGE-ID"],
            mode: ["edit"],
            roleId: ["123", "234", "TEST"]
        };

        this.oComponent._handleStartupParams(oStartupParams);

        assert.ok(this.oNavToStub.calledWith("edit", {
            pageId: "TEST-PAGE-ID"
        }));
    });

    QUnit.module("The getPagePersistance method", {
        beforeEach: function (assert) {
            sap.ushell.Container = {
                getLogonSystem: function () {
                    return {
                        getClient: sinon.stub()
                    };
                },
                getUser: function () {
                    return {
                        getLanguage: sinon.stub()
                    };
                }
            };

            this.oGetModelStub = sinon.stub(Component.prototype, "getModel").returns({
                setProperty: sinon.stub(),
                getProperty: sinon.stub(),
                setHeaders: sinon.stub(),
                getMetaModel: sinon.stub().returns(
                    {loaded: sinon.stub().returns(Promise.resolve({}))}),
                getResourceBundle: sinon.stub().returns({ getText: sinon.stub()})
            });

            this.oComponent = new Component();

        },
        afterEach: function () {
            this.oGetModelStub.restore();

        }
    });

    QUnit.test("Instantiates a new PagePersistence utility object with the PageRepository model", function (assert) {
        // Act
        var oInstance = this.oComponent.getPageRepository();

        // Assert
        assert.deepEqual(this.oGetModelStub.firstCall.args, ["PageRepository"], "The function getPageRepository instantiates the PagePersistence utility with the right ODataModel");
        assert.ok(oInstance instanceof PagePersistence, "The function getPageRepository returns an instance of the PagePersistence utility.");
    });

    QUnit.test("Always returns the same PageRepository utility instance", function (assert) {
        // Act
        var oInstanceOne = this.oComponent.getPageRepository();
        var oInstanceTwo = this.oComponent.getPageRepository();

        // Assert
        assert.strictEqual(oInstanceOne, oInstanceTwo, "The function getPageRepository always returns the same PageRepository instance.");
    });

});