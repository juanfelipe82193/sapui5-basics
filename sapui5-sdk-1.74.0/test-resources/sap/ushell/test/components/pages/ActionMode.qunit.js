// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.pages.controller.PagesRuntime
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/components/pages/ActionMode",
    "sap/ushell/resources",
    "sap/ushell/EventHub",
    "sap/base/Log"
], function (ActionMode, resources, EventHub, Log) {
    "use strict";

    var sandbox = sinon.createSandbox({});

    QUnit.start();

    QUnit.module("The start function", {
        beforeEach: function () {
            this.oSetPropertyStub = sinon.stub();
            this.oGetModelStub = sinon.stub();
            this.oGetModelStub.withArgs("viewSettings").returns({setProperty: this.oSetPropertyStub});
            this.oGetViewStub = sinon.stub();
            this.oGetViewStub.returns({getModel: this.oGetModelStub});
            this.oMockController = {
                getView: this.oGetViewStub
            };

            this.oEmitStub = sandbox.stub(EventHub, "emit");

            this.oSetTooltipStub = sinon.stub();
            this.oSetTextStub = sinon.stub();
            this.oButtonMock = {
                setTooltip: this.oSetTooltipStub,
                setText: this.oSetTextStub
            };
            this.oByIdStub = sandbox.stub(sap.ui.getCore(), "byId");
            this.oByIdStub.withArgs("ActionModeBtn").returns(this.oButtonMock);

            this.sMockText = "sMockText";
            this.oGetTextStub = sandbox.stub(resources.i18n, "getText");
            this.oGetTextStub.withArgs("PageRuntime.EditMode.Exit").returns(this.sMockText);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.start(this.oMockController);
        //Assert
        assert.strictEqual(ActionMode.oController, this.oMockController, "Controller was saved to the ActionMode");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/actionModeActive", true], "set property was called with the right parameters");
        assert.deepEqual(this.oEmitStub.getCall(0).args, ["enableMenuBarNavigation", false], "EventHub was called with the right parameters");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");

        assert.strictEqual(this.oSetTooltipStub.getCall(0).args[0], this.sMockText, "setTooltip was called with the right parameters");
        assert.strictEqual(this.oSetTextStub.getCall(0).args[0], this.sMockText, "setTooltip was called with the right parameters");
    });

    QUnit.module("The cancel function", {
        beforeEach: function () {
            this.oCleanupStub = sandbox.stub(ActionMode, "_cleanup");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.cancel();
        //Assert
        assert.strictEqual(this.oCleanupStub.callCount, 1, "cleanup was called once");
    });

    QUnit.module("The save function", {
        beforeEach: function () {
            this.oCleanupStub = sandbox.stub(ActionMode, "_cleanup");
            this.oInfoStub = sandbox.stub(Log, "info");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.save();
        //Assert
        assert.strictEqual(this.oInfoStub.callCount, 1, "Log.info was called once");
        assert.strictEqual(this.oCleanupStub.callCount, 1, "cleanup was called once");
    });

    QUnit.module("The _cleanup function", {
        beforeEach: function () {
            this.oSetPropertyStub = sinon.stub();
            this.oGetModelStub = sinon.stub();
            this.oGetModelStub.withArgs("viewSettings").returns({setProperty: this.oSetPropertyStub});
            this.oGetViewStub = sinon.stub();
            this.oGetViewStub.returns({getModel: this.oGetModelStub});
            ActionMode.oController = {
                getView: this.oGetViewStub
            };

            this.oEmitStub = sandbox.stub(EventHub, "emit");

            this.oSetTooltipStub = sinon.stub();
            this.oSetTextStub = sinon.stub();
            this.oButtonMock = {
                setTooltip: this.oSetTooltipStub,
                setText: this.oSetTextStub
            };
            this.oByIdStub = sandbox.stub(sap.ui.getCore(), "byId");
            this.oByIdStub.withArgs("ActionModeBtn").returns(this.oButtonMock);

            this.sMockText = "sMockText";
            this.oGetTextStub = sandbox.stub(resources.i18n, "getText");
            this.oGetTextStub.withArgs("PageRuntime.EditMode.Activate").returns(this.sMockText);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode._cleanup();
        //Assert
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/actionModeActive", false], "set property was called with the right parameters");
        assert.deepEqual(this.oEmitStub.getCall(0).args, ["enableMenuBarNavigation", true], "EventHub was called with the right parameters");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");

        assert.strictEqual(this.oSetTooltipStub.getCall(0).args[0], this.sMockText, "setTooltip was called with the right parameters");
        assert.strictEqual(this.oSetTextStub.getCall(0).args[0], this.sMockText, "setText was called with the right parameters");
    });

    QUnit.module("The visualizationAdd function", {
        beforeEach: function () {
            this.oInfoStub = sandbox.stub(Log, "info");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.visualizationAdd();
        //Assert
        assert.strictEqual(this.oInfoStub.callCount, 1, "Log.info was called once");
    });

    QUnit.module("The sectionAdd function", {
        beforeEach: function () {
            this.oInfoStub = sandbox.stub(Log, "info");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.sectionAdd();
        //Assert
        assert.strictEqual(this.oInfoStub.callCount, 1, "Log.info was called once");
    });

    QUnit.module("The sectionDelete function", {
        beforeEach: function () {
            this.oInfoStub = sandbox.stub(Log, "info");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.sectionDelete();
        //Assert
        assert.strictEqual(this.oInfoStub.callCount, 1, "Log.info was called once");
    });

    QUnit.module("The sectionReset function", {
        beforeEach: function () {
            this.oInfoStub = sandbox.stub(Log, "info");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.sectionReset();
        //Assert
        assert.strictEqual(this.oInfoStub.callCount, 1, "Log.info was called once");
    });

    QUnit.module("The sectionTitleChange function", {
        beforeEach: function () {
            this.oInfoStub = sandbox.stub(Log, "info");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.sectionTitleChange();
        //Assert
        assert.strictEqual(this.oInfoStub.callCount, 1, "Log.info was called once");
    });

    QUnit.module("The sectionMove function", {
        beforeEach: function () {
            this.oInfoStub = sandbox.stub(Log, "info");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.sectionMove();
        //Assert
        assert.strictEqual(this.oInfoStub.callCount, 1, "Log.info was called once");
    });

    QUnit.module("The sectionVisibilityChange function", {
        beforeEach: function () {
            this.oInfoStub = sandbox.stub(Log, "info");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.sectionVisibilityChange();
        //Assert
        assert.strictEqual(this.oInfoStub.callCount, 1, "Log.info was called once");
    });
});