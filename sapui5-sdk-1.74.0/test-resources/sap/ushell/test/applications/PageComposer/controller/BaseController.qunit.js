// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.applications.PageComposer.controller.BaseController
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/applications/PageComposer/controller/BaseController",
    "sap/ushell/applications/PageComposer/util/Transport",
    "sap/ushell/applications/PageComposer/controller/CopyPageDialog.controller",
    "sap/ushell/applications/PageComposer/controller/CreatePageDialog.controller"
], function (BaseController, Transport, CopyPageDialogController, CreatePageDialogController) {
    "use strict";

    QUnit.start();
    QUnit.module("The function checkShowDeleteDialog", {
        beforeEach: function () {
            this.oTransportHelper = new Transport(true);
            this.oBaseController = new BaseController();
            this.oPage = {
                metadata: {
                    devclass: "TEST-PACKAGE"
                }
            };
            this.oIsTransportSupportedStub = sinon.stub();
            this.oShowTransportStub = sinon.stub();
            this.oShowLockedMessageStub = sinon.stub();

            this.oTransportComponent = {
                showTransport: this.oShowTransportStub,
                showLockedMessage: this.oShowLockedMessageStub
            };

            this.oGetOwnerComponentForStub = sinon.stub(this.oBaseController, "getOwnerComponent").returns({
                getRootControl: sinon.stub().returns({}),
                createTransportComponent: sinon.stub().returns(Promise.resolve(this.oTransportComponent)),
                getModel: sinon.stub(),
                isTransportSupported: this.oIsTransportSupportedStub
            });

            this.oShowMessageBoxErrorStub = sinon.stub(this.oBaseController, "showMessageBoxError");

            this.oDialog = {
                open: sinon.stub(),
                getModel: sinon.stub().returns({
                    setProperty: sinon.stub(),
                    getProperty: sinon.stub()
                })
            };

            this.oGetResourceBundleStub = sinon.stub(this.oBaseController, "getResourceBundle").returns({
                getText: sinon.stub()
            });

            this.oEnhanceDialogWithTransportStub = sinon.stub().returns({
                open: sinon.stub()
            });

            this.oGetTransportHelperStub = sinon.stub(this.oBaseController, "getTransportHelper").returns({
                enhanceDialogWithTransport: this.oEnhanceDialogWithTransportStub
            });

            this.oCreateDeleteDialogStub = sinon.stub(this.oBaseController, "_createDeleteDialog")
                .returns(Promise.resolve(this.oDialog));
        },
        afterEach: function () {
            delete this.oBaseController;
            delete this.oTransportHelper;
            this.oGetResourceBundleStub.restore();
            this.oGetTransportHelperStub.restore();
            this.oCreateDeleteDialogStub.restore();
            this.oShowMessageBoxErrorStub.restore();
            this.oGetOwnerComponentForStub.restore();
        }
    });

    QUnit.test("calls the _createDeleteDialog and enhanceDialogWithTransport method if transport is required and page is not locked", function (assert) {
        this.oIsTransportSupportedStub.returns(true);
        this.oShowLockedMessageStub.returns(false);
        this.oShowTransportStub.returns(true);

        assert.expect(2);

        var done = assert.async();
        this.oBaseController.checkShowDeleteDialog(this.oPage).then(function () {
            assert.ok(this.oCreateDeleteDialogStub.calledOnce, "The _createDeleteDialog method was called");
            assert.ok(this.oEnhanceDialogWithTransportStub.calledOnce, "The enhanceDialogWithTransport method was called");
        }.bind(this)).catch(function (oError) {
            assert.notOk(true, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });

    QUnit.test("calls the showMessageBoxError method if page is locked", function (assert) {
        this.oIsTransportSupportedStub.returns(true);
        this.oShowLockedMessageStub.returns({
            foreignOwner: "TESTOWNER"
        });
        this.oShowTransportStub.returns(true);

        assert.expect(1);

        var done = assert.async();
        this.oBaseController.checkShowDeleteDialog(this.oPage).then(function () {
            assert.ok(this.oShowMessageBoxErrorStub.calledOnce, "The showMessageBoxError method was called");
        }.bind(this)).catch(function (oError) {
            assert.notOk(true, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });

    QUnit.test("calls the _createDeleteDialog if transport is not supported", function (assert) {
        this.oIsTransportSupportedStub.returns(false);
        this.oShowLockedMessageStub.returns(false);
        this.oShowTransportStub.returns(true);

        assert.expect(1);

        var done = assert.async();
        this.oBaseController.checkShowDeleteDialog(this.oPage).then(function () {
            assert.ok(this.oCreateDeleteDialogStub.calledOnce, "The _createDeleteDialog method was called");
        }.bind(this)).catch(function (oError) {
            assert.notOk(true, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });

    QUnit.module("The function checkShowEditDialog", {
        beforeEach: function () {
            this.oTransportHelper = new Transport(true);
            this.oBaseController = new BaseController();
            this.oPage = {
                metadata: {
                    devclass: "TEST-PACKAGE"
                }
            };
            this.oIsTransportSupportedStub = sinon.stub();
            this.oShowTransportStub = sinon.stub();
            this.oShowLockedMessageStub = sinon.stub();

            this.oTransportComponent = {
                showTransport: this.oShowTransportStub,
                showLockedMessage: this.oShowLockedMessageStub
            };

            this.oGetOwnerComponentForStub = sinon.stub(this.oBaseController, "getOwnerComponent").returns({
                getRootControl: sinon.stub().returns({}),
                createTransportComponent: sinon.stub().returns(Promise.resolve(this.oTransportComponent)),
                getModel: sinon.stub(),
                isTransportSupported: this.oIsTransportSupportedStub
            });

            this.oShowMessageBoxErrorStub = sinon.stub(this.oBaseController, "showMessageBoxError");

            this.oDialog = {
                open: sinon.stub(),
                getModel: sinon.stub().returns({
                    setProperty: sinon.stub(),
                    getProperty: sinon.stub()
                })
            };

            this.oGetResourceBundleStub = sinon.stub(this.oBaseController, "getResourceBundle").returns({
                getText: sinon.stub()
            });

            this.oEnhanceDialogWithTransportStub = sinon.stub().returns({
                open: sinon.stub()
            });

            this.oGetTransportHelperStub = sinon.stub(this.oBaseController, "getTransportHelper").returns({
                enhanceDialogWithTransport: this.oEnhanceDialogWithTransportStub
            });

            this.oCreateEditDialogStub = sinon.stub(this.oBaseController, "_createEditDialog")
                .returns(Promise.resolve(this.oDialog));
        },
        afterEach: function () {
            delete this.oBaseController;
            delete this.oTransportHelper;
            this.oGetResourceBundleStub.restore();
            this.oGetTransportHelperStub.restore();
            this.oCreateEditDialogStub.restore();
            this.oShowMessageBoxErrorStub.restore();
            this.oGetOwnerComponentForStub.restore();
        }
    });

    QUnit.test("calls the enhanceDialogWithTransport and _createEditDialog methods if transport is required and page is not locked", function (assert) {
        this.oIsTransportSupportedStub.returns(true);
        this.oShowLockedMessageStub.returns(false);
        this.oShowTransportStub.returns(true);
        var done = assert.async();
        assert.expect(2);
        this.oBaseController.checkShowEditDialog(this.oPage).then(function () {
            assert.ok(this.oEnhanceDialogWithTransportStub.calledOnce, "The enhanceDialogWithTransport method was called");
            assert.ok(this.oCreateEditDialogStub.calledOnce, "The _createEditDialog method was called");
        }.bind(this)).catch(function (oError) {
            assert.notOk(true, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });

    QUnit.test("calls the showMessageBoxError method if transport is required and page is locked", function (assert) {
        this.oIsTransportSupportedStub.returns(true);
        this.oShowLockedMessageStub.returns({
            foreignOwner: "TEST-OWNER"
        });
        this.oShowTransportStub.returns(true);
        var done = assert.async();
        assert.expect(1);
        this.oBaseController.checkShowEditDialog(this.oPage).then(function () {
            assert.ok(this.oShowMessageBoxErrorStub.calledOnce, "The showMessageBoxError method was called");
        }.bind(this)).catch(function (oError) {
            assert.notOk(true, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });

    QUnit.test("calls nothing if transport is not supported", function (assert) {
        this.oIsTransportSupportedStub.returns(false);
        this.oShowLockedMessageStub.returns({
            foreignOwner: "TEST-OWNER"
        });
        this.oShowTransportStub.returns(true);
        var done = assert.async();
        assert.expect(2);
        this.oBaseController.checkShowEditDialog(this.oPage).then(function () {
            assert.notOk(this.oShowMessageBoxErrorStub.called, "The showMessageBoxError method was not called");
            assert.notOk(this.oEnhanceDialogWithTransportStub.called, "The enhanceDialogWithTransport method was not called");
        }.bind(this)).catch(function (oError) {
            assert.notOk(true, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });


    QUnit.module("The function showCopyDialog", {
        beforeEach: function () {
            this.oTransportHelper = new Transport(true);
            this.oBaseController = new BaseController();
            this.oPage = {
                content: {
                    id: "TEST-PAGE-ID",
                    title: "TEST-PAGE-TITLE"
                },
                metadata: {
                    devclass: "TEST-PACKAGE"
                }
            };
            this.oIsTransportSupportedStub = sinon.stub();

            this.oTransportComponent = {};

            this.oGetOwnerComponentForStub = sinon.stub(this.oBaseController, "getOwnerComponent").returns({
                getRootControl: sinon.stub().returns({}),
                createTransportComponent: sinon.stub().returns(Promise.resolve(this.oTransportComponent)),
                getModel: sinon.stub(),
                isTransportSupported: this.oIsTransportSupportedStub
            });

            this.oShowMessageBoxErrorStub = sinon.stub(this.oBaseController, "showMessageBoxError");

            this.oLoadStub = sinon.stub(CopyPageDialogController.prototype, "load").returns(Promise.resolve());
            this.oOpenStub = sinon.stub(CopyPageDialogController.prototype, "open");

            this.oDialog = {
                open: sinon.stub(),
                getModel: sinon.stub().returns({
                    setProperty: sinon.stub(),
                    getProperty: sinon.stub()
                })
            };

            this.oGetResourceBundleStub = sinon.stub(this.oBaseController, "getResourceBundle").returns({
                getText: sinon.stub()
            });

            this.oEnhanceDialogWithTransportStub = sinon.stub().returns(this.oDialog);

            this.oGetTransportHelperStub = sinon.stub(this.oBaseController, "getTransportHelper").returns({
                enhanceDialogWithTransport: this.oEnhanceDialogWithTransportStub
            });

            this.oCreateEditDialogStub = sinon.stub(this.oBaseController, "_createEditDialog")
                .returns(Promise.resolve(this.oDialog));
        },
        afterEach: function () {
            delete this.oBaseController;
            delete this.oTransportHelper;
            this.oGetResourceBundleStub.restore();
            this.oGetTransportHelperStub.restore();
            this.oCreateEditDialogStub.restore();
            this.oShowMessageBoxErrorStub.restore();
            this.oGetOwnerComponentForStub.restore();
            this.oLoadStub.restore();
            this.oOpenStub.restore();
        }
    });

    QUnit.test("calls the enhanceDialogWithTransport method if transport is supported", function (assert) {
        this.oIsTransportSupportedStub.returns(true);
        var done = assert.async();
        assert.expect(1);
        this.oBaseController.showCopyDialog(this.oPage).then(function () {
            assert.ok(this.oEnhanceDialogWithTransportStub.calledOnce, "The enhanceDialogWithTransport method was called");
        }.bind(this)).catch(function (oError) {
            assert.notOk(true, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });

    QUnit.test("does not call the enhanceDialogWithTransport method if transport is not supported", function (assert) {
        this.oIsTransportSupportedStub.returns(false);
        var done = assert.async();
        assert.expect(1);
        this.oBaseController.showCopyDialog(this.oPage).then(function () {
            assert.notOk(this.oEnhanceDialogWithTransportStub.called, "The enhanceDialogWithTransport method was not called");
        }.bind(this)).catch(function (oError) {
            assert.notOk(true, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });

    QUnit.module("The function showCreateDialog", {
        beforeEach: function () {
            this.oTransportHelper = new Transport(true);
            this.oBaseController = new BaseController();
            this.oPage = {
                content: {
                    id: "TEST-PAGE-ID",
                    title: "TEST-PAGE-TITLE"
                },
                metadata: {
                    devclass: "TEST-PACKAGE"
                }
            };
            this.oIsTransportSupportedStub = sinon.stub();

            this.oTransportComponent = {};

            this.oGetOwnerComponentForStub = sinon.stub(this.oBaseController, "getOwnerComponent").returns({
                getRootControl: sinon.stub().returns({}),
                createTransportComponent: sinon.stub().returns(Promise.resolve(this.oTransportComponent)),
                getModel: sinon.stub(),
                isTransportSupported: this.oIsTransportSupportedStub
            });

            this.oShowMessageBoxErrorStub = sinon.stub(this.oBaseController, "showMessageBoxError");

            this.oLoadStub = sinon.stub(CreatePageDialogController.prototype, "load").returns(Promise.resolve());
            this.oOpenStub = sinon.stub(CreatePageDialogController.prototype, "open");

            this.oDialog = {
                open: sinon.stub(),
                getModel: sinon.stub().returns({
                    setProperty: sinon.stub(),
                    getProperty: sinon.stub()
                })
            };

            this.oGetResourceBundleStub = sinon.stub(this.oBaseController, "getResourceBundle").returns({
                getText: sinon.stub()
            });

            this.oEnhanceDialogWithTransportStub = sinon.stub().returns(this.oDialog);

            this.oGetTransportHelperStub = sinon.stub(this.oBaseController, "getTransportHelper").returns({
                enhanceDialogWithTransport: this.oEnhanceDialogWithTransportStub
            });

            this.oCreateEditDialogStub = sinon.stub(this.oBaseController, "_createEditDialog")
                .returns(Promise.resolve(this.oDialog));
        },
        afterEach: function () {
            delete this.oBaseController;
            delete this.oTransportHelper;
            this.oGetResourceBundleStub.restore();
            this.oGetTransportHelperStub.restore();
            this.oCreateEditDialogStub.restore();
            this.oShowMessageBoxErrorStub.restore();
            this.oGetOwnerComponentForStub.restore();
            this.oLoadStub.restore();
            this.oOpenStub.restore();
        }
    });

    QUnit.test("calls the enhanceDialogWithTransport method if transport is supported", function (assert) {
        this.oIsTransportSupportedStub.returns(true);
        var done = assert.async();
        assert.expect(1);
        this.oBaseController.showCreateDialog(this.oPage).then(function () {
            assert.ok(this.oEnhanceDialogWithTransportStub.calledOnce, "The enhanceDialogWithTransport method was called");
        }.bind(this)).catch(function (oError) {
            assert.notOk(true, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });

    QUnit.test("does not call the enhanceDialogWithTransport method if transport is not supported", function (assert) {
        this.oIsTransportSupportedStub.returns(false);
        var done = assert.async();
        assert.expect(1);
        this.oBaseController.showCreateDialog(this.oPage).then(function () {
            assert.notOk(this.oEnhanceDialogWithTransportStub.called, "The enhanceDialogWithTransport method was not called");
        }.bind(this)).catch(function (oError) {
            assert.notOk(true, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });

    QUnit.module("The function checkMasterLanguageMismatch", {
        beforeEach: function () {
            this.oBaseController = new BaseController();
            this.oShowMessageBoxErrorStub = sinon.stub(this.oBaseController, "showMessageBoxError");

            this.oGetConfigStub = sinon.stub().returns({
                checkLanguageMismatch: true
            });

            sinon.stub(this.oBaseController, "getOwnerComponent").returns({
                getMetadata: sinon.stub().returns({
                    getConfig: this.oGetConfigStub
                })
            });

            this.oPage = {
                content: {
                    masterLanguage: "EN"
                }
            };

            this.oGetResourceBundleStub = sinon.stub(this.oBaseController, "getResourceBundle").returns({
                getText: sinon.stub()
            });

            sap.ui.getCore = function () {
                return {
                    getConfiguration: function () {
                        return {
                            getSAPLogonLanguage: function () {
                                return {
                                    toUpperCase: function () {
                                        return "EN";
                                    }
                                };
                            }
                        };
                    }
                };
            };
        },
        afterEach: function () {
            delete this.oBaseController;
            delete this.oPage;
            this.oGetResourceBundleStub.restore();
        }
    });

    QUnit.test("returns false if masterLanguage matches logon language", function (assert) {
        var bResult = this.oBaseController.checkMasterLanguageMismatch(this.oPage);
        assert.notOk(bResult, "The result was false");
    });

    QUnit.test("returns true if masterLanguage differs from logon language", function (assert) {
        this.oPage.content.masterLanguage = "DE";
        var bResult = this.oBaseController.checkMasterLanguageMismatch(this.oPage);
        assert.ok(bResult, "The result was true");
    });

    QUnit.test("returns false if masterLanguage differs from logon language but checkLanguageMismatch is false", function (assert) {
        this.oGetConfigStub.returns({
            checkLanguageMismatch: false
        });
        this.oPage.content.masterLanguage = "DE";
        var bResult = this.oBaseController.checkMasterLanguageMismatch(this.oPage);
        assert.notOk(bResult, "The result was false");
    });
});