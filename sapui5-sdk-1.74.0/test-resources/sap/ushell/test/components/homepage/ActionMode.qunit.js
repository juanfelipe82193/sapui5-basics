// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.homepage.ActionMode
 */
sap.ui.require([
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/homepage/ActionMode"
], function (JSONModel, ActionMode) {
    "use strict";

    /* global QUnit sinon */

    QUnit.module("sap.ushell.components.homepage.Component", {
        beforeEach: function () {
            this.oModel = new JSONModel({
                tileActionModeActive: false,
                topGroupInViewPortIndex: 0
            });
            this.oEventBusStub = sinon.stub(sap.ui.getCore().getEventBus(), "publish");
        },
        afterEach: function () {
            this.oEventBusStub.restore();
        }
    });

    QUnit.test("toggleActionMode when not in edit mode", function (assert) {
        // Arrange
        var fnActivationStub = sinon.stub(ActionMode, "_activate");

        // Act
        ActionMode.toggleActionMode(this.oModel);

        // Assert
        assert.ok(fnActivationStub.called, "_activate is called");
        assert.ok(this.oEventBusStub.called, "an Event was fired");
        assert.strictEqual(this.oEventBusStub.args[0][0], "launchpad", "1. paramter of Event was correct");
        assert.strictEqual(this.oEventBusStub.args[0][1], "scrollToGroup", "2. paramter of Event was correct");

        fnActivationStub.restore();
    });

    QUnit.test("toggleActionMode when in edit mode", function (assert) {
        // Arrange
        var fnDeactivationStub = sinon.stub(ActionMode, "_deactivate");
        this.oModel.oData.tileActionModeActive = true;

        // Act
        ActionMode.toggleActionMode(this.oModel);

        // Assert
        assert.ok(fnDeactivationStub.called, "_deactivate is called");
        assert.ok(this.oEventBusStub.called, "an Event was fired");
        assert.strictEqual(this.oEventBusStub.args[0][0], "launchpad", "1. paramter of Event was correct");
        assert.strictEqual(this.oEventBusStub.args[0][1], "scrollToGroup", "2. paramter of Event was correct");

        fnDeactivationStub.restore();
    });

});