// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.applications.PageComposer.util.PagePersistence
 */
/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/applications/PageComposer/util/Transport",
    "sap/ushell/services/Container"
], function (Transport) {
    "use strict";

    QUnit.start();
    QUnit.module("The changeHandler method", {
        beforeEach: function () {
            this.oSetPropertySpy = sinon.spy();

            this.oDialogStub = {
                getModel: function () {
                    return {
                        setProperty: this.oSetPropertySpy,
                        getProperty: sinon.stub().returns({
                            value1: "test1",
                            value2: "test2"
                        })
                    };
                }.bind(this)
            };

            this.oDataModelStub = sinon.stub().returns({
                read: sinon.stub()
            });

            sap.ushell.Container = {
                getUser: function () {
                    return {
                        getLanguage: function () {
                        }
                    };
                }
            };

            this.transportHelper = new Transport();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("adds the validation property to the model with value true", function (assert) {
        var fnChangeHandler = this.transportHelper._changeHandler(this.oDialogStub);
        fnChangeHandler(true);
        assert.ok(this.oSetPropertySpy.calledWith("/validation", {
            value1: "test1",
            value2: "test2",
            transport: true
        }), "The validation property was added to the model");
    });

    QUnit.test("adds the validation property to the model with value false", function (assert) {
        var fnChangeHandler = this.transportHelper._changeHandler(this.oDialogStub);
        fnChangeHandler(false);
        assert.ok(this.oSetPropertySpy.calledWith("/validation", {
            value1: "test1",
            value2: "test2",
            transport: false
        }), "The validation property was added to the model");
    });


    QUnit.module("The enhanceDialogWithTransport method", {
        beforeEach: function () {
            this.oDataModelStub = sinon.stub().returns({
                read: sinon.stub()
            });
            this.transportHelper = new Transport(true, this.oDataModelStub);
            this.oTransportExtensionPointStub = sinon.stub();
            this.oAttachConfirmStub = sinon.stub();
            this.oAttachChangeHandlerStub = sinon.stub();

            this.oTransportComponent = {
                decorateResultWithTransportInformation: sinon.stub(),
                attachChangeEventHandler: this.oAttachChangeHandlerStub
            };

            this.onConfirm = sinon.stub();

            this.oDialogStub = {
                attachConfirm: this.oAttachConfirmStub,
                transportExtensionPoint: this.oTransportExtensionPointStub
            };

            sinon.stub(this.transportHelper, "_changeHandler").returns(sinon.stub());
        },
        afterEach: function () {
            this.transportHelper._changeHandler.restore();
            delete this.transportHelper;
        }
    });

    QUnit.test("attaches the change handler", function (assert) {
        this.transportHelper.enhanceDialogWithTransport(
            this.oDialogStub,
            this.oTransportComponent,
            this.onConfirm
        );

        assert.ok(this.oAttachChangeHandlerStub.calledOnce, "The attachChangeEventHandler was called");
    });

    QUnit.test("attaches the confirm handler", function (assert) {
        this.transportHelper.enhanceDialogWithTransport(
            this.oDialogStub,
            this.oTransportComponent,
            this.onConfirm
        );

        assert.ok(this.oAttachConfirmStub.calledOnce, "The attachConfirm function was called");
    });

    QUnit.test("sets the transportComponent to the extension point", function (assert) {
        this.transportHelper.enhanceDialogWithTransport(
            this.oDialogStub,
            this.oTransportComponent,
            this.onConfirm
        );

        assert.ok(
            this.oTransportExtensionPointStub.calledWith(this.oTransportComponent),
            "The attachConfirm function was called"
        );
    });
});