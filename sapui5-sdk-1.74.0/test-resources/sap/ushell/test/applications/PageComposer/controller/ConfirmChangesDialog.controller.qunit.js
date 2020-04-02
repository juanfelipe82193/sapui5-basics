// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.require([
    "sap/ushell/applications/PageComposer/controller/ConfirmChangesDialog.controller",
    "sap/m/MessageToast"
], function (ConfirmChangesDialog, MessageToast) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("ConfirmChangesDialog controller", {
        beforeEach: function () {
            this.oController = new ConfirmChangesDialog();
        },
        afterEach: function () {
            delete this.oController;
        }
    });

    QUnit.test("External methods exist", function (assert) {
        assert.ok(this.oController.getModel, "The getModel method exists");
        assert.ok(this.oController.onCancel, "The onCancel method exists");
        assert.ok(this.oController.attachConfirm, "The attachConfirm method exists");
        assert.ok(this.oController.validate, "The validate method exists");
        assert.ok(this.oController.transportExtensionPoint, "The transportExtensionPoint method exists");
        assert.ok(this.oController.load, "The load method exists");
        assert.ok(this.oController.open, "The open method exists");
    });

    QUnit.module("The function onAfterClose", {
        beforeEach: function () {
            this.oController = new ConfirmChangesDialog();
        },
        afterEach: function () {
            delete this.oController;
        }
    });

    QUnit.test("Calls the destroy function", function (assert) {
        //Arrange
        var oEvent = {
            getSource: sinon.stub().returns({
                destroy: function () {}
            })
        };
        var oDestroyStub = sinon.stub(oEvent.getSource(), "destroy");

        //Act
        this.oController.onAfterClose(oEvent);

        //Assert
        assert.deepEqual(oDestroyStub.callCount, 1, "The destroy function was called once.");
    });

    QUnit.module("The function onCancel", {
        beforeEach: function () {
            this.oController = new ConfirmChangesDialog();
        },
        afterEach: function () {
            delete this.oController;
        }
    });

    QUnit.test("Calls the close function", function (assert) {
        //Arrange
        var oEvent = {
            getSource: sinon.stub().returns({
                getParent: sinon.stub().returns({
                    close: function () {}
                })
            })
        };
        var oCloseStub = sinon.stub(oEvent.getSource().getParent(), "close");

        //Act
        this.oController.onCancel(oEvent);

        //Assert
        assert.deepEqual(oCloseStub.callCount, 1, "The close function was called once.");
    });

    QUnit.module("The function onDismissChanges", {
        beforeEach: function () {
            this.oView = {
                getController: sinon.stub().returns({
                    getRouter: sinon.stub().returns({
                        navTo: function () {}
                    }),
                    _setDirtyFlag: function () {}
                })
            };
            this.oController = new ConfirmChangesDialog(this.oView);
        },
        afterEach: function () {
            delete this.oController;
            delete this.oView;
        }
    });

    QUnit.test("Calls the navTo function and closes the dialog", function (assert) {
        //Arrange
        var oEvent = {
            getSource: sinon.stub().returns({
                getParent: sinon.stub().returns({
                    close: function () {}
                })
            })
        };
        var oCloseStub = sinon.stub(oEvent.getSource().getParent(), "close");
        var oSetDirtyFlagStub = sinon.stub(this.oView.getController(), "_setDirtyFlag");
        var oNavToStub = sinon.stub(this.oView.getController().getRouter(), "navTo");

        //Act
        this.oController.onDismissChanges(oEvent);

        //Assert
        assert.deepEqual(oCloseStub.callCount, 1, "The function close was called once.");
        assert.deepEqual(oSetDirtyFlagStub.callCount, 1, "The function _setDirtyFlag was called once.");
        assert.ok(oSetDirtyFlagStub.calledWith(false), "The function _setDirtyFlag was called with the correct parameters.");
        assert.deepEqual(oNavToStub.callCount, 1, "The function navTo was called once.");
        assert.ok(oNavToStub.calledWith("overview", null, null, true), "The function navTo was called with the correct parameters.");
    });

    QUnit.module("The function onOverwriteChanges", {
        beforeEach: function () {
            this.oView = {
                getController: sinon.stub().returns({
                    getPageRepository: sinon.stub().returns({
                        getPage: function () {},
                        updatePage: function () {},
                        createPage: function () {}
                    }),
                    showMessageBoxError: function () {}
                }),
                getModel: sinon.stub().returns({
                    getProperty: function () {}
                })
            };
            this.oEvent = {
                getSource: sinon.stub().returns({
                    getParent: sinon.stub().returns({
                        close: function () {}
                    })
                })
            };
            this.oResourceBundle = {
                getText: function () {}
            };
            this.sText = "someText";
            this.oResourceBundleStub = sinon.stub(this.oResourceBundle, "getText").returns(this.sText);
            this.oShowMessageBoxStub = sinon.stub(this.oView.getController(), "showMessageBoxError");
            this.oGetPropertyStub = sinon.stub(this.oView.getModel(), "getProperty");
            this.oCloseStub = sinon.stub(this.oEvent.getSource().getParent(), "close");

            this.oController = new ConfirmChangesDialog(this.oView, this.oResourceBundle);

            this.oSuccessfulSaveStub = sinon.stub(this.oController, "_successfulSave");
        },
        afterEach: function () {
            delete this.oController;
            delete this.oEvent;
            this.oGetPropertyStub.restore();
            this.oResourceBundleStub.restore();
            this.oShowMessageBoxStub.restore();
            this.oCloseStub.restore();
            this.oSuccessfulSaveStub.restore();
        }
    });

    QUnit.test("Invalid status code: It rejects the promise and closes the dialog", function (assert) {
       //Arrange
        var oSimpleError = {
            statusCode: "0"
        };
        this.oGetPropertyStub.withArgs("/simpleError").returns(oSimpleError);

       //Act
        return this.oController.onOverwriteChanges(this.oEvent).catch(function () {
            //Assert
            assert.deepEqual(this.oCloseStub.callCount, 1, "The function close was called once.");
        }.bind(this));
    });

    QUnit.test("Status code 400: It resolves the promise and recreates the page", function (assert) {
        //Arrange
        var oSimpleError = {
            statusCode: "400"
        };
        var oPage = {
            content: {
                id: "someId"
            }
        };
        this.oGetPropertyStub.withArgs("/simpleError").returns(oSimpleError);
        this.oGetPropertyStub.withArgs("/page").returns(oPage);

        var oCreatePageStub = sinon.stub(this.oView.getController().getPageRepository(), "createPage").resolves();

        //Act
        return this.oController.onOverwriteChanges(this.oEvent).then(function () {
            //Assert
            assert.deepEqual(this.oCloseStub.callCount, 1, "The function close was called once.");
            assert.deepEqual(oCreatePageStub.callCount, 1, "The function createPage was called once.");
            assert.ok(oCreatePageStub.calledWith(oPage), "The function createPage was called with the correct parameters.");
            assert.deepEqual(this.oSuccessfulSaveStub.callCount, 1, "The function _successfulSave was called once.");
            assert.ok(this.oSuccessfulSaveStub.calledWith(this.oResourceBundle), "The function _successfulSave was called correctly.");
        }.bind(this));
    });

    QUnit.test("Status code 400: It rejects the promise and displays a message box when createPage fails", function (assert) {
        //Arrange
        var oSimpleError = {
            statusCode: "400"
        };
        var oPage = {
            content: {
                id: "someId"
            }
        };
        this.oGetPropertyStub.withArgs("/simpleError").returns(oSimpleError);
        this.oGetPropertyStub.withArgs("/page").returns(oPage);

        var oCreatePageStub = sinon.stub(this.oView.getController().getPageRepository(), "createPage").rejects();

        //Act
        return this.oController.onOverwriteChanges(this.oEvent).then(function () {
            //Assert
            assert.deepEqual(this.oCloseStub.callCount, 1, "The function close was called once.");
            assert.deepEqual(oCreatePageStub.callCount, 1, "The function createPage was called once.");
            assert.ok(oCreatePageStub.calledWith(oPage), "The function createPage was called with the correct parameters.");
            assert.deepEqual(this.oSuccessfulSaveStub.callCount, 0, "The function _successfulSave was not called.");
            assert.deepEqual(this.oShowMessageBoxStub.callCount, 1, "The function showMessageBoxError was called once.");
            assert.ok(this.oShowMessageBoxStub.calledWith(this.sText), "The function showMessageBoxError was called correctly.");
            assert.deepEqual(this.oResourceBundleStub.callCount, 1, "The function getText of oResourceBundle was called once.");
            assert.ok(this.oResourceBundleStub.calledWith("Message.CreatePageError"), "The function getText was called correctly.");
        }.bind(this));
    });

    QUnit.test("Status code 412: It rejects the promise and shows a LoadPageError", function (assert) {
        var oSimpleError = {
            statusCode: "412"
        };
        var oPage = {
            content: {
                id: "someId",
                modifiedOn: 1234
            }
        };
        this.oGetPropertyStub.withArgs("/simpleError").returns(oSimpleError);
        this.oGetPropertyStub.withArgs("/page").returns(oPage);

        var oGetPageStub = sinon.stub(this.oView.getController().getPageRepository(), "getPage").rejects();

        //Act
        return this.oController.onOverwriteChanges(this.oEvent).then(function () {
            //Assert
            assert.deepEqual(this.oCloseStub.callCount, 1, "The function close was called once.");
            assert.deepEqual(oGetPageStub.callCount, 1, "The function getPage was called once.");
            assert.ok(oGetPageStub.calledWith(oPage.content.id), "The function getPage was called with the correct parameters.");
            assert.deepEqual(this.oSuccessfulSaveStub.callCount, 0, "The function _successfulSave was not called.");
            assert.deepEqual(this.oShowMessageBoxStub.callCount, 1, "The function showMessageBoxError was called once.");
            assert.ok(this.oShowMessageBoxStub.calledWith(this.sText), "The function showMessageBoxError was called correctly.");
            assert.deepEqual(this.oResourceBundleStub.callCount, 1, "The function getText of oResourceBundle was called once.");
            assert.ok(this.oResourceBundleStub.calledWith("Message.LoadPageError"), "The function getText was called correctly.");
        }.bind(this));
    });

    QUnit.test("Status code 412: It rejects the promise and shows an UpdatePage error", function (assert) {
        var oSimpleError = {
            statusCode: "412"
        };
        var oPage = {
            content: {
                id: "someId",
                modifiedOn: 1234
            }
        };
        var oNewPage = {
            content: {}
        };
        this.oGetPropertyStub.withArgs("/simpleError").returns(oSimpleError);
        this.oGetPropertyStub.withArgs("/page").returns(oPage);

        var oGetPageStub = sinon.stub(this.oView.getController().getPageRepository(), "getPage").resolves(oNewPage);
        var oGetUpdatePageStub = sinon.stub(this.oView.getController().getPageRepository(), "updatePage").rejects();

        //Act
        return this.oController.onOverwriteChanges(this.oEvent).then(function () {
            //Assert
            assert.deepEqual(this.oCloseStub.callCount, 1, "The function close was called once.");
            assert.ok(oGetPageStub.calledWith(oPage.content.id), "The function getPage was called with the correct parameters.");
            assert.deepEqual(oGetUpdatePageStub.callCount, 1, "The function updatePage was called once.");
            assert.ok(oGetUpdatePageStub.calledWith(oPage), "The function updatePage was called with the correct parameters.");
            assert.deepEqual(this.oSuccessfulSaveStub.callCount, 0, "The function _successfulSave was not called.");
            assert.deepEqual(this.oShowMessageBoxStub.callCount, 1, "The function showMessageBoxError was called once.");
            assert.ok(this.oShowMessageBoxStub.calledWith(this.sText), "The function showMessageBoxError was called correctly.");
            assert.deepEqual(this.oResourceBundleStub.callCount, 1, "The function getText of oResourceBundle was called once.");
            assert.ok(this.oResourceBundleStub.calledWith("Message.UpdatePageError"), "The function getText was called correctly.");
        }.bind(this));
    });

    QUnit.test("Status code 412: It resolves the promise and updates the page", function (assert) {
        var oSimpleError = {
            statusCode: "412"
        };
        var oPage = {
            content: {
                id: "someId",
                modifiedOn: 1234
            }
        };
        var oNewPage = {
            content: {}
        };
        this.oGetPropertyStub.withArgs("/simpleError").returns(oSimpleError);
        this.oGetPropertyStub.withArgs("/page").returns(oPage);

        var oGetPageStub = sinon.stub(this.oView.getController().getPageRepository(), "getPage").resolves(oNewPage);
        var oGetUpdatePageStub = sinon.stub(this.oView.getController().getPageRepository(), "updatePage").resolves();

        //Act
        return this.oController.onOverwriteChanges(this.oEvent).then(function () {
            //Assert
            assert.deepEqual(this.oCloseStub.callCount, 1, "The function close was called once.");
            assert.ok(oGetPageStub.calledWith(oPage.content.id), "The function getPage was called with the correct parameters.");
            assert.deepEqual(oGetUpdatePageStub.callCount, 1, "The function updatePage was called once.");
            assert.ok(oGetUpdatePageStub.calledWith(oPage), "The function updatePage was called with the correct parameters.");
            assert.deepEqual(this.oSuccessfulSaveStub.callCount, 1, "The function _successfulSave was called once.");
            assert.ok(this.oSuccessfulSaveStub.calledWith(this.oResourceBundle), "The function _successfulSave was called correctly.");
        }.bind(this));
    });

    QUnit.module("The function _successfulSave", {
        beforeEach: function () {
            this.oView = {
                getController: sinon.stub().returns({
                    _setDirtyFlag: function () {}
                })
            };
            this.oController = new ConfirmChangesDialog(this.oView);
        },
        afterEach: function () {
            delete this.oController;
            delete this.oView;
        }
    });

    QUnit.test("Shows a MessageToast and sets the dirtyFlag to false", function (assert) {
        //Arrange
        var sGetTextResult = "someText";
        var oResourceBundle = {
            getText: function () {}
        };
        var oMessageToastStub = sinon.stub(MessageToast, "show");
        var oResourceBundleStub = sinon.stub(oResourceBundle, "getText").returns(sGetTextResult);
        var oMsgToastParam = {
            closeOnBrowserNavigation: false
        };

       //Act
        this.oController._successfulSave(oResourceBundle);

       //Assert
        assert.deepEqual(oMessageToastStub.callCount, 1, "The MessageToast show function was called once.");
        assert.ok(oMessageToastStub.calledWith(sGetTextResult, oMsgToastParam), "The show function was called with the right parameters.");
        assert.ok(oResourceBundleStub.calledWith("Message.SavedChanges"), "The getText function was called with the correct parameters.");
    });
});