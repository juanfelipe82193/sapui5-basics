// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.require([
    "sap/ushell/applications/PageComposer/controller/CreatePageDialog.controller"
], function (CreatePageDialogController) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("CreatePageDialog controller onConfirm", {
        beforeEach: function () {
            this.oController = new CreatePageDialogController();
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
        this.oGetPropertyStub.withArgs("/id").returns("testIdProperty");
        this.oGetPropertyStub.withArgs("/title").returns("testTitleProperty");
        this.oGetPropertyStub.withArgs("/description").returns("testDescriptionProperty");
        this.oController.onConfirm();
        assert.ok(this.oController._fnConfirm.calledWith({
            content: {
                id: "testIdProperty",
                title: "testTitleProperty",
                description: "testDescriptionProperty"
            },
            metadata: {}
        }), "The resolve function was called with the expected properties");
    });

    QUnit.module("CreatePageDialog controller _resetModel", {
        beforeEach: function () {
            this.oController = new CreatePageDialogController();
            this.oGetPropertyStub = sinon.stub().returns({
                transport: true,
                id: false
            });
            this.oSetPropertySpy = sinon.spy();
        }
    });

    QUnit.test("_resetModel should keep existing validation values", function (assert) {
        this.oGetPropertyStub.withArgs("/validation").returns({
            test: true,
            test1: false,
            test2: true,
            id: true,
            title: false
        });
        this.oController._resetModel({
            getProperty: this.oGetPropertyStub,
            setProperty: this.oSetPropertySpy
        });
        assert.ok(this.oSetPropertySpy.calledWith("/validation", {
            test: true,
            test1: false,
            test2: true,
            id: false,
            title: false
        }), "_resetModel kept existing validation values");
    });

    QUnit.module("CreatePageDialog controller onPageIDLiveChange", {
        beforeEach: function () {
            this.oUshellResourcesStub = sinon.stub();
            this.oUshellResourcesStub.withArgs("Message.InvalidPageID").returns("Invalid ID entered");
            this.oUshellResourcesStub.withArgs("Message.EmptyPageID").returns("Empty ID entered");
            this.oResources = {
                getText: this.oUshellResourcesStub
            };
            this.oController = new CreatePageDialogController(null, this.oResources);
            this.oSetPropertySpy = sinon.spy();

            sinon.stub(this.oController, "handlePackageNamespaceChange");

            sinon.stub(this.oController, "getModel").returns({
                getProperty: function () {
                    return {
                        id: false,
                        title: false
                    };
                },
                setProperty: this.oSetPropertySpy
            });
            this.oController._oView = {
                byId: sinon.stub().returns({
                    getValue: function () { return "not empty"; }
                })
            };

            this.sPageId = "";
            this.oSetValueStateSpy = sinon.spy();
            this.oSetValueStateTextSpy = sinon.spy();
            this.oEvent = {
                getSource: function () {
                    return {
                        getValue: function () { return this.sPageId; }.bind(this),
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

    QUnit.test("onPageIDLiveChange sets the right value state if the ID is valid", function (assert) {
        // Arrange
        this.sPageId = "/UI2/FLP_DEMO_PAGE";

        // Act
        this.oController.onPageIDLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetValueStateSpy.firstCall.args, ["None"],
            "onPageIDLiveChange sets the right value state if the ID is valid");
    });

    QUnit.test("onPageIDLiveChange sets the right value state if the ID isn't valid", function (assert) {
        // Arrange
        this.sPageId = "$Invalid Page Id";

        // Act
        this.oController.onPageIDLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetValueStateSpy.firstCall.args, ["Error"],
            "onPageIDLiveChange sets the right value state if the ID isn't valid");
    });

    QUnit.test("onPageIDLiveChange sets the right validation property on the fragment model if the ID is valid", function (assert) {
        // Arrange
        this.sPageId = "/UI2/FLP_DEMO_PAGE";
        var oExpectedValidation = {
            id: true,
            title: false
        };

        // Act
        this.oController.onPageIDLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetPropertySpy.firstCall.args, ["/validation", oExpectedValidation],
            "onPageIDLiveChange sets the right validation property if the ID is valid");
    });

    QUnit.test("onPageIDLiveChange sets the right validation property on the fragment model if the ID isn't valid", function (assert) {
        // Arrange
        this.sPageId = "$Invalid Page Id";
        var oExpectedValidation = {
            id: false,
            title: false
        };

        // Act
        this.oController.onPageIDLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetPropertySpy.firstCall.args, ["/validation", oExpectedValidation],
            "onPageIDLiveChange sets the right validation property if the ID is empty");
    });

    QUnit.test("onPageIDLiveChange sets the right value state text if the ID is empty", function (assert) {
        // Arrange
        this.sPageId = "";

        // Act
        this.oController.onPageIDLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetValueStateTextSpy.firstCall.args, ["Empty ID entered"],
            "onPageIDLiveChange sets the right value state text if the ID is empty");
    });

    QUnit.test("onPageIDLiveChange sets the right value state text if the ID isn't empty", function (assert) {
        // Arrange
        this.sPageId = "$Invalid Page Id";

        // Act
        this.oController.onPageIDLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetValueStateTextSpy.firstCall.args, ["Invalid ID entered"],
            "onPageIDLiveChange sets the right value state text if the ID exists");
    });

    QUnit.module("CreatePageDialog controller onTitleLiveChange", {
        beforeEach: function () {
            this.oUshellResourcesStub = sinon.stub();
            this.oUshellResourcesStub.withArgs("Message.InvalidPageID").returns("Invalid ID entered");
            this.oUshellResourcesStub.withArgs("Message.EmptyPageID").returns("Empty ID entered");
            this.oResources = {
                getText: this.oUshellResourcesStub
            };
            this.oController = new CreatePageDialogController(null, this.oResources);
            this.oSetPropertySpy = sinon.spy();
            sinon.stub(this.oController, "getModel").returns({
                getProperty: function () {
                    return {
                        id: false,
                        title: false
                    };
                },
                setProperty: this.oSetPropertySpy
            });
            this.sPageTitleStub = "";
            this.oSetValueStateSpy = sinon.spy();
            this.oSetValueStateTextSpy = sinon.spy();
            this.oEvent = {
                getSource: function () {
                    return {
                        getValue: function () { return this.sPageTitleStub; }.bind(this),
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

    QUnit.test("onTitleLiveChange sets the right value state if the title is valid", function (assert) {
        // Arrange
        this.sPageTitleStub = "UI2 - FLP Demo Page";

        // Act
        this.oController.onTitleLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetValueStateSpy.firstCall.args, ["None"],
            "onTitleLiveChange sets the right value state if the title is valid");
    });

    QUnit.test("onTitleLiveChange sets the right value state if the title isn't valid", function (assert) {
        // Arrange
        this.sPageTitleStub = "";

        // Act
        this.oController.onTitleLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetValueStateSpy.firstCall.args, ["Error"],
            "onTitleLiveChange sets the right value state if the title isn't valid");
    });

    QUnit.test("onTitleLiveChange sets the right validation property on the fragment model if the title is valid", function (assert) {
        // Arrange
        this.sPageTitleStub = "UI2 - FLP Demo Page";
        var oExpectedValidation = {
            id: false,
            title: true
        };

        // Act
        this.oController.onTitleLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetPropertySpy.firstCall.args, ["/validation", oExpectedValidation],
            "onTitleLiveChange sets the right validation property if the title is valid");
    });

    QUnit.test("onTitleLiveChange sets the right validation property on the fragment model if the title isn't valid", function (assert) {
        // Arrange
        this.sPageTitleStub = "";
        var oExpectedValidation = {
            id: false,
            title: false
        };

        // Act
        this.oController.onTitleLiveChange(this.oEvent);

        // Assert
        assert.deepEqual(this.oSetPropertySpy.firstCall.args, ["/validation", oExpectedValidation],
            "onTitleLiveChange sets the right validation property if the title is empty");
    });

    QUnit.module("CreatePageDialog controller", {
        beforeEach: function () {
            this.oController = new CreatePageDialogController();
        },
        afterEach: function () {
            delete this.oController;
        }
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
});
