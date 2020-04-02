// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

if (window.blanket) {
    blanket.options("sap-ui-cover-only", /DashboardGroupsContainer\.js/);
}

QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/ui/launchpad/DashboardGroupsContainer",
    "sap/ui/core/Control",
    "sap/ui/core/ResizeHandler",
    "sap/ushell/Config",
    "sap/ui/Device"
], function (DashboardGroupsContainer, Control, ResizeHandler, Config, Device) {
    "use strict";

    QUnit.start();
    QUnit.module("The init function", {
        beforeEach: function () {
            var oHandler2 = {
                off: function () {}
            };
            this.oDoStub = sinon.stub().returns(oHandler2);

            var oHandler = {
                do: this.oDoStub
            };

            this.oRegisterStub = sinon.stub(ResizeHandler, "register");
            this.oGetElementStub = sinon.stub(DashboardGroupsContainer.prototype, "_getDynamicStyleElement");
            this.oConfigOnStub = sinon.stub(Config, "on").returns(oHandler);
            this.oConfigLastStub = sinon.stub(Config, "last");
            this.oHasRangeSetStub = sinon.stub(Device.media, "hasRangeSet");
            this.oInitRangeSetStub = sinon.stub(Device.media, "initRangeSet");
        },
        afterEach: function () {
            this.oRegisterStub.restore();
            this.oGetElementStub.restore();
            this.oConfigOnStub.restore();
            this.oConfigLastStub.restore();
            this.oHasRangeSetStub.restore();
            this.oInitRangeSetStub.restore();
        }
    });

    QUnit.test("Calls the function _getDynamicStyleElement", function (assert) {
        // Arrange
        // Act
        var oControl = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(this.oGetElementStub.callCount, 1, "The function _getDynamicStyleElement has been called once.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Calls the function ResizeHandler.register", function (assert) {
        // Arrange
        // Act
        var oControl = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(this.oRegisterStub.callCount, 1, "The function ResizeHandler.register has been called once.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Initializes internal fields", function (assert) {
        // Arrange
        // Act
        var oControl = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(oControl._iContainerWidth, null, "The field _iContainerWidth has been assigned the correct value.");
        assert.strictEqual(oControl._oTileDimensions, null, "The field _oTileDimensions has been assigned the correct value.");
        assert.strictEqual(oControl._bRangeSetSmall, false, "The field _bRangeSetSmall has been assigned the correct value.");
        assert.strictEqual(oControl.getProperty("_gridEnabled"), false, "The field _bGridEnabled has been assigned the correct value.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Initializes property _gridEnabled with grid enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.returns(true);

        // Act
        var oControl = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(oControl.getProperty("_gridEnabled"), true, "The property _gridEnabled has been assigned the correct value.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Initializes property _gridEnabled with grid disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.returns(false);

        // Act
        var oControl = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(oControl.getProperty("_gridEnabled"), false, "The field _gridEnabled has been assigned the correct value.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Initializes property _gridEnabled with grid undefined", function (assert) {
        // Arrange
        this.oConfigLastStub.returns(undefined);

        // Act
        var oControl = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(oControl.getProperty("_gridEnabled"), false, "The field _gridEnabled has been assigned the correct value.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Reacts to the config change of sizeBehavior", function (assert) {
        // Arrange
        // Act
        var oControl = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(this.oConfigOnStub.callCount, 1, "The function Config.on has been called once.");
        assert.strictEqual(this.oConfigOnStub.firstCall.args[0], "/core/home/sizeBehavior", "The function Config.on has been called with the correct parameter.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Attaches a config handler for sizeBehavior", function (assert) {
        // Arrange
        // Act
        var oControl = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(this.oDoStub.callCount, 1, "The function Doable.do has been called once.");
        assert.strictEqual(this.oDoStub.args.length, 1, "The function Config.on has been called with one parameter.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Attaches a config handler for sizeBehavior that updates the _sSizeBehavior internal field", function (assert) {
        // Arrange
        var oControl = new DashboardGroupsContainer();
        var fnCallback = this.oDoStub.firstCall.args[0];

        // Act
        fnCallback("Bla");

        // Assert
        assert.strictEqual(oControl._sSizeBehavior, "Bla", "The correct value has been found.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Attaches a config handler for sizeBehavior that calls the function _updateTileContainer", function (assert) {
        // Arrange
        var oUpdateTileContainerStub = sinon.stub(DashboardGroupsContainer.prototype, "_updateTileContainer");
        var oControl = new DashboardGroupsContainer();
        var fnCallback = this.oDoStub.firstCall.args[0];

        // Act
        fnCallback();

        // Assert
        assert.strictEqual(oUpdateTileContainerStub.callCount, 1, "The function _updateTileContainer has been called once.");
        assert.strictEqual(oUpdateTileContainerStub.firstCall.args[0], true, "The function _updateTileContainer has been called with the correct parameter.");
        assert.strictEqual(oUpdateTileContainerStub.firstCall.thisValue, oControl, "The function _updateTileContainer has been called with the correct context.");

        // Cleanup
        oControl.destroy();
        oUpdateTileContainerStub.restore();
    });

    QUnit.test("Initializes the sap.ui.Device range set with the correct name if it has not yet been initialized", function (assert) {
        // Arrange
        this.oHasRangeSetStub.returns(false);

        // Act
        var oControl = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(this.oHasRangeSetStub.callCount, 1, "The function Device.media.hasRangeSet has been called once.");
        assert.strictEqual(this.oHasRangeSetStub.firstCall.args[0], "UShellTileDeviceSet", "The function Device.media.hasRangeSet has been called with the correct parameter.");
        assert.strictEqual(this.oInitRangeSetStub.callCount, 1, "The function Device.media.initRangeSet has been called once.");
        assert.strictEqual(this.oInitRangeSetStub.firstCall.args[0], "UShellTileDeviceSet", "The function Device.media.initRangeSet has been called with the correct parameter.");
        assert.deepEqual(this.oInitRangeSetStub.firstCall.args[1], [ 374 ], "The function Device.media.initRangeSet has been called with the correct parameter.");
        assert.strictEqual(this.oInitRangeSetStub.firstCall.args[2], "px", "The function Device.media.initRangeSet has been called with the correct parameter.");
        assert.deepEqual(this.oInitRangeSetStub.firstCall.args[3], [ "Small", "Responsive" ], "The function Device.media.initRangeSet has been called with the correct parameter.");
        assert.strictEqual(this.oInitRangeSetStub.firstCall.args[4], true, "The function Device.media.initRangeSet has been called with the correct parameter.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.test("Does not initialize the sap.ui.Device range set if it has already been initialized", function (assert) {
        // Arrange
        this.oHasRangeSetStub.returns(true);

        // Act
        var oControl = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(this.oHasRangeSetStub.callCount, 1, "The function Device.media.hasRangeSet has been called once.");
        assert.strictEqual(this.oHasRangeSetStub.firstCall.args[0], "UShellTileDeviceSet", "The function Device.media.hasRangeSet has been called with the correct parameter.");
        assert.strictEqual(this.oInitRangeSetStub.callCount, 0, "The function Device.media.initRangeSet has not been called.");

        // Cleanup
        oControl.destroy();
    });

    QUnit.module("Control initialization core and theme checks", {
        beforeEach: function () {
            this.oStubIsInitialized = sinon.stub(sap.ui.getCore(), "isInitialized");
            this.oSpyAttachInit = sinon.spy(sap.ui.getCore(), "attachInit");
            this.oSpyHandleCoreInitialized = sinon.spy(DashboardGroupsContainer.prototype, "_handleCoreInitialized");
            this.oStubThemeApplied = sinon.stub(sap.ui.getCore(), "isThemeApplied");
            this.oStubAttachThemeApplied = sinon.stub(sap.ui.getCore(), "attachThemeChanged").callsFake(function (fn, context) {
                fn.call(context); //simulate immediate theme change
            });
            this.oSpyHandleThemeApplied = sinon.spy(DashboardGroupsContainer.prototype, "_handleThemeApplied");
        },
        afterEach: function () {
            this.oStubIsInitialized.restore();
            this.oSpyAttachInit.restore();
            this.oSpyHandleCoreInitialized.restore();
            this.oStubThemeApplied.restore();
            this.oStubAttachThemeApplied.restore();
            this.oSpyHandleThemeApplied.restore();
        }
    });

    QUnit.test("Core initialization check - no core, no theme", function (assert) {
        // Arrange
        this.oStubIsInitialized.returns(false);
        this.oStubThemeApplied.returns(false);

        // Act
        var oContainer = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(this.oSpyAttachInit.callCount, 1, "Method Core.attachInit has been called once.");
        assert.strictEqual(this.oSpyHandleCoreInitialized.callCount, 1, "Method _handleCoreInitialized has been called once.");
        assert.strictEqual(this.oStubAttachThemeApplied.callCount, 1, "Method Core.attachThemeChanged has been called once.");
        assert.strictEqual(this.oSpyHandleThemeApplied.callCount, 1, "Method _handleThemeApplied has been called once.");

        // Cleanup
        oContainer.destroy();
    });

    QUnit.test("Core initialization check - no core, but theme", function (assert) {
        // Arrange
        this.oStubIsInitialized.returns(false);
        this.oStubThemeApplied.returns(true);

        // Act
        var oContainer = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(this.oSpyAttachInit.callCount, 1, "Method Core.attachInit has been called once.");
        assert.strictEqual(this.oSpyHandleCoreInitialized.callCount, 1, "Method _handleCoreInitialized has been called once.");
        assert.strictEqual(this.oStubAttachThemeApplied.callCount, 1, "Method Core.attachThemeChanged has been called once.");
        assert.strictEqual(this.oSpyHandleThemeApplied.callCount, 1, "Method _handleThemeApplied has been called once.");

        // Cleanup
        oContainer.destroy();
    });

    QUnit.test("Core initialization check - core, but no theme", function (assert) {
        // Arrange
        this.oStubIsInitialized.returns(true);
        this.oStubThemeApplied.returns(false);

        // Act
        var oContainer = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(this.oSpyAttachInit.callCount, 0, "Method Core.attachInit has not been called.");
        assert.strictEqual(this.oSpyHandleCoreInitialized.callCount, 1, "Method _handleCoreInitialized has been called once.");
        assert.strictEqual(this.oStubAttachThemeApplied.callCount, 1, "Method Core.attachThemeChanged has been called once.");
        assert.strictEqual(this.oSpyHandleThemeApplied.callCount, 1, "Method _handleThemeApplied has been called once.");

        // Cleanup
        oContainer.destroy();
    });

    QUnit.test("Core initialization check - core and theme", function (assert) {
        // Arrange
        this.oStubIsInitialized.returns(true);
        this.oStubThemeApplied.returns(true);

        // Act
        var oContainer = new DashboardGroupsContainer();

        // Assert
        assert.strictEqual(this.oSpyAttachInit.callCount, 0, "Method Core.attachInit has not been called.");
        assert.strictEqual(this.oSpyHandleCoreInitialized.callCount, 1, "Method _handleCoreInitialized has been called once.");
        assert.strictEqual(this.oStubAttachThemeApplied.callCount, 1, "Method Core.attachThemeChanged has been called once.");
        assert.strictEqual(this.oSpyHandleThemeApplied.callCount, 1, "Method _handleThemeApplied has been called once.");

        // Cleanup
        oContainer.destroy();
    });

    QUnit.module("The _handleThemeApplied function", {
        beforeEach: function () {
            this.oUpdateStub = sinon.stub(DashboardGroupsContainer.prototype, "_updateTileContainer");
        },
        afterEach: function () {
            this.oUpdateStub.restore();
        }
    });

    QUnit.test("Detaches the _handleThemeApplied function from the core's themeApplied event", function (assert) {
        // Arrange
        var oDetachSpy = sinon.spy(sap.ui.getCore(), "detachThemeChanged");
        var oContainer = new DashboardGroupsContainer();

        // Act
        oContainer._handleThemeApplied();

        // Assert
        assert.strictEqual(oDetachSpy.callCount, 1, "The function detachThemeChanged has been called once.");

        // Cleanup
        oContainer.destroy();
    });

    QUnit.test("Calls the function _updateTileContainer", function (assert) {
        // Arrange
        var oContainer = new DashboardGroupsContainer();

        // Act
        oContainer._handleThemeApplied();

        // Assert
        assert.strictEqual(this.oUpdateStub.callCount, 1, "The function _updateTileContainer has been called once.");
        assert.strictEqual(this.oUpdateStub.firstCall.args[0], true, "The function _updateTileContainer has been called with the correct parameter.");

        // Cleanup
        oContainer.destroy();
    });

    QUnit.module("The exit function", {
        beforeEach: function () {
            this.oOffStub = sinon.stub();

            this.oInstance = {
                _oConfigChange: {
                    off: this.oOffStub
                }
            };

            this.oDetachStub = sinon.stub(Device.media, "detachHandler");
        },
        afterEach: function () {
            this.oInstance = null;

            this.oDetachStub.restore();
        }
    });

    QUnit.test("Removes the style element if it exists", function (assert) {
        // Arrange
        var oStyleElement = {};
        this.oInstance._oStyleElement = oStyleElement;
        var oRemoveStub = sinon.stub(document.head, "removeChild");

        // Act
        DashboardGroupsContainer.prototype.exit.apply(this.oInstance);

        // Assert
        assert.strictEqual(oRemoveStub.callCount, 1, "The function removeChild has been called once.");
        assert.strictEqual(oRemoveStub.firstCall.args[0], oStyleElement, "The function removeChild has been called with the correct parameter.");

        // Cleanup
        oRemoveStub.restore();
    });

    QUnit.test("Deletes the internal field _oStyleElement from the instanc", function (assert) {
        // Arrange
        this.oInstance._oStyleElement = null;

        // Act
        DashboardGroupsContainer.prototype.exit.apply(this.oInstance);

        // Assert
        assert.strictEqual(this.oInstance.hasOwnProperty("_oStyleElement"), false, "The property has not been found.");
    });

    QUnit.test("Calls the off function of the Config.on doable", function (assert) {
        // Arrange
        // Act
        DashboardGroupsContainer.prototype.exit.apply(this.oInstance);

        // Assert
        assert.strictEqual(this.oOffStub.callCount, 1, "The function Doable.off has been called once.");
    });

    QUnit.test("Detaches the range set handler from Device.media", function (assert) {
        // Arrange
        var oHandleMediaChange = {};
        this.oInstance._handleMediaChange = oHandleMediaChange;

        // Act
        DashboardGroupsContainer.prototype.exit.apply(this.oInstance);

        // Assert
        assert.strictEqual(this.oDetachStub.callCount, 1, "The function detachHandler has been called once.");
        assert.strictEqual(this.oDetachStub.firstCall.args[0], oHandleMediaChange, "The function detachHandler has been called with the correct parameter.");
        assert.strictEqual(this.oDetachStub.firstCall.args[1], this.oInstance, "The function detachHandler has been called with the correct parameter.");
        assert.strictEqual(this.oDetachStub.firstCall.args[2], "UShellTileDeviceSet", "The function detachHandler has been called with the correct parameter.");
    });

    QUnit.test("Calls the exit function of sap.ui.core.Control", function (assert) {
        // Arrange
        var oExitStub = sinon.stub(Control.prototype, "exit");

        // Act
        DashboardGroupsContainer.prototype.exit.apply(this.oInstance);

        // Assert
        assert.strictEqual(oExitStub.callCount, 1, "The function Control.exit has been called once.");
        assert.strictEqual(oExitStub.firstCall.thisValue, this.oInstance, "The function Control.exit has been called with the correct context.");
    });

    QUnit.module("The function _handleResize", {
        beforeEach: function () {
            this.oControl = new DashboardGroupsContainer();
            this.oUpdateStub = sinon.stub(this.oControl, "_updateTileContainer");
        },
        afterEach: function () {
            this.oControl.destroy();
            this.oControl = null;
        }
    });

    QUnit.test("Calls the function _updateTileContainer", function (assert) {
        // Arrange
        var oEvent = {
            size: {
                width: 1
            },
            oldSize: {
                width: 2
            }
        };

        // Act
        this.oControl._handleResize(oEvent);

        // Assert
        assert.strictEqual(this.oUpdateStub.callCount, 1, "The function _updateTileContainer has been called once.");
    });

    QUnit.test("Does not call the function _updateTileContainer if the width did not change", function (assert) {
        // Arrange
        var oEvent = {
            size: {
                width: 1
            },
            oldSize: {
                width: 1
            }
        };

        // Act
        this.oControl._handleResize(oEvent);

        // Assert
        assert.strictEqual(this.oUpdateStub.callCount, 0, "The function _updateTileContainer has not been called.");
    });

    QUnit.test("Does not call the function _updateTileContainer if the current width is 0", function (assert) {
        // Arrange
        var oEvent = {
            size: {
                width: 0
            },
            oldSize: {
                width: 200
            }
        };

        // Act
        this.oControl._handleResize(oEvent);

        // Assert
        assert.strictEqual(this.oUpdateStub.callCount, 0, "The function _updateTileContainer has not been called.");
    });

    QUnit.module("The function _updateTileContainer", {
        beforeEach: function () {
            this.oControl = new DashboardGroupsContainer();

            this.oTileContainerContent = {};
            this.oGetInnerContainerStub = sinon.stub(this.oControl, "_getInnerTileContainer").returns(this.oTileContainerContent);
            this.oUpdateStub = sinon.stub(this.oControl, "_updateTileContainerWidth");
            this.oGetPropertyStub = sinon.stub(this.oControl, "getProperty").returns(false);
        },
        afterEach: function () {
            this.oControl.destroy();
            this.oControl = null;
            this.oGetPropertyStub.restore();
            this.oTileContainerContent = null;
        }
    });

    QUnit.test("Does not call _updateTileContainerWidth if no inner container can be found", function (assert) {
        // Arrange
        this.oGetInnerContainerStub.returns();

        // Act
        this.oControl._updateTileContainer();

        // Assert
        assert.strictEqual(this.oGetInnerContainerStub.callCount, 1, "The function _getInnerTileContainer has been called once.");
        assert.strictEqual(this.oUpdateStub.callCount, 0, "The function _updateTileContainerWidth has not been called.");
    });

    QUnit.test("Does not call _updateTileContainerWidth if no change is detected", function (assert) {
        // Arrange
        sinon.stub(this.oControl, "_getTileDimensions").returns({
            width: 100,
            marginEnd: 5
        });
        sinon.stub(this.oControl, "_getElementDimensions").returns({
            width: 105,
            marginEnd: 0
        });
        this.oControl._iContainerWidth = 100;

        // Act
        this.oControl._updateTileContainer();

        // Assert
        assert.strictEqual(this.oUpdateStub.callCount, 0, "The function _updateTileContainerWidth has not been called.");
    });

    QUnit.test("Calls the function _updateTileContainerWidth if the number of maximum tiles changes", function (assert) {
        // Arrange
        sinon.stub(this.oControl, "_getTileDimensions").returns({
            width: 100,
            marginEnd: 5
        });
        var oGetElementDimensionsStub = sinon.stub(this.oControl, "_getElementDimensions").returns({
            width: 105, // Leads to 1 tile being able to fit
            marginEnd: 0
        });
        this.oControl._iContainerWidth = 0;

        // Act
        this.oControl._updateTileContainer();

        // Assert
        assert.strictEqual(this.oUpdateStub.callCount, 1, "The function _updateTileContainerWidth has been called once.");
        assert.strictEqual(oGetElementDimensionsStub.callCount, 1, "The function _getElementDimensions has been called once.");
        assert.strictEqual(oGetElementDimensionsStub.firstCall.args[0], this.oTileContainerContent, "The function _getElementDimensions has been called with the correct parameter.");
    });

    QUnit.test("Updates the internal field _iContainerWidth if the width of the link container changes", function (assert) {
        // Arrange
        sinon.stub(this.oControl, "_getTileDimensions").returns({
            width: 100,
            marginEnd: 5
        });
        sinon.stub(this.oControl, "_getElementDimensions").returns({
            width: 105, // Leads to 1 tile being able to fit
            marginEnd: 0
        });
        this.oControl._iContainerWidth = 0;

        // Act
        this.oControl._updateTileContainer();

        // Assert
        assert.strictEqual(this.oControl._iContainerWidth, 100, "The correct value has been found.");
    });

    QUnit.test("Uses the small tile size behavior if the internal field _sSizeBehavior is correctly set", function (assert) {
        // Arrange
        var oGetDimensionsStub = sinon.stub(this.oControl, "_getTileDimensions").returns({});
        sinon.stub(this.oControl, "_getElementDimensions").returns({});
        this.oControl._sSizeBehavior = "Small";

        // Act
        this.oControl._updateTileContainer();

        // Assert
        assert.strictEqual(oGetDimensionsStub.callCount, 1, "The function _getTileDimensions has been called once.");
        assert.strictEqual(oGetDimensionsStub.firstCall.args[0], true, "The function _getTileDimensions has been called with the correct parameter.");
    });

    QUnit.test("Uses the normal tile size behavior if the internal field _sSizeBehavior is not set", function (assert) {
        // Arrange
        var oGetDimensionsStub = sinon.stub(this.oControl, "_getTileDimensions").returns({});
        sinon.stub(this.oControl, "_getElementDimensions").returns({});
        this.oControl._sSizeBehavior = "";

        // Act
        this.oControl._updateTileContainer();

        // Assert
        assert.strictEqual(oGetDimensionsStub.callCount, 1, "The function _getTileDimensions has been called once.");
        assert.strictEqual(oGetDimensionsStub.firstCall.args[0], false, "The function _getTileDimensions has been called with the correct parameter.");
    });

    QUnit.test("Uses the small tile size behavior if the internal field _bRangeSetSmall is true", function (assert) {
        // Arrange
        var oGetDimensionsStub = sinon.stub(this.oControl, "_getTileDimensions").returns({});
        sinon.stub(this.oControl, "_getElementDimensions").returns({});
        this.oControl._bRangeSetSmall = true;

        // Act
        this.oControl._updateTileContainer();

        // Assert
        assert.strictEqual(oGetDimensionsStub.callCount, 1, "The function _getTileDimensions has been called once.");
        assert.strictEqual(oGetDimensionsStub.firstCall.args[0], true, "The function _getTileDimensions has been called with the correct parameter.");
    });

    QUnit.test("Uses the normal tile size behavior if the internal field _bRangeSetSmall is false and the internal field _sSizeBehavior is not set", function (assert) {
        // Arrange
        var oGetDimensionsStub = sinon.stub(this.oControl, "_getTileDimensions").returns({});
        sinon.stub(this.oControl, "_getElementDimensions").returns({});
        this.oControl._bRangeSetSmall = false;
        this.oControl._sSizeBehavior = "";

        // Act
        this.oControl._updateTileContainer();

        // Assert
        assert.strictEqual(oGetDimensionsStub.callCount, 1, "The function _getTileDimensions has been called once.");
        assert.strictEqual(oGetDimensionsStub.firstCall.args[0], false, "The function _getTileDimensions has been called with the correct parameter.");
    });

    QUnit.test("Calls the function _getTileDimensions with the refresh flag that is passed to it", function (assert) {
        // Arrange
        var oGetDimensionsStub = sinon.stub(this.oControl, "_getTileDimensions").returns({});
        sinon.stub(this.oControl, "_getElementDimensions").returns({});
        var oParamValue = {};

        // Act
        this.oControl._updateTileContainer(oParamValue);

        // Assert
        assert.strictEqual(oGetDimensionsStub.callCount, 1, "The function _getTileDimensions has been called once.");
        assert.strictEqual(oGetDimensionsStub.firstCall.args[0], false, "The function _getTileDimensions has been called with the correct parameter.");
        assert.strictEqual(oGetDimensionsStub.firstCall.args[1], oParamValue, "The function _getTileDimensions has been called with the correct parameter.");
    });

    QUnit.test("Calls the function getGroups with the property _gridEnabled is true", function (assert) {
        // Arrange
        var oGetGroupsStub = sinon.stub(this.oControl, "getGroups").returns({});
        this.oGetPropertyStub.returns(true);
        sinon.stub(this.oControl, "_getElementDimensions").returns({});
        var oParamValue = {};

        // Act
        this.oControl._updateTileContainer(oParamValue);

        // Assert
        assert.strictEqual(this.oGetPropertyStub.callCount, 1, "The function _getProperty has been called once.");
        assert.strictEqual(this.oGetPropertyStub.firstCall.args[0], "_gridEnabled", "The function _getProperty has been called with the correct parameter.");
        assert.strictEqual(oGetGroupsStub.callCount, 1, "The function _getTileDimensions has been called with the correct parameter.");
    });

    QUnit.test("Calls the function getActiveGapSize, getTileSizeBehavior, hasListeners and getMaximumItemNumber", function (assert) {
        // Arrange
        var oGetActiveSizeStub = sinon.stub();
        var oGettMaximumItemNumberStub = sinon.stub();
        var oGetTileSizeBehaviorStub = sinon.stub();
        var oHasListenersStub = sinon.stub().returns(true);
        var aGroups = [
            {
                hasListeners: oHasListenersStub,
                getActiveGapSize: oGetActiveSizeStub,
                getMaximumItemNumber: oGettMaximumItemNumberStub,
                getTileSizeBehavior: oGetTileSizeBehaviorStub
            },
            {
                hasListeners: oHasListenersStub,
                getActiveGapSize: oGetActiveSizeStub,
                getMaximumItemNumber: oGettMaximumItemNumberStub,
                getTileSizeBehavior: oGetTileSizeBehaviorStub
            }
        ];
        sinon.stub(this.oControl, "getGroups").returns(aGroups);
        sinon.stub(this.oControl, "_getElementDimensions").returns({});
        this.oGetPropertyStub.returns(true);
        var oParamValue = {};

        // Act
        this.oControl._updateTileContainer(oParamValue);

        // Assert
        assert.strictEqual(oGetTileSizeBehaviorStub.callCount, 1, "The function getTileSizeBehavior has been called once.");
        assert.strictEqual(oGetActiveSizeStub.callCount, 1, "The function getActiveGapSize has been called once.");
        assert.strictEqual(oGettMaximumItemNumberStub.callCount, 1, "The function getMaximumItemNumber has been called once.");
    });

    QUnit.test("Sets the property tileSizeBehavior of the gridContainer when it is not equal to the current tileSizeBehavior", function (assert) {
        // Arrange
        var oGetActiveSizeStub = sinon.stub();
        var oGettMaximumItemNumberStub = sinon.stub();
        var oGetTileSizeBehaviorStub = sinon.stub().returns("Responsive");
        var oSetTileSizeBehaviorStub = sinon.stub();
        var oHasListenersStub = sinon.stub().returns(true);

        var aGroups = [{
                hasListeners: oHasListenersStub,
                getActiveGapSize: oGetActiveSizeStub,
                getMaximumItemNumber: oGettMaximumItemNumberStub,
                getTileSizeBehavior: oGetTileSizeBehaviorStub,
                setTileSizeBehavior: oSetTileSizeBehaviorStub
            },
            {
                hasListeners: oHasListenersStub,
                getActiveGapSize: oGetActiveSizeStub,
                getMaximumItemNumber: oGettMaximumItemNumberStub,
                getTileSizeBehavior: oGetTileSizeBehaviorStub,
                setTileSizeBehavior: oSetTileSizeBehaviorStub
            }
        ];
        sinon.stub(this.oControl, "getGroups").returns(aGroups);
        sinon.stub(this.oControl, "_getElementDimensions").returns({});
        this.oControl._sSizeBehavior = "Small";
        this.oGetPropertyStub.returns(true);
        var oParamValue = {};

        // Act
        this.oControl._updateTileContainer(oParamValue);

        // Assert
        assert.strictEqual(oSetTileSizeBehaviorStub.callCount, 1, "The function getTileSizeBehavior has been called once.");
        assert.strictEqual(oSetTileSizeBehaviorStub.firstCall.args[0], "Small", "The function setTileSizeBehavior has been called with the correct parameter.");
    });


    QUnit.test("Attaches an event listener to layoutChange when there is no listener", function (assert) {
        // Arrange
        var oGetActiveSizeStub = sinon.stub();
        var oGettMaximumItemNumberStub = sinon.stub();
        var oGetTileSizeBehaviorStub = sinon.stub().returns("Responsive");
        var oSetTileSizeBehaviorStub = sinon.stub();
        var oHasListenersStub = sinon.stub().returns(false);
        var oAttachEventStub = sinon.stub();

        var aGroups = [{
                hasListeners: oHasListenersStub,
                getActiveGapSize: oGetActiveSizeStub,
                getMaximumItemNumber: oGettMaximumItemNumberStub,
                getTileSizeBehavior: oGetTileSizeBehaviorStub,
                setTileSizeBehavior: oSetTileSizeBehaviorStub,
                attachEvent: oAttachEventStub
            },
            {
                hasListeners: oHasListenersStub,
                getActiveGapSize: oGetActiveSizeStub,
                getMaximumItemNumber: oGettMaximumItemNumberStub,
                getTileSizeBehavior: oGetTileSizeBehaviorStub,
                setTileSizeBehavior: oSetTileSizeBehaviorStub,
                attachEvent: oAttachEventStub
            }
        ];
        sinon.stub(this.oControl, "getGroups").returns(aGroups);
        sinon.stub(this.oControl, "_getElementDimensions").returns({});
        this.oControl._sSizeBehavior = "Small";
        this.oGetPropertyStub.returns(true);
        var oParamValue = {};

        // Act
        this.oControl._updateTileContainer(oParamValue);

        // Assert
        assert.strictEqual(oAttachEventStub.callCount, 1, "The function attachEvent has been called once.");
        assert.strictEqual(oAttachEventStub.firstCall.args[0], "layoutChange", "The function attachEvent has been called with the correct parameter.");
        assert.equal(typeof oAttachEventStub.firstCall.args[1], "function", "The function attachEvent has been called with the correct parameter.");
    });

    QUnit.test("Does not attach an event listener to layoutChange when there is a listener", function (assert) {
        // Arrange
        var oGetActiveSizeStub = sinon.stub();
        var oGettMaximumItemNumberStub = sinon.stub();
        var oGetTileSizeBehaviorStub = sinon.stub().returns("Responsive");
        var oSetTileSizeBehaviorStub = sinon.stub();
        var oHasListenersStub = sinon.stub().returns(true);
        var oAttachEventStub = sinon.stub();

        var aGroups = [{
                hasListeners: oHasListenersStub,
                getActiveGapSize: oGetActiveSizeStub,
                getMaximumItemNumber: oGettMaximumItemNumberStub,
                getTileSizeBehavior: oGetTileSizeBehaviorStub,
                setTileSizeBehavior: oSetTileSizeBehaviorStub,
                attachEvent: oAttachEventStub
            },
            {
                hasListeners: oHasListenersStub,
                getActiveGapSize: oGetActiveSizeStub,
                getMaximumItemNumber: oGettMaximumItemNumberStub,
                getTileSizeBehavior: oGetTileSizeBehaviorStub,
                setTileSizeBehavior: oSetTileSizeBehaviorStub,
                attachEvent: oAttachEventStub
            }
        ];
        sinon.stub(this.oControl, "getGroups").returns(aGroups);
        sinon.stub(this.oControl, "_getElementDimensions").returns({});
        this.oControl._sSizeBehavior = "Small";
        this.oGetPropertyStub.returns(true);
        var oParamValue = {};

        // Act
        this.oControl._updateTileContainer(oParamValue);

        // Assert
        assert.strictEqual(oAttachEventStub.callCount, 0, "The function attachEvent has not been called.");
    });

    QUnit.module("The function _getInnerTileContainer", {
        beforeEach: function () {
            this.oControl = new DashboardGroupsContainer();

            this.oInnerContainer = {};
            this.oQuerySelectorStub = sinon.stub().returns(this.oInnerContainer);
            this.oTileContainerContent = {
                querySelector: this.oQuerySelectorStub
            };
            this.oQuerySelectorAllStub = sinon.stub().returns([ this.oTileContainerContent ]);
            this.oDomRef = {
                querySelectorAll: this.oQuerySelectorAllStub
            };
            this.oGetDomRefStub = sinon.stub(this.oControl, "getDomRef").returns(this.oDomRef);
        },
        afterEach: function () {
            this.oControl.destroy();
            this.oControl = null;

            this.oDomRef = null;
            this.oInnerContainer = null;
            this.oTileContainerContent = null;
        }
    });

    QUnit.test("Returns null if no DOM reference is found", function (assert) {
        // Arrange
        this.oGetDomRefStub.returns();

        // Act
        var oResult = this.oControl._getInnerTileContainer();

        // Assert
        assert.strictEqual(oResult, null, "The correct value has been returned.");
    });

    QUnit.test("Returns null if no tile container content element is found", function (assert) {
        // Arrange
        this.oQuerySelectorAllStub.returns([]);

        // Act
        var oResult = this.oControl._getInnerTileContainer();

        // Assert
        assert.strictEqual(this.oQuerySelectorAllStub.callCount, 1, "The function querySelectorAll has been called once.");
        assert.strictEqual(this.oQuerySelectorAllStub.firstCall.args[0], ".sapUshellTileContainerContent", "The function querySelectorAll has been called with the correct parameter.");
        assert.strictEqual(oResult, null, "The correct value has been returned.");
    });

    QUnit.test("Returns null if all found tile container content elements' parents have the class sapUshellHidden", function (assert) {
        // Arrange
        var oContainsStub = sinon.stub().returns(true);
        this.oTileContainerContent.parentElement = {
            classList: {
                contains: oContainsStub
            }
        };

        // Act
        var oResult = this.oControl._getInnerTileContainer();

        // Assert
        assert.strictEqual(oContainsStub.callCount, 1, "The classList's contains function has been called once.");
        assert.strictEqual(oContainsStub.firstCall.args[0], "sapUshellHidden", "The classList's contains function has been called with the correct parameter.");
        assert.strictEqual(oResult, null, "The correct value has been returned.");
    });

    QUnit.test("Returns the inner container DOM element", function (assert) {
        // Arrange
        this.oTileContainerContent.parentElement = {
            classList: {
                contains: function () {
                    return false;
                }
            }
        };

        // Act
        var oResult = this.oControl._getInnerTileContainer();

        // Assert
        assert.strictEqual(this.oQuerySelectorStub.callCount, 1, "The function querySelector has been called once.");
        assert.strictEqual(this.oQuerySelectorStub.firstCall.args[0], ".sapUshellInner", "The function querySelector has been called with the correct parameter.");
        assert.strictEqual(oResult, this.oInnerContainer, "The correct reference has been returned.");
    });

    QUnit.module("The function _getDynamicStyleElement");

    QUnit.test("Returns the instance of _oStyleElement if it exists", function (assert) {
        // Arrange
        var oStyleElement = {};
        var oControl = {
            _oStyleElement: oStyleElement
        };

        // Act
        var oResult = DashboardGroupsContainer.prototype._getDynamicStyleElement.apply(oControl);

        // Assert
        assert.strictEqual(oResult, oStyleElement, "The correct value has been found.");
    });

    QUnit.test("Returns a new instance of _oStyleElement if none exists yet", function (assert) {
        // Arrange
        var oControl = new DashboardGroupsContainer();

        // Act
        var oResult = oControl._getDynamicStyleElement();

        // Assert
        assert.strictEqual(oResult, oControl._oStyleElement, "The correct value has been found.");
        assert.ok(oResult instanceof HTMLElement, "The returned object is an HTMLElement");

        // Cleanup
        oControl.destroy();
    });

    QUnit.module("The function _updateTileContainerWidth", {
        beforeEach: function () {
            this.oControl = new DashboardGroupsContainer();
        },
        afterEach: function () {
            this.oControl.destroy();
            this.oControl = null;
        }
    });

    QUnit.test("Updates the innerHTML content of the style element", function (assert) {
        // Arrange
        var oDynamicStyleElement = {};
        var oGetStyleElementStub = sinon.stub(this.oControl, "_getDynamicStyleElement").returns(oDynamicStyleElement);
        var iSize = 666;

        // Act
        this.oControl._updateTileContainerWidth(iSize);

        // Assert
        assert.strictEqual(oGetStyleElementStub.callCount, 1, "The function _getDynamicStyleElement has been called once.");
        assert.strictEqual(oDynamicStyleElement.innerHTML, ".sapUshellLineModeContainer, .sapUshellLinksContainer { width: 666px; }", "The correct value has been found.");
    });

    QUnit.module("The function _getTileDimensions", {
        beforeEach: function () {
            this.oControl = new DashboardGroupsContainer();
        },
        afterEach: function () {
            this.oControl.destroy();
            this.oControl = null;
        }
    });

    QUnit.test("Returns cached tile dimensions if they exist", function (assert) {
        // Arrange
        var oTileDimensions = {};
        this.oControl._oTileDimensions = oTileDimensions;

        // Act
        var oResult = this.oControl._getTileDimensions();

        // Assert
        assert.strictEqual(oResult, oTileDimensions, "The correct value has been found.");
    });

    QUnit.test("Returns new tile dimensions if they exist, but refresh is required", function (assert) {
        // Arrange
        var oElementDimensions = {};
        var oTileDimensions = {};
        this.oControl._oTileDimensions = oTileDimensions;
        var oGetDimensionsStub = sinon.stub(this.oControl, "_getElementDimensions").returns(oElementDimensions);

        // Act
        var oResult = this.oControl._getTileDimensions(false, true);

        // Assert
        assert.deepEqual(oResult, oElementDimensions, "The correct value has been found.");
        assert.deepEqual(this.oControl._oTileDimensions, oElementDimensions, "The correct value has been found.");
    });

    QUnit.test("Adds the correct style classes to the new element to be measured", function (assert) {
        // Arrange
        var oGetDimensionsStub = sinon.stub(this.oControl, "_getElementDimensions");

        // Act
        this.oControl._getTileDimensions();

        // Assert
        assert.deepEqual(oGetDimensionsStub.callCount, 1, "The function _getElementDimensions has been called once.");

        var oTileElement = oGetDimensionsStub.firstCall.args[0];
        assert.ok(oTileElement instanceof HTMLElement, "The measured element has been an instance of HTMLElement.");
        assert.strictEqual(oTileElement.classList.length, 1, "The correct number of style classes of the created HTMLElement has been found.");
        assert.strictEqual(oTileElement.classList[0], "sapUshellTile", "The correct style class of the created HTMLElement has been found.");
        assert.strictEqual(oTileElement.style.visibility, "hidden", "The correct visibility style of the created HTMLElement has been found.");
    });

    QUnit.test("Adds the correct style class to the new element to be measured if the small flag is passed", function (assert) {
        // Arrange
        var oGetDimensionsStub = sinon.stub(this.oControl, "_getElementDimensions");

        // Act
        this.oControl._getTileDimensions(true);

        // Assert
        var oTileElement = oGetDimensionsStub.firstCall.args[0];
        assert.strictEqual(oTileElement.classList.length, 2, "The correct number of style classes of the created HTMLElement has been found.");
        assert.strictEqual(oTileElement.classList[0], "sapUshellTile", "The correct style class of the created HTMLElement has been found.");
        assert.strictEqual(oTileElement.classList[1], "sapUshellSmall", "The correct style class of the created HTMLElement has been found.");
    });

    QUnit.module("The function _getElementDimensions", {
        beforeEach: function () {
            this.oGetComputedStyleStub = sinon.stub(window, "getComputedStyle").returns({});
            this.oGetRTLStub = sinon.stub(sap.ui.getCore().getConfiguration(), "getRTL");

            this.oControl = new DashboardGroupsContainer();
        },
        afterEach: function () {
            this.oControl.destroy();
            this.oControl = null;

            this.oGetComputedStyleStub.restore();
            this.oGetRTLStub.restore();
        }
    });

    QUnit.test("Returns an object with the correct properties in LTR mode", function (assert) {
        // Arrange
        var oStyle = {
            width: "666.66px",
            marginRight: "20.20px"
        };
        this.oGetRTLStub.returns(false);
        this.oGetComputedStyleStub.returns(oStyle);

        // Act
        var oResult = this.oControl._getElementDimensions();

        // Assert
        assert.deepEqual(oResult, {
            width: 666.66,
            marginEnd: 20.20
        }, "The correct data has been returned.");
    });

    QUnit.test("Returns an object with the correct properties in RTL mode", function (assert) {
        // Arrange
        var oStyle = {
            width: "666.66px",
            marginLeft: "20.20px"
        };
        this.oGetRTLStub.returns(true);
        this.oGetComputedStyleStub.returns(oStyle);

        // Act
        var oResult = this.oControl._getElementDimensions();

        // Assert
        assert.deepEqual(oResult, {
            width: 666.66,
            marginEnd: 20.20
        }, "The correct data has been returned.");
    });

    QUnit.test("Calls the function window.getComputedStyle and passes it the given element", function (assert) {
        // Arrange
        var oElement = {};

        // Act
        this.oControl._getElementDimensions(oElement);

        // Assert
        assert.strictEqual(this.oGetComputedStyleStub.callCount, 1, "The function window.getComputedStyle has been called once.");
        assert.strictEqual(this.oGetComputedStyleStub.firstCall.args[0], oElement, "The function window.getComputedStyle has been called with the correct parameter.");
    });
});
