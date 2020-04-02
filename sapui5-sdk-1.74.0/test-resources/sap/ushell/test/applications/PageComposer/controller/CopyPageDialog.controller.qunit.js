// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.require([
    "sap/ushell/applications/PageComposer/controller/CopyPageDialog.controller"
], function (CopyPageDialogController) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("CopyPageDialog controller", {
        beforeEach: function () {
            this.oController = new CopyPageDialogController();
            this.oResolveSpy = sinon.spy();
            this.oController._fnConfirm = this.oResolveSpy;
            this.oController._oView = {
                byId: function () { }
            };

            this.oGetPropertyStub = sinon.stub();

            sinon.stub(this.oController, "getModel").returns({
                getProperty: this.oGetPropertyStub
            });
        },

        afterEach: function () {
            delete this.oController;
        }
    });

    QUnit.test("should call the resolve function with the expected properties", function (assert) {
        this.oGetPropertyStub.withArgs("/targetId").returns("testNewIdProperty");
        this.oGetPropertyStub.withArgs("/sourceId").returns("testOldIdProperty");
        this.oGetPropertyStub.withArgs("/title").returns("testTitle");
        this.oGetPropertyStub.withArgs("/description").returns("testDescription");
        this.oController.onConfirm();
        assert.ok(this.oController._fnConfirm.calledWith({
            content: {
                targetId: "testNewIdProperty",
                sourceId: "testOldIdProperty",
                title: "testTitle",
                description: "testDescription"
            },
            metadata: {}
        }), "The resolve function was called with the expected properties");
    });

    QUnit.test("external methods exist", function (assert) {
        assert.ok(this.oController.getModel, "The getModel method exists");
        assert.ok(this.oController.onCancel, "The onCancel method exists");
        assert.ok(this.oController.attachConfirm, "The attachConfirm method exists");
        assert.ok(this.oController.validate, "The validate method exists");
        assert.ok(this.oController.transportExtensionPoint, "The transportExtensionPoint method exists");
        assert.ok(this.oController.load, "The load method exists");
        assert.ok(this.oController.open, "The open method exists");
    });

    QUnit.module("CopyPageDialog controller _resetModel", {
        beforeEach: function () {
            this.oController = new CopyPageDialogController();
            this.oGetPropertyStub = sinon.stub().returns({
                transport: true,
                targetId: false
            });
            this.oSetPropertySpy = sinon.spy();
        }
    });

    QUnit.test("_resetModel should keep existing validation values", function (assert) {
        this.oGetPropertyStub.withArgs("/validation").returns({
            test: true,
            test1: false,
            test2: true,
            id: true
        });
        this.oController._resetModel({
            getProperty: this.oGetPropertyStub,
            setProperty: this.oSetPropertySpy
        });
        assert.ok(this.oSetPropertySpy.calledWith("/validation", {
            test: true,
            test1: false,
            test2: true,
            id: false
        }), "_resetModel kept existing validation values");
    });

    QUnit.module("CopyPageDialog controller onPageIDLiveChange", {
        beforeEach: function () {
            this.oUshellResourcesStub = sinon.stub();
            this.oUshellResourcesStub.withArgs("Message.InvalidPageID").returns("Invalid ID entered");
            this.oUshellResourcesStub.withArgs("Message.EmptyPageID").returns("Empty ID entered");
            this.oResources = {
                getText: this.oUshellResourcesStub
            };

            this.oController = new CopyPageDialogController(null, this.oResources);
            this.oSetPropertySpy = sinon.spy();

            sinon.stub(this.oController, "handlePackageNamespaceChange");

            sinon.stub(this.oController, "getModel").returns({
                getProperty: function () {
                    return { id: false };
                },
                setProperty: this.oSetPropertySpy
            });
            this.oController._oView = {
                byId: sinon.stub().returns({
                    getValue: function () { return "not empty"; }
                })
            };

            this.stargetId = "";
            this.oSetValueStateSpy = sinon.spy();
            this.oSetValueStateTextSpy = sinon.spy();
            this.oEvent = {
                getSource: function () {
                    return {
                        getValue: function () { return this.stargetId; }.bind(this),
                        setValueState: this.oSetValueStateSpy,
                        setValueStateText: this.oSetValueStateTextSpy
                    };
                }.bind(this)
            };
        },
        afterEach: function () {
            delete this.oController;
        }
    });

    QUnit.test("onPageIDLiveChange sets the right value state if the Target (New Page) ID is valid", function (assert) {
        // Arrange
        this.stargetId = "/UI2/FLP_DEMO_PAGE";

        // Act
        this.oController.onPageIDLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetValueStateSpy.firstCall.args, ["None"],
            "onPageIDLiveChange sets the right value state if the Target (New Page) ID is valid");
    });

    QUnit.test("onPageIDLiveChange sets the right value state if the Target (New Page) ID isn't valid", function (assert) {
        // Arrange
        this.stargetId = "$Invalid Page Id";

        // Act
        this.oController.onPageIDLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetValueStateSpy.firstCall.args, ["Error"],
            "onPageIDLiveChange sets the right value state if the Target (New Page) ID isn't valid");
    });

    QUnit.test("onPageIDLiveChange sets the right validation property on the fragment model if the Target (New Page) ID is valid", function (assert) {
        // Arrange
        this.stargetId = "/UI2/FLP_DEMO_PAGE";
        var oExpectedValidation = { id: true };

        // Act
        this.oController.onPageIDLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetPropertySpy.firstCall.args, ["/validation", oExpectedValidation],
            "onPageIDLiveChange sets the right validation property if the Target (New Page) ID is valid");
    });

    QUnit.test("onPageIDLiveChange sets the right validation property on the fragment model if the Target (New Page) ID isn't valid", function (assert) {
        // Arrange
        this.stargetId = "$Invalid Page Id";
        var oExpectedValidation = { id: false };

        // Act
        this.oController.onPageIDLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetPropertySpy.firstCall.args, ["/validation", oExpectedValidation],
            "onPageIDLiveChange sets the right validation property if the Target (New Page) ID is empty");
    });

    QUnit.test("onPageIDLiveChange sets the right value state text if the Target (New Page) ID is empty", function (assert) {
        // Arrange
        this.stargetId = "";

        // Act
        this.oController.onPageIDLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetValueStateTextSpy.firstCall.args, ["Empty ID entered"],
            "onPageIDLiveChange sets the right value state text if the Target (New Page) ID is empty");
    });

    QUnit.test("onPageIDLiveChange sets the right value state text if the ID isn't empty", function (assert) {
        // Arrange
        this.stargetId = "$Invalid Page Id";

        // Act
        this.oController.onPageIDLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetValueStateTextSpy.firstCall.args, ["Invalid ID entered"],
            "onPageIDLiveChange sets the right value state text if the Target (New Page) ID exists");
    });
});
